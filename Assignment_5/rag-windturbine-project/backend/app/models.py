# models.py
from pydantic import BaseModel
from typing import List, Dict, Any

class UploadResponse(BaseModel):
    doc_id: str
    num_chunks: int

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchItem(BaseModel):
    score: float
    text: str
    doc_id: str
