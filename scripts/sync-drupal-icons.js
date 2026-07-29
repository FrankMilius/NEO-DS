#!/usr/bin/env node
// ==========================================================================
// Icon Sync: Design-System -> Drupal-Theme
// ==========================================================================
// Schreibt die Heroicons-Sammlung als flache Nachschlagekarte
// { "<name>": "<svg>" } in das neo_fe-Theme.
//
// WARUM eine Datei statt Einzel-SVGs:
//   Die Karte wird SERVERSEITIG gelesen (neo_fe.theme). Nur die tatsaechlich
//   verwendeten Icons landen im HTML - die ~150 KB gehen nie an den Browser.
//
// WARUM Heroicons und nicht der volle 5254er-Satz:
//   Ein geschlossener, visuell konsistenter Outline-Satz. Alle Pfade nutzen
//   stroke="currentColor", sind also ueber CSS/Tokens einfaerbbar.
//
// Zielpfad ueberschreibbar via Env NEO_DRUPAL_THEME (Default = Repo-Nachbar).
//
// Nutzung: npm run sync:drupal-icons
// ==========================================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { resolve, join, dirname } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const THEME = process.env.NEO_DRUPAL_THEME
  || resolve(ROOT, '../DRUPAL11/web/themes/custom/neo_fe');

const SRC = join(ROOT, 'data', 'icons-manifest-heroicons.json');
const DEST = join(THEME, 'data', 'icons-heroicons.json');

if (!existsSync(SRC)) {
  console.error(`✗ Quelle fehlt: ${SRC}`);
  process.exit(1);
}
if (!existsSync(THEME)) {
  console.error(`✗ Theme-Pfad nicht gefunden: ${THEME}`);
  console.error('  Setze NEO_DRUPAL_THEME auf den neo_fe-Theme-Pfad.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(SRC, 'utf8'));
const map = {};

for (const icon of manifest.icons) {
  if (!icon.name || !icon.svg) continue;
  // Whitespace normalisieren - spart ~15% und haelt das Diff stabil.
  map[icon.name] = icon.svg.replace(/\s+/g, ' ').trim();
}

const names = Object.keys(map).sort();
const ordered = {};
for (const n of names) ordered[n] = map[n];

mkdirSync(dirname(DEST), { recursive: true });
writeFileSync(DEST, JSON.stringify(ordered, null, 0), 'utf8');

const kb = (statSync(DEST).size / 1024).toFixed(1);
console.log(`✓ ${names.length} Icons -> ${DEST} (${kb} KB)`);
console.log('  Hinweis: wird serverseitig gelesen, nicht an den Browser ausgeliefert.');
