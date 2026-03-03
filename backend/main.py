import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from core.config import settings
from core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# Service Imports
from services.database import init_db
from services.embedding import get_embedding_service
from services.vector_store import get_vector_store

# Route Imports
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.documents import router as documents_router
from routes.ai import router as ai_router
from routes.contact import router as contact_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print(f"RELOADING: Starting {settings.PROJECT_NAME}...")
    
    # 1. Initialize Tables
    init_db()
    
    yield
    # Shutdown logic
    print(f"Shutting down {settings.PROJECT_NAME}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for structured errors
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail if isinstance(exc.detail, str) else "Error",
            "detail": exc.detail
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    from services.logger import log_event
    log_event("GlobalError", f"Unhandled exception: {str(exc)}", level="ERROR")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred. Please try again later."
        }
    )

from fastapi.responses import JSONResponse

# Include New RAG Routers (V1 Prefix)
app.include_router(upload_router, tags=["Ingestion"])
app.include_router(chat_router, tags=["Chat"])
app.include_router(documents_router, tags=["Management"])
app.include_router(contact_router, tags=["Support"])

# Keep legacy routers for compatibility if needed
from routes.ai import router as ai_router
app.include_router(ai_router, prefix="/ai", tags=["Legacy AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to ExplainO API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

