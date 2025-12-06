import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from auth import get_password_hash
from models import UserInDB

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if users already exist
    user_count = await db.users.count_documents({})
    
    if user_count > 0:
        print("Database already seeded. Skipping...")
        client.close()
        return
    
    # Seed Plans
    plans = [
        {"id": "start", "name": "Start", "minSuites": 1, "maxSuites": 20, "monthlyPrice": 149, "active": True, "description": "Ideal para prédios pequenos"},
        {"id": "business", "name": "Business", "minSuites": 21, "maxSuites": 50, "monthlyPrice": 249, "active": True, "description": "Para prédios de médio porte"},
        {"id": "corporate", "name": "Corporate", "minSuites": 51, "maxSuites": 100, "monthlyPrice": 399, "active": True, "description": "Para grandes empreendimentos"}
    ]
    await db.plans.insert_many(plans)
    
    # Seed Buildings
    buildings = [{
        "id": "1",
        "name": "Edifício Empresarial Central",
        "address": "Av. Paulista, 1000",
        "city": "São Paulo",
        "state": "SP",
        "plan": "business",
        "maxSuites": 50,
        "currentSuites": 3,
        "status": "active",
        "documentRequired": True,
        "selfieRequired": False,
        "defaultLanguage": "pt",
        "monthlyRevenue": 249,
        "adminEmail": "admin@empresarial-central.com.br"
    }]
    await db.buildings.insert_many(buildings)
    
    # Seed Companies
    companies = [
        {"id": "1", "buildingId": "1", "name": "Tech Solutions Ltda", "suite": "501", "phone": "(11) 3333-4444", "cnpj": "12.345.678/0001-90", "status": "active", "receptionists": ["rec1"]},
        {"id": "2", "buildingId": "1", "name": "Marketing Pro", "suite": "502", "phone": "(11) 3333-5555", "cnpj": "98.765.432/0001-10", "status": "active", "receptionists": []},
        {"id": "3", "buildingId": "1", "name": "Consultoria ABC", "suite": "503", "phone": "(11) 3333-6666", "cnpj": "11.222.333/0001-44", "status": "active", "receptionists": []}
    ]
    await db.companies.insert_many(companies)
    
    # Seed Users
    users = [
        {"id": "super1", "email": "super@acessaaqui.com.br", "password": get_password_hash("super123"), "name": "Super Admin", "role": "super_admin"},
        {"id": "admin1", "email": "admin@empresarial-central.com.br", "password": get_password_hash("admin123"), "name": "Carlos Silva", "role": "building_admin", "buildingId": "1"},
        {"id": "portaria1", "email": "portaria@empresarial-central.com.br", "password": get_password_hash("portaria123"), "name": "João Porteiro", "role": "front_desk", "buildingId": "1"},
        {"id": "rec1", "email": "recepcao@techsolutions.com.br", "password": get_password_hash("recepcao123"), "name": "Maria Recepcionista", "role": "company_receptionist", "buildingId": "1", "companyId": "1"}
    ]
    await db.users.insert_many(users)
    
    # Seed System Settings
    settings = {
        "supportEmail": "neuraone.ai@gmail.com",
        "brandName": "AcessaAqui",
        "brandSlogan": "Acesso rápido, seguro e digital. Aqui.",
        "lgpdText": "Ao prosseguir, você concorda com o uso dos seus dados exclusivamente para controle de acesso ao prédio, conforme a LGPD. Solicite exclusão pelo e-mail: neuraone.ai@gmail.com",
        "emailTemplates": {
            "visitorArrival": {
                "subject": "Chegada do visitante [visitorName] - AcessaAqui",
                "body": "[visitorName] chegou para uma visita com [hostName] e aguarda autorização."
            }
        }
    }
    await db.settings.insert_one(settings)
    
    print("✅ Database seeded successfully!")
    print("Super Admin: super@acessaaqui.com.br / super123")
    print("Building Admin: admin@empresarial-central.com.br / admin123")
    print("Front Desk: portaria@empresarial-central.com.br / portaria123")
    print("Receptionist: recepcao@techsolutions.com.br / recepcao123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
