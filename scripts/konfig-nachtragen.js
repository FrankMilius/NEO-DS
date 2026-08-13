/**
 * @file
 * Traegt Komponenten-Tokens aus dem SCSS in die Konfig-App nach.
 *
 *   npm run konfig:nachtragen              Vorschau
 *   npm run konfig:nachtragen -- --schreiben
 *   npm run konfig:nachtragen -- gallery --schreiben
 *
 * WARUM NICHT `npm run tokens:sync -- --fix`
 * Das vorhandene Werkzeug schreibt in
 * apps/theme-configurator/src/data/tokens.generated.js. Diese Datei erzeugt
 * `npm run tokens` aus data/design-tokens.json neu — ein Nachtrag dort ist
 * beim naechsten Token-Build wieder weg. Die Quelle ist die JSON.
 *
 * WAS HIER PASSIERT
 * `_component-tokens.scss` deklariert die Tokens samt Standardwerten. Die
 * Konfig-App zeigt nur, was in design-tokens.json unter components.groups
 * steht. Alles, was im SCSS steht und dort fehlt, existiert zwar im
 * Stylesheet, ist im Konfigurator aber nicht einstellbar — fuer ein
 * Kundendesign nicht erreichbar.
 *
 * Die Gruppierung nach Bedeutung ist eine ABLEITUNG aus dem Tokennamen, kein
 * Entwurf. Eine flache Liste mit 57 Reglern (hero) waere unbenutzbar; die
 * Untergruppen hier sind eine brauchbare erste Ordnung, die man von Hand
 * verfeinern kann. Bestehende Untergruppen bleiben unangetastet — nachgetragen
 * wird nur, was fehlt.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCSS = resolve(wurzel, 'scss/scss/00-settings/_component-tokens.scss');
const JSONP = resolve(wurzel, 'data/design-tokens.json');

const argv = process.argv.slice(2);
const schreiben = argv.includes('--schreiben');
const nur = argv.find((a) => !a.startsWith('--'));

// ---------------------------------------------------------------------------
// SCSS lesen
// ---------------------------------------------------------------------------

/** Kommentare tilgen, Positionen erhalten — sonst zaehlen Beispiele in
 *  Kommentaren als Deklaration. */
const roh = readFileSync(SCSS, 'utf8');
const scss = roh.replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length))
                .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

/** Liegt die Stelle in einem .neo-dark-theme-Block? Dann ist der Wert der
 *  Dunkel-Standard, nicht der Hell-Standard. */
