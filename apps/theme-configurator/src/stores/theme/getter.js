// Theme-Store · Abgeleitete Werte (computed) fuer das aktive Theme-Set
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { semanticDefaults } from '../../data/tokens.js'
import { computed } from 'vue'
import { state } from './kern.js'

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

export const currentThemeKey = computed(() => {
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  return `${state.activeThemeSet}-${mode}`
})

export const currentThemeId = computed(() => {
  const map = {
    'neo-light': 'neo-light-theme',
    'neo-dark': 'neo-dark-theme',
    'customer-light': 'customer-light-theme',
    'customer-dark': 'customer-dark-theme'
  }
  return map[currentThemeKey.value]
})

export const currentSemanticTokens = computed(() => {
  // In split mode, default to light for editors that need a single map
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  return state.themes[state.activeThemeSet][mode]
})

export const currentFoundation = computed(() => {
  return state.foundationOverrides[state.activeThemeSet]
})

export const currentComponentOverrides = computed(() => {
  return state.componentOverrides[state.activeThemeSet]
})

export const currentPrimitives = computed(() => {
  return state.primitiveOverrides[state.activeThemeSet]
})

export const currentCustomFonts = computed(() => {
  return state.customFonts[state.activeThemeSet]
})

export const currentFocusRingMode = computed(() => {
  return state.focusRingMode[state.activeThemeSet]
})

export const currentCustomSpacingTokens = computed(() => {
  return state.customSpacingTokens[state.activeThemeSet]
})

export const currentCustomRadiiTokens = computed(() => {
  return state.customRadiiTokens[state.activeThemeSet]
})

export const currentCustomBorderWidthTokens = computed(() => {
  return state.customBorderWidthTokens[state.activeThemeSet]
})

export const currentCustomMediaRatioTokens = computed(() => {
  return state.customMediaRatioTokens[state.activeThemeSet]
})

export const currentCustomShadowTokens = computed(() => {
  return state.customShadowTokens[state.activeThemeSet]
})

export const currentCustomElevationTokens = computed(() => {
  return state.customElevationTokens[state.activeThemeSet]
})

export const currentCustomOpacityTokens = computed(() => {
  return state.customOpacityTokens[state.activeThemeSet]
})

export const currentCustomZindexTokens = computed(() => {
  return state.customZindexTokens[state.activeThemeSet]
})

export const currentCustomMotionTokens = computed(() => {
  return state.customMotionTokens[state.activeThemeSet]
})

export const currentCustomMotionEffectTokens = computed(() => {
  return state.customMotionEffectTokens[state.activeThemeSet]
})

export const currentIconLibraries = computed(() => {
  return state.iconLibraries[state.activeThemeSet]
})

export const currentIconStrokeWidths = computed(() => {
  return state.iconStrokeWidths[state.activeThemeSet]
})

export const currentIconStrokeColors = computed(() => {
  return state.iconStrokeColors[state.activeThemeSet]
})

export const currentSemanticSpacing = computed(() => {
  return state.semanticSpacing[state.activeThemeSet]
})

export const currentSemanticTypography = computed(() => {
  return state.semanticTypography[state.activeThemeSet]
})

export const currentTypeScale = computed(() => {
  return state.typeScale[state.activeThemeSet] || {}
})

export const isDirty = computed(() => {
  // Check if customer theme differs from neo defaults
  if (state.activeThemeSet === 'customer') {
    const custLight = JSON.stringify(state.themes.customer.light)
    const defLight = JSON.stringify(semanticDefaults['customer-light'])
    return custLight !== defLight
  }
  return false
})

/**
 * True when the user is working on the factory NEO Theme defaults
 * (no custom theme loaded). This theme cannot be deleted.
 */
export const isNeoDefault = computed(() => {
  return state.activeThemeSet === 'neo' && state.currentThemeMeta === null
})
