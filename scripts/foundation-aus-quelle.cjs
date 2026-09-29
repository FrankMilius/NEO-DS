#!/usr/bin/env node
/**
 * Foundation-Familien aus der SCSS-Quelle in die Token-JSON uebernehmen
 * ==========================================================================
 *   node scripts/foundation-aus-quelle.cjs              zeigen, was sich aendert
 *   node scripts/foundation-aus-quelle.cjs --schreiben
 *   node scripts/foundation-aus-quelle.cjs --pruefen    Exit 1 bei Abweichung
 *
 * WARUM (P1.2b, 29.09.2026)
 * Der DTCG-Export zeigte 44 Komponenten-Verweise auf Foundation-Tokens, die
 * es im SCSS gibt, in data/design-tokens.json aber nicht: --fnd-size-*,
 * --fnd-tracking-*, --fnd-font-weight-* und die Typo-Rollen
 * --fnd-typography-{display,heading,paragraph}-*. Figma, der Konfigurator
 * und jeder andere JSON-Leser kannten sie nicht.
 *
 * WIE: wie primitives-aus-quelle.cjs — die Werte kommen aus dem KOMPILIERTEN
 * styles.css (die Typo-Rollen entstehen im SCSS per Schleife und stehen als
 * Literal nirgends). Die SCSS bleibt die Wahrheit; die JSON folgt ihr. Die
 * Pfade sind so gewaehlt, dass der flache Name (design-tokens.css, DTCG)
 * GLEICH dem CSS-Namen ist:
 *
 *   foundation.size.touch_target           -> --fnd-size-touch-target
 *   foundation.tracking.snug               -> --fnd-tracking-snug
 *   foundation.font_weight.heading_strong  -> --fnd-font-weight-heading-strong
 *   foundation.typography.heading.m.font_size -> --fnd-typography-heading-m-font-size
 */
const fs = require('fs');
const path = require('path');

const WURZEL = path.resolve(__dirname, '..');
const CSS = path.join(WURZEL, 'styles.css');
const JSON_PFAD = path.join(WURZEL, 'data/design-tokens.json');
const SCHREIBEN = process.argv.includes('--schreiben');
const PRUEFEN = process.argv.includes('--pruefen');

if (!fs.existsSync(CSS)) {
  console.error('  ✗ styles.css fehlt — erst `npm run build:css`.');
  process.exit(1);
}
const css = fs.readFileSync(CSS, 'utf8');
const werte = new Map();
for (const m of css.matchAll(/--fnd-((?:size|tracking|font-weight|typography-(?:display|heading|paragraph))-[a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
  const [, name, wert] = m;
  const w = wert.trim();
  if (werte.has(name) && werte.get(name) !== w) {
    console.error(`  ✗ --fnd-${name} hat im CSS zwei Werte (${werte.get(name)} / ${w}) — Uebernahme waere mehrdeutig.`);
    process.exit(1);
  }
  werte.set(name, w);
}

const zahl = (w) => (/^-?\d+(\.\d+)?$/.test(w) ? Number(w) : w);
const snake = (s) => s.replace(/-/g, '_');
const neu = { size: {}, tracking: {}, font_weight: {}, typography: { display: {}, heading: {}, paragraph: {} } };
for (const [name, w] of werte) {
  let m;
  if ((m = name.match(/^size-(.+)$/))) neu.size[snake(m[1])] = w;
  else if ((m = name.match(/^tracking-(.+)$/))) neu.tracking[snake(m[1])] = w;
  else if ((m = name.match(/^font-weight-(.+)$/))) neu.font_weight[snake(m[1])] = zahl(w);
  else if ((m = name.match(/^typography-(display|heading|paragraph)-([a-z0-9]+)-(font-size|line-height|letter-spacing)$/))) {
    (neu.typography[m[1]][m[2]] ??= {})[snake(m[3])] = w;
  } else {
    console.error(`  ✗ Unbekannte Form: --fnd-${name}`);
    process.exit(1);
  }
}

const quelle = JSON.parse(fs.readFileSync(JSON_PFAD, 'utf8'));
const F = quelle.foundation;
// Einfuegen: size/tracking/font_weight vor _configurator, die Typo-Rollen in
// typography. Reihenfolge der uebrigen Schluessel bleibt.
const vorher = JSON.stringify({ size: F.size, tracking: F.tracking, font_weight: F.font_weight, d: F.typography?.display, h: F.typography?.heading, p: F.typography?.paragraph });
const ergebnis = {};
for (const [k, v] of Object.entries(F)) {
  if (['size', 'tracking', 'font_weight'].includes(k)) continue;
  if (k === '_configurator') { ergebnis.size = neu.size; ergebnis.tracking = neu.tracking; ergebnis.font_weight = neu.font_weight; }
  ergebnis[k] = k === 'typography' ? { ...v, ...neu.typography } : v;
}
if (!('size' in ergebnis)) Object.assign(ergebnis, { size: neu.size, tracking: neu.tracking, font_weight: neu.font_weight });
const nachher = JSON.stringify({ size: ergebnis.size, tracking: ergebnis.tracking, font_weight: ergebnis.font_weight, d: ergebnis.typography.display, h: ergebnis.typography.heading, p: ergebnis.typography.paragraph });

const anzahl = werte.size;
if (vorher === nachher) {
  console.log(`  ✓ Foundation aus der Quelle: ${anzahl} Tokens, unveraendert.`);
  process.exit(0);
}
if (PRUEFEN) {
  console.error(`  ✗ Foundation in data/design-tokens.json weicht von styles.css ab — node scripts/foundation-aus-quelle.cjs --schreiben`);
  process.exit(1);
}
if (!SCHREIBEN) {
  console.log(`  ${anzahl} Tokens wuerden uebernommen (size ${Object.keys(neu.size).length}, tracking ${Object.keys(neu.tracking).length}, font_weight ${Object.keys(neu.font_weight).length}, Typo-Rollen ${Object.values(neu.typography).reduce((n, g) => n + Object.keys(g).length, 0)} Stufen). --schreiben zum Uebernehmen.`);
  process.exit(0);
}
quelle.foundation = ergebnis;
quelle.$meta = { ...quelle.$meta, generiert: { ...(quelle.$meta?.generiert || {}),
  'foundation.size / tracking / font_weight / typography.{display,heading,paragraph}': 'scripts/foundation-aus-quelle.cjs (aus styles.css) — nicht von Hand pflegen',
} };
fs.writeFileSync(JSON_PFAD, JSON.stringify(quelle, null, 2) + '\n');
console.log(`  ✓ data/design-tokens.json: ${anzahl} Foundation-Tokens aus styles.css uebernommen.`);
