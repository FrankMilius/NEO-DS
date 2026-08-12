/**
 * @file
 * Zeigt alle Regeln einer Komponente aus neo-overrides.css und schlaegt fuer
 * jede vor, wohin sie gehoert.
 *
 *   npm run phase2 -- nc-section-header
 *   npm run phase2 -- --liste          alle Komponenten mit Regelzahl
 *
 * Hintergrund: neo-overrides.css laedt ZULETZT und gewinnt bei gleicher
 * Spezifitaet. Regeln von dort ins Design System zu verschieben, nimmt ihnen
 * diesen Vorteil — sie koennen dann gegen andere DS-Regeln unterliegen. Diese
 * Uebersicht ist der erste Schritt: erst entscheiden, was ueberhaupt gehen
 * soll, dann verschieben, dann mit baseline:diff gegenmessen.
 *
 * Die Einordnung ist ein VORSCHLAG, keine Entscheidung. Sie erkennt:
 *   DRUPAL     Selektor haengt an Drupal-Markup (Layout Builder, Felder,
 *              Blockklassen). Solche Regeln bleiben in der Klebeschicht.
 *   FREMD      Regel steht unter dieser Komponente, betrifft aber eine
 *              andere — gehoert dorthin, nicht ins DS.
 *   DS         alles Uebrige: Kandidat fuer die Rueckfuehrung.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OV = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/neo-overrides.css');
const DS = resolve(wurzel, 'styles.css');

if (!existsSync(OV)) { console.error('neo-overrides.css nicht gefunden'); process.exit(1); }
const ov = readFileSync(OV, 'utf8');
const ds = readFileSync(DS, 'utf8');

/** Kommentare durch Leerzeichen ersetzen — Positionen bleiben erhalten. */
const ohneKommentar = ov.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));

/** Alle Regelbloecke mit Zeilennummer, Selektor und Rumpf. */
function bloecke() {
  const raus = [];
  for (const m of ohneKommentar.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    raus.push({
      zeile: ohneKommentar.slice(0, m.index).split('\n').length,
      sel,
      rumpf: m[2].trim(),
      // Der Kommentar direkt darueber traegt meist die Begruendung.
      notiz: (ov.slice(0, m.index).match(/\/\*[\s\S]*?\*\/\s*$/) || [''])[0].replace(/\s+/g, ' ').slice(0, 150),
    });
  }
  return raus;
}

const stamm = (k) => k.split('__')[0].split('--')[0];
const komponenten = (sel) => new Set([...sel.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((m) => stamm(m[1])));

// Drupal-eigenes Markup: hier haengt die Regel an der Plattform, nicht am Design.
const DRUPAL = /\.layout-builder|\.block-|\.contextual|\.node--|\.field--|\.path-|\.user-logged|\.toolbar|\.js-|\[data-drupal|\.region-|\.views-/;

function einordnen(b, ziel) {
  if (DRUPAL.test(b.sel)) return ['DRUPAL', 'haengt an Drupal-Markup'];
  const k = komponenten(b.sel);
  if (k.size && !k.has(ziel)) return ['FREMD', `betrifft ${[...k].join(', ')}`];
  if (k.size > 1) return ['FREMD', `betrifft mehrere: ${[...k].join(', ')}`];
  return ['DS', 'Kandidat fuer die Rueckfuehrung'];
}

// ---------------------------------------------------------------------------

const arg = process.argv[2];

if (!arg || arg === '--liste') {
  const dsK = new Set([...ds.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((m) => stamm(m[1])));
  const zahl = {};
  for (const b of bloecke()) {
    for (const k of komponenten(b.sel)) if (dsK.has(k)) zahl[k] = (zahl[k] || 0) + 1;
  }
  const sortiert = Object.entries(zahl).sort((a, b) => b[1] - a[1]);
  console.log(`\n  ${sortiert.length} Komponenten mit Regeln in neo-overrides.css, die es auch im DS gibt\n`);
  console.log(`  ${'Komponente'.padEnd(30)}${'Regeln'.padStart(7)}`);
  for (const [k, n] of sortiert) console.log(`  ${k.padEnd(30)}${String(n).padStart(7)}`);
  console.log(`\n  Summe: ${sortiert.reduce((s, [, n]) => s + n, 0)} Regelbloecke`);
  console.log(`\n  Einzeln ansehen:  npm run phase2 -- <komponente>`);
  process.exit(0);
}

const ziel = arg.startsWith('nc-') ? arg : `nc-${arg}`;
const treffer = bloecke().filter((b) => komponenten(b.sel).has(ziel));

if (!treffer.length) { console.log(`\n  Keine Regeln fuer .${ziel} in neo-overrides.css`); process.exit(0); }

const gruppen = { DS: [], FREMD: [], DRUPAL: [] };
for (const b of treffer) {
  const [g, grund] = einordnen(b, ziel);
  gruppen[g].push({ ...b, grund });
}

console.log(`\n  .${ziel} — ${treffer.length} Regelbloecke in neo-overrides.css`);
console.log(`  ${'─'.repeat(74)}`);
for (const [g, liste] of Object.entries(gruppen)) {
  if (!liste.length) continue;
  const kopf = { DS: 'KANDIDATEN FUER DAS DESIGN SYSTEM', FREMD: 'GEHOEREN ZU EINER ANDEREN KOMPONENTE', DRUPAL: 'BLEIBEN IN DER KLEBESCHICHT' }[g];
  console.log(`\n  ${kopf}  (${liste.length})\n`);
  for (const b of liste) {
    console.log(`    Zeile ${String(b.zeile).padEnd(5)} ${b.sel}`);
    if (b.notiz) console.log(`      Notiz: ${b.notiz}`);
    for (const d of b.rumpf.split(';').map((x) => x.trim()).filter(Boolean).slice(0, 8)) {
      console.log(`        ${d};`);
    }
    if (g !== 'DS') console.log(`      -> ${b.grund}`);
    console.log('');
  }
}
console.log(`  ${'─'.repeat(74)}`);
console.log(`  DS ${gruppen.DS.length}   FREMD ${gruppen.FREMD.length}   DRUPAL ${gruppen.DRUPAL.length}`);
