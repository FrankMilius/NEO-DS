/**
 * @file
 * Prueft jeden gemessenen Vorder-/Hintergrund-Paar eines Referenzstands gegen
 * WCAG 2.1 AA.
 *
 *   npm run kontrast -- nach-umschaltung
 *   npm run kontrast -- nach-umschaltung --alle      auch die bestandenen
 *   npm run kontrast -- nach-umschaltung --gegen vorher-stand
 *
 * WARUM DAS NOETIG IST
 * `baseline:diff` beantwortet „hat sich etwas geaendert". Bei einer gewollten
 * Umstellung aendert sich alles — die Frage wird dann sinnlos. Diese Pruefung
 * beantwortet stattdessen „ist es noch zulaessig", und das ist bei einer
 * Farbumstellung die einzige Frage, die zaehlt.
 *
 * MASSSTAB
 *   4,5:1  Fliesstext (1.4.3)
 *   3,0:1  grosser Text ab 24px, oder ab 18,66px bei Fettung 700
 *   3,0:1  Rahmen von Bedienelementen (1.4.11) — nur fuer Bauteile, deren
 *          Klassenname sie eindeutig als Bedienelement ausweist
 *
 * GRENZE DES VERFAHRENS
 * Gemessen wird die Farbe, die der Browser meldet. Liegt ein Element auf einer
 * durchscheinenden Flaeche oder auf einem Bild, ist der gemeldete Hintergrund
 * `rgba(0,0,0,0)` — solche Faelle kann diese Pruefung nicht beurteilen und
 * meldet sie getrennt als „ungeklaert". Sie sind nicht automatisch in Ordnung.
 */

import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const stand = argv.find((a) => !a.startsWith('--'));
const alle = argv.includes('--alle');
const gegen = argv[argv.indexOf('--gegen') + 1];

if (!stand) {
  console.error('Aufruf: npm run kontrast -- <referenzstand> [--alle] [--gegen <stand>]');
  process.exit(1);
}

function laden(name) {
  const p = resolve(wurzel, `data/baseline/${name}.json.gz`);
  if (!existsSync(p)) { console.error(`Referenzstand fehlt: ${p}`); process.exit(1); }
  return JSON.parse(gunzipSync(readFileSync(p)).toString());
}

/** Farbangabe des Browsers in Kanaele zerlegen. */
function kanaele(c) {
  if (!c) return null;
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (!m) return null;
  const t = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (t.length < 3 || t.some(Number.isNaN)) return null;
  return { r: t[0], g: t[1], b: t[2], a: t.length > 3 ? t[3] : 1 };
}

