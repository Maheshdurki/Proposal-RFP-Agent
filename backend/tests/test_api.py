import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import init_db
from app.seed_memory import seed_hindsight_memory
from app.main import app

# Initialize DB tables for testing
init_db()
seed_hindsight_memory()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "hindsight_bank" in data

def test_memory_stats():
    response = client.get("/api/memory/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_memories" in data
    assert data["total_memories"] > 0

def test_memory_retain_and_recall():
    # Retain test memory
    retain_payload = {
        "title": "TEST WIN PATTERN: Healthcare Security",
        "content": "Addressing HIPAA compliance in Section 1 yields 95% client acceptance.",
        "memory_type": "win_pattern",
        "industry": "Healthcare",
        "outcome": "WON",
        "tags": ["Healthcare", "Security", "Test"]
    }
    retain_res = client.post("/api/memory/retain", json=retain_payload)
    assert retain_res.status_code == 200
    retained_data = retain_res.json()
    assert retained_data["title"] == retain_payload["title"]

    # Recall test memory
    recall_payload = {
        "query": "Healthcare HIPAA security",
        "industry": "Healthcare",
        "top_k": 5
    }
    recall_res = client.post("/api/memory/recall", json=recall_payload)
    assert recall_res.status_code == 200
    recalled_data = recall_res.json()
    assert recalled_data["total_memories_found"] > 0
    assert len(recalled_data["winning_patterns"]) > 0

def test_demo_scenario_endpoint():
    response = client.post("/api/demo/run-scenario?industry=Healthcare")
    assert response.status_code == 200
    data = response.json()
    assert "without_memory" in data
    assert "with_hindsight_memory" in data
    assert "hindsight_recalled_memories" in data
    
    no_mem_score = data["without_memory"]["compliance"]["overall_score"]
    with_mem_score = data["with_hindsight_memory"]["compliance"]["overall_score"]
    assert with_mem_score >= no_mem_score
