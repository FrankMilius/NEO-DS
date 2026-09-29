#!/usr/bin/env node
/**
 * Tote Verweise im gebauten CSS: var(--x) ohne Rueckfallwert, wobei --x
 * nirgends deklariert ist. Solche Eigenschaften sind zur Laufzeit ungueltig
 * — der Browser faellt auf den Anfangswert zurueck (Spinner dreht nicht,
 * Radius 0, Schrift faellt auf Standard).
 *
 *   node scripts/pruefe-tote-verweise.cjs      Liste + Schlusszeile
 *
 * Werte, die per Markup gesetzt werden (style="--x: …"), brauchen einen
 * Rueckfallwert: var(--x, <wert>). Token-Audit F1: am 08.09.2026 23 Stueck,
 * am 29.09.2026 auf 0 gebracht.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const decl = new Set([...css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((m) => m[1]));
const tot = new Map();
for (const m of css.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/g)) {
  if (!decl.has(m[1])) tot.set(m[1], (tot.get(m[1]) || 0) + 1);
}
for (const [name, n] of [...tot].sort()) console.log(`  ${n}× ${name}`);
console.log(`Tote-Verweise: ${tot.size} Variablen ohne Definition und ohne Rueckfallwert`);
process.exit(tot.size ? 1 : 0);
