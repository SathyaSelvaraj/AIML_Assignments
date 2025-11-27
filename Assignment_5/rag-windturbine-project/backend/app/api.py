# api.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from typing import List
import uuid

from .extractor import extract_text_from_bytes
from .embeddings import embed_texts, get_model
from .vector_store import SimpleVectorStore
from .utils import save_bytes_to_file, chunk_text
from .llm import synthesize_answer

# initialize store using embedding dim
_temp_model = get_model()
EMBED_DIM = _temp_model.get_sentence_embedding_dimension()
VSTORE = SimpleVectorStore(dim=EMBED_DIM)

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    # read bytes
    data = await file.read()
    if not data or len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    # save raw file (optional)
    path = save_bytes_to_file(data, file.filename)

    # extract text
    text = await extract_text_from_bytes(data, file.filename)
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # chunk text
    chunks = chunk_text(text, chunk_size=800, overlap=150)
    # embed
    embeddings = embed_texts(chunks)  # numpy array (n, dim)
    # metadata
    doc_id = uuid.uuid4().hex
    metadatas = [{"doc_id": doc_id, "text": c, "chunk_id": i} for i, c in enumerate(chunks)]
    # add to store
    VSTORE.add(embeddings, metadatas)

    return JSONResponse({"doc_id": doc_id, "num_chunks": len(chunks)})

@router.post("/query")
async def query(query: str = Form(...), top_k: int = Form(5)):
    if not query:
        raise HTTPException(status_code=400, detail="Query is empty")

    # embed query
    q_emb = embed_texts([query])  # shape (1, dim)
    results = VSTORE.query(q_emb, top_k=top_k)

    # return the top chunks and also a synthesized answer via Gemini
    contexts = [r["metadata"] for r in results]
    answer = synthesize_answer(query, contexts)

    return JSONResponse({"answer": answer, "results": results})
