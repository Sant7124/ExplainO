from services.database import engine, DocumentMetadata
from sqlmodel import Session, select
import json
from datetime import datetime
# Mocking Response since we aren't running in FastAPI context here
class MockResponse:
    def __init__(self, content, media_type, headers):
        self.content = content
        self.media_type = media_type
        self.headers = headers

def debug_export_logic():
    doc_id = '8a098f47-8b12-4794-a24f-5f8b8b25931e'
    print(f"Debugging export logic for {doc_id}")
    
    with Session(engine) as session:
        doc = session.exec(select(DocumentMetadata).where(DocumentMetadata.id == doc_id)).first()
        if not doc:
            print("Doc not found")
            return

        try:
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

            report_content = "\n".join(report_lines)
            print("Report generated successfully!")
            print(f"Content length: {len(report_content)}")
            print(report_content[:200])
        except Exception as e:
            import traceback
            print("Logic failed:")
            traceback.print_exc()

if __name__ == "__main__":
    debug_export_logic()
