/**
 * Tabellen in Theme-BEREICHEN (Restpunkte 09.10.2026, tabelle-dunkel)
 *
 * Befund: --nc-table-* sind am :root aus --fnd-color-* abgeleitet und dort
 * aufgeloest. Ein Block „neo-dark-theme neo-surface" (field_surface dunkel)
 * behielt die weisse Tabelle der hellen Seite (Zelltext 1,12:1), ein heller
 * Block auf dunkler Seite die dunkle (1,25:1). Ausserdem schlug die spaetere
 * :root-Vorgabe von --nc-table-block-stripe-bg das seitenweite Dunkel per
 * Klasse auf <html> (Streifen = Tabellenflaeche).
 *
 * Gemessen (Chromium, Theme-CSS-Stapel neo_fe), Zelltext auf Tabelle:
 *   dunkler Bereich 1,12 -> 12,79:1 | Kunde dunkel 1,00 -> 17,76:1
 *   heller Bereich auf dunkler Seite 1,25 -> 17,85:1 | hell pixelgleich
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css
    // Custom Properties behalten im Kompressionsmodus das Leerzeichen nach dem Doppelpunkt
    .replace(/(--[\w-]+): +/g, '$1:');
}, 60000);

const BEREICHE = '.neo-light-theme,.neo-dark-theme,.customer-light-theme,.customer-dark-theme{';

describe('Vergleichstabelle: Farben in Theme-Bereichen neu gebunden', () => {
  it('alle farbtragenden --nc-table-* stehen im Bereichs-Block mit denselben Ausdruecken wie am :root', () => {
    const bloecke = css.split(BEREICHE).slice(1).map((s) => s.slice(0, s.indexOf('}')));
    const block = bloecke.find((b) => b.includes('--nc-table-bg'));
    expect(block, 'Bereichs-Block mit --nc-table-bg').toBeTruthy();
    for (const [name, wert] of [
      ['bg', 'var(--fnd-color-surface-elevated)'],
      ['header-bg', 'var(--fnd-color-background-inverse)'],
      ['header-color', 'var(--fnd-color-text-inverse)'],
      ['color', 'var(--fnd-color-text-primary)'],
      ['color-secondary', 'var(--fnd-color-text-secondary)'],
      ['row-border-color', 'var(--fnd-color-border-secondary)'],
      ['row-bg-hover', 'var(--fnd-color-background-secondary)'],
      ['row-bg-selected', 'var(--fnd-color-background-tertiary)'],
    ]) {
      expect(block).toContain(`--nc-table-${name}:${wert}`);
      // dieselbe Vorgabe am :root (nur Neubindung, kein neuer Wert)
      expect(css).toMatch(new RegExp(`:root\\{[^}]*--nc-table-${name}:${wert.replace(/[()]/g, '\\$&')}`));
    }
  });

  it('Streifen des Blocks: seitenweites Dunkel per Klasse auf <html> schlaegt die :root-Vorgabe', () => {
    expect(css).toContain('.customer-dark-theme,:root:is(.neo-dark-theme,.customer-dark-theme){--nc-table-block-stripe-bg:var(--fnd-color-background-base)}');
  });
});
