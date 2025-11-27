# utils.py
import os
import io
import uuid
from typing import List

UPLOAD_DIR = "backend/app/uploads"
DATA_DIR = "backend/app/data"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def save_bytes_to_file(b: bytes, original_filename: str) -> str:
    ext = os.path.splitext(original_filename)[1] or ""
    fname = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, fname)
    with open(path, "wb") as f:
        f.write(b)
    return path

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
    text = text.replace("\r\n", "\n").strip()
    if len(text) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks
