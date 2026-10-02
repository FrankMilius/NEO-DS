// @ts-check
// Theme-Store · Aenderungen an Semantik-, Foundation-, Komponenten- und Custom-Tokens, Schriftskala, Primitives
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { getDefaultFoundation, state } from './kern.js'
import { extractComponentId, isComponentLocked } from './komponenten.js'

export function updateSemanticToken(tokenId, value) {
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  const themeSet = state.activeThemeSet
  state.themes[themeSet][mode][tokenId] = value
}

export function setFocusRingMode(mode) {
  state.focusRingMode[state.activeThemeSet] = mode
}

export function ergaenzeFoundation() {
  const vorgabe = getDefaultFoundation()
  for (const themeSet of ['neo', 'customer']) {
    const set = (state.foundationOverrides[themeSet] ??= {})
    for (const [kat, werte] of Object.entries(vorgabe)) {
      const ziel = (set[kat] ??= {})
      for (const [key, wert] of Object.entries(werte)) if (ziel[key] === undefined) ziel[key] = wert
    }
  }
}

export function updateFoundationToken(category, key, value) {
  // Kategorie notfalls anlegen: Ein gespeicherter Stand von vor einer neuen
  // Foundation-Kategorie (z. B. size, tracking seit 30.09.2026) kennt sie nicht.
  const set = state.foundationOverrides[state.activeThemeSet]
  ;(set[category] ??= {})[key] = value
}

