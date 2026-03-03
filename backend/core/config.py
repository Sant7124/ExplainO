from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ExplainO"
    API_V1_STR: str = "/api/v1"
    
    # Demo Mode (Bypasses real AI/OCR for local testing)
    DEMO_MODE: bool = False # Enable REAL AI by default now that we have fallbacks
    USE_LOCAL_EMBEDDINGS: bool = False # Set to True only if you have 8GB+ RAM andPoppler/Tesseract installed
    
    # AI Settings
    GOOGLE_API_KEY: str = "demo_key"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Groq Settings
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    
    # HuggingFace Settings
    HF_API_KEY: Optional[str] = None
    HF_MODEL: str = "openai-community/gpt2"
    HF_API_URL: str = "https://api-inference.huggingface.co/models"
    
    # Vector DB Settings
    CHROMA_DB_PATH: str = "./chroma_db"
    chroma_server_nofile: bool = False  # Added for Render compatibility/Pydantic V2
    
    # Email Settings (Resend)
    RESEND_API_KEY: Optional[str] = None
    ADMIN_EMAIL: str = "sant7124@gmail.com"
    
    # Rate Limiting
    MAX_DOCS_PER_IP_DAY: int = 3
    MAX_QUESTIONS_PER_SESSION: int = 15
    MAX_UPLOAD_SIZE_MB: int = 5
    
    # Redis for rate limiting (fallback to local if not available)
    REDIS_URL: Optional[str] = None
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }

settings = Settings()
