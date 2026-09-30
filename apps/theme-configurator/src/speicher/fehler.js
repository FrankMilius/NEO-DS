// ==========================================================================
// Speicher-Fehler (Plan v2, 2.6)
// ==========================================================================
// Ein Fehlertyp fuer alle Adapter. `art` sagt, was die Oberflaeche tun kann:
//
//   'konflikt'           409 — Zustand passt nicht (z. B. Veroeffentlichen einer
//                        nicht mehr aktuellen Revision)
//   'veraltet'           412 — If-Match passt nicht: jemand anderes hat
//                        inzwischen gespeichert (Lost-Update verhindert)
//   'revision-fehlt'     428 — Schreiben ohne If-Match
//   'nicht-angemeldet'   401
//   'verboten'           403 — Recht fehlt (oder CSRF-Token ungueltig)
//   'nicht-gefunden'     404
//   'ungueltig'          400/422 — Daten abgelehnt (Schema, Kontrast-Tor)
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
  if (status === 401) return 'nicht-angemeldet'
  if (status === 403) return 'verboten'
  if (status === 404) return 'nicht-gefunden'
  if (status === 400 || status === 422) return 'ungueltig'
  return 'server'
}

/** Deutsche Meldung fuer die Oberflaeche (alert, Toast). */
export const MELDUNGEN = {
  'konflikt': 'Das Theme wurde inzwischen geaendert. Bitte neu laden und die Aenderungen abgleichen.',
  'veraltet': 'Jemand anderes hat dieses Theme inzwischen gespeichert. Bitte neu laden und die Aenderungen abgleichen.',
  'revision-fehlt': 'Speichern ohne Revisionsangabe ist nicht erlaubt. Bitte das Theme neu laden.',
  'nicht-angemeldet': 'Die Sitzung ist abgelaufen. Bitte neu anmelden.',
  'verboten': 'Dafuer fehlt die Berechtigung.',
  'nicht-gefunden': 'Das Theme wurde nicht gefunden.',
  'ungueltig': 'Die Daten wurden abgelehnt.',
  'netzwerk': 'Der Server ist nicht erreichbar.',
  'server': 'Der Server hat einen Fehler gemeldet.',
  'nicht-unterstuetzt': 'Diese Funktion gibt es beim gewaehlten Speicher nicht.',
  'konfiguration': 'Der Speicher ist nicht richtig eingerichtet.',
}
