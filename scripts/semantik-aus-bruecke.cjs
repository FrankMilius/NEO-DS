#!/usr/bin/env node
/**
 * Semantik aus der Bruecke — haelt data/design-tokens.json deckungsgleich
 * mit scss/scss/00-settings/_mono-bridge.scss.
 *
 * WARUM
 * Seit der Umstellung auf Graphit (Mono-Bruecke) zeigt die Website auf die
 * Leitern, die JSON trug aber noch die Hex-Werte der alten blauen Marke
 * (interactive-default #009fe3). Konfig-App, Drupal-Export und PowerPoint
 * lasen deshalb eine Marke, die es nicht mehr gibt (Token-Audit F3).
 *
 * WAS ES TUT
 *   semantic.references[thema][rolle]  Verweis wie in der Bruecke:
 *                                      "{neutral.950}", "{accent.500}",
 *                                      "{system.success.500}", "{color.paper}",
 *                                      "#ffffff" oder ein color-mix()-Ausdruck
 *   semantic.defaults[thema][rolle]    daraus aufgeloeste Werte (Papier Graphit)
 *                                      — fuer Verbraucher, die Hex brauchen
 *
 * Die Bruecke bleibt vorerst fuehrend (Entscheidung 29.09.2026). Spaeter
 * kehrt sich die Richtung um: die SCSS wird aus den Verweisen erzeugt.
 *
 * AUFRUF
 *   node scripts/semantik-aus-bruecke.cjs              Bericht, schreibt nichts
 *   node scripts/semantik-aus-bruecke.cjs --schreiben  JSON (+ App-Werkseinstellung) aktualisieren
 *   node scripts/semantik-aus-bruecke.cjs --pruefen    Exit 1 bei Abweichung (fuer npm test / CI)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BRUECKE = path.join(ROOT, 'scss/scss/00-settings/_mono-bridge.scss');
const JSON_PFAD = path.join(ROOT, 'data/design-tokens.json');
const WERK_PFAD = path.join(ROOT, 'data/neo-theme-defaults/neo-theme-defaults.json');

const modus = process.argv.includes('--schreiben') ? 'schreiben'
  : process.argv.includes('--pruefen') ? 'pruefen' : 'bericht';

const scss = fs.readFileSync(BRUECKE, 'utf8');
const tokens = JSON.parse(fs.readFileSync(JSON_PFAD, 'utf8'));

/** Rumpf eines Blocks ab `kopf` bis zur schliessenden Klammer in Spalte 0. */
const block = (kopf) => {
  const start = scss.indexOf(kopf);
  if (start < 0) throw new Error(`Block nicht gefunden: ${kopf}`);
  const ende = scss.indexOf('\n}', start);
  return scss.slice(start + kopf.length, ende);
};

