#!/usr/bin/env node
/**
 * DTCG-Export gegen die heutigen Ausgaben pruefen (P1.2)
 * ==========================================================================
 *   node scripts/pruefe-dtcg.mjs          pruefen, Abweichungen melden (Exit 1)
 *   node scripts/pruefe-dtcg.mjs --css    zusaetzlich dist/dtcg/tokens.css bauen
 *
 * Style Dictionary liest data/design-tokens.dtcg.json und loest ALLE Aliase
 * auf — ein Verweis ins Leere bricht hier ab. Die aufgeloesten Werte werden
 * dann mit dem verglichen, was heute ausgeliefert wird:
 *
 *   foundation.*          == data/design-tokens.css (--fnd-<pfad>)
 *   semantic.* (neo-light) == semantic.defaults["neo-light"] (= Mono-Bruecke)
 *   primitives.*          == Literalwerte in data/design-tokens.json
 *
 * Stimmen sie ueberein, ist der Export verlustfrei: Aliase zeigen auf das,
 * was vorher als Wert dastand.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const WURZEL = process.env.DTCG_WURZEL || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DTCG = path.join(WURZEL, 'data/design-tokens.dtcg.json');
const QUELLE = JSON.parse(fs.readFileSync(path.join(WURZEL, 'data/design-tokens.json'), 'utf8'));
const CSS_ALT = fs.readFileSync(path.join(WURZEL, 'data/design-tokens.css'), 'utf8');
const MIT_CSS = process.argv.includes('--css');

// DTCG 2025.10 schreibt Dauern als {value, unit}; die css-Gruppe von Style
// Dictionary 5 kennt nur Strings und gaebe "[object Object]" aus.
StyleDictionary.registerTransform({
  name: 'neo/dauer',
  type: 'value',
  filter: (t) => (t.$type ?? t.type) === 'duration' && typeof (t.$value ?? t.value) === 'object',
  transform: (t) => { const v = t.$value ?? t.value; return `${v.value}${v.unit}`; },
});

StyleDictionary.registerTransform({
  name: 'neo/mass',
  type: 'value',
  filter: (t) => (t.$type ?? t.type) === 'dimension' && typeof (t.$value ?? t.value) === 'object',
  transform: (t) => { const v = t.$value ?? t.value; return `${v.value}${v.unit}`; },
});

const sd = new StyleDictionary({
  source: [DTCG],
  log: { verbosity: 'silent', warnings: 'disabled', errors: { brokenReferences: 'throw' } },
  platforms: {
    pruefung: {
      transforms: ['attribute/cti', 'name/kebab', 'neo/dauer', 'neo/mass', 'color/css', 'fontFamily/css'],
      files: [{ destination: 'flach.json', format: 'json/flat' }],
    },
    ...(MIT_CSS ? { css: {
      transforms: ['attribute/cti', 'name/kebab', 'neo/dauer', 'neo/mass', 'color/css', 'fontFamily/css'],
      buildPath: path.join(WURZEL, 'dist/dtcg') + '/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
    } } : {}),
  },
});

let flach;
try {
  const [datei] = await sd.formatPlatform('pruefung');
  flach = JSON.parse(datei.output);
} catch (e) {
  console.error('  ✗ Style Dictionary konnte den Export nicht aufloesen:');
  console.error('    ' + String(e.message).split('\n').slice(0, 12).join('\n    '));
  process.exit(1);
}
if (MIT_CSS) await sd.buildPlatform('css');

const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, '');
// Farben numerisch vergleichen: #rrggbbaa und rgba() sind dieselbe Farbe,
// Alpha auf 1/255 genau.
const rgba = (v) => {
  const s = norm(v);
  let m = s.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) / 255 : 1);
  m = s.match(/^rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,([\d.]+))?\)$/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
  return null;
};
const gleich = (a, b) => {
  const x = rgba(a), y = rgba(b);
  if (x && y) return x.slice(0, 3).every((c, i) => Math.round(c) === Math.round(y[i])) && Math.abs(x[3] - y[3]) <= 1 / 255 + 1e-6;
  return norm(a) === norm(b);
};
const vergleiche = (titel, paare) => {
  const falsch = paare.filter(([, soll, ist]) => !gleich(soll, ist));
  const zeichen = falsch.length ? '✗' : '✓';
  console.log(`  ${zeichen} ${titel}: ${paare.length - falsch.length}/${paare.length} gleich`);
  for (const [n, soll, ist] of falsch.slice(0, 12)) console.log(`      ${n}: erwartet ${soll} · Export ${ist}`);
  if (falsch.length > 12) console.log(`      … +${falsch.length - 12}`);
  return falsch.length;
};

let fehler = 0;

// Kurzverweise (praesentation: "mint.100", familie: "heading") stehen in
// design-tokens.css als Text. Fuer den Vergleich aus der QUELLE aufloesen —
// so prueft der Vergleich zugleich, ob der Export richtig aufgeloest hat.
const paletten = new Map();
for (const inhalt of Object.values(QUELLE.primitives)) for (const [n, p] of Object.entries(inhalt || {})) if (p?.shades) paletten.set(n, p.shades);
const erwartet = (name, soll) => {
  const m = String(soll).trim().match(/^([a-z][a-z-]*)\.(\d{2,3})$/);
  if (m && paletten.get(m[1])?.[m[2]] !== undefined) return paletten.get(m[1])[m[2]];
  if (name.endsWith('-familie') && QUELLE.foundation.typography?.fonts?.[String(soll).trim()]) return QUELLE.foundation.typography.fonts[String(soll).trim()];
  return soll;
};

// 1. Foundation gegen design-tokens.css
const alt = new Map([...CSS_ALT.matchAll(/--fnd-([a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2]]));
const f = [];
for (const [name, wert] of Object.entries(flach)) {
  if (!name.startsWith('foundation-') || name.startsWith('foundation-configurator-')) continue;
  const kurz = name.slice('foundation-'.length);
  if (alt.has(kurz)) f.push([kurz, erwartet(kurz, alt.get(kurz)), wert]);
}
fehler += vergleiche('Foundation == data/design-tokens.css', f);

// 2. Semantik (neo-light) gegen die aufgeloesten Bruecken-Werte
const def = QUELLE.semantic.defaults['neo-light'];
const s = [];
for (const [rolle, soll] of Object.entries(def)) {
  const ist = flach[`semantic-${rolle}`];
  if (ist !== undefined) s.push([rolle, soll, ist]);
}
fehler += vergleiche('Semantik neo-light == Mono-Bruecke', s);

// 3. Primitives gegen die Literalwerte der Quelle
const p = [];
for (const [gruppe, inhalt] of Object.entries(QUELLE.primitives)) {
  for (const [name, pal] of Object.entries(inhalt || {})) {
    if (!pal?.shades) continue;
    for (const [st, soll] of Object.entries(pal.shades)) {
      const ist = flach[`primitives-${gruppe}-${name}-shades-${st}`.replace(/_/g, '-')];
      if (ist !== undefined) p.push([`${gruppe}.${name}.${st}`, soll, ist]);
    }
  }
}
fehler += vergleiche('Primitives == Quelle', p);

console.log(`  ${Object.keys(flach).length} Tokens aufgeloest, keine Verweise ins Leere.`);
if (fehler) process.exit(1);
