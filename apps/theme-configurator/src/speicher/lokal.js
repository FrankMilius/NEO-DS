// ==========================================================================
// Speicher-Adapter "lokal" (Plan v2, 2.6) — heutiges Verhalten
// ==========================================================================
// localStorage (Arbeitsstand, benannte Themes, Katalog) und die beiden
// Endpunkte des lokalen Docs-Servers (scripts/docs-server.js):
//   POST /api/save-theme          schreibt website/data/custom-theme.json
//   GET  /api/neo-theme-defaults  Werkseinstellung (data/neo-theme-defaults/)
//
// Die synchronen Helfer unten sind die EINZIGE Stelle, die diese Schluessel
// kennt; persistenz.js und themes.js rufen sie auf (vorher standen die
// localStorage-Aufrufe dort direkt — Verhalten unveraendert).
// Keine Revisionen, kein Veroeffentlichen, keine Konflikterkennung.
// ==========================================================================

import { SpeicherFehler } from './fehler.js'

export const LOKALE_SCHLUESSEL = {
  arbeitsstand: 'neo-theme-configurator',
  katalog: 'neo-theme-configurator-saved-themes',
  themePraefix: 'neo-theme-',
  // nur zur Bestandsaufnahme — gehoeren dem Branch-Store (stores/branches.js)
  branches: 'neo-theme-branches',
  releases: 'neo-theme-releases',
}

const themeSchluessel = (id) => `${LOKALE_SCHLUESSEL.themePraefix}${id}`

// ---------------------------------------------------------------------------
// Synchrone Helfer (werfen wie localStorage selbst; Aufrufer fangen ab)
// ---------------------------------------------------------------------------

/** Arbeitsstand lesen: Objekt oder null. JSON-Fehler werden geworfen. */
export function leseArbeitsstand() {
  const raw = localStorage.getItem(LOKALE_SCHLUESSEL.arbeitsstand)
  return raw ? JSON.parse(raw) : null
}

export function schreibeArbeitsstand(daten) {
  localStorage.setItem(LOKALE_SCHLUESSEL.arbeitsstand, JSON.stringify(daten))
}

/** Katalog der benannten Themes: Rohwert (kann auch kein Array sein) oder null. */
export function leseKatalog() {
  const raw = localStorage.getItem(LOKALE_SCHLUESSEL.katalog)
  return raw ? JSON.parse(raw) : null
}

export function schreibeKatalog(liste) {
  localStorage.setItem(LOKALE_SCHLUESSEL.katalog, JSON.stringify(liste))
}

/** Schnappschuss eines benannten Themes oder null. */
export function leseTheme(id) {
  const raw = localStorage.getItem(themeSchluessel(id))
  return raw ? JSON.parse(raw) : null
}

export function schreibeTheme(id, schnappschuss) {
  localStorage.setItem(themeSchluessel(id), JSON.stringify(schnappschuss))
}

export function loescheTheme(id) {
  localStorage.removeItem(themeSchluessel(id))
}

// ---------------------------------------------------------------------------
// Docs-Server
// ---------------------------------------------------------------------------

/** POST /api/save-theme — wirft bei status !== 'ok'. */
export async function sendeAnDocsServer(payload, f = globalThis.fetch) {
  const res = await f('/api/save-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (data.status !== 'ok') {
    throw new Error(data.message || 'Server save failed')
  }
  return data
}

/** GET /api/neo-theme-defaults — Werkseinstellung oder null. Netzwerkfehler werden geworfen. */
export async function ladeStandardVomDocsServer(f = globalThis.fetch) {
  const res = await f('/api/neo-theme-defaults')
  if (!res.ok) return null
  const data = await res.json()
  return data.status === 'ok' && data.defaults ? data.defaults : null
}

// ---------------------------------------------------------------------------
// Adapter (Schnittstelle siehe speicher/index.js)
// ---------------------------------------------------------------------------

function nichtUnterstuetzt(was) {
  return Promise.reject(new SpeicherFehler('nicht-unterstuetzt', `Lokaler Speicher: ${was} gibt es nur mit Drupal.`))
}

/** @returns {import('./index.js').Speicher} */
export function erzeugeLokalenSpeicher({ fetch: f } = {}) {
  const holeFetch = () => f || globalThis.fetch
  return {
    art: 'lokal',
    faehigkeiten: { revisionen: false, veroeffentlichen: false, konflikterkennung: false },

    async liste() {
      const liste = leseKatalog()
      return Array.isArray(liste) ? liste : []
    },

    async lade(id) {
      const snap = leseTheme(id)
      if (!snap) return null
      const { meta = null, ...daten } = snap
      return { meta, daten, etag: meta?.updatedAt ?? null }
    },

    /** Schreibt Schnappschuss und Katalogeintrag. meta.id ist Pflicht. */
    async speichere({ meta, daten }) {
      if (!meta?.id) throw new SpeicherFehler('ungueltig', 'Lokaler Speicher: meta.id fehlt.')
      const m = { ...meta, updatedAt: meta.updatedAt || new Date().toISOString() }
      schreibeTheme(m.id, { ...daten, meta: m })
      const katalog = Array.isArray(leseKatalog()) ? leseKatalog() : []
      const i = katalog.findIndex(t => t.id === m.id)
      if (i >= 0) katalog[i] = m; else katalog.push(m)
      schreibeKatalog(katalog)
      return { meta: m, etag: m.updatedAt }
    },

    async loesche(id) {
      loescheTheme(id)
      const katalog = leseKatalog()
      if (Array.isArray(katalog)) schreibeKatalog(katalog.filter(t => t.id !== id))
    },

    async revisionen() { return [] },
    stelleWiederHer() { return nichtUnterstuetzt('Revisionen') },
    veroeffentliche() { return nichtUnterstuetzt('Veroeffentlichen') },
    exportiere() { return nichtUnterstuetzt('Server-Export') },

    ladeStandard() { return ladeStandardVomDocsServer(holeFetch()) },
    sichereEntwurf(payload) { return sendeAnDocsServer(payload, holeFetch()) },
  }
}
