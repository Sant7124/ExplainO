from services.embedding import get_embedding_service
from services.vector_store import get_vector_store
from services.logger import log_event
from ai.llm import ask_llm
from core.config import settings
from typing import List, Dict, Optional

class RAGPipeline:
    def __init__(self, similarity_threshold: float = 0.15):
        self.embedding_service = get_embedding_service()
        self.vector_store = get_vector_store()
        self.similarity_threshold = similarity_threshold

    def get_contextual_answer(self, document_id: str, question: str) -> Dict:
        """
        Main RAG flow: Embed Question -> Retrieve Chunks -> Ground Answer -> Cite Sources.
        """
        if settings.DEMO_MODE:
            log_event("RAGPipeline", f"DEMO_MODE: Simulating answer for question: {question}")
            return {
                "answer": f"In Demo Mode, I'm simulating a response to your question: '{question}'. ExplainO uses advanced RAG technology to search your document context and then applies reasoning logic to find the best answer. Get a real API key to see the full power!",
                "sources": [{"page": "1", "text": "This is a demo context since we are in Demo Mode.", "similarity": 1.0}],
                "confidence": "high"
            }

        try:
            # Fetch document metadata for context (e.g., filename)
            from services.database import DocumentMetadata, engine
            from sqlmodel import Session, select
            with Session(engine) as session:
                doc_meta = session.exec(select(DocumentMetadata).where(DocumentMetadata.id == document_id)).first()
                filename = doc_meta.filename if doc_meta else "Unknown Document"

            log_event("RAGPipeline", f"Processing question for document {document_id} ({filename}): {question}")

            # 1. Embed Question
            query_embedding = self.embedding_service.encode([question])[0]

            # 2. Retrieve Similar Chunks
            results = self.vector_store.query_collection(document_id, query_embedding, top_k=8)
            
            # DEBUG: Log retrieval results
            if results:
                distances = results.get('distances', [[]])[0]
                log_event("RAGPipeline", f"Retrieved {len(distances)} chunks. Min distance: {min(distances) if distances else 'N/A'}")
            
            if not results or not results['documents'] or not results['documents'][0]:
                log_event("RAGPipeline", "No context found for query.", level="WARNING")
                return {
                    "answer": "The document does not contain this information.",
                    "sources": [],
                    "confidence": "low"
                }

            # 3. Filter by Similarity Threshold
            context_parts = []
            sources = []
            
            for i, doc in enumerate(results['documents'][0]):
                distance = results['distances'][0][i]
                similarity = max(0, 1 - (distance / 2)) 
                
                # Using a much lower threshold (0.05) to ensure we get context for reasoning
                if similarity >= 0.05:
                    metadata = results['metadatas'][0][i]
                    context_parts.append(doc)
                    sources.append({
                        "page": metadata.get("page_number", "Unknown"),
                        "chunk": metadata.get("chunk_index", "N/A"),
                        "text": doc[:150] + "...",
                        "similarity": round(similarity, 3)
                    })

            if not context_parts:
                log_event("RAGPipeline", "No chunks met the similarity threshold.", level="INFO")
                return {
                    "answer": f"I couldn't find specific information in '{filename}' to answer that. Could you rephrase your question?",
                    "sources": [],
                    "confidence": "low"
                }

            # 4. Construct Prompt with Advanced Reasoning Logic
            context_text = "\n\n".join(context_parts)
            prompt = f"""
            You are 'ExplainO AI', a professional document analysis expert. 
            The user is asking about the document: "{filename}".

            THINKING PROCESS:
            1. **Locate**: First, search the CONTEXT for direct answers or specific mentions of the question's topic.
            2. **Relate & Infer**: If no direct answer exists, analyze the entire CONTEXT to relate different pieces of information. Use logic to build an answer based on what IS in the document.
            3. **Identify Subject**: If the user asks "who" or "what" this is about, look at the filename and the overall content. (e.g., if it's a resume for 'John Doe', acknowledge that the document is about John Doe).

            RULES:
            - Be conversational and helpful.
            - NEVER say "Similarity too low". If you can't find anything, say "The document doesn't seem to mention that explicitly."
            - Be precise with technical details found.
            - If the question is general (e.g. "summarize"), provide a high-level view based on the context.

            CONTEXT:
            {context_text}

            QUESTION:
            {question}

            ANSWER:
            """
            
            log_event("RAGPipeline", "Sending grounded prompt to LLM...")
            answer = ask_llm(prompt)
            
            confidence = "high" if len(sources) > 3 else "medium"

            return {
                "answer": answer,
                "sources": sources,
                "confidence": confidence
            }
        except Exception as e:
            log_event("RAGPipeline", f"Chat failed: {e}", level="ERROR")
            return {
                "answer": "I encountered an error while analyzing the document. Please try again or rephrase your question.",
                "sources": [],
                "confidence": "failed"
            }

# Global accessor
def get_rag_pipeline():
    return RAGPipeline()
