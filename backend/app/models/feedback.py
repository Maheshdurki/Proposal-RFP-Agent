from pydantic import BaseModel
from typing import List, Optional

class ProposalFeedbackRequest(BaseModel):
    outcome: str # WON, LOST, PENDING
    reasons: List[str] = [] # What worked or Why lost
    client_feedback: Optional[str] = None
    learnings: Optional[str] = None
