from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO
from typing import Dict, Any, List

class ReportService:
    @staticmethod
    def generate_document_report(data: Dict[str, Any]) -> bytes:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = styles['Heading1']
        section_style = styles['Heading2']
        body_style = styles['BodyText']
        
        content = []
        
        # Title
        content.append(Paragraph(f"ExplainO Analysis Report: {data.get('filename')}", title_style))
        content.append(Spacer(1, 12))
        
        # Summary Section
        content.append(Paragraph("Document Overview", section_style))
        analysis = data.get('analysis', {})
        content.append(Paragraph(analysis.get('explanation', 'N/A'), body_style))
        content.append(Spacer(1, 12))
        
        # Important Points
        content.append(Paragraph("Key Points", section_style))
        points = analysis.get('points', [])
        for pt in points:
            content.append(Paragraph(f"• {pt}", body_style))
        content.append(Spacer(1, 12))
        
        # Risks
        content.append(Paragraph("Risks & Considerations", section_style))
        risks = analysis.get('risks', [])
        for r in risks:
            content.append(Paragraph(f"• {r}", body_style))
        content.append(Spacer(1, 12))
        
        # Important Dates
        content.append(Paragraph("Important Dates", section_style))
        dates = analysis.get('dates', [])
        if isinstance(dates, list):
            for d in dates:
                content.append(Paragraph(f"• {d}", body_style))
        else:
            content.append(Paragraph(str(dates), body_style))
        content.append(Spacer(1, 12))
        
        # Actions Required
        content.append(Paragraph("Actions Required", section_style))
        actions = analysis.get('actions', [])
        if isinstance(actions, list):
            for a in actions:
                content.append(Paragraph(f"• {a}", body_style))
        else:
            content.append(Paragraph(str(actions), body_style))
        
        doc.build(content)
        return buffer.getvalue()

report_service = ReportService()
