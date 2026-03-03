from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Depends
from sqlmodel import Session, select
import os
import uuid
import shutil
from services.database import get_session, DocumentMetadata, update_document_status
from services.document_processor import DocumentProcessor
from services.chunker import DocumentChunker
from services.embedding import get_embedding_service
from services.vector_store import get_vector_store
from core.limiter import limiter
from fastapi import Request
from services.logger import log_event
from datetime import datetime

router = APIRouter(prefix="/api/v1")

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Internal processing task
def process_document_task(doc_id: str, file_path: str):
    try:
        log_event("UploadRoute", f"Background processing started for {doc_id}")
        
        # 1. Extract Text
        update_document_status(doc_id, "processing", sub_status="Scanning Document...")
        processor = DocumentProcessor()
        pages_text = processor.extract_text(file_path)
        
        # 2. Chunk Text
        update_document_status(doc_id, "processing", sub_status="Extracting Intelligence...")
        chunker = DocumentChunker()
        chunks = chunker.process_document(pages_text)
        
        # 3. Generate Embeddings & Store
        update_document_status(doc_id, "processing", sub_status="Generating Embeddings...")
        embedding_service = get_embedding_service()
        texts = [c['text'] for c in chunks]
        embeddings = embedding_service.encode(texts)
        
        # 4. Store in Vector Store
        update_document_status(doc_id, "processing", sub_status="Storing in Vector Database...")
        vector_store = get_vector_store()
        vector_store.add_chunks(doc_id, chunks, embeddings)
        
        # 5. Generate Automated Summary (Precise & Concise)
        update_document_status(doc_id, "processing", sub_status="Synthesizing Summary...")
        log_event("UploadRoute", f"Generating executive summary for {doc_id}...")
        
        import json
        from ai.llm import ask_llm
        from core.config import settings

        if settings.DEMO_MODE:
            summary_data = {
                "explanation": "This is a DEMO summary. ExplainO analyzes document context using RAG (Retrieval Augmented Generation) to provide clear, actionable insights.",
                "points": ["Instant AI analysis", "Context-aware chat", "Risk identification", "Technical summary"],
                "risks": ["Demo mode uses placeholder data", "Real analysis requires configured API keys"],
                "dates": ["Current Date: " + datetime.now().strftime("%Y-%m-%d")]
            }
        else:
            summary_prompt = f"""
            Analyze the following document context and provide a structured summary.
            
            RULES:
            1. 'explanation': A single, simplified paragraph explaining the core purpose (ELI5 style).
            2. 'points': A list of 4-6 most important technical or factual insights.
            3. 'risks': A list of 2-3 potential risks, warnings, or critical gaps found.
            4. 'dates': A list of important deadlines, dates, or milestones mentioned.
            
            FORMAT: Return ONLY a valid JSON object with these keys.
            
            CONTEXT:
            {" ".join(texts[:5])} # Use first 5 chunks for summary
            """
            
            try:
                raw_summary = ask_llm(summary_prompt)
                # Basic JSON extraction if LLM adds markdown
                if "```json" in raw_summary:
                    raw_summary = raw_summary.split("```json")[1].split("```")[0].strip()
                
                summary_data = json.loads(raw_summary)
            except Exception as e:
                log_event("UploadRoute", f"AI summarization or parsing failed: {e}", level="WARNING")
                summary_data = {
                    "explanation": "Automatic summarization unavailable for this document. You can still ask questions in the chat.",
                    "points": [],
                    "risks": [],
                    "dates": []
                }

        # 6. Finalize Metadata
        from services.database import engine
        with Session(engine) as session:
            statement = select(DocumentMetadata).where(DocumentMetadata.id == doc_id)
            doc = session.exec(statement).first()
            if doc:
                doc.status = "ready"
                doc.sub_status = "Analysis Complete"
                doc.chunk_count = len(chunks)
                doc.explanation = summary_data.get("explanation")
                doc.points_json = json.dumps(summary_data.get("points", []))
                doc.risks_json = json.dumps(summary_data.get("risks", []))
                doc.dates_json = json.dumps(summary_data.get("dates", []))
                session.add(doc)
                session.commit()
                
        log_event("UploadRoute", f"Document {doc_id} successfully processed and summarized.")

    except Exception as e:
        log_event("UploadRoute", f"Background processing failed for {doc_id}: {e}", level="ERROR")
        try:
            update_document_status(doc_id, "failed", error=str(e))
        except:
            pass # DB might be locked or down, but we've logged it

@router.post("/upload")
@limiter.limit("10/hour")
async def upload_document(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    # 1. Validate File extension
    ext = os.path.splitext(file.filename)[1].lower()
    print(f"DEBUG: Checking {ext} against {ALLOWED_EXTENSIONS}")
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}")

    # 2. Create Unique ID and Hashed Path
    doc_id = str(uuid.uuid4())
    doc_dir = os.path.join(UPLOAD_DIR, doc_id)
    os.makedirs(doc_dir, exist_ok=True)
    file_path = os.path.join(doc_dir, file.filename)

    # 3. Save File with Size Limit Check
    file_size = 0
    with open(file_path, "wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)  # Read 1MB at a time
            if not chunk:
                break
            file_size += len(chunk)
            if file_size > MAX_FILE_SIZE:
                buffer.close()
                shutil.rmtree(doc_dir)
                raise HTTPException(status_code=413, detail="File too large. Maximum 10MB.")
            buffer.write(chunk)

    # 4. Save Initial Metadata
    doc_meta = DocumentMetadata(
        id=doc_id,
        filename=file.filename,
        file_path=file_path,
        mime_type=file.content_type,
        status="processing"
    )
    session.add(doc_meta)
    session.commit()
    session.refresh(doc_meta)

    # 5. Trigger Background processing
    background_tasks.add_task(process_document_task, doc_id, file_path)

    return {
        "document_id": doc_id,
        "filename": file.filename,
        "status": "processing",
        "message": "Upload successful. Processing in background."
    }
