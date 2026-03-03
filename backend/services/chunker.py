from typing import List, Dict
import re
from services.logger import log_event

class DocumentChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, page_number: int = 1, start_index: int = 0) -> List[Dict]:
        """
        Splits text into overlapping chunks while preserving some semantic boundaries.
        Returns a list of dicts with text and metadata.
        """
        log_event("DocumentChunker", f"Chunking text for page {page_number} starting at index {start_index}...")
        
        # Simple recursive character splitting logic
        chunks = []
        start = 0
        text_len = len(text)
        chunk_index = start_index

        while start < text_len:
            end = start + self.chunk_size
            
            # If not at the end, try to find a natural break (period, newline)
            if end < text_len:
                # Look for the last period or newline within the last 50 chars of the chunk
                lookback = text[max(start, end-50):end]
                last_break = max(lookback.rfind('.'), lookback.rfind('\n'))
                if last_break != -1:
                    end = max(start, end-50) + last_break + 1

            chunk_text = text[start:end].strip()
            if chunk_text:
                chunks.append({
                    "text": chunk_text,
                    "metadata": {
                        "page_number": page_number,
                        "chunk_index": chunk_index
                    }
                })
                chunk_index += 1

            start = end - self.chunk_overlap
            if start < 0: start = 0
            if end >= text_len: break

        log_event("DocumentChunker", f"Generated {len(chunks)} chunks for page {page_number}.")
        return chunks

    def process_document(self, pages_text: List[str]) -> List[Dict]:
        """
        Processes a whole document (list of page texts).
        """
        all_chunks = []
        global_index = 0
        for i, page_text in enumerate(pages_text):
            page_chunks = self.chunk_text(page_text, page_number=i+1, start_index=global_index)
            all_chunks.extend(page_chunks)
            global_index += len(page_chunks)
        return all_chunks
