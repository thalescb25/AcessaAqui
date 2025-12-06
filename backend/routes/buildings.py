from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Building, BuildingCreate
from dependencies import get_current_user
from motor.motor_asyncio import AsyncIOMotorDatabase
import os

router = APIRouter(prefix="/buildings", tags=["buildings"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[Building])
async def get_buildings(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    buildings = await db.buildings.find({}, {"_id": 0}).to_list(1000)
    return buildings

@router.get("/{building_id}", response_model=Building)
async def get_building(
    building_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    building = await db.buildings.find_one({"id": building_id}, {"_id": 0})
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building

@router.post("", response_model=Building)
async def create_building(
    building_data: BuildingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') != 'super_admin':
        raise HTTPException(status_code=403, detail="Only super admin can create buildings")
    
    building_dict = building_data.dict()
    
    # Calculate monthly revenue based on plan
    plan_prices = {'start': 149, 'business': 249, 'corporate': 399}
    building_dict['monthlyRevenue'] = plan_prices.get(building_dict['plan'], 0)
    building_dict['currentSuites'] = 0
    building_dict['status'] = 'active'
    
    from models import Building
    building = Building(**building_dict)
    
    await db.buildings.insert_one(building.dict())
    return building

@router.put("/{building_id}", response_model=Building)
async def update_building(
    building_id: str,
    building_data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') not in ['super_admin', 'building_admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.buildings.update_one(
        {"id": building_id},
        {"$set": building_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Building not found")
    
    building = await db.buildings.find_one({"id": building_id}, {"_id": 0})
    return building

@router.delete("/{building_id}")
async def delete_building(
    building_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user.get('role') != 'super_admin':
        raise HTTPException(status_code=403, detail="Only super admin can delete buildings")
    
    result = await db.buildings.delete_one({"id": building_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Building not found")
    
    return {"success": True, "message": "Building deleted"}
