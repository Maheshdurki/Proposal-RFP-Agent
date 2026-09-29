import json
from sqlalchemy import create_engine, Column, String, Integer, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RFPRecord(Base):
    __tablename__ = "rfps"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    client_name = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    title = Column(String, nullable=False)
    analysis_json = Column(Text, nullable=False)  # JSON string of RFPAnalysis
    created_at = Column(DateTime, default=datetime.utcnow)

class ProposalRecord(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, index=True)
    rfp_id = Column(String, ForeignKey("rfps.id"), nullable=False)
    title = Column(String, nullable=False)
    status = Column(String, default="DRAFT")  # DRAFT, APPROVED, WON, LOST, PENDING
    strategy_json = Column(Text, nullable=False)
    content_json = Column(Text, nullable=False)
    compliance_json = Column(Text, nullable=True)
    with_memory = Column(Integer, default=1)  # 1 for with hindsight memory, 0 for without memory mode
    feedback_text = Column(Text, nullable=True)
    win_loss_reasons = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LocalMemoryRecord(Base):
    __tablename__ = "hindsight_memories"

    id = Column(String, primary_key=True, index=True)
    memory_type = Column(String, nullable=False)  # historical_proposal, client_preference, win_pattern, loss_pattern, feedback
    industry = Column(String, nullable=True)
    proposal_id = Column(String, nullable=True)
    outcome = Column(String, nullable=True)  # WON, LOST, PREFERENCE
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    tags_json = Column(Text, nullable=False)
    metadata_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
