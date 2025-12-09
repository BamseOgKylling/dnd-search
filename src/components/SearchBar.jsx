// src/components/SearchBar.jsx
import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value || value.trim().length < 1) return;
    onSearch(value);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",   // centrera horisontellt
        flexWrap: "wrap",           // radbrytning på små skärmar
        marginBottom: 12
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Sök monster, spells, items..."
        style={{
          padding: "10px 12px",
          width: "100%",
          maxWidth: 300,           // smalare på mobiler
          fontSize: "1rem",
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />
      <button
        onClick={submit}
        style={{
          padding: "10px 16px",
          fontSize: "1rem",
          borderRadius: 6,
          border: "none",
          background: "#7a2b1e",
          color: "white",
          cursor: "pointer"
        }}
      >
        Sök
      </button>
    </div>
  );
}
