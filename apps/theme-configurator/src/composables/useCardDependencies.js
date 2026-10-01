/**
 * useCardDependencies — Composable fuer Card-Layout-Token-Abhaengigkeiten.
 *
 * Wertet dependencyRules aus card-recipe.json aus und berechnet:
 * - activeContext (tight / default / display) basierend auf Grid-Tokens
 * - dependencyConflicts: welche Rules gerade feuern
 * - inheritanceMap: welche Card-Tokens von Section/Grid ueberschrieben werden
 * - contextualOverrides: effektive Token-Werte nach Rule-Anwendung
 */
import { computed, ref } from 'vue'
import { useThemeStore } from '../stores/theme.js'
import { componentTokenGroups } from '../data/tokens.js'

// ---------------------------------------------------------------------------
// Dependency Rules aus card-recipe.json (eingebettet, da statisch)
// ---------------------------------------------------------------------------
const DEPENDENCY_RULES = [
  {
    id: 'accent-surface-override',
    severity: 'warning',
    trigger: {
      ancestor: 'section',
      condition: 'token-value-matches',
      token: 'nc-section-bg',
      matches: ['var(--fnd-color-accent)', 'var(--fnd-color-interactive-default)']
    },
    effects: {
      'nc-card-bg': 'color-mix(in srgb, var(--fnd-color-always-light) 12%, transparent)',
      'nc-card-color': 'var(--fnd-color-on-accent)',
      'nc-card-title-color': 'var(--fnd-color-on-accent)',
      'nc-card-description-color': 'color-mix(in srgb, var(--fnd-color-on-accent) 80%, transparent)',
      'nc-card-border': 'color-mix(in srgb, var(--fnd-color-always-light) 20%, transparent)'
    },
    label: 'Accent Surface Override',
    description: 'Section mit Akzent-Hintergrund: Card benoetigt Overlay-BG und On-Accent-Text fuer WCAG-Kontrast.'
  },
  {
    id: 'muted-surface-blend',
    severity: 'info',
    trigger: {
      ancestor: 'section',
      condition: 'token-value-matches',
      token: 'nc-section-bg',
      matches: ['var(--fnd-color-background-muted)', 'var(--fnd-color-layer-02)']
    },
    effects: {
      'nc-card-bg': 'var(--fnd-color-background-base)',
      'nc-card-shadow': 'var(--fnd-elevation-sm)'
    },
    label: 'Muted Surface Blend',
    description: 'Section mit Muted-BG: Card nutzt base-bg + leichte Elevation fuer Abhebung.'
  },
  {
    id: 'tight-grid-context',
    severity: 'info',
    trigger: {
      ancestor: 'grid',
      condition: 'token-value-lte',
      token: 'nc-grid-gap',
      threshold: '16px'
    },
    effects: {
      'nc-card-padding': 'var(--fnd-spacing-sm)',
      'nc-card-header-padding': 'var(--fnd-spacing-sm)',
      'nc-card-content-padding': 'var(--fnd-spacing-sm)',
      'nc-card-footer-padding': 'var(--fnd-spacing-sm)',
      'nc-card-title-font-size': 'var(--fs-sm)'
    },
    label: 'Tight Grid Context',
    description: 'Grid mit Gap ≤ 16px: Card wechselt zu kompaktem Padding und kleinerer Typografie.'
  },
  {
    id: 'few-columns-display',
    severity: 'info',
    trigger: {
      ancestor: 'grid',
      condition: 'token-value-lte',
      token: 'nc-grid-columns',
      threshold: '2'
    },
    effects: {
      'nc-card-padding': 'var(--fnd-spacing-xl)',
      'nc-card-title-font-size': 'var(--fs-lg)',
      'nc-card-title-font-weight': 'var(--fnd-font-weight-semibold)'
    },
    label: 'Few Columns Display',
    description: 'Grid mit ≤ 2 Spalten: Card nutzt groesseres Padding und prominentere Typografie.'
  }
]

