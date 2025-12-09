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

  if (!data && !error) return <div className="overlay"><div className="card">Loading...</div></div>;
  if (error) return <div className="overlay"><div className="card">Error: {error}</div></div>;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        <h1 className="title">{data.name}</h1>
        <div className="divider" />

        {/* Monster */}
        {data.type && (
          <>
            <div className="stat-block">
              <div><strong>Type:</strong> {data.type}</div>
              <div><strong>Armor Class:</strong> {Array.isArray(data.armor_class) ? (data.armor_class[0]?.value ?? "-") : (data.armor_class ?? "-")}</div>
              <div><strong>Hit Points:</strong> {data.hit_points ?? "-"}</div>
              <div><strong>Speed:</strong> {typeof data.speed === "object" ? (data.speed.walk ?? Object.values(data.speed)[0]) : (data.speed ?? "-")}</div>
              {data.size && <div><strong>Size:</strong> {data.size}</div>}
              {data.alignment && <div><strong>Alignment:</strong> {data.alignment}</div>}
            </div>

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

        {/* Spell */}
        {data.school && (
          <>
            <div><strong>Level:</strong> {data.level}</div>
            <div><strong>School:</strong> {data.school?.name}</div>
            <div><strong>Casting Time:</strong> {data.casting_time}</div>
            <div><strong>Range:</strong> {data.range}</div>
            {data.components && <div><strong>Components:</strong> {data.components.join(", ")}</div>}
            {data.desc && (
              <>
                <div className="section-title">Description</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{data.desc.join("\n\n")}</div>
              </>
            )}
          </>
        )}

        {/* Item/Weapon */}
        {data.equipment_category && !data.school && !data.type && (
          <>
            <div><strong>Category:</strong> {data.equipment_category?.name}</div>
            <div><strong>Cost:</strong> {data.cost?.quantity ?? "-"} {data.cost?.unit ?? ""}</div>
            <div><strong>Weight:</strong> {data.weight ?? "-"}</div>

            {data.weapon_category && <div><strong>Weapon Category:</strong> {data.weapon_category}</div>}
            {data.weapon_range && <div><strong>Weapon Range:</strong> {data.weapon_range}</div>}
            {data.damage && (
              <div>
                <strong>Damage:</strong> {data.damage.damage_dice} {data.damage.damage_type?.name}
              </div>
            )}
            {data.range && typeof data.range === "object" && (
              <div>
                <strong>Range:</strong> Normal {data.range.normal}, Long {data.range.long}
              </div>
            )}
            {data.properties && data.properties.length > 0 && (
  <div style={{ marginTop: 6, textAlign: "center" }}>
    <strong>Properties:</strong>
    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px", marginTop: "4px", justifyContent: "center" }}>
      {data.properties.map((p) => (
        <span
          key={p.index}
          style={{
            background: "#7a2b1e",
            color: "white",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {p.name}
        </span>
      ))}
    </div>
  </div>
)}

            {data.desc && data.desc.length > 0 && (
              <>
                <div className="section-title">Description</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{data.desc.join("\n\n")}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
