#!/usr/bin/env node
/**
 * DTCG-Export der Token-Quelle (P1.2, 29.09.2026)
 * ==========================================================================
 *   node scripts/export-dtcg.cjs              schreibt data/design-tokens.dtcg.json
 *   node scripts/export-dtcg.cjs --pruefen    bricht ab, wenn die Datei veraltet ist
 *
 * WAS: data/design-tokens.json im Format der W3C Design Tokens Community
 * Group (Spezifikation 2025.10) — als ZUSAETZLICHES Generat. Die bisherige
 * JSON bleibt die Quelle; 22 Abnehmer lesen sie.
 *
 * 1:1 OHNE UMBENENNUNG: Jeder Pfad der Quelle ist ein Pfad im Export
 * (primitives.neutralleitern.lime.shades.300, semantic.text-primary,
 * components.button.nc-button-accent-bg, foundation.spacing.scale.03).
 * Die Angleichung an Figma-Namen ist ein eigener Schritt (P1.4).
 *
 * VERWEISE WERDEN ALIASE
 *   primitives  alias {…neutralleitern.lime}      -> je Stufe {…lime.shades.N}
 *   semantic    {neutral.N} {accent.N}            -> Graphit- bzw. Lime-Leiter
 *               {system.x.N} {color.x}            -> Systempalette bzw. {semantic.x}
 *   components  ref "text-primary"                -> {semantic.text-primary}
 *               ref "spacing-03", var(--fnd-…)    -> Konfigurator-Foundation (ueber
 *                                                    den geprueften cssVar aus
 *                                                    tokens.generated.js)
 *               var(--nc-…)                       -> anderer Komponenten-Token
 * Was kein einzelner Verweis ist (color-mix, zusammengesetzte Werte), bleibt
 * CSS-Text; bei Farben steht der aufgeloeste Wert in $value und der Ausdruck
 * in $extensions["de.neocosmo"].css.
 *
 * KERN: Die Abbildung steht seit Plan v2, 2.2 in packages/dtcg-export/index.js
 * (reines ESM). Dieses Skript liest nur die Dateien und schreibt/prueft das
 * Ergebnis; der Theme-Konfigurator benutzt denselben Kern fuer seinen
 * DTCG-Download.
 *
 * THEMEN: DTCG kennt (noch) keine Modi. $value ist neo-light; die drei anderen
 * Themen stehen in $extensions["de.neocosmo"].modes.
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const WURZEL = path.resolve(__dirname, '..');
const QUELLE = path.join(WURZEL, 'data/design-tokens.json');
const ZIEL = path.join(WURZEL, 'data/design-tokens.dtcg.json');
const APP_TOKENS = path.join(WURZEL, 'apps/theme-configurator/src/data/tokens.generated.js');
const KERN = path.join(WURZEL, 'packages/dtcg-export/index.js');
const PRUEFEN = process.argv.includes('--pruefen');

(async () => {
  const { erzeugeDtcg } = await import(pathToFileURL(KERN).href);
  const src = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
  const { foundationTokens } = await import(pathToFileURL(APP_TOKENS).href);
  let stylesCss = null;
  try { stylesCss = fs.readFileSync(path.join(WURZEL, 'styles.css'), 'utf8'); } catch { /* ohne styles.css kein zweiter Index */ }
  const { text, bericht, zusammenfassung } = erzeugeDtcg(src, { foundationTokens, stylesCss });
  if (PRUEFEN) {
    const alt = fs.existsSync(ZIEL) ? fs.readFileSync(ZIEL, 'utf8') : '';
    if (alt !== text) { console.error(`  ✗ ${path.relative(WURZEL, ZIEL)} ist veraltet — node scripts/export-dtcg.cjs`); process.exit(1); }
    // Seit P1.2b (29.09.2026) ist alles aufgeloest — das bleibt so.
    if (bericht.offen.length || bericht.ohneWert.length) {
      console.error(`  ✗ ${bericht.offen.length} Verweise ohne Ziel, ${bericht.ohneWert.length} Rollen ohne Wert — node scripts/export-dtcg.cjs --alle`);
      process.exit(1);
    }
    console.log(`  ✓ ${zusammenfassung} — Datei aktuell`);
    return;
  }
  fs.writeFileSync(ZIEL, text);
  console.log(`  ✓ ${path.relative(WURZEL, ZIEL)} — ${zusammenfassung}`);
  if (bericht.offen.length) {
    if (process.argv.includes('--alle')) {
      console.log('    Offene Verweise (bleiben CSS-Text):');
      for (const o of bericht.offen) console.log('     - ' + o);
    } else console.log('    Liste der offenen Verweise: node scripts/export-dtcg.cjs --alle');
  }
})().catch((e) => { console.error(e); process.exit(1); });
