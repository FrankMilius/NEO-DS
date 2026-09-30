#!/usr/bin/env node
/**
 * Prueft das gebaute Konfigurator-Bundle gegen apps/theme-configurator/
 * bundle-budget.json (Plan v2, 4.3). Laeuft in der CI nach dem Build und
 * lokal mit `npm run config:budget`.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'config/theme-configurator/assets');
const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'apps/theme-configurator/bundle-budget.json'), 'utf8'));

if (!fs.existsSync(ASSETS)) {
  console.error('  ✗ Kein Bundle gefunden — zuerst `npm run config:build`.');
  process.exit(1);
}
const dateien = fs.readdirSync(ASSETS);
const gz = (f) => zlib.gzipSync(fs.readFileSync(path.join(ASSETS, f))).length / 1024;
const js = dateien.filter((f) => /^index-.*\.js$/.test(f)).reduce((s, f) => s + gz(f), 0);
const css = dateien.filter((f) => /^index-.*\.css$/.test(f)).reduce((s, f) => s + gz(f), 0);
const gesamt = dateien.reduce((s, f) => s + fs.statSync(path.join(ASSETS, f)).size, 0) / 1024 / 1024;

let fehler = 0;
function zeile(name, ist, max, einheit) {
  const ok = ist <= max;
  if (!ok) fehler++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}: ${ist.toFixed(0)} ${einheit} (Grenze ${max} ${einheit})`);
}
zeile('Einstieg-JS (gzip)', js, budget.einstieg_js_gzip_kb, 'kB');
zeile('Einstieg-CSS (gzip)', css, budget.einstieg_css_gzip_kb, 'kB');
zeile('Bundle gesamt', gesamt, budget.gesamt_mb, 'MB');
process.exit(fehler ? 1 : 0);
