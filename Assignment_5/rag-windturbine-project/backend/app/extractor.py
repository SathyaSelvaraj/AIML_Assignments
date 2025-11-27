# extractor.py
import io
from typing import Optional
from PyPDF2 import PdfReader
from docx import Document

async def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    if ext == "pdf":
        try:
            with io.BytesIO(file_bytes) as fh:
                reader = PdfReader(fh)
                parts = []
                for p in reader.pages:
                    txt = p.extract_text()
                    if txt:
                        parts.append(txt)
                return "\n".join(parts)
        except Exception:
            return ""
    elif ext in ("docx", "doc"):
        try:
            with io.BytesIO(file_bytes) as fh:
                doc = Document(fh)
                return "\n".join([p.text for p in doc.paragraphs if p.text])
        except Exception:
            return ""
    else:
        # txt or fallback
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            return ""
