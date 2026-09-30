// Theme-Store · UI-Zustand: aktives Set, Vorschau, Sektion, Auswahl, Hervorhebung, Arena-Filter
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { state } from './kern.js'

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export function setActiveThemeSet(themeSet) {
  state.activeThemeSet = themeSet
}

export function setPreviewMode(mode) {
  state.previewMode = mode
  // Merke den Preview Mode fuer die aktuelle Sektion
  state.sectionPreviewModes[state.activeSection] = mode
}

export function setActiveSection(sectionId) {
  state.activeSection = sectionId
  state.arenaSelection = null
  resetArenaFilters()
  // Gespeicherten Preview Mode der Sektion wiederherstellen, sonst Light als Default
  state.previewMode = state.sectionPreviewModes[sectionId] || 'light'
}

export function selectToken(token) {
  state.selectedToken = token
}

export function setArenaSelection(componentId, specimenId, tokenGroups) {
  state.arenaSelection = { componentId, specimenId, tokenGroups }
}

export function clearArenaSelection() {
  state.arenaSelection = null
}

// ---------------------------------------------------------------------------
// Sync Geometry + Visual Highlighting
// ---------------------------------------------------------------------------

export function setSyncGeometry(val) {
  state.syncGeometry = val
}

export function getFormVariant() {
  return state.formVariant[state.activeThemeSet] || 'outlined'
}

export function setFormVariant(variant) {
  state.formVariant[state.activeThemeSet] = variant
}

export function setHighlightedToken(tokenId, property) {
  state.highlightedToken = tokenId ? { tokenId, property } : null
}

export function clearHighlightedToken() {
  state.highlightedToken = null
}

// ---------------------------------------------------------------------------
// Arena Filters
// ---------------------------------------------------------------------------

export function setArenaFilter(category, filterMap) {
  state.arenaFilters[category] = filterMap
}

export function resetArenaFilters() {
  // Alle Kategorien zuruecksetzen (dynamisch)
  for (const key of Object.keys(state.arenaFilters)) {
    delete state.arenaFilters[key]
  }
}
