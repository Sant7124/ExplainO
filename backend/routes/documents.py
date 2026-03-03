from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Depends, Response
from sqlmodel import Session, select
import os
import shutil
import json
import urllib.parse
from datetime import datetime
from services.database import get_session, DocumentMetadata
from services.vector_store import get_vector_store
from services.logger import log_event
from services.pdf_service import generate_pdf_report
from typing import List

router = APIRouter(prefix="/api/v1")

@router.get("/documents", response_model=List[DocumentMetadata])
async def list_documents(session: Session = Depends(get_session)):
    statement = select(DocumentMetadata)
    results = session.exec(statement).all()
    return results

@router.get("/documents/{document_id}", response_model=DocumentMetadata)
async def get_document(document_id: str, session: Session = Depends(get_session)):
    statement = select(DocumentMetadata).where(DocumentMetadata.id == document_id)
    doc = session.exec(statement).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str, session: Session = Depends(get_session)):
    # 1. Fetch Metadata
    statement = select(DocumentMetadata).where(DocumentMetadata.id == document_id)
    doc = session.exec(statement).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        # 2. Delete Vector Collection
        vector_store = get_vector_store()
        vector_store.delete_collection(document_id)

        # 3. Delete Physical Files
        doc_dir = os.path.dirname(doc.file_path)
        if os.path.exists(doc_dir):
            shutil.rmtree(doc_dir)
            log_event("DocumentsRoute", f"Deleted filesystem directory: {doc_dir}")

        # 4. Delete DB Record
        session.delete(doc)
        session.commit()
        
        log_event("DocumentsRoute", f"Successfully deleted document {document_id}")
        return {"message": f"Document {document_id} and all its data have been deleted."}

    except Exception as e:
        log_event("DocumentsRoute", f"Failed to delete document {document_id}: {e}", level="ERROR")
        raise HTTPException(status_code=500, detail="Failed to delete document data.")

@router.get("/documents/{document_id}/export")
async def export_document_text(document_id: str, session: Session = Depends(get_session)):
    statement = select(DocumentMetadata).where(DocumentMetadata.id == document_id)
    doc = session.exec(statement).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
        
    if doc.status != "ready":
        raise HTTPException(status_code=400, detail="Document is not ready for export.")

    try:
        # Create a clean text report
        report_lines = [
            f"ExplainO - Document Analysis Report",
            f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "=" * 50,
            f"Document: {doc.filename}",
            f"Uploaded: {doc.upload_time.strftime('%Y-%m-%d')}",
            f"ID: {doc.id}",
            "\nEXECUTIVE SUMMARY:",
            doc.explanation or "No summary available.",
            "\nKEY INSIGHTS:",
        ]
        
        if doc.points_json:
            points = json.loads(doc.points_json)
            for p in points: report_lines.append(f"- {p}")
        
        report_lines.append("\nCRITICAL RISKS:")
        if doc.risks_json:
            risks = json.loads(doc.risks_json)
            for r in risks: report_lines.append(f"[!] {r}")
            
        report_lines.append("\nROADMAP DATES:")
        if doc.dates_json:
            dates = json.loads(doc.dates_json)
            for d in dates: report_lines.append(f"> {d}")
            
        # Create a clean text report with Windows line endings
        report_content = "\r\n".join(report_lines)
        
        # Extremely simple filename for maximum compatibility
        filename = "ExplainO_Intelligence_Report.txt"
            
        return Response(
            content=report_content,
            media_type="text/plain",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        log_event("DocumentsRoute", f"Text export failed for {document_id}: {e}", level="ERROR")
        raise HTTPException(status_code=500, detail=f"Failed to generate text report: {str(e)}")
