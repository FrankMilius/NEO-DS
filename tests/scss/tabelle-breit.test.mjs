/**
 * Breite Tabellen ab 5 Spalten (Restpunkte 09.10.2026, tabelle-breit)
 *
 * Befund: Der Tabellenkopf (white-space: nowrap) lief bei 6 Spalten auch auf
 * dem Desktop ueber die Nachbarzellen (1280 px: bis 149 px, 1440 px: 130 px).
 *
 * Loesung: ab 5 Spalten (:has(thead th:nth-child(5))) bricht der Kopf an
 * Wortgrenzen um; im Tabellen-Block nimmt der Zeilenkopf 30 % statt 40 % und
 * jede Wertspalte hat eine Mindestbreite (--nc-table-block-col-min-width) —
 * schmaler scrollt der Block. 2-4 Spalten: keine Regel, pixelgleich.
 *
 * Gemessen (Chromium, Fixture mit 6 Spalten), Ueberlauf der Kopfzellen:
 *   1280 px 149 -> 0 px | 1024 px 145 -> 0 px (Block scrollt) | 800 px 170 -> 0
 *   2/3/4 Spalten: Breiten, Kopfhoehe und Ueberlauf unveraendert
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css
    .replace(/(--[\w-]+): +/g, '$1:');
}, 60000);

describe('Vergleichstabelle: breite Tabellen', () => {
  it('Kopf bricht erst ab der fuenften Spalte um', () => {
    expect(css).toContain('.nc-compare-table:has(thead th:nth-child(5)) thead th{white-space:normal;overflow-wrap:break-word;hyphens:auto}');
    // keine Regel fuer 2-4 Spalten
    expect(css).not.toMatch(/:has\(thead th:nth-child\([234]\)\)/);
  });

  it('Tabellen-Block: Zeilenkopf 30 % und Mindestbreite je Wertspalte, nicht im Scroll-Modus', () => {
    expect(css).toContain('.nc-table-block:not([data-scroll-active=true]) .nc-compare-table--full-width:has(thead th:nth-child(5)) :is(th,td):first-child{width:30%}');
    for (let n = 5; n <= 10; n++) {
      expect(css).toContain(`.nc-table-block:not([data-scroll-active=true])>.nc-compare-table--full-width:has(thead th:nth-child(${n})) table{min-width:calc(${n - 1}*var(--nc-table-block-col-min-width)/0.7)}`);
    }
    expect(css).toMatch(/--nc-table-block-col-min-width:9rem/);
  });
});
