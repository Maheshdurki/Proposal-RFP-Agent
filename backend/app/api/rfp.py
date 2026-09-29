import uuid
import json
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, RFPRecord
from app.models.rfp import RFPAnalysis, RFPDetail
from app.services.pdf_service import pdf_service
from app.services.rfp_analyzer import rfp_analyzer

router = APIRouter(prefix="/rfps", tags=["rfps"])

@router.post("/upload", response_model=RFPDetail)
async def upload_rfp(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files (.pdf) are supported.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        raw_text, pages = pdf_service.extract_text(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"PDF extraction error: {str(e)}")

    analysis = rfp_analyzer.analyze(raw_text, file.filename)

    rfp_id = f"rfp-{uuid.uuid4().hex[:8]}"
    record = RFPRecord(
        id=rfp_id,
        filename=file.filename,
        raw_text=raw_text,
        client_name=analysis.client_name,
        industry=analysis.industry,
        title=analysis.title,
        analysis_json=json.dumps(analysis.model_dump())
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return RFPDetail(
        id=record.id,
        filename=record.filename,
        raw_text=record.raw_text,
        client_name=record.client_name,
        industry=record.industry,
        title=record.title,
        analysis=analysis,
        created_at=record.created_at
    )

@router.get("", response_model=List[RFPDetail])
def list_rfps(db: Session = Depends(get_db)):
    records = db.query(RFPRecord).order_by(RFPRecord.created_at.desc()).all()
    res = []
    for r in records:
        analysis_dict = json.loads(r.analysis_json)
        res.append(RFPDetail(
            id=r.id,
            filename=r.filename,
            raw_text=r.raw_text,
            client_name=r.client_name,
            industry=r.industry,
            title=r.title,
            analysis=RFPAnalysis(**analysis_dict),
            created_at=r.created_at
        ))
    return res

@router.get("/{rfp_id}", response_model=RFPDetail)
def get_rfp(rfp_id: str, db: Session = Depends(get_db)):
    record = db.query(RFPRecord).filter(RFPRecord.id == rfp_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="RFP not found")

    analysis_dict = json.loads(record.analysis_json)
    return RFPDetail(
        id=record.id,
        filename=record.filename,
        raw_text=record.raw_text,
        client_name=record.client_name,
        industry=record.industry,
        title=record.title,
        analysis=RFPAnalysis(**analysis_dict),
        created_at=record.created_at
    )

@router.post("/{rfp_id}/analyze", response_model=RFPAnalysis)
def analyze_rfp(rfp_id: str, db: Session = Depends(get_db)):
    record = db.query(RFPRecord).filter(RFPRecord.id == rfp_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="RFP not found")

    analysis = rfp_analyzer.analyze(record.raw_text, record.filename)
    record.analysis_json = json.dumps(analysis.model_dump())
    db.commit()
    return analysis
