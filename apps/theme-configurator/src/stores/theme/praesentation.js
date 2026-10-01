// @ts-check
// Theme-Store · Bereich Praesentation (Plan v2, 2.5)
// ==========================================================================
// Quelle ist foundation.praesentation (tokens.generated.js). Abweichungen
// liegen je Theme-Set unter foundationOverrides[set].praesentation als
// Punkt-Pfade: { 'welten.wissen.tief': 'forest.700' }. So bleiben alte
// Staende gueltig (fehlt der Schluessel, gilt die Quelle) und Undo, Branches
// und Export behandeln sie wie jede andere Foundation-Kategorie.

import { computed } from 'vue'
import { praesentation as QUELLE } from '../../data/tokens.generated.js'
import { state } from './kern.js'

const kopie = (o) => JSON.parse(JSON.stringify(o))

/** Wert an einem Punkt-Pfad lesen (undefined, wenn es ihn nicht gibt). */
export function lesePfad(obj, pfad) {
  return String(pfad).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

function setzePfad(obj, pfad, wert) {
  const teile = String(pfad).split('.')
  const letzter = teile.pop()
  let o = obj
  for (const k of teile) {
    if (o[k] == null || typeof o[k] !== 'object') return false
    o = o[k]
  }
  if (!(letzter in o)) return false
  o[letzter] = kopie(wert)
  return true
}

/** Quelle mit den Abweichungen eines Sets zusammengefuehrt. */
export function praesentationFuer(overrides) {
  const ergebnis = kopie(QUELLE)
  for (const [pfad, wert] of Object.entries(overrides || {})) setzePfad(ergebnis, pfad, wert)
  return ergebnis
}

export const currentPraesentation = computed(() =>
  praesentationFuer(state.foundationOverrides[state.activeThemeSet]?.praesentation)
)

/** Nur Pfade, die es in der Quelle gibt; gleicher Wert wie die Quelle loescht die Abweichung. */
export function updatePraesentation(pfad, wert) {
  const quelle = lesePfad(QUELLE, pfad)
  if (quelle === undefined || (quelle && typeof quelle === 'object' && !Array.isArray(quelle))) return
  if (Array.isArray(quelle) !== Array.isArray(wert) && wert != null) return
  const set = (state.foundationOverrides[state.activeThemeSet] ??= {})
  const abw = (set.praesentation ??= {})
  if (wert == null || JSON.stringify(wert) === JSON.stringify(quelle)) delete abw[pfad]
  else abw[pfad] = kopie(wert)
}

export function resetPraesentation() {
  const set = state.foundationOverrides[state.activeThemeSet]
  if (set?.praesentation) set.praesentation = {}
}
