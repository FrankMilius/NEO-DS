/**
 * Footer mobil: Rechtslinks brechen um (Abschluss Plan v3, 08.10.2026)
 *
 * Befund: Bei 360px Viewport lief der Footer 26px seitlich ueber. Ursache:
 * .nc-footer__legal-links war display:flex OHNE flex-wrap — die Min-Content-
 * Breite der Leiste (Summe aller Rechtslinks + Abstaende, 361px) zog ueber die
 * auto-Spalte des Wurzel-Grids (.nc-footer) den ganzen Footer auf. Bei 320px
 * hielt zusaetzlich white-space:nowrap die Copyright-Zeile auf 310px.
 *
 * Gemessen mit Playwright (data/markup/footer.html im Theme-CSS-Stapel neo_fe):
 *   vorher  320: +64px, 360: +26px, 390: 0
 *   nachher 320/360/390: 0; 768/1280 pixelgleich zu vorher.
 *
 * Dieser Test prueft die Regeln im kompilierten CSS, damit keine flex-Zeile im
 * unteren Footer-Band wieder ohne Umbruch bleibt.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

/** Alle Deklarationsbloecke einer Klasse ausserhalb von @media (Basisregeln). */
function basisRegeln(quelle, klasse) {
  const ohneMedia = quelle.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const re = new RegExp(`(?:^|[},])\\${klasse}\\{([^}]*)\\}`, 'g');
  return [...ohneMedia.matchAll(re)].map((m) => m[1]);
}

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
});

describe('Footer: unteres Band laeuft mobil nicht ueber', () => {
  it('Rechtslinks-Leiste bricht um (flex-wrap: wrap)', () => {
    const regeln = basisRegeln(css, '.nc-footer__legal-links').join(';');
    expect(regeln).toContain('display:flex');
    expect(regeln).toContain('flex-wrap:wrap');
  });

  it('alle flex-Zeilen im unteren Band brechen um', () => {
    for (const klasse of ['.nc-footer__bottom', '.nc-footer__legal', '.nc-footer__legal-links']) {
      expect(basisRegeln(css, klasse).join(';'), klasse).toContain('flex-wrap:wrap');
    }
  });

  it('Copyright bleibt ab Tablet einzeilig, mobil darf es umbrechen', () => {
    expect(basisRegeln(css, '.nc-footer__copyright').join(';')).toContain('white-space:nowrap');
    expect(css).toMatch(/@media\s*\(max-width:\s*767px\)\s*\{\s*\.nc-footer__copyright\{white-space:normal\}/);
  });

  it('Korrektur ohne !important und ohne feste Breiten', () => {
    const scss = readFileSync(resolve(ROOT, 'scss/scss/07-organisms/_footer.scss'), 'utf-8');
    const block = scss
      .slice(scss.indexOf('.nc-footer__legal-links {'), scss.indexOf('.nc-footer__legal-links a {'))
      .replace(/\/\*[\s\S]*?\*\//g, '');
    expect(block).toContain('@include mobile-only');
    expect(block).not.toContain('!important');
    expect(block).not.toMatch(/\d+px/);
  });

  it('Recipe footer fuehrt die Korrektur (2.0.2)', () => {
    const recipe = JSON.parse(readFileSync(resolve(ROOT, 'data/footer-recipe.json'), 'utf-8'));
    expect(recipe.meta.version).toBe('2.0.2');
    expect(recipe.meta.changelog[0].version).toBe('2.0.2');
    expect(recipe.meta.changelog[0].changes.join(' ')).toContain('flex-wrap');
  });
});
