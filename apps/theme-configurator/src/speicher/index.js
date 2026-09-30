// ==========================================================================
// Speicher-Abstraktion des Theme-Konfigurators (Plan v2, 2.6)
// ==========================================================================
// Die App speichert heute im Browser (localStorage) und ueber den lokalen
// Docs-Server. Kuenftig speichert sie in Drupal (neo Workplace, Config
// Tools) — siehe docs/adr/ADR-002-speichern-in-drupal.md und
// docs/api/theme-konfigurator.openapi.yaml.
//
// Auswahl (Standard: 'lokal', also Verhalten wie bisher):
//   1. window.NEO_KONFIGURATOR = { speicher: 'drupal', basisUrl, kunde,
//        csrfToken | csrfTokenUrl }        — setzt die Drupal-Seite im Einstieg
//   2. import.meta.env: VITE_NEO_SPEICHER, VITE_NEO_BASIS_URL, VITE_NEO_KUNDE,
//        VITE_NEO_CSRF_TOKEN_URL           — fuer lokale Entwicklung
// window gewinnt vor env.
//
// @typedef {object} Speicher
// @property {'lokal'|'drupal'} art
// @property {{ revisionen: boolean, veroeffentlichen: boolean, konflikterkennung: boolean }} faehigkeiten
// @property {() => Promise<object[]>} liste                      Katalog (ThemeMeta[])
// @property {(id: string) => Promise<{meta, daten, etag}|null>} lade
// @property {(e: {meta, daten, etag?, notiz?}) => Promise<{meta, daten?, etag}>} speichere
// @property {(id: string, o?: {etag}) => Promise<void>} loesche
// @property {(id: string) => Promise<object[]>} revisionen
// @property {(id: string, revisionId: string, o?: {etag}) => Promise<{meta, daten, etag}>} stelleWiederHer
// @property {(id: string, o: {etag, kontrast, notiz?}) => Promise<object>} veroeffentliche
// @property {(id: string, format: 'css'|'dtcg'|'json') => Promise<string>} exportiere
// @property {() => Promise<object|null>} ladeStandard            NEO-Standard (Werkseinstellung)
// @property {(payload: object) => Promise<object>} sichereEntwurf nur lokal: POST /api/save-theme
// ==========================================================================

import { erzeugeLokalenSpeicher } from './lokal.js'
import { erzeugeDrupalSpeicher } from './drupal.js'
import { SpeicherFehler } from './fehler.js'

export { SpeicherFehler } from './fehler.js'
export { pruefeKontrast } from './kontrast.js'

const ARTEN = ['lokal', 'drupal']

/** Konfiguration aus window.NEO_KONFIGURATOR und import.meta.env zusammensetzen. */
export function leseKonfiguration(
  fenster = globalThis.NEO_KONFIGURATOR,
  env = (typeof import.meta !== 'undefined' && import.meta.env) || {}
) {
  const ausEnv = {
    speicher: env.VITE_NEO_SPEICHER,
    basisUrl: env.VITE_NEO_BASIS_URL,
    kunde: env.VITE_NEO_KUNDE,
    csrfTokenUrl: env.VITE_NEO_CSRF_TOKEN_URL,
  }
  const k = { ...ausEnv, ...(fenster || {}) }
  for (const s of Object.keys(k)) if (k[s] === undefined || k[s] === '') delete k[s]
  return { speicher: 'lokal', ...k }
}

/** Adapter zur Konfiguration erzeugen. Unbekannte Art -> SpeicherFehler. */
export function erzeugeSpeicher(konfig = leseKonfiguration()) {
  const art = konfig.speicher || 'lokal'
  if (!ARTEN.includes(art)) {
    throw new SpeicherFehler('konfiguration', `Unbekannter Speicher "${art}" (erlaubt: ${ARTEN.join(', ')}).`)
  }
  return art === 'drupal' ? erzeugeDrupalSpeicher(konfig) : erzeugeLokalenSpeicher(konfig)
}

let aktiv = null

/** Der aktive Speicher (beim ersten Aufruf aus der Konfiguration erzeugt). */
export function speicher() {
  if (!aktiv) aktiv = erzeugeSpeicher()
  return aktiv
}

/** Speicher ersetzen (Tests, Einbettung). null = beim naechsten Aufruf neu aus der Konfiguration. */
export function setzeSpeicher(adapter) {
  aktiv = adapter
}
