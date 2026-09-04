// ==========================================================================
// Prüfschranke für die PowerPoint-Master
// ==========================================================================
// Belegt, statt zu behaupten:
//
//   1. Beide Dichtestufen liegen als Datei vor und haben gleich viele Layouts.
//   2. Die Inhaltszone beginnt dort, wo der Tokensatz sie hinlegt
//      (Rand + Titelzone), gemessen im Layout-XML in EMU.
//   3. theme1.xml traegt die Diagrammfarbfolge und die Schriften.
//   4. Die Statusfarben erreichen auf allen sechs Gruenden ihre Grenze:
//      Marke 3,0:1 (WCAG 1.4.11), Text 4,5:1 (1.4.3).
//   5. Beispieldecks: Ersatzmarken "FEHLT ·" je Deck — der Restbestand,
//      den die Phasen 3–8 auf null bringen.
//
//   npm run pptx:pruefen              alle Pruefungen
//   npm run pptx:pruefen -- --alle    auch die bestandenen Kontraste
//
// Exit-Code 1 bei jedem Befund. Der Plan (.claude/plans/2026-09-04-
// foliensystem.md) nennt je Phase, welche Zahl hier stehen muss.
// ==========================================================================

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import JSZip from 'jszip';
import { STUFEN, geometrie, STATUS, DIAGRAMM, PAPIER, G } from './pptx-vorlage.mjs';

const WURZEL = resolve(import.meta.dirname, '..');
const DIST = join(WURZEL, 'dist/pptx');
const alle = process.argv.includes('--alle');
const EMU = 914400;
let befunde = 0;

const ok = (t) => console.log(`  ✓ ${t}`);
const nein = (t) => { befunde++; console.log(`  ✗ ${t}`); };

async function archiv(datei) {
  return JSZip.loadAsync(readFileSync(datei));
}

// ── 1 + 2 + 3: Master je Stufe ────────────────────────────────────────────
console.log('\nMaster');
const layoutzahl = {};
for (const stufe of STUFEN) {
  const Z = geometrie(stufe);
  const datei = join(DIST, `${Z.dateiname}.pptx`);
  if (!existsSync(datei)) { nein(`${Z.dateiname}.pptx fehlt — erst npm run pptx:vorlage`); continue; }
  const zip = await archiv(datei);
  const layouts = Object.keys(zip.files).filter((p) => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(p));
  // pptxgenjs legt ein leeres Standardlayout dazu; gezaehlt wird nur, was
  // dem Namensschema KUERZEL_NAME folgt.
  let eigene = 0;
  for (const p of layouts) {
    const name = ((await zip.file(p).async("string")).match(/<p:cSld name="([^"]+)"/) || [])[1] || "";
    if (/^[A-Z]{1,2}\d+_/.test(name)) eigene++;
  }
  layoutzahl[stufe] = eigene;

  // Inhaltszone: Das Layout AG1_AGENDA hat genau einen Koerper-Platzhalter
  // bei y = Rand + Titelzone. Gesucht wird sein <a:off y> im XML.
  const erwartet = Math.round(Z.INHALT_Y * EMU);
  let gefunden = null, agGesehen = false;
  for (const p of layouts) {
    const xml = await zip.file(p).async('string');
    if (!xml.includes('name="AG1_AGENDA"')) continue;
    agGesehen = true;
    const ys = [...xml.matchAll(/<a:off x="\d+" y="(\d+)"\/>/g)].map((m) => Number(m[1]));
    gefunden = ys.find((y) => Math.abs(y - erwartet) <= 1000) ?? null;
    if (gefunden === null) nein(`${Z.label}: Inhaltszone erwartet bei ${erwartet} EMU, gefunden ${ys.join(', ')}`);
    else ok(`${Z.label}: ${eigene} Layouts, Inhaltszone bei ${gefunden} EMU (Rand + ${mm(Z)} mm), Text ${Z.textPt} pt`);
  }
  if (!agGesehen) nein(`${Z.label}: Layout AG1_AGENDA nicht gefunden`);

  // Theme
  const theme = Object.keys(zip.files).find((p) => /^ppt\/theme\/theme1\.xml$/.test(p));
  const txml = theme ? await zip.file(theme).async('string') : '';
  const accents = DIAGRAMM.farbfolge.map((f, i) => {
    const m = txml.match(new RegExp(`<a:accent${i + 1}>\\s*<a:srgbClr val="([0-9A-Fa-f]{6})"`));
    return m ? m[1].toUpperCase() : '—';
  });
  const treffer = accents.every((a, i) => a === DIAGRAMM.farbfolge[i]);
  const major = (txml.match(/<a:majorFont>\s*<a:latin typeface="([^"]*)"/) || [])[1];
  const minor = (txml.match(/<a:minorFont>\s*<a:latin typeface="([^"]*)"/) || [])[1];
  if (treffer && major === 'Space Grotesk' && minor === 'Manrope') ok(`${Z.label}: Theme accent1–6 = ${accents.join(' ')}, Schriften ${major} / ${minor}`);
  else nein(`${Z.label}: Theme abweichend — accents ${accents.join(' ')}, Schriften ${major} / ${minor}`);
}
function mm(Z) { return Math.round(Z.TITELZONE * 25.4); }

