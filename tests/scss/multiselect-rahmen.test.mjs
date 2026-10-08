/**
 * Multiselect: Rahmen des Knopfs wie .nc-input (Entscheidung Abschluss 2, 08.10.2026)
 *
 * Befund: Der Knopf hatte border-secondary (hell 1,13:1), das Eingabefeld
 * daneben 3,72-4,18:1. Jetzt zeigen --nc-multiselect-trigger-border-* auf die
 * --nc-input-*-Tokens (Ruhe, Hover, Fokus, Fehler, deaktiviert; hell und
 * dunkel folgen damit dem Eingabefeld).
 *
 * Gemessen (Formular-Markup neo_fe, Theme-CSS-Stapel), Rand gegen Umgebung:
 *   Ruhe hell 1,13 -> 4,18:1, dunkel 1,79 -> 3,83:1 (= .nc-input)
 *   Hover/Fokus/Fehler/deaktiviert in hell und dunkel = .nc-input
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

function regeln(quelle, selektor) {
  const ohneMedia = quelle.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const esc = selektor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[},])${esc}\\{([^}]*)\\}`, 'g');
  return [...ohneMedia.matchAll(re)].map((m) => m[1]).join(';');
}

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
}, 60000);

describe('Multiselect: Rahmen wie das Eingabefeld', () => {
  it('Component-Tokens zeigen auf die Eingabefeld-Tokens', () => {
    const erwartet = {
      'border-width': 'var(--nc-input-border-width)',
      border: 'var(--nc-input-border)',
      'border-hover': 'var(--nc-input-border-hover)',
      'border-focus': 'var(--nc-input-border-focus)',
      'border-error': 'var(--nc-input-border-error)',
      'border-disabled': 'var(--nc-input-disabled-border)',
    };
    for (const [k, v] of Object.entries(erwartet)) expect(css).toContain(`--nc-multiselect-trigger-${k}: ${v}`);
  });

  it('Knopf nutzt nur die Tokens — kein border-secondary, keine festen Werte', () => {
    const ruhe = regeln(css, '.nc-multiselect__trigger');
    expect(ruhe).toContain('border:var(--nc-multiselect-trigger-border-width) solid var(--nc-multiselect-trigger-border)');
    expect(ruhe).not.toContain('border-secondary');
    expect(regeln(css, ".nc-multiselect__trigger:hover:not(:disabled):not([aria-disabled=true]):not([aria-invalid=true]):not(:focus-visible)")).toBe('border-color:var(--nc-multiselect-trigger-border-hover)');
    expect(regeln(css, '.nc-multiselect__trigger:focus-visible')).toContain('border-color:var(--nc-multiselect-trigger-border-focus)');
    expect(css).toMatch(/\.nc-multiselect__trigger\[aria-invalid=true\],\.nc-multiselect__trigger\[aria-invalid=true\]:hover,\.nc-multiselect__trigger\[aria-invalid=true\]:focus-visible\{border-color:var\(--nc-multiselect-trigger-border-error\)\}/);
    expect(css).toMatch(/\.nc-multiselect__trigger:disabled,\.nc-multiselect__trigger\[aria-disabled=true\]\{border-color:var\(--nc-multiselect-trigger-border-disabled\)\}/);
  });

  it('Recipe und Token-Register fuehren die Tokens', () => {
    const r = JSON.parse(readFileSync(resolve(ROOT, 'data/multiselect-recipe.json'), 'utf-8'));
    expect(r.meta.version).toBe('1.5.1');
    expect(r.meta.changelog[0].changes.join(' ')).toContain('Freigabe ausstehend');
    expect(r.styling.tokens).toContain('--nc-multiselect-trigger-border-error');
    const reg = readFileSync(resolve(ROOT, 'data/design-tokens.json'), 'utf-8');
    expect(reg).toContain('"nc-multiselect-trigger-border-disabled"');
  });
});
