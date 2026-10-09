/**
 * Card-CTA: Knopf im hellen Ton bei dunklem Theme (Restpunkte 09.10.2026,
 * card-cta-knopf)
 *
 * Befund: heller Ton im dunklen Theme — Standard-Knopf des Seitenthemas
 * (#f1f3f1) auf weissem Grund 1,12:1 (WCAG 1.4.11 verlangt 3:1), Ghost-Schrift
 * 1,12:1. Jetzt im hellen Ton die Knopffarben des hellen Themas (Graphit-
 * Leiter wie bruecke-hell), nur in dunklen Kontexten: 14,27:1.
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

const WERTE = '--nc-button-primary-bg:var(--fnd-neutral-900);--nc-button-primary-bg-hover:var(--fnd-neutral-800);--nc-button-primary-bg-active:var(--fnd-neutral-950);--nc-button-primary-color:var(--fnd-neutral-50);--nc-button-ghost-color:var(--fnd-neutral-950);--nc-button-ghost-bg-hover:var(--fnd-neutral-200);--nc-button-ghost-bg-active:var(--fnd-neutral-300)';

describe('Card-CTA: heller Ton im Dunkeln', () => {
  it('dunkler Kontext (Klasse als Vorfahr): Knopffarben des hellen Themas', () => {
    expect(css).toContain(`:is(.neo-dark-theme,.customer-dark-theme) .nc-card-cta[data-theme=light]{${WERTE}}`);
  });

  it('Auto-Dunkel (prefers-color-scheme ohne data-theme) ebenso', () => {
    expect(css).toContain(`@media(prefers-color-scheme: dark){:root:not([data-theme]) .nc-card-cta[data-theme=light]{${WERTE}}}`);
  });

  it('der dunkle Ton und das helle Theme bleiben unberuehrt', () => {
    expect(css).not.toMatch(/\.nc-card-cta\[data-theme=dark\]\{--nc-button/);
    expect(css).not.toMatch(/(^|[},])\.nc-card-cta\[data-theme=light\]\{--nc-button/);
  });
});
