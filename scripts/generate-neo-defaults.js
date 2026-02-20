#!/usr/bin/env node
// ==========================================================================
// Generate NEO Theme Defaults — Secure Snapshot
// ==========================================================================
// Reads the token data from the Theme Configurator source and writes a
// complete, read-only JSON snapshot to data/neo-theme-defaults/.
//
// This file serves as the "golden master" for resetting the Neo Theme
// to factory defaults. It should be regenerated any time the base token
// data in apps/theme-configurator/src/data/tokens.js changes.
//
// Usage:  node scripts/generate-neo-defaults.js
// ==========================================================================

import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'fs'
import { dirname, resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// We need to extract data from tokens.js which is an ES module.
// Use dynamic import.
async function main() {
  const tokensPath = join(ROOT, 'apps/theme-configurator/src/data/tokens.js')
  const tokens = await import(tokensPath)

  const {
    primitiveColors,
    supportingPalettes,
    foundationPalettes,
    neutralPalette,
    systemPalettes,
    semanticDefaults,
    semanticTokenGroups,
    componentTokenGroups,
    foundationTokens,
    navigationTree
  } = tokens

  // Build the foundation overrides (same logic as getDefaultFoundation() in theme.js)
  const foundationOverrides = {}
  for (const [category, data] of Object.entries(foundationTokens)) {
    foundationOverrides[category] = {}
    for (const [key, token] of Object.entries(data.tokens)) {
      foundationOverrides[category][key] = token.value
    }
  }

  // Complete snapshot — mirrors the store's initial state for the NEO theme
  const snapshot = {
    _meta: {
      generator: 'NEO Theme Configurator — Factory Defaults',
      description: 'Secure read-only snapshot of the default NEO Theme. Used for reset-to-factory-defaults. DO NOT EDIT MANUALLY.',
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    },

    // Active configuration
    activeThemeSet: 'neo',

    // Semantic token values (all 4 themes)
    themes: {
      neo: {
        light: JSON.parse(JSON.stringify(semanticDefaults['neo-light'])),
        dark: JSON.parse(JSON.stringify(semanticDefaults['neo-dark']))
      },
      customer: {
        light: JSON.parse(JSON.stringify(semanticDefaults['customer-light'])),
        dark: JSON.parse(JSON.stringify(semanticDefaults['customer-dark']))
      }
    },

    // Foundation token defaults
    foundationOverrides: {
      neo: JSON.parse(JSON.stringify(foundationOverrides)),
      customer: JSON.parse(JSON.stringify(foundationOverrides))
    },

    // Component token defaults (empty = use semantic references)
    componentOverrides: {
      neo: {},
      customer: {}
    },

    // Primitive color bases
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

    // Full primitive palettes (for reference / validation)
    primitiveColors: JSON.parse(JSON.stringify(primitiveColors)),
    supportingPalettes: JSON.parse(JSON.stringify(supportingPalettes)),
    foundationPalettes: JSON.parse(JSON.stringify(foundationPalettes)),
    neutralPalette: JSON.parse(JSON.stringify(neutralPalette)),
    systemPalettes: JSON.parse(JSON.stringify(systemPalettes))
  }

  // Write to secure folder
  const outDir = join(ROOT, 'data/neo-theme-defaults')
  mkdirSync(outDir, { recursive: true })

  const outFile = join(outDir, 'neo-theme-defaults.json')
  writeFileSync(outFile, JSON.stringify(snapshot, null, 2), 'utf-8')

  // Make the file read-only (owner read-only, no write)
  try {
    chmodSync(outFile, 0o444)
  } catch (e) {
    console.warn('Could not set read-only permissions:', e.message)
  }

  console.log(`✓ NEO Theme defaults written to: ${outFile}`)
  console.log(`  Size: ${(readFileSync(outFile).length / 1024).toFixed(1)} KB`)
  console.log(`  Themes: neo-light, neo-dark, customer-light, customer-dark`)
  console.log(`  Primitives: ${Object.keys(primitiveColors).join(', ')}`)
  console.log(`  Foundation categories: ${Object.keys(foundationTokens).join(', ')}`)
  console.log(`  Permissions: read-only (444)`)
}

main().catch(err => {
  console.error('Failed to generate NEO defaults:', err)
  process.exit(1)
})
