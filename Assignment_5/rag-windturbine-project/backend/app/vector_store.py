# vector_store.py
import faiss
import numpy as np
import os
import pickle

INDEX_PATH = "backend/app/data/faiss.index"
META_PATH = "backend/app/data/metadata.pkl"

class SimpleVectorStore:
    def __init__(self, dim:int):
        self.dim = dim
        self._load_or_create()

    def _load_or_create(self):
        if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
            try:
                self.index = faiss.read_index(INDEX_PATH)
                with open(META_PATH, "rb") as f:
                    self.metadata = pickle.load(f)
            except Exception:
                self._create_new()
        else:
            self._create_new()

    def _create_new(self):
        # use IP (inner product) on normalized vectors for cosine similarity
        self.index = faiss.IndexFlatIP(self.dim)
        self.metadata = []

    def add(self, embeddings: np.ndarray, metadatas: list):
        # embeddings expected shape (n, dim), dtype float32
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)
        self.metadata.extend(metadatas)
        self._save()

    def query(self, q_emb: np.ndarray, top_k: int = 5):
        # q_emb shape (1, dim)
        faiss.normalize_L2(q_emb)
        distances, indices = self.index.search(q_emb, top_k)
        results = []
        for dist_row, idx_row in zip(distances, indices):
            for score, idx in zip(dist_row, idx_row):
                if idx < 0 or idx >= len(self.metadata):
                    continue
                meta = self.metadata[idx]
                results.append({"score": float(score), "metadata": meta})
        return results

    def _save(self):
        faiss.write_index(self.index, INDEX_PATH)
        with open(META_PATH, "wb") as f:
            pickle.dump(self.metadata, f)
