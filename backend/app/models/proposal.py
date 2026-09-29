from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProposalStrategy(BaseModel):
    tone: str = "formal and concise"
    priority_sections: List[str] = []
    winning_patterns_to_use: List[str] = []
    patterns_to_avoid: List[str] = []
    key_selling_points: List[str] = []
    requirement_mapping_strategy: Dict[str, str] = {}
    hindsight_memory_influence_summary: str = ""

class ProposalPlanRequest(BaseModel):
    rfp_id: str
    with_memory: bool = True

class ProposalGenerateRequest(BaseModel):
    rfp_id: str
    with_memory: bool = True
    custom_instructions: Optional[str] = None
    strategy_override: Optional[ProposalStrategy] = None

class ProposalSection(BaseModel):
    section_id: str
    title: str
    content: str
    traceable_requirements: List[str] = []
    internal_memory_notes: Optional[str] = None  # AI meta insights (NEVER exported to customer docx/pdf)

class ProposalContent(BaseModel):
    title: str
    client_name: str
    industry: str
    sections: List[ProposalSection]
    requirement_matrix: List[Dict[str, str]]  # Requirement | Proposal Section | Evidence / Memory | Status

class ComplianceReport(BaseModel):
    overall_score: int
    requirements_covered: int
    requirements_total: int
    missing_requirements: List[str] = []
    unsupported_claims: List[str] = []
    warnings: List[str] = []
    evidence_coverage_score: int
    compliance_score: int
    memory_relevance_score: int
    human_review_items: List[str] = []

class ProposalDetail(BaseModel):
    id: str
    rfp_id: str
    title: str
    status: str  # DRAFT, APPROVED, WON, LOST, PENDING
    with_memory: bool
    strategy: ProposalStrategy
    content: ProposalContent
    compliance: Optional[ComplianceReport] = None
    feedback_text: Optional[str] = None
    win_loss_reasons: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
