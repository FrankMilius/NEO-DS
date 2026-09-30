// Theme-Store · Werkseinstellung, Theme-Daten-Schluessel und Undo/Redo
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a; Undo-Schritte seit 3.3c per Plugin)

import { primitiveColors, semanticDefaults } from '../../data/tokens.js'
import { deepClone, getDefaultFoundation, state } from './kern.js'

export function resetToDefaults() {
  const themeSet = state.activeThemeSet
  state.themes[themeSet].light = deepClone(semanticDefaults[`${themeSet === 'neo' ? 'neo' : 'customer'}-light`])
  state.themes[themeSet].dark = deepClone(semanticDefaults[`${themeSet === 'neo' ? 'neo' : 'customer'}-dark`])
  state.foundationOverrides[themeSet] = deepClone(getDefaultFoundation())
  state.componentOverrides[themeSet] = {}
  state.primitiveOverrides[themeSet] = {
    primary: primitiveColors.primary.base,
    secondary: primitiveColors.secondary.base,
    accent: primitiveColors.accent.base
  }
  state.customFonts[themeSet] = []
  state.focusRingMode[themeSet] = 'offset'
  state.componentLocks[themeSet] = {}
  state.componentVersions[themeSet] = {}
  state.variantDefinitions[themeSet] = {}
  state.customSpacingTokens[themeSet] = {}
  state.customRadiiTokens[themeSet] = {}
  state.customBorderWidthTokens[themeSet] = {}
  state.customMediaRatioTokens[themeSet] = {}
  state.customShadowTokens[themeSet] = {}
  state.customElevationTokens[themeSet] = {}
  state.customOpacityTokens[themeSet] = {}
  state.customZindexTokens[themeSet] = {}
  state.customMotionTokens[themeSet] = {}
  state.customMotionEffectTokens[themeSet] = {}
  state.iconLibraries[themeSet] = [
    { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
    { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
  ]
  state.iconStrokeWidths[themeSet] = {
    tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
    heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  state.iconStrokeColors[themeSet] = {
    tabler: { light: 'currentColor', dark: 'currentColor' },
    heroicons: { light: 'currentColor', dark: 'currentColor' }
  }
  state.semanticSpacing[themeSet] = {}
  state.semanticTypography[themeSet] = {}
  state.typeScale[themeSet] = {}
}

// ---------------------------------------------------------------------------
// History (Undo)
// ---------------------------------------------------------------------------

// Modell (korrigiert 29.09.2026):
//   Vor einer Aenderung wird der Zustand davor abgelegt (seit 3.3c durch
//   das Verlauf-Plugin, siehe beginneSchritt/schliesseSchritt). Der aktuelle Zustand steht deshalb nicht in der History.
//   historyIndex zeigt auf den Schnappschuss, den das naechste Undo
//   wiederherstellt (-1 = nichts mehr rueckgaengig zu machen).
//   Beim ersten Undo an der Spitze wird der aktuelle Zustand nachgetragen,
//   damit Redo ihn wieder erreicht.
// Vorher sprang Undo auf history[index-1]: eine einzelne Aenderung liess sich
// nicht zuruecknehmen, bei mehreren wurde eine uebersprungen, und Redo kam
// nie beim letzten Stand an.

// EIN Schema fuer alle Theme-Inhalte (H1, 29.09.2026). Undo, benannte
// Themes, Branches und Merge benutzen dieselbe Liste. Vorher gab es vier
// Abschriften mit 9, 10 und 24 Feldern: Custom-Tokens, Icons und die
// semantischen Spacing/Typo-Werte fielen aus Undo und Branches heraus und
// "leckten" zwischen Branches.
// Neues Theme-Feld? Hier eintragen — der Test in theme-schema.test.js prueft,
// dass saveToStorage() es auch persistiert.
export const THEME_DATA_KEYS = [
  'themes', 'foundationOverrides', 'componentOverrides', 'primitiveOverrides',
  'customFonts', 'focusRingMode', 'componentLocks', 'componentVersions',
  'variantDefinitions',
  'customSpacingTokens', 'customRadiiTokens', 'customBorderWidthTokens',
  'customMediaRatioTokens', 'customShadowTokens', 'customElevationTokens',
  'customOpacityTokens', 'customZindexTokens', 'customMotionTokens',
  'customMotionEffectTokens',
  'iconLibraries', 'iconStrokeWidths', 'iconStrokeColors',
  'semanticSpacing', 'semanticTypography', 'typeScale'
]
export const HISTORY_KEYS = THEME_DATA_KEYS
export const HISTORY_MAX = 50
// Aenderungen, die schneller aufeinander folgen (Slider, Farbrad), werden zu
// EINEM Undo-Schritt zusammengefasst — sonst legt jeder Slider-Tick einen
// vollstaendigen Schnappschuss an und ein Undo nimmt nur 1 px zurueck.
export const HISTORY_COALESCE_MS = 400
export let lastPushAt = 0

/** Tiefe Kopie aller Theme-Inhalte (optional mit activeThemeSet). */
export function snapshotThemeData({ withActiveSet = false } = {}) {
  const snap = {}
  for (const key of THEME_DATA_KEYS) snap[key] = state[key]
  if (withActiveSet) snap.activeThemeSet = state.activeThemeSet
  return deepClone(snap)
}

/** Schnappschuss zurueckspielen. Fehlende Felder (aeltere Daten) bleiben. */
export function applyThemeData(snapshot) {
  if (!snapshot) return
  for (const key of THEME_DATA_KEYS) {
    if (snapshot[key] !== undefined && snapshot[key] !== null) {
      Object.assign(state[key], deepClone(snapshot[key]))
    }
  }
  if (snapshot.activeThemeSet) state.activeThemeSet = snapshot.activeThemeSet
}

export const historySnapshot = () => snapshotThemeData()
export const applyHistorySnapshot = (snap) => applyThemeData(snap)

// ---------------------------------------------------------------------------
// Undo-Schritte (Plan v2, 3.3c)
// ---------------------------------------------------------------------------
// Die Aktionen rufen den Verlauf nicht mehr selbst auf. Das Pinia-Plugin
// stores/plugins/verlauf.js klammert jede Aktion aus VERLAUF_AKTIONEN mit
// beginneSchritt()/schliesseSchritt(). Ein Schritt entsteht nur, wenn die
// Aktion die Theme-Daten wirklich veraendert hat — abgelehnte Eingaben oder
// gesperrte Komponenten erzeugen keinen leeren Undo-Schritt mehr.

/** Aktionen des Theme-Stores, die einen Undo-Schritt anlegen. */
export const VERLAUF_AKTIONEN = [
  'addCustomBorderWidthToken',
  'addCustomElevationToken',
  'addCustomMediaRatioToken',
  'addCustomMotionEffectToken',
  'addCustomMotionToken',
  'addCustomOpacityToken',
  'addCustomRadiiToken',
  'addCustomShadowToken',
  'addCustomSpacingToken',
  'addCustomZindexToken',
  'addIconLibrary',
  'addSemanticSpacingToken',
  'createVariant',
  'deleteVariant',
  'loadNeoDefaults',
  'loadTheme',
  'removeCustomBorderWidthToken',
  'removeCustomElevationToken',
  'removeCustomMediaRatioToken',
  'removeCustomMotionEffectToken',
  'removeCustomMotionToken',
  'removeCustomOpacityToken',
  'removeCustomRadiiToken',
  'removeCustomShadowToken',
  'removeCustomSpacingToken',
  'removeCustomZindexToken',
  'removeIconLibrary',
  'removeSemanticSpacing',
  'removeSemanticTypography',
  'resetComponentToken',
  'resetPraesentation',
  'resetToDefaults',
  'resetTypeScale',
  'setFocusRingMode',
  'updateComponentToken',
  'updateFoundationToken',
  'updateIconStrokeColor',
  'updateIconStrokeWidth',
  'updatePraesentation',
  'updatePrimitive',
  'updateSemanticSpacing',
  'updateSemanticToken',
  'updateSemanticTypography',
  'updateTypeScale',
]

function datenJson() {
  const daten = {}
  for (const key of HISTORY_KEYS) daten[key] = state[key]
  return JSON.stringify(daten)
}

/**
 * Vor einer Aktion: Stand merken. null, wenn die Aktion zu einer schnellen
 * Folge gehoert und in den laufenden Schritt faellt.
 */
export function beginneSchritt() {
  const now = Date.now()
  const atTip = state.historyIndex === state.history.length - 1
  if (atTip && state.history.length && now - lastPushAt < HISTORY_COALESCE_MS) {
    lastPushAt = now
    return null
  }
  return { vorher: datenJson(), zeit: now }
}

/** Nach einer Aktion: Schritt ablegen, wenn sich die Daten geaendert haben. */
export function schliesseSchritt(schritt) {
  if (!schritt || datenJson() === schritt.vorher) return
  lastPushAt = schritt.zeit
  state.history = state.history.slice(0, state.historyIndex + 1)
  state.history.push(JSON.parse(schritt.vorher))
  state.historyIndex = state.history.length - 1
  if (state.history.length > HISTORY_MAX) {
    state.history.shift()
    state.historyIndex--
  }
}

export function canUndo() {
  return state.historyIndex >= 0
}

export function canRedo() {
  return state.historyIndex + 2 <= state.history.length - 1
}

export function undo() {
  if (!canUndo()) return
  if (state.historyIndex === state.history.length - 1) {
    // An der Spitze: aktuellen Zustand sichern, damit Redo ihn erreicht.
    state.history.push(historySnapshot())
  }
  applyHistorySnapshot(state.history[state.historyIndex])
  state.historyIndex--
  lastPushAt = 0
}

export function redo() {
  if (!canRedo()) return
  applyHistorySnapshot(state.history[state.historyIndex + 2])
  state.historyIndex++
  lastPushAt = 0
}
