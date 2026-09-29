from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MemoryRetainRequest(BaseModel):
    title: str
    content: str
    memory_type: str = Field(..., description="historical_proposal, client_preference, win_pattern, loss_pattern, feedback")
    industry: Optional[str] = None
    proposal_id: Optional[str] = None
    outcome: Optional[str] = None # WON, LOST, PREFERENCE
    tags: List[str] = []
    metadata: Dict[str, Any] = {}

class MemoryRecallRequest(BaseModel):
    query: str
    industry: Optional[str] = None
    client_name: Optional[str] = None
    requirements: List[str] = []
    top_k: int = 10

class MemoryItem(BaseModel):
    id: str
    title: str
    content: str
    memory_type: str
    industry: Optional[str] = None
    proposal_id: Optional[str] = None
    outcome: Optional[str] = None
    relevance_score: float = 0.95
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
    created_at: Optional[str] = None

class MemoryRecallResponse(BaseModel):
    query: str
    total_memories_found: int
    winning_patterns: List[str]
    loss_patterns: List[str]
    client_preferences: List[str]
    historical_references: List[MemoryItem]
    raw_memories: List[MemoryItem]

class MemoryStats(BaseModel):
    total_memories: int
    historical_proposals: int
    client_preferences: int
    win_patterns: int
    loss_patterns: int
    feedback: int
    industries_covered: List[str]
