/**
 * Footer Tablet: Sitemap-Spalten laufen bei 768px nicht ueber
 * (Entscheidung Abschluss 08.10.2026)
 *
 * Befund: .nc-footer--4-col setzte ab 768px (sm) vier 1fr-Spalten. Die
 * Navigation ist dort neben der Kontaktspalte nur ~437px breit; die Spalten
 * wuchsen auf ihre Min-Content-Breite und liefen 19px ueber den Viewport.
 *
 * Gemessen mit Playwright (data/markup/footer.html, CSS-Reihenfolge wie im
 * Theme: neo-fonts, design-tokens, styles.css, theme-overrides, neo-overrides):
 *   Ueberlauf ueber die Containerkante / den Viewport
 *            600   700   768      800    900   1024
 *   vorher   0     0     46 / 19  24 / 0 0     0
 *   nachher  0     0     0 / 0    0 / 0  0     0
 *   320–767px und ab 960px pixelgleich.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
}, 60000); // Sass-Vollbuild braucht unter Last laenger als die 10s-Vorgabe

describe('Footer: Sitemap zwischen sm und md zweispaltig', () => {
  it('4-spaltige Sitemap ist von 768 bis 959px zweispaltig (minmax(0, 1fr))', () => {
    expect(css).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*959px\)\s*\{\s*\.nc-footer--4-col \.nc-footer__columns\{grid-template-columns:repeat\(2,\s*minmax\(0,\s*1fr\)\)\}/,
    );
  });

  it('die Tablet-Regel steht nach der Vier-Spalten-Regel (gleiche Spezifitaet)', () => {
    const vier = css.indexOf('.nc-footer--4-col .nc-footer__columns{grid-template-columns:repeat(4');
    const zwei = css.search(/\.nc-footer--4-col \.nc-footer__columns\{grid-template-columns:repeat\(2,\s*minmax/);
    expect(vier).toBeGreaterThan(-1);
    expect(zwei).toBeGreaterThan(vier);
  });

  it('Korrektur ueber Breakpoint-Mixin, ohne !important und ohne px-Werte', () => {
    const scss = readFileSync(resolve(ROOT, 'scss/scss/07-organisms/_footer.scss'), 'utf-8');
    const start = scss.indexOf("@include respond-between('sm', 'md')");
    expect(start).toBeGreaterThan(-1);
    const block = scss.slice(start, scss.indexOf('}', scss.indexOf('}', start) + 1) + 1);
    expect(block).not.toContain('!important');
    expect(block).not.toMatch(/\d+px/);
  });

  it('Recipe footer fuehrt die Korrektur (2.0.3)', () => {
    const recipe = JSON.parse(readFileSync(resolve(ROOT, 'data/footer-recipe.json'), 'utf-8'));
    expect(recipe.meta.version).toBe('2.0.3');
    expect(recipe.meta.changelog[0].version).toBe('2.0.3');
    expect(recipe.meta.changelog[0].changes.join(' ')).toContain('768');
  });
});
