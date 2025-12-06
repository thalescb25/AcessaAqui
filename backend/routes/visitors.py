from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Visitor, VisitorCreate
from dependencies import get_current_user
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import uuid

router = APIRouter(prefix="/visitors", tags=["visitors"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[Visitor])
async def get_visitors(
    building_id: str = None,
    company_id: str = None,
    status: str = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {}
    if building_id:
        query['buildingId'] = building_id
    if company_id:
        query['companyId'] = company_id
    if status:
        query['status'] = status
    
    visitors = await db.visitors.find(query, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return visitors

@router.get("/{visitor_id}", response_model=Visitor)
async def get_visitor(
    visitor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    visitor = await db.visitors.find_one({"id": visitor_id}, {"_id": 0})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return visitor

@router.post("", response_model=Visitor)
async def create_visitor(
    visitor_data: VisitorCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    visitor_dict = visitor_data.dict()
    visitor_dict['id'] = str(uuid.uuid4())
    visitor_dict['status'] = 'pending'
    visitor_dict['checkInTime'] = None
    visitor_dict['checkOutTime'] = None
    visitor_dict['notes'] = ''
    visitor_dict['email'] = visitor_dict.get('email', '')
    visitor_dict['phone'] = visitor_dict.get('phone', '')
    visitor_dict['serviceProvider'] = visitor_dict.get('serviceProvider', False)
    visitor_dict['companionsDetails'] = visitor_dict.get('companionsDetails', [])
    visitor_dict['createdAt'] = datetime.utcnow()
    visitor_dict['updatedAt'] = datetime.utcnow()
    
    await db.visitors.insert_one(visitor_dict)
    return visitor_dict

@router.put("/{visitor_id}", response_model=Visitor)
async def update_visitor(
    visitor_id: str,
    visitor_data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    visitor_data['updatedAt'] = datetime.utcnow()
    
    result = await db.visitors.update_one(
        {"id": visitor_id},
        {"$set": visitor_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    visitor = await db.visitors.find_one({"id": visitor_id}, {"_id": 0})
    return visitor

@router.delete("/{visitor_id}")
async def delete_visitor(
    visitor_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await db.visitors.delete_one({"id": visitor_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"success": True, "message": "Visitor deleted"}