// ---------------------------------------------------------------------------
// Mirror Token Map: Source → Targets
// Wenn ein Source-Token geaendert wird, werden die Targets automatisch
// mit dem gleichen Wert aktualisiert (sofern syncGeometry aktiv ist).
// ---------------------------------------------------------------------------
export const MIRROR_TOKEN_MAP = {
  'nc-input-height-sm':    ['nc-input-group-height-sm'],
  'nc-input-height-md':    ['nc-input-group-height-md'],
  'nc-input-height-lg':    ['nc-input-group-height-lg'],
  'nc-input-radius':       ['nc-input-group-radius', 'nc-toggle-group-radius'],
  'nc-input-border-width': ['nc-input-group-border-width'],
  // Form Control Shared → Input aliases (cascade via CSS var(), mirror for inspector sync)
  'nc-form-control-bg':                          ['nc-input-bg'],
  'nc-form-control-color':                       ['nc-input-color'],
  'nc-form-control-border-color':                ['nc-input-border'],
  'nc-form-control-radius':                      ['nc-input-radius', 'nc-input-group-radius'],
  'nc-form-control-border-width':                ['nc-input-border-width', 'nc-input-group-border-width'],
  'nc-form-control-placeholder-color':           ['nc-input-placeholder'],
  'nc-form-control-border-hover':                ['nc-input-border-hover'],
  'nc-form-control-border-focus':                ['nc-input-border-focus'],
  'nc-form-control-transition-duration':         ['nc-input-transition-duration'],
  // Input Label → Switch Label + Rating Count (einheitliche Form-Label-Farbe)
  'nc-input-label-color':                        ['nc-switch-label-color', 'nc-rating-count-color'],
  // Slider: Track-Fill-Farbe → Range-Fill-Farbe (Konsistenz)
  'nc-range-track-bg-active':                   ['nc-range-range-fill-bg'],
  // Dropdown: Separator-Farbe → Footer-Border-Farbe (Konsistenz)
  // nc-dropdown-separator-color → nc-dropdown-footer-border-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Dialog/Modal: Header-Border → Footer-Border (Konsistenz bei Scroll-Borders)
  // nc-dialog-header-border-color → nc-dialog-footer-border-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Popover: Header-Border → Footer-Border (Konsistenz)
  // nc-popover-header-border → nc-popover-footer-border: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Popover: BG → Arrow-BG (Arrow-Hintergrund muss zum Panel passen)
  // (moved to bottom with nav-menu-viewport-bg)
  // Toast: Default-Progress-BG folgt Default-Icon-Color (visueller Gleichklang)
  // nc-toast-default-icon-color → nc-toast-default-progress-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Toast: Severity-Progress-BG folgt Severity-Icon-Color (Konsistenz pro Variante)
  // nc-toast-success-icon-color → nc-toast-success-progress-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-toast-warning-icon-color → nc-toast-warning-progress-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-toast-error-icon-color → nc-toast-error-progress-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-toast-info-icon-color → nc-toast-info-progress-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Notification: Radius folgt Card-Radius, Shadow folgt Popover-Shadow
  'nc-card-radius':                              ['nc-notification-radius', 'nc-metric-radius'],  // entkoppelt: nc-accordion-media-radius, nc-avatar-radius-square (02.10.2026)
  // (moved to bottom with nav-menu-viewport-shadow)
  // Drawer: BG/Shadow/Overlay folgen Dialog-Tokens
  'nc-dialog-bg':                                ['nc-drawer-bg'],
  // nc-dialog-shadow → nc-search-command-shadow: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  'nc-dialog-overlay-bg':                        ['nc-drawer-overlay-bg'],
  // Alert ↔ Alert-Dialog: Danger-Farben muessen konsistent sein
  // nc-alert-danger-icon-color → nc-dialog-danger-icon-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-alert-danger-bg → nc-dialog-danger-action-bg: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  // Accordion: Media-Radius erbt von Card-Radius (Konsistenz)
  // → 'nc-card-radius' oben zusammengefuehrt (doppelter Schluessel ueberschrieb fruehere Ziele)
  // Accordion: Item-Radius folgt Card-Radius (Separated Cards = Cards)
  // nc-accordion-item-radius → nc-accordion-media-radius: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Toggle Group: Radius folgt Input-Radius (Formular-Konsistenz)
  // → 'nc-input-radius' oben zusammengefuehrt (doppelter Schluessel ueberschrieb fruehere Ziele)
  // Toggle Group: Underline-Color folgt Selected-BG (visuelle Kohaerenz)
  // nc-toggle-group-item-selected-bg → nc-toggle-group-underline-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Input-Radius: Item + Toolbar folgen (Formular-Konsistenz)
  // → 'nc-input-radius' oben zusammengefuehrt (doppelter Schluessel ueberschrieb fruehere Ziele)
  // Item: Selected-Border und Accent-Color folgen Interactive-Default (Markenfarbe)
  // nc-item-selected-border → nc-item-accent-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Item: Thumbnail-Radius folgt Media-Radius (Konsistenz)
  // nc-item-media-radius → nc-item-thumbnail-radius: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Search: Results-Shadow folgt Dropdown-Shadow (Overlay-Konsistenz)
  // nc-dropdown-shadow → nc-search-results-shadow: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Search: Command-Shadow folgt Dialog-Shadow (Modal-Konsistenz)
  // → 'nc-dialog-shadow' oben zusammengefuehrt (doppelter Schluessel ueberschrieb fruehere Ziele)
  // Toolbar: Gap folgt Button-Gap (Hierarchie-Konsistenz)
  // nc-button-gap → nc-toolbar-gap: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Navigation-Menu: Viewport-Shadow folgt Popover-Shadow (Overlay-Konsistenz)
  'nc-popover-shadow':                           ['nc-nav-menu-viewport-shadow'],
  // Navigation-Menu: Viewport-BG/Border/Radius folgen Popover (Overlay-Konsistenz)
  // nc-popover-bg → nc-popover-arrow-bg, nc-nav-menu-viewport-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-popover-border → nc-nav-menu-viewport-border: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-popover-radius → nc-nav-menu-viewport-radius: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Nav Molecules → Navigation Menu: Shared Interaction Tokens
  // nc-nav-mol-link-hover-bg → nc-nav-menu-trigger-hover-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-nav-mol-link-active-border → nc-nav-menu-indicator-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Nav Atoms → Nav Molecules: Icon-Color Kaskade
  // nc-nav-atom-icon-color → nc-nav-mol-link-color: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Governance: Label ↔ Tag ↔ Badge — Konsistente Semantik-Farben
  // nc-tag-success-bg → nc-label-success-bg, nc-badge-success-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-tag-warning-bg → nc-label-warning-bg, nc-badge-warning-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-tag-error-bg → nc-label-danger-bg, nc-badge-error-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // nc-tag-info-bg → nc-label-info-bg, nc-badge-info-bg: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Badge → Label: Typografie-Konsistenz
  // nc-badge-font-weight → nc-label-font-weight: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Avatar: Badge-Online folgt Success-Farbe (Konsistenz mit Badge/Label)
  // nc-badge-success-bg → nc-avatar-badge-online: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  // Avatar: Badge-Busy folgt Danger-Farbe
  // nc-badge-error-bg → nc-avatar-badge-busy: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  // Avatar: Badge-Away folgt Warning-Farbe
  // nc-badge-warning-bg → nc-avatar-badge-away: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  // Avatar: Square-Radius folgt Card-Radius (Entity-Konsistenz)
  // → 'nc-card-radius' oben zusammengefuehrt (doppelter Schluessel ueberschrieb fruehere Ziele)
  // Chip: Avatar-Size folgt Avatar-XS (Proportionskonsistenz)
  'nc-avatar-size-xs':                           ['nc-chip-avatar-size'],
  // Chip: Radius folgt Button-Radius (Systemkonsistenz)
  'nc-button-radius':                            ['nc-chip-radius'],
  // Button: Primary-BG → Checkbox Checked-BG (Markenfarbe fuer Auswahl)
  // nc-button-primary-bg → nc-checkbox-bg-checked: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Button: Radius-MD → Input-Radius (Formular-Konsistenz)
  'nc-button-radius-md':                         ['nc-input-radius'],
  // TreeView: Gap folgt Item-Gap (Konsistenz Navigations-Elemente)
  // nc-item-gap → nc-treeview-gap: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
  // TreeView: Badge-Radius folgt globalem Badge-Radius
  // nc-badge-radius → nc-treeview-badge-radius: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // Compare-Table: Shadow folgt Card-Shadow (Elevation-Konsistenz)
  'nc-card-shadow':                              ['nc-dt-card-shadow'],  // entkoppelt: nc-table-shadow, nc-dt-batch-shadow, nc-fieldset-card-shadow (02.10.2026)
  // Compare-Table: Border-Width folgt globalem Border-Width-XS
  // nc-table-border-width → nc-table-row-border-width: jetzt CSS-Kette im SCSS (Plan v3, 02.10.2026)
  // DataTable: Radius folgt Button-Radius (Formular-Konsistenz)
  // nc-button-radius-sm → nc-dt-radius: entkoppelt bzw. CSS-Kette (Entscheidung 02.10.2026)
}

