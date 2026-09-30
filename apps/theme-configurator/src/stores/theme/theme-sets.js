// Theme-Store · Vergleich und Kopie zwischen NEO- und Kunden-Set
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { state } from './kern.js'
import { saveToStorage } from './persistenz.js'

// ---------------------------------------------------------------------------
// Multi-Theme Operations (Phase 5)
// ---------------------------------------------------------------------------

/**
 * Kopiert alle Component-Overrides von einem Theme-Set zum anderen.
 * @param {'neo'|'customer'} fromSet
 * @param {'neo'|'customer'} toSet
 */
export function copyThemeOverrides(fromSet, toSet) {
  // Component Overrides
  state.componentOverrides[toSet] = { ...state.componentOverrides[fromSet] }

  // Semantic Tokens (Light + Dark)
  state.themes[toSet] = {
    light: { ...state.themes[fromSet].light },
    dark: { ...state.themes[fromSet].dark }
  }

  // Foundation Overrides
  state.foundationOverrides[toSet] = JSON.parse(JSON.stringify(state.foundationOverrides[fromSet] || {}))

  // Primitive Overrides
  state.primitiveOverrides[toSet] = { ...state.primitiveOverrides[fromSet] }

  saveToStorage()
}

/**
 * Gibt alle Tokens zurueck die zwischen zwei Theme-Sets divergieren.
 * @param {'neo'|'customer'} setA
 * @param {'neo'|'customer'} setB
 * @returns {{ semantic: string[], component: string[], foundation: string[] }}
 */
export function diffThemeSets(setA = 'neo', setB = 'customer') {
  const diff = { semantic: [], component: [], foundation: [] }

  // Semantic Diffs (Light + Dark)
  for (const mode of ['light', 'dark']) {
    const a = state.themes[setA]?.[mode] || {}
    const b = state.themes[setB]?.[mode] || {}
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of allKeys) {
      if (a[key] !== b[key] && !diff.semantic.includes(`${mode}:${key}`)) {
        diff.semantic.push(`${mode}:${key}`)
      }
    }
  }

  // Component Override Diffs
  const compA = state.componentOverrides[setA] || {}
  const compB = state.componentOverrides[setB] || {}
  const allCompKeys = new Set([...Object.keys(compA), ...Object.keys(compB)])
  for (const key of allCompKeys) {
    if (compA[key] !== compB[key]) diff.component.push(key)
  }

  // Foundation Override Diffs
  const fndA = state.foundationOverrides[setA] || {}
  const fndB = state.foundationOverrides[setB] || {}
  const allFndKeys = new Set([...Object.keys(fndA), ...Object.keys(fndB)])
  for (const key of allFndKeys) {
    if (JSON.stringify(fndA[key]) !== JSON.stringify(fndB[key])) diff.foundation.push(key)
  }

  return diff
}

/**
 * Setzt das Customer Theme auf Neo-Defaults zurueck.
 */
export function resetCustomerToNeo() {
  copyThemeOverrides('neo', 'customer')
}
