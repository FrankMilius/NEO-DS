/**
 * Wer benutzt ein Bauteil eigentlich?
 *
 *   node scripts/nutzung-pruefen.mjs            nur die ohne Markup
 *   node scripts/nutzung-pruefen.mjs --alle     alle 131
 *
 * WOFUER
 * Storybook Phase 4 fragt nicht "wie schreibe ich Markup fuer die letzten 30",
 * sondern "verdienen die letzten 30 ueberhaupt Markup". Ein Bauteil, das auf
 * keiner Seite steht, in keiner Doku vorkommt, von keinem anderen Bauteil
 * benutzt wird und in keiner Vorlage auftaucht, ist ein Kandidat zum Entfernen
 * — nicht zum Dokumentieren. Ihn zu dokumentieren macht die Doku groesser und
 * das Problem aelter.
 *
 * WORAUS SICH DIE VERWENDUNG ERGIBT
 * Vier voneinander unabhaengige Zeugen, damit nicht eine einzige Suche
 * entscheidet:
 *
 *   Website   das Bauteil wurde von einer laufenden Seite geerntet
 *   Doku      es hat eine eigene Doku-Seite ODER kommt in einer vor
 *   Theme     eine Drupal-Vorlage schreibt seine Wurzelklasse
 *   Bauteile  ein anderes SCSS-Bauteil verweist auf seine Klasse
 *
 * Das CSS-Gewicht steht daneben, weil es die Entscheidung mittraegt: 28 kB
 * ohne einen einzigen Nutzer wiegen anders als 400 Byte.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, 'data');
const MARKUP = resolve(DATA, 'markup');
const DOKU = resolve(ROOT, 'docs');
const SCSS = resolve(ROOT, 'scss/scss');
const THEME = '/Users/frank.milius/Sites/DRUPAL11/web/themes/custom/neo_fe/templates';

const alle = process.argv.includes('--alle');

// ─── Quellen einmal einlesen ─────────────────────────────────────────
const css = readFileSync(resolve(ROOT, 'styles.css'), 'utf8');

function dateienUnter(verzeichnis, muster) {
  if (!existsSync(verzeichnis)) return [];
  const raus = [];
  for (const e of readdirSync(verzeichnis, { withFileTypes: true })) {
    const pfad = resolve(verzeichnis, e.name);
    if (e.isDirectory()) raus.push(...dateienUnter(pfad, muster));
    else if (muster.test(e.name)) raus.push(pfad);
  }
  return raus;
}

const dokuText = dateienUnter(DOKU, /\.(html|js)$/).map((f) => readFileSync(f, 'utf8')).join('\n');
const themeText = dateienUnter(THEME, /\.twig$/).map((f) => readFileSync(f, 'utf8')).join('\n');
const scssDateien = dateienUnter(SCSS, /\.scss$/).map((f) => ({ name: basename(f), text: readFileSync(f, 'utf8') }));

/** Wie viele Zeichen CSS entfallen auf dieses Bauteil? */
function gewicht(wurzel) {
  const klasse = wurzel.replace(/^\./, '');
  // Ohne Wurzelklasse traefe das Muster JEDEN Regelblock. Beim ersten Lauf
  // stand chapter-nav deshalb mit 1105 kB da — dem ganzen Stylesheet — und
  // ohne einen einzigen Zeugen, obwohl es live auf den Landing Pages steht.
  // Ein Recipe ohne Wurzelselektor ist nicht messbar, und das ist der Befund.
  if (!klasse) return NaN;
  let summe = 0;
  // Regelbloecke, deren Selektor die Wurzelklasse enthaelt.
  const muster = new RegExp(`\\.${klasse}\\b[^{]*\\{[^}]*\\}`, 'g');
  for (const m of css.matchAll(muster)) summe += m[0].length;
  return summe;
}

// ─── Bauteile durchgehen ─────────────────────────────────────────────
const zeilen = [];

