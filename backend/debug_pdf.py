from services.database import engine, DocumentMetadata
from sqlmodel import Session, select
from services.pdf_service import generate_pdf_report
import traceback

def debug_pdf():
    doc_id = '8a098f47-8b12-4794-a24f-5f8b8b25931e'
    print(f"Testing PDF for doc {doc_id}")
    
    with Session(engine) as session:
        doc = session.exec(select(DocumentMetadata).where(DocumentMetadata.id == doc_id)).first()
        if not doc:
            print("Document not found in DB.")
            return

        try:
            pdf = generate_pdf_report(doc)
            print(f"Success! PDF size: {len(pdf)} bytes")
            with open("test_debug_export.pdf", "wb") as f:
                f.write(pdf)
            print("PDF saved to test_debug_export.pdf")
        except Exception as e:
            print("PDF Generation FAILED:")
            traceback.print_exc()

if __name__ == "__main__":
    debug_pdf()
