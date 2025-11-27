import React, { useState } from "react";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");
    const form = new FormData();
    form.append("file", file);

    try {
      setStatus("Uploading...");
      setProgress(2);
      const resp = await axios.post("http://localhost:8000/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
        timeout: 120000
      });
      setStatus("Uploaded");
      setProgress(100);
      if (onUploaded) onUploaded(resp.data);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
      setProgress(0);
      alert("Upload failed — check backend and console");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <FiUploadCloud size={22} />
          <div>
            <h3>Upload Manual</h3>
            <p className="muted">PDF, DOCX, or TXT — the system will index the content for search</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="upload-row">
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setStatus("");
              setProgress(0);
            }}
          />
          <button className="btn primary" onClick={handleUpload}>Upload</button>
        </div>

        <div className="upload-info">
          <div className="filename">{file ? file.name : "No file chosen"}</div>
          <div className="status">{status}</div>
        </div>

        <div className="progress-bar" aria-hidden>
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
