/**
 * useLayoutDependencies — Composable fuer Layout-Token-Abhaengigkeiten.
 *
 * Steuert die Cascade-Logik zwischen Shell → Section → Container → Grid → Content.
 * Liefert Smart-Links, Conflict Warnings und Dependency Maps fuer den Inspector.
 */
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'
import { componentTokenGroups } from '../data/tokens.js'

// ---------------------------------------------------------------------------
// Relation Graph: Wer beeinflusst wen?
// ---------------------------------------------------------------------------
const LAYOUT_RELATIONS = {
  section: {
    label: 'Section',
    icon: 'section',
    affects: ['container', 'grid'],
    affectedBy: [],
    cascade: 'Section ist der Master-Orchestrator. Surface-Wechsel propagieren Textfarben an alle Kind-Komponenten.',
    smartLinks: [
      { targetComponent: 'container', targetToken: 'nc-container-padding-inline', reason: 'Section umschliesst Container — Padding-Inline muss zum Section-Padding harmonieren.' },
      { targetComponent: 'grid', targetToken: 'nc-grid-gap', reason: 'Grid-Gap innerhalb der Section sollte proportional zum Section-Padding sein.' }
    ]
  },
  container: {
    label: 'Container',
    icon: 'container',
    affects: ['grid'],
    affectedBy: ['section'],
    cascade: 'Container begrenzt die verfuegbare Breite. Grid-Spalten muessen sich an die max-width anpassen.',
    smartLinks: [
      { targetComponent: 'section', targetToken: 'nc-section-padding-block', reason: 'Section-Padding beeinflusst den vertikalen Rhythmus um den Container.' },
      { targetComponent: 'grid', targetToken: 'nc-grid-columns', reason: 'Bei schmalen Containern (narrow: 768px) sind 12 Spalten zu viel — 4-6 Spalten empfohlen.' }
    ]
  },
  grid: {
    label: 'Grid',
    icon: 'layout-grid',
    affects: [],
    affectedBy: ['container', 'section'],
    cascade: 'Grid definiert den Spaltenrhythmus fuer alle Kind-Komponenten.',
    smartLinks: [
      { targetComponent: 'container', targetToken: 'nc-container-max-width', reason: 'Container max-width bestimmt die verfuegbare Breite fuer Grid-Spalten.' },
      { targetComponent: 'container', targetToken: 'nc-container-padding-inline', reason: 'Container-Padding reduziert den Platz fuer das Grid.' }
    ]
  }
}

// ---------------------------------------------------------------------------
// Conflict Detection Rules
// ---------------------------------------------------------------------------
const CONFLICT_RULES = [
  {
    id: 'gap-vs-padding',
    severity: 'warning',
    label: 'Optisches Ungleichgewicht',
    check(tokens) {
      const gap = parsePx(tokens['nc-grid-gap'])
      const padding = parsePx(tokens['nc-container-padding-inline'])
      if (gap > 0 && padding > 0 && gap > padding) {
        return {
          message: `Grid-Gap (${gap}px) ist groesser als Container-Padding (${padding}px). Der Abstand zwischen Elementen uebersteigt den Aussenabstand.`,
          affected: ['nc-grid-gap', 'nc-container-padding-inline'],
          suggestion: `Gap auf max ${padding}px reduzieren oder Container-Padding erhoehen.`
        }
      }
      return null
    }
  },
  {
    id: 'narrow-container-many-cols',
    severity: 'info',
    label: 'Schmaler Container + viele Spalten',
    check(tokens) {
      const maxWidth = parsePx(tokens['nc-container-max-width'])
      const cols = parseInt(tokens['nc-grid-columns'], 10)
      // narrow container with 12 columns
      if (maxWidth > 0 && maxWidth <= 768 && cols > 6) {
        return {
          message: `Container-Breite ${maxWidth}px mit ${cols} Spalten: Bei nur ~${Math.floor((maxWidth - 11 * 16) / cols)}px pro Spalte wird Content zu eng.`,
          affected: ['nc-container-max-width', 'nc-grid-columns'],
          suggestion: `Bei narrow Containern auf 4-6 Spalten wechseln.`
        }
      }
      return null
    }
  },
  {
    id: 'compact-density-large-gap',
    severity: 'warning',
    label: 'Kompakte Dichte + grosser Gap',
    check(tokens) {
      const sectionPadding = parsePx(tokens['nc-section-padding-block-sm'])
      const gridGapLg = parsePx(tokens['nc-grid-gap-lg'])
      if (sectionPadding > 0 && gridGapLg > 0 && gridGapLg > sectionPadding) {
        return {
          message: `Grosser Grid-Gap (${gridGapLg}px) wirkt deplatziert bei kompakter Section-Dichte (${sectionPadding}px Padding).`,
          affected: ['nc-section-padding-block-sm', 'nc-grid-gap-lg'],
          suggestion: `Bei compact Sections den Standard- oder Small-Gap verwenden.`
        }
      }
      return null
    }
  },
  {
    id: 'accent-surface-border-contrast',
    severity: 'info',
    label: 'Accent Surface + Borders',
    check(tokens, themeColors) {
      // Check if section is on accent and components might need border adjustments
      // This is a contextual hint, not a hard rule
      if (themeColors && themeColors['interactive-default']) {
        return null // This would need runtime surface detection
      }
      return null
    }
  }
]

