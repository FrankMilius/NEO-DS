#!/usr/bin/env node
/**
 * Doppelte Custom Properties in :root (gebautes CSS). Steht ein Token in
 * zwei :root-Bloecken, gewinnt stillschweigend der spaetere — so hatte
 * --nc-toast-shadow zwei verschiedene Werte (Token-Audit F7).
 * Nur Bloecke mit dem Selektor genau ":root" auf oberster Ebene; Themen-
 * und Media-Bloecke ueberschreiben absichtlich.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const gesehen = new Map();
const dubletten = new Map();
let tiefe = 0; let i = 0;
while (i < css.length) {
  const auf = css.indexOf('{', i);
  if (auf < 0) break;
  const zu = css.indexOf('}', i);
  if (zu >= 0 && zu < auf) { tiefe = Math.max(0, tiefe - 1); i = zu + 1; continue; }
  const selektor = css.slice(css.lastIndexOf('}', auf) + 1, auf).trim().replace(/^.*;/, '').trim();
  if (tiefe === 0 && selektor === ':root') {
    const ende = css.indexOf('}', auf);
    const rumpf = css.slice(auf + 1, ende);
    for (const m of rumpf.matchAll(/(--[a-zA-Z0-9_-]+)\s*:([^;]*)/g)) {
      const [name, wert] = [m[1], m[2].trim()];
      if (gesehen.has(name) && gesehen.get(name) !== wert) dubletten.set(name, [gesehen.get(name), wert]);
      gesehen.set(name, wert);
    }
    i = ende + 1; continue;
  }
  if (selektor.startsWith('@')) tiefe++;
  i = auf + 1;
  if (!selektor.startsWith('@')) { const ende = css.indexOf('}', auf); i = ende + 1; }
}
for (const [n, [a, b]] of dubletten) console.log(`  ${n}: ${a}  ->  ${b}`);
console.log(`Root-Dubletten: ${dubletten.size} mit abweichendem Wert`);
process.exit(dubletten.size ? 1 : 0);
