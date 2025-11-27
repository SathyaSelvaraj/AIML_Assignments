import React from "react";
import { FiFileText, FiClipboard } from "react-icons/fi";

export default function DocumentList({ docs }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Uploaded Documents</h3>
      </div>
      <div className="card-body">
        {docs.length === 0 ? (
          <div className="muted">No documents uploaded yet. Upload a manual to get started.</div>
        ) : (
          <ul className="doc-list">
            {docs.map((d, i) => (
              <li key={i} className="doc-item">
                <div className="doc-left">
                  <FiFileText size={20} />
                </div>
                <div className="doc-mid">
                  <div className="doc-title">DocID: <code className="mono">{d.doc_id}</code></div>
                  <div className="muted">Chunks: {d.num_chunks}</div>
                </div>
                <div className="doc-right">
                  <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(d.doc_id)}>
                    <FiClipboard /> Copy ID
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
