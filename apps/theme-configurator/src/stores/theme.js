// ==========================================================================
// NEO Theme Configurator — Global Theme Store (Fassade)
// ==========================================================================
// Der Store ist nach Aufgaben in stores/theme/*.js aufgeteilt (Plan v2 3.3a).
// Diese Datei setzt die oeffentliche Schnittstelle zusammen; Komponenten
// importieren weiterhin nur useThemeStore (und Tests THEME_DATA_KEYS).
// ==========================================================================

import { defineStore } from 'pinia'
import { state } from './theme/kern.js'
import { currentComponentOverrides, currentCustomBorderWidthTokens, currentCustomElevationTokens, currentCustomFonts, currentCustomMediaRatioTokens, currentCustomMotionEffectTokens, currentCustomMotionTokens, currentCustomOpacityTokens, currentCustomRadiiTokens, currentCustomShadowTokens, currentCustomSpacingTokens, currentCustomZindexTokens, currentFocusRingMode, currentFoundation, currentIconLibraries, currentIconStrokeColors, currentIconStrokeWidths, currentPrimitives, currentSemanticSpacing, currentSemanticTokens, currentSemanticTypography, currentThemeId, currentThemeKey, currentTypeScale, isDirty, isNeoDefault } from './theme/getter.js'
import { clearArenaSelection, clearHighlightedToken, getFormVariant, resetArenaFilters, selectToken, setActiveSection, setActiveThemeSet, setArenaFilter, setArenaSelection, setFormVariant, setHighlightedToken, setPreviewMode, setSyncGeometry } from './theme/ui.js'
import { addCustomBorderWidthToken, addCustomElevationToken, addCustomMediaRatioToken, addCustomMotionEffectToken, addCustomMotionToken, addCustomOpacityToken, addCustomRadiiToken, addCustomShadowToken, addCustomSpacingToken, addCustomZindexToken, addIconLibrary, addSemanticSpacingToken, removeCustomBorderWidthToken, removeCustomElevationToken, removeCustomMediaRatioToken, removeCustomMotionEffectToken, removeCustomMotionToken, removeCustomOpacityToken, removeCustomRadiiToken, removeCustomShadowToken, removeCustomSpacingToken, removeCustomZindexToken, removeIconLibrary, removeSemanticSpacing, removeSemanticTypography, resetComponentToken, resetTypeScale, setFocusRingMode, updateComponentToken, updateFoundationToken, updateIconStrokeColor, updateIconStrokeWidth, updatePrimitive, updateSemanticSpacing, updateSemanticToken, updateSemanticTypography, updateTypeScale } from './theme/token-aktionen.js'
import { bumpComponentVersion, createVariant, deleteVariant, extractComponentId, getComponentVersion, getVariants, isComponentLocked, lockComponent, unlockComponent } from './theme/komponenten.js'
import { SCHREIBSCHUTZ_AKTIONEN, VERLAUF_AKTIONEN, applyThemeData, canRedo, canUndo, redo, resetToDefaults, snapshotThemeData, undo } from './theme/verlauf.js'
import { createTheme, deleteTheme, downloadDrupalExport, downloadThemeCSS, downloadThemeDTCG, downloadThemeJSON, aktiviereTheme, importTheme, ladeThemeKatalog, legeThemeAusStandardAn, loescheGespeichertesTheme, loadNeoDefaults, loadTheme, oeffneTheme, pruefeImport, pruefeThemeKontrast, saveCurrentTheme, speichereTheme, veroeffentlicheTheme } from './theme/themes.js'
import { exportAsCSSVars, exportAsDTCG, exportAsJSON } from './theme/export.js'
import { currentPraesentation, resetPraesentation, updatePraesentation } from './theme/praesentation.js'
import { loadFromStorage, saveToServer, saveToStorage } from './theme/persistenz.js'
import { copyThemeOverrides, diffThemeSets, resetCustomerToNeo } from './theme/theme-sets.js'
import './theme/persistenz.js' // registriert das Auto-Save

