// ==========================================================================
// Speicher-Fehler (Plan v2, 2.6)
// ==========================================================================
// Ein Fehlertyp fuer alle Adapter. `art` sagt, was die Oberflaeche tun kann:
//
//   'konflikt'           409 — Zustand passt nicht (z. B. aktives Theme loeschen,
//                        nicht veroeffentlichtes Theme aktivieren)
//   'veraltet'           412 — If-Match (Inhalts-Hash) passt nicht: jemand
//                        anderes hat inzwischen gespeichert (Lost-Update verhindert)
//   'revision-fehlt'     428 — Schreiben ohne If-Match (Name aus der Zeit der
//                        Revisionen beibehalten; gemeint ist der fehlende ETag)
//   'zu-gross'           413 — Anfrage groesser als 1 MB (Entscheidung Frage 10)
//   'nicht-angemeldet'   401
//   'verboten'           403 — Recht fehlt (oder CSRF-Token ungueltig)
//   'nicht-gefunden'     404
//   'ungueltig'          400/422 — Daten abgelehnt (Schema, Kontrast-Tor des Servers)
//   'netzwerk'           fetch selbst ist gescheitert
//   'server'             5xx und alles Unerwartete
//   'nicht-unterstuetzt' der Adapter kann diese Operation nicht
//   'konfiguration'      Adapter falsch eingerichtet
// ==========================================================================

export class SpeicherFehler extends Error {
  /**
   * @param {string} art
   * @param {string} message
   * @param {{ status?: number, details?: any, aktuellEtag?: string|null, cause?: any }} [extra]
   */
  constructor(art, message, extra = {}) {
    super(message)
    this.name = 'SpeicherFehler'
    this.art = art
    this.status = extra.status ?? null
    this.details = extra.details ?? null
    this.aktuellEtag = extra.aktuellEtag ?? null
    if (extra.cause) this.cause = extra.cause
  }

  /** Jemand anderes hat gespeichert (409 oder 412) — neu laden, dann entscheiden. */
  get istKonflikt() {
    return this.art === 'konflikt' || this.art === 'veraltet'
  }
}

/** HTTP-Status -> Fehlerart. */
export function artAusStatus(status) {
  if (status === 409) return 'konflikt'
  if (status === 412) return 'veraltet'
  if (status === 428) return 'revision-fehlt'
  if (status === 413) return 'zu-gross'
  if (status === 401) return 'nicht-angemeldet'
  if (status === 403) return 'verboten'
  if (status === 404) return 'nicht-gefunden'
  if (status === 400 || status === 422) return 'ungueltig'
  return 'server'
}

/** Deutsche Meldung fuer die Oberflaeche (alert, Toast). */
export const MELDUNGEN = {
  'konflikt': 'Das Theme wurde inzwischen geändert. Bitte neu laden und die Änderungen abgleichen.',
  'veraltet': 'Jemand anderes hat dieses Theme inzwischen gespeichert. Bitte neu laden und entscheiden, welcher Stand gilt.',
  'revision-fehlt': 'Speichern ohne Stand-Kennung (ETag) ist nicht erlaubt. Bitte das Theme neu laden.',
  'zu-gross': 'Das Theme ist zu groß (höchstens 1 MB).',
  'nicht-angemeldet': 'Die Sitzung ist abgelaufen. Bitte neu anmelden.',
  'verboten': 'Dafür fehlt die Berechtigung.',
  'nicht-gefunden': 'Das Theme wurde nicht gefunden.',
  'ungueltig': 'Die Daten wurden abgelehnt.',
  'netzwerk': 'Der Server ist nicht erreichbar.',
  'server': 'Der Server hat einen Fehler gemeldet.',
  'nicht-unterstuetzt': 'Diese Funktion gibt es beim gewählten Speicher nicht.',
  'konfiguration': 'Der Speicher ist nicht richtig eingerichtet.',
}

/** CSRF-Ablehnung (403 mit Problem-Typ …/csrf oder Titel mit „CSRF“)? */
export function istCsrfFehler(fehler) {
  if (fehler?.art !== 'verboten') return false
  const d = fehler.details || {}
  return /csrf/i.test(String(d.type || '')) || /csrf/i.test(String(d.title || ''))
}

/**
 * Titel und Text für einen Hinweis-Dialog (Plan v2, 2.6, Teil 2). Nimmt
 * SpeicherFehler und beliebige Fehler; die Meldung des Servers (detail)
 * steht im Text, wo sie hilft.
 * @param {any} fehler
 * @param {string} [was]  Was gerade passiert ist, z. B. „Speichern“
 * @returns {{ titel: string, text: string }}
 */
export function meldungFuer(fehler, was = 'Die Aktion') {
  const art = fehler?.art
  const text = fehler?.message || MELDUNGEN.server
  if (istCsrfFehler(fehler)) {
    return { titel: 'Sicherheits-Token ungültig', text: 'Drupal hat die Anfrage abgelehnt, weil das Sicherheits-Token (CSRF) nicht passt — meist ist die Sitzung abgelaufen. Bitte die Seite neu laden; dein Arbeitsstand bleibt im Browser erhalten.' }
  }
  switch (art) {
    case 'netzwerk':
      return { titel: 'Keine Verbindung zu Drupal', text: `${MELDUNGEN.netzwerk} ${was} hat nicht geklappt. Bitte die Verbindung prüfen und es erneut versuchen; dein Arbeitsstand bleibt im Browser erhalten.` }
    case 'verboten':
      return { titel: 'Keine Berechtigung', text: `${text} Wende dich an die Administration, wenn du das Recht brauchst.` }
    case 'nicht-angemeldet':
      return { titel: 'Nicht angemeldet', text: MELDUNGEN['nicht-angemeldet'] }
    case 'zu-gross':
      return { titel: 'Theme zu groß', text: `${MELDUNGEN['zu-gross']} Bitte nicht benötigte eigene Schriften, Icons oder Token entfernen.` }
    case 'veraltet':
    case 'konflikt':
      return { titel: 'Das Theme wurde inzwischen geändert', text }
    case 'revision-fehlt':
      return { titel: 'Stand unbekannt', text: MELDUNGEN['revision-fehlt'] }
    case 'nicht-gefunden':
      return { titel: 'Nicht gefunden', text }
    case 'ungueltig':
      return { titel: 'Daten abgelehnt', text }
    default:
      return { titel: `${was} fehlgeschlagen`, text }
  }
}
