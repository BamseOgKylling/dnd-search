// src/utils/searchApi.js
import { formatQuery } from "./formatInput";

const BASE = "https://www.dnd5eapi.co/api/2014";

async function fetchList(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

/**
 * Söker i monsters, spells och equipment och returnerar array.
 */
export async function searchAll(input) {
  const q = formatQuery(input);

  const endpoints = [
    { endpoint: "monsters", type: "Monster" },
    { endpoint: "spells", type: "Spell" },
    { endpoint: "equipment", type: "Item" },
  ];

  // Hämta alla listor parallellt
  const lists = await Promise.all(endpoints.map(e => fetchList(e.endpoint)));

  const results = [];

  // Filtrera lokalt: matcha index eller namnet
  lists.forEach((list, idx) => {
    const type = endpoints[idx].type;

    (list.results || []).forEach(r => {
      const indexMatch = r.index?.includes(q);
      const nameMatch = r.name?.toLowerCase().includes(input.trim().toLowerCase());

      if (indexMatch || nameMatch) {
        results.push({
          index: r.index,
          name: r.name,
          url: r.url,
          type,
        });
      }
    });
  });

  // Ta bort duplikat
  const seen = new Set();
  return results.filter(r => {
    const key = r.index + r.type;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Hämta detaljer för InfoCard
 */
export async function fetchDetails(url) {
  // url kommer som "/api/2014/monsters/adult-red-dragon"
  const base = "https://www.dnd5eapi.co";
  const res = await fetch(`${base}${url}`);
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
}
