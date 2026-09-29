import json
import logging
import uuid
import httpx
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app.config import settings
from app.models.memory import MemoryItem, MemoryRetainRequest, MemoryRecallResponse, MemoryStats
from app.database import LocalMemoryRecord, SessionLocal

logger = logging.getLogger("proposal_agent.hindsight")
logger.setLevel(logging.INFO)

class HindsightService:
    def __init__(self):
        self.base_url = settings.HINDSIGHT_BASE_URL.rstrip('/')
        self.api_key = settings.HINDSIGHT_API_KEY
        self.bank_id = settings.HINDSIGHT_BANK_ID

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
            headers["X-API-Key"] = self.api_key
        return headers

    def ensure_bank(self) -> bool:
        """Ensure the Hindsight memory bank exists."""
        if not self.api_key:
            logger.info("No HINDSIGHT_API_KEY set; using local Hindsight memory persistence layer.")
            return True

        try:
            url = f"{self.base_url}/v1/banks/{self.bank_id}"
            with httpx.Client(timeout=10.0) as client:
                res = client.get(url, headers=self._get_headers())
                if res.status_code in (200, 201):
                    logger.info(f"Hindsight bank '{self.bank_id}' verified.")
                    return True
                elif res.status_code == 404:
                    # Create bank
                    create_res = client.post(
                        f"{self.base_url}/v1/banks", 
                        headers=self._get_headers(),
                        json={"bank_id": self.bank_id, "name": "Proposal RFP Agent Bank"}
                    )
                    return create_res.status_code in (200, 201)
        except Exception as e:
            logger.warning(f"Error ensuring Hindsight bank via API ({e}). Falling back to local storage.")
        return True

    def retain_memory(self, memory: MemoryRetainRequest, db: Optional[Session] = None) -> MemoryItem:
        """Store a memory in Hindsight persistent memory layer."""
        mem_id = f"mem-{uuid.uuid4().hex[:8]}"
        created_at_str = datetime.utcnow().isoformat()
        
        # 1. Attempt API Retain if API Key is configured
        if self.api_key:
            try:
                url = f"{self.base_url}/v1/banks/{self.bank_id}/memories"
                payload = {
                    "memory_id": mem_id,
                    "title": memory.title,
                    "content": memory.content,
                    "tags": memory.tags,
                    "metadata": {
                        "memory_type": memory.memory_type,
                        "industry": memory.industry,
                        "proposal_id": memory.proposal_id,
                        "outcome": memory.outcome,
                        **memory.metadata
                    }
                }
                with httpx.Client(timeout=10.0) as client:
                    res = client.post(url, headers=self._get_headers(), json=payload)
                    if res.status_code in (200, 201):
                        logger.info(f"Retained memory in remote Hindsight: {memory.title}")
            except Exception as e:
                logger.warning(f"Failed remote Hindsight retain ({e}); persisting locally.")

        # 2. Always persist locally in SQLite so local queries remain lightning fast & offline capable
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            record = LocalMemoryRecord(
                id=mem_id,
                memory_type=memory.memory_type,
                industry=memory.industry or "General",
                proposal_id=memory.proposal_id,
                outcome=memory.outcome,
                title=memory.title,
                content=memory.content,
                tags_json=json.dumps(memory.tags),
                metadata_json=json.dumps(memory.metadata),
                created_at=datetime.utcnow()
            )
            db.add(record)
            db.commit()
            db.refresh(record)

            item = MemoryItem(
                id=record.id,
                title=record.title,
                content=record.content,
                memory_type=record.memory_type,
                industry=record.industry,
                proposal_id=record.proposal_id,
                outcome=record.outcome,
                relevance_score=1.0,
                tags=json.loads(record.tags_json),
                metadata=json.loads(record.metadata_json),
                created_at=created_at_str
            )
            return item
        finally:
            if close_db:
                db.close()

    def recall_memories(
        self, 
        query: str, 
        industry: Optional[str] = None, 
        client_name: Optional[str] = None,
        requirements: List[str] = None,
        top_k: int = 10,
        db: Optional[Session] = None
    ) -> MemoryRecallResponse:
        """Query Hindsight for relevant memories (winning patterns, loss patterns, client preferences, past proposals)."""
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            records = db.query(LocalMemoryRecord).all()
            
            items: List[MemoryItem] = []
            query_lower = query.lower()
            industry_lower = (industry or "").lower()
            req_words = [r.lower() for r in (requirements or [])]

            for rec in records:
                score = 0.5 # base score
                
                # Industry match booster
                if industry_lower and rec.industry and rec.industry.lower() == industry_lower:
                    score += 0.35
                
                # Content keyword match booster
                rec_text = f"{rec.title} {rec.content} {rec.tags_json}".lower()
                for q_term in query_lower.split():
                    if len(q_term) > 3 and q_term in rec_text:
                        score += 0.08

                # Requirement matching
                for req in req_words:
                    for req_token in req.split():
                        if len(req_token) > 4 and req_token in rec_text:
                            score += 0.05

                # Client name matching
                if client_name and client_name.lower() in rec_text:
                    score += 0.2

                score = min(0.99, max(0.40, round(score, 2)))

                item = MemoryItem(
                    id=rec.id,
                    title=rec.title,
                    content=rec.content,
                    memory_type=rec.memory_type,
                    industry=rec.industry,
                    proposal_id=rec.proposal_id,
                    outcome=rec.outcome,
                    relevance_score=score,
                    tags=json.loads(rec.tags_json),
                    metadata=json.loads(rec.metadata_json),
                    created_at=rec.created_at.isoformat() if rec.created_at else None
                )
                items.append(item)

            # Sort by relevance score
            items.sort(key=lambda x: x.relevance_score, reverse=True)
            top_items = items[:top_k]

            # Categorize into patterns
            winning_patterns = []
            loss_patterns = []
            client_preferences = []
            historical_references = []

            for item in top_items:
                if item.memory_type == "win_pattern" or (item.outcome == "WON" and item.memory_type == "historical_proposal"):
                    winning_patterns.append(item.title + ": " + item.content[:140])
                if item.memory_type == "loss_pattern" or (item.outcome == "LOST" and item.memory_type == "historical_proposal"):
                    loss_patterns.append(item.title + ": " + item.content[:140])
                if item.memory_type == "client_preference":
                    client_preferences.append(item.title + ": " + item.content[:140])
                if item.memory_type == "historical_proposal":
                    historical_references.append(item)

            # Fallback patterns if minimal data found
            if not winning_patterns:
                winning_patterns = ["Security addressed early in executive summary", "Quantified implementation outcomes", "Requirement mapping matrix provided"]
            if not loss_patterns:
                loss_patterns = ["Generic AI marketing hype", "Vague implementation timeline", "Missing compliance certifications"]
            if not client_preferences:
                client_preferences = ["Formal and concise tone", "Security-first architecture", "Clear SLA guarantees"]

            return MemoryRecallResponse(
                query=query,
                total_memories_found=len(top_items),
                winning_patterns=winning_patterns[:5],
                loss_patterns=loss_patterns[:5],
                client_preferences=client_preferences[:5],
                historical_references=historical_references[:5],
                raw_memories=top_items
            )
        finally:
            if close_db:
                db.close()

    def get_all_memories(self, db: Optional[Session] = None) -> List[MemoryItem]:
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            records = db.query(LocalMemoryRecord).order_by(LocalMemoryRecord.created_at.desc()).all()
            return [
                MemoryItem(
                    id=rec.id,
                    title=rec.title,
                    content=rec.content,
                    memory_type=rec.memory_type,
                    industry=rec.industry,
                    proposal_id=rec.proposal_id,
                    outcome=rec.outcome,
                    relevance_score=1.0,
                    tags=json.loads(rec.tags_json),
                    metadata=json.loads(rec.metadata_json),
                    created_at=rec.created_at.isoformat() if rec.created_at else None
                )
                for rec in records
            ]
        finally:
            if close_db:
                db.close()

    def get_memory_stats(self, db: Optional[Session] = None) -> MemoryStats:
        memories = self.get_all_memories(db)
        industries = list(set([m.industry for m in memories if m.industry]))
        return MemoryStats(
            total_memories=len(memories),
            historical_proposals=sum(1 for m in memories if m.memory_type == "historical_proposal"),
            client_preferences=sum(1 for m in memories if m.memory_type == "client_preference"),
            win_patterns=sum(1 for m in memories if m.memory_type == "win_pattern"),
            loss_patterns=sum(1 for m in memories if m.memory_type == "loss_pattern"),
            feedback=sum(1 for m in memories if m.memory_type == "feedback"),
            industries_covered=industries
        )

hindsight_service = HindsightService()
