#!/usr/bin/env node

/**
 * check-drupal-image-breakpoints.js
 *
 * IMAGE <-> LAYOUT-VERTRAG (Drift-Check, kein Generator).
 *
 * Stellt sicher, dass Drupals Responsive-Image-Konfiguration an DERSELBEN
 * Schwelle umschaltet wie das Layout — abgeleitet aus EINER Quelle, den
 * Container-Tokens. Bewusst als ASSERT statt Generator: die Drupal-Config
 * bleibt im Besitz der Site (export/import via drush), aber sie darf nicht
 * unbemerkt von den Tokens wegdriften. Bricht (exit 1) bei Abweichung.
 *
 * Vertrag:
 *   container.content (1090)  ==  Image-Style "wide" Scale-Breite (Prosa-/Content-Bilder)
 *   container.wide    (1290)  ==  min-width-Breakpoint in den responsive `sizes`
 *
 * Verwendung:  npm run check:drupal-images
 * Config-Pfad ueberschreibbar via Env NEO_DRUPAL_CONFIG.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const CONFIG = process.env.NEO_DRUPAL_CONFIG
  || resolve(ROOT, '../DRUPAL11/config/sync');

const px = (v) => parseInt(String(v).replace(/px$/, ''), 10);

// 1) Single Source: Container-Tokens
const tokens = JSON.parse(readFileSync(join(ROOT, 'data/design-tokens.json'), 'utf8'));
const container = tokens.foundation.layout.container;
const TOKEN_CONTENT = px(container.content);
const TOKEN_WIDE = px(container.wide);

const fails = [];
const read = (f) => {
  const p = join(CONFIG, f);
  if (!existsSync(p)) { fails.push(`Config fehlt: ${p}`); return ''; }
  return readFileSync(p, 'utf8');
};

// 2) Image-Style "wide" Scale-Breite == container.content
const wideStyle = read('image.style.wide.yml');
const wMatch = wideStyle.match(/id:\s*image_scale[\s\S]*?width:\s*(\d+)/);
const wideWidth = wMatch ? parseInt(wMatch[1], 10) : null;
if (wideWidth !== TOKEN_CONTENT) {
  fails.push(`image.style.wide Scale-Breite ${wideWidth} != container.content ${TOKEN_CONTENT}`);
}

// 3) Responsive `sizes`: container.wide muss als min-width-Breakpoint vorkommen
for (const f of ['responsive_image.styles.wide.yml', 'responsive_image.styles.narrow.yml']) {
  const txt = read(f);
  const sizes = (txt.match(/sizes:\s*'([^']*)'/) || [])[1] || '';
  const bps = [...sizes.matchAll(/\(min-width:\s*(\d+)px\)/g)].map((m) => parseInt(m[1], 10));
  if (!bps.includes(TOKEN_WIDE)) {
    fails.push(`${f}: Layout-Breakpoint ${TOKEN_WIDE}px fehlt in sizes (gefunden: ${bps.join(', ') || 'keine'})`);
  }
}

if (fails.length) {
  console.error('✗ Image<->Layout-Vertrag verletzt (Drift):');
  fails.forEach((f) => console.error('  - ' + f));
  console.error(`\nTokens: content=${TOKEN_CONTENT}px, wide=${TOKEN_WIDE}px`);
  console.error('Drupal-Config an die Token-Werte angleichen (oder die Tokens anpassen) und erneut pruefen.');
  process.exit(1);
}

console.log('✓ Image<->Layout-Vertrag erfuellt:');
console.log(`  image.style.wide = ${wideWidth}px == container.content (${TOKEN_CONTENT}px)`);
console.log(`  responsive sizes nutzen ${TOKEN_WIDE}px == container.wide`);
