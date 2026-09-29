import json
import logging
from typing import Optional
from sqlalchemy.orm import Session

from app.database import ProposalRecord, SessionLocal
from app.models.feedback import ProposalFeedbackRequest
from app.models.memory import MemoryRetainRequest
from app.services.hindsight_service import hindsight_service

logger = logging.getLogger("proposal_agent.feedback")

class FeedbackService:
    def process_feedback(
        self, 
        proposal_id: str, 
        feedback: ProposalFeedbackRequest, 
        db: Optional[Session] = None
    ) -> bool:
        """Process win/loss outcome feedback and retain learned patterns in Hindsight memory bank."""
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            prop = db.query(ProposalRecord).filter(ProposalRecord.id == proposal_id).first()
            if not prop:
                logger.error(f"Proposal ID {proposal_id} not found.")
                return False

            # Update proposal record in DB
            prop.status = feedback.outcome
            prop.feedback_text = feedback.client_feedback
            prop.win_loss_reasons = json.dumps(feedback.reasons)
            db.commit()

            # Parse strategy and content metadata
            strat_data = json.loads(prop.strategy_json)
            content_data = json.loads(prop.content_json)
            industry = content_data.get("industry", "General")
            client_name = content_data.get("client_name", "Client")

            # Create Hindsight memory retain payload
            reasons_str = ", ".join(feedback.reasons)
            client_txt = feedback.client_feedback or "No direct text provided."
            learnings_txt = feedback.learnings or f"Key drivers: {reasons_str}"

            if feedback.outcome.upper() == "WON":
                mem_type = "win_pattern"
                title = f"WIN PATTERN: {prop.title} ({industry})"
                content_str = (
                    f"PROPOSAL OUTCOME: WON\n"
                    f"Proposal: {prop.title}\n"
                    f"Client: {client_name} | Industry: {industry}\n"
                    f"Successful Factors: {reasons_str}\n"
                    f"Client Feedback: {client_txt}\n"
                    f"Learned Rule: For {industry} proposals, highlighting {reasons_str} creates strong client alignment."
                )
            else:
                mem_type = "loss_pattern"
                title = f"LOSS PATTERN: {prop.title} ({industry})"
                content_str = (
                    f"PROPOSAL OUTCOME: LOST\n"
                    f"Proposal: {prop.title}\n"
                    f"Client: {client_name} | Industry: {industry}\n"
                    f"Failure Reasons: {reasons_str}\n"
                    f"Client Feedback: {client_txt}\n"
                    f"Learned Lesson: Future {industry} proposals must avoid {reasons_str} and provide deeper implementation evidence."
                )

            mem_req = MemoryRetainRequest(
                title=title,
                content=content_str,
                memory_type=mem_type,
                industry=industry,
                proposal_id=proposal_id,
                outcome=feedback.outcome.upper(),
                tags=[industry, feedback.outcome.upper(), "learning_loop"],
                metadata={
                    "reasons": feedback.reasons,
                    "client_feedback": feedback.client_feedback,
                    "learnings": feedback.learnings
                }
            )

            hindsight_service.retain_memory(mem_req, db=db)
            logger.info(f"Successfully retained proposal outcome memory in Hindsight for proposal {proposal_id}")
            return True
        finally:
            if close_db:
                db.close()

feedback_service = FeedbackService()
