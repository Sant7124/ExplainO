import chromadb
from chromadb.config import Settings
from services.logger import log_event
import os
from typing import List, Dict

class VectorStore:
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStore, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance

    def _initialize_client(self):
        persist_directory = "chroma_db"
        os.makedirs(persist_directory, exist_ok=True)
        log_event("VectorStore", f"Initializing ChromaDB at {persist_directory}...")
        self._client = chromadb.PersistentClient(path=persist_directory)
        log_event("VectorStore", "ChromaDB client initialized.")

    def add_chunks(self, document_id: str, chunks: List[Dict], embeddings: List[List[float]]):
        """
        Adds chunks to a document-specific collection.
        """
        collection_name = f"document_{document_id.replace('-', '_')}"
        log_event("VectorStore", f"Adding {len(chunks)} chunks to collection: {collection_name}")
        
        collection = self._client.get_or_create_collection(name=collection_name)
        
        ids = [f"{document_id}_{c['metadata']['chunk_index']}" for c in chunks]
        documents = [c['text'] for c in chunks]
        metadatas = [c['metadata'] for c in chunks]
        
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        log_event("VectorStore", f"Successfully indexed {len(chunks)} chunks.")

    def query_collection(self, document_id: str, query_embedding: List[float], top_k: int = 5):
        """
        Queries a document-specific collection for similar chunks.
        """
        collection_name = f"document_{document_id.replace('-', '_')}"
        log_event("VectorStore", f"Querying collection: {collection_name} for top_{top_k} matches...")
        
        try:
            collection = self._client.get_collection(name=collection_name)
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=["documents", "metadatas", "distances"]
            )
            return results
        except Exception as e:
            log_event("VectorStore", f"Query failed for collection {collection_name}: {e}", level="ERROR")
            return None

    def delete_collection(self, document_id: str):
        """
        Deletes a document-specific collection.
        """
        collection_name = f"document_{document_id.replace('-', '_')}"
        log_event("VectorStore", f"Deleting collection: {collection_name}")
        try:
            self._client.delete_collection(name=collection_name)
            log_event("VectorStore", f"Collection {collection_name} deleted.")
        except Exception as e:
            log_event("VectorStore", f"Failed to delete collection {collection_name}: {e}", level="WARNING")

# Global accessor
def get_vector_store():
    return VectorStore()
