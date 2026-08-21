/**
 * Prueft geerntetes Markup gegen die Anatomie im Recipe.
 *
 *   node scripts/pruefe-ernte.mjs
 *
 * WARUM
 * Geerntetes Markup ist echt, aber nicht automatisch gut. Ein Block, bei dem
 * der Redakteur die Haelfte der Felder leer gelassen hat, liefert ein Bauteil
 * ohne Urheber, ohne Buttons, ohne Bild — und die Story zeigt dann eine Ruine
 * statt eines Bauteils. Das Recipe weiss, welche Bereiche zwingend sind.
 * Diese Pruefung stellt beides gegenueber und nennt die Fehlstellen.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MARKUP = resolve(ROOT, 'data/markup');

// Das kompilierte Stylesheet entscheidet, welche Art von Fehlstelle vorliegt:
// Steht die Klasse dort nicht, beschreibt das Recipe einen Bereich, den es in
// der Umsetzung nie gab — dann ist das Recipe falsch, nicht der Inhalt.
const CSS = readFileSync(resolve(ROOT, 'styles.css'), 'utf8');
const imCss = (klasse) => new RegExp(`\\.${klasse}\\b`).test(CSS);

const zeilen = [];
let ganz = 0, luecken = 0;

for (const datei of readdirSync(MARKUP).filter((f) => f.endsWith('.html')).sort()) {
  const name = datei.replace(/\.html$/, '');
  const rezept = resolve(ROOT, `data/${name}-recipe.json`);
  if (!existsSync(rezept)) { zeilen.push([name, '—', 'kein Recipe', '']); continue; }

  const r = JSON.parse(readFileSync(rezept, 'utf8'));
  const slots = r.anatomy?.slots ?? [];
  if (!slots.length) { zeilen.push([name, '—', 'Recipe ohne Anatomie', '']); continue; }

  const html = readFileSync(resolve(MARKUP, datei), 'utf8');
  const fehlend = slots
    .filter((s) => !s.optional && s.element)
    .map((s) => ({ name: s.name, klasse: String(s.element).replace(/^\./, '') }))
    .filter((s) => !new RegExp(`class="[^"]*\\b${s.klasse}\\b`).test(html));

  const erfunden = fehlend.filter((s) => !imCss(s.klasse));
  const leer = fehlend.filter((s) => imCss(s.klasse));

  const pflicht = slots.filter((s) => !s.optional && s.element).length;
  if (!fehlend.length) { ganz++; zeilen.push([name, `${pflicht}/${pflicht}`, 'vollstaendig', '']); continue; }

  luecken++;
  const teile = [];
  if (erfunden.length) teile.push(`Recipe erfindet: ${erfunden.map((s) => s.name).join(', ')}`);
  if (leer.length) teile.push(`Inhalt leer: ${leer.map((s) => s.name).join(', ')}`);
  zeilen.push([name, `${pflicht - fehlend.length}/${pflicht}`,
               erfunden.length && !leer.length ? 'RECIPE FALSCH' : 'FEHLSTELLEN',
               teile.join(' · ')]);
}

console.log('\n  ERNTE GEGEN ANATOMIE');
console.log('  ' + '─'.repeat(96));
for (const [n, q, s, d] of zeilen) {
  console.log(`  ${n.padEnd(19)} ${q.padStart(5)}  ${s.padEnd(21)} ${d}`);
}
console.log('  ' + '─'.repeat(96));
console.log(`  vollstaendig: ${ganz}   mit Fehlstellen: ${luecken}\n`);
// Bewusst kein Fehlercode: Fehlstellen sind fast immer Inhaltsluecken auf der
// Website, nicht Fehler im Design System. Diese Pruefung berichtet, sie
// blockiert nicht — die Schwelle bewacht `pruefe-markup.mjs`.
process.exit(0);
