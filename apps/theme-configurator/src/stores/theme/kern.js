// @ts-check
// Theme-Store · Kern: gueltige Token-IDs, deepClone, reaktiver State, Foundation-Defaults
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { componentTokenGroups, foundationTokens, primitiveColors, semanticDefaults, semanticTokenGroups } from '../../data/tokens.js'
import { reactive, toRaw } from 'vue'

// ---------------------------------------------------------------------------
// Valid token ID sets (for pruning stale localStorage overrides)
// ---------------------------------------------------------------------------
export const _validComponentTokenIds = new Set(
  componentTokenGroups.flatMap(g => g.tokens.map(t => t.id))
)
export const _validSemanticTokenIds = new Set(
  semanticTokenGroups.flatMap(g => g.tokens.map(t => t.id))
)

// ---------------------------------------------------------------------------
// Deep-clone helper
// ---------------------------------------------------------------------------
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(toRaw(obj)))
}

// ---------------------------------------------------------------------------
// Saved Themes storage key
// ---------------------------------------------------------------------------
export const SAVED_THEMES_KEY = 'neo-theme-configurator-saved-themes'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export const state = reactive({
  // Which theme set: 'neo' or 'customer'
  activeThemeSet: 'neo',

  // Light / Dark preview mode
  previewMode: 'light',

  // Per-section preview mode memory (section → 'light'|'dark'|'split')
  sectionPreviewModes: {},

  // Current navigation section
  activeSection: 'foundation-colors',

  // Color inspector active tab: 'primitives' or 'semantic'
  colorActiveTab: 'primitives',

  // Spacing inspector active tab: 'primitives' or 'semantic'
  spacingActiveTab: 'primitives',

  // Spacing semantic category: null (overview) or 'layout'|'component'|'custom'
  spacingCategory: null,

  // Typography inspector active tab: 'primitives' or 'semantic'
  typographyActiveTab: 'primitives',

  // Shadow inspector active tab: 'primitives' or 'semantic'
  shadowActiveTab: 'primitives',

  // Typography semantic category: null (overview) or 'heading'|'display'|'body'|'feedback'
  typographyCategory: null,

  // Semantic category: null (overview) or 'text'|'background'|'border'|'interactive'|'feedback'|'layer'|'on-color'
  semanticCategory: null,

  // Selected token for inspector
  selectedToken: null,

  // Arena specimen selection (ephemeral, not persisted)
  // { componentId, specimenId, tokenGroups } or null
  arenaSelection: null,

  // Sync Geometry: Geometrie-Aenderungen gelten fuer beide Themes
  syncGeometry: true,

  // Form Variant: Globaler Stil fuer Input/Textarea/Select (outlined/filled/borderless)
  formVariant: { neo: 'outlined', customer: 'outlined' },

  // Highlighted Token: Inspector→Arena visuelles Feedback
  // { tokenId, property } oder null
  highlightedToken: null,

  // Arena Filters: dynamisch pro Kategorie. null = all selected; Map<id,boolean> = selektiv.
  // Standard-Kategorien: variants, sizes, states. Dazu komponentenspezifische (emphasis, pattern, etc.)
  arenaFilters: {},

  // Version tag
  version: '1.0.0',

  // The full theme objects for both sets
  themes: {
    neo: {
      light: deepClone(semanticDefaults['neo-light']),
      dark: deepClone(semanticDefaults['neo-dark'])
    },
    customer: {
      light: deepClone(semanticDefaults['customer-light']),
      dark: deepClone(semanticDefaults['customer-dark'])
    }
  },

  // Foundation token overrides per theme set
  foundationOverrides: {
    neo: deepClone(getDefaultFoundation()),
    customer: deepClone(getDefaultFoundation())
  },

  // Component token overrides per theme set
  componentOverrides: {
    neo: {},
    customer: {}
  },

  // Primitive color overrides per theme set
  primitiveOverrides: {
    neo: {
      primary: primitiveColors.primary.base,
      secondary: primitiveColors.secondary.base,
      accent: primitiveColors.accent.base
    },
    customer: {
      primary: primitiveColors.primary.base,
      secondary: primitiveColors.secondary.base,
      accent: primitiveColors.accent.base
    }
  },

  // Custom font families per theme set
  // Each entry: { id, name, family, url }
  customFonts: {
    neo: [],
    customer: []
  },

  // Focus Ring Mode: 'offset' (aussen, Default) oder 'inset' (innen)
  focusRingMode: {
    neo: 'offset',
    customer: 'offset'
  },

  // Component Locks — gesperrte Komponenten koennen nicht editiert werden
  componentLocks: {
    neo: {},       // { 'button': true, 'badge': true }
    customer: {}
  },

  // Component Versions — semantische Versionierung pro Komponente
  componentVersions: {
    neo: {},       // { 'button': '1.2.0', 'badge': '1.0.0' }
    customer: {}
  },

  // Custom Variant Definitions per theme set
  // Shape: { 'button': { 'gradient': { modifier, baseVariant, axis, tokens: [...tokenIds] } } }
  variantDefinitions: {
    neo: {},
    customer: {}
  },

  // Custom spacing tokens per theme set (user-defined beyond defaults)
  // Shape: { '14': { label: '14', value: '56px' }, ... }
  customSpacingTokens: {
    neo: {},
    customer: {}
  },

  // Custom radii tokens per theme set
  // Maps key to { label, value }: { 'custom-1': { label: 'custom-1', value: '20px' } }
  customRadiiTokens: {
    neo: {},
    customer: {}
  },

  // Custom border width tokens per theme set
  // Shape: { 'xxl': { label: 'XXL', value: '6px' } }
  customBorderWidthTokens: {
    neo: {},
    customer: {}
  },

  // Custom media ratio tokens per theme set
  // Shape: { '21-9': { label: '21:9 (Ultrawide)', value: '21 / 9' } }
  customMediaRatioTokens: {
    neo: {},
    customer: {}
  },

  // Custom shadow level tokens per theme set
  // Shape: { '2xl': { label: '2XL', value: '0 40px 80px rgba(15, 23, 42, 0.24)' } }
  customShadowTokens: {
    neo: {},
    customer: {}
  },

  // Custom elevation (semantic) mapping per theme set
  // Shape: { 'popover': { label: 'Popover', value: 'md' } }  (value = shadow level key)
  customElevationTokens: {
    neo: {},
    customer: {}
  },

  // Custom opacity tokens per theme set
  // Shape: { 'ghost': { label: 'Ghost', value: 0.04 } }
  customOpacityTokens: {
    neo: {},
    customer: {}
  },

  // Custom z-index tokens per theme set
  // Shape: { 'popover': { label: 'Popover', value: 15 } }
  customZindexTokens: {
    neo: {},
    customer: {}
  },

  // Custom motion tokens per theme set
  // Shape: { 'bounce': { label: 'Bounce', value: 'cubic-bezier(.68,-0.55,.27,1.55)', type: 'easing' } }
  customMotionTokens: {
    neo: {},
    customer: {}
  },

  // Custom motion effect tokens per theme set
  // Shape: { 'bounce-in': { label: 'Bounce In', value: '...', transition: '...', intent: 'entrance' } }
  customMotionEffectTokens: {
    neo: {},
    customer: {}
  },

  // Icon libraries per theme set
  // Each entry: { id, name, builtIn, iconCount, manifestPath? }
  // Built-in libraries: Tabler Icons + Heroicons
  iconLibraries: {
    neo: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ],
    customer: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ]
  },

  // Icon stroke widths per size, per library, per theme set
  // Structure: { neo: { tabler: { xs: '1', ... }, heroicons: { ... } }, customer: { ... } }
  iconStrokeWidths: {
    neo: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    },
    customer: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    }
  },

  // Icon stroke colors per light/dark mode, per library, per theme set
  // Structure: { neo: { tabler: { light: '#...', dark: '#...' }, heroicons: { ... } }, customer: { ... } }
  iconStrokeColors: {
    neo: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    },
    customer: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    }
  },

  // Semantic spacing tokens per theme set
  // Maps purpose to a primitive spacing reference: { 'padding-page': 'var(--fnd-spacing-08)', ... }
  semanticSpacing: {
    neo: {},
    customer: {}
  },

  // Semantic typography tokens per theme set
  // Maps purpose to typography values: { 'heading-h1-font-size': '42px', 'heading-h1-line-height': '1.1', ... }
  semanticTypography: {
    neo: {},
    customer: {}
  },

  // Fluide Schriftskala je Theme-Set (Plan v2, 2.3): nur Abweichungen von der
  // Quelle — { base_min_px, base_max_px, ratio_min, ratio_max }. Leer = Quelle.
  typeScale: {
    neo: {},
    customer: {}
  },

  // Undo history
  history: [],
  historyIndex: -1,

  // ---------------------------------------------------------------------------
  // Theme Management
  // ---------------------------------------------------------------------------
  // Currently loaded theme metadata (null = working on defaults)
  currentThemeMeta: null,

  // List of saved themes [{id, name, version, createdAt, updatedAt}]
  savedThemes: []
})

// ---------------------------------------------------------------------------
// Default foundation values
// ---------------------------------------------------------------------------

export function getDefaultFoundation() {
  const result = {}
  for (const [category, data] of Object.entries(foundationTokens)) {
    result[category] = {}
    if (!('tokens' in data) || !data.tokens) continue  // z. B. elements, themes
    for (const [key, token] of Object.entries(data.tokens)) {
      result[category][key] = token.value
    }
  }
  return result
}
