/**
 * Welche Klassen kennt das Design System?
 *
 * WARUM ES DAS ALS EIGENE DATEI GIBT
 * Drei Skripte haben diese Frage bis zum 24.08.2026 jedes fuer sich
 * beantwortet — und dabei drei verschiedene Muster benutzt. Zwei Quellen fuer
 * dieselbe Frage driften; drei erst recht. Dasselbe Argument wie bei der
 * Importliste des Konfigurators: eine Stelle, oder es geht schief.
 *
 * WAS ALS KLASSE ZAEHLT
 * Alles, was im kompilierten Stylesheet als Selektor `.name` vorkommt. Ein
 * Klassenname darf Unterstriche enthalten (`nc-shell__skip-link`) — ein Muster
 * ohne `_` uebersieht die halbe BEM-Struktur, was beim Nachsehen von Hand am
 * 24.08. auch prompt passiert ist.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Klassen, die zum Design System gehoeren und darum geprueft werden. */
export const PRAEFIXE = /^(nc|fnd|o|u)-/;

/**
 * Klassen, die nicht aus dem Design System stammen und darum nichts beweisen:
 * Zustaende, die JS setzt, und was Drupal beilegt.
 */
export const UEBERGEHEN = /^(is|has|js|path|ajax|visually|sr|contextual|drupal|docs)-/;

/** Alle Klassennamen aus styles.css. */
export function klassenLesen(datei = resolve(ROOT, 'styles.css')) {
  const css = readFileSync(datei, 'utf8');
  const raus = new Set();
  for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) raus.add(m[1]);
  return raus;
}

/**
 * Die Klassen eines Markup-Schnipsels, die geprueft werden sollen.
 *
 * Gelesen wird nur `class="…"`. Im Fliesstext einer Doku-Seite kann derselbe
 * Name als Beispiel stehen — der gestaltet nichts und soll auch nichts.
 */
export function klassenImMarkup(html) {
  const raus = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const k of m[1].split(/\s+/).filter(Boolean)) {
      if (UEBERGEHEN.test(k) || !PRAEFIXE.test(k)) continue;
      raus.add(k);
    }
  }
  return raus;
}
