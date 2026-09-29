import json
import logging
from typing import Optional
from sqlalchemy.orm import Session

from app.models.rfp import RFPAnalysis
from app.models.proposal import ProposalStrategy
from app.services.memory_retriever import memory_retriever
from app.services.groq_service import groq_service

logger = logging.getLogger("proposal_agent.proposal_planner")

class ProposalPlanner:
    def plan_strategy(
        self, 
        rfp_analysis: RFPAnalysis, 
        with_memory: bool = True,
        db: Optional[Session] = None
    ) -> ProposalStrategy:
        """Create proposal strategy by synthesizing RFP requirements and Hindsight recalled memories."""
        
        if not with_memory:
            logger.info("Generating generic baseline strategy (WITHOUT HINDSIGHT MEMORY).")
            return ProposalStrategy(
                tone="standard professional",
                priority_sections=["Executive Summary", "Proposed Solution", "Pricing"],
                winning_patterns_to_use=["Standard corporate presentation"],
                patterns_to_avoid=[],
                key_selling_points=["Modern cloud platform", "Experienced engineering team"],
                requirement_mapping_strategy={"General": "Proposed Solution"},
                hindsight_memory_influence_summary="NONE (Generated without memory recall. Standard generic proposal template applied.)"
            )

        # Recall Hindsight memories
        mem_recall = memory_retriever.retrieve_for_rfp(rfp_analysis, db=db)
        
        system_prompt = (
            "You are a Senior Proposal Strategist AI Agent. "
            "Using structured RFP details and historical proposal memories (winning patterns, loss patterns, client preferences), "
            "create a custom Proposal Strategy in JSON."
        )

        user_prompt = f"""
RFP Details:
- Title: {rfp_analysis.title}
- Industry: {rfp_analysis.industry}
- Client: {rfp_analysis.client_name}
- Mandatory Requirements: {rfp_analysis.mandatory_requirements}
- Compliance Requirements: {rfp_analysis.compliance_requirements}

RECALLED HINDSIGHT MEMORIES:
- Winning Patterns to Leverage: {mem_recall.winning_patterns}
- Loss Patterns to Avoid: {mem_recall.loss_patterns}
- Client Preferences: {mem_recall.client_preferences}

Synthesize a ProposalStrategy JSON object with:
- tone (string)
- priority_sections (list of strings)
- winning_patterns_to_use (list of strings)
- patterns_to_avoid (list of strings)
- key_selling_points (list of strings)
- requirement_mapping_strategy (dictionary of string -> string)
- hindsight_memory_influence_summary (string summarizing exact historical memory impact)
"""

        raw_res = groq_service.complete(user_prompt, system_prompt=system_prompt, json_mode=True)

        try:
            parsed = json.loads(raw_res)
            strat_data = parsed.get("proposal_strategy", parsed)
            return ProposalStrategy(**strat_data)
        except Exception as e:
            logger.warning(f"Error parsing LLM strategy ({e}). Creating strategy with recalled memories.")
            
            # Formulate robust memory-driven strategy
            industry_str = rfp_analysis.industry or "General"
            winning_use = mem_recall.winning_patterns or [
                f"Lead with dedicated {industry_str} security architecture",
                "Provide granular milestone-based implementation phases",
                "Include concrete metric-backed case studies"
            ]
            avoid_list = mem_recall.loss_patterns or [
                "Avoid generic marketing buzzwords and unverified claims",
                "Do not leave compliance response in appendix; put upfront",
                "Avoid vague timeline estimates without owner assignments"
            ]

            influence_summary = (
                f"Recalled {mem_recall.total_memories_found} Hindsight memories for {industry_str}. "
                f"Prioritized early security details, concrete implementation roadmap, and excluded generic AI buzzwords based on past wins/losses."
            )

            req_map = {req: "Security & Compliance" if "security" in req.lower() or "hipaa" in req.lower() else "Technical Architecture" 
                       for req in rfp_analysis.mandatory_requirements[:5]}

            return ProposalStrategy(
                tone="formal, concise, and security-first",
                priority_sections=["Security & Compliance", "Implementation Plan", f"{industry_str} Relevant Experience"],
                winning_patterns_to_use=winning_use,
                patterns_to_avoid=avoid_list,
                key_selling_points=[
                    f"Proven {industry_str} architecture with zero-trust security controls",
                    "Guaranteed 24/7 SLA with sub-15 minute response protocol",
                    "Phased implementation plan with zero operational downtime"
                ],
                requirement_mapping_strategy=req_map,
                hindsight_memory_influence_summary=influence_summary
            )

proposal_planner = ProposalPlanner()
