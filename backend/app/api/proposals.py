import uuid
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, ProposalRecord, RFPRecord
from app.models.rfp import RFPAnalysis
from app.models.proposal import (
    ProposalPlanRequest, ProposalGenerateRequest, ProposalStrategy, 
    ProposalContent, ComplianceReport, ProposalDetail
)
from app.services.proposal_planner import proposal_planner
from app.services.proposal_generator import proposal_generator
from app.services.compliance_service import compliance_service

router = APIRouter(prefix="/proposals", tags=["proposals"])

@router.post("/plan", response_model=ProposalStrategy)
def plan_proposal(req: ProposalPlanRequest, db: Session = Depends(get_db)):
    rfp_rec = db.query(RFPRecord).filter(RFPRecord.id == req.rfp_id).first()
    if not rfp_rec:
        raise HTTPException(status_code=404, detail="RFP record not found")

    rfp_analysis = RFPAnalysis(**json.loads(rfp_rec.analysis_json))
    strategy = proposal_planner.plan_strategy(rfp_analysis, with_memory=req.with_memory, db=db)
    return strategy

@router.post("/generate", response_model=ProposalDetail)
def generate_proposal(req: ProposalGenerateRequest, db: Session = Depends(get_db)):
    rfp_rec = db.query(RFPRecord).filter(RFPRecord.id == req.rfp_id).first()
    if not rfp_rec:
        raise HTTPException(status_code=404, detail="RFP record not found")

    rfp_analysis = RFPAnalysis(**json.loads(rfp_rec.analysis_json))
    
    # 1. Strategy Plan
    if req.strategy_override:
        strategy = req.strategy_override
    else:
        strategy = proposal_planner.plan_strategy(rfp_analysis, with_memory=req.with_memory, db=db)

    # 2. Content Generation
    content = proposal_generator.generate_proposal(rfp_analysis, strategy, with_memory=req.with_memory)

    # 3. Compliance Check
    compliance = compliance_service.check_compliance(rfp_analysis, content, with_memory=req.with_memory)

    prop_id = f"prop-{uuid.uuid4().hex[:8]}"
    prop_rec = ProposalRecord(
        id=prop_id,
        rfp_id=req.rfp_id,
        title=content.title,
        status="DRAFT",
        strategy_json=json.dumps(strategy.model_dump()),
        content_json=json.dumps(content.model_dump()),
        compliance_json=json.dumps(compliance.model_dump()),
        with_memory=1 if req.with_memory else 0
    )
    db.add(prop_rec)
    db.commit()
    db.refresh(prop_rec)

    return ProposalDetail(
        id=prop_rec.id,
        rfp_id=prop_rec.rfp_id,
        title=prop_rec.title,
        status=prop_rec.status,
        with_memory=bool(prop_rec.with_memory),
        strategy=strategy,
        content=content,
        compliance=compliance,
        created_at=prop_rec.created_at,
        updated_at=prop_rec.updated_at
    )

@router.get("", response_model=List[ProposalDetail])
def list_proposals(db: Session = Depends(get_db)):
    records = db.query(ProposalRecord).order_by(ProposalRecord.created_at.desc()).all()
    res = []
    for r in records:
        strat = ProposalStrategy(**json.loads(r.strategy_json))
        cont = ProposalContent(**json.loads(r.content_json))
        comp = ComplianceReport(**json.loads(r.compliance_json)) if r.compliance_json else None
        reasons = json.loads(r.win_loss_reasons) if r.win_loss_reasons else None
        
        res.append(ProposalDetail(
            id=r.id,
            rfp_id=r.rfp_id,
            title=r.title,
            status=r.status,
            with_memory=bool(r.with_memory),
            strategy=strat,
            content=cont,
            compliance=comp,
            feedback_text=r.feedback_text,
            win_loss_reasons=reasons,
            created_at=r.created_at,
            updated_at=r.updated_at
        ))
    return res

@router.get("/{proposal_id}", response_model=ProposalDetail)
def get_proposal(proposal_id: str, db: Session = Depends(get_db)):
    r = db.query(ProposalRecord).filter(ProposalRecord.id == proposal_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Proposal not found")

    strat = ProposalStrategy(**json.loads(r.strategy_json))
    cont = ProposalContent(**json.loads(r.content_json))
    comp = ComplianceReport(**json.loads(r.compliance_json)) if r.compliance_json else None
    reasons = json.loads(r.win_loss_reasons) if r.win_loss_reasons else None

    return ProposalDetail(
        id=r.id,
        rfp_id=r.rfp_id,
        title=r.title,
        status=r.status,
        with_memory=bool(r.with_memory),
        strategy=strat,
        content=cont,
        compliance=comp,
        feedback_text=r.feedback_text,
        win_loss_reasons=reasons,
        created_at=r.created_at,
        updated_at=r.updated_at
    )

@router.post("/{proposal_id}/review", response_model=ComplianceReport)
def review_proposal(proposal_id: str, db: Session = Depends(get_db)):
    r = db.query(ProposalRecord).filter(ProposalRecord.id == proposal_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Proposal not found")

    rfp_rec = db.query(RFPRecord).filter(RFPRecord.id == r.rfp_id).first()
    rfp_analysis = RFPAnalysis(**json.loads(rfp_rec.analysis_json))
    content = ProposalContent(**json.loads(r.content_json))

    compliance = compliance_service.check_compliance(rfp_analysis, content, with_memory=bool(r.with_memory))
    r.compliance_json = json.dumps(compliance.model_dump())
    db.commit()
    return compliance
