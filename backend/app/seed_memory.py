import os
import json
import logging
import sys

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db, SessionLocal, LocalMemoryRecord
from app.models.memory import MemoryRetainRequest
from app.services.hindsight_service import hindsight_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("proposal_agent.seed")

def seed_hindsight_memory():
    logger.info("Initializing database tables...")
    init_db()

    logger.info("Ensuring Hindsight bank exists...")
    hindsight_service.ensure_bank()

    json_path = os.path.join(os.path.dirname(__file__), "data", "historical_proposals.json")
    if not os.path.exists(json_path):
        logger.error(f"Dataset file not found at {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        proposals_data = json.load(f)

    db = SessionLocal()
    try:
        existing_ids = {r.proposal_id for r in db.query(LocalMemoryRecord).all() if r.proposal_id}
        unseeded_proposals = [p for p in proposals_data if p.get("id") not in existing_ids]
        if not unseeded_proposals:
            logger.info(f"Database already seeded with all {len(proposals_data)} historical proposals. Skipping idempotent duplicate seeding.")
            return

        proposals_data = unseeded_proposals

        seeded_count = 0
        for item in proposals_data:
            prop_id = item.get("id")
            industry = item.get("industry", "General")
            outcome = item.get("outcome", "WON")
            client = item.get("client", "Client")
            title = item.get("title")

            # 1. Retain Historical Proposal Memory
            hist_req = MemoryRetainRequest(
                title=f"HISTORICAL PROPOSAL: {title} ({outcome})",
                content=item.get("content", f"Historical proposal {prop_id} for {client}"),
                memory_type="historical_proposal",
                industry=industry,
                proposal_id=prop_id,
                outcome=outcome,
                tags=[industry, outcome, prop_id],
                metadata={
                    "client": client,
                    "requirements": item.get("requirements", []),
                    "what_worked": item.get("what_worked", ""),
                    "problems": item.get("problems", ""),
                    "client_feedback": item.get("client_feedback", "")
                }
            )
            hindsight_service.retain_memory(hist_req, db=db)
            seeded_count += 1

            # 2. Retain Specific Pattern / Preference Memory
            if outcome == "WON":
                pattern_req = MemoryRetainRequest(
                    title=f"WIN PATTERN: {title}",
                    content=f"What Worked: {item.get('what_worked', '')}\nSuccessful Language: {item.get('successful_language', '')}",
                    memory_type="win_pattern",
                    industry=industry,
                    proposal_id=prop_id,
                    outcome="WON",
                    tags=[industry, "WIN", "pattern"],
                    metadata={"successful_language": item.get("successful_language", "")}
                )
            else:
                pattern_req = MemoryRetainRequest(
                    title=f"LOSS PATTERN: {title}",
                    content=f"Problems Encountered: {item.get('problems', '')}\nClient Feedback: {item.get('client_feedback', '')}\nLesson Learned: {item.get('lesson', '')}",
                    memory_type="loss_pattern",
                    industry=industry,
                    proposal_id=prop_id,
                    outcome="LOST",
                    tags=[industry, "LOSS", "pattern"],
                    metadata={"lesson": item.get("lesson", "")}
                )
            hindsight_service.retain_memory(pattern_req, db=db)
            seeded_count += 1

            # 3. Retain Client Preference Memory
            pref_req = MemoryRetainRequest(
                title=f"CLIENT PREFERENCE: {client} ({industry})",
                content=f"Client Preference: {item.get('client_preference', 'Prefers security upfront and concise technical answers.')}",
                memory_type="client_preference",
                industry=industry,
                proposal_id=prop_id,
                outcome=outcome,
                tags=[industry, client, "preference"],
                metadata={"client": client}
            )
            hindsight_service.retain_memory(pref_req, db=db)
            seeded_count += 1

        logger.info(f"Successfully seeded {seeded_count} Hindsight memories across {len(proposals_data)} historical proposals!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_hindsight_memory()
