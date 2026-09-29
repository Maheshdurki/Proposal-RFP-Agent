from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.feedback import ProposalFeedbackRequest
from app.services.feedback_service import feedback_service

router = APIRouter(prefix="/proposals", tags=["feedback"])

@router.post("/{proposal_id}/feedback")
def submit_feedback(proposal_id: str, req: ProposalFeedbackRequest, db: Session = Depends(get_db)):
    success = feedback_service.process_feedback(proposal_id, req, db=db)
    if not success:
        raise HTTPException(status_code=400, detail="Could not process feedback for proposal.")
    return {
        "status": "success",
        "message": f"Proposal outcome '{req.outcome}' recorded and retained in Hindsight persistent memory.",
        "proposal_id": proposal_id
    }