export function updateComponentToken(tokenId, value) {
  // Guard: check if the component owning this token is locked
  const componentId = extractComponentId(tokenId)
  if (componentId && isComponentLocked(componentId)) {
    console.warn(`[Theme Store] Cannot update token "${tokenId}": component "${componentId}" is locked.`)
    return false
  }
  state.componentOverrides[state.activeThemeSet][tokenId] = value

  // Mirror-Mode: propagiere Aenderungen an abhaengige Tokens
  if (state.syncGeometry && MIRROR_TOKEN_MAP[tokenId]) {
    for (const targetId of MIRROR_TOKEN_MAP[tokenId]) {
      const targetComponent = extractComponentId(targetId)
      if (!targetComponent || !isComponentLocked(targetComponent)) {
        state.componentOverrides[state.activeThemeSet][targetId] = value
      }
    }
  }

  return true
}

export function resetComponentToken(tokenId) {
  const componentId = extractComponentId(tokenId)
  if (componentId && isComponentLocked(componentId)) {
    console.warn(`[Theme Store] Cannot reset token "${tokenId}": component "${componentId}" is locked.`)
    return false
  }
  delete state.componentOverrides[state.activeThemeSet][tokenId]

  // Mirror-Mode: propagiere Reset an abhaengige Tokens
  if (state.syncGeometry && MIRROR_TOKEN_MAP[tokenId]) {
    for (const targetId of MIRROR_TOKEN_MAP[tokenId]) {
      const targetComponent = extractComponentId(targetId)
      if (!targetComponent || !isComponentLocked(targetComponent)) {
        delete state.componentOverrides[state.activeThemeSet][targetId]
      }
    }
  }

  return true
}

// ---------------------------------------------------------------------------
// Custom Spacing Tokens
// ---------------------------------------------------------------------------

export function addCustomSpacingToken(key, value) {
  state.customSpacingTokens[state.activeThemeSet][key] = { label: key, value }
}

export function removeCustomSpacingToken(key) {
  delete state.customSpacingTokens[state.activeThemeSet][key]
  // Also remove any semantic spacing references to this token
  const semantic = state.semanticSpacing[state.activeThemeSet]
  for (const [sKey, sVal] of Object.entries(semantic)) {
    if (sVal === `var(--fnd-spacing-${key})`) {
      delete semantic[sKey]
    }
  }
}

export function addCustomRadiiToken(key, value) {
  state.customRadiiTokens[state.activeThemeSet][key] = { label: key, value }
}

export function removeCustomRadiiToken(key) {
  delete state.customRadiiTokens[state.activeThemeSet][key]
}

export function addCustomBorderWidthToken(key, value) {
  state.customBorderWidthTokens[state.activeThemeSet][key] = { label: key, value }
}

export function removeCustomBorderWidthToken(key) {
  delete state.customBorderWidthTokens[state.activeThemeSet][key]
}

export function addCustomMediaRatioToken(key, value, label) {
  state.customMediaRatioTokens[state.activeThemeSet][key] = { label: label || key, value }
}

export function removeCustomMediaRatioToken(key) {
  delete state.customMediaRatioTokens[state.activeThemeSet][key]
}

export function addCustomShadowToken(key, value, label) {
  state.customShadowTokens[state.activeThemeSet][key] = { label: label || key.toUpperCase(), value }
}

