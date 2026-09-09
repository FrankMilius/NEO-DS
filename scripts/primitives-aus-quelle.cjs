#!/usr/bin/env node
// ==========================================================================
// Primitives der Konfig-App aus der SCSS-Quelle erzeugen
// ==========================================================================
//   node scripts/primitives-aus-quelle.cjs            zeigen, was sich aendert
//   node scripts/primitives-aus-quelle.cjs --schreiben
//
// WARUM
// Bis zum 24.08.2026 wurde `primitives` in data/design-tokens.json von Hand
// gepflegt — parallel zu den SCSS-Quellen, aus denen das Stylesheet entsteht.
// Zwei Listen fuer dieselbe Frage driften, und sie hatten es getan:
//
//   im Stylesheet, nicht in der Registry:  coral, dark-orange, mustard,
//                                          old-gold, pearl-white, sage,
//                                          warm-taupe
//   in der Registry, nicht im Stylesheet:  graphit, neutral_blau,
//                                          neutral_beige, neutral_salbei, lime
//                                          (dort heissen sie --fnd-neutral-*
//                                          bzw. --fnd-accent-*)
//
// Sieben Paletten waren im Konfigurator unerreichbar, fuenf zeigten dort auf
// Tokens, die es unter dem Namen nicht gibt. Beides faellt weg, wenn nur noch
// eine Stelle die Wahrheit sagt.
//
// WOHER DIE ANGABEN KOMMEN
//   Gruppierung  aus den Abschnittsueberschriften in _color-primitives.scss
//                und aus _neutral-ramps.scss
//   Werte        aus dem KOMPILIERTEN styles.css
//
// Die Werte aus dem Kompilat zu nehmen ist kein Umweg. Die Shade-Skalen
// entstehen erst zur Bauzeit (`fn.generate-shade-scale`), in der SCSS-Datei
// steht nur die Basisfarbe. Das Kompilat ist das, was ausgeliefert wird —
// und damit die einzige Stelle, an der alle elf Stufen wirklich stehen.
// ==========================================================================

const fs = require('fs');
const path = require('path');

const WURZEL = path.resolve(__dirname, '..');
const CSS = path.join(WURZEL, 'styles.css');
const PRIMITIVES = path.join(WURZEL, 'scss/scss/00-settings/_color-primitives.scss');
const RAMPEN = path.join(WURZEL, 'scss/scss/00-settings/_neutral-ramps.scss');
const REGISTRY = path.join(WURZEL, 'data/design-tokens.json');

const schreiben = process.argv.includes('--schreiben');

// ─── Gruppierung aus der SCSS-Quelle ──────────────────────────────────
const scss = fs.readFileSync(PRIMITIVES, 'utf8');

function abschnitt(von, bis) {
  const a = scss.indexOf(von);
  if (a < 0) return new Set();
  // Die Endmarke MUSS hinter der Startmarke gesucht werden. "Foundation
  // Colors" steht auch im Kopfkommentar der Datei, also vor "Main Palettes" —
  // ein Ausschnitt von 2005 bis 351 ist leer, und `brand` blieb im ersten
  // Anlauf ohne eine einzige Palette.
  const b = bis ? scss.indexOf(bis, a) : scss.length;
  const teil = scss.slice(a, b > a ? b : scss.length);
  // Jede Zuweisung im Abschnitt zaehlt, nicht nur `fn.generate-shade-scale(…)`.
  //
  // Am 24.08.2026 bekamen $primary und $secondary eine if()-Verzweigung
  // (Kundenfarbe oder Graphitleiter). Damit passte das alte Muster nicht mehr,
  // und beide rutschten aus `brand` nach `system` — die Marke bestand
  // anschliessend nur noch aus dem Akzent. Ein Muster, das auf die
  // Schreibweise der rechten Seite baut, bricht beim ersten Umbau.
  return new Set([...teil.matchAll(/^\$([a-z][\w-]*)\s*:/gm)]
    .map((m) => m[1])
    .filter((n) => !n.startsWith('_')));
}

