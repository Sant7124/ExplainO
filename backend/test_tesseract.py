import pytesseract
from PIL import Image
import os
import sys

# Add services to path for config import
sys.path.append(os.path.join(os.getcwd(), 'services'))
try:
    import ocr_config
    print(f"Tesseract Path: {pytesseract.pytesseract.tesseract_cmd}")
except ImportError:
    pass

try:
    # Create a small white image with some text as a dummy test if possible, 
    # but simplest is just checking if we can call --version via pytesseract
    ver = pytesseract.get_tesseract_version()
    print(f"Tesseract loaded successfully! Version: {ver}")
    
    # Simple real test
    img = Image.new("RGB", (200, 80), color="white")
    # Tesseract might not return anything for empty image, but we just want to see if it runs
    pytesseract.image_to_string(img)
    print("OCR Engine test passed (image_to_string called without error)")

except Exception as e:
    print(f"OCR Test Failed: {e}")
