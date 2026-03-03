# ExplainO - AI Powered Document Understanding

ExplainO is a production-grade SaaS web application designed to help users understand complicated documents using AI-driven context and analysis.

## Features

- **Document Analysis**: Upload PDF, DOCX, or Images for instant ELI5 explanations, risks, and action items.
- **RAG Chat**: Interactive AI chatbot that answers questions *only* based on the uploaded document context.
- **PDF Reports**: Download professional analysis reports including chat history and extracted insights.
- **Security**: Built-in rate limiting and abuse protection.
- **Modern UI**: Professional SaaS aesthetic with dark/light mode support.

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Python FastAPI, Uvicorn.
- **AI**: Google Gemini 1.5 Flash (Free Tier).
- **Vector DB**: ChromaDB (Local persistent storage).
- **OCR**: Tesseract OCR.
- **Report Gen**: ReportLab.

## Project Structure

```
/explaino
  /frontend     - React + Vite project
    /src
      /components - Reusable UI components
      /pages      - Main application pages
      /services   - API communication layer
  /backend      - FastAPI project
    /api        - API endpoints and routes
    /core       - Configuration and security
    /services   - OCR, RAG, and Report logic
    /utils      - Helper functions
```

## Setup Instructions

### Backend
1. Navigate to `backend` folder.
2. Create a virtual environment: `python -m venv .venv`.
3. Activate it: `.venv\Scripts\activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a `.env` file based on `.env.example` and add your **GOOGLE_API_KEY**.
6. Run the server: `python main.py`.

### Frontend
1. Navigate to `frontend` folder.
2. Install dependencies: `npm install`.
3. Run the dev server: `npm run dev`.

## Developer

Built by **Santosh Yadav** as a demonstration of production-grade AI application architecture.