const HAUPT = abschnitt('Main Palettes', 'Foundation Colors');
const UNTER = abschnitt('Supporting Palettes', 'CSS Custom Properties Output');

// Die Neutralleitern stehen als fertige Maps in _neutral-ramps.scss.
const rampen = fs.readFileSync(RAMPEN, 'utf8');
const LEITERN = {};
for (const m of rampen.matchAll(/^\$([a-z][\w-]*):\s*\(([^)]*)\)/gm)) {
  const stufen = {};
  for (const s of m[2].matchAll(/(\d+):\s*(#[0-9a-fA-F]{3,8})/g)) stufen[s[1]] = s[2];
  if (Object.keys(stufen).length) LEITERN[m[1]] = stufen;
}

// ─── Werte aus dem Kompilat ───────────────────────────────────────────
const css = fs.readFileSync(CSS, 'utf8');
const ausCss = {};
for (const m of css.matchAll(/--fnd-primitive-([a-z0-9-]+?)-(\d{2,3})\s*:\s*([^;]+)/g)) {
  (ausCss[m[1]] ??= {})[m[2]] = m[3].trim();
}

/** rgb(204, 210.4, 218.6) → #ccd2db. Die Registry zeigt Farbfelder; ein
 *  Hexwert ist dort lesbar, eine Sass-Rundung mit Nachkommastellen nicht. */
function alsHex(wert) {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(wert);
  if (!m) return wert;
  const z = (x) => Math.round(parseFloat(x)).toString(16).padStart(2, '0');
  return `#${z(m[1])}${z(m[2])}${z(m[3])}`;
}

// Die Beschriftung ist eine Aussage, keine Verzierung. Sie stand bis zum
// 24.08.2026 auf "Neo Darkblue" fuer eine Palette, die inzwischen Graphit
// zeigte — im Konfigurator las man den alten Namen ueber dem neuen Farbfeld.
const BESCHRIFTUNG = {
  primary: 'Graphit (Primary)',
  secondary: 'Graphit (Secondary, vorerst gleich Primary)',
  accent: 'Neo Lime',
  graphit: 'Graphit', blau: 'Blaustichig', beige: 'Beige', salbei: 'Salbei',
  ivory: 'Ivory', 'warm-taupe': 'Warm Taupe', 'pearl-white': 'Pearl White',
  mint: 'Mint', forest: 'Forest', lime: 'Lime',
  'neo-darkblue': 'Neo Darkblue — Reserve fuer das Backend-Theme',
  'neo-blue': 'Neo Blue — Reserve fuer das Backend-Theme',
};
const schoen = (n) => BESCHRIFTUNG[n] ?? n.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

function palette(name, stufen) {
  const s = {};
  for (const k of Object.keys(stufen).sort((a, b) => a - b)) s[k] = alsHex(stufen[k]);
  return { label: schoen(name), base: s['500'] ?? Object.values(s)[Math.floor(Object.keys(s).length / 2)], shades: s };
}

// ─── Aufbauen ─────────────────────────────────────────────────────────
const neu = { brand: {}, supporting: {}, system: {}, neutralleitern: {} };

for (const [name, stufen] of Object.entries(ausCss)) {
  if (name === 'black' || name === 'white') continue;
  // Die Leitern stehen seit dem 09.09.2026 auch als --fnd-primitive-* im
  // Kompilat; ihre Quelle bleibt _neutral-ramps.scss, nicht das CSS.
  if (LEITERN[name]) continue;
  const ziel = HAUPT.has(name) ? 'brand' : UNTER.has(name) ? 'supporting' : 'system';
  neu[ziel][name] = palette(name, stufen);
}
for (const [name, stufen] of Object.entries(LEITERN)) {
  neu.neutralleitern[name] = palette(name, stufen);
}

// ─── Vergleichen ──────────────────────────────────────────────────────
const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const alt = registry.primitives ?? {};
// Nur Palettennamen vergleichen, keine Stufennummern. Die alte Registry
// mischt beide Ebenen: manche Gruppen enthalten Paletten, andere direkt die
// Stufen (graphit: {50: …, 100: …}). Ohne diese Unterscheidung meldete der
// erste Lauf "0, 100, 200 …" als weggefallene Paletten.
const altNamen = new Set();
for (const [gname, g] of Object.entries(alt)) {
  if (!g || typeof g !== 'object') continue;
  const schluessel = Object.keys(g);
  const nurZahlen = schluessel.every((k) => /^\d+$/.test(k));
  if (nurZahlen) altNamen.add(gname.replace(/_/g, '-'));
  else for (const n of schluessel) altNamen.add(n.replace(/_/g, '-'));
}
// Das Ergebnis zusammensetzen — und ERST DANN vergleichen. Der erste Anlauf
// verglich gegen einen Vollersatz und meldete sechs Verluste, die es nach der
// Zusammenfuehrung gar nicht gibt. Ein Bericht, der etwas anderes misst als
// das, was geschrieben wird, ist schlimmer als keiner.
const EIGENE = ['brand', 'supporting', 'system', 'neutralleitern'];
const ERSETZT = ['graphit', 'neutral_blau', 'neutral_beige', 'neutral_salbei', 'lime', 'neutral'];

const ergebnis = { ...alt };
for (const g of EIGENE) ergebnis[g] = neu[g];
for (const g of ERSETZT) delete ergebnis[g];

const namenVon = (obj) => {
  const raus = new Set();
  for (const [gname, g] of Object.entries(obj)) {
    if (!g || typeof g !== 'object') continue;
    const k = Object.keys(g);
    if (k.length && k.every((x) => /^\d+$/.test(x))) raus.add(gname.replace(/_/g, '-'));
    else for (const n of k) raus.add(n.replace(/_/g, '-'));
  }
  return raus;
};
const neuNamen = namenVon(ergebnis);

const dazu = [...neuNamen].filter((n) => !altNamen.has(n)).sort();
const weg = [...altNamen].filter((n) => !neuNamen.has(n)).sort();

console.log('\n  PRIMITIVES AUS DER QUELLE');
console.log('  ' + '─'.repeat(72));
for (const [g, inhalt] of Object.entries(neu)) {
  console.log(`  ${g.padEnd(16)} ${String(Object.keys(inhalt).length).padStart(2)} Paletten  ${Object.keys(inhalt).sort().join(', ')}`);
}
console.log('  ' + '─'.repeat(72));
if (dazu.length) console.log(`  neu erreichbar (${dazu.length}): ${dazu.join(', ')}`);
if (weg.length) console.log(`  faellt weg (${weg.length}): ${weg.join(', ')}`);
if (!dazu.length && !weg.length) console.log('  unveraendert.');

if (!schreiben) {
  console.log('\n  Nichts geschrieben. Mit --schreiben uebernehmen.\n');
  process.exit(0);
}

// NICHT ersetzen, sondern die vier abgeleiteten Gruppen einsetzen und alles
// Uebrige stehen lassen.
//
// Der erste Anlauf hat `primitives` ganz ersetzt und dabei sechs Eintraege
// verloren: black und white (Gruppe `foundation`, mit eigener
// Transparenz-Skala), danger-light und danger-dark (Rollen fuer Text auf
// farbigem Grund) sowie zwei Altnamen. Nichts davon ist aus den Paletten
// ableitbar — es sind eigene Angaben, und ein Generator darf nur ersetzen,
// was er auch erzeugen kann.
registry.primitives = ergebnis;
fs.writeFileSync(REGISTRY, `${JSON.stringify(registry, null, 2)}\n`);
console.log('\n  data/design-tokens.json aktualisiert.\n');
