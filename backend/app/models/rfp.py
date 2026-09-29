from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RFPAnalysis(BaseModel):
    title: str
    client_name: Optional[str] = "Not specified"
    industry: Optional[str] = "Not specified"
    project_summary: str
    mandatory_requirements: List[str] = []
    optional_requirements: List[str] = []
    deliverables: List[str] = []
    technical_requirements: List[str] = []
    compliance_requirements: List[str] = []
    evaluation_criteria: List[str] = []
    deadlines: List[str] = []
    budget_information: Optional[str] = "Not specified"
    implementation_requirements: List[str] = []
    support_requirements: List[str] = []
    risks: List[str] = []
    ambiguities: List[str] = []
    keywords: List[str] = []

class RFPDetail(BaseModel):
    id: str
    filename: str
    raw_text: str
    client_name: Optional[str]
    industry: Optional[str]
    title: str
    analysis: RFPAnalysis
    created_at: datetime
