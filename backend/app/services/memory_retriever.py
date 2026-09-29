import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.rfp import RFPAnalysis
from app.models.memory import MemoryRecallResponse
from app.services.hindsight_service import hindsight_service

logger = logging.getLogger("proposal_agent.memory_retriever")

class MemoryRetriever:
    def retrieve_for_rfp(self, rfp_analysis: RFPAnalysis, db: Optional[Session] = None) -> MemoryRecallResponse:
        """Construct intelligent recall query from structured RFP Analysis and query Hindsight persistent memory."""
        
        # Build search query string based on Section 12 requirement
        query_parts = []
        if rfp_analysis.industry:
            query_parts.append(f"Industry: {rfp_analysis.industry}")
        if rfp_analysis.client_name:
            query_parts.append(f"Client: {rfp_analysis.client_name}")
        
        req_summary = ", ".join(rfp_analysis.mandatory_requirements[:4] + rfp_analysis.compliance_requirements[:2])
        if req_summary:
            query_parts.append(f"Requirements: {req_summary}")

        query_str = " | ".join(query_parts) if query_parts else rfp_analysis.title

        logger.info(f"Constructed Hindsight recall query: '{query_str}'")

        recall_response = hindsight_service.recall_memories(
            query=query_str,
            industry=rfp_analysis.industry,
            client_name=rfp_analysis.client_name,
            requirements=rfp_analysis.mandatory_requirements + rfp_analysis.compliance_requirements,
            top_k=8,
            db=db
        )

        return recall_response

memory_retriever = MemoryRetriever()
