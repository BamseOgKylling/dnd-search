// src/App.tsx
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import InfoCard from "./components/InfoCard";
import { searchAll } from "./utils/searchApi";

function App() {
  const [results, setResults] = useState([]);
const [selectedUrl, setSelectedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  async function handleSearch(term) {
    setLoading(true);
    try {
      setLastQuery(term);
      const res = await searchAll(term);
      setResults(res);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
   <div
  style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "24px 12px",       // mindre padding på små skärmar
    textAlign: "center",
    background: "#fdf5e6",
    boxSizing: "border-box"
  }}
>
  <h1 style={{ marginBottom: 16, fontSize: "1.8rem" }}>D&D Search Tool</h1>
  <SearchBar onSearch={handleSearch} />

  <div style={{ marginTop: 18, width: "100%", maxWidth: 480 }}>
    {loading && <div>Searching for “{lastQuery}” …</div>}
    {!loading && results.length === 0 && lastQuery && <div>Inga träffar för “{lastQuery}”</div>}

    <div style={{ marginTop: 12 }}>
      {results.map(r => (
        <div
          key={r.index + r.type}
          onClick={() => setSelectedUrl(r.url)}
          style={{
            cursor: "pointer",
            padding: "10px",
            borderBottom: "1px solid #eee",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.6)",
            marginBottom: 6
          }}
        >
          <strong>{r.name}</strong> <span style={{ color: "#7a2b1e" }}>({r.type})</span>
        </div>
      ))}
    </div>
  </div>

  {selectedUrl && <InfoCard url={selectedUrl} onClose={() => setSelectedUrl(null)} />}
</div>


  );
}

export default App;
