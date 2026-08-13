/**
 * @file
 * Misst die verbliebene Drift zwischen Design System und Website.
 *
 *   npm run drift:check            Bericht
 *   npm run drift:check -- --setze-start   friert den aktuellen Stand als
 *                                          Ausgangswert ein (einmalig)
 *
 * Gedacht als selbstverstummender Reminder: solange Zahlen offen sind, meldet
 * er sie samt Fortschritt gegen den Ausgangswert. Sind alle drei bei null,
 * sagt er das und ist fertig. Eine Erinnerung, die nicht weiss, ob die Arbeit
 * getan ist, nervt entweder ewig oder hoert zu frueh auf.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const THEME = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe');
const startDatei = resolve(wurzel, 'data/drift-start.json');

const lies = (p) => existsSync(p) ? readFileSync(p, 'utf8') : '';

/** Leaf-Bloecke mit Custom Properties, nach Selektor. */
function leaf(css) {
  const s = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = {};
  for (const m of s.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    const d = {};
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

// -- 1. Token-Drift -----------------------------------------------------------
// Die Token-Flaeche des DS besteht aus ZWEI Dateien: styles.css (aus dem SCSS)
// und design-tokens.css (aus design-tokens.json). Wer nur die erste liest,
// haelt alles fuer unbekannt, was ueber die JSON-Ebene kommt — etwa die
// z-index-Skala.
const dsCss = lies(resolve(wurzel, 'styles.css')) + '\n' + lies(resolve(wurzel, 'data/design-tokens.css'));
const thCss = lies(resolve(THEME, 'css/theme-overrides.css'));
const ds = leaf(dsCss), th = leaf(thCss);
const HELL = new Set([':root', '.neo-light-theme']);
const DUNKEL = new Set(['.neo-dark-theme']);

let tokenAbweichend = 0, tokenUnbekannt = 0;
const beispiele = [];
for (const S of [HELL, DUNKEL]) {
  const a = merge(ds, S), b = merge(th, S);
  for (const [k, v] of Object.entries(b)) {
    if (!(k in a)) { tokenUnbekannt++; continue; }
    if (a[k] !== v) { tokenAbweichend++; if (beispiele.length < 5) beispiele.push(`${k}: DS ${a[k].slice(0, 18)} → ${v.slice(0, 18)}`); }
  }
}

// -- 2. Komponenten, die es nur auf der Website gibt ---------------------------
const ovCss = lies(resolve(THEME, 'css/neo-overrides.css'));
const wurzelKlassen = (css) => new Set(
  [...css.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((m) => m[1].split('__')[0].split('--')[0])
);
const imDs = wurzelKlassen(dsCss), imTheme = wurzelKlassen(ovCss);
const nurWebsite = [...imTheme].filter((k) => !imDs.has(k)).sort();

// -- 3. Komponenten, die es nicht in die Konfig-App geschafft haben -----------
// Der Sinn der Aufnahme ist nicht das Aufraeumen, sondern dass ein Kundendesign
// JEDE Komponente erreichen kann. Eine Komponente mit eigenen --nc-*-Tokens,
// die keine Gruppe in components.groups hat, ist im Konfigurator unsichtbar —
// die Tokens existieren, aber niemand kann sie setzen.
const tokenJson = JSON.parse(lies(resolve(wurzel, 'data/design-tokens.json')) || '{"components":{"groups":[]}}');
const gruppen = new Set(tokenJson.components.groups.map((g) => g.id));
const ohneGruppe = [];
for (const ebene of ['04-objects', '05-atoms', '06-molecules', '07-organisms']) {
  const dir = resolve(wurzel, 'scss/scss', ebene);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.scss') || f === '_index.scss') continue;
    const name = f.slice(1, -5);
    if (gruppen.has(name)) continue;
    const t = readFileSync(resolve(dir, f), 'utf8');
    const eigene = new Set(t.match(new RegExp(`--nc-${name}-[a-z0-9-]+`, 'g')) || []);
    if (eigene.size) ohneGruppe.push({ name, ebene, tokens: eigene.size });
  }
}
ohneGruppe.sort((a, b) => b.tokens - a.tokens);

// -- 4. Umfang der Klebeschicht ----------------------------------------------
const zeilen = ovCss ? ovCss.split('\n').length : 0;
const regeln = (ovCss.replace(/\/\*[\s\S]*?\*\//g, '').match(/\{/g) || []).length;

// -----------------------------------------------------------------------------
const jetzt = {
  tokenAbweichend, tokenUnbekannt,
  komponentenNurWebsite: nurWebsite.length,
  komponentenOhneKonfig: ohneGruppe.length,
  overridesZeilen: zeilen, overridesRegeln: regeln,
};

if (process.argv.includes('--setze-start')) {
  writeFileSync(startDatei, JSON.stringify({ datum: new Date().toISOString().slice(0, 10), ...jetzt }, null, 2) + '\n');
  console.log('Ausgangswert festgehalten:', JSON.stringify(jetzt));
  process.exit(0);
}

const start = existsSync(startDatei) ? JSON.parse(readFileSync(startDatei, 'utf8')) : null;
const fortschritt = (k) => {
  if (!start || !start[k]) return '';
  const weg = start[k] - jetzt[k];
  if (weg <= 0) return `   (Start ${start[k]})`;
  return `   ${weg} erledigt von ${start[k]}  ${Math.round(weg / start[k] * 100)}%`;
};

const offen = jetzt.tokenAbweichend + jetzt.komponentenNurWebsite + jetzt.komponentenOhneKonfig;

console.log('\nDRIFT: Design System ↔ Website' + (start ? `   (Ausgangswert vom ${start.datum})` : ''));
console.log('─'.repeat(64));
console.log(`  Abweichende Tokens          ${String(jetzt.tokenAbweichend).padStart(5)}${fortschritt('tokenAbweichend')}`);
console.log(`  Tokens dem DS unbekannt     ${String(jetzt.tokenUnbekannt).padStart(5)}${fortschritt('tokenUnbekannt')}`);
console.log(`  Komponenten nur auf Website ${String(jetzt.komponentenNurWebsite).padStart(5)}${fortschritt('komponentenNurWebsite')}`);
console.log(`  Nicht in der Konfig-App     ${String(jetzt.komponentenOhneKonfig).padStart(5)}${fortschritt('komponentenOhneKonfig')}`);
console.log(`  neo-overrides.css Zeilen    ${String(jetzt.overridesZeilen).padStart(5)}${fortschritt('overridesZeilen')}`);
console.log(`  neo-overrides.css Regeln    ${String(jetzt.overridesRegeln).padStart(5)}${fortschritt('overridesRegeln')}`);

if (offen === 0) {
  console.log('\n  Nichts mehr offen. Design System und Website laufen synchron.');
  process.exit(0);
}

console.log(`\n  NOCH OFFEN — aufräumen und umbenennen steht aus.`);
if (beispiele.length) {
  console.log('\n  Abweichende Tokens, Beispiele:');
  beispiele.forEach((z) => console.log('    ' + z));
}
if (nurWebsite.length) {
  console.log(`\n  Komponenten ohne DS-Entsprechung (${nurWebsite.length}):`);
  console.log('    ' + nurWebsite.slice(0, 12).join(', '));
  if (nurWebsite.length > 12) console.log(`    … und ${nurWebsite.length - 12} weitere`);
}
if (ohneGruppe.length) {
  console.log(`\n  Mit eigenen Tokens, aber im Konfigurator unsichtbar (${ohneGruppe.length}):`);
  ohneGruppe.slice(0, 8).forEach((k) => console.log(`    ${k.name.padEnd(22)}${k.ebene.padEnd(14)}${String(k.tokens).padStart(3)} Tokens`));
  if (ohneGruppe.length > 8) console.log(`    … und ${ohneGruppe.length - 8} weitere`);
}
console.log('\n  Einzelheiten: DRUPAL11/BACKLOG.md, Abschnitt „DS-Website-Vereinigung".');
process.exit(1);
