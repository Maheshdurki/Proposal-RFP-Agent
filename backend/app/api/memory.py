from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.memory import MemoryRetainRequest, MemoryRecallRequest, MemoryRecallResponse, MemoryItem, MemoryStats
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/memory", tags=["memory"])

@router.post("/retain", response_model=MemoryItem)
def retain_memory(req: MemoryRetainRequest, db: Session = Depends(get_db)):
    return hindsight_service.retain_memory(req, db=db)

@router.post("/recall", response_model=MemoryRecallResponse)
def recall_memories(req: MemoryRecallRequest, db: Session = Depends(get_db)):
    return hindsight_service.recall_memories(
        query=req.query,
        industry=req.industry,
        client_name=req.client_name,
        requirements=req.requirements,
        top_k=req.top_k,
        db=db
    )

@router.get("/all", response_model=List[MemoryItem])
def get_all_memories(db: Session = Depends(get_db)):
    return hindsight_service.get_all_memories(db=db)

@router.get("/stats", response_model=MemoryStats)
def get_memory_stats(db: Session = Depends(get_db)):
    return hindsight_service.get_memory_stats(db=db)
