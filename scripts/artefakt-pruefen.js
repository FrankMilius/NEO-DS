/**
 * @file
 * Prueft, ob ein gemeldeter Unterschied ein echter Befund ist oder ein
 * MESSARTEFAKT.
 *
 *   npm run artefakt -- nach-rest1 nach-rest1b
 *   npm run artefakt -- vorher nachher --betrifft nc-card,nc-button
 *
 * DER VIERTE WIDERLEGUNGSWEG, automatisiert.
 *
 * Der Anlass: `baseline:diff` meldete einmal 19 verschwundene Komponenten in
 * 19 Bauteilen. Beinahe haette ich einen fehlerfreien Stapel zurueckgenommen.
 * Die Ursache war keine Regression, sondern eine Seite, die bei der Aufnahme
 * einmal leer zurueckkam und ihre 19 Komponenten mitnahm.
 *
 * Der Unterschied ist von aussen nicht zu sehen — beides sieht im Vergleich
 * gleich aus. Er ist aber RECHENBAR, und zwar an vier Merkmalen:
 *
 *   A  SEITENAUSFALL
 *      Eine Seite mit deutlich weniger Bauteilen als der Median hat nicht
 *      geladen. Alles, was nur auf ihr vorkommt, ist verdaechtig.
 *
 *   B  EINE EINZIGE SEITE
 *      Eine Komponente, die auf zwanzig Seiten steht und nur auf einer
 *      abweicht, ist selten eine Regelaenderung — Regeln wirken ueberall.
 *
 *   C  VERSCHWUNDEN STATT GEAENDERT
 *      Eine Regel aendert Werte. Sie laesst keine Komponente verschwinden.
 *      Wer ganz fehlt, ist entweder aus dem Markup geflogen oder nicht
 *      gemessen worden.
 *
 *   D  AUSSERHALB DER AENDERUNG
 *      Wenn bekannt ist, welche Bauteile angefasst wurden: Alles ausserhalb
 *      davon braucht eine Erklaerung.
 *
 * Kein Merkmal beweist etwas allein. Zwei zusammen reichen fuer „verdaechtig",
 * und verdaechtig heisst: nachsehen, bevor zurueckgenommen wird.
 */

import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const staende = argv.filter((a) => !a.startsWith('--'));
const bIdx = argv.indexOf('--betrifft');
const betrifft = bIdx >= 0 ? new Set(argv[bIdx + 1].split(',').map((s) => s.trim().replace(/^\./, ''))) : null;

if (staende.length < 2) {
  console.error('Aufruf: npm run artefakt -- <vorher> <nachher> [--betrifft nc-a,nc-b]');
  process.exit(1);
}

function laden(name) {
  const p = resolve(wurzel, `data/baseline/${name}.json.gz`);
  if (!existsSync(p)) { console.error(`Referenzstand fehlt: ${p}`); process.exit(1); }
  return JSON.parse(gunzipSync(readFileSync(p)).toString());
}

const [vorher, nachher] = staende.map(laden);

// ---------------------------------------------------------------------------
// A — Seitenausfall
// ---------------------------------------------------------------------------

function seitenGroessen(stand) {
  const g = {};
  for (const [pfad, s] of Object.entries(stand.seiten)) {
    g[pfad] = Object.values(s).reduce((n, v) => n + (v && typeof v === 'object' ? Object.keys(v).length : 0), 0);
  }
  return g;
}

const gV = seitenGroessen(vorher);
const gN = seitenGroessen(nachher);
const werte = Object.values(gN).sort((a, b) => a - b);
const median = werte[Math.floor(werte.length / 2)] || 1;

// Eine Seite gilt als ausgefallen, wenn sie WENIGER ALS DIE HAELFTE des
// Medians traegt. Ein bewusster Umbau nimmt einer Seite nicht die Haelfte
// ihrer Bauteile; ein Ladefehler schon.
const ausgefallen = Object.entries(gN)
  .filter(([p, n]) => n < median * 0.5 && (gV[p] || 0) >= median * 0.5)
  .map(([p, n]) => ({ pfad: p, jetzt: n, vorher: gV[p] || 0 }));

// ---------------------------------------------------------------------------
// Unterschiede sammeln, mit Seitenbezug
// ---------------------------------------------------------------------------

/** Je Komponente: auf welchen Seiten kommt sie vor, wo weicht sie ab. */
function sammeln(stand) {
  const wo = new Map();
  for (const [pfad, s] of Object.entries(stand.seiten)) {
    for (const [schl, komp] of Object.entries(s)) {
      if (!komp || typeof komp !== 'object') continue;
      for (const [name, props] of Object.entries(komp)) {
        if (!wo.has(name)) wo.set(name, new Map());
        wo.get(name).set(`${pfad}|${schl}`, props);
      }
    }
  }
  return wo;
}

