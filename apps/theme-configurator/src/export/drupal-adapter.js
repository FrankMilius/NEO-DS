// ==========================================================================
// NEO Theme Configurator — Drupal Export Adapter
// ==========================================================================
// Transforms the generic theme export into Drupal-compatible files:
//   - theme-override.css   — All CSS Custom Properties
//   - theme-settings.json  — Machine-readable config for Drupal theme system
// ==========================================================================

/**
 * Generate Drupal-compatible CSS override file.
 * Wraps overrides in :root and theme class selectors for Drupal's asset system.
 *
 * @param {object} themeJSON - Parsed output of exportAsJSON()
 * @returns {string} CSS content
 */
import { foundationZeilen } from './foundation-css.js'
import { schriftskalaZeilen } from './type-scale-css.js'

export function generateDrupalCSS(themeJSON) {
  const lines = []
  const meta = themeJSON.meta || {}

  lines.push(`/**`)
  lines.push(` * ${meta.name || 'Theme'} — Drupal Override Stylesheet`)
  lines.push(` * Version: ${meta.version || '1.0.0'}`)
  lines.push(` * Generated: ${meta.generated || new Date().toISOString()}`)
  lines.push(` * Generator: ${meta.generator || 'NEO Theme Configurator'}`)
  lines.push(` */\n`)

  // Semantic tokens — Light
  const lightTokens = themeJSON.semantic?.light
  if (lightTokens && Object.keys(lightTokens).length > 0) {
    // Determine class from theme name
    const isNeo = (meta.name || '').toLowerCase().includes('neo')
    const lightClass = isNeo ? '.neo-light-theme' : '.customer-light-theme'
    lines.push(`/* Light Theme Semantic Tokens */`)
    lines.push(`${lightClass} {`)
    for (const [token, value] of Object.entries(lightTokens)) {
      lines.push(`  --fnd-color-${token}: ${value};`)
    }
    lines.push('}\n')
  }

  // Semantic tokens — Dark
  const darkTokens = themeJSON.semantic?.dark
  if (darkTokens && Object.keys(darkTokens).length > 0) {
    const isNeo = (meta.name || '').toLowerCase().includes('neo')
    const darkClass = isNeo ? '.neo-dark-theme' : '.customer-dark-theme'
    lines.push(`/* Dark Theme Semantic Tokens */`)
    lines.push(`${darkClass} {`)
    for (const [token, value] of Object.entries(darkTokens)) {
      lines.push(`  --fnd-color-${token}: ${value};`)
    }
    lines.push('}\n')
  }

  // Foundation overrides — nur ABWEICHUNGEN, mit korrekten Namen.
  // Siehe foundation-css.js: die alte Schleife schrieb --${token} mit dem
  // Oberflaechen-Schluessel heraus und erzeugte damit unbrauchbare Namen.
  const foundation = themeJSON.foundation
  if (foundation && Object.keys(foundation).length > 0) {
    const { zeilen, uebersprungen } = foundationZeilen(foundation)
    if (zeilen.length) {
      lines.push(`/* Foundation Token Overrides (nur Abweichungen vom Design System) */`)
      lines.push(`:root {`)
      lines.push(...zeilen)
      lines.push('}\n')
    }
    if (uebersprungen.length) {
      lines.push(`/* Nicht exportiert — im Design System (noch) nicht vorhanden:`)
      lines.push(`   ${uebersprungen.join(', ')} */\n`)
    }
  }

  // Fluide Schriftskala — nur wenn veraendert (Plan v2, 2.3)
  const skalaZeilen = schriftskalaZeilen(themeJSON.typeScale)
  if (skalaZeilen.length) {
    lines.push(`/* Schriftskala (--fs-*, geaendert gegenueber dem Design System) */`)
    lines.push(`:root {`)
    lines.push(...skalaZeilen)
    lines.push('}\n')
  }

  // Focus ring mode
  if (themeJSON.focusRingMode === 'inset') {
    lines.push(`:root {`)
    lines.push(`  --fnd-focus-ring-offset: calc(-1 * var(--fnd-focus-inset));`)
    lines.push('}\n')
  }

  // Component token overrides (grouped by component)
  const components = themeJSON.components
  if (components && Object.keys(components).length > 0) {
    const hasOverrides = Object.values(components).some(c => Object.keys(c.overrides || {}).length > 0)
    if (hasOverrides) {
      lines.push(`/* Component Token Overrides */`)
      lines.push(`:root {`)
      for (const [compId, comp] of Object.entries(components)) {
        const overrides = comp.overrides || {}
        if (Object.keys(overrides).length === 0) continue
        const verLabel = comp.version ? ` v${comp.version}` : ''
        const lockLabel = comp.locked ? ' (locked)' : ''
        lines.push(`  /* ${compId}${verLabel}${lockLabel} */`)
        for (const [token, value] of Object.entries(overrides)) {
          lines.push(`  --${token}: ${value};`)
        }
      }
      lines.push('}\n')
    }
  }

  // Custom variant modifier classes
  if (components) {
    const variantClasses = []
    for (const [compId, comp] of Object.entries(components)) {
      const customVariants = comp.customVariants || {}
      for (const [variantName, def] of Object.entries(customVariants)) {
        if (!def.modifier) continue
        const variantLines = []
        variantLines.push(`.${def.modifier} {`)
        const tokens = def.tokens || {}
        for (const [tokenId] of Object.entries(tokens)) {
          const baseProperty = tokenId.replace(`nc-${compId}-${variantName}-`, '')
          const baseTokenId = `nc-${compId}-${baseProperty}`
          variantLines.push(`  --${baseTokenId}: var(--${tokenId});`)
        }
        variantLines.push('}')
        variantClasses.push(variantLines.join('\n'))
      }
    }
    if (variantClasses.length > 0) {
      lines.push(`/* Custom Variant Modifier Classes */`)
      lines.push(variantClasses.join('\n'))
      lines.push('')
    }
  }

  return lines.join('\n')
}