// ---------------------------------------------------------------------------
// Helper: Extract pixel value from token strings
// ---------------------------------------------------------------------------
function parsePx(value) {
  if (!value) return 0
  // Handle plain px: "16px"
  const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/)
  if (pxMatch) return parseFloat(pxMatch[1])
  // Handle clamp: "clamp(16px, 3.5vw, 48px)" → use max value
  const clampMatch = value.match(/clamp\([^,]+,\s*[^,]+,\s*(\d+(?:\.\d+)?)px\)/)
  if (clampMatch) return parseFloat(clampMatch[1])
  // Handle var references: "var(--fnd-spacing-08)" → approximate
  const spacingMatch = value.match(/var\(--fnd-spacing-(\d+)\)/)
  if (spacingMatch) {
    const step = parseInt(spacingMatch[1], 10)
    return step * 4 // Approximate: spacing steps are roughly 4px increments
  }
  // Plain number
  const numMatch = value.match(/^(\d+)$/)
  if (numMatch) return parseInt(numMatch[1], 10)
  return 0
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------
export function useLayoutDependencies(componentId) {
  const store = useThemeStore()

  const relation = computed(() => LAYOUT_RELATIONS[componentId] || null)

  // Resolve all relevant layout tokens
  const layoutTokens = computed(() => {
    const result = {}
    const layoutComponents = ['grid', 'container', 'section']

    for (const compId of layoutComponents) {
      const group = componentTokenGroups.find(c => c.id === compId)
      if (!group) continue
      for (const tok of group.tokens) {
        const override = store.currentComponentOverrides.value?.[tok.id]
        result[tok.id] = override !== undefined ? override : tok.default
      }
    }
    return result
  })

  // Active conflicts
  const conflicts = computed(() => {
    const results = []
    const themeMode = store.state.previewMode === 'split' ? 'light' : store.state.previewMode
    const themeColors = store.state.themes[store.state.activeThemeSet]?.[themeMode]

    for (const rule of CONFLICT_RULES) {
      const result = rule.check(layoutTokens.value, themeColors)
      if (result) {
        results.push({
          id: rule.id,
          severity: rule.severity,
          label: rule.label,
          ...result
        })
      }
    }
    return results
  })

  // Conflicts relevant to this component
  const relevantConflicts = computed(() => {
    if (!componentId) return conflicts.value
    const prefix = `nc-${componentId}-`
    return conflicts.value.filter(c =>
      c.affected.some(tok => tok.startsWith(prefix) || tok.startsWith('nc-grid-') || tok.startsWith('nc-container-') || tok.startsWith('nc-section-'))
    )
  })

  // Smart links for this component
  const smartLinks = computed(() => {
    if (!relation.value) return []
    return relation.value.smartLinks.map(link => {
      const group = componentTokenGroups.find(c => c.id === link.targetComponent)
      const tok = group?.tokens.find(t => t.id === link.targetToken)
      const override = store.currentComponentOverrides.value?.[link.targetToken]
      const currentValue = override !== undefined ? override : tok?.default || ''
      return {
        ...link,
        targetLabel: group?.label || link.targetComponent,
        tokenLabel: tok?.label || link.targetToken,
        currentValue,
        isOverridden: override !== undefined,
        section: `component-${link.targetComponent}`
      }
    })
  })

  // Cascade chain
  const cascadeChain = computed(() => {
    const chain = []
    const components = ['section', 'container', 'grid']
    for (const compId of components) {
      const rel = LAYOUT_RELATIONS[compId]
      if (!rel) continue
      chain.push({
        id: compId,
        label: rel.label,
        icon: rel.icon,
        isActive: compId === componentId,
        affects: rel.affects,
        tokenCount: componentTokenGroups.find(c => c.id === compId)?.tokens.length || 0
      })
    }
    return chain
  })

  // DomNotes relevant to current context
  const contextualNotes = computed(() => {
    const notes = []
    const cols = parseInt(layoutTokens.value['nc-grid-columns'] || '12', 10)
    const mobileCols = parseInt(layoutTokens.value['nc-grid-mobile-columns'] || '4', 10)

    if (componentId === 'grid') {
      notes.push({
        type: 'info',
        text: `Mobile: Grid reduziert auf ${mobileCols} Spalten. Spans > ${mobileCols} werden full-width.`
      })
      if (cols > 12) {
        notes.push({
          type: 'warning',
          text: `${cols} Spalten ueberschreiten das Standard-12er-Raster. Pruefen ob alle Breakpoints funktionieren.`
        })
      }
    }

    if (componentId === 'container') {
      const maxWidth = layoutTokens.value['nc-container-max-width'] || '1200px'
      notes.push({
        type: 'info',
        text: `Container begrenzt auf ${maxWidth}. Das Grid innerhalb berechnet Spaltenbreiten basierend auf dieser verfuegbaren Breite.`
      })
    }

    if (componentId === 'section') {
      notes.push({
        type: 'info',
        text: 'Section ist der Master-Orchestrator. Surface-Wechsel (z.B. auf Accent) propagieren Textfarben an alle Kind-Komponenten.'
      })
    }

    return notes
  })

  // Navigate to a linked component/token
  function navigateTo(section) {
    store.state.activeSection = section
  }

  return {
    relation,
    layoutTokens,
    conflicts,
    relevantConflicts,
    smartLinks,
    cascadeChain,
    contextualNotes,
    navigateTo
  }
}
