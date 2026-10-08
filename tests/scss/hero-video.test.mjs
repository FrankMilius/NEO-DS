/**
 * Hero mit Video als Medium: 16:9 (Entscheidung Abschluss 2, 08.10.2026)
 *
 * Befund: Das Twig (neo_fe block--block-content--neo-hero) legt das iframe in
 * die Huelle .nc-video — dieselbe Klasse wie die Video-Section, die daraus ein
 * zweispaltiges Raster ohne Hoehe macht. Das iframe ist absolut positioniert
 * und gibt keine Hoehe ab: Das Video war im Hero 0 px hoch.
 *
 * Gemessen mit Playwright (Twig-Markup + Theme-CSS-Stapel neo_fe):
 *   vorher  375: 343×0, 768: 714×0, 1280: 551×0 px (Huelle und iframe)
 *   nachher 375: 343×193, 768: 714×402, 1280: 551×310 px
 *   Split unveraendert (Spaltenhoehe, min. 420 px); Hero ohne Video pixelgleich.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

/** Deklarationen aller Regeln mit genau diesem Selektor (ausserhalb @media). */
function regeln(quelle, selektor) {
  const ohneMedia = quelle.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const esc = selektor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[},])${esc}\\{([^}]*)\\}`, 'g');
  return [...ohneMedia.matchAll(re)].map((m) => m[1]).join(';');
}

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
}, 60000);

describe('Hero-Video: Seitenverhaeltnis', () => {
  it('Huelle im Hero ist Block mit 16:9 und Bezugsrahmen des iframes', () => {
    const h = regeln(css, '.nc-hero__media .nc-video');
    expect(h).toContain('display:block');
    expect(h).toContain('position:relative');
    expect(h).toContain('aspect-ratio:var(--fnd-media-ratio-16-9)');
    expect(h).not.toContain('!important');
  });

  it('Split fuellt weiter die Spaltenhoehe — ohne Seitenverhaeltnis', () => {
    expect(regeln(css, '.nc-hero--split .nc-video')).toContain('aspect-ratio:auto');
    // Reihenfolge: Split-Regel steht nach der Hero-Huelle und gewinnt.
    expect(css.indexOf('.nc-hero--split .nc-video{aspect-ratio:auto')).toBeGreaterThan(css.indexOf('.nc-hero__media .nc-video{'));
  });

  it('Recipe fuehrt die Korrektur', () => {
    const r = JSON.parse(readFileSync(resolve(ROOT, 'data/hero-recipe.json'), 'utf-8'));
    expect(r.meta.version).toBe('2.3.1');
    expect(r.meta.changelog[0].version).toBe('2.3.1');
    expect(r.meta.changelog[0].changes.join(' ')).toContain('16:9');
  });
});
