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
 * SKALEN-ANBINDUNG
 * Ein harter px-Wert wird an die Foundation-Skala gebunden, wenn der Abstand
 * unter 2px liegt; sonst behaelt er seinen Wert und wird mit „eigener Wert"
 * markiert. So bleibt die Komponente auf der Skala, wo es passt, ohne dass
 * sich ihr Aussehen verschiebt.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OV = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/neo-overrides.css');
const DS = resolve(wurzel, 'styles.css');
const THEME_TOKENS = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/theme-overrides.css');

const argv = process.argv.slice(2);
const ziel = (argv.find((a) => !a.startsWith('--')) || '').replace(/^\.?/, '');
const schreiben = argv.includes('--schreiben');
if (!ziel) { console.error('Aufruf: npm run aufnehmen -- <nc-komponente> [--schreiben]'); process.exit(1); }

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
  if (!existsSync(ablage)) require('node:fs').mkdirSync(ablage, { recursive: true });
  writeFileSync(resolve(ablage, `${name}.json`), JSON.stringify({
    komponente: ziel, tokens: Object.fromEntries(tokens), scss, eintrag,
  }, null, 2));
  console.log(`\n  Entwurf gesichert: data/aufnahme/${name}.json`);
}

// ---------------------------------------------------------------------------
// Anwenden
// ---------------------------------------------------------------------------
// Schreibt in vier Dateien. Jeder Abschnitt bekommt Marker, damit ein zweiter
// Lauf ersetzt statt anhaengt — und damit von Hand erkennbar bleibt, was aus
// der Aufnahme stammt.

function abschnitt(datei, marke, inhalt) {
  const auf = `/* >>> aufgenommen: ${marke} */`;
  const zu  = `/* <<< aufgenommen: ${marke} */`;
  let t = existsSync(datei) ? readFileSync(datei, 'utf8') : '';
  const block = `${auf}\n${inhalt}\n${zu}`;
  const i = t.indexOf(auf), j = t.indexOf(zu);
  if (i >= 0 && j > i) t = t.slice(0, i) + block + t.slice(j + zu.length);
  else t = t.replace(/\s*$/, '') + `\n\n${block}\n`;
  writeFileSync(datei, t);
}

if (argv.includes('--anwenden')) {
  const ebene = argv.includes('--atom') ? '05-atoms'
    : argv.includes('--molekuel') ? '06-molecules' : '07-organisms';

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
  if (kopf) writeFileSync(scssDatei, kopf);
  abschnitt(scssDatei, name, scssText);

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

  // 2. Tokens
  if (tokens.size) {
    const tText = [`:root {`, `  // ── ${name} (aufgenommen) ──`,
      ...[...tokens].map(([n, t]) => `  ${n}: ${t.skala || t.wert};${t.skala ? '' : '  // eigener Wert'}`),
      `}`].join('\n');
    const tokenDatei = resolve(wurzel, 'scss/scss/00-settings/_component-tokens-aufgenommen.scss');
    abschnitt(tokenDatei, name, tText);
    // Selbst einbinden — sonst wird die Datei gebaut, aber nie geladen.
    const idx = resolve(wurzel, 'scss/scss/00-settings/_index.scss');
    let it = readFileSync(idx, 'utf8');
    if (!it.includes('component-tokens-aufgenommen')) {
      it = it.replace(`@forward 'component-tokens';`,
        `@forward 'component-tokens';\n// Aus dem Drupal-Theme aufgenommene Komponenten-Tokens.\n// Bewusst SPAETER: sie duerfen bestehende Werte ueberschreiben, nicht umgekehrt.\n@forward 'component-tokens-aufgenommen';`);
      writeFileSync(idx, it);
    }
  }

  // 3. Konfigurator
  const jsonDatei = resolve(wurzel, 'data/design-tokens.json');
  const j = JSON.parse(readFileSync(jsonDatei, 'utf8'));
  const gruppen = j.components.groups;
  const vorhanden = gruppen.findIndex((g) => g.id === name);
  if (tokens.size) {
    if (vorhanden >= 0) gruppen[vorhanden] = { ...gruppen[vorhanden], ...eintrag };
    else gruppen.push(eintrag);
    writeFileSync(jsonDatei, JSON.stringify(j, null, 2) + '\n');
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
