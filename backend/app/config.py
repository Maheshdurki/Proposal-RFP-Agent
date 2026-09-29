import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "proposal-agent")
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./proposal_agent.db")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
