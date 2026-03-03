import pytesseract
import os
import shutil

# Force Windows path binding
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
elif shutil.which("tesseract"):
    # Fallback to PATH if it's there
    pytesseract.pytesseract.tesseract_cmd = shutil.which("tesseract")
else:
    # We won't raise error here to allow non-OCR paths to still work, 
    # but we'll log it when needed.
    pass

def get_tesseract_path():
    return pytesseract.pytesseract.tesseract_cmd
