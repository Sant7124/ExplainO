import os
import requests
from services.logger import log_event
from core.config import settings

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def _initialize_model(self):
        """Lazy initialization of the model."""
        if self._model is not None or settings.DEMO_MODE:
            return

        if not settings.USE_LOCAL_EMBEDDINGS:
            log_event("EmbeddingService", "USE_LOCAL_EMBEDDINGS=False. Using HF API as primary.", level="INFO")
            self._model = "FALLBACK"
            return

        # Move heavy imports inside here for faster startup
        import torch
        from sentence_transformers import SentenceTransformer

        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        try:
            log_event("EmbeddingService", f"Initializing Local Model: {model_name}...")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self._model = SentenceTransformer(model_name, device=device)
            log_event("EmbeddingService", f"Model loaded successfully on {device}.")
        except Exception as e:
            log_event("EmbeddingService", f"Local model load failed: {e}. Will use HF API Fallback.", level="WARNING")
            self._model = "FALLBACK"

    def encode(self, sentences: list[str]):
        if settings.DEMO_MODE:
            # Return stable mock vectors (deterministic based on sentence length for variety)
            log_event("EmbeddingService", f"DEMO_MODE: Generating mock vectors for {len(sentences)} items.")
            return [[0.1 * (len(s) % 10)] * 384 for s in sentences]

        self._initialize_model()

        # Try Local first
        if self._model and self._model != "FALLBACK":
            try:
                import torch
                embeddings = self._model.encode(sentences, convert_to_tensor=True)
                normalized_embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)
                return normalized_embeddings.tolist()
            except Exception as e:
                log_event("EmbeddingService", f"Local encoding failed: {e}. Trying HF API...", level="WARNING")

        # Fallback: Hugging Face Inference API (Remote)
        return self._encode_hf_api(sentences)

    def _encode_hf_api(self, sentences: list[str]):
        """Remote fallback to avoid local CPU/Memory/Hang issues."""
        log_event("EmbeddingService", f"HF API: Encoding {len(sentences)} items remotely.")
        
        # Use a compatible model on HF
        api_url = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
        headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
        
        try:
            response = requests.post(
                api_url, 
                headers=headers, 
                json={"inputs": sentences},
                timeout=15
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            log_event("EmbeddingService", f"HF API Fallback failed: {e}. Using random mock vectors.", level="ERROR")
            # Final fallback to avoid hanging the whole system
            return [[0.0] * 384 for _ in sentences]

# Global accessor
def get_embedding_service():
    return EmbeddingService()
