#!/usr/bin/env node
// ==========================================================================
// Leitern ableiten und pruefen (Markenbuch Kapitel 04.2)
// ==========================================================================
// Regel: Alle Papier- und Reserveleitern tragen Stufe fuer Stufe DIESELBE
// OKLCH-Helligkeit wie Graphit. Farbton und Buntheit kommen vom Ankerwert
// (der Picker-Wert der Marke auf seiner Stufe), der Buntheitsverlauf ueber
// die Leiter folgt dem Profil von Beige — so wurde Ivory gebaut, so wurde
// am 09.09.2026 Mint gebaut.
//
// Ausnahme: Forest. Forest ist kein Papier, laeuft nie ueber den Schalter
// und bleibt die gemischte Leiter mit dem Picker-Wert #0c4146 auf 800.
// Entschieden am 09.09.2026, Plan .claude/plans/2026-09-09-papiersystem.md.
//
//   node scripts/leiter-ableiten.cjs                 Mint aus dem Anker rechnen
//   node scripts/leiter-ableiten.cjs --pruefen       Leitern in _neutral-ramps.scss
//                                                    gegen die Regel pruefen
// ==========================================================================
const fs = require('fs');
const path = require('path');
const o = require('./oklch.cjs');

const STUFEN = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMPEN = path.join(__dirname, '..', 'scss/scss/00-settings/_neutral-ramps.scss');
const TOLERANZ = 0.003;

// Anker: Markenwert und die Stufe, auf der er liegt.
const ANKER = { mint: { hex: '#efffe6', stufe: 100 } };
const AUSNAHMEN = new Set(['forest', 'lime']);

function leiternLesen() {
  const scss = fs.readFileSync(RAMPEN, 'utf8');
  const out = {};
  for (const m of scss.matchAll(/^\$([a-z][\w-]*):\s*\(([^)]*)\)/gm)) {
    const stufen = {};
    for (const s of m[2].matchAll(/(\d+):\s*(#[0-9a-fA-F]{6})/g)) stufen[s[1]] = s[2].toLowerCase();
    if (Object.keys(stufen).length === STUFEN.length) out[m[1]] = stufen;
  }
  return out;
}

function ableiten(ankerHex, ankerStufe, graphit, beige) {
  const a = o.hexToOklch(ankerHex);
  const k = a.C / o.hexToOklch(beige[ankerStufe]).C;
  const out = {};
  for (const s of STUFEN) {
    const L = o.hexToOklch(graphit[s]).L;
    const C = o.hexToOklch(beige[s]).C * k;
    out[s] = o.oklchToHex(L, C, a.H);
  }
  return out;
}

const leitern = leiternLesen();
const { graphit, beige } = leitern;
if (!graphit || !beige) { console.error('Graphit oder Beige fehlt in _neutral-ramps.scss'); process.exit(2); }

if (process.argv.includes('--pruefen')) {
  let fehler = 0;
  for (const [name, stufen] of Object.entries(leitern)) {
    if (AUSNAHMEN.has(name)) { console.log(`  ○ ${name.padEnd(12)} Ausnahme, nicht auf der Graphit-Helligkeit`); continue; }
    let maxAbw = 0;
    for (const s of STUFEN) maxAbw = Math.max(maxAbw, Math.abs(o.hexToOklch(stufen[s]).L - o.hexToOklch(graphit[s]).L));
    const gut = maxAbw <= TOLERANZ;
    if (!gut) fehler++;
    console.log(`  ${gut ? '✓' : '✗'} ${name.padEnd(12)} max. ΔL ${maxAbw.toFixed(4)}`);
  }
  for (const [name, { hex, stufe }] of Object.entries(ANKER)) {
    const soll = ableiten(hex, stufe, graphit, beige);
    const ist = leitern[name];
    if (!ist) { console.log(`  ✗ ${name} fehlt`); fehler++; continue; }
    const diff = STUFEN.filter((s) => ist[s] !== soll[s]);
    if (diff.length) { fehler++; console.log(`  ✗ ${name} weicht von der Ableitung ab auf ${diff.join(', ')}`); }
    else console.log(`  ✓ ${name.padEnd(12)} entspricht der Ableitung aus ${hex} auf Stufe ${stufe} (${name} ${stufe} = ${ist[stufe]})`);
  }
  console.log(fehler ? `\n${fehler} Fehler` : '\nAlle Leitern entsprechen der Regel.');
  process.exit(fehler ? 1 : 0);
}

for (const [name, { hex, stufe }] of Object.entries(ANKER)) {
  const l = ableiten(hex, stufe, graphit, beige);
  console.log(`$${name}: (`);
  console.log('  ' + STUFEN.slice(0, 4).map((s) => `${String(s).padStart(3)}: ${l[s]}`).join(',  ') + ',');
  console.log('  ' + STUFEN.slice(4, 8).map((s) => `${String(s).padStart(3)}: ${l[s]}`).join(',  ') + ',');
  console.log('  ' + STUFEN.slice(8).map((s) => `${String(s).padStart(3)}: ${l[s]}`).join(',  '));
  console.log(') !default;');
}
