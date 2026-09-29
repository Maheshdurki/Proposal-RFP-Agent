from fastapi import APIRouter
from app.config import settings
from app.services.hindsight_service import hindsight_service

router = APIRouter()

@router.get("/health")
def get_health():
    hindsight_ok = hindsight_service.ensure_bank()
    return {
        "status": "healthy",
        "service": "Proposal & RFP Intelligence Agent",
        "hindsight_bank": settings.HINDSIGHT_BANK_ID,
        "hindsight_connected": hindsight_ok,
        "groq_model": settings.GROQ_MODEL,
        "database": settings.DATABASE_URL.split(":///")[0]
    }