/**
 * Generate Drupal-compatible theme settings JSON.
 * Machine-readable configuration for Drupal's theme system.
 *
 * @param {object} themeJSON - Parsed output of exportAsJSON()
 * @returns {string} JSON string
 */
export function generateDrupalSettings(themeJSON) {
  const meta = themeJSON.meta || {}
  const components = themeJSON.components || {}

  // Build component manifest
  const componentManifest = {}
  for (const [compId, comp] of Object.entries(components)) {
    componentManifest[compId] = {
      version: comp.version || null,
      locked: !!comp.locked,
      overrideCount: Object.keys(comp.overrides || {}).length,
      customVariants: Object.keys(comp.customVariants || {})
    }
  }

  // Flatten all token overrides for Drupal consumption
  const allOverrides = {}
  for (const [, comp] of Object.entries(components)) {
    Object.assign(allOverrides, comp.overrides || {})
  }

  const settings = {
    schema: '1.0.0',
    meta: {
      name: meta.name || 'Theme',
      version: meta.version || '1.0.0',
      branch: meta.branch || 'main',
      generated: meta.generated || new Date().toISOString(),
      generator: meta.generator || 'NEO Theme Configurator v2'
    },
    theme: {
      focusRingMode: themeJSON.focusRingMode || 'offset',
      semanticTokenCount: {
        light: Object.keys(themeJSON.semantic?.light || {}).length,
        dark: Object.keys(themeJSON.semantic?.dark || {}).length
      },
      componentOverrideCount: Object.keys(allOverrides).length,
      foundationOverrideCount: Object.values(themeJSON.foundation || {})
        .reduce((sum, cat) => sum + (typeof cat === 'object' ? Object.keys(cat).length : 0), 0)
    },
    components: componentManifest,
    files: {
      css: 'theme-override.css',
      settings: 'theme-settings.json'
    }
  }

  return JSON.stringify(settings, null, 2)
}

/**
 * Download Drupal export bundle as two files.
 *
 * @param {string} jsonExport - The raw JSON string from exportAsJSON()
 */
export function downloadDrupalBundle(jsonExport) {
  const themeJSON = JSON.parse(jsonExport)
  const safeName = (themeJSON.meta?.name || 'theme')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase()

  // Download CSS
  const css = generateDrupalCSS(themeJSON)
  downloadFile(css, `${safeName}-override.css`, 'text/css')

  // Download Settings JSON
  const settings = generateDrupalSettings(themeJSON)
  downloadFile(settings, `${safeName}-settings.json`, 'application/json')
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