/** --fnd-color-*-Deklarationen eines Rumpfs als { rolle: ausdruck }. */
const deklarationen = (rumpf) => {
  const out = {};
  for (const zeile of rumpf.split('\n')) {
    const ohneKommentar = zeile.replace(/\/\/.*$/, '');
    const m = ohneKommentar.match(/--fnd-color-([a-z0-9-]+)\s*:\s*([^;]+);/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
};

/** Bruecken-Ausdruck -> Verweis im JSON. */
const alsVerweis = (ausdruck) => {
  let m;
  if ((m = ausdruck.match(/^var\(--fnd-neutral-(\d+)\)$/))) return `{neutral.${m[1]}}`;
  if ((m = ausdruck.match(/^var\(--fnd-accent-(\d+)\)$/))) return `{accent.${m[1]}}`;
  if ((m = ausdruck.match(/^var\(--fnd-primitive-(success|warning|danger|info)-(\d+)\)$/))) return `{system.${m[1]}.${m[2]}}`;
  if ((m = ausdruck.match(/^var\(--fnd-color-([a-z0-9-]+)\)$/))) return `{color.${m[1]}}`;
  if (/^#[0-9a-f]{3,8}$/i.test(ausdruck)) return ausdruck.toLowerCase();
  return ausdruck; // color-mix() u. a. bleiben als CSS-Ausdruck stehen
};

const P = tokens.primitives;
const leiter = {
  neutral: P.neutralleitern.graphit.shades,  // Papier Graphit = Standard
  accent: P.neutralleitern.lime.shades,      // r.$lime in _neutral-ramps.scss
};

/** Verweis -> Hex (bzw. #rrggbbaa bei color-mix mit transparent). */
const aufloesen = (verweis, thema, tiefe = 0) => {
  if (tiefe > 8) return null;
  let m;
  if (/^#/.test(verweis)) return verweis;
  if ((m = verweis.match(/^\{(neutral|accent)\.(\d+)\}$/))) return leiter[m[1]][m[2]] || null;
  if ((m = verweis.match(/^\{system\.(\w+)\.(\d+)\}$/))) return P.system?.[m[1]]?.shades?.[m[2]] || null;
  if ((m = verweis.match(/^\{color\.([a-z0-9-]+)\}$/))) {
    const ziel = thema[m[1]];
    return ziel ? aufloesen(ziel, thema, tiefe + 1) : null;
  }
  if ((m = verweis.match(/^color-mix\(in srgb,\s*(?:var\(--fnd-(neutral|accent)-(\d+)\)|(#[0-9a-f]{6}))\s+(\d+)%,\s*transparent\)$/i))) {
    const hex = m[3] ? m[3].toLowerCase() : leiter[m[1]][m[2]];
    m[3] = m[4];
    const alpha = Math.round(Number(m[3]) / 100 * 255).toString(16).padStart(2, '0');
    return hex ? hex + alpha : null;
  }
  return null;
};

// Themen zusammensetzen ------------------------------------------------------
const hell = deklarationen(block('@mixin bruecke-hell {'));
const dunkel = deklarationen(block('@mixin bruecke-dunkel {'));
const kundeHell = { ...hell, ...deklarationen(block('.customer-light-theme {')) };

const themenAusdruecke = {
  'neo-light': hell,
  'neo-dark': dunkel,
  'customer-light': kundeHell,
  // Annahme: Die Bruecke hat (noch) keinen eigenen Block fuer customer-dark.
  // Das Kundenthema dunkel folgt deshalb der dunklen Bruecke (Token-Audit, offen).
  'customer-dark': dunkel,
};

const referenzen = {};
const defaults = {};
const bericht = { ungeloest: [], nurImJson: {} };

for (const [thema, ausdruecke] of Object.entries(themenAusdruecke)) {
  const refs = {};
  for (const [rolle, ausdruck] of Object.entries(ausdruecke)) refs[rolle] = alsVerweis(ausdruck);
  referenzen[thema] = refs;

  const werte = {};
  for (const [rolle, ref] of Object.entries(refs)) {
    const wert = aufloesen(ref, refs);
    if (wert) werte[rolle] = wert;
    else bericht.ungeloest.push(`${thema}.${rolle} = ${ref}`);
  }
  // Rollen, die nur die JSON kennt (nicht in der Bruecke): alten Wert behalten,
  // aber melden — sie sind Kandidaten zum Entfernen oder Nachtragen.
  const alt = tokens.semantic.defaults[thema] || {};
  const nurJson = Object.keys(alt).filter((r) => !(r in refs));
  for (const r of nurJson) werte[r] = alt[r];
  if (nurJson.length) bericht.nurImJson[thema] = nurJson;
  defaults[thema] = werte;
}

// Vergleich mit dem Ist-Stand ------------------------------------------------
const alteRefs = tokens.semantic.references || {};
const abweichungen = [];
for (const [thema, refs] of Object.entries(referenzen)) {
  for (const [rolle, ref] of Object.entries(refs)) {
    if (alteRefs[thema]?.[rolle] !== ref) abweichungen.push(`${thema}.${rolle}: ${alteRefs[thema]?.[rolle] ?? '—'} → ${ref}`);
  }
  for (const [rolle, wert] of Object.entries(defaults[thema])) {
    if (tokens.semantic.defaults[thema]?.[rolle] !== wert) abweichungen.push(`${thema}.${rolle} (Wert): ${tokens.semantic.defaults[thema]?.[rolle] ?? '—'} → ${wert}`);
  }
}

console.log(`\nSemantik aus der Bruecke — ${Object.keys(hell).length} Rollen hell, ${Object.keys(dunkel).length} dunkel`);
if (bericht.ungeloest.length) console.log(`  ⚠ nicht aufloesbar (bleibt Verweis, kein Default): ${bericht.ungeloest.length}\n    ${bericht.ungeloest.slice(0, 6).join('\n    ')}`);
for (const [t, r] of Object.entries(bericht.nurImJson)) console.log(`  ⚠ ${t}: ${r.length} Rollen nur in der JSON, nicht in der Bruecke (alter Wert bleibt): ${r.join(', ')}`);
console.log(`  ${abweichungen.length ? '✗' : '✓'} ${abweichungen.length} Abweichungen JSON ↔ Bruecke`);

if (modus === 'pruefen') {
  if (abweichungen.length) {
    console.error(abweichungen.slice(0, 15).map((a) => '    ' + a).join('\n'));
    console.error('  → node scripts/semantik-aus-bruecke.cjs --schreiben');
    process.exit(1);
  }
  process.exit(0);
}

if (modus === 'bericht') {
  console.log(abweichungen.slice(0, 20).map((a) => '    ' + a).join('\n'));
  console.log('\n  (nur Bericht — mit --schreiben uebernehmen)');
  process.exit(0);
}

// Schreiben ------------------------------------------------------------------
tokens.semantic.references = {
  $description: 'Verweise je Thema und Rolle, deckungsgleich mit scss/scss/00-settings/_mono-bridge.scss. Erzeugt von scripts/semantik-aus-bruecke.cjs — nicht von Hand pflegen.',
  ...referenzen,
};
tokens.semantic.defaults = defaults;
fs.writeFileSync(JSON_PFAD, JSON.stringify(tokens, null, 2) + '\n');
console.log('  ✓ data/design-tokens.json: semantic.references + semantic.defaults');

if (fs.existsSync(WERK_PFAD)) {
  const werk = JSON.parse(fs.readFileSync(WERK_PFAD, 'utf8'));
  werk.themes = {
    neo: { light: defaults['neo-light'], dark: defaults['neo-dark'] },
    customer: { light: defaults['customer-light'], dark: defaults['customer-dark'] },
  };
  werk._meta = { ...werk._meta, generatedAt: new Date().toISOString(), themesSource: 'scripts/semantik-aus-bruecke.cjs' };
  fs.writeFileSync(WERK_PFAD, JSON.stringify(werk, null, 2) + '\n');
  console.log('  ✓ neo-theme-defaults.json: themes (Werkseinstellung der Konfig-App)');
}
