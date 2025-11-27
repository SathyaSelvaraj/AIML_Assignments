# embeddings.py
from sentence_transformers import SentenceTransformer
import numpy as np

_MODEL_NAME = "all-MiniLM-L6-v2"
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)
    return _model

def embed_texts(texts):
    """
    texts: list[str]
    returns: numpy array (n, dim) dtype float32
    """
    model = get_model()
    emb = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    # ensure float32
    return emb.astype("float32")