function leuchtdichte({ r, g, b }) {
  const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function kontrast(a, b) {
  const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Welcher Grenzwert gilt? Grosser Text darf auf 3,0 herunter. */
function grenze(props) {
  const px = parseFloat(props.fontSize) || 16;
  const gew = parseInt(props.fontWeight, 10) || 400;
  if (px >= 24 || (px >= 18.66 && gew >= 700)) return 3.0;
  return 4.5;
}

const daten = laden(stand);
const vorher = gegen ? laden(gegen) : null;

const durchgefallen = [];
const ungeklaert = new Set();
let geprueft = 0;

for (const [pfad, seite] of Object.entries(daten.seiten)) {
  for (const [schluessel, komponenten] of Object.entries(seite)) {
    if (!komponenten || typeof komponenten !== 'object') continue;
    for (const [name, props] of Object.entries(komponenten)) {
      const vg = kanaele(props.color);
      const hg = kanaele(props.backgroundColor);
      if (!vg) continue;
      // Durchsichtiger Hintergrund: der wahre Grund liegt weiter oben im Baum
      // und wurde nicht mitgemessen. Nicht beurteilbar, nicht stillschweigend
      // als bestanden verbuchen.
      if (!hg || hg.a < 0.95) { ungeklaert.add(name); continue; }
      geprueft++;
      const k = kontrast(vg, hg);
      const soll = grenze(props);
      if (k >= soll && !alle) continue;
      durchgefallen.push({
        name, schluessel, pfad,
        vg: props.color, hg: props.backgroundColor,
        k: Math.round(k * 100) / 100, soll,
        px: props.fontSize, gew: props.fontWeight,
        bestanden: k >= soll,
      });
    }
  }
}

// -- Rahmen von Bedienelementen ---------------------------------------------
// WCAG 1.4.11 verlangt 3:1 fuer den Rand, der ein Bedienelement ueberhaupt
// erkennbar macht. Die Messung weiss nicht, was ein Bedienelement IST — der
// Klassenname ist der beste verfuegbare Anhaltspunkt. Deshalb wird hier nur
// geprueft, was eindeutig eines ist; alles andere bliebe Raterei und wuerde
// die Liste mit dekorativen Raendern fluten.
const BEDIENELEMENT = /^nc-(input|textarea|select|multiselect|checkbox|radio|switch|slider|combobox|datepicker|otp|search|form-control)(__|--|$)/;

for (const seite of Object.values(daten.seiten)) {
  for (const [schluessel, komponenten] of Object.entries(seite)) {
    if (!komponenten || typeof komponenten !== 'object') continue;
    for (const [name, props] of Object.entries(komponenten)) {
      if (!BEDIENELEMENT.test(name)) continue;
      const rand = kanaele(props.borderTopColor);
      const hg = kanaele(props.backgroundColor);
      if (!rand || rand.a < 0.95) continue;
      // Ein Rahmen der Breite 0 ist keiner.
      if (parseFloat(props.borderTopWidth) === 0) continue;
      // Liegt das Feld auf durchsichtigem Grund, ist der wahre Grund unbekannt.
      if (!hg || hg.a < 0.95) { ungeklaert.add(name); continue; }
      geprueft++;
      const k = kontrast(rand, hg);
      if (k >= 3.0 && !alle) continue;
      durchgefallen.push({
        name: name + ' (Rahmen)', schluessel, pfad: '',
        vg: props.borderTopColor, hg: props.backgroundColor,
        k: Math.round(k * 100) / 100, soll: 3.0,
        px: props.fontSize, gew: props.fontWeight,
        bestanden: k >= 3.0,
      });
    }
  }
}

// Nach Bauteil zusammenfassen: dasselbe Bauteil auf 40 Seiten ist EIN Befund.
const proBauteil = new Map();
for (const f of durchgefallen) {
  const s = `${f.name}|${f.schluessel.split('|')[1]}`;
  if (!proBauteil.has(s) || proBauteil.get(s).k > f.k) proBauteil.set(s, f);
}

const echt = [...proBauteil.values()].filter((f) => !f.bestanden).sort((a, b) => a.k - b.k);

console.log(`\nKONTRASTPRUEFUNG  ${stand}`);
console.log('─'.repeat(78));
console.log(`  ${geprueft} Paare geprueft, ${ungeklaert.size} Bauteile ungeklaert (durchsichtiger Grund)`);

if (!echt.length) {
  console.log(`\n  KEIN VERSTOSS. Alle beurteilbaren Paare erfuellen AA.`);
} else {
  console.log(`\n  ${echt.length} Bauteil(e) unter dem Grenzwert:\n`);
  console.log(`  ${'Bauteil'.padEnd(34)}${'Thema'.padEnd(8)}${'Vordergrund'.padEnd(20)}${'Grund'.padEnd(20)}${'ist'.padStart(6)}${'soll'.padStart(6)}`);
  for (const f of echt) {
    const thema = f.schluessel.includes('dark') ? 'dunkel' : 'hell';
    console.log(`  ${f.name.padEnd(34)}${thema.padEnd(8)}${f.vg.padEnd(20)}${f.hg.padEnd(20)}${String(f.k).padStart(6)}${String(f.soll).padStart(6)}`);
  }
}

// Vergleich: was ist NEU durchgefallen? Ein Verstoss, den es vorher schon gab,
// ist kein Rueckschritt dieser Umstellung — aber trotzdem ein Verstoss.
if (vorher) {
  const alt = new Set();
  for (const seite of Object.values(vorher.seiten)) {
    for (const [schluessel, komponenten] of Object.entries(seite)) {
      if (!komponenten || typeof komponenten !== 'object') continue;
      for (const [name, props] of Object.entries(komponenten)) {
        const vg = kanaele(props.color), hg = kanaele(props.backgroundColor);
        if (!vg || !hg || hg.a < 0.95) continue;
        if (kontrast(vg, hg) < grenze(props)) alt.add(`${name}|${schluessel.split('|')[1]}`);
      }
    }
  }
  const neu = echt.filter((f) => !alt.has(`${f.name}|${f.schluessel.split('|')[1]}`));
  const weg = [...alt].filter((s) => !proBauteil.has(s) || proBauteil.get(s).bestanden);
  console.log(`\n  Gegen ${gegen}:  ${neu.length} neu durchgefallen, ${weg.length} behoben`);
  if (neu.length) neu.forEach((f) => console.log(`    NEU  ${f.name}  ${f.k}`));
}

console.log('');
process.exit(echt.length ? 1 : 0);
