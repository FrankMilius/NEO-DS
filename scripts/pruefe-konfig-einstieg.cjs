#!/usr/bin/env node
/**
 * Prueft, ob der Konfigurator-Einstieg config/theme-config.html auf das
 * aktuelle Bundle zeigt.
 *
 * Hintergrund: `npm run config:build` schreibt die neuen Asset-Hashes per
 * Vite-Plugin (syncThemeConfigHtml) in theme-config.html. Vite leert dabei
 * config/theme-configurator/ — wird theme-config.html nicht mitcommittet,
 * zeigt der Einstieg auf geloeschte Dateien und die App laedt nicht
 * (passiert in 60a7deb, behoben in bbb6d89).
 *
 *   node scripts/pruefe-konfig-einstieg.cjs            Arbeitsverzeichnis
 *   node scripts/pruefe-konfig-einstieg.cjs --staged   Stand im Git-Index
 *                                                      (Pre-Commit-Hook)
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STAGED = process.argv.includes('--staged');
const EINSTIEG = 'config/theme-config.html';
const BUNDLE_INDEX = 'config/theme-configurator/index.html';

function lies(rel) {
  if (!STAGED) {
    const p = path.join(ROOT, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  }
  try {
    return execFileSync('git', ['show', `:${rel}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch { return null; }
}
function existiert(rel) {
  if (!STAGED) return fs.existsSync(path.join(ROOT, rel));
  try { execFileSync('git', ['cat-file', '-e', `:${rel}`], { cwd: ROOT, stdio: 'ignore' }); return true; }
  catch { return false; }
}
function refs(html) {
  const css = [...html.matchAll(/href="\/config\/(theme-configurator\/assets\/index-[^"]+\.css)"/g)].map(m => m[1]);
  const js = [...html.matchAll(/src="\/config\/(theme-configurator\/assets\/index-[^"]+\.js)"/g)].map(m => m[1]);
  return { css, js };
}

const ort = STAGED ? 'Git-Index' : 'Arbeitsverzeichnis';
const fehler = [];
const einstieg = lies(EINSTIEG);
const bundle = lies(BUNDLE_INDEX);

if (!einstieg) fehler.push(`${EINSTIEG} fehlt`);
if (!bundle) fehler.push(`${BUNDLE_INDEX} fehlt — npm run config:build`);

if (einstieg && bundle) {
  const e = refs(einstieg);
  const b = refs(bundle);
  if (e.css.length !== 1 || e.js.length !== 1) fehler.push(`${EINSTIEG}: erwartet genau 1 CSS- und 1 JS-Einstieg, gefunden ${e.css.length}/${e.js.length}`);
  if (b.css.length !== 1 || b.js.length !== 1) fehler.push(`${BUNDLE_INDEX}: erwartet genau 1 CSS- und 1 JS-Einstieg, gefunden ${b.css.length}/${b.js.length}`);
  if (e.css[0] !== b.css[0]) fehler.push(`CSS: Einstieg ${e.css[0]} ≠ Bundle ${b.css[0]}`);
  if (e.js[0] !== b.js[0]) fehler.push(`JS: Einstieg ${e.js[0]} ≠ Bundle ${b.js[0]}`);
  for (const rel of [...e.css, ...e.js]) {
    if (!existiert(`config/${rel}`)) fehler.push(`Einstieg verweist auf fehlende Datei config/${rel}`);
  }
}

if (fehler.length) {
  console.error(`  ✗ Konfig-Einstieg (${ort}):`);
  for (const f of fehler) console.error(`    - ${f}`);
  console.error(`    Beheben: npm run config:build und ${EINSTIEG} mit dem Bundle zusammen committen.`);
  process.exit(1);
}
console.log(`  ✓ Konfig-Einstieg zeigt auf das aktuelle Bundle (${ort}).`);
