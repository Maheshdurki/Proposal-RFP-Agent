import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db, RFPRecord, ProposalRecord
from app.services.hindsight_service import hindsight_service

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_rfps = db.query(RFPRecord).count()
    proposals = db.query(ProposalRecord).all()
    
    total_proposals = len(proposals)
    won = sum(1 for p in proposals if p.status == "WON")
    lost = sum(1 for p in proposals if p.status == "LOST")
    pending = sum(1 for p in proposals if p.status in ("PENDING", "DRAFT", "APPROVED"))

    mem_stats = hindsight_service.get_memory_stats(db=db)

    recent_proposals = []
    for p in sorted(proposals, key=lambda x: x.created_at, reverse=True)[:5]:
        content_dict = json.loads(p.content_json)
        recent_proposals.append({
            "id": p.id,
            "title": p.title,
            "client_name": content_dict.get("client_name", "Client"),
            "industry": content_dict.get("industry", "General"),
            "status": p.status,
            "with_memory": bool(p.with_memory),
            "created_at": p.created_at.isoformat()
        })

    return {
        "kpis": {
            "total_rfps": total_rfps,
            "proposals_generated": total_proposals,
            "won": won,
            "lost": lost,
            "pending": pending
        },
        "memory": {
            "total_memories": mem_stats.total_memories,
            "winning_patterns": mem_stats.win_patterns,
            "client_preferences": mem_stats.client_preferences,
            "loss_patterns": mem_stats.loss_patterns,
            "historical_proposals": mem_stats.historical_proposals
        },
        "recent_proposals": recent_proposals
    }
