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
      <div><strong>Type:</strong> {data.size} {data.type}, {data.alignment}</div>
      <div><strong>Armor Class:</strong> {Array.isArray(data.armor_class) ? (data.armor_class.map(a => a.value).join(", ") || "-") : data.armor_class || "-"}</div>
      <div><strong>Hit Points:</strong> {data.hit_points} ({data.hit_dice})</div>
      <div><strong>Speed:</strong> {typeof data.speed === "object" ? Object.entries(data.speed).map(([k,v]) => `${k}: ${v}`).join(", ") : data.speed || "-"}</div>
    </div>

    <div className="stat-block">
      <strong>Stats:</strong> STR {data.strength} | DEX {data.dexterity} | CON {data.constitution} | INT {data.intelligence} | WIS {data.wisdom} | CHA {data.charisma}
    </div>

    {data.proficiencies && data.proficiencies.length > 0 && (
      <div><strong>Proficiencies:</strong> {data.proficiencies.map(p => p.name).join(", ")}</div>
    )}

    <div>
      <strong>Damage Vulnerabilities:</strong> {data.damage_vulnerabilities.length ? data.damage_vulnerabilities.map(d => d.name || d).join(", ") : "None"}
    </div>
    <div>
      <strong>Damage Resistances:</strong> {data.damage_resistances.length ? data.damage_resistances.map(d => d.name || d).join(", ") : "None"}
    </div>
    <div>
      <strong>Damage Immunities:</strong> {data.damage_immunities.length ? data.damage_immunities.map(d => d.name || d).join(", ") : "None"}
    </div>
    <div>
      <strong>Condition Immunities:</strong> {data.condition_immunities.length ? data.condition_immunities.map(c => c.name || c).join(", ") : "None"}
    </div>

    {data.senses && (
      <div>
        <strong>Senses:</strong> {Object.entries(data.senses).map(([k,v]) => `${k}: ${v}`).join(", ")}
      </div>
    )}

    <div><strong>Languages:</strong> {data.languages || "None"}</div>
    <div><strong>Challenge Rating:</strong> {data.challenge_rating} | XP: {data.xp}</div>

    {data.special_abilities.length > 0 && (
      <>
        <div className="section-title">Special Abilities</div>
        {data.special_abilities.map(sa => (
          <div key={sa.name}><strong>{sa.name}:</strong> {sa.desc}</div>
        ))}
      </>
    )}

    {data.actions.length > 0 && (
      <>
        <div className="section-title">Actions</div>
        {data.actions.map(a => (
          <div key={a.name}><strong>{a.name}:</strong> {a.desc}</div>
        ))}
      </>
    )}

    {data.legendary_actions.length > 0 && (
      <>
        <div className="section-title">Legendary Actions</div>
        {data.legendary_actions.map(la => (
          <div key={la.name}><strong>{la.name}:</strong> {la.desc}</div>
        ))}
      </>
    )}

    {data.reactions.length > 0 && (
      <>
        <div className="section-title">Reactions</div>
        {data.reactions.map(r => (
          <div key={r.name}><strong>{r.name}:</strong> {r.desc}</div>
        ))}
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

    {data.area_of_effect && (
      <div>
        <strong>Area of Effect:</strong> {data.area_of_effect.type} {data.area_of_effect.size} ft.
      </div>
    )}

    {data.components && (
      <div>
        <strong>Components:</strong> {data.components.join(", ")}
        {data.material && <span> ({data.material})</span>}
      </div>
    )}

    {data.ritual && <div><strong>Ritual:</strong> Yes</div>}
    {data.duration && <div><strong>Duration:</strong> {data.duration}</div>}
    {data.concentration && <div><strong>Concentration:</strong> Yes</div>}

    {data.damage && (
      <div>
        <strong>Damage:</strong> {data.damage.damage_at_slot_level
          ? `At level 3: ${data.damage.damage_at_slot_level["3"]} ${data.damage.damage_type?.name}`
          : `${data.damage.damage_dice} ${data.damage.damage_type?.name}`}
      </div>
    )}

    {data.dc && (
      <div>
        <strong>Save:</strong> {data.dc.dc_type.name} save, {data.dc.dc_success}
      </div>
    )}

    {data.classes && (
      <div>
        <strong>Classes:</strong> {data.classes.map(c => c.name).join(", ")}
      </div>
    )}

    {data.subclasses && (
      <div>
        <strong>Subclasses:</strong> {data.subclasses.map(s => s.name).join(", ")}
      </div>
    )}

    {data.desc && (
      <>
        <div className="section-title">Description</div>
        <div style={{ whiteSpace: "pre-wrap" }}>{data.desc.join("\n\n")}</div>
      </>
    )}

    {data.higher_level && data.higher_level.length > 0 && (
      <>
        <div className="section-title">At Higher Levels</div>
        <div style={{ whiteSpace: "pre-wrap" }}>{data.higher_level.join("\n\n")}</div>
      </>
    )}
  </>
)}


        {/* Item/Weapon/Armor */}
{data.equipment_category && !data.school && !data.type && (
  <>
    <div><strong>Category:</strong> {data.equipment_category?.name}</div>

    {/* Armor-specific fields */}
{data.armor_category && (
  <div>
    <strong>Armor Type:</strong> {data.armor_category} | 
    <strong> AC:</strong> {data.armor_class?.base ?? "-"} {data.armor_class?.dex_bonus ? "(Dex Bonus)" : "(No Dex Bonus)"}
  </div>
)}
{data.str_minimum > 0 && <div><strong>Strength Requirement:</strong> {data.str_minimum}</div>}
{data.stealth_disadvantage && <div><strong>Stealth:</strong> Disadvantage</div>}


    {/* Common fields */}
    <div><strong>Cost:</strong> {data.cost?.quantity ?? "-"} {data.cost?.unit ?? ""}</div>
    <div><strong>Weight:</strong> {data.weight ?? "-"}</div>

    {/* Weapon-specific fields */}
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
 

    {/* Properties */}
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

    {/* Description */}
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
