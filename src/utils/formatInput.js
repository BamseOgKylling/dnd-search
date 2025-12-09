// src/utils/formatInput.js
export function formatQuery(input) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")                       // bryt upp accent-tecken
    .replace(/[\u0300-\u036f]/g, "")        // ta bort diakritiska tecken
    .replace(/[^a-z0-9\s-]/g, "")           // ta bort specialtecken (utom bindestreck)
    .replace(/\s+/g, "-")                   // mellanslag -> bindestreck
    .replace(/-+/g, "-");                   // flera bindestreck -> ett
}
