#!/usr/bin/env node
/**
 * Tokens-Studio-Export (Roadmap R08, 20.10.2026)
 * ==========================================================================
 *   node scripts/export-tokens-studio.cjs            schreibt data/design-tokens.tokens-studio.json
 *   node scripts/export-tokens-studio.cjs --pruefen  bricht ab, wenn die Datei veraltet ist
 *                                                    oder ein Verweis nicht aufgelöst wird
 *   node scripts/export-tokens-studio.cjs --andere   listet die Tokens, die CSS-Text bleiben
 *
 * Quelle ist der DTCG-Export (data/design-tokens.dtcg.json, npm run tokens:dtcg).
 * Die Abbildung steht in packages/tokens-studio-export/index.js.
 *
 * In Figma: Plugin „Tokens Studio“ → Tools → Load from file/folder → diese
 * Datei; Format „Legacy“ (value/type). Themen „NEO Hell“ und „NEO Dunkel“.
 * ==========================================================================
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const WURZEL = path.resolve(__dirname, '..');
const QUELLE = path.join(WURZEL, 'data/design-tokens.dtcg.json');
const ZIEL = path.join(WURZEL, 'data/design-tokens.tokens-studio.json');
const KERN = path.join(WURZEL, 'packages/tokens-studio-export/index.js');

(async () => {
  const { alsTokensStudio } = await import(pathToFileURL(KERN).href);
  const { datei, bericht } = alsTokensStudio(JSON.parse(fs.readFileSync(QUELLE, 'utf8')));
  const text = JSON.stringify(datei, null, 2) + '\n';
  const summe = Object.values(bericht.anzahl).reduce((a, b) => a + b, 0);
  const zusammenfassung = `${summe} Tokens in ${Object.keys(bericht.anzahl).length} Sets (${bericht.dunkel} Dunkel-Werte), ${bericht.andere} als CSS-Text („other“), ${bericht.offen.length} Verweise offen`;

  console.log('▸ Tokens: Tokens-Studio-Export');
  if (bericht.offen.length) {
    console.error(`  ✗ ${bericht.offen.length} Verweise ohne Ziel:`);
    for (const o of bericht.offen.slice(0, 20)) console.error('     - ' + o);
    process.exit(1);
  }
  if (process.argv.includes('--andere')) {
    const liste = [];
    (function lauf (o, p) {
      for (const [k, v] of Object.entries(o)) {
        if (k.startsWith('$') || !v || typeof v !== 'object') continue;
        if ('value' in v && 'type' in v) { if (v.type === 'other') liste.push(`${p.concat(k).join('.')} = ${JSON.stringify(v.value)}`); }
        else lauf(v, p.concat(k));
      }
    })(datei, []);
    for (const z of liste) console.log('    ' + z);
  }
  if (process.argv.includes('--pruefen')) {
    const alt = fs.existsSync(ZIEL) ? fs.readFileSync(ZIEL, 'utf8') : '';
    if (alt !== text) {
      console.error(`  ✗ ${path.relative(WURZEL, ZIEL)} ist veraltet — npm run tokens:studio`);
      process.exit(1);
    }
    console.log(`  ✓ ${zusammenfassung} — Datei aktuell`);
    return;
  }
  fs.writeFileSync(ZIEL, text);
  console.log(`  ✓ ${path.relative(WURZEL, ZIEL)} — ${zusammenfassung}`);
})().catch((e) => { console.error(e); process.exit(1); });
