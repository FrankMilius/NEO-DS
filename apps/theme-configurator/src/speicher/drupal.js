// ==========================================================================
// Speicher-Adapter "drupal" (Plan v2, 2.6)
// ==========================================================================
// Spricht die REST-Schnittstelle aus docs/api/theme-konfigurator.openapi.yaml
// (Vertrag nach den Entscheidungen vom 01.10.2026, ADR-002):
//
//   GET    {basis}/themes                         Liste (mit `aktiv`)
//   POST   {basis}/themes                         anlegen
//   GET    {basis}/themes/{id}                    lesen (ETag = Inhalts-Hash)
//   PUT    {basis}/themes/{id}                    speichern (If-Match Pflicht)
//   DELETE {basis}/themes/{id}                    loeschen (If-Match Pflicht)
//   POST   {basis}/themes/{id}/aktivieren         genau eines aktiv
//   POST   {basis}/themes/{id}/veroeffentlichen   CSS + Kontrast (If-Match)
//   GET    {basis}/themes/{id}/export?format=…    css | abweichungen
//   GET    {basis}/neo-standard                   Werkseinstellung (mit Version)
//
// Grundsaetze
//   - Eine Drupal-Instanz je Kunde: kein {kunde} im Pfad (Frage 3a).
//   - Sitzungs-Cookie (credentials: 'same-origin'), schreibende Aufrufe mit
//     X-CSRF-Token (fest aus window.NEO_KONFIGURATOR/drupalSettings oder
//     einmal von csrfTokenUrl geholt) (Frage 1).
//   - Config Entity ohne Revisionen: ETag = SHA-256 des kanonischen JSON
//     (inhalts-hash.js). 412 = inzwischen geaendert, 428 = If-Match fehlt,
//     409 = Zustandskonflikt. Der Adapter loest nichts selbst auf: neu laden
//     und entscheiden (Frage 7).
//   - Gespeichert werden nur ABWEICHUNGEN vom NEO-Standard (abweichungen.js);
//     beim Laden fuehrt der Adapter sie mit dem aktuellen Standard zusammen —
//     ein neuer Standard wirkt so automatisch (Frage 9b). Nach aussen bleibt
//     das Format der vollstaendige App-Stand (Entscheidung C).
//   - Anfragen ueber 1 MB schickt der Adapter gar nicht erst (Frage 10).
//   - Fehlerkoerper nach RFC 9457 (application/problem+json) landen in
//     fehler.details (bei 422 des Kontrast-Tors: details.kontrast).
// ==========================================================================

import { SpeicherFehler, artAusStatus, MELDUNGEN } from './fehler.js'
import { abweichungenBerechnen, zusammenfuehren } from './abweichungen.js'
import { standardDaten, standardVersion } from './standard.js'

/** Hoechstgroesse einer Anfrage (Bytes, UTF-8) — Entscheidung Frage 10. */
export const MAX_ANFRAGE_BYTES = 1024 * 1024

/** Rechte, die der Drupal-Speicher kennt (Frage 2). */
export const ALLE_RECHTE = ['ansehen', 'bearbeiten', 'veroeffentlichen']

/**
 * @param {object} konfig
 * @param {string} konfig.basisUrl     z. B. '/api/neo-theme-konfigurator/v1'
 * @param {string} [konfig.csrfToken]  fertiges Token (z. B. per drupalSettings)
 * @param {string} [konfig.csrfTokenUrl='/session/token']
 * @param {string[]} [konfig.rechte=['ansehen']]  Rechte der angemeldeten Person
 * @param {Function} [konfig.fetch]    fuer Tests
 * @returns {import('./index.js').Speicher}
 */
