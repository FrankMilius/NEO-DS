#!/usr/bin/env node
// ==========================================================================
// Werkseinstellung der Konfig-App (neo-theme-defaults.json) erzeugen
// ==========================================================================
//   node scripts/generate-neo-defaults.js            schreiben (nur bei Aenderung)
//   node scripts/generate-neo-defaults.js --pruefen  Exit 1, wenn die Datei veraltet ist
//
// Die Datei ist der "Golden Master" fuer "Reset to Defaults" in der App
// (theme.js → loadNeoDefaults, ueber /api/neo-theme-defaults).
//
// WARUM NEU (30.09.2026, Plan v2 Schritt 2.1)
// Der Generator las apps/theme-configurator/src/data/tokens.js. Diese Datei
// importiert JSON ohne Import-Attribut — das versteht nur Vite, Node bricht
// ab. Die Werkseinstellung wurde deshalb seit Februar nicht mehr erzeugt und
// setzte beim Zuruecksetzen Primary #002049 und Secondary #009fe3 (alte
// Marke) als Overrides, obwohl die Quelle seit dem 24.08. Graphit fuehrt.
// Jetzt liest er das reine Generat tokens.generated.js (keine Importe).
//
// Stabil: generatedAt aendert sich nur, wenn sich der Inhalt aendert — sonst
// erzeugte jeder Lauf einen Diff. Die Datei wird nicht mehr schreibgeschuetzt
// (chmod 444 blockierte semantik-aus-bruecke und Git-Checkouts).
// ==========================================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GENERAT = join(ROOT, 'apps/theme-configurator/src/data/tokens.generated.js')
const OUT_DIR = join(ROOT, 'data/neo-theme-defaults')
const OUT = join(OUT_DIR, 'neo-theme-defaults.json')
const PRUEFEN = process.argv.includes('--pruefen')

const kopie = (x) => JSON.parse(JSON.stringify(x))

const {
  primitiveColors, supportingPalettes, foundationPalettes, neutralPalette,
  systemPalettes, semanticDefaults, foundationTokens,
} = await import(pathToFileURL(GENERAT).href)

// Foundation-Vorgaben — dieselbe Logik wie getDefaultFoundation() in theme.js
const foundation = {}
for (const [kat, daten] of Object.entries(foundationTokens)) {
  if (!daten?.tokens) continue
  foundation[kat] = {}
  for (const [key, t] of Object.entries(daten.tokens)) foundation[kat][key] = t.value
}

const basen = () => ({
  primary: primitiveColors.primary.base,
  secondary: primitiveColors.secondary.base,
  accent: primitiveColors.accent.base,
})

const inhalt = {
  activeThemeSet: 'neo',
  themes: {
    neo: { light: kopie(semanticDefaults['neo-light']), dark: kopie(semanticDefaults['neo-dark']) },
    customer: { light: kopie(semanticDefaults['customer-light']), dark: kopie(semanticDefaults['customer-dark']) },
  },
  foundationOverrides: { neo: kopie(foundation), customer: kopie(foundation) },
  componentOverrides: { neo: {}, customer: {} },
  primitiveOverrides: { neo: basen(), customer: basen() },
  primitiveColors: kopie(primitiveColors),
  supportingPalettes: kopie(supportingPalettes),
  foundationPalettes: kopie(foundationPalettes),
  neutralPalette: kopie(neutralPalette),
  systemPalettes: kopie(systemPalettes),
}

const alt = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null
const ohneMeta = (o) => { if (!o) return null; const { _meta, ...rest } = o; return JSON.stringify(rest) }
const unveraendert = ohneMeta(alt) === JSON.stringify(inhalt)

if (PRUEFEN) {
  if (!unveraendert) {
    console.error('  ✗ data/neo-theme-defaults/neo-theme-defaults.json weicht von der Quelle ab — node scripts/generate-neo-defaults.js')
    process.exit(1)
  }
  console.log('  ✓ Werkseinstellung der Konfig-App entspricht der Quelle.')
  process.exit(0)
}
if (unveraendert) {
  console.log('  ✓ neo-theme-defaults.json unveraendert')
  process.exit(0)
}

const snapshot = {
  _meta: {
    generator: 'scripts/generate-neo-defaults.js',
    description: 'Werkseinstellung der Konfig-App fuer "Reset to Defaults". Erzeugt aus tokens.generated.js — nicht von Hand pflegen.',
    generatedAt: new Date().toISOString(),
    version: alt?._meta?.version || '1.0.0',
  },
  ...inhalt,
}
mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
console.log(`  ✓ neo-theme-defaults.json neu geschrieben — Primary ${inhalt.primitiveOverrides.neo.primary}, Secondary ${inhalt.primitiveOverrides.neo.secondary}, Accent ${inhalt.primitiveOverrides.neo.accent}`)
