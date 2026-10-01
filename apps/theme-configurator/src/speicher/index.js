// @ts-check
// ==========================================================================
// Speicher-Abstraktion des Theme-Konfigurators (Plan v2, 2.6)
// ==========================================================================
// Die App speichert heute im Browser (localStorage) und ueber den lokalen
// Docs-Server. Kuenftig speichert sie in Drupal (neo Workplace, Config
// Tools) — siehe docs/adr/ADR-002-speichern-in-drupal.md und
// docs/api/theme-konfigurator.openapi.yaml.
//
// Auswahl (Standard: 'lokal', also Verhalten wie bisher):
//   1. window.NEO_KONFIGURATOR = { speicher: 'drupal', basisUrl,
//        csrfToken | csrfTokenUrl, rechte: ['ansehen', 'bearbeiten',
//        'veroeffentlichen'] }   — setzt die Drupal-Seite im Einstieg
//        (aus drupalSettings; eine Instanz je Kunde, daher kein `kunde`)
//   2. import.meta.env: VITE_NEO_SPEICHER, VITE_NEO_BASIS_URL,
//        VITE_NEO_CSRF_TOKEN_URL, VITE_NEO_RECHTE (kommagetrennt)
//                                       — fuer lokale Entwicklung
// window gewinnt vor env.
//
// Rechte (Entscheidung Frage 2): ansehen, bearbeiten, veroeffentlichen.
// Lokal hat man alle Rechte; mit Drupal die aus der Konfiguration (ohne
// Angabe nur 'ansehen'). darf(recht) blendet in der App aus und verhindert
// unnoetige Aufrufe — verbindlich prueft der Server (403).
// ==========================================================================

/**
 * Schnittstelle beider Adapter (lokal.js, drupal.js).
 * @typedef {object} Speicher
 * @property {'lokal'|'drupal'} art
 * @property {{ veroeffentlichen: boolean, aktivieren: boolean, konflikterkennung: boolean, branchesUndReleases: boolean }} faehigkeiten
 * @property {string[]} rechte                                    Teilmenge von RECHTE
 * @property {() => Promise<object[]>} liste                      Katalog (ThemeMeta[], drupal mit `aktiv`)
 * @property {(id: string) => Promise<{meta, daten, etag}|null>} lade
 * @property {(e: {meta, daten, etag?}) => Promise<{meta, daten?, etag}>} speichere
 * @property {(id: string, o?: {etag}) => Promise<void>} loesche
 * @property {(id: string) => Promise<object[]>} aktiviere        nur drupal: genau ein Theme aktiv
 * @property {(id: string, o: {etag, kontrast, css, notiz?}) => Promise<object>} veroeffentliche
 * @property {(id: string, format: 'css'|'abweichungen') => Promise<string>} exportiere
 * @property {() => Promise<object|null>} ladeStandard            NEO-Standard (Werkseinstellung)
 * @property {(payload: object) => Promise<object>} sichereEntwurf nur lokal: POST /api/save-theme
 */

import { erzeugeLokalenSpeicher } from './lokal.js'
import { erzeugeDrupalSpeicher } from './drupal.js'
import { SpeicherFehler } from './fehler.js'

export { SpeicherFehler, meldungFuer, istCsrfFehler } from './fehler.js'
export { pruefeKontrast } from './kontrast.js'
export { abweichungenBerechnen, zusammenfuehren } from './abweichungen.js'
export { inhaltsHash, kanonischesJson } from './inhalts-hash.js'

/** Die drei Rechte (Entscheidung Frage 2). Ein Recht zum Uebergehen des Kontrast-Tors gibt es nicht. */
export const RECHTE = ['ansehen', 'bearbeiten', 'veroeffentlichen']

const ARTEN = ['lokal', 'drupal']

/**
 * Konfiguration aus window.NEO_KONFIGURATOR und import.meta.env zusammensetzen.
 * @param {object} [fenster]
 * @param {Partial<ImportMetaEnv>} [env]
 */
export function leseKonfiguration(
  fenster = globalThis.NEO_KONFIGURATOR,
  env = (typeof import.meta !== 'undefined' && import.meta.env) || {}
) {
  const ausEnv = {
    speicher: env.VITE_NEO_SPEICHER,
    basisUrl: env.VITE_NEO_BASIS_URL,
    csrfTokenUrl: env.VITE_NEO_CSRF_TOKEN_URL,
    rechte: env.VITE_NEO_RECHTE ? String(env.VITE_NEO_RECHTE).split(',').map(r => r.trim()).filter(Boolean) : undefined,
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

/**
 * Hat die angemeldete Person dieses Recht? Lokal: immer. Drupal: laut
 * Konfiguration (window.NEO_KONFIGURATOR.rechte).
 * @param {'ansehen'|'bearbeiten'|'veroeffentlichen'} recht
 */
export function darf(recht, sp = speicher()) {
  return RECHTE.includes(recht) && Array.isArray(sp?.rechte) && sp.rechte.includes(recht)
}