export function erzeugeDrupalSpeicher(konfig = {}) {
  const { basisUrl, csrfTokenUrl = '/session/token' } = konfig
  if (!basisUrl) throw new SpeicherFehler('konfiguration', 'Drupal-Speicher: basisUrl fehlt.')
  const holeFetch = () => konfig.fetch || globalThis.fetch
  const basis = basisUrl.replace(/\/+$/, '')
  const themePfad = (id) => `/themes/${encodeURIComponent(id)}`
  const rechte = Array.isArray(konfig.rechte) ? ALLE_RECHTE.filter(r => konfig.rechte.includes(r)) : ['ansehen']
  let csrfToken = konfig.csrfToken || null
  let standardCache = null

  async function token() {
    if (csrfToken) return csrfToken
    let res
    try {
      res = await holeFetch()(csrfTokenUrl, { credentials: 'same-origin' })
    } catch (e) {
      throw new SpeicherFehler('netzwerk', MELDUNGEN.netzwerk, { cause: e })
    }
    if (!res.ok) throw new SpeicherFehler(artAusStatus(res.status), 'CSRF-Token konnte nicht geladen werden.', { status: res.status })
    csrfToken = (await res.text()).trim()
    return csrfToken
  }

  /**
   * @returns {Promise<{ daten: any, etag: string|null, status: number }>}
   */
  async function anfrage(methode, pfad, { body, etag, text = false } = {}) {
    const headers = { Accept: text ? '*/*' : 'application/json' }
    let koerper
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
      koerper = JSON.stringify(body)
      if (new TextEncoder().encode(koerper).length > MAX_ANFRAGE_BYTES) {
        throw new SpeicherFehler('zu-gross', MELDUNGEN['zu-gross'], { status: 413 })
      }
    }
    if (methode !== 'GET') headers['X-CSRF-Token'] = await token()
    if (etag) headers['If-Match'] = etag

    let res
    try {
      res = await holeFetch()(basis + pfad, { method: methode, headers, credentials: 'same-origin', body: koerper })
    } catch (e) {
      throw new SpeicherFehler('netzwerk', MELDUNGEN.netzwerk, { cause: e })
    }

    const antwortEtag = res.headers?.get?.('ETag') ?? null
    if (!res.ok) {
      let details = null
      try { details = await res.json() } catch { /* kein JSON-Koerper */ }
      const art = artAusStatus(res.status)
      const meldung = details?.detail || details?.title || MELDUNGEN[art]
      throw new SpeicherFehler(art, meldung, {
        status: res.status,
        details,
        aktuellEtag: details?.aktuellerEtag ?? antwortEtag,
      })
    }
    if (res.status === 204) return { daten: null, etag: antwortEtag, status: 204 }
    const daten = text ? await res.text() : await res.json()
    return { daten, etag: antwortEtag, status: res.status }
  }

  /** NEO-Standard (Datei + vollstaendige Daten), einmal je Adapter geladen. */
  async function standard() {
    if (!standardCache) {
      const { daten } = await anfrage('GET', '/neo-standard')
      standardCache = { datei: daten, daten: standardDaten(daten), version: standardVersion(daten) }
    }
    return standardCache
  }

  /** ThemeDokument (API) -> { meta, daten (zusammengefuehrt), abweichungen, etag } */
  async function dokument({ daten: dok, etag }) {
    const st = await standard()
    const abweichungen = dok.abweichungen || {}
    return {
      meta: dok.meta,
      daten: zusammenfuehren(st.daten, abweichungen),
      abweichungen,
      etag: etag ?? (dok.meta?.hash ? `"${dok.meta.hash}"` : null),
    }
  }

  return {
    art: 'drupal',
    faehigkeiten: { veroeffentlichen: true, aktivieren: true, konflikterkennung: true, branchesUndReleases: false },
    rechte,

    async liste() {
      const { daten } = await anfrage('GET', '/themes')
      return daten.themes || []
    },

    async lade(id) {
      try {
        return await dokument(await anfrage('GET', themePfad(id)))
      } catch (e) {
        if (e.art === 'nicht-gefunden') return null
        throw e
      }
    },

    /**
     * Neu anlegen (ohne meta.id) oder speichern (mit meta.id und etag).
     * Gesendet werden nur die Abweichungen vom aktuellen NEO-Standard.
     * @param {{ meta: object, daten: object, etag?: string }} eintrag
     */
    async speichere({ meta, daten, etag }) {
      if (meta?.id && !etag) {
        // Vorhandenes Theme ohne bekannten Stand: nicht blind ueberschreiben.
        throw new SpeicherFehler('revision-fehlt', MELDUNGEN['revision-fehlt'])
      }
      const st = await standard()
      const body = {
        meta: { ...(meta?.id ? { id: meta.id } : {}), name: meta?.name, version: meta?.version },
        abweichungen: abweichungenBerechnen(daten, st.daten),
        standardVersion: st.version,
      }
      if (!meta?.id) return dokument(await anfrage('POST', '/themes', { body }))
      return dokument(await anfrage('PUT', themePfad(meta.id), { body, etag }))
    },

    async loesche(id, { etag } = {}) {
      await anfrage('DELETE', themePfad(id), { etag })
    },

    /** Genau ein Theme ist aktiv; der Server liefert die neue Liste. */
    async aktiviere(id) {
      const { daten } = await anfrage('POST', `${themePfad(id)}/aktivieren`, { body: {} })
      return daten.themes || []
    },

    /**
     * @param {string} id
     * @param {{ etag: string, kontrast: object, css: string, notiz?: string }} opt
     * @returns {Promise<{ meta: object, css: { pfad, url?, version, hash, ausgeliefert }, etag }>}
     */
    async veroeffentliche(id, { etag, kontrast, css, notiz } = {}) {
      if (typeof css !== 'string' || !css) throw new SpeicherFehler('ungueltig', 'Veröffentlichen: CSS fehlt.')
      const { daten, etag: neu } = await anfrage('POST', `${themePfad(id)}/veroeffentlichen`, {
        etag,
        body: { kontrast, css, ...(notiz ? { notiz } : {}) },
      })
      return { ...daten, etag: neu ?? (daten?.meta?.hash ? `"${daten.meta.hash}"` : null) }
    },

    /** format: 'css' (veroeffentlichte Datei) oder 'abweichungen' (gespeicherter Inhalt). */
    async exportiere(id, format) {
      const { daten } = await anfrage('GET', `${themePfad(id)}/export?format=${encodeURIComponent(format)}`, { text: true })
      return daten
    },

    async ladeStandard() {
      return (await standard()).datei
    },

    sichereEntwurf() {
      return Promise.reject(new SpeicherFehler('nicht-unterstuetzt', 'Drupal-Speicher: bitte speichereTheme() verwenden.'))
    },
  }
}
