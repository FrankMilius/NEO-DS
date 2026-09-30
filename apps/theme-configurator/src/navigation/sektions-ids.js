// ==========================================================================
// Sektions-IDs der Navigation (Plan v2, 3.4)
// ==========================================================================
// Flache Liste aller Sektionen, die die Sidebar anbietet — Grundlage fuer
// Registry (sektionen.js) und Hash-Router (hash-router.js). Bewusst ohne
// Komponenten-Importe, damit der Router leichtgewichtig testbar bleibt.
// ==========================================================================

import { navigationTree } from '../data/navigation-builder.js'

/** Startsektion: bei unbekanntem Hash und als Vorgabe (wie in stores/theme/kern.js). */
export const START_SEKTION = 'foundation-colors'

function sammle (knoten, ziel) {
  for (const k of knoten) {
    if (k.section) ziel.push(k.section)
    if (Array.isArray(k.children)) sammle(k.children, ziel)
  }
  return ziel
}

/** Alle Sektions-IDs der Navigation in Anzeigereihenfolge, ohne Dubletten. */
export const NAVIGATIONS_SEKTIONEN = Object.freeze([...new Set(sammle(navigationTree, []))])

const _bekannt = new Set(NAVIGATIONS_SEKTIONEN)

/** Gehoert die ID zu einer Sektion der Navigation? */
export function istNavigationsSektion (id) {
  return typeof id === 'string' && _bekannt.has(id)
}
