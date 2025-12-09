// src/components/InfoCard.jsx
import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { fetchDetails } from "../utils/searchApi";

export default function InfoCard({ url, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setData(null);
        const json = await fetchDetails(url);
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setError(e.message || "Error");
      }
    })();
    return () => { mounted = false; };
  }, [url]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        {!data && !error && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}

        {data && (
          <>
            <h1 className="title">{data.name}</h1>
            <div className="divider" />

            {/* Monster-ish */}
            {data.type && (
              <>
                <div className="stat-block">
                  <div><strong>Type:</strong> {data.type}</div>
                  <div><strong>Armor Class:</strong> {Array.isArray(data.armor_class) ? (data.armor_class[0]?.value ?? "-") : (data.armor_class ?? "-")}</div>
                  <div><strong>Hit Points:</strong> {data.hit_points ?? "-"}</div>
                  <div><strong>Speed:</strong> {typeof data.speed === "object" ? (data.speed.walk ?? Object.values(data.speed)[0]) : (data.speed ?? "-")}</div>
                </div>

                {data.size && <div><strong>Size:</strong> {data.size}</div>}
                {data.alignment && <div><strong>Alignment:</strong> {data.alignment}</div>}

                {data.actions && (
                  <>
                    <div className="section-title">Actions</div>
                    <ul>
                      {data.actions.map((a) => <li key={a.name}><strong>{a.name}:</strong> {a.desc}</li>)}
                    </ul>
                  </>
                )}
              </>
            )}

            {/* Spell-ish */}
            {data.school && (
              <>
                <div><strong>Level:</strong> {data.level}</div>
                <div><strong>School:</strong> {data.school?.name}</div>
                <div><strong>Casting Time:</strong> {data.casting_time}</div>
                <div><strong>Range:</strong> {data.range}</div>
                {data.components && <div><strong>Components:</strong> {data.components.join(", ")}</div>}
                <div className="section-title">Description</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{(data.desc || []).join("\n\n")}</div>
              </>
            )}

            {/* Item-ish */}
            {data.equipment_category && !data.school && !data.type && (
              <>
                <div><strong>Category:</strong> {data.equipment_category?.name}</div>
                <div><strong>Cost:</strong> {data.cost?.quantity ?? "-"} {data.cost?.unit ?? ""}</div>
                <div><strong>Weight:</strong> {data.weight ?? "-"}</div>
                {data.desc && <div className="section-title">Description</div>}
                {data.desc && <div style={{ whiteSpace: "pre-wrap" }}>{(data.desc || []).join("\n\n")}</div>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
