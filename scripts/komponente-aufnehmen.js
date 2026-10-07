/**
 * @file
 * Erzeugt aus einer Komponente in neo-overrides.css einen ENTWURF fuer die
 * Aufnahme ins Design System.
 *
 *   npm run aufnehmen -- nc-card-cta
 *   npm run aufnehmen -- nc-card-cta --schreiben
 *
 * Ausgabe (ohne --schreiben nur auf der Konsole):
 *   1. SCSS-Partial fuer scss/scss/0X-…/_<name>.scss
 *   2. Token-Block fuer scss/scss/00-settings/_component-tokens.scss
 *   3. Eintrag fuer components.groups in data/design-tokens.json
 *      (damit die Komponente in der Konfigurator-App erscheint)
 *
 * WARUM TOKENISIEREN, NICHT NUR KOPIEREN
 * 65 % der Deklarationen in neo-overrides.css sind harte Werte (16px, #e7e4dc).
 * Eine so uebernommene Komponente waere im DS zwar vorhanden, aber nicht
 * themebar — fuer ein Kundendesign wertlos. Erst Tokens machen sie brauchbar.
 *
 * WAS WIRD TOKENISIERT
 * Alles, was ein Kunde aendern koennen soll: Farben, Radien, Abstaende,
 * Schriftgroessen, Rahmen, Schatten. NICHT die Layout-Mechanik (display, flex,
 * position, object-fit) — die traegt keine Gestaltungsentscheidung.
 *
 * OHNE MARKUP KEINE AUFNAHME
 * Der letzte Schritt — die Regeln aus neo-overrides.css entfernen — laeuft
 * erst, wenn data/markup/<name>.html existiert. Vorher bricht das Skript ab
 * und sagt, wie das Markup zu holen ist.
 *
 * Der Grund steht in der Geschichte dieses Repos: Am 21.08.2026 trugen alle
 * 131 Stories Markup, das aus Klassennamen abgeleitet war — es sah nach
 * Bauteil aus und war keines. Vier Phasen Arbeit haben das aufgeholt. Ohne
 * Sperre faellt es beim naechsten Bauteil wieder auf, und niemand merkt es,
 * weil eine Story mit Platzhalter genauso aussieht wie eine fertige.
 *
 * Damit die Ernte ueberhaupt greifen kann, legt dieses Skript zuvor das
 * Recipe an: sie sucht den Wurzelselektor, den nur das Recipe kennt.
 *
 * WEITERER LAUF ERGAENZT, ERSETZT NICHT (seit 07.10.2026)
 *
 *   npm run aufnehmen -- nc-hero-tom                       Trockenlauf: zeigt, was ergaenzt wuerde
 *   npm run aufnehmen -- nc-hero-tom --anwenden            ergaenzt die Abschnitte
 *   npm run aufnehmen -- nc-hero-tom --anwenden --ersetzen ersetzt sie (nur bewusst!)
 *
 * SCSS-Partial und Token-Datei tragen je Komponente einen Abschnitt zwischen
 * `>>> aufgenommen: <name>` und `<<< aufgenommen: <name>`. Bis 07.10.2026
 * ersetzte ein weiterer Lauf diesen Abschnitt. Da der erste Lauf die Regeln im
 * Theme bereits entfernt, findet ein weiterer nur noch NACHZUEGLER (Regeln,
 * die erst eine geaenderte Zuordnung erfasst oder die spaeter ins Theme kamen)
 * — und loeschte alles Uebrige. So fehlte hero-tom vom 12.08. (8b04d29c) bis
 * 06.10.2026 die Grundgestaltung.
 *
 * Jetzt (scripts/aufnahme-abschnitt.mjs):
 * - neue Regeln/Tokens werden an den Abschnitt angehaengt;
 * - gleicher Selektor im selben @-Kontext mit gleichem Inhalt wird nicht
 *   gedoppelt (auch nicht gegenueber Regeln ausserhalb der Marker);
 * - gleicher Selektor mit anderem Inhalt ist ein KONFLIKT: Abbruch, bevor
 *   irgendeine Datei geschrieben ist;
 * - Schutzpruefung: fehlt nach dem Zusammenfuehren ein Selektor/Token, der
 *   vorher im Abschnitt stand, wird nichts geschrieben;
 * - der Konfigurator-Eintrag behaelt seine Untergruppen, neue tokenIds kommen
 *   in die Untergruppe „alle“;
 * - die Ebene einer schon aufgenommenen Komponente gilt weiter, auch ohne
 *   --molekuel/--atom.
 * `--ersetzen` stellt das alte Verhalten fuer genau diesen Lauf wieder her und
 * listet, was dabei entfaellt.
 *
 * SKALEN-ANBINDUNG
 * Ein harter px-Wert wird an die Foundation-Skala gebunden, wenn der Abstand
 * unter 2px liegt; sonst behaelt er seinen Wert und wird mit „eigener Wert"
 * markiert. So bleibt die Komponente auf der Skala, wo es passt, ohne dass
 * sich ihr Aussehen verschiebt.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abschnittPlanen, planMelden } from './aufnahme-abschnitt.mjs';

const argv = process.argv.slice(2);
// --wurzel=<pfad> nur fuer Tests: dort liegen styles.css, scss/, data/ und
// daneben ../DRUPAL11/… als Attrappe. Ohne Angabe gilt das Repo selbst.
const wurzelArg = argv.find((a) => a.startsWith('--wurzel='));
const wurzel = wurzelArg
  ? resolve(wurzelArg.slice('--wurzel='.length))
  : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OV = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/neo-overrides.css');
const DS = resolve(wurzel, 'styles.css');
const THEME_TOKENS = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/theme-overrides.css');

const ziel = (argv.find((a) => !a.startsWith('--')) || '').replace(/^\.?/, '');
const schreiben = argv.includes('--schreiben');
if (!ziel) { console.error('Aufruf: npm run aufnehmen -- <nc-komponente> [--schreiben] [--anwenden [--atom|--molekuel] [--ersetzen]]'); process.exit(1); }

const ov = readFileSync(OV, 'utf8');
const ds = readFileSync(DS, 'utf8');

// ---------------------------------------------------------------------------
// Skalen aus dem DS
// ---------------------------------------------------------------------------

function skala(praefix) {
  const r = [];
  for (const m of ds.matchAll(new RegExp(`(--fnd-${praefix}-[a-z0-9-]+)\\s*:\\s*([^;]+)`, 'g'))) {
    const v = m[2].trim();
    if (/^[\d.]+px$/.test(v)) r.push([m[1], parseFloat(v)]);
  }
  return r;
}
const SKALEN = { spacing: skala('spacing'), radius: skala('radius'), 'border-width': skala('border-width') };

/** Wert -> vorhandenes Token, fuer exakte Treffer. Ein Logo-Grau, das zufaellig
 *  --fnd-color-text-primary entspricht, soll dieses Token benutzen statt einen
 *  zweiten Ort zu schaffen, an dem dieselbe Farbe gepflegt wird. */