const dunkelBereiche = [];
for (const m of scss.matchAll(/\.neo-dark-theme[^{]*\{/g)) {
  let tiefe = 1, i = m.index + m[0].length;
  while (i < scss.length && tiefe > 0) {
    if (scss[i] === '{') tiefe++;
    else if (scss[i] === '}') tiefe--;
    i++;
  }
  dunkelBereiche.push([m.index, i]);
}
const imDunkeln = (i) => dunkelBereiche.some(([a, b]) => i >= a && i < b);

const hell = new Map(), dunkel = new Map();
for (const m of scss.matchAll(/(--nc-[a-z0-9-]+)\s*:\s*([^;{}]+);/g)) {
  const [, name, wert] = m;
  (imDunkeln(m.index) ? dunkel : hell).set(name, wert.trim());
}

// ---------------------------------------------------------------------------
// Typ und Referenz ableiten
// ---------------------------------------------------------------------------

const FARBWORT = /(^|-)(bg|background|color|colour|fg|border|shadow|glow|fill|stroke|accent|surface|overlay|scrim|tint|ring)(-|$)/;
const MASSWORT = /(^|-)(width|height|size|radius|padding|margin|gap|inset|offset|top|right|bottom|left|indent|thickness|min|max)(-|$)/;
const SCHRIFTWORT = /(^|-)(font|letter|line|tracking|leading|weight|transform|align|decoration)(-|$)/;
const BEWEGWORT = /(^|-)(duration|delay|ease|easing|timing|transition|opacity|scale|blur|rotate|translate|z|index)(-|$)/;

/** Auf welches Foundation-Token verweist der Wert? `var(--fnd-color-x)` -> "x".
 *  Der Konfigurator zeigt eine Referenz als Verweis statt als festen Wert —
 *  aendert der Kunde die Grundfarbe, wandert die Komponente mit. Das ist der
 *  ganze Sinn der Ebenen; ein aufgeloester Festwert bricht ihn. */
function referenz(wert) {
  const m = /^var\(\s*--fnd-(?:color|colour)-([a-z0-9-]+)\s*(?:,|\))/.exec(wert);
  return m ? m[1] : null;
}

function typBestimmen(name, wert) {
  const kurz = name.replace(/^--nc-[a-z0-9-]*?-/, '');
  if (/^(#|rgb|hsl|oklch|color-mix|transparent|currentColor)/i.test(wert)) return 'color';
  if (/--fnd-(color|colour)-/.test(wert)) return 'color';
  if (FARBWORT.test(kurz) && !/-width$|-radius$|-size$|-offset$/.test(kurz)) return 'color';
  if (/^--fnd-elevation|^\d+px \d+px/.test(wert) || /shadow/.test(kurz)) return 'shadow';
  if (/(^|-)(font-weight|weight)$/.test(kurz)) return 'fontWeight';
  if (/opacity/.test(kurz)) return 'opacity';
  if (/(duration|delay)/.test(kurz)) return 'duration';
  if (/--fnd-spacing-/.test(wert)) return 'spacing';
  if (/radius/.test(kurz)) return 'radius';
  if (MASSWORT.test(kurz) || /\d(px|rem|em|%|vh|vw|dvh|ch)/.test(wert)) return 'size';
  if (SCHRIFTWORT.test(kurz)) return 'size';
  if (BEWEGWORT.test(kurz)) return 'generic';
  return 'generic';
}

/** In welche Untergruppe gehoert das Token? */
function untergruppe(name) {
  const kurz = name.replace(/^--nc-[a-z0-9-]*?-/, '');
  if (BEWEGWORT.test(kurz)) return ['interaction', 'Bewegung & Zustand', 'state'];
  if (FARBWORT.test(kurz) && !/-width$|-radius$|-size$|-offset$/.test(kurz)) return ['colors', 'Farben', 'main'];
  if (SCHRIFTWORT.test(kurz)) return ['typography', 'Typografie', null];
  if (MASSWORT.test(kurz)) return ['geometry', 'Geometrie', null];
  return ['other', 'Weitere', null];
}

const ORDNUNG = ['geometry', 'typography', 'colors', 'interaction', 'other'];

const beschriften = (name, komp) => name
  .replace(new RegExp(`^--nc-${komp}-?`), '')
  .split('-').filter(Boolean)
  .map((w) => (/^(xs|sm|md|lg|xl|bg|fg)$/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
  .join(' ') || komp;

// ---------------------------------------------------------------------------
// Zuordnung Token -> Komponente
// ---------------------------------------------------------------------------

const j = JSON.parse(readFileSync(JSONP, 'utf8'));
const gruppen = j.components.groups;

// Bekannte Komponentennamen: bestehende Gruppen plus alle SCSS-Partials.
import { readdirSync, existsSync } from 'node:fs';
const namen = new Set(gruppen.map((g) => g.id));
for (const eb of ['04-objects', '05-atoms', '06-molecules', '07-organisms', '08-templates', '10-utilities']) {
  const d = resolve(wurzel, 'scss/scss', eb);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) {
    if (f.endsWith('.scss') && f !== '_index.scss') namen.add(f.slice(1, -5));
  }
}
// Laengster Treffer zuerst: sonst faengt `card` die Tokens von `card-grid-cta`.
const nachLaenge = [...namen].sort((a, b) => b.length - a.length);
const zuKomponente = (t) => nachLaenge.find((n) => t.startsWith(`--nc-${n}-`)) || null;

// ---------------------------------------------------------------------------
// Nachtragen
// ---------------------------------------------------------------------------

const proKomp = new Map();
for (const [name, wert] of hell) {
  const k = zuKomponente(name);
  if (!k || (nur && k !== nur)) continue;
  if (!proKomp.has(k)) proKomp.set(k, []);
  proKomp.get(k).push([name, wert]);
}

// Jede Token-ID darf im GANZEN Registrierungsstand nur einmal vorkommen.
// Eine Pruefung nur innerhalb der eigenen Gruppe uebersieht genau die Faelle,
// in denen eine handgepflegte Gruppe ein Token fuehrt, dessen Name auf eine
// andere Komponente zeigt.
const alleIds = new Set(gruppen.flatMap((x) => (x.tokens || []).map((t) => t.id)));

// Zulaessige Ziele einer Referenz. Der Validator prueft sie gegen diese Liste;
// ein Verweis ins Leere ist ein Fehler, kein Warnhinweis.
const semantisch = new Set((j.semantic?.groups || []).flatMap((x) => (x.tokens || []).map((t) => t.id)));

let neueGruppen = 0, neueTokens = 0;
const bericht = [];

for (const [komp, liste] of [...proKomp].sort()) {
  let g = gruppen.find((x) => x.id === komp);
  const neu = !g;
  if (neu) {
    g = {
      id: komp,
      label: komp.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
      icon: 'components',
      subgroups: [],
      tokens: [],
    };
  }
  g.subgroups ||= [];
  g.tokens ||= [];

  const bekannt = alleIds;
  const inUnter = new Set(g.subgroups.flatMap((s) => s.tokenIds || []));
  const fehlend = liste.filter(([n]) => !bekannt.has(n.slice(2)));
  if (!fehlend.length && !neu) continue;

  const eimer = new Map();
  for (const [name, wert] of fehlend) {
    const id = name.slice(2);
    const typ = typBestimmen(name, wert);
    // Nur verweisen, wenn es das Ziel gibt. `--fnd-color-surface-elevated`
    // etwa hat KEIN semantisches Gegenstueck in der Registry — daraus eine
    // Referenz zu machen erzeugt einen toten Verweis. Dann lieber den Wert.
    const roh_ = typ === 'color' ? referenz(wert) : null;
    const ref = roh_ && semantisch.has(roh_) ? roh_ : null;
    const eintrag = { id, label: beschriften(name, komp), type: typ };
    if (ref) eintrag.ref = ref;
    else eintrag.default = wert;
    if (dunkel.has(name)) eintrag.darkDefault = dunkel.get(name);
    g.tokens.push(eintrag);
    alleIds.add(id);
    neueTokens++;

    if (inUnter.has(id)) continue;
    const [uid, ulabel, kat] = untergruppe(name);
    if (!eimer.has(uid)) eimer.set(uid, { id: uid, label: ulabel, ...(kat ? { category: kat } : {}), tokenIds: [] });
    eimer.get(uid).tokenIds.push(id);
  }

  for (const uid of ORDNUNG) {
    const e = eimer.get(uid);
    if (!e || !e.tokenIds.length) continue;
    const da = g.subgroups.find((s) => s.id === uid);
    if (da) da.tokenIds = [...(da.tokenIds || []), ...e.tokenIds];
    else g.subgroups.push(e);
  }

  if (neu) { gruppen.push(g); neueGruppen++; }
  bericht.push([komp, neu, fehlend.length, g.tokens.length, g.subgroups.map((s) => s.id).join(', ')]);
}

console.log(`\n  ${'Komponente'.padEnd(24)}${'neu'.padStart(5)}${'ergaenzt'.padStart(10)}${'gesamt'.padStart(8)}   Untergruppen`);
console.log('  ' + '─'.repeat(88));
for (const [k, neu, erg, ges, ug] of bericht) {
  console.log(`  ${k.padEnd(24)}${(neu ? 'ja' : '').padStart(5)}${String(erg).padStart(10)}${String(ges).padStart(8)}   ${ug}`);
}
console.log('  ' + '─'.repeat(88));
console.log(`  ${neueGruppen} neue Gruppen, ${neueTokens} Tokens nachgetragen`);

if (schreiben) {
  writeFileSync(JSONP, JSON.stringify(j, null, 2) + '\n');
  console.log(`\n  data/design-tokens.json geschrieben.`);
  console.log(`  Danach: npm run tokens   (erzeugt tokens.generated.js neu)`);
} else {
  console.log(`\n  Vorschau. Zum Schreiben: --schreiben`);
}