export { THEME_DATA_KEYS } from './theme/verlauf.js'
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const useThemeStore = defineStore('theme', () => ({
  state,
  // Computed
  currentThemeKey,
  currentThemeId,
  currentSemanticTokens,
  currentFoundation,
  currentComponentOverrides,
  currentPrimitives,
  currentCustomFonts,
  currentFocusRingMode,
  isDirty,
  isNeoDefault,
  // Actions
  setActiveThemeSet,
  setPreviewMode,
  setActiveSection,
  selectToken,
  setArenaSelection,
  clearArenaSelection,
  setSyncGeometry,
  getFormVariant,
  setFormVariant,
  setHighlightedToken,
  clearHighlightedToken,
  setArenaFilter,
  resetArenaFilters,
  updateSemanticToken,
  updateFoundationToken,
  updateComponentToken,
  resetComponentToken,
  // Component Lock + Versioning
  isComponentLocked,
  lockComponent,
  unlockComponent,
  bumpComponentVersion,
  getComponentVersion,
  extractComponentId,
  // Custom Variants
  createVariant,
  deleteVariant,
  getVariants,
  updatePrimitive,
  setFocusRingMode,
  // Custom Spacing
  addCustomSpacingToken,
  removeCustomSpacingToken,
  updateSemanticSpacing,
  removeSemanticSpacing,
  addSemanticSpacingToken,
  currentCustomSpacingTokens,
  currentSemanticSpacing,
  // Custom Radii
  addCustomRadiiToken,
  removeCustomRadiiToken,
  currentCustomRadiiTokens,
  addCustomBorderWidthToken,
  removeCustomBorderWidthToken,
  currentCustomBorderWidthTokens,
  addCustomMediaRatioToken,
  removeCustomMediaRatioToken,
  currentCustomMediaRatioTokens,
  // Custom Shadows & Elevation
  addCustomShadowToken,
  removeCustomShadowToken,
  addCustomElevationToken,
  removeCustomElevationToken,
  currentCustomShadowTokens,
  currentCustomElevationTokens,
  // Custom Opacity, Z-Index, Motion
  addCustomOpacityToken,
  removeCustomOpacityToken,
  currentCustomOpacityTokens,
  addCustomZindexToken,
  removeCustomZindexToken,
  currentCustomZindexTokens,
  addCustomMotionToken,
  removeCustomMotionToken,
  currentCustomMotionTokens,
  addCustomMotionEffectToken,
  removeCustomMotionEffectToken,
  currentCustomMotionEffectTokens,
  // Icon Libraries
  addIconLibrary,
  removeIconLibrary,
  updateIconStrokeWidth,
  updateIconStrokeColor,
  currentIconLibraries,
  currentIconStrokeWidths,
  currentIconStrokeColors,
  currentSemanticTypography,
  currentTypeScale,
  // Semantic Typography
  updateSemanticTypography,
  removeSemanticTypography,
  updateTypeScale,
  resetTypeScale,
  // Praesentation (Plan v2, 2.5)
  currentPraesentation,
  updatePraesentation,
  resetPraesentation,
  resetToDefaults,
  undo,
  redo,
  canUndo,
  canRedo,
  snapshotThemeData,
  applyThemeData,
  // Theme Management
  createTheme,
  saveCurrentTheme,
  loadTheme,
  deleteTheme,
  loadNeoDefaults,
  downloadThemeJSON,
  downloadThemeCSS,
  downloadDrupalExport,
  downloadThemeDTCG,
  // Import (Plan v2, 2.2)
  pruefeImport,
  importTheme,
  // Export
  exportAsCSSVars,
  exportAsJSON,
  exportAsDTCG,
  // Speicher-Abstraktion (Plan v2, 2.6)
  ladeThemeKatalog,
  oeffneTheme,
  speichereTheme,
  veroeffentlicheTheme,
  pruefeThemeKontrast,
  aktiviereTheme,
  legeThemeAusStandardAn,
  loescheGespeichertesTheme,
  // Persistence
  saveToServer,
  loadFromStorage,
  saveToStorage,
  // Multi-Theme Operations
  copyThemeOverrides,
  diffThemeSets,
  resetCustomerToNeo
}), { verlauf: VERLAUF_AKTIONEN, schreibschutz: SCHREIBSCHUTZ_AKTIONEN })
