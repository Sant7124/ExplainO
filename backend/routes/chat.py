from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from services.database import get_session, DocumentMetadata
from services.rag_pipeline import get_rag_pipeline
from services.logger import log_event
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1")

class ChatRequest(BaseModel):
    question: str

@router.post("/chat/{document_id}")
async def chat_with_document(
    document_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session)
):
    # 1. Fetch Metadata and Check Status
    statement = select(DocumentMetadata).where(DocumentMetadata.id == document_id)
    doc = session.exec(statement).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if doc.status == "processing":
        raise HTTPException(status_code=425, detail="Document is still being processed. Please try again in a few seconds.")
    
    if doc.status == "failed":
        raise HTTPException(status_code=500, detail=f"Document processing failed: {doc.error_message}")
    
    if doc.question_count >= 10:
        raise HTTPException(status_code=429, detail="Chat limit reached for this document (Max 10 queries).")

    # 2. Call RAG Pipeline
    try:
        rag = get_rag_pipeline()
        result = rag.get_contextual_answer(document_id, request.question)
        
        # 3. Increment Count
        doc.question_count += 1
        session.add(doc)
        session.commit()
        
        # Return result with updated count
        result["question_count"] = doc.question_count
        return result
    except Exception as e:
        log_event("ChatRoute", f"RAG query failed for {document_id}: {e}", level="ERROR")
        raise HTTPException(status_code=500, detail="An error occurred while generating the answer.")
