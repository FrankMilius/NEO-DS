/**
 * Inhaltsseite: nur EIN Seitenabstand auf dem Telefon
 * (Entscheidung Abschluss 08.10.2026)
 *
 * Befund: .nc-content polstert mit --container-padding-inline, die Prosa im
 * Body-Feld (.nc-prose) legte --prose-gutter (derselbe Token) noch einmal
 * darauf. Bei 375px standen Titel und Angaben bei 20px, der Text bei 40px.
 *
 * Gemessen mit Playwright (Markup aus neo_fe node.html.twig + field--body,
 * Theme-CSS-Stapel), linke Kante Titel / Text:
 *            320     375     600     768     1024     1280
 *   vorher   20/40   20/40   21/41   33/42   161/161  289/289
 *   nachher  20/20   20/20   21/21   33/33   161/161  289/289
 *   Breakouts content/wide/full ab 1024px unveraendert.
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

describe('Content: Prosa-Rand im Body-Feld', () => {
  it('.nc-content__body begrenzt --mod-prose-gutter per clamp auf den einengenden Teil', () => {
    const m = css.match(/\.nc-content__body\{--mod-prose-gutter:\s*([^}]*)\}/);
    expect(m).not.toBeNull();
    const wert = m[1].replace(/\s+/g, '');
    expect(wert).toMatch(/^clamp\(0px,/);
    expect(wert).toContain('(100%-var(--mod-prose-measure,var(--container-prose,72ch)))/2');
    expect(wert).toContain('var(--container-padding-inline,var(--fnd-spacing-06))');
  });

  it('.nc-prose liest den Override weiterhin (Breakout-Grid unveraendert)', () => {
    expect(css).toMatch(/\.nc-prose\{--prose-measure:[^;]*;--prose-gutter:\s*var\(--mod-prose-gutter,/);
    expect(css).toMatch(/\[full-start\]\s*minmax\(var\(--prose-gutter\),\s*1fr\)/);
  });

  it('Recipes content und prose fuehren die Korrektur', () => {
    const c = JSON.parse(readFileSync(resolve(ROOT, 'data/content-recipe.json'), 'utf-8'));
    expect(c.meta.version).toBe('1.2.1');
    expect(c.meta.changelog[0].changes.join(' ')).toContain('--mod-prose-gutter');
    const p = JSON.parse(readFileSync(resolve(ROOT, 'data/prose-recipe.json'), 'utf-8'));
    expect(p.meta.version).toBe('1.2.1');
    expect(p.meta.changelog[0].version).toBe('1.2.1');
  });
});