function wertTabelle(muster) {
  const t = new Map();
  // Auch die Theme-Werte lesen: die Website fuehrt, und --fnd-color-text-primary
  // ist dort #0f1419, im DS #000000. Ohne das bliebe die Farbe ein Einzelwert.
  const quelle = ds + '\n' + (existsSync(THEME_TOKENS) ? readFileSync(THEME_TOKENS, 'utf8') : '');
  for (const m of quelle.matchAll(new RegExp(`(${muster})\\s*:\\s*([^;]+)`, 'g'))) {
    const v = m[2].trim().toLowerCase();
    if (!v.includes('var(') && !t.has(v)) t.set(v, m[1]);
  }
  return t;
}
const FARBEN = wertTabelle('--fnd-color-[a-z0-9-]+');
const GEWICHTE = wertTabelle('--fnd-font-weight-[a-z0-9-]+');

/** #0f1419 und #0F1419 sind dieselbe Farbe. */
const normFarbe = (v) => v.trim().toLowerCase().replace(/\s+/g, '');

/** Wert in px, egal ob px oder rem angegeben. rem-Werte kamen sonst nie an
 *  die Skala — 0.25rem sind 4px und damit exakt --fnd-spacing-01. */
function inPx(wert) {
  const w = wert.trim();
  let m = /^(-?[\d.]+)px$/.exec(w);
  if (m) return parseFloat(m[1]);
  m = /^(-?[\d.]+)rem$/.exec(w);
  if (m) return parseFloat(m[1]) * 16;
  return null;
}

