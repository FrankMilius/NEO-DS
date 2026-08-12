/**
 * @file
 * Stellt die Token-Abweichungen zwischen Design System und Website gegenueber
 * und sortiert sie in Entscheidungsgruppen (Phase 1 der DS-Website-Vereinigung).
 *
 *   npm run token:triage              Uebersicht auf der Konsole
 *   npm run token:triage -- --markdown > triage.md
 *
 * Die Website ist fuehrend — aber nicht blind. Deshalb drei Gruppen:
 *
 *   UEBERNEHMEN  Farben und Marken-Entscheidungen. Hier fuehrt die Website
 *                unstrittig; die Werte sind bewusst dort entstanden.
 *   PRUEFEN      Faelle, in denen die Website eine FAEHIGKEIT verloren hat —
 *                vor allem feste px, wo das DS fluide clamp() fuehrt. Das war
 *                vermutlich Nebenwirkung des Konfigurator-Exports, keine
 *                Entscheidung. Jeder Fall einzeln.
 *   DEFEKT       Werte, die technisch nicht funktionieren. Nicht uebernehmen,
 *                sondern an der Quelle beheben.
 */

import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const THEME = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe');
const markdown = process.argv.includes('--markdown');

const lies = (p) => existsSync(p) ? readFileSync(p, 'utf8') : '';

function leaf(css) {
  const s = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = {};
  for (const m of s.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim(); const d = {};
    for (const q of m[2].matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+)/g)) d[q[1]] = q[2].trim();
    if (Object.keys(d).length) out[sel] = { ...(out[sel] || {}), ...d };
  }
  return out;
}
const merge = (bl, namen) => {
  const r = {};
  for (const [sel, d] of Object.entries(bl)) {
    if (sel.split(',').some((x) => namen.has(x.trim()))) Object.assign(r, d);
  }
  return r;
};

const dsRoh = lies(resolve(wurzel, 'styles.css'));
const ovRoh = lies(resolve(THEME, 'css/neo-overrides.css'));
const ds = leaf(dsRoh);

/** Wird das Token irgendwo per var() ausgelesen? Ein Token, das niemand
 *  verbraucht, ist unabhaengig von seinem Wert bedeutungslos. */
const wirdVerbraucht = (n) => dsRoh.includes(`var(${n}`) || ovRoh.includes(`var(${n}`);

/** Kommt die zugehoerige Komponente auf der Website ueberhaupt vor?
 *  Grundlage ist der gemessene Referenzstand (71 Seiten). Beispiel: die Tokens
 *  --nc-nav-menu-* beschreiben eine Navigation, die es auf der Website nicht
 *  gibt — sie wurde mit anderen Klassennamen neu gebaut. Solche Werte aus einem
 *  alten Konfigurator-Export ins DS zu uebernehmen, waere schaedlich. */
let baselineKlassen = null;
try {
  const b = resolve(wurzel, 'data/baseline/vorher.json.gz');
  if (existsSync(b)) baselineKlassen = new Set(Object.keys(JSON.parse(gunzipSync(readFileSync(b)).toString('utf8')).komponenten || {}));
} catch (e) { /* ohne Referenzstand faellt die Pruefung weg */ }

// BEM-Trenner einebnen: .nc-hero__kicker und --nc-hero-kicker-bg beschreiben
// dasselbe Element, schreiben es aber unterschiedlich. Ohne diese Normalisierung
// galten die Hero-Dachzeilen-Tokens faelschlich als tot — ein falsches "tot"
// loescht lebende Werte, deshalb hier bewusst grosszuegig.
const flach = (s) => s.replace(/__|--/g, '-');
let baselineFlach = null;

const komponenteLebt = (n) => {
  if (!baselineKlassen || !n.startsWith('--nc-')) return true;
  baselineFlach ??= [...baselineKlassen].map(flach);
  const stamm = flach(n.replace(/^--/, ''));
  // Von hinten kuerzen: --nc-nav-menu-trigger-radius trifft nc-nav-menu,
  // sonst nc-nav. Bleibt nichts uebrig, gibt es die Komponente wirklich nicht.
  const teile = stamm.split('-');
  for (let i = teile.length; i >= 2; i--) {
    const kandidat = teile.slice(0, i).join('-');
    if (baselineFlach.some((k) => k === kandidat || k.startsWith(kandidat + '-'))) return true;
  }
  return false;
};
const th = leaf(lies(resolve(THEME, 'css/theme-overrides.css')));
const KONTEXTE = [['hell', new Set([':root', '.neo-light-theme'])], ['dunkel', new Set(['.neo-dark-theme'])]];

// ---------------------------------------------------------------------------
// Einordnung
// ---------------------------------------------------------------------------