const wV = sammeln(vorher);
const wN = sammeln(nachher);

const befunde = [];
for (const [name, stellenV] of wV) {
  const stellenN = wN.get(name) || new Map();
  const fehlend = [];
  const geaendert = [];

  for (const [ort, propsV] of stellenV) {
    const propsN = stellenN.get(ort);
    if (!propsN) { fehlend.push(ort); continue; }
    for (const [k, v] of Object.entries(propsV)) {
      if (propsN[k] !== undefined && propsN[k] !== v) { geaendert.push(ort); break; }
    }
  }
  if (!fehlend.length && !geaendert.length) continue;

  const betroffeneSeiten = new Set([...fehlend, ...geaendert].map((o) => o.split('|')[0]));
  const alleSeiten = new Set([...stellenV.keys()].map((o) => o.split('|')[0]));

  befunde.push({
    name,
    art: fehlend.length && !geaendert.length ? 'verschwunden' : (fehlend.length ? 'gemischt' : 'geaendert'),
    seiten: betroffeneSeiten.size,
    vonSeiten: alleSeiten.size,
    nurAufAusfall: [...betroffeneSeiten].every((p) => ausgefallen.some((a) => a.pfad === p)),
    betroffeneSeiten: [...betroffeneSeiten],
  });
}

// ---------------------------------------------------------------------------
// Bewerten
// ---------------------------------------------------------------------------

for (const b of befunde) {
  const merkmale = [];
  if (b.nurAufAusfall && ausgefallen.length) merkmale.push('A Seitenausfall');
  if (b.seiten === 1 && b.vonSeiten > 3) merkmale.push('B nur eine von ' + b.vonSeiten + ' Seiten');
  if (b.art === 'verschwunden') merkmale.push('C verschwunden statt geaendert');
  if (betrifft && !betrifft.has(b.name.split('__')[0].split('--')[0])) merkmale.push('D ausserhalb der Aenderung');
  b.merkmale = merkmale;
  b.urteil = merkmale.length >= 2 ? 'VERDAECHTIG' : (merkmale.length === 1 ? 'pruefen' : 'echt');
}

// ---------------------------------------------------------------------------

console.log(`\nARTEFAKT-PRUEFUNG  ${staende[0]} → ${staende[1]}`);
console.log('─'.repeat(78));
console.log(`  Median ${median} Bauteile je Seite, ${Object.keys(gN).length} Seiten`);

if (ausgefallen.length) {
  console.log(`\n  SEITENAUSFALL — ${ausgefallen.length} Seite(n) haben nicht geladen:\n`);
  for (const a of ausgefallen) {
    console.log(`    ${a.pfad.padEnd(16)}${String(a.jetzt).padStart(5)} statt ${a.vorher} Bauteile`);
  }
  console.log('\n  Diese Seiten neu messen, BEVOR irgendetwas zurueckgenommen wird.');
} else {
  console.log('  Kein Seitenausfall.');
}

const verdaechtig = befunde.filter((b) => b.urteil === 'VERDAECHTIG');
const pruefen = befunde.filter((b) => b.urteil === 'pruefen');
const echt = befunde.filter((b) => b.urteil === 'echt');

console.log(`\n  ${befunde.length} Komponente(n) mit Unterschied:`);
console.log(`    ${verdaechtig.length} verdaechtig   ${pruefen.length} zu pruefen   ${echt.length} echt`);

if (verdaechtig.length) {
  console.log(`\n  VERDAECHTIG — zwei oder mehr Merkmale:\n`);
  for (const b of verdaechtig.slice(0, 20)) {
    console.log(`    ${b.name.padEnd(30)}${b.merkmale.join(' · ')}`);
  }
  if (verdaechtig.length > 20) console.log(`    … und ${verdaechtig.length - 20} weitere`);
}
if (pruefen.length && pruefen.length <= 20) {
  console.log(`\n  ZU PRUEFEN — ein Merkmal:\n`);
  for (const b of pruefen) console.log(`    ${b.name.padEnd(30)}${b.merkmale.join(' · ')}`);
}

console.log('\n' + '─'.repeat(78));
if (verdaechtig.length) {
  console.log('  Mindestens ein Unterschied sieht nach einem Messfehler aus.');
  console.log('  Neu messen, dann erneut vergleichen. Nichts zuruecknehmen.');
} else if (befunde.length) {
  console.log('  Kein Hinweis auf ein Artefakt. Die Unterschiede sind zu behandeln');
  console.log('  wie echte Befunde — was nicht heisst, dass sie ungewollt sind.');
} else {
  console.log('  Keine Unterschiede.');
}
console.log('');
process.exit(verdaechtig.length ? 1 : 0);