/** Naechstliegendes Skalen-Token, wenn der Abstand unter 2px liegt. */
function anSkala(wert, art) {
  const w = wert.trim();
  // Pill-Radien: 50%, 999px, 9999px meinen dasselbe wie radius-full.
  if (art === 'radius' && /^(50%|9{3,}px)$/.test(w)) return { name: '--fnd-radius-full', v: 9999, d: 0 };
  const z = inPx(w);
  if (z === null) return null;
  let best = null;
  for (const [name, v] of SKALEN[art] || []) {
    if (v > 900) continue; // radius-full u. Ae. nicht als Naeherung anbieten
    const d = Math.abs(v - z);
    if (!best || d < best.d) best = { name, v, d };
  }
  return best && best.d < 2 ? best : null;
}

// ---------------------------------------------------------------------------
// Regeln der Komponente einsammeln
// ---------------------------------------------------------------------------

const ohneKommentar = ov.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
const stamm = (k) => k.split('__')[0].split('--')[0];

/** Zu welcher @-Regel gehoert die Stelle i?
 *
 *  ENTSCHEIDEND: Die naive Suche nach `selektor { … }` findet auch die Regeln
 *  INNERHALB von @media, weil deren Rumpf selbst keine Klammern enthaelt. Ohne
 *  Kontext landen Mobilregeln unbedingt im Design System — beim Footer stand
 *  .nc-footer__columns danach dreimal mit verschiedenen Spalten da, und die
 *  Seite lief bei 390px 58px ueber den Viewport hinaus. */
