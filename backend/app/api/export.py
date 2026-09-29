import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db, ProposalRecord
from app.models.proposal import ProposalContent
from app.services.export_service import export_service

router = APIRouter(prefix="/proposals", tags=["export"])

@router.get("/{proposal_id}/export/docx")
def export_docx(proposal_id: str, db: Session = Depends(get_db)):
    r = db.query(ProposalRecord).filter(ProposalRecord.id == proposal_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Proposal not found")

    content = ProposalContent(**json.loads(r.content_json))
    docx_bytes = export_service.export_docx(content)

    filename = f"{r.id}_Customer_Proposal.docx"
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/{proposal_id}/export/pdf")
def export_pdf(proposal_id: str, db: Session = Depends(get_db)):
    r = db.query(ProposalRecord).filter(ProposalRecord.id == proposal_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Proposal not found")

    content = ProposalContent(**json.loads(r.content_json))
    pdf_bytes = export_service.export_pdf(content)

    filename = f"{r.id}_Customer_Proposal.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
