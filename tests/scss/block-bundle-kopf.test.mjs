/**
 * Block-Bundle ohne Bloecke: kein zusaetzlicher Abstand unter dem Kopf
 * (Entscheidung Abschluss 08.10.2026)
 *
 * Befund: Ein Bundle nur mit Kopf (Kapitelueberschrift) behielt den Abstand
 * unter dem Kopf (spacing-09) zusaetzlich zur Section-Polsterung. Das Theme
 * (block--*--neo-block-bundle.html.twig) rendert __items nur mit Bloecken —
 * der Kopf ist dann das letzte Kind.
 *
 * Gemessen (Playwright, Theme-CSS-Stapel), Abstand Kopf-Unterkante bis
 * Section-Ende: 1280px 94 → 51px, 375px 68 → 32px. Mit Bloecken pixelgleich.
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

describe('Block-Bundle: Kopf als letztes Kind', () => {
  it('Kopf als letztes Kind hat keinen Abstand nach unten', () => {
    expect(css).toMatch(/\.nc-block-bundle__header:last-child\{margin-block-end:0\}/);
  });

  it('der Abstand zu den Bloecken bleibt (spacing-09)', () => {
    expect(css).toMatch(/\.nc-block-bundle__header\{[^}]*margin-bottom:var\(--fnd-spacing-09/);
  });

  it('die Ausnahme steht nach der Grundregel', () => {
    expect(css.indexOf('.nc-block-bundle__header:last-child')).toBeGreaterThan(css.indexOf('.nc-block-bundle__header{'));
  });

  it('Recipe block-bundle fuehrt die Korrektur (1.1.1)', () => {
    const r = JSON.parse(readFileSync(resolve(ROOT, 'data/block-bundle-recipe.json'), 'utf-8'));
    expect(r.meta.version).toBe('1.1.1');
    expect(r.meta.changelog[0].changes.join(' ')).toContain(':last-child');
  });
});