function atKontext(i) {
  const stapel = [];
  const re = /@[a-z-]+[^{]*\{|\{|\}/g;
  let m;
  while ((m = re.exec(ohneKommentar)) && m.index < i) {
    if (m[0].startsWith('@')) stapel.push({ text: m[0].slice(0, -1).trim(), tiefe: 1 });
    else if (m[0] === '{') { if (stapel.length) stapel[stapel.length - 1].tiefe++; }
    else if (stapel.length) { if (--stapel[stapel.length - 1].tiefe === 0) stapel.pop(); }
  }
  return stapel.map((x) => x.text);
}

const regeln = [];
for (const m of ohneKommentar.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim().replace(/^.*\}/s, '').trim();
  if (!sel || sel.startsWith('@')) continue;
  // Eine Regel gehoert der Komponente, die im Selektor ZUERST steht — dem
  // aeusseren Kontext. `.nc-testimonial-grid .nc-testimonial { … }` ist eine
  // Regel des Grids ueber seine Kinder, nicht des Testimonials.
  //
  // Die fruehere Bedingung (genau eine Komponente im Selektor) liess solche
  // Regeln liegen: allein zwischen testimonial-grid und testimonial sind das
  // 16 Stueck, die als Waisen im Theme zurueckgeblieben waeren.
  const alleK = [...sel.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((x) => stamm(x[1]));
  if (!alleK.length || alleK[0] !== ziel) continue;
  const dekl = [...m[2].matchAll(/([a-z-]+)\s*:\s*([^;]+)/g)].map((d) => [d[1].trim(), d[2].trim()]);
  if (dekl.length) regeln.push({ sel, dekl, at: atKontext(m.index) });
}

if (!regeln.length) { console.log(`\n  Keine Regeln fuer .${ziel} gefunden.`); process.exit(0); }

// ---------------------------------------------------------------------------
// Tokenisieren
// ---------------------------------------------------------------------------

// Gestaltungstragende Eigenschaften -> Token. Mechanik bleibt literal.
const THEMEBAR = {
  color: 'color', 'background-color': 'color', background: 'color',
  'border-color': 'color', 'border-top-color': 'color', 'border-bottom-color': 'color',
  fill: 'color', stroke: 'color',
  'border-radius': 'radius', 'border-width': 'border-width',
  padding: 'spacing', 'padding-top': 'spacing', 'padding-right': 'spacing',
  'padding-bottom': 'spacing', 'padding-left': 'spacing',
  'padding-block': 'spacing', 'padding-inline': 'spacing',
  margin: 'spacing', 'margin-top': 'spacing', 'margin-bottom': 'spacing',
  'margin-block': 'spacing', 'margin-inline': 'spacing', gap: 'spacing',
  'font-size': 'size', 'font-weight': 'weight', 'line-height': 'size',
  'letter-spacing': 'size', 'box-shadow': 'shadow', opacity: 'opacity',
};

// Nur der ERSTE Selektor einer Gruppe zaehlt fuer den Tokennamen. Sonst
// entstehen Namen wie --nc-footer-column-h3-column-block-h2-letter-spacing.
const kurz = (sel) => {
  const roh = sel.split(',')[0]
    .replace(new RegExp(`\\.${ziel}`, 'g'), '')
    .replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  // Wiederholungen zusammenziehen: aus `context-item-context-item-before`
  // wird `context-item-before`. Entsteht bei Geschwister-Selektoren wie
  // `.x__item + .x__item::before`.
  const teile = roh.split('-').filter(Boolean);
  const raus = [];
  for (const t of teile) if (raus[raus.length - 1] !== t && !raus.includes(t)) raus.push(t);
  return raus.join('-') || 'root';
};

const tokens = new Map();   // name -> {wert, quelle, skala}
const scss = [];

for (const r of regeln) {
  const zeilen = [];
  for (const [prop, wert] of r.dekl) {
    const art = THEMEBAR[prop];
    // Triviale Werte tragen keine Gestaltungsentscheidung — ein Token dafuer
    // waere nur Ballast in der Konfigurator-Oberflaeche.
    const trivial = /^(0|0px|none|auto|inherit|initial|unset)$/.test(wert.trim());
    if (!art || trivial || wert.includes('var(')) { zeilen.push(`  ${prop}: ${wert};`); continue; }

    const teil = kurz(r.sel);
    // Nur INNERE Mehrfach-Bindestriche kuerzen, nicht das fuehrende `--`.
    const name = '--' + `nc-${ziel.replace(/^nc-/, '')}-${teil ? teil + '-' : ''}${prop}`.replace(/-+/g, '-');
    // Bekannte Sonderfaelle direkt auf vorhandene Tokens ziehen, statt einen
    // neuen Wert zu erfinden.
    const BEKANNT = {
      '0.06em': '--nc-mono-tracking-code',
      '0.12em': '--nc-mono-tracking-caps',
    };
    let treffer = null;
    if (BEKANNT[wert.trim()]) treffer = { name: BEKANNT[wert.trim()], d: 0 };
    else if (art === 'color' && FARBEN.has(normFarbe(wert))) treffer = { name: FARBEN.get(normFarbe(wert)), d: 0 };
    else if (art === 'weight' && GEWICHTE.has(wert.trim())) treffer = { name: GEWICHTE.get(wert.trim()), d: 0 };
    else if (['spacing', 'radius', 'border-width'].includes(art)) treffer = anSkala(wert, art);
    tokens.set(name, { wert, skala: treffer ? `var(${treffer.name})` : null, art, prop });
    zeilen.push(`  ${prop}: var(${name});`);
  }
  scss.push({ sel: r.sel, zeilen, at: r.at });   // at MITGEBEN — sonst geht der @media-Kontext hier verloren
}

// ---------------------------------------------------------------------------
// Ausgabe
// ---------------------------------------------------------------------------

const name = ziel.replace(/^nc-/, '');
const anSkalaZahl = [...tokens.values()].filter((t) => t.skala).length;

console.log(`\n  AUFNAHME: .${ziel}`);
console.log(`  ${'─'.repeat(72)}`);
console.log(`  ${regeln.length} Regeln, ${regeln.reduce((s, r) => s + r.dekl.length, 0)} Deklarationen`);
console.log(`  ${tokens.size} Tokens vorgeschlagen, davon ${anSkalaZahl} an die Foundation-Skala gebunden`);

console.log(`\n  1. TOKEN-BLOCK  ->  scss/scss/00-settings/_component-tokens.scss\n`);
console.log(`  // ── ${name} ${'─'.repeat(Math.max(2, 56 - name.length))}`);
for (const [n, t] of tokens) {
  const wert = t.skala || t.wert;
  const notiz = t.skala ? '' : '   // eigener Wert, nicht auf der Skala';
  console.log(`  ${n}: ${wert};${notiz}`);
}

console.log(`\n  2. SCSS-PARTIAL  ->  scss/scss/07-organisms/_${name}.scss\n`);
for (const b of scss) {
  const praefix = (b.at || []).length ? '  ' + b.at.join(' / ') + '\n' : '';
  if (praefix) console.log(praefix.trimEnd());
  console.log(`  ${b.sel} {`);
  b.zeilen.forEach((z) => console.log(`  ${z}`));
  console.log('  }\n');
}

const eintrag = {
  id: name,
  label: name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
  icon: 'components',
  subgroups: [{ id: 'alle', label: 'Alle Tokens', tokenIds: [...tokens.keys()].map((k) => k.replace(/^--/, '')) }],
};
console.log(`  3. KONFIG-APP  ->  data/design-tokens.json, components.groups\n`);
console.log('  ' + JSON.stringify(eintrag, null, 2).split('\n').join('\n  '));

if (schreiben) {
  const ablage = resolve(wurzel, 'data/aufnahme');
  if (!existsSync(ablage)) mkdirSync(ablage, { recursive: true });
  writeFileSync(resolve(ablage, `${name}.json`), JSON.stringify({
    komponente: ziel, tokens: Object.fromEntries(tokens), scss, eintrag,
  }, null, 2));
  console.log(`\n  Entwurf gesichert: data/aufnahme/${name}.json`);
}

// ---------------------------------------------------------------------------
// Abschnitte planen — im Trockenlauf UND vor dem Anwenden
// ---------------------------------------------------------------------------
// SCSS und Tokens stehen in markierten Abschnitten
//   /* >>> aufgenommen: <name> */ … /* <<< aufgenommen: <name> */
// Ein weiterer Lauf ERGAENZT sie (scripts/aufnahme-abschnitt.mjs): neue
// Regeln/Tokens werden angehaengt, gleiche nicht gedoppelt, abweichende als
// Konflikt gemeldet. Erst wenn der Plan fuer ALLE Dateien sauber ist, wird
// geschrieben — ein Konflikt bricht ab, bevor irgendeine Datei angefasst ist.
//
// Frueher ersetzte ein zweiter Lauf den Abschnitt. Weil der erste Lauf die
// Regeln im Theme schon entfernt hat, fand der zweite nur die Nachzuegler und
// loeschte alles Uebrige (hero-tom, 12.08.2026, 8b04d29c).

const anwenden = argv.includes('--anwenden');
const ersetzen = argv.includes('--ersetzen');
const vermerk = `// ergaenzt am ${new Date().toISOString().slice(0, 10)} (weiterer Aufnahme-Lauf)`;

// Ebene: ausdruecklich (--atom/--molekuel) oder dort, wo die Komponente schon
// aufgenommen ist. Sonst legte ein weiterer Lauf ohne --molekuel eine zweite
// Datei in 07-organisms an.
const EBENEN = ['05-atoms', '06-molecules', '07-organisms'];
const ebeneArg = argv.includes('--atom') ? '05-atoms' : argv.includes('--molekuel') ? '06-molecules' : null;
const bestehendeEbenen = EBENEN.filter((e) => {
  const d = resolve(wurzel, `scss/scss/${e}/_${name}.scss`);
  return existsSync(d) && readFileSync(d, 'utf8').includes(`/* >>> aufgenommen: ${name} */`);
});
if (ebeneArg && bestehendeEbenen.length && !bestehendeEbenen.includes(ebeneArg)) {
  console.error(`\n  ABBRUCH — ${name} ist bereits in ${bestehendeEbenen.join(', ')} aufgenommen, nicht in ${ebeneArg}.`);
  console.error('  Ebene weglassen (dann gilt die bestehende) oder die Datei zuerst von Hand umziehen.\n');
  process.exit(1);
}
const ebene = ebeneArg || bestehendeEbenen[0] || '07-organisms';

// 1. SCSS
const scssText = scss.map((b) => {
  const kern = `${b.sel} {\n${b.zeilen.join('\n')}\n}`;
  // Den @-Kontext wieder darumlegen, sonst gilt eine Mobilregel ueberall.
  return (b.at || []).reduceRight((inner, at) =>
    `${at} {\n${inner.split('\n').map((z) => '  ' + z).join('\n')}\n}`, kern);
}).join('\n\n');
const scssDatei = resolve(wurzel, `scss/scss/${ebene}/_${name}.scss`);
const kopf = existsSync(scssDatei) ? '' :
  `// ==========================================================================\n` +
  `// ${ebene.split('-')[1]}: ${name}\n` +
  `// ==========================================================================\n` +
  `// Aus dem Drupal-Theme aufgenommen (neo-overrides.css). Die Website war\n` +
  `// fuehrend; harte Werte wurden tokenisiert, wo sie eine Gestaltungs-\n` +
  `// entscheidung tragen.\n` +
  `// ==========================================================================\n\n@use '../01-tools' as *;\n`;

/** Plant einen Abschnitt; ein unlesbarer Abschnitt ist selbst ein Abbruchgrund. */
function planen(datei, opts) {
  try {
    return abschnittPlanen({ marke: name, ersetzen, vermerk, ...opts });
  } catch (e) {
    console.error(`\n  ABBRUCH — ${datei}: ${e.message}. Nichts geschrieben.\n`);
    process.exit(1);
  }
}

const plaene = [];
plaene.push({
  datei: scssDatei,
  plan: planen(scssDatei, { text: existsSync(scssDatei) ? readFileSync(scssDatei, 'utf8') : kopf, neu: scssText, modus: 'regeln' }),
});

// 2. Tokens
const tokenDatei = resolve(wurzel, 'scss/scss/00-settings/_component-tokens-aufgenommen.scss');
if (tokens.size) {
  const tText = [`:root {`, `  // ── ${name} (aufgenommen) ──`,
    ...[...tokens].map(([n, t]) => `  ${n}: ${t.skala || t.wert};${t.skala ? '' : '  // eigener Wert'}`),
    `}`].join('\n');
  plaene.push({
    datei: tokenDatei,
    plan: planen(tokenDatei, { text: existsSync(tokenDatei) ? readFileSync(tokenDatei, 'utf8') : null, neu: tText, modus: 'deklarationen' }),
  });
}

// 3. Konfigurator — gleiche Regel: vorhandene Untergruppen und tokenIds
// bleiben, fehlende tokenIds kommen in die Untergruppe „alle“. Frueher
// ueberschrieb der Lauf `subgroups` komplett (shell, 12.08.2026: vier von
// Hand gepflegte Untergruppen verschwanden).
const jsonDatei = resolve(wurzel, 'data/design-tokens.json');
const konfigJson = JSON.parse(readFileSync(jsonDatei, 'utf8'));
const gruppen = konfigJson.components.groups;
const vorhanden = gruppen.findIndex((g) => g.id === name);
const neueIds = eintrag.subgroups[0].tokenIds;
let konfigNeu = [];
if (tokens.size) {
  if (vorhanden < 0) { gruppen.push(eintrag); konfigNeu = neueIds; }
  else if (ersetzen) { gruppen[vorhanden] = { ...gruppen[vorhanden], ...eintrag }; konfigNeu = neueIds; }
  else {
    const g = gruppen[vorhanden];
    g.subgroups = g.subgroups || [];
    const bekannt = new Set(g.subgroups.flatMap((s) => s.tokenIds || []));
    konfigNeu = neueIds.filter((id) => !bekannt.has(id));
    if (konfigNeu.length) {
      let alle = g.subgroups.find((s) => s.id === 'alle');
      if (!alle) { alle = { id: 'alle', label: 'Alle Tokens', tokenIds: [] }; g.subgroups.unshift(alle); }
      alle.tokenIds = [...(alle.tokenIds || []), ...konfigNeu];
    }
  }
}

console.log(`\n  ${anwenden ? 'PLAN' : 'TROCKENLAUF — mit --anwenden wuerde'}${ersetzen ? ' (--ersetzen)' : ''}:`);
for (const { datei, plan } of plaene) {
  const rel = datei.slice(wurzel.length + 1);
  const art = plan.neuAngelegt ? 'neuer Abschnitt' : ersetzen ? 'Abschnitt ERSETZT' : 'Abschnitt ergaenzt';
  console.log(`    ${rel}: ${art} — ${plan.ergaenzt.length} neu, ${plan.vorhanden.length} schon vorhanden${plan.konflikte.length ? `, ${plan.konflikte.length} Konflikt(e)` : ''}`);
  for (const s of plan.ergaenzt) console.log(`      + ${s}`);
  if (ersetzen) for (const s of plan.verloren) console.log(`      - ${s}   (entfaellt durch --ersetzen)`);
}
if (tokens.size) console.log(`    data/design-tokens.json: ${vorhanden < 0 ? 'Eintrag neu' : ersetzen ? 'Eintrag ERSETZT' : 'Eintrag ergaenzt'} — ${konfigNeu.length} tokenIds neu`);

const probleme = plaene.filter(({ plan }) => plan.konflikte.length || (!ersetzen && plan.verloren.length) || plan.warnungen.length);
const blockiert = plaene.some(({ plan }) => plan.konflikte.length || (!ersetzen && plan.verloren.length));
if (probleme.length) {
  console.log('');
  for (const { datei, plan } of probleme) console.log(planMelden(datei.slice(wurzel.length + 1), name, plan));
}
if (blockiert) {
  console.log(`\n  ${anwenden ? 'ABBRUCH — nichts geschrieben.' : 'Mit --anwenden wuerde das Skript hier ABBRECHEN.'}`);
  console.log('  Eine Regel/ein Token steht schon da, aber mit anderem Inhalt. Still');
  console.log('  ueberschreiben waere genau der Fehler vom 12.08.2026. Entweder den');
  console.log('  Unterschied von Hand klaeren oder ausdruecklich `--ersetzen` angeben');
  console.log('  (ersetzt die Abschnitte dieser Komponente vollstaendig).\n');
  if (anwenden) process.exit(1);
}

// ---------------------------------------------------------------------------
// Anwenden
// ---------------------------------------------------------------------------
// Schreibt in vier Dateien. Die Marker zeigen, was aus der Aufnahme stammt.

if (anwenden) {
  for (const { datei, plan } of plaene) {
    if (plan.geaendert) {
      mkdirSync(dirname(datei), { recursive: true });
      writeFileSync(datei, plan.text);
    }
  }

  // Partial in das _index.scss der Ebene eintragen. Ohne das wird die Datei
  // geschrieben, aber nie kompiliert — die Komponente waere im DS unsichtbar,
  // und im Theme sind ihre Regeln zu dem Zeitpunkt schon entfernt.
  const ebenenIndex = resolve(wurzel, `scss/scss/${ebene}/_index.scss`);
  if (existsSync(ebenenIndex)) {
    let ix = readFileSync(ebenenIndex, 'utf8');
    if (!new RegExp(`['"]${name}['"]`).test(ix)) {
      ix = ix.replace(/\s*$/, '') + `\n@forward '${name}';   // aufgenommen aus dem Drupal-Theme\n`;
      writeFileSync(ebenenIndex, ix);
    }
  }

  // Token-Datei selbst einbinden — sonst wird sie gebaut, aber nie geladen.
  if (tokens.size) {
    const idx = resolve(wurzel, 'scss/scss/00-settings/_index.scss');
    let it = readFileSync(idx, 'utf8');
    if (!it.includes('component-tokens-aufgenommen')) {
      it = it.replace(`@forward 'component-tokens';`,
        `@forward 'component-tokens';\n// Aus dem Drupal-Theme aufgenommene Komponenten-Tokens.\n// Bewusst SPAETER: sie duerfen bestehende Werte ueberschreiben, nicht umgekehrt.\n@forward 'component-tokens-aufgenommen';`);
      writeFileSync(idx, it);
    }
    writeFileSync(jsonDatei, JSON.stringify(konfigJson, null, 2) + '\n');
  }

  // 3b. Recipe anlegen
  //
  // Die Markup-Ernte sucht Bauteile ueber `anatomy.root.element` — ohne
  // Recipe kann sie das neue Bauteil gar nicht finden. Der Entwurf traegt die
  // Wurzel und die BEM-Bereiche, die in den uebernommenen Regeln vorkommen;
  // alles Weitere gehoert von Hand nachgezogen.
  const rezeptDatei = resolve(wurzel, `data/${name}-recipe.json`);
  if (!existsSync(rezeptDatei)) {
    const bereiche = [...new Set(
      scss.flatMap((b) => [...b.sel.matchAll(/\.(nc-[a-z0-9-]+__[a-z0-9-]+)/g)].map((m) => m[1])),
    )].sort();

    writeFileSync(rezeptDatei, `${JSON.stringify({
      meta: {
        schemaVersion: '3.1.0',
        // Muss dem Dateinamen entsprechen — der Story-Generator sucht die
        // Markup-Datei ueber diesen Namen. Weicht er ab, bleibt das Bauteil
        // ohne Markup, obwohl die Datei danebenliegt (siehe chapter-nav,
        // 24.08.2026).
        component: name,
        version: '1.0.0',
        status: 'draft',
        tags: ['aufgenommen'],
      },
      anatomy: {
        root: { element: `.${ziel}` },
        slots: bereiche.map((b) => ({ name: b.split('__')[1], element: `.${b}`, optional: true })),
        domNotes: [
          `Entwurf, erzeugt beim Aufnehmen aus neo-overrides.css am ${new Date().toISOString().slice(0, 10)}.`,
          'Die Bereiche stammen aus den uebernommenen Regeln. Was Pflicht ist und was nicht, steht noch nicht fest — `optional: true` ist die vorsichtige Annahme, nicht die geprueft richtige.',
        ],
      },
      styling: { baseClasses: [ziel], tokenGroups: {} },
    }, null, 2)}\n`);
    console.log(`    Recipe    data/${name}-recipe.json (Entwurf, ${bereiche.length} Bereiche)`);
  }

  // 3c. Ohne Markup kein letzter Schritt
  //
  // Erst hier, nicht am Anfang: Das Recipe muss stehen, sonst findet die Ernte
  // das Bauteil nicht. Und erst vor dem EINZIGEN unumkehrbaren Schritt — bis
  // hierher ist alles ergaenzend, das Entfernen der Overrides nicht.
  const markupDatei = resolve(wurzel, `data/markup/${name}.html`);
  if (!existsSync(markupDatei)) {
    console.log(`\n  ABBRUCH — noch kein Bauteil-Markup fuer "${name}".`);
    console.log('  SCSS, Tokens, Konfigurator-Eintrag und Recipe stehen. Die Regeln in');
    console.log('  neo-overrides.css bleiben, bis das Bauteil in Storybook nachweisbar ist.\n');
    console.log('  So geht es weiter:');
    console.log(`      npm run ernte:markup -- ${name}          von der laufenden Website`);
    console.log(`      npm run ernte:markup -- --quelle=doku ${name}   ersatzweise aus der Doku`);
    console.log('      # findet die Ernte nichts, von Hand anlegen — siehe data/markup/LIESMICH.md');
    console.log(`\n  Danach denselben Befehl erneut aufrufen.\n`);
    process.exit(1);
  }

  // 4. Overrides entfernen
  const ovDatei = OV;
  let o = readFileSync(ovDatei, 'utf8');
  const ohneK = o.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
  const weg = [];
  for (const m of ohneK.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    const kk = [...sel.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((x) => stamm(x[1]));
    if (kk.length && kk[0] === ziel) weg.push([m.index, m.index + m[0].length]);
  }
  for (const [a, b] of weg.reverse()) o = o.slice(0, a) + o.slice(b);
  o = `/* .${ziel}: ${weg.length} Regeln am ${new Date().toISOString().slice(0, 10)} ins Design System\n` +
      `   aufgenommen (${ebene}). Tokens: ${tokens.size}. */\n` + o;
  // Leere @media-Huellen entfernen: nach dem Herausnehmen der Regeln bleiben
  // sonst `@media (max-width: 480px) { }` stehen — Ballast, der bei jeder
  // weiteren Komponente waechst.
  let vorher;
  do { vorher = o; o = o.replace(/@[a-z-]+[^{}]*\{\s*\}/g, ''); } while (o !== vorher);
  writeFileSync(ovDatei, o.replace(/\n{4,}/g, '\n\n\n'));

  console.log(`\n  ANGEWENDET`);
  console.log(`    SCSS      scss/scss/${ebene}/_${name}.scss`);
  if (tokens.size) console.log(`    Tokens    _component-tokens-aufgenommen.scss (${tokens.size})`);
  if (tokens.size) console.log(`    Konfig    components.groups ${vorhanden >= 0 ? 'aktualisiert' : 'ergaenzt'}`);
  console.log(`    Overrides ${weg.length} Regeln entfernt`);
}
