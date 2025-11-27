import React, { useState } from "react";
import axios from "axios";
import { FiSend, FiRefreshCw } from "react-icons/fi";

export default function Chat() {
  const [q, setQ] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("query", q);
      form.append("top_k", 5);
      const resp = await axios.post("http://localhost:8000/api/query", form, { timeout: 120000 });
      const { answer, results } = resp.data;
      setHistory((h) => [{ question: q, answer, results }, ...h]);
      setQ("");
    } catch (err) {
      console.error(err);
      alert("Query failed — check backend");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setHistory([]);

  return (
    <div className="card chat-card">
      <div className="card-header chat-header">
        <h3>Ask about uploaded manuals</h3>
        <div className="chat-actions">
          <button className="btn ghost" onClick={clear}><FiRefreshCw /> Clear</button>
        </div>
      </div>

      <div className="card-body chat-body">
        <div className="chat-input-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask a maintenance question (e.g., 'How to change gearbox oil?')"
            onKeyDown={(e) => e.key === "Enter" && ask()}
          />
          <button className="btn primary" onClick={ask} disabled={loading}>
            <FiSend /> {loading ? "Searching..." : "Ask"}
          </button>
        </div>

        <div className="history">
          {history.length === 0 ? (
            <div className="muted">Ask a question to see answers and the retrieved context.</div>
          ) : history.map((h, idx) => (
            <div className="qa" key={idx}>
              <div className="question">Q: {h.question}</div>
              <div className="answer">{h.answer}</div>

              <div className="context-list">
                <div className="context-title">Retrieved context</div>
                {h.results && h.results.length ? h.results.map((r, j) => (
                  <div key={j} className="context-card">
                    <div className="meta">doc: <code className="mono">{r.metadata.doc_id}</code> • score: {r.score.toFixed(3)}</div>
                    <div className="ctx-text">{r.metadata.text.length > 400 ? r.metadata.text.slice(0, 400) + "..." : r.metadata.text}</div>
                  </div>
                )) : <div className="muted">No context returned.</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
