import os
from typing import List, Optional
from core.config import settings
from pypdf import PdfReader
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
from services.logger import log_event
import services.ocr_config  # Force Tesseract path binding on Windows

class DocumentProcessor:
    def __init__(self, ocr_threshold: int = 200):
        self.ocr_threshold = ocr_threshold

    def extract_text(self, file_path: str) -> List[str]:
        """
        Main entry point for text extraction.
        Determines file type and applies adaptive extraction logic.
        """
        ext = os.path.splitext(file_path)[1].lower()
        log_event("DocumentProcessor", f"Processing file: {file_path} (Type: {ext})")
        
        if settings.DEMO_MODE:
            log_event("DocumentProcessor", "DEMO_MODE: Returning placeholder text.")
            return [f"This is a DEMO document ({os.path.basename(file_path)}). In production, full extraction and OCR would happen here using modern AI models."]

        if ext == ".pdf":
            return self._process_pdf(file_path)
        elif ext in [".png", ".jpg", ".jpeg"]:
            return [self._process_image(file_path)]
        elif ext == ".txt":
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return [f.read()]
            except UnicodeDecodeError:
                with open(file_path, "r", encoding="latin-1") as f:
                    return [f.read()]
        else:
            log_event("DocumentProcessor", f"Unsupported file type: {ext}", level="ERROR")
            raise ValueError(f"Unsupported file type: {ext}")

    def _process_pdf(self, file_path: str) -> List[str]:
        """
        Extracts text from PDF. Uses PyPDF first, fallbacks to OCR if needed.
        """
        pages_text = []
        try:
            reader = PdfReader(file_path)
            total_text = ""
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                pages_text.append(page_text)
                total_text += page_text

            # Decision: Is this a "scanned" or "empty" PDF?
            if len(total_text.strip()) < self.ocr_threshold:
                log_event("DocumentProcessor", "PDF text extraction low/empty. Triggering OCR fallback...")
                return self._process_pdf_ocr(file_path)
            
            log_event("DocumentProcessor", f"Successfully extracted text from {len(pages_text)} PDF pages via PyPDF.")
            return pages_text

        except Exception as e:
            log_event("DocumentProcessor", f"PyPDF extraction failed: {e}. Falling back to OCR.", level="WARNING")
            return self._process_pdf_ocr(file_path)

    def _process_pdf_ocr(self, file_path: str) -> List[str]:
        """
        Converts PDF pages to images and runs OCR on each.
        Limits to first 20 pages to prevent OOM.
        """
        log_event("DocumentProcessor", f"Starting OCR for PDF: {file_path}")
        pages_text = []
        try:
            # Convert PDF to list of PIL Images (Limit to 20 pages for safety)
            # Note: poppler must be installed for this to work on Windows
            images = convert_from_path(file_path, last_page=20)
            
            if len(images) > 20:
                log_event("DocumentProcessor", f"PDF has {len(images)} pages. Limiting OCR to first 20.", level="WARNING")
            
            for i, image in enumerate(images):
                log_event("DocumentProcessor", f"OCR-ing page {i+1}/{len(images)}...")
                text = pytesseract.image_to_string(image)
                pages_text.append(text)
            
            log_event("DocumentProcessor", f"OCR complete for {len(pages_text)} pages.")
            return pages_text
        except Exception as e:
            log_event("DocumentProcessor", f"OCR processing failed: {e}. Returning placeholder.", level="ERROR")
            return ["Error: OCR failed. Please ensure Tesseract and Poppler are installed on the server."]

    def _process_image(self, file_path: str) -> str:
        """
        Runs OCR on a single image file.
        """
        log_event("DocumentProcessor", f"OCR-ing image: {file_path}")
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            log_event("DocumentProcessor", f"Image OCR failed: {e}. Returning placeholder.", level="ERROR")
            return f"Error: Image analysis failed. {str(e)}"
