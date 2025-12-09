// src/components/InfoCard.jsx
import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { fetchDetails } from "../utils/searchApi";

export default function InfoCard({ url, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showImage, setShowImage] = useState(false);

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

  // Hantera bild-URL
  const imageUrl = data.image
    ? data.image.startsWith("http")
      ? data.image
      : `https://www.dnd5eapi.co${data.image}`
    : null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        <h1 className="title">{data.name}</h1>
        <div className="divider" />

        {/* Visa bild-knapp */}
{imageUrl && !showImage && (
  <button onClick={() => setShowImage(true)}>Visa bild</button>
)}

{/* Visa bilden om showImage är true */}
{imageUrl && showImage && (
  <img
    src={imageUrl}
    alt={data.name}
    style={{
      width: "100%",
      maxWidth: "400px",
      height: "auto",
      borderRadius: "8px",
      marginBottom: "12px"
    }}
  />
)}


      {/* Monster */}
{data.type && (
  <>  
  


    <div className="stat-block">
      <div><strong>Type:</strong> {data.type}</div>
      <div><strong>Size:</strong> {data.size}</div>
      <div><strong>Alignment:</strong> {data.alignment}</div>
      <div>
        <strong>Armor Class:</strong>{" "}
        {Array.isArray(data.armor_class) 
          ? (data.armor_class[0]?.value ?? "-") 
          : (data.armor_class?.base ?? "-")}
      </div>
      <div><strong>Hit Points:</strong> {data.hit_points ?? "-"}</div>
      <div>
        <strong>Speed:</strong>{" "}
        {typeof data.speed === "object" ? Object.entries(data.speed).map(([k,v]) => `${k}: ${v}`).join(", ") : data.speed}
      </div>
      <div><strong>STR:</strong> {data.strength}, <strong>DEX:</strong> {data.dexterity}, <strong>CON:</strong> {data.constitution}</div>
      <div><strong>INT:</strong> {data.intelligence}, <strong>WIS:</strong> {data.wisdom}, <strong>CHA:</strong> {data.charisma}</div>

      {data.proficiencies && data.proficiencies.length > 0 && (
        <div>
          <strong>Proficiencies:</strong>{" "}
          {data.proficiencies.map(p => `${p.proficiency.name} +${p.value}`).join(", ")}
        </div>
      )}

      {data.damage_vulnerabilities?.length > 0 && (
        <div><strong>Vulnerabilities:</strong> {data.damage_vulnerabilities.join(", ")}</div>
      )}
      {data.damage_resistances?.length > 0 && (
        <div><strong>Resistances:</strong> {data.damage_resistances.join(", ")}</div>
      )}
      {data.damage_immunities?.length > 0 && (
        <div><strong>Immunities:</strong> {data.damage_immunities.join(", ")}</div>
      )}
      {data.condition_immunities?.length > 0 && (
        <div><strong>Condition Immunities:</strong> {data.condition_immunities.map(c => c.name).join(", ")}</div>
      )}

      {data.senses && (
        <div>
          <strong>Senses:</strong>{" "}
          {Object.entries(data.senses).map(([k,v]) => `${k}: ${v}`).join(", ")}
        </div>
      )}

      {data.languages && <div><strong>Languages:</strong> {data.languages}</div>}
      {data.challenge_rating && <div><strong>CR:</strong> {data.challenge_rating} ({data.xp} XP)</div>}
    </div>

    {/* Special Abilities */}
    {data.special_abilities && data.special_abilities.length > 0 && (
      <>
        <div className="section-title">Special Abilities</div>
        <ul>
          {data.special_abilities.map(sa => (
            <li key={sa.name}>
              <strong>{sa.name}:</strong> {sa.desc}
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Actions */}
    {data.actions && data.actions.length > 0 && (
      <>
        <div className="section-title">Actions</div>
        <ul>
          {data.actions.map(a => (
            <li key={a.name}>
              <strong>{a.name}:</strong> {a.desc}
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Legendary Actions */}
    {data.legendary_actions && data.legendary_actions.length > 0 && (
      <>
        <div className="section-title">Legendary Actions</div>
        <ul>
          {data.legendary_actions.map(la => (
            <li key={la.name}>
              <strong>{la.name}:</strong> {la.desc}
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Reactions */}
    {data.reactions && data.reactions.length > 0 && (
      <>
        <div className="section-title">Reactions</div>
        <ul>
          {data.reactions.map(r => (
            <li key={r.name}>
              <strong>{r.name}:</strong> {r.desc}
            </li>
          ))}
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


{/* Equipment / Weapon / Armor / Mount / Vehicle / Gear */}
{data.equipment_category && !data.school && !data.type && (
  <>
    <div><strong>Category:</strong> {data.equipment_category?.name}</div>

    {/* Armor */}
    {data.armor_category && (
      <div>
        <strong>Armor Type:</strong> {data.armor_category} | 
        <strong> AC:</strong> {data.armor_class?.base ?? "-"} {data.armor_class?.dex_bonus ? "(Dex Bonus)" : "(No Dex Bonus)"}
      </div>
    )}
    {data.str_minimum > 0 && <div><strong>Strength Requirement:</strong> {data.str_minimum}</div>}
    {data.stealth_disadvantage && <div><strong>Stealth:</strong> Disadvantage</div>}

    {/* Weapon */}
    {data.weapon_category && <div><strong>Weapon Category:</strong> {data.weapon_category}</div>}
    {data.weapon_range && <div><strong>Weapon Range:</strong> {data.weapon_range}</div>}
    {data.damage && <div><strong>Damage:</strong> {data.damage.damage_dice} {data.damage.damage_type?.name}</div>}
    {data.range && typeof data.range === "object" && (
      <div><strong>Range:</strong> Normal {data.range.normal}, Long {data.range.long}</div>
    )}

    {/* Mount / Vehicle */}
    {data.vehicle_category && <div><strong>Vehicle/Animal Category:</strong> {data.vehicle_category}</div>}
    {data.speed && <div><strong>Speed:</strong> {typeof data.speed === "object" ? `${data.speed.quantity} ${data.speed.unit}` : data.speed}</div>}
    {data.capacity && <div><strong>Capacity:</strong> {data.capacity}</div>}

    {/* Gear Pack */}
    {data.gear_category && <div><strong>Gear Category:</strong> {data.gear_category?.name}</div>}
    {data.contents?.length > 0 && (
      <>
        <div className="section-title">Contents</div>
        <ul>
          {data.contents.map((c, idx) => (
            <li key={idx}>{c.quantity} × {c.item.name}</li>
          ))}
        </ul>
      </>
    )}

    {/* Cost */}
    {data.cost?.quantity && <div><strong>Cost:</strong> {data.cost.quantity} {data.cost.unit}</div>}

    {/* Weight */}
    {data.weight && <div><strong>Weight:</strong> {data.weight}</div>}

    {/* Properties */}
    {data.properties?.length > 0 && (
      <div style={{ marginTop: 6, textAlign: "center" }}>
        <strong>Properties:</strong>
        <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px", marginTop: "4px", justifyContent: "center" }}>
          {data.properties.map((p) => (
            <span key={p.index} style={{ background: "#7a2b1e", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold" }}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Description */}
    {data.desc?.length > 0 && (
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
