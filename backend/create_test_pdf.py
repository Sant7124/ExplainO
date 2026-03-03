from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def create_sample_pdf(filename: str):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Page 1: Features
    c.drawString(100, 750, "ExplainO Feature Specification")
    c.drawString(100, 730, "-----------------------------")
    c.drawString(100, 710, "1. Real-time document scanning using neural networks.")
    c.drawString(100, 690, "2. Deep risk auditing for phishing and malicious content.")
    c.drawString(100, 670, "3. Contextual chat with persistent memory for follow-up questions.")
    c.drawString(100, 650, "4. Multi-tier AI resilience using Groq, HuggingFace, and Ollama.")
    c.showPage()
    
    # Page 2: Security
    c.drawString(100, 750, "Security Protocol")
    c.drawString(100, 730, "-----------------")
    c.drawString(100, 710, "Our encryption standard uses AES-256 for all at-rest document storage.")
    c.drawString(100, 690, "We enforce a strict similarity threshold of 0.35 for RAG retrieval to prevent hallucinations.")
    c.drawString(100, 670, "All metadata is stored in a secure SQLite database using SQLModel.")
    c.save()
    print(f"Sample PDF created: {filename}")

if __name__ == "__main__":
    create_sample_pdf("test_sample.pdf")
