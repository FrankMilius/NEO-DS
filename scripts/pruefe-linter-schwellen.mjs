/**
 * Haelt die Linie bei den Lintern, die Altbestand melden.
 *
 *   npm run lint:schwellen
 *   npm run lint:schwellen -- --setzen    Bestand festschreiben
 *
 * WARUM DAS GEBRAUCHT WIRD
 * Am 25.08.2026 lief `npm test` zum ersten Mal seit Wochen ueber den
 * Token-Waechter hinaus — und blieb sofort am naechsten Linter stehen. Dahinter
 * warteten vier weitere, zusammen ueber 490 Befunde. Alle davon sind
 * Altbestand: Sie standen schon vorher da, nur hat sie niemand gesehen, weil
 * der Lauf vorher abbrach.
 *
 * Vor der Wahl zwischen „Suite bleibt rot" und „Linter aus `npm test` nehmen"
 * ist beides falsch. Eine Suite, die ab dem ersten Tag rot ist, wird
 * abgeschaltet; ein Linter, den niemand aufruft, ist dasselbe wie keiner.
 * Genau diese Mechanik hat die 236 fehlenden Tokens wochenlang verdeckt.
 *
 * Also dieselbe Loesung wie bei `lint:markup` und `lint:klassen`: Der Bestand
 * wird eingefroren und darf nur SINKEN. Neue Befunde fallen sofort auf, alte
 * duerfen der Reihe nach verschwinden.
 *
 * WAS DIESE PRUEFUNG NICHT IST
 * Kein Freibrief. Die Zahlen stehen sichtbar in data/linter-schwellen.json und
 * in jeder Ausgabe. Wer sie anhebt, sieht im Diff, was er tut.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCHWELLEN = resolve(ROOT, 'data/linter-schwellen.json');

/** Je Linter: Aufruf und wie die Schlusszeile zu lesen ist. */
const LINTER = [
  { id: 'tokens',       befehl: 'npm run lint:tokens',       muster: /Token-Lint:\s*(\d+)\s*Problem/ },
  { id: 'docs-tokens',  befehl: 'npm run lint:docs-tokens',  muster: /Docs-Token-Lint:\s*(\d+)\s*Problem/ },
  { id: 'fragments',    befehl: 'npm run lint:fragments',    muster: /Fragment-Lint:\s*(\d+)\s*CRITICAL/ },
  { id: 'docs-scripts', befehl: 'npm run lint:docs-scripts', muster: /Script-Integrity-Lint:\s*(\d+)\s*ERROR/ },
  { id: 'recipes',      befehl: 'npm run lint:recipes',      muster: /Recipe-Lint:.*?,\s*(\d+)\s*Fehler/ },
  // Token-Validator (Token-Audit F2): meldete am 29.09.2026 100 Fehler Altbestand.
  // "PASSED" hat keine Zahl — dann gilt 0.
  // Token-Audit F1: var() ohne Definition und ohne Rueckfallwert im gebauten CSS.
  { id: 'tote-verweise', befehl: 'node scripts/pruefe-tote-verweise.cjs', muster: /Tote-Verweise:\s*(\d+)/ },
  // Doku gegen Recipe/CSS (Summe aller Befunde ueber docs/content/*.html).
  { id: 'doku-befunde', befehl: 'node scripts/pruefe-doku-gegen-recipe.cjs --summe', muster: /Doku-Befunde:\s*(\d+)/ },
  { id: 'token-validator', befehl: 'npm run tokens:validate', muster: /Token validation (?:FAILED:\s*(\d+)\s*error|PASSED)/ },
];

const setzen = process.argv.includes('--setzen');
const alt = existsSync(SCHWELLEN) ? JSON.parse(readFileSync(SCHWELLEN, 'utf8')) : {};

const stand = {};
const zeilen = [];
let gestiegen = 0;
let gesunken = 0;

for (const l of LINTER) {
  let ausgabe = '';
  try {
    ausgabe = execSync(`${l.befehl} 2>&1`, { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    // Ein Linter, der Befunde meldet, gibt 1 zurueck — das ist erwartet.
    ausgabe = `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }

  const m = l.muster.exec(ausgabe);
  if (!m) {
    // Keine Schlusszeile heisst: Das Werkzeug ist nicht gelaufen. Das ist ein
    // Ausfall, kein Ergebnis — und niemals eine Null.
    zeilen.push([l.id, '—', alt[l.id] ?? '—', 'KONNTE NICHT LAUFEN']);
    gestiegen++;
    continue;
  }

  const jetzt = Number(m[1] ?? 0);
  stand[l.id] = jetzt;
  const grenze = alt[l.id];

  if (grenze === undefined) zeilen.push([l.id, jetzt, '—', 'neu erfasst']);
  else if (jetzt > grenze) { gestiegen++; zeilen.push([l.id, jetzt, grenze, 'GESTIEGEN']); }
  else if (jetzt < grenze) { gesunken++; zeilen.push([l.id, jetzt, grenze, `${grenze - jetzt} weniger`]); }
  else zeilen.push([l.id, jetzt, grenze, 'unveraendert']);
}

console.log('\n  LINTER-SCHWELLEN');
console.log('  ' + '─'.repeat(62));
console.log(`  ${'Linter'.padEnd(16)}${'jetzt'.padStart(7)}${'erlaubt'.padStart(9)}   Stand`);
console.log('  ' + '─'.repeat(62));
for (const [id, jetzt, grenze, hinweis] of zeilen) {
  console.log(`  ${id.padEnd(16)}${String(jetzt).padStart(7)}${String(grenze).padStart(9)}   ${hinweis}`);
}
console.log('  ' + '─'.repeat(62));

if (setzen) {
  writeFileSync(SCHWELLEN, `${JSON.stringify(stand, null, 2)}\n`);
  const summe = Object.values(stand).reduce((a, b) => a + b, 0);
  console.log(`  Festgeschrieben: ${summe} Befunde in ${Object.keys(stand).length} Lintern.\n`);
  process.exit(0);
}

if (gestiegen) {
  console.log(`  ✗ ${gestiegen} Linter ueber der Schwelle.`);
  console.log('    Befund beheben — nicht die Schwelle anheben.\n');
  process.exit(1);
}
if (gesunken) {
  console.log(`  ✓ ${gesunken} Linter besser geworden.`);
  console.log('    Mit `npm run lint:schwellen -- --setzen` festschreiben.\n');
} else {
  console.log('  ✓ unveraendert\n');
}
process.exit(0);
