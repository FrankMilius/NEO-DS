#!/usr/bin/env node
/**
 * Prueft vor dem Konfigurator-Build, ob alle in package.json deklarierten
 * Pakete in apps/theme-configurator/node_modules installiert sind.
 * Hintergrund: Nach einem Pull mit neuen Abhaengigkeiten (z. B. pinia)
 * scheitert `vite build` sonst mit einer schwer lesbaren Rollup-Meldung.
 */
'use strict'
const fs = require('fs')
const path = require('path')

const app = path.join(__dirname, '..', 'apps', 'theme-configurator')
const pkg = JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8'))
const namen = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
const fehlend = namen.filter(
  (n) => !fs.existsSync(path.join(app, 'node_modules', ...n.split('/'), 'package.json'))
)

if (fehlend.length) {
  console.error(
    `\n✗ Im Konfigurator fehlen ${fehlend.length} Paket(e): ${fehlend.join(', ')}\n` +
      '  Bitte einmal installieren:\n\n' +
      '    cd apps/theme-configurator && npm ci && cd ../..\n'
  )
  process.exit(1)
}
console.log(`✓ Konfigurator-Abhaengigkeiten vollstaendig (${namen.length} Pakete)`)
