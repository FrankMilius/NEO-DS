// Theme-Store · Export als CSS-Variablen und JSON
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { foundationZeilen } from '../../export/foundation-css.js'
import { schriftskalaZeilen } from '../../export/type-scale-css.js'
import { state } from './kern.js'
import { semanticDefaults } from '../../data/tokens.js'
import { erzeugeThemeDtcg, ladeDtcgGrundlagen, themeDatenAusState } from '../../export/dtcg.js'
import { extractComponentId } from './komponenten.js'

// ---------------------------------------------------------------------------
// Export as CSS custom properties
// ---------------------------------------------------------------------------

export function exportAsCSSVars() {
  const lines = []
  const themeSet = state.activeThemeSet
  const label = themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'

  // Header with metadata
  lines.push(`/* Theme: ${label} */`)
  lines.push(`/* Version: ${state.version} */`)
  lines.push(`/* Branch: ${_getBranchLabel()} */`)

  // Component version summary
  const versionEntries = Object.entries(state.componentVersions[themeSet] || {})
    .filter(([, v]) => v)
  if (versionEntries.length > 0) {
    const componentSummary = versionEntries
      .map(([id, v]) => `${id}@${v}${state.componentLocks[themeSet]?.[id] ? ' (locked)' : ''}`)
      .join(', ')
    lines.push(`/* Components: ${componentSummary} */`)
  }
  lines.push(`/* Generated: ${new Date().toISOString()} */`)
  lines.push(`/* Generator: NEO Theme Configurator v2 */\n`)

  // === Base Theme (Light) ===
  const lightClass = themeSet === 'neo' ? '.neo-light-theme' : '.customer-light-theme'
  lines.push(`/* === Base Theme (Light) === */`)
  lines.push(`${lightClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].light)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // === Base Theme (Dark) ===
  const darkClass = themeSet === 'neo' ? '.neo-dark-theme' : '.customer-dark-theme'
  lines.push(`/* === Base Theme (Dark) === */`)
  lines.push(`${darkClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].dark)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // === Foundation Overrides ===
  // Nur ABWEICHUNGEN vom Design System, mit korrekten CSS-Namen (foundation-css.js).
  const fndOverrides = state.foundationOverrides[themeSet]
  if (fndOverrides && Object.keys(fndOverrides).length > 0) {
    const { zeilen, uebersprungen } = foundationZeilen(fndOverrides)
    if (zeilen.length) {
      lines.push(`/* === Foundation Overrides (nur Abweichungen) === */`)
      lines.push(`:root {`)
      lines.push(...zeilen)
      lines.push('}\n')
    }
    if (uebersprungen.length) {
      lines.push(`/* Nicht exportiert — im DS nicht vorhanden: ${uebersprungen.join(', ')} */\n`)
    }
  }

  // === Fluide Schriftskala (Plan v2, 2.3) — nur wenn veraendert ===
  const skalaZeilen = schriftskalaZeilen(state.typeScale[themeSet])
  if (skalaZeilen.length) {
    lines.push(`/* === Schriftskala (--fs-*, geaendert gegenueber dem Design System) === */`)
    lines.push(`:root {`)
    lines.push(...skalaZeilen)
    lines.push('}\n')
  }

  // === Focus Ring Mode Override ===
  const focusMode = state.focusRingMode[themeSet]
  if (focusMode === 'inset') {
    lines.push(`/* Focus Ring: Inset-Modus (Outline nach innen) */`)
    lines.push(`:root {`)
    lines.push(`  --fnd-focus-ring-offset: calc(-1 * var(--fnd-focus-inset));`)
    lines.push('}\n')
  }

  // === Component Token Overrides (grouped by component) ===
  const overrides = state.componentOverrides[themeSet]
  if (Object.keys(overrides).length > 0) {
    // Group overrides by component ID
    const grouped = {}
    for (const [token, value] of Object.entries(overrides)) {
      const compId = extractComponentId(token) || '_ungrouped'
      if (!grouped[compId]) grouped[compId] = {}
      grouped[compId][token] = value
    }

    lines.push(`/* === Component Token Overrides === */`)
    lines.push(`:root {`)
    for (const [compId, tokens] of Object.entries(grouped)) {
      const ver = state.componentVersions[themeSet]?.[compId]
      const locked = state.componentLocks[themeSet]?.[compId]
      const verLabel = ver ? ` (v${ver}${locked ? ' — locked' : ''})` : ''
      lines.push(`  /* ${compId}${verLabel} */`)
      for (const [token, value] of Object.entries(tokens)) {
        lines.push(`  --${token}: ${value};`)
      }
    }
    lines.push('}\n')
  }

  // === Custom Variant Modifier Classes ===
  const variants = state.variantDefinitions[themeSet]
  if (variants && Object.keys(variants).length > 0) {
    lines.push(`/* === Custom Variant Modifier Classes === */`)
    for (const [compId, compVariants] of Object.entries(variants)) {
      for (const [variantName, def] of Object.entries(compVariants)) {
        lines.push(`.${def.modifier} {`)
        // Map base variant tokens to custom variant tokens
        if (def.tokens && Array.isArray(def.tokens)) {
          for (const tokenId of def.tokens) {
            // Derive the property name by removing the component+variant prefix
            const baseProperty = tokenId.replace(`nc-${compId}-${variantName}-`, '')
            const baseTokenId = `nc-${compId}-${baseProperty}`
            lines.push(`  --${baseTokenId}: var(--${tokenId});`)
          }
        }
        lines.push('}')
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Get the current branch label for export headers.
 */
export function _getBranchLabel() {
  try {
    // Import is async, so we use a simple fallback
    const stored = localStorage.getItem('neo-theme-branches')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.activeBranchId && data.branches?.[data.activeBranchId]) {
        return data.branches[data.activeBranchId].name
      }
    }
  } catch (e) { /* ignore */ }
  return 'main'
}

export function exportAsJSON() {
  const themeSet = state.activeThemeSet
  const overrides = state.componentOverrides[themeSet] || {}
  const locks = state.componentLocks[themeSet] || {}
  const versions = state.componentVersions[themeSet] || {}
  const variants = state.variantDefinitions[themeSet] || {}

  // Build per-component structured data
  const components = {}
  // Group overrides by component ID
  for (const [token, value] of Object.entries(overrides)) {
    const compId = extractComponentId(token) || '_ungrouped'
    if (!components[compId]) {
      components[compId] = {
        version: versions[compId] || null,
        locked: !!locks[compId],
        overrides: {},
        customVariants: {}
      }
    }
    components[compId].overrides[token] = value
  }

  // Add components that have versions/locks but no overrides
  for (const compId of Object.keys(versions)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId], locked: !!locks[compId], overrides: {}, customVariants: {} }
    } else {
      components[compId].version = versions[compId]
    }
  }
  for (const compId of Object.keys(locks)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId] || null, locked: !!locks[compId], overrides: {}, customVariants: {} }
    } else {
      components[compId].locked = !!locks[compId]
    }
  }

  // Add custom variants
  for (const [compId, compVariants] of Object.entries(variants)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId] || null, locked: !!locks[compId], overrides: {}, customVariants: {} }
    }
    for (const [variantName, def] of Object.entries(compVariants)) {
      const variantTokenValues = {}
      if (def.tokens) {
        for (const tokenId of def.tokens) {
          if (overrides[tokenId] !== undefined) {
            variantTokenValues[tokenId] = overrides[tokenId]
          }
        }
      }
      components[compId].customVariants[variantName] = {
        modifier: def.modifier,
        baseVariant: def.baseVariant,
        tokens: variantTokenValues
      }
    }
  }

  return JSON.stringify({
    meta: {
      name: state.currentThemeMeta?.name || (themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'),
      version: state.version,
      branch: _getBranchLabel(),
      generated: new Date().toISOString(),
      generator: 'NEO Theme Configurator v2'
    },
    components,
    primitives: state.primitiveOverrides[themeSet],
    semantic: {
      light: state.themes[themeSet].light,
      dark: state.themes[themeSet].dark
    },
    foundation: state.foundationOverrides[themeSet],
    typeScale: state.typeScale[themeSet],
    focusRingMode: state.focusRingMode[themeSet]
  }, null, 2)
}

// ---------------------------------------------------------------------------
// DTCG (W3C Design Tokens) — Plan v2, 2.2
// ---------------------------------------------------------------------------
// Derselbe Exporter wie scripts/export-dtcg.cjs (packages/dtcg-export). Quelle
// und styles.css werden erst hier nachgeladen (eigener Chunk).

/**
 * @returns {Promise<{ text: string, hinweise: string[], uebernommen: object, zusammenfassung: string, dateiname: string }>}
 */
export async function exportAsDTCG() {
  const themeSet = state.activeThemeSet
  const grundlagen = await ladeDtcgGrundlagen()
  const name = state.currentThemeMeta?.name || (themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme')
  const erg = erzeugeThemeDtcg(grundlagen, themeDatenAusState(state, themeSet), { themeSet, semanticDefaults, name })
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  return { ...erg, dateiname: `${safeName}.tokens.dtcg.json` }
}
