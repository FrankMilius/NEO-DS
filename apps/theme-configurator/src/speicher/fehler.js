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
