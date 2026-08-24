/**
 * Prueft jede Klasse in data/markup/ gegen das kompilierte Stylesheet.
 *
 *   node scripts/pruefe-klassen.mjs
 *   node scripts/pruefe-klassen.mjs --setzen    Restbestand festschreiben
 *
 * WARUM DAS DIE ENTSCHEIDENDE PRUEFUNG IST
 * Markup, das nach Bauteil aussieht, ist leicht zu schreiben. Ob es das Bauteil
 * TRIFFT, entscheidet allein, ob die Klassen im Stylesheet vorkommen. Eine
 * Klasse, die es dort nicht gibt, gestaltet nichts — sie sieht in der Story nur
 * so aus, als tue sie es. Genau so sind die veralteten Doku-Seiten entstanden
 * und jahrelang unbemerkt geblieben: niemand hat je gegengeprueft.
 *
 * WAS EIN BEFUND IST UND WAS NICHT
 * Zustandsklassen (`is-…`, `has-…`) und Drupal-Eigenes (`js-…`, `path-…`)
 * gehoeren nicht ins Design System und werden uebergangen. Geprueft wird, was
 * mit dem Bauteil-Praefix beginnt: `nc-`, `fnd-`, `o-`, `u-`.
 *
 * WARUM EINE SCHWELLE UND KEIN HARTES NEIN
 * Beim Aufsetzen am 24.08.2026 waren Befunde vorhanden. Ein Test, der ab dem
 * ersten Tag rot steht, wird abgeschaltet — deshalb friert die Schwelle den
 * Bestand ein und laesst ihn nur sinken. Neue unbekannte Klassen fallen sofort
 * auf, alte duerfen der Reihe nach verschwinden.
 *
 * WARUM JE BAUTEIL UND NICHT EINE GESAMTZAHL
 * Zuerst stand hier eine einzige Zahl. Als der Bestand von 42 auf 101 Dateien
 * wuchs, war sie wertlos: 70 gegen 55 sagt nicht, ob etwas schlechter wurde
 * oder nur mehr geworden ist. Schlimmer, eine Gesamtzahl verrechnet — ein neu
 * behobener Befund haette Raum fuer einen neuen geschaffen, ohne dass es
 * auffaellt. Die Schwelle steht darum je Bauteil. Ein neues Bauteil bringt
 * seinen eigenen Eintrag mit und kann kein anderes decken.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { klassenLesen, klassenImMarkup } from './klassen-im-stylesheet.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MARKUP = resolve(ROOT, 'data/markup');
const SCHWELLE = resolve(ROOT, 'data/klassen-hoechstens.json');

const bekannt = klassenLesen();

const setzen = process.argv.includes('--setzen');
const funde = [];
let geprueft = 0;

for (const datei of readdirSync(MARKUP).filter((f) => f.endsWith('.html')).sort()) {
  const html = readFileSync(resolve(MARKUP, datei), 'utf8');
  const unbekannt = new Set();
  for (const k of klassenImMarkup(html)) {
    geprueft++;
    if (!bekannt.has(k)) unbekannt.add(k);
  }

  if (unbekannt.size) {
    funde.push({ bauteil: datei.replace(/\.html$/, ''), klassen: [...unbekannt].sort() });
  }
}

const anzahl = funde.reduce((s, f) => s + f.klassen.length, 0);

console.log('\n  KLASSEN GEGEN STYLES.CSS');
console.log('  ' + '─'.repeat(72));
console.log(`  ${bekannt.size} Klassen im Stylesheet, ${geprueft} Vorkommen im Markup geprueft.\n`);

if (!funde.length) {
  console.log('  Keine unbekannte Klasse. Jedes Markup trifft das Bauteil.\n');
} else {
  for (const f of funde) {
    console.log(`  ${f.bauteil}`);
    for (const k of f.klassen) console.log(`      .${k}`);
  }
  console.log('');
}

// ─── Schwelle je Bauteil ─────────────────────────────────────────────
const grenzen = existsSync(SCHWELLE) ? JSON.parse(readFileSync(SCHWELLE, 'utf8')) : {};

if (setzen) {
  const neu = {};
  for (const f of funde) neu[f.bauteil] = f.klassen.length;
  writeFileSync(SCHWELLE, `${JSON.stringify(neu, null, 2)}\n`);
  console.log(`  Schwelle festgeschrieben: ${funde.length} Bauteile, ${anzahl} Klassen.\n`);
  process.exit(0);
}

const schlechter = [];
const besser = [];
for (const f of funde) {
  const grenze = grenzen[f.bauteil] ?? 0;
  if (f.klassen.length > grenze) schlechter.push(`${f.bauteil}: ${f.klassen.length} statt ${grenze}`);
  else if (f.klassen.length < grenze) besser.push(f.bauteil);
}
// Ein Bauteil, das gar nicht mehr auffaellt, ist ebenfalls eine Verbesserung.
for (const [bauteil, grenze] of Object.entries(grenzen)) {
  if (grenze > 0 && !funde.some((f) => f.bauteil === bauteil)) besser.push(bauteil);
}

console.log('  ' + '─'.repeat(72));
if (schlechter.length) {
  console.log(`  ✗ ${schlechter.length} Bauteil(e) mit mehr unbekannten Klassen als erlaubt:`);
  for (const z of schlechter) console.log(`      ${z}`);
  console.log('    Entweder die Klasse im Markup korrigieren oder das Bauteil im');
  console.log('    Stylesheet ergaenzen. Nicht die Schwelle anheben.\n');
  process.exit(1);
}
console.log(`  ✓ kein Bauteil ueber seiner Schwelle (${anzahl} Klassen in ${funde.length} Bauteilen).`);
if (besser.length) {
  console.log(`    Besser geworden: ${[...new Set(besser)].join(', ')}`);
  console.log('    Mit `node scripts/pruefe-klassen.mjs --setzen` festschreiben.');
}
console.log('');
process.exit(0);
