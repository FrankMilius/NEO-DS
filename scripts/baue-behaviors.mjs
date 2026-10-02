#!/usr/bin/env node
// ==========================================================================
// neo-behaviors als fertige Datei fuer die Drupal-Library bauen (Plan v3)
// ==========================================================================
// packages/neo-behaviors/drupal.js → packages/neo-behaviors/dist/neo-behaviors.js
// (IIFE, ES2019, nicht minifiziert, damit Drupal-Entwickler lesen koennen;
// Drupal aggregiert/minifiziert selbst).
//
//   node scripts/baue-behaviors.mjs            bauen
//   node scripts/baue-behaviors.mjs --pruefen  nur vergleichen (Exit 1 bei Drift)
// ==========================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAKET = join(WURZEL, 'packages/neo-behaviors')
const ZIEL = join(PAKET, 'dist/neo-behaviors.js')
const version = JSON.parse(readFileSync(join(PAKET, 'package.json'), 'utf8')).version

const ergebnis = await build({
  entryPoints: [join(PAKET, 'drupal.js')],
  bundle: true,
  format: 'iife',
  target: 'es2019',
  platform: 'browser',
  write: false,
  legalComments: 'none',
  charset: 'utf8',
  banner: { js: `/*! neo-behaviors ${version} — NEO Design System. Gebaut aus packages/neo-behaviors (scripts/baue-behaviors.mjs). Nicht von Hand aendern. */` }
})
const text = ergebnis.outputFiles[0].text

if (process.argv.includes('--pruefen')) {
  const alt = existsSync(ZIEL) ? readFileSync(ZIEL, 'utf8') : ''
  if (alt !== text) { console.error('  ✗ packages/neo-behaviors/dist/neo-behaviors.js ist veraltet — npm run behaviors:build'); process.exit(1) }
  console.log(`  ✓ neo-behaviors ${version}: Drupal-Datei aktuell.`)
} else {
  mkdirSync(dirname(ZIEL), { recursive: true })
  writeFileSync(ZIEL, text)
  console.log(`  ✓ neo-behaviors ${version} → packages/neo-behaviors/dist/neo-behaviors.js (${(text.length / 1024).toFixed(1)} KB)`)
}
