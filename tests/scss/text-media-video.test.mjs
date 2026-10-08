/**
 * Text + Medium mit Video: 16:9 und Rahmenschatten (Entscheidung Abschluss 08.10.2026)
 *
 * Befund: Auf der Website war das Video im Text-Media-Block nur 2 px hoch
 * (Rahmenkante), das iframe 0 px. Ursache: Video-Section und Medien-Huelle
 * tragen dieselbe Klasse .nc-video; `.nc-video { padding: 0 !important }` aus
 * _video-section.scss schaltete den padding-bottom-Trick im Text-Media ab.
 * Ausserdem ueberschrieb `.nc-text-media .nc-video` den Schatten aus
 * .nc-media-frame, auch bei prefers-contrast: more.
 *
 * Gemessen mit Playwright (Twig-Markup text-media + Theme-CSS-Stapel neo_fe):
 *   vorher  1280: 551×2 px, 375: 343×2 px; Schatten shadow-md auch bei Kontrast
 *   nachher 1280: 551×312 px, 375: 343×195 px; frame = media-frame-Schatten,
 *           Kontrast = kein Schatten, none = kein Schatten.
 *   Video-Section, Hero, Feature-Liste pixelgleich.
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
}, 60000); // Sass-Vollbuild braucht unter Last laenger als die 10s-Vorgabe

describe('Text-Media-Video: Seitenverhaeltnis und Rahmen', () => {
  it('kein padding-!important mehr an .nc-video', () => {
    expect(regeln(css, '.nc-video')).not.toMatch(/padding:[^;]*!important/);
    expect(css).not.toMatch(/\.nc-video\{[^}]*padding:0\s*!important/);
  });

  it('16:9 ueber genau einen padding-Trick (kein doppeltes padding-top)', () => {
    const huelle = regeln(css, '.nc-text-media .nc-video');
    expect(huelle).toContain('padding-bottom:var(--nc-text-media-nc-video-padding-bottom)');
    expect(huelle).toContain('height:0');
    expect(regeln(css, '.nc-text-media__media .nc-video')).not.toContain('padding-top');
  });

  it('Text-Media ueberschreibt den Schatten von .nc-media-frame nicht', () => {
    expect(regeln(css, '.nc-text-media .nc-video')).not.toContain('box-shadow');
    expect(regeln(css, '.nc-text-media__media .nc-video')).not.toContain('box-shadow');
    expect(css).toMatch(/@media\s*\(prefers-contrast:\s*more\)\s*\{\s*\.nc-media-frame\{[^}]*box-shadow:none/);
  });

  it('Recipes fuehren die Korrektur', () => {
    const tm = JSON.parse(readFileSync(resolve(ROOT, 'data/text-media-recipe.json'), 'utf-8'));
    expect(tm.meta.version).toBe('1.1.2');
    expect(tm.meta.changelog[0].version).toBe('1.1.2');
    const vs = JSON.parse(readFileSync(resolve(ROOT, 'data/video-section-recipe.json'), 'utf-8'));
    expect(vs.meta.version).toBe('1.2.1');
    expect(vs.meta.changelog[0].changes.join(' ')).toContain('!important');
  });
});
