import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.seed_memory import seed_hindsight_memory
from app.api import health, memory, rfp, proposals, feedback, export, dashboard, demo

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("proposal_agent")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Proposal & RFP Intelligence Agent Backend...")
    init_db()
    try:
        seed_hindsight_memory()
    except Exception as e:
        logger.warning(f"Error during initial memory seeding: {e}")
    yield
    logger.info("Shutting down Proposal & RFP Agent Backend.")

app = FastAPI(
    title="Proposal & RFP Intelligence Agent API",
    description="AI-powered proposal assistant using Hindsight persistent memory to analyze RFPs and generate tailored proposals.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(rfp.router, prefix="/api")
app.include_router(proposals.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(demo.router, prefix="/api")

@app.get("/")
def root():
    return {
        "app": "Proposal & RFP Intelligence Agent",
        "hindsight_bank": settings.HINDSIGHT_BANK_ID,
        "docs_url": "/docs"
    }
