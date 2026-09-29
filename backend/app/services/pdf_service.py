import io
import logging
from typing import Tuple, List, Dict, Any
from pypdf import PdfReader

logger = logging.getLogger("proposal_agent.pdf")

class PDFService:
    @staticmethod
    def extract_text(file_bytes: bytes) -> Tuple[str, List[Dict[str, Any]]]:
        """Extract page-aware text from PDF bytes. Returns (full_text, pages_data)."""
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            full_text = ""
            pages_data = []

            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                full_text += f"\n--- PAGE {i+1} ---\n{text}\n"
                pages_data.append({
                    "page_number": i + 1,
                    "text": text,
                    "character_count": len(text)
                })

            clean_text = full_text.strip()
            if not clean_text:
                logger.warning("PDF text extraction resulted in empty text. May be a scanned document.")
                clean_text = "Scanned document or non-extractable text. Processing metadata."

            return clean_text, pages_data
        except Exception as e:
            logger.error(f"Error parsing PDF file: {e}")
            raise ValueError(f"Failed to parse PDF file: {str(e)}")

pdf_service = PDFService()
