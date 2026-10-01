// ==========================================================================
// Inhalts-Hash = ETag (Plan v2, 2.6 — ADR-002, Folge 1)
// ==========================================================================
// Config Entities haben keine Revisionen. Als Konfliktkennung dient deshalb
// ein Hash über den gespeicherten Inhalt:
//
//   ETag = "\"" + hex(SHA-256(kanonischesJson(inhalt))) + "\""
//
// kanonischesJson: Objektschlüssel rekursiv nach Codepunkten sortiert, Listen
// in ihrer Reihenfolge, keine Leerzeichen, UTF-8, Zahlen wie JSON.stringify.
// PHP-Gegenstück: assoziative Arrays rekursiv mit ksort(SORT_STRING)
// sortieren (Listen, array_is_list(), NICHT), dann
// json_encode($wert, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES).
// Prüfvektor in tests/speicher/inhalts-hash.test.js und in der OpenAPI-Datei.
//
// Den ETag erzeugt allein der Server; die App behandelt ihn als undurchsichtig.
// inhaltsHash() ist die Referenz, damit Server und Werkzeuge gleich rechnen.
// ==========================================================================

/** Kanonisches JSON (stabil gegen Schlüsselreihenfolge). */
export function kanonischesJson(wert) {
  if (wert === null || typeof wert !== 'object') return JSON.stringify(wert)
  if (Array.isArray(wert)) return '[' + wert.map(v => (v === undefined ? 'null' : kanonischesJson(v))).join(',') + ']'
  const teile = Object.keys(wert)
    .filter(k => wert[k] !== undefined)
    .sort()
    .map(k => JSON.stringify(k) + ':' + kanonischesJson(wert[k]))
  return '{' + teile.join(',') + '}'
}

const hex = (puffer) => Array.from(new Uint8Array(puffer), b => b.toString(16).padStart(2, '0')).join('')

/**
 * SHA-256 (hex) des kanonischen JSON. Browser: crypto.subtle (nur in
 * sicheren Kontexten, also https). Ohne crypto.subtle: Node-Modul node:crypto.
 * @returns {Promise<string>}
 */
export async function inhaltsHash(objekt) {
  const text = kanonischesJson(objekt)
  const subtle = globalThis.crypto?.subtle
  if (subtle) return hex(await subtle.digest('SHA-256', new TextEncoder().encode(text)))
  const modul = 'node:crypto'
  const { createHash } = await import(/* @vite-ignore */ modul)
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

/** ETag-Schreibweise (starker ETag in Anführungszeichen). */
export const alsEtag = (hash) => `"${hash}"`
