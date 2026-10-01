// @ts-check
// ==========================================================================
// Abweichungen vom NEO-Standard (Plan v2, 2.6 — ADR-002, Folge 3)
// ==========================================================================
// Kunden-Themes werden in Drupal nur als ABWEICHUNGEN vom NEO-Standard
// gespeichert. Beim Laden werden sie mit dem dann aktuellen Standard
// zusammengeführt — so übernimmt jedes Kunden-Theme einen neuen Standard
// automatisch (Entscheidung Frage 9b), außer an den Stellen, die der Kunde
// bewusst geändert hat.
//
// Format (Speicherformat C, auf Abweichungen reduziert):
//   - gleiche Struktur wie der App-Stand (THEME_DATA_KEYS, je Set neo/customer)
//   - Objekte werden rekursiv verglichen; nur geänderte oder neue Werte
//     stehen drin
//   - Listen (Arrays) und Werte unterschiedlichen Typs werden als Ganzes
//     ersetzt
//   - ein Schlüssel, den der Standard hat, das Theme aber nicht, steht als
//     { "$entfernt": true } drin (explizites Löschen)
//   - activeThemeSet wird unverändert mitgeführt, wenn vorhanden
//
// Garantie (tests/speicher/abweichungen.test.js):
//   zusammenfuehren(standard, abweichungenBerechnen(x, standard)) == x
// für alle Theme-Daten x (JSON-Werte).
//
// Reines Modul (kein Vue, keine Tokens): läuft auch im Prüfwerkzeug
// scripts/pruefe-kunden-themes.mjs und dient dem PHP-Server als Vorlage.
// ==========================================================================

import { THEME_DATA_KEYS } from '../stores/theme/theme-schluessel.js'

/** Markierung für „Schlüssel gegenüber dem Standard entfernt". */
export const ENTFERNT = '$entfernt'

const istObjekt = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const istEntfernt = (v) => istObjekt(v) && v[ENTFERNT] === true && Object.keys(v).length === 1
const kopie = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)))

function gleich(a, b) {
  if (a === b) return true
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
    return a.every((x, i) => gleich(x, b[i]))
  }
  if (!istObjekt(a) || !istObjekt(b)) return false
  const ka = Object.keys(a), kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every(k => Object.prototype.hasOwnProperty.call(b, k) && gleich(a[k], b[k]))
}

/** Unterschied zweier Werte; undefined = kein Unterschied. */
function diff(wert, basis) {
  if (gleich(wert, basis)) return undefined
  if (!istObjekt(wert) || !istObjekt(basis)) return kopie(wert)
  const aus = {}
  for (const k of Object.keys(wert)) {
    if (!Object.prototype.hasOwnProperty.call(basis, k)) { aus[k] = kopie(wert[k]); continue }
    const d = diff(wert[k], basis[k])
    if (d !== undefined) aus[k] = d
  }
  for (const k of Object.keys(basis)) {
    if (!Object.prototype.hasOwnProperty.call(wert, k)) aus[k] = { [ENTFERNT]: true }
  }
  // Ein leeres Objekt kann hier nicht entstehen: gleich() war false, also gibt
  // es mindestens einen Unterschied.
  return aus
}

function anwenden(basis, patch) {
  if (!istObjekt(patch) || !istObjekt(basis)) return kopie(patch)
  const aus = kopie(basis)
  for (const [k, v] of Object.entries(patch)) {
    if (istEntfernt(v)) delete aus[k]
    else if (Object.prototype.hasOwnProperty.call(aus, k)) aus[k] = anwenden(aus[k], v)
    else aus[k] = kopie(v)
  }
  return aus
}

/**
 * Abweichungen eines App-Stands vom Standard.
 * @param {object} stand     App-Stand (snapshotThemeData), ggf. mit activeThemeSet
 * @param {object} standard  vollständiger Standard (standardDaten())
 * @param {string[]} [schluessel=THEME_DATA_KEYS]
 * @returns {object} nur die abweichenden Schlüssel; {} = identisch mit dem Standard
 */
export function abweichungenBerechnen(stand, standard, schluessel = THEME_DATA_KEYS) {
  const aus = {}
  for (const k of schluessel) {
    if (stand?.[k] === undefined) continue
    const d = standard?.[k] === undefined ? kopie(stand[k]) : diff(stand[k], standard[k])
    if (d !== undefined) aus[k] = d
  }
  if (stand?.activeThemeSet) aus.activeThemeSet = stand.activeThemeSet
  return aus
}

/**
 * Standard und Abweichungen zum vollständigen App-Stand zusammenführen.
 * Der Standard wird nicht verändert.
 * @param {object} standard
 * @param {object} abweichungen
 * @param {string[]} [schluessel=THEME_DATA_KEYS]
 */
export function zusammenfuehren(standard, abweichungen = {}, schluessel = THEME_DATA_KEYS) {
  const aus = {}
  for (const k of schluessel) {
    const a = abweichungen?.[k]
    if (a === undefined) { if (standard?.[k] !== undefined) aus[k] = kopie(standard[k]); continue }
    if (istEntfernt(a)) continue
    aus[k] = standard?.[k] === undefined ? kopie(a) : anwenden(standard[k], a)
  }
  if (abweichungen?.activeThemeSet) aus.activeThemeSet = abweichungen.activeThemeSet
  return aus
}

/** true, wenn die Abweichungen leer sind (Theme == Standard). */
export function istOhneAbweichung(abweichungen) {
  return !abweichungen || Object.keys(abweichungen).filter(k => k !== 'activeThemeSet').length === 0
}