const zahlen = Object.values(layoutzahl);
if (zahlen.length === STUFEN.length && zahlen.every((n) => n === zahlen[0])) ok(`beide Stufen haben ${zahlen[0]} Layouts`);
else nein(`Layoutzahl je Stufe ungleich: ${JSON.stringify(layoutzahl)}`);

// ── 4: Statusfarben ───────────────────────────────────────────────────────
console.log('\nStatusfarben (Kontrast nach WCAG 2.1)');
const lum = (hex) => {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const kontrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const gruende = {
  hell: Object.fromEntries(Object.entries(PAPIER).map(([n, l]) => [n, l['100']])),
  tief: { 'graphit-950': G['950'] },
};
const GRENZE = { marke: 3.0, text: 4.5 };
let geprueft = 0, bestanden = 0;
for (const [grund, papiere] of Object.entries(gruende)) {
  for (const [name, s] of Object.entries(STATUS[grund])) {
    for (const rolle of ['marke', 'text']) {
      for (const [papier, hex] of Object.entries(papiere)) {
        const k = kontrast(s[rolle], hex);
        geprueft++;
        const gut = k >= GRENZE[rolle];
        if (gut) bestanden++;
        if (!gut) nein(`${grund} ${name} ${rolle} #${s[rolle]} auf ${papier}: ${k.toFixed(2)}:1 < ${GRENZE[rolle]}`);
        else if (alle) ok(`${grund} ${name} ${rolle} #${s[rolle]} auf ${papier}: ${k.toFixed(2)}:1`);
      }
    }
  }
}
if (bestanden === geprueft) ok(`${bestanden}/${geprueft} Paare über der Grenze (Marke ≥ 3,0 · Text ≥ 4,5)`);
for (const [name, s] of Object.entries(STATUS.hell)) {
  console.log(`    ${name.padEnd(6)} ${s.bedeutung.padEnd(18)} hell: Marke #${s.marke} Text #${s.text}   tief: Marke #${STATUS.tief[name].marke} Text #${STATUS.tief[name].text}`);
}

// ── 5: Ersatzmarken in den Beispieldecks ──────────────────────────────────
console.log('\nBeispieldecks');
const decks = existsSync(DIST) ? readdirSync(DIST).filter((f) => /^NEO-Beispiel-.*\.pptx$/.test(f)) : [];
if (!decks.length) console.log('  · keine Beispieldecks in dist/pptx — npm run pptx:beispiel');
let ersatzGesamt = 0;
for (const d of decks) {
  const zip = await archiv(join(DIST, d));
  const folien = Object.keys(zip.files).filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p));
  let ersatz = 0;
  for (const p of folien) {
    const xml = await zip.file(p).async('string');
    ersatz += (xml.match(/FEHLT ·/g) || []).length;
  }
  ersatzGesamt += ersatz;
  console.log(`  ${ersatz ? '·' : '✓'} ${d.replace('NEO-Beispiel-', '').replace('.pptx', '').padEnd(14)} ${String(folien.length).padStart(2)} Folien, ${ersatz} Ersatzmarken`);
}
if (decks.length) console.log(`  ${ersatzGesamt ? '·' : '✓'} Ersatzmarken gesamt: ${ersatzGesamt}`);

console.log(befunde ? `\n✗ ${befunde} Befund(e)\n` : '\n✓ ohne Befund\n');
process.exit(befunde ? 1 : 0);
