/**
 * @file
 * Vergleicht zwei Referenzstaende und meldet jede Abweichung.
 *
 *   npm run baseline:diff -- vorher nachher
 *   npm run baseline:diff -- vorher nachher --nur nc-card
 *   npm run baseline:diff -- vorher nachher --markdown  > bericht.md
 *
 * Die Ausgabe ist die Pruefschranke der Migration: nach jedem verschobenen
 * Komponenten-Override wird gemessen und verglichen. Erwartet wird NULL
 * Abweichung — jede gemeldete Zeile ist entweder eine gewollte Korrektur oder
 * ein Regressionsfund.
 */

import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ablage = resolve(wurzel, 'data/baseline');

const argv = process.argv.slice(2);
const flags = argv.filter((a) => a.startsWith('--'));
const namen = argv.filter((a) => !a.startsWith('--'));
const [a, b] = namen;
const nurIdx = argv.indexOf('--nur');
const filter = nurIdx >= 0 ? argv[nurIdx + 1] : null;
const markdown = flags.includes('--markdown');

if (!a || !b) {
  console.error('Aufruf: npm run baseline:diff -- <vorher> <nachher> [--nur <klasse>] [--markdown]');
  process.exit(1);
}

const laden = (n) => {
  const gz = resolve(ablage, `${n}.json.gz`);
  if (existsSync(gz)) return JSON.parse(gunzipSync(readFileSync(gz)).toString('utf8'));
  const roh = resolve(ablage, `${n}.json`);
  if (existsSync(roh)) return JSON.parse(readFileSync(roh, 'utf8'));
  console.error(`Referenzstand fehlt: ${gz}`); process.exit(1);
};

const A = laden(a), B = laden(b);
const kA = A.komponenten || {}, kB = B.komponenten || {};

const alle = [...new Set([...Object.keys(kA), ...Object.keys(kB)])]
  .filter((k) => !filter || k.includes(filter))
  .sort();

const treffer = [];
let verglichen = 0;

for (const komp of alle) {
  const vorher = kA[komp], nachher = kB[komp];
  if (!vorher) { treffer.push({ komp, art: 'neu', text: 'kommt im Nachher-Stand neu hinzu' }); continue; }
  if (!nachher) { treffer.push({ komp, art: 'weg', text: 'im Nachher-Stand nicht mehr gefunden' }); continue; }

  const kontexte = [...new Set([...Object.keys(vorher), ...Object.keys(nachher)])].sort();
  for (const kontext of kontexte) {
    const dv = vorher[kontext] || {}, dn = nachher[kontext] || {};
    const props = [...new Set([...Object.keys(dv), ...Object.keys(dn)])].sort();
    for (const p of props) {
      verglichen++;
      const x = dv[p], y = dn[p];
      if (x === y) continue;
      treffer.push({ komp, kontext, prop: p, vorher: x ?? '(nicht gesetzt)', nachher: y ?? '(nicht gesetzt)', art: 'geaendert' });
    }
  }
}

// ---------------------------------------------------------------------------

const [breite, theme] = ['', ''];
const kurz = (v) => String(v).length > 34 ? String(v).slice(0, 31) + '…' : String(v);

if (markdown) {
  console.log(`# Abweichungen: ${a} → ${b}\n`);
  console.log(`Verglichen: ${verglichen} Werte über ${alle.length} Komponenten.`);
  console.log(`Gefunden: **${treffer.length}** Abweichungen.\n`);
  const nachKomp = {};
  for (const t of treffer) (nachKomp[t.komp] ??= []).push(t);
  for (const [komp, liste] of Object.entries(nachKomp)) {
    console.log(`\n## \`.${komp}\` — ${liste.length}\n`);
    console.log('| Kontext | Eigenschaft | vorher | nachher |');
    console.log('|---|---|---|---|');
    for (const t of liste) {
      if (t.art !== 'geaendert') { console.log(`| – | – | – | ${t.text} |`); continue; }
      console.log(`| \`${t.kontext}\` | \`${t.prop}\` | \`${t.vorher}\` | \`${t.nachher}\` |`);
    }
  }
} else {
  console.log(`Referenzstaende: ${a} (${A.erzeugt?.slice(0, 16)})  →  ${b} (${B.erzeugt?.slice(0, 16)})`);
  console.log(`Verglichen: ${verglichen} Werte ueber ${alle.length} Komponenten${filter ? ` (Filter: ${filter})` : ''}\n`);
  if (!treffer.length) {
    console.log('  KEINE ABWEICHUNG. Die Verschiebung ist wirkungsgleich.');
  } else {
    let letzte = null;
    for (const t of treffer) {
      if (t.komp !== letzte) { console.log(`\n  .${t.komp}`); letzte = t.komp; }
      if (t.art !== 'geaendert') { console.log(`      ${t.text}`); continue; }
      console.log(`      ${t.kontext.padEnd(22)} ${t.prop.padEnd(20)} ${kurz(t.vorher).padEnd(36)} → ${kurz(t.nachher)}`);
    }
    console.log(`\n  ${treffer.length} Abweichung(en) in ${new Set(treffer.map((t) => t.komp)).size} Komponente(n).`);
    console.log('  Jede davon ist entweder eine gewollte Korrektur oder eine Regression.');
  }
}

process.exit(treffer.length ? 1 : 0);