for (const datei of readdirSync(DATA).filter((f) => f.endsWith('-recipe.json')).sort()) {
  const name = datei.replace(/-recipe\.json$/, '');
  const hatMarkup = existsSync(resolve(MARKUP, `${name}.html`));
  if (!alle && hatMarkup) continue;

  let r;
  try { r = JSON.parse(readFileSync(resolve(DATA, datei), 'utf8')); } catch { r = {}; }
  const wurzel = r.anatomy?.root?.element ?? '';
  const klasse = wurzel.replace(/^\./, '');

  const website = hatMarkup && readFileSync(resolve(MARKUP, `${name}.html`), 'utf8').includes('von Website');
  const eigeneDokuSeite = existsSync(resolve(DOKU, `${name}-docs.html`));
  const inDoku = eigeneDokuSeite || (klasse !== '' && dokuText.includes(klasse));
  const imTheme = klasse !== '' && themeText.includes(klasse);

  // Verweise aus ANDEREN Bauteilen — die eigene SCSS-Datei zaehlt nicht.
  const eigene = new Set([`_${name}.scss`]);
  const vonAnderen = klasse === '' ? [] : scssDateien
    .filter((d) => !eigene.has(d.name) && d.text.includes(klasse))
    .map((d) => d.name.replace(/^_|\.scss$/g, ''));

  zeilen.push({
    name,
    ohneWurzel: klasse === '',
    wurzel: wurzel || '—',
    status: r.status ?? r.meta?.status ?? '?',
    markup: hatMarkup,
    website,
    doku: inDoku,
    theme: imTheme,
    andere: vonAnderen,
    kb: gewicht(wurzel) / 1024,
  });
}

// ─── Ausgabe: nach Zeugenzahl, dann nach Gewicht ─────────────────────
const zeugen = (z) => (z.website ? 1 : 0) + (z.doku ? 1 : 0) + (z.theme ? 1 : 0) + (z.andere.length ? 1 : 0);
zeilen.sort((a, b) => zeugen(b) - zeugen(a) || (b.kb || 0) - (a.kb || 0));

console.log(`\n  VERWENDUNG — ${zeilen.length} Bauteile${alle ? '' : ' ohne Markup'}`);
console.log('  ' + '─'.repeat(94));
console.log(`  ${'Bauteil'.padEnd(22)} ${'Web'.padEnd(4)}${'Doku'.padEnd(6)}${'Theme'.padEnd(7)}${'Bauteile'.padEnd(10)}${'CSS'.padStart(8)}   Status`);
console.log('  ' + '─'.repeat(94));

for (const z of zeilen) {
  const ja = (b) => (b ? ' ja ' : '  · ');
  const andere = z.andere.length ? `${z.andere.length}×`.padEnd(10) : '  ·       ';
  console.log(
    `  ${z.name.padEnd(22)}${ja(z.website)}${ja(z.doku).padEnd(6)}${ja(z.theme).padEnd(7)}${andere}`
    + `${(Number.isNaN(z.kb) ? '  —' : z.kb.toFixed(1)).padStart(6)} kB   ${z.status}`
    + (z.ohneWurzel ? '  ← Recipe ohne Wurzelselektor, nicht pruefbar' : ''),
  );
}

const ohneZeugen = zeilen.filter((z) => zeugen(z) === 0 && !z.ohneWurzel);
const unpruefbar = zeilen.filter((z) => z.ohneWurzel);
console.log('  ' + '─'.repeat(94));
if (ohneZeugen.length) {
  const kb = ohneZeugen.reduce((s, z) => s + (z.kb || 0), 0);
  console.log(`  ${ohneZeugen.length} Bauteile ohne jeden Zeugen — zusammen ${kb.toFixed(1)} kB CSS:`);
  console.log(`      ${ohneZeugen.map((z) => z.name).join(', ')}`);
  console.log('  Diese gehoeren nicht dokumentiert, sondern entschieden.');
}
if (unpruefbar.length) {
  console.log(`  ${unpruefbar.length} Recipe(s) ohne Wurzelselektor — ueber die sagt diese Tabelle nichts:`);
  console.log(`      ${unpruefbar.map((z) => z.name).join(', ')}`);
}
console.log('');
