from services.vector_store import get_vector_store
from services.embedding import get_embedding_service
import os

def debug_rag():
    document_id = '8a098f47-8b12-4794-a24f-5f8b8b25931e'
    question = 'What are the candidate skills?'
    
    print(f"Testing RAG for doc {document_id}")
    embedding_service = get_embedding_service()
    query_embedding = embedding_service.encode([question])[0]
    
    vs = get_vector_store()
    results = vs.query_collection(document_id, query_embedding, top_k=5)
    
    if results:
        print("Distances:", results.get('distances'))
        if results.get('documents') and results['documents'][0]:
            print(f"Found {len(results['documents'][0])} chunks.")
            for i, doc in enumerate(results['documents'][0]):
                dist = results['distances'][0][i]
                sim = 1 - (dist / 2)
                print(f"Chunk {i}: Dist={dist:.4f}, Score={sim:.4f}")
        else:
            print("No documents found in results.")
    else:
        print("Query failed (results is None).")

if __name__ == "__main__":
    debug_rag()
