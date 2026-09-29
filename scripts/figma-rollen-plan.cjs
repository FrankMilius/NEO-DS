#!/usr/bin/env node
/**
 * Plan fuer die Figma-Sammlung „Rolle" (Bibliothek neo brand Styleguide,
 * Td9jEnrwY4vSzqnMPm6u1n) aus data/design-tokens.json.
 *
 * WARUM
 * Die Rollen in Figma trugen noch die alte Neutral-Leiter (#000 / #494949 /
 * #7a7a7a), der Code seit der Mono-Bruecke Graphit. Folien, Bibliothek und
 * Website zeigten dieselbe Rolle in drei Grautoenen (Analyse 29.09.2026).
 *
 * WAS ES TUT
 * Schreibt je Figma-Variable und Modus entweder einen Alias auf eine
 * Leiter-Variable der Sammlung „Farbe" (bei {neutral.N}, {accent.N},
 * {system.x.N}) oder den aufgeloesten Hex-Wert. Das Ergebnis wird von einem
 * use_figma-Skript angewendet (Trockenlauf zuerst).
 *
 *   node scripts/figma-rollen-plan.cjs > data/figma-rollen-plan.json
 */
'use strict';
const tokens = require('../data/design-tokens.json');
const refs = tokens.semantic.references;
const defs = tokens.semantic.defaults;

const MODI = { 'Neo Hell': 'neo-light', 'Neo Dunkel': 'neo-dark', 'Kunde Hell': 'customer-light', 'Kunde Dunkel': 'customer-dark' };

// Figma-Gruppe -> Rollen-Praefix im JSON
const GRUPPEN = {
  'Grund': 'background-', 'Kontur': 'border-', 'Rückmeldung': 'feedback-',
  'Bedienung': 'interactive-', 'Ebene': 'layer-', 'Auf Farbe': 'on-',
  'Text': 'text-', 'Bildlauf': 'scrollbar-', 'Auswahl': 'selection-', 'Fläche': 'surface-',
};
const SYSTEM = { success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info' };

const alsFigma = (ref, thema, tiefe = 0) => {
  let m;
  if (tiefe > 8 || !ref) return null;
  if ((m = ref.match(/^\{neutral\.(\d+)\}$/))) return { alias: `Leiter/Graphit/${m[1]}` };
  if ((m = ref.match(/^\{accent\.(\d+)\}$/))) return { alias: `Leiter/Lime/${m[1]}` };
  if ((m = ref.match(/^\{system\.(\w+)\.(\d+)\}$/))) return { alias: `Rückmeldung/${SYSTEM[m[1]]}/${m[2]}` };
  if ((m = ref.match(/^\{color\.([a-z0-9-]+)\}$/))) return alsFigma(refs[thema][m[1]], thema, tiefe + 1);
  return null; // Hex oder color-mix -> aufgeloester Wert
};

const plan = { $quelle: 'data/design-tokens.json semantic.references', variablen: {}, ohneRolle: [] };

// Alle Rollen, die eine Figma-Gruppe haben
for (const [gruppe, praefix] of Object.entries(GRUPPEN)) {
  for (const rolle of Object.keys(refs['neo-light'])) {
    if (!rolle.startsWith(praefix)) continue;
    let name = rolle.slice(praefix.length);
    if (gruppe === 'Ebene') name = name; // layer-01 -> Ebene/01
    const eintrag = {};
    for (const [modus, thema] of Object.entries(MODI)) {
      const f = alsFigma(refs[thema][rolle], thema);
      eintrag[modus] = f || { hex: defs[thema][rolle] };
    }
    plan.variablen[`${gruppe}/${name}`] = eintrag;
  }
}
process.stdout.write(JSON.stringify(plan, null, 1) + '\n');
