from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import secrets
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'anitabrattengeier@gmail.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'AnitaBeauty2024')

# Create the main app
app = FastAPI(title="ANITA Art of Beauty API")

# Create routers
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=2000)

class ContactMessageResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryImageCreate(BaseModel):
    title: str
    category: str
    image_url: str

class ServiceItem(BaseModel):
    name: str
    duration: str
    price: str

class ServiceCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    title: str
    image: str
    items: List[ServiceItem]

class Promotion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    discount_percent: Optional[int] = None
    valid_until: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PromotionCreate(BaseModel):
    title: str
    description: str
    discount_percent: Optional[int] = None
    valid_until: Optional[str] = None
    active: bool = True

class AdminLogin(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    message: str

# ============ HELPER FUNCTIONS ============

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not correct_password:
        raise HTTPException(
            status_code=401,
            detail="Hibás jelszó",
            headers={"WWW-Authenticate": "Basic"},
        )
    return True

async def send_contact_email(contact: ContactMessage):
    """Send contact form email via Resend"""
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            Új üzenet az Anita Art of Beauty weboldalról
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Név:</td>
                <td style="padding: 10px 0; color: #555;">{contact.name}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Email:</td>
                <td style="padding: 10px 0; color: #555;">{contact.email}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Telefon:</td>
                <td style="padding: 10px 0; color: #555;">{contact.phone or 'Nincs megadva'}</td>
            </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f7f2; border-left: 3px solid #D4AF37;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Üzenet:</h3>
            <p style="margin: 0; color: #555; line-height: 1.6;">{contact.message}</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">
            Ez az üzenet az Anita Art of Beauty weboldal kapcsolatfelvételi űrlapjáról érkezett.
        </p>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [RECIPIENT_EMAIL],
        "subject": f"Új üzenet: {contact.name} - Anita Art of Beauty",
        "html": html_content,
        "reply_to": contact.email
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent successfully: {email.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "ANITA Art of Beauty API"}

# --- Status Routes ---
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# --- Contact Routes ---
@api_router.post("/contact", response_model=ContactMessageResponse)
async def create_contact_message(input: ContactMessageCreate):
    """Submit a contact form message and send email"""
    try:
        contact_obj = ContactMessage(**input.model_dump())
        doc = contact_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.contact_messages.insert_one(doc)
        
        # Send email notification
        email_sent = await send_contact_email(contact_obj)
        
        if email_sent:
            return ContactMessageResponse(
                success=True,
                message="Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.",
                id=contact_obj.id
            )
        else:
            return ContactMessageResponse(
                success=True,
                message="Üzenetét fogadtuk! Hamarosan felvesszük Önnel a kapcsolatot.",
                id=contact_obj.id
            )
    except Exception as e:
        logger.error(f"Error saving contact message: {e}")
        raise HTTPException(status_code=500, detail="Hiba történt az üzenet küldése során.")

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages (admin)"""
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    for msg in messages:
        if isinstance(msg['created_at'], str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

# --- Admin Routes ---
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login: AdminLogin):
    """Admin login with password"""
    if secrets.compare_digest(login.password, ADMIN_PASSWORD):
        return AdminLoginResponse(success=True, message="Sikeres bejelentkezés!")
    raise HTTPException(status_code=401, detail="Hibás jelszó")

# --- Gallery Routes ---
@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    """Get all gallery images"""
    images = await db.gallery_images.find({}, {"_id": 0}).to_list(1000)
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
    return images

@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate):
    """Add a new gallery image (admin)"""
    gallery_obj = GalleryImage(**image.model_dump())
    doc = gallery_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery_images.insert_one(doc)
    return gallery_obj

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str):
    """Delete a gallery image (admin)"""
    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kép nem található")
    return {"success": True, "message": "Kép törölve"}

# --- Services Routes (for admin editing) ---
@api_router.get("/services")
async def get_services():
    """Get all services from database or return default"""
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    if not services:
        return {"source": "default", "data": []}
    return {"source": "database", "data": services}

@api_router.put("/services/{category_key}")
async def update_service_category(category_key: str, category: ServiceCategory):
    """Update a service category (admin)"""
    doc = category.model_dump()
    await db.services.update_one(
        {"key": category_key},
        {"$set": doc},
        upsert=True
    )
    return {"success": True, "message": "Szolgáltatás frissítve"}

# --- Promotions Routes ---
@api_router.get("/promotions", response_model=List[Promotion])
async def get_promotions():
    """Get all active promotions"""
    promotions = await db.promotions.find({"active": True}, {"_id": 0}).to_list(100)
    for promo in promotions:
        if isinstance(promo.get('created_at'), str):
            promo['created_at'] = datetime.fromisoformat(promo['created_at'])
    return promotions

@api_router.get("/promotions/all", response_model=List[Promotion])
async def get_all_promotions():
    """Get all promotions (admin)"""
    promotions = await db.promotions.find({}, {"_id": 0}).to_list(100)
    for promo in promotions:
        if isinstance(promo.get('created_at'), str):
            promo['created_at'] = datetime.fromisoformat(promo['created_at'])
    return promotions

@api_router.post("/promotions", response_model=Promotion)
async def create_promotion(promo: PromotionCreate):
    """Create a new promotion (admin)"""
    promo_obj = Promotion(**promo.model_dump())
    doc = promo_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.promotions.insert_one(doc)
    return promo_obj

@api_router.put("/promotions/{promo_id}")
async def update_promotion(promo_id: str, promo: PromotionCreate):
    """Update a promotion (admin)"""
    result = await db.promotions.update_one(
        {"id": promo_id},
        {"$set": promo.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Akció nem található")
    return {"success": True, "message": "Akció frissítve"}

@api_router.delete("/promotions/{promo_id}")
async def delete_promotion(promo_id: str):
    """Delete a promotion (admin)"""
    result = await db.promotions.delete_one({"id": promo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Akció nem található")
    return {"success": True, "message": "Akció törölve"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
