import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import Chat from "./components/Chat";

export default function App() {
  const [docs, setDocs] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleUploaded = (doc) => {
    setDocs((p) => [doc, ...p]);
    setRefreshFlag((f) => f + 1);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <div className="logo">⚙️</div>
            <div>
              <h1>RAG - Wind Turbine Manuals</h1>
              <p className="subtitle">Upload manuals • Ask maintenance questions • Get referenced answers</p>
            </div>
          </div>
          <nav className="nav">
            <a href="#" onClick={(e)=>e.preventDefault()}>Docs</a>
            <a href="#" onClick={(e)=>e.preventDefault()}>About</a>
            <a href="#" onClick={(e)=>e.preventDefault()}>Help</a>
          </nav>
        </div>
      </header>

      <main className="container grid">
        <section className="left-column">
          <UploadForm onUploaded={handleUploaded} />
          <DocumentList docs={docs} key={refreshFlag} />
        </section>

        <section className="right-column">
          <Chat />
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} WindTech RAG • Built for demo</span>
          <span className="footer-right">Backend: <code>http://localhost:8000/api</code></span>
        </div>
      </footer>
    </div>
  );
}
