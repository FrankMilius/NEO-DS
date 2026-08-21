/**
 * Waechter: Wie viele Komponenten haben echtes Bauteil-Markup?
 *
 *   node scripts/pruefe-markup.mjs           prueft gegen die Mindestzahl
 *   node scripts/pruefe-markup.mjs --setzen  hebt die Mindestzahl auf den Iststand
 *
 * WOZU
 * Storybook zeigte am 21.08.2026 fuer ALLE 131 Komponenten eine Reihe von
 * Klassennamen statt des Bauteils — der Generator hat einen Weg fuer echtes
 * Markup, der nie betreten wurde, weil kein Recipe welches trug.
 *
 * Das ist nicht an einem Tag entstanden, sondern ueber Monate unbemerkt
 * geblieben. Deshalb steht hier eine Zahl, die nicht sinken darf: Wer eine
 * Komponente aufnimmt und das Markup vergisst, faellt beim Testen auf.
 *
 * WARUM EINE MINDESTZAHL UND KEINE VOLLZAEHLIGKEIT
 * 131 Komponenten lassen sich nicht an einem Tag nachtragen. Eine Pruefung auf
 * „alle" waere ab dem ersten Lauf rot und damit sofort wieder etwas, das man
 * gewohnheitsmaessig uebergeht — dieselbe Mechanik wie beim eine Woche lang
 * roten Test im Juni.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATEI = resolve(ROOT, 'data/markup-abdeckung.json');
const SCHWELLE = resolve(ROOT, 'data/markup-mindestens.json');

if (!existsSync(DATEI)) {
  console.error('\n  markup-abdeckung.json fehlt — erst `npm run generate:stories` laufen lassen.\n');
  process.exit(1);
}

const stand = JSON.parse(readFileSync(DATEI, 'utf-8')).stand;
const setzen = process.argv.includes('--setzen');

let mindestens = 0;
if (existsSync(SCHWELLE)) {
  mindestens = JSON.parse(readFileSync(SCHWELLE, 'utf-8')).mindestens ?? 0;
}

if (setzen) {
  writeFileSync(SCHWELLE, JSON.stringify({
    hinweis: 'Untergrenze fuer scripts/pruefe-markup.mjs. Nach jedem Zuwachs mit `--setzen` anheben.',
    mindestens: stand.mit,
  }, null, 2) + '\n');
  console.log(`\n  Mindestzahl auf ${stand.mit} gesetzt.\n`);
  process.exit(0);
}

const balken = (n, g) => {
  const breite = 32;
  const voll = g ? Math.round((n / g) * breite) : 0;
  return '█'.repeat(voll) + '░'.repeat(breite - voll);
};

console.log('\n  BAUTEIL-MARKUP IN STORYBOOK');
console.log('  ' + '─'.repeat(52));
console.log(`  ${balken(stand.mit, stand.gesamt)}  ${stand.mit}/${stand.gesamt}  (${stand.anteil} %)`);
console.log(`  Mindestzahl: ${mindestens}`);

if (stand.mit < mindestens) {
  console.error(`\n  ✗ Abdeckung gesunken: ${stand.mit} statt mindestens ${mindestens}.`);
  console.error('    Eine Komponente hat ihr Markup verloren, oder eine neue kam ohne dazu.');
  console.error('    Siehe data/markup/LIESMICH.md\n');
  process.exit(1);
}

if (stand.mit > mindestens) {
  console.log(`\n  ✓ ${stand.mit - mindestens} dazugekommen. Mit \`node scripts/pruefe-markup.mjs --setzen\` festschreiben.`);
}
else {
  console.log('\n  ✓ unveraendert');
}
console.log('');
