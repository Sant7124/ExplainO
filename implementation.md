# ExplainO Implementation & Setup Guide

This document provides a comprehensive, step-by-step guide to setting up, running, and deploying ExplainO from absolute scratch.

## 1. System Requirements (External Binaries)

ExplainO relies on a few external tools for document processing (OCR and PDF handling). These **must** be installed on your system before the Python backend will work correctly.

### A. Tesseract OCR (For Image/PDF Text Recognition)
- **Windows**: Download the installer from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki). After installation, add the installation path (usually `C:\Program Files\Tesseract-OCR`) to your system environment variables.
- **Linux (Ubuntu/Debian)**: `sudo apt-get install tesseract-ocr`
- **Mac (Homebrew)**: `brew install tesseract`

### B. Poppler (For PDF-to-Image Conversion)
- **Windows**: Download from [poppler-windows](https://github.com/oschwartz10612/poppler-windows/releases). Extract and add the `bin` folder to your system environment variables.
- **Linux (Ubuntu/Debian)**: `sudo apt-get install poppler-utils`
- **Mac (Homebrew)**: `brew install poppler`

### C. Redis (For Rate Limiting)
- **Windows**: Use [Redis for Windows](https://github.com/tporadowski/redis/releases) or run via WSL (`sudo apt install redis-server`).
- **Linux**: `sudo apt install redis-server`
- **Mac**: `brew install redis`

---

## 2. Environment Setup

### Backend (Python FastAPI)
1. **Navigate to backend**: `cd backend`
2. **Create Virtual Environment**: `python -m venv .venv`
3. **Activate Environment**:
   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`
4. **Install Dependencies**: `pip install -r requirements.txt`
5. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   ADMIN_EMAIL=your_email@example.com
   CHROMA_DB_PATH=./chroma_db
   REDIS_URL=redis://localhost:6379
   ```

### Frontend (React + Vite)
1. **Navigate to frontend**: `cd frontend`
2. **Install Dependencies**: `npm install`
3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory if needed (e.g., `VITE_API_URL=http://localhost:8000/api/v1`).

---

## 3. Running Locally

### Start Backend
```bash
cd backend
# Ensure .venv is active
python main.py
```
- The server will start at `http://localhost:8000`.
- API Docs (Swagger) available at `http://localhost:8000/docs`.

### Start Frontend
```bash
cd frontend
npm run dev
```
- The application will be available at `http://localhost:5173`.

---

## 4. Health & Verification

### Checking Backend Health
- **Simple Check**: Open `http://localhost:8000/` in your browser. You should see `{"message": "Welcome to ExplainO API", "status": "online"}`.
- **Dedicated Health Endpoint**: Visit `http://localhost:8000/health`. It should return `{"status": "healthy"}`.

### Verifying AI Connectivity
Once the backend is running and your `GOOGLE_API_KEY` is set, you can test a document upload. If the Gemini API is correctly configured, you will see a detailed analysis in the UI or backend logs.

---

## 5. System Functioning (How it Works)

### 1. Document Ingestion
When a user uploads a file:
- **FastAPI** receives the file.
- **PyMuPDF** or **python-docx** extracts text from searchable documents.
- **Tesseract OCR** extracts text from images or scanned PDFs.

### 2. RAG Pipeline (Retrieval Augmented Generation)
- Extracted text is split into chunks using **LangChain**.
- Chunks are converted into vector embeddings.
- **ChromaDB** stores these embeddings locally for persistent memory.
- When a user asks a question, the system searches ChromaDB for the most relevant context and sends it to **Google Gemini 1.5 Flash**.

### 3. Report Generation
- The analysis and chat history are compiled using **ReportLab** to generate a professional PDF report for download.

---

## 6. Deployment Guide

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Connect your repository to **Render**.
3. Choose **Python** as the environment.
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Important**: Add all environment variables from your `.env` to the Render Dashboard.

### Frontend (Vercel / Netlify)
1. Connect your repository to **Vercel**.
2. Vercel will automatically detect the Vite project.
3. Set the Root Directory to `frontend`.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add `VITE_API_URL` as an environment variable pointing to your deployed backend.
