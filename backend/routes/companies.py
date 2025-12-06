from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Company, CompanyCreate
from dependencies import get_current_user
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import uuid

router = APIRouter(prefix="/companies", tags=["companies"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[Company])
async def get_companies(
    building_id: str = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {}
    if building_id:
        query['buildingId'] = building_id
    
    companies = await db.companies.find(query, {"_id": 0}).to_list(1000)
    return companies

@router.get("/{company_id}", response_model=Company)
async def get_company(
    company_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    company = await db.companies.find_one({"id": company_id}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.post("", response_model=Company)
async def create_company(
    company_data: CompanyCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') not in ['super_admin', 'building_admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    company_dict = company_data.dict()
    company_dict['id'] = str(uuid.uuid4())
    company_dict['status'] = 'active'
    company_dict['receptionists'] = []
    company_dict['phone'] = company_dict.get('phone', '')
    company_dict['cnpj'] = company_dict.get('cnpj', '')
    company_dict['createdAt'] = datetime.utcnow()
    company_dict['updatedAt'] = datetime.utcnow()
    
    await db.companies.insert_one(company_dict)
    return company_dict

@router.put("/{company_id}", response_model=Company)
async def update_company(
    company_id: str,
    company_data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') not in ['super_admin', 'building_admin', 'company_receptionist']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    company_data['updatedAt'] = datetime.utcnow()
    
    result = await db.companies.update_one(
        {"id": company_id},
        {"$set": company_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company = await db.companies.find_one({"id": company_id}, {"_id": 0})
    return company

@router.delete("/{company_id}")
async def delete_company(
    company_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') not in ['super_admin', 'building_admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.companies.delete_one({"id": company_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return {"success": True, "message": "Company deleted"}