export function removeCustomShadowToken(key) {
  delete state.customShadowTokens[state.activeThemeSet][key]
  // Remove elevation references pointing to this custom shadow
  const elevations = state.customElevationTokens[state.activeThemeSet]
  for (const [eKey, eVal] of Object.entries(elevations)) {
    if (eVal.value === key) delete elevations[eKey]
  }
}

export function addCustomElevationToken(key, value, label) {
  state.customElevationTokens[state.activeThemeSet][key] = { label: label || key, value }
}

export function removeCustomElevationToken(key) {
  delete state.customElevationTokens[state.activeThemeSet][key]
}

export function addCustomOpacityToken(key, value, label) {
  state.customOpacityTokens[state.activeThemeSet][key] = { label: label || key, value: Number(value) }
}

export function removeCustomOpacityToken(key) {
  delete state.customOpacityTokens[state.activeThemeSet][key]
}

export function addCustomZindexToken(key, value, label) {
  state.customZindexTokens[state.activeThemeSet][key] = { label: label || key, value: Number(value) }
}

export function removeCustomZindexToken(key) {
  delete state.customZindexTokens[state.activeThemeSet][key]
}

export function addCustomMotionToken(key, value, label, type) {
  state.customMotionTokens[state.activeThemeSet][key] = { label: label || key, value, type: type || 'duration' }
}

export function removeCustomMotionToken(key) {
  delete state.customMotionTokens[state.activeThemeSet][key]
}

export function addCustomMotionEffectToken(key, value, label, transition, intent) {
  state.customMotionEffectTokens[state.activeThemeSet][key] = {
    label: label || key,
    value,
    transition: transition || '',
    intent: intent || 'state-change'
  }
}

export function removeCustomMotionEffectToken(key) {
  delete state.customMotionEffectTokens[state.activeThemeSet][key]
}

export function addIconLibrary(library) {
  state.iconLibraries[state.activeThemeSet].push(library)
  // Initialisiere per-Library Stroke Defaults
  const ts = state.activeThemeSet
  if (!state.iconStrokeWidths[ts][library.id]) {
    state.iconStrokeWidths[ts][library.id] = { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  if (!state.iconStrokeColors[ts][library.id]) {
    state.iconStrokeColors[ts][library.id] = { light: 'currentColor', dark: 'currentColor' }
  }
}

export function removeIconLibrary(id) {
  const ts = state.activeThemeSet
  const libs = state.iconLibraries[ts]
  const idx = libs.findIndex(l => l.id === id)
  if (idx >= 0 && !libs[idx].builtIn) {
    libs.splice(idx, 1)
    // Per-Library Stroke-Daten aufraumen
    delete state.iconStrokeWidths[ts][id]
    delete state.iconStrokeColors[ts][id]
  }
}

export function updateIconStrokeWidth(libraryId, size, value) {
  const ts = state.activeThemeSet
  if (!state.iconStrokeWidths[ts][libraryId]) {
    state.iconStrokeWidths[ts][libraryId] = { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  state.iconStrokeWidths[ts][libraryId][size] = value
}

export function updateIconStrokeColor(libraryId, mode, value) {
  const ts = state.activeThemeSet
  if (!state.iconStrokeColors[ts][libraryId]) {
    state.iconStrokeColors[ts][libraryId] = { light: 'currentColor', dark: 'currentColor' }
  }
  state.iconStrokeColors[ts][libraryId][mode] = value
}

export function updateSemanticSpacing(key, value) {
  state.semanticSpacing[state.activeThemeSet][key] = value
}

export function removeSemanticSpacing(key) {
  delete state.semanticSpacing[state.activeThemeSet][key]
}

export function addSemanticSpacingToken(key, spacingRef) {
  state.semanticSpacing[state.activeThemeSet][key] = spacingRef
}

// ---------------------------------------------------------------------------
// Semantic Typography Tokens
// ---------------------------------------------------------------------------

export function updateSemanticTypography(key, value) {
  state.semanticTypography[state.activeThemeSet][key] = value
}

export function removeSemanticTypography(key) {
  delete state.semanticTypography[state.activeThemeSet][key]
}

// Fluide Schriftskala (Plan v2, 2.3)
export const TYPE_SCALE_KEYS = ['base_min_px', 'base_max_px', 'ratio_min', 'ratio_max']

export function updateTypeScale(key, value) {
  if (!TYPE_SCALE_KEYS.includes(key)) return
  const zahl = Number(value)
  if (!Number.isFinite(zahl) || zahl <= 0) return
  ;(state.typeScale[state.activeThemeSet] ??= {})[key] = zahl
}

export function resetTypeScale() {
  state.typeScale[state.activeThemeSet] = {}
}

// ---------------------------------------------------------------------------

export function updatePrimitive(palette, color) {
  state.primitiveOverrides[state.activeThemeSet][palette] = color
}
