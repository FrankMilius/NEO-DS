#!/usr/bin/env node

/**
 * sync-drupal-css.js
 *
 * DS -> Drupal-Theme-Sync (Single Source of Truth).
 * Kopiert den gebauten Token-/CSS-Output des Design Systems in das Drupal-Theme
 * `neo_fe`, das die CSS statisch via Libraries konsumiert (kein eigener Build).
 *
 * Damit ist DIES der eine dokumentierte Schritt, der DS-Aenderungen ins Theme
 * durchschlagen laesst:
 *
 *   npm run build:drupal        # tokens (separat) + build:css + dieser Sync
 *
 * Quelle:  WEBSITE26/styles.css            (kompiliert via `npm run build:css`)
 *          WEBSITE26/data/design-tokens.css (generiert via `npm run tokens`)
 * Ziel:    <THEME>/css/styles.css
 *          <THEME>/css/design-tokens.css
 *
 * Zielpfad ueberschreibbar via Env NEO_DRUPAL_THEME (Default = Repo-Nachbar).
 */

import { copyFileSync, existsSync, statSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const THEME = process.env.NEO_DRUPAL_THEME
  || resolve(ROOT, '../DRUPAL11/web/themes/custom/neo_fe');

const PAIRS = [
  { src: join(ROOT, 'styles.css'), dest: join(THEME, 'css', 'styles.css'), label: 'styles.css' },
  { src: join(ROOT, 'data', 'design-tokens.css'), dest: join(THEME, 'css', 'design-tokens.css'), label: 'design-tokens.css' },
];

if (!existsSync(join(THEME, 'css'))) {
  console.error(`✗ Theme-CSS-Verzeichnis nicht gefunden: ${join(THEME, 'css')}`);
  console.error('  Setze NEO_DRUPAL_THEME auf den neo_fe-Theme-Pfad.');
  process.exit(1);
}

let ok = 0;
for (const { src, dest, label } of PAIRS) {
  if (!existsSync(src)) {
    console.error(`✗ Quelle fehlt: ${src} — erst "npm run tokens && npm run build:css" ausfuehren.`);
    process.exit(1);
  }
  copyFileSync(src, dest);
  const kb = (statSync(dest).size / 1024).toFixed(1);
  console.log(`✓ ${label} -> ${dest} (${kb} KB)`);
  ok++;
}

console.log(`\nFertig. ${ok} Datei(en) ins Drupal-Theme synchronisiert.`);
console.log('Hinweis: in Drupal anschliessend "drush cr" (Cache) ausfuehren.');
