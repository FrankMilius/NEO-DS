// ==========================================================================
// Token Classifier — Figma-Inspired Section Grouping
// ==========================================================================
// Klassifiziert --nc-* Component Tokens in Figma-Style Sektionen
// basierend auf Token-ID-Analyse.
//
// Sektionen (Reihenfolge wie in Figma):
//   1. Layout      — Position, Sizing, Spacing, Flex/Grid
//   2. Typography   — Font, Weight, Size, Line-Height
//   3. Fill         — Background, Color (nicht border-color)
//   4. Stroke       — Border, Outline, Ring, Radius
//   5. Effects      — Shadow, Elevation, Opacity, Blur, Transitions
//   6. Export       — CSS Custom Properties Preview (keine Tokens)
//
// Verwendung:
//   const { classifyTokens } = useTokenClassifier()
//   const sections = classifyTokens(tokens)
// ==========================================================================

// ---------------------------------------------------------------------------
// Section-Definitionen mit Matching-Regeln
// ---------------------------------------------------------------------------

const SECTION_DEFS = [
  {
    id: 'layout',
    label: 'Position & Layout',
    icon: 'layout-grid',
    // Matcht: width, height, min-height, max-width, padding, margin, gap, indent, size (aber nicht font-size)
    patterns: [
      /-(width|min-height|max-width|padding|margin|gap|indent)\b/,
      /-height-/,         // nc-button-height-md
      /-padding-/,
      /-gap-/,
      /-min-width/,
      /-touch-target/,
      /-icon-size/,       // nc-button-icon-size-md
      /-spinner-size/,    // nc-button-spinner-size
      /-icon-gap/,        // nc-button-icon-gap-md
    ],
    // Explizite Excludes
    excludePatterns: [
      /-font-size/,
      /-line-height/,     // → Typography
      /-border-width/,    // → Stroke
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: 'typography',
    patterns: [
      /-font-/,
      /-line-height/,
      /-letter-spacing/,
      /-text-/,
      /-label-compact/,
      /-label-expressive/,
    ],
    excludePatterns: [],
  },
  {
    id: 'fill',
    label: 'Fill',
    icon: 'paint',
    // Matcht: bg, background, color (als Textfarbe), gradient
    patterns: [
      /-(bg|background)($|-)/,
      /-(color)($|-)/,
      /-gradient/,
    ],
    // Exclude border-color, ring-color — die gehoeren zu Stroke
    excludePatterns: [
      /-border-color/,
      /-ring-color/,
      /-outline-color/,
    ],
  },
  {
    id: 'stroke',
    label: 'Stroke',
    icon: 'border-style-2',
    patterns: [
      /-border/,
      /-outline/,
      /-ring/,
      /-radius/,
      /-border-width/,
    ],
    excludePatterns: [],
  },
  {
    id: 'effects',
    label: 'Effects',
    icon: 'sparkles',
    patterns: [
      /-shadow/,
      /-elevation/,
      /-opacity/,
      /-blur/,
      /-backdrop/,
      /-transition/,
      /-animation/,
      /-scale/,
      /-transform/,
    ],
    excludePatterns: [],
  },
]

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

/**
 * Klassifiziert ein einzelnes Token in eine Figma-Section.
 * @param {string} tokenId — z.B. "nc-button-primary-bg"
 * @returns {string} — Section-ID ("layout", "typography", "fill", "stroke", "effects")
 */
export function classifyToken (tokenId) {
  for (const section of SECTION_DEFS) {
    // Pruefen ob Token von dieser Section ausgeschlossen ist
    const excluded = section.excludePatterns.some(p => p.test(tokenId))
    if (excluded) continue

    // Pruefen ob Token in diese Section gehoert
    const matched = section.patterns.some(p => p.test(tokenId))
    if (matched) return section.id
  }

  // Fallback: Tokens die nirgendwo passen → "fill" (Farben sind der häufigste Fall)
  return 'fill'
}

/**
 * Klassifiziert ein Array von Tokens in Figma-Sections.
 * @param {Array<{ id: string, label: string, type: string }>} tokens
 * @returns {Array<{ id: string, label: string, icon: string, tokens: Array }>}
 */
export function classifyTokens (tokens) {
  const sections = new Map()

  // Sektionen initialisieren (in definierter Reihenfolge)
  for (const def of SECTION_DEFS) {
    sections.set(def.id, { ...def, tokens: [], patterns: undefined, excludePatterns: undefined })
  }

  // Tokens zuordnen
  for (const token of tokens) {
    const sectionId = classifyToken(token.id)
    const section = sections.get(sectionId)
    if (section) {
      section.tokens.push(token)
    }
  }

  // Leere Sektionen entfernen
  return [...sections.values()].filter(s => s.tokens.length > 0)
}

/**
 * Klassifiziert Subgroups in Figma-Sections.
 * Jede Subgroup wird der Section zugeordnet, in die die MEISTEN ihrer Tokens fallen.
 * @param {Array<{ id: string, label: string, tokens: Array }>} subgroups
 * @returns {Array<{ id: string, label: string, icon: string, subgroups: Array }>}
 */
export function classifySubgroups (subgroups) {
  const sections = new Map()

  for (const def of SECTION_DEFS) {
    sections.set(def.id, { ...def, subgroups: [], patterns: undefined, excludePatterns: undefined })
  }

  for (const sg of subgroups) {
    // Bestimme die dominante Section fuer diese Subgroup
    const sectionCounts = {}
    for (const token of sg.tokens) {
      const sectionId = classifyToken(token.id)
      sectionCounts[sectionId] = (sectionCounts[sectionId] || 0) + 1
    }

    // Die Section mit den meisten Tokens gewinnt
    let dominant = 'fill'
    let maxCount = 0
    for (const [id, count] of Object.entries(sectionCounts)) {
      if (count > maxCount) {
        maxCount = count
        dominant = id
      }
    }

    const section = sections.get(dominant)
    if (section) {
      section.subgroups.push(sg)
    }
  }

  return [...sections.values()].filter(s => s.subgroups.length > 0)
}

/**
 * Gibt die Section-Definitionen zurueck (fuer UI-Rendering).
 * @returns {Array<{ id: string, label: string, icon: string }>}
 */
export function getSectionDefs () {
  return SECTION_DEFS.map(({ id, label, icon }) => ({ id, label, icon }))
}

/**
 * Filtert Tokens einer bestimmten Section.
 * @param {Array} tokens
 * @param {string} sectionId
 * @returns {Array}
 */
export function filterTokensBySection (tokens, sectionId) {
  return tokens.filter(t => classifyToken(t.id) === sectionId)
}

// Composable wrapper
export function useTokenClassifier () {
  return {
    classifyToken,
    classifyTokens,
    classifySubgroups,
    getSectionDefs,
    filterTokensBySection,
  }
}
