// ==========================================================================
// Speicher-Adapter "drupal" (Plan v2, 2.6) — ENTWURF
// ==========================================================================
// Spricht die REST-Schnittstelle aus docs/api/theme-konfigurator.openapi.yaml.
// Die Schnittstelle ist noch nicht mit den Entwicklern abgestimmt (siehe
// docs/adr/ADR-002-speichern-in-drupal.md) — Pfade und Felder koennen sich
// aendern; dann hier und in der OpenAPI-Datei gemeinsam anpassen.
//
// Grundsaetze
//   - Sitzungs-Cookie von Drupal (credentials: 'same-origin'), bei jedem
//     schreibenden Aufruf Header X-CSRF-Token. Token fest konfiguriert oder
//     einmal von csrfTokenUrl geholt (Drupal-Core: /session/token).
//   - Optimistische Sperre: GET liefert ETag (= Revisions-ID), PUT/DELETE/
//     Wiederherstellen/Veroeffentlichen schicken If-Match. 412 = inzwischen
//     geaendert, 409 = Zustandskonflikt; beides wird als SpeicherFehler mit
//     istKonflikt === true geworfen. Der Adapter loest Konflikte NICHT
//     selbst auf — das entscheidet die Oberflaeche (neu laden / vergleichen).
//   - Fehlerkoerper nach RFC 9457 (application/problem+json) werden in
//     fehler.details durchgereicht.
// ==========================================================================

import { SpeicherFehler, artAusStatus, MELDUNGEN } from './fehler.js'

/**
 * @param {object} konfig
 * @param {string} konfig.basisUrl     z. B. '/api/neo-theme-konfigurator/v1'
 * @param {string} konfig.kunde        Kunden-/Mandantenkennung (Pfadsegment)
 * @param {string} [konfig.csrfToken]  fertiges Token (z. B. per drupalSettings)
 * @param {string} [konfig.csrfTokenUrl='/session/token']
 * @param {Function} [konfig.fetch]    fuer Tests
 * @returns {import('./index.js').Speicher}
 */
export function erzeugeDrupalSpeicher(konfig = {}) {
  const { basisUrl, kunde, csrfTokenUrl = '/session/token' } = konfig
  if (!basisUrl) throw new SpeicherFehler('konfiguration', 'Drupal-Speicher: basisUrl fehlt.')
  if (!kunde) throw new SpeicherFehler('konfiguration', 'Drupal-Speicher: kunde fehlt.')
  const holeFetch = () => konfig.fetch || globalThis.fetch
  const basis = basisUrl.replace(/\/+$/, '')
  const themesPfad = `/kunden/${encodeURIComponent(kunde)}/themes`
  const themePfad = (id) => `${themesPfad}/${encodeURIComponent(id)}`
  let csrfToken = konfig.csrfToken || null

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
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (methode !== 'GET') headers['X-CSRF-Token'] = await token()
    if (etag) headers['If-Match'] = etag

    let res
    try {
      res = await holeFetch()(basis + pfad, {
        method: methode,
        headers,
        credentials: 'same-origin',
        body: body === undefined ? undefined : JSON.stringify(body),
      })
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

  /** ThemeDokument (API) -> { meta, daten, etag } */
  const dokument = ({ daten, etag }) => ({
    meta: daten.meta,
    daten: daten.daten,
    etag: etag ?? daten.meta?.revision ?? null,
  })

  return {
    art: 'drupal',
    faehigkeiten: { revisionen: true, veroeffentlichen: true, konflikterkennung: true },

    async liste() {
      const { daten } = await anfrage('GET', themesPfad)
      return daten.themes || []
    },

    async lade(id) {
      try {
        return dokument(await anfrage('GET', themePfad(id)))
      } catch (e) {
        if (e.art === 'nicht-gefunden') return null
        throw e
      }
    },

    /**
     * Neu anlegen (ohne meta.id / ohne etag) oder speichern (mit etag).
     * @param {{ meta: object, daten: object, etag?: string, notiz?: string }} eintrag
     */
    async speichere({ meta, daten, etag, notiz }) {
      const body = { meta, daten, ...(notiz ? { revisionsnotiz: notiz } : {}) }
      if (!meta?.id || !etag) {
        if (meta?.id && !etag) {
          // Vorhandenes Theme ohne bekannte Revision: nicht blind ueberschreiben.
          throw new SpeicherFehler('revision-fehlt', MELDUNGEN['revision-fehlt'])
        }
        return dokument(await anfrage('POST', themesPfad, { body }))
      }
      return dokument(await anfrage('PUT', themePfad(meta.id), { body, etag }))
    },

    async loesche(id, { etag } = {}) {
      await anfrage('DELETE', themePfad(id), { etag })
    },

    async revisionen(id) {
      const { daten } = await anfrage('GET', `${themePfad(id)}/revisionen`)
      return daten.revisionen || []
    },

    async stelleWiederHer(id, revisionId, { etag } = {}) {
      return dokument(await anfrage('POST', `${themePfad(id)}/revisionen/${encodeURIComponent(revisionId)}/wiederherstellen`, { etag, body: {} }))
    },

    /**
     * @param {string} id
     * @param {{ etag: string, kontrast: object, notiz?: string }} opt
     */
    async veroeffentliche(id, { etag, kontrast, notiz } = {}) {
      const { daten, etag: neu } = await anfrage('POST', `${themePfad(id)}/veroeffentlichen`, {
        etag,
        body: { kontrast, ...(notiz ? { notiz } : {}) },
      })
      return { ...daten, etag: neu ?? daten?.meta?.revision ?? null }
    },

    async exportiere(id, format) {
      const { daten } = await anfrage('GET', `${themePfad(id)}/export?format=${encodeURIComponent(format)}`, { text: true })
      return daten
    },

    async ladeStandard() {
      const { daten } = await anfrage('GET', '/neo-standard')
      return daten
    },

    sichereEntwurf() {
      return Promise.reject(new SpeicherFehler('nicht-unterstuetzt', 'Drupal-Speicher: bitte speichereTheme() verwenden.'))
    },
  }
}