// ---------------------------------------------------------------------------
// Grid Layout definitions (from card-recipe.json)
// ---------------------------------------------------------------------------
const GRID_LAYOUTS = {
  standard: { label: 'Standard', columns: 3, minWidth: '280px', gap: 'var(--fnd-spacing-lg)', class: 'nc-card-grid' },
  compact: { label: 'Compact', columns: 6, minWidth: '160px', gap: 'var(--fnd-spacing-sm)', class: 'nc-card-grid nc-card-grid--compact' },
  pair: { label: 'Pair', columns: 2, minWidth: '320px', gap: 'var(--fnd-spacing-lg)', class: 'nc-card-grid nc-card-grid--pair' },
  links: { label: 'Links', columns: 4, minWidth: '200px', gap: 'var(--fnd-spacing-md)', class: 'nc-card-grid nc-card-grid--links' }
}

// ---------------------------------------------------------------------------
// Helper: px-Wert aus Token-String extrahieren
// ---------------------------------------------------------------------------
function parsePx(value) {
  if (!value) return 0
  const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/)
  if (pxMatch) return parseFloat(pxMatch[1])
  const clampMatch = value.match(/clamp\([^,]+,\s*[^,]+,\s*(\d+(?:\.\d+)?)px\)/)
  if (clampMatch) return parseFloat(clampMatch[1])
  // var(--fnd-spacing-sm) → ~12px, var(--fnd-spacing-md) → ~16px, etc.
  const spacingNameMatch = value.match(/var\(--fnd-spacing-(\w+)\)/)
  if (spacingNameMatch) {
    const map = { '2xs': 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 }
    return map[spacingNameMatch[1]] || 16
  }
  const spacingNumMatch = value.match(/var\(--fnd-spacing-(\d+)\)/)
  if (spacingNumMatch) return parseInt(spacingNumMatch[1], 10) * 4
  const numMatch = value.match(/^(\d+)$/)
  if (numMatch) return parseInt(numMatch[1], 10)
  return 0
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------
export function useCardDependencies() {
  const store = useThemeStore()

  // Manueller Context-Override (fuer Arena-Umschaltung)
  const manualContext = ref(null)

  // Skeleton-Toggle
  const skeletonActive = ref(false)

  // ---------------------------------------------------------------------------
  // Alle relevanten Ancestor-Tokens auflösen
  // ---------------------------------------------------------------------------
  const ancestorTokens = computed(() => {
    const result = {}
    const ancestors = ['section', 'grid', 'container']
    for (const compId of ancestors) {
      const group = componentTokenGroups.find(c => c.id === compId)
      if (!group) continue
      if (group.tokens) {
        for (const tok of group.tokens) {
          const override = store.currentComponentOverrides?.[tok.id]
          result[tok.id] = override !== undefined ? override : tok.default
        }
      }
    }
    return result
  })

  // ---------------------------------------------------------------------------
  // Aktiver Kontext: tight / default / display
  // ---------------------------------------------------------------------------
  const activeContext = computed(() => {
    if (manualContext.value) return manualContext.value

    const gap = parsePx(ancestorTokens.value['nc-grid-gap'] || '')
    const cols = parseInt(ancestorTokens.value['nc-grid-columns'] || '3', 10)

    if (gap > 0 && gap <= 16) return 'tight'
    if (cols <= 2) return 'display'
    return 'default'
  })

  // ---------------------------------------------------------------------------
  // Dependency Conflicts: welche Rules feuern gerade?
  // ---------------------------------------------------------------------------
  const dependencyConflicts = computed(() => {
    const active = []

    for (const rule of DEPENDENCY_RULES) {
      const { trigger } = rule
      const tokenValue = ancestorTokens.value[trigger.token] || ''

      let fires = false

      if (trigger.condition === 'token-value-matches') {
        fires = trigger.matches.some(m => tokenValue === m || tokenValue.includes(m))
      } else if (trigger.condition === 'token-value-lte') {
        const px = parsePx(tokenValue)
        const threshold = parseFloat(trigger.threshold)
        if (px > 0) {
          fires = px <= threshold
        } else {
          // Fuer nc-grid-columns: direkte Zahl
          const numVal = parseInt(tokenValue, 10)
          if (!isNaN(numVal) && numVal > 0) {
            fires = numVal <= threshold
          }
        }
      }

      if (fires) {
        active.push({
          ...rule,
          activeTokenValue: tokenValue,
          affectedCardTokens: Object.keys(rule.effects)
        })
      }
    }

    return active
  })

  // ---------------------------------------------------------------------------
  // Inheritance Map: welche Card-Tokens werden durch Rules ueberschrieben?
  // ---------------------------------------------------------------------------
  const inheritanceMap = computed(() => {
    const map = {} // tokenId → { ruleId, ruleSeverity, ruleLabel, suggestedValue, reason }

    for (const conflict of dependencyConflicts.value) {
      for (const [tokenId, suggestedValue] of Object.entries(conflict.effects)) {
        // Letzter Conflict gewinnt (hoechste Spezifitaet)
        map[tokenId] = {
          ruleId: conflict.id,
          ruleSeverity: conflict.severity,
          ruleLabel: conflict.label,
          ruleDescription: conflict.description,
          suggestedValue,
          ancestorToken: conflict.trigger.token,
          ancestorValue: conflict.activeTokenValue
        }
      }
    }

    return map
  })

  // ---------------------------------------------------------------------------
  // Contextual Overrides: effektive Token-Werte nach Rule-Anwendung
  // ---------------------------------------------------------------------------
  const contextualOverrides = computed(() => {
    const overrides = {}

    for (const conflict of dependencyConflicts.value) {
      for (const [tokenId, value] of Object.entries(conflict.effects)) {
        overrides[tokenId] = value
      }
    }

    return overrides
  })

  // ---------------------------------------------------------------------------
  // Token mit Vererbungsinfo: gibt an ob ein Token inherited oder direkt ist
  // ---------------------------------------------------------------------------
  function getTokenStatus(tokenId) {
    const inheritance = inheritanceMap.value[tokenId]
    const userOverride = store.currentComponentOverrides?.[tokenId]

    if (userOverride !== undefined && inheritance) {
      return {
        status: 'user-override',
        value: userOverride,
        inheritance,
        note: `Manueller Override ueberschreibt Rule "${inheritance.ruleLabel}".`
      }
    }
    if (inheritance) {
      return {
        status: 'inherited',
        value: inheritance.suggestedValue,
        inheritance,
        note: `Von ${inheritance.ancestorToken} geerbt (${inheritance.ruleLabel}).`
      }
    }
    return {
      status: 'direct',
      value: null,
      inheritance: null,
      note: null
    }
  }

  // ---------------------------------------------------------------------------
  // Grid Layouts
  // ---------------------------------------------------------------------------
  const gridLayouts = computed(() => GRID_LAYOUTS)

  // ---------------------------------------------------------------------------
  // Highlight-Token-Set: alle Card-Tokens die von aktiven Rules betroffen sind
  // ---------------------------------------------------------------------------
  const highlightedTokens = computed(() => {
    return new Set(Object.keys(inheritanceMap.value))
  })

  // ---------------------------------------------------------------------------
  // Context Info fuer Arena-Darstellung
  // ---------------------------------------------------------------------------
  const contextInfo = computed(() => {
    const ctx = activeContext.value
    const info = {
      tight: {
        label: 'Tight',
        description: 'Enger Grid-Kontext: kompaktes Padding, kleinere Typografie.',
        gridLayout: 'compact',
        modifier: 'nc-card--tight'
      },
      default: {
        label: 'Default',
        description: 'Standard-Kontext ohne spezielle Anpassungen.',
        gridLayout: 'standard',
        modifier: null
      },
      display: {
        label: 'Display',
        description: 'Breiter Kontext: groesseres Padding, prominentere Typografie.',
        gridLayout: 'pair',
        modifier: 'nc-card--display'
      }
    }
    return info[ctx] || info.default
  })

  // ---------------------------------------------------------------------------
  // Setze manuellen Context (fuer Arena-Dropdown)
  // ---------------------------------------------------------------------------
  function setContext(ctx) {
    manualContext.value = ctx === 'auto' ? null : ctx
  }

  // ---------------------------------------------------------------------------
  // Toggle Skeleton
  // ---------------------------------------------------------------------------
  function toggleSkeleton() {
    skeletonActive.value = !skeletonActive.value
  }

  return {
    activeContext,
    contextInfo,
    manualContext,
    setContext,
    dependencyConflicts,
    inheritanceMap,
    contextualOverrides,
    highlightedTokens,
    getTokenStatus,
    gridLayouts,
    skeletonActive,
    toggleSkeleton,
    ancestorTokens
  }
}