const istFarbe = (n) => /color|accent|surface|shadow-levels/.test(n);
const istFluide = (v) => /clamp\s*\(/.test(v);
const istFestePx = (v) => /^-?[\d.]+px$/.test(v.trim());

function einordnen(name, dsWert, webWert) {
  // TOT zuerst pruefen: Wert und Absicht sind egal, wenn niemand hinsieht.
  if (!wirdVerbraucht(name)) return ['TOT', 'wird von keiner Regel ausgelesen'];
  if (!komponenteLebt(name)) return ['TOT', 'Komponente kommt im Referenzstand nicht vor'];
  // DEFEKT: T-Shirt-Name statt Wert. Ein Elevation-Token, das "xs" enthaelt,
  // ergibt kein gueltiges box-shadow — die Eigenschaft faellt lautlos aus.
  if (/elevation/.test(name) && /^(none|xs|sm|md|lg|xl|2xl)$/.test(webWert.trim())) {
    return ['DEFEKT', 'T-Shirt-Name statt Schattenwert — box-shadow faellt aus'];
  }
  // PRUEFEN: die Website hat eine fluide Skala durch einen festen Wert ersetzt.
  if (istFluide(dsWert) && istFestePx(webWert)) {
    return ['PRUEFEN', 'fluide Skala im DS, fester Wert auf der Website — Faehigkeit verloren'];
  }
  // PRUEFEN: Rahmenstaerken und Radien sind Form, nicht Marke.
  if (/border-width|radi/.test(name)) {
    return ['PRUEFEN', 'Formwert — bewusste Entscheidung oder Nebenwirkung?'];
  }
  if (istFarbe(name)) return ['UEBERNEHMEN', 'Farbe — die Website fuehrt'];
  return ['PRUEFEN', 'nicht eindeutig zuzuordnen'];
}

// ---------------------------------------------------------------------------

const gruppen = { UEBERNEHMEN: [], PRUEFEN: [], DEFEKT: [], TOT: [] };
const unbekannt = [];

for (const [kontext, S] of KONTEXTE) {
  const a = merge(ds, S), b = merge(th, S);
  for (const [k, v] of Object.entries(b)) {
    if (!(k in a)) { unbekannt.push({ kontext, name: k, wert: v }); continue; }
    if (a[k] === v) continue;
    const [g, grund] = einordnen(k, a[k], v);
    gruppen[g].push({ kontext, name: k, ds: a[k], web: v, grund });
  }
}

// Unbekannte nach Praefix buendeln — 43 Einzelzeilen sind nicht entscheidbar.
const unbekanntGruppen = {};
for (const u of unbekannt) {
  const p = u.name.replace(/^--fnd-/, '').split('-').slice(0, 2).join('-');
  (unbekanntGruppen[p] ??= []).push(u);
}

const kurz = (v, n = 26) => v.length > n ? v.slice(0, n - 1) + '…' : v;

if (markdown) {
  console.log('# Token-Triage — Phase 1\n');
  console.log('Website führend. Drei Entscheidungsgruppen.\n');
  console.log(`| Gruppe | Anzahl | Vorgehen |\n|---|---|---|`);
  console.log(`| ÜBERNEHMEN | ${gruppen.UEBERNEHMEN.length} | Website-Wert ins DS |`);
  console.log(`| PRÜFEN | ${gruppen.PRUEFEN.length} | einzeln entscheiden |`);
  console.log(`| DEFEKT | ${gruppen.DEFEKT.length} | an der Quelle beheben |`);
  console.log(`| TOT | ${gruppen.TOT.length} | ersatzlos streichen |`);
  console.log(`| DS unbekannt | ${unbekannt.length} | aufnehmen oder verwerfen |`);
  for (const [g, liste] of Object.entries(gruppen)) {
    if (!liste.length) continue;
    console.log(`\n## ${g} — ${liste.length}\n`);
    console.log('| Token | Kontext | Design System | Website |');
    console.log('|---|---|---|---|');
    for (const e of liste.sort((x, y) => x.name.localeCompare(y.name))) {
      console.log(`| \`${e.name}\` | ${e.kontext} | \`${kurz(e.ds, 40)}\` | \`${kurz(e.web, 40)}\` |`);
    }
  }
  console.log(`\n## Dem DS unbekannt — ${unbekannt.length}\n`);
  for (const [p, liste] of Object.entries(unbekanntGruppen).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`- \`--fnd-${p}-*\` — ${liste.length}: ${liste.slice(0, 4).map((u) => u.name.replace('--fnd-', '')).join(', ')}${liste.length > 4 ? ' …' : ''}`);
  }
} else {
  console.log('\nTOKEN-TRIAGE — Phase 1   (Website führend)');
  console.log('═'.repeat(78));
  for (const [g, liste] of Object.entries(gruppen)) {
    if (!liste.length) continue;
    console.log(`\n${g}  (${liste.length})`);
    console.log('─'.repeat(78));
    for (const e of liste.sort((x, y) => x.name.localeCompare(y.name))) {
      console.log(`  ${e.name.padEnd(38)} ${e.kontext.padEnd(7)} ${kurz(e.ds).padEnd(27)} → ${kurz(e.web)}`);
    }
  }
  console.log(`\nDEM DS UNBEKANNT  (${unbekannt.length})`);
  console.log('─'.repeat(78));
  for (const [p, liste] of Object.entries(unbekanntGruppen).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  --fnd-${p}-*`.padEnd(30) + `${String(liste.length).padStart(3)}  ` + liste.slice(0, 3).map((u) => u.name.replace('--fnd-', '')).join(', '));
  }
  console.log('\n' + '═'.repeat(78));
  console.log(`  ÜBERNEHMEN ${gruppen.UEBERNEHMEN.length}   PRÜFEN ${gruppen.PRUEFEN.length}   DEFEKT ${gruppen.DEFEKT.length}   TOT ${gruppen.TOT.length}   unbekannt ${unbekannt.length}`);
}
