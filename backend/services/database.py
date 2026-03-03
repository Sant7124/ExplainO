from sqlmodel import SQLModel, Field, create_engine, Session, select
from datetime import datetime
import uuid
from typing import Optional, List
import os

# Database Path
DB_PATH = "data/explaino.db"
os.makedirs("data", exist_ok=True)
engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False}
)

class DocumentMetadata(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    filename: str
    file_path: str
    upload_time: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="processing") # processing, ready, failed
    sub_status: Optional[str] = None # Detailed step: "Scanning", "Embedding", etc.
    chunk_count: int = 0
    mime_type: str = "application/pdf"
    error_message: Optional[str] = None
    
    # Summary Fields (Auto-generated on upload)
    explanation: Optional[str] = None
    points_json: Optional[str] = None  # Store as JSON string
    risks_json: Optional[str] = None   # Store as JSON string
    dates_json: Optional[str] = None   # Store as JSON string
    
    question_count: int = 0

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# Helper functions for service-layer access
def update_document_status(doc_id: str, status: str, sub_status: str = None, error: str = None):
    with Session(engine) as session:
        statement = select(DocumentMetadata).where(DocumentMetadata.id == doc_id)
        doc = session.exec(statement).first()
        if doc:
            doc.status = status
            if sub_status:
                doc.sub_status = sub_status
            # The original `chunk_count` parameter was removed in the instruction's signature.
            # The instruction's body had a syntax error related to `chunk_count`.
            # Assuming `chunk_count` is no longer updated via this function call,
            # or if it was intended to be updated, it needs to be re-added to the signature.
            # For now, I'm faithfully applying the provided signature and fixing the syntax.
            # If `chunk_count` needs to be updated, it should be passed as a parameter.
            # As per the provided snippet, `chunk_count` is not in the signature.
            # The garbled part `if error: chunk_count: doc.chunk_count = chunk_count` is removed.
            if error:
                doc.error_message = error
            session.add(doc)
            session.commit()
            session.refresh(doc)
            return doc
    return None
