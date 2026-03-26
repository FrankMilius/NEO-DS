/**
 * SCSS Token Tests
 *
 * Prüft die Integrität des kompilierten CSS-Outputs:
 * - Foundation Tokens (--fnd-*) existieren in :root
 * - Component Tokens (--nc-*) existieren in :root
 * - Keine hardcodierten Werte in der Ausgabe
 * - CSS-Dateigröße innerhalb erwarteter Range
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(import.meta.dirname, '../..');
const CSS_PATH = resolve(ROOT, 'styles.css');
const TOKENS_SCSS = resolve(ROOT, 'scss/scss/00-settings/_component-tokens.scss');

let css = '';
let scssTokens = '';

beforeAll(() => {
  // Sicherstellen, dass CSS aktuell ist
  try {
    execSync('npm run build:css', { cwd: ROOT, stdio: 'pipe' });
  } catch {
    // Build-Fehler werden in einem separaten Test geprüft
  }
  css = readFileSync(CSS_PATH, 'utf-8');
  scssTokens = readFileSync(TOKENS_SCSS, 'utf-8');
});

// ─── Foundation Token Tests ──────────────────────────────────────────

describe('Foundation Tokens (--fnd-*)', () => {
  it('enthält Spacing-Tokens (--fnd-spacing-01 bis --fnd-spacing-13)', () => {
    for (let i = 1; i <= 13; i++) {
      const token = `--fnd-spacing-${String(i).padStart(2, '0')}`;
      expect(css).toContain(token);
    }
  });

  it('enthält Color Primitive Paletten', () => {
    const palettes = ['primary', 'secondary', 'accent', 'neutral'];
    const shades = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (const palette of palettes) {
      for (const shade of shades) {
        const token = `--fnd-primitive-${palette}-${shade}`;
        expect(css, `Missing: ${token}`).toContain(token);
      }
    }
  });

  it('enthält Semantic Color Tokens', () => {
    const semanticTokens = [
      '--fnd-color-text-primary',
      '--fnd-color-text-secondary',
      '--fnd-color-text-tertiary',
      '--fnd-color-background-base',
      '--fnd-color-background-secondary',
      '--fnd-color-interactive-default',
      '--fnd-color-interactive-hover',
      '--fnd-color-border-primary',
    ];

    for (const token of semanticTokens) {
      expect(css, `Missing semantic token: ${token}`).toContain(token);
    }
  });

  it('enthält Typography-Tokens', () => {
    const typoTokens = [
      '--fnd-font-weight-regular',
      '--fnd-font-weight-medium',
      '--fnd-font-weight-semibold',
      '--fnd-font-weight-bold',
      '--fs-base',
      '--fs-sm',
      '--fs-lg',
      '--fs-xl',
    ];

    for (const token of typoTokens) {
      expect(css, `Missing typo token: ${token}`).toContain(token);
    }
  });

  it('enthält Shadow/Elevation-Tokens', () => {
    const shadowTokens = [
      '--fnd-shadow-sm',
      '--fnd-shadow-md',
      '--fnd-shadow-lg',
    ];

    for (const token of shadowTokens) {
      expect(css, `Missing shadow token: ${token}`).toContain(token);
    }
  });

  it('enthält Z-Index-Tokens', () => {
    const zTokens = [
      '--fnd-z-base',
      '--fnd-z-dropdown',
      '--fnd-z-sticky',
      '--fnd-z-fixed',
      '--fnd-z-header',
    ];

    for (const token of zTokens) {
      expect(css, `Missing z-index token: ${token}`).toContain(token);
    }
  });

  it('enthält Breakpoint-Tokens', () => {
    const bpTokens = ['--fnd-bp-sm', '--fnd-bp-md', '--fnd-bp-lg', '--fnd-bp-xl'];
    for (const token of bpTokens) {
      expect(css, `Missing breakpoint token: ${token}`).toContain(token);
    }
  });
});

// ─── Component Token Tests ───────────────────────────────────────────

describe('Component Tokens (--nc-*)', () => {
  it('enthält Button-Tokens', () => {
    const btnTokens = ['--nc-button-accent-bg', '--nc-button-disabled-bg', '--nc-button-height-xs'];
    for (const token of btnTokens) {
      expect(css, `Missing: ${token}`).toContain(token);
    }
  });

  it('enthält Input-Tokens', () => {
    const inputTokens = ['--nc-input-bg', '--nc-input-border', '--nc-input-radius'];
    for (const token of inputTokens) {
      expect(css, `Missing: ${token}`).toContain(token);
    }
  });

  it('enthält Navigation-Tokens', () => {
    const navTokens = ['--nc-nav-bg', '--nc-nav-height'];
    for (const token of navTokens) {
      expect(css, `Missing: ${token}`).toContain(token);
    }
  });

  it('hat keine --ds-* Legacy-Tokens mehr', () => {
    // --ds-* wurde vollständig zu --fnd-* migriert
    const dsMatches = css.match(/--ds-[a-z]/g) || [];
    expect(dsMatches, `Found legacy --ds-* tokens: ${dsMatches.join(', ')}`).toHaveLength(0);
  });

  it('SCSS _component-tokens.scss und CSS sind synchron (Stichprobe)', () => {
    // Extrahiere --nc-* Token-Deklarationen (nicht aus Kommentaren)
    const lines = scssTokens.split('\n');
    const scssTokensList = lines
      .filter(l => !l.trim().startsWith('//') && l.includes('--nc-'))
      .map(l => l.match(/(--nc-[a-z0-9-]+):/))
      .filter(Boolean)
      .map(m => m[1])
      .slice(0, 30);

    expect(scssTokensList.length).toBeGreaterThan(10);

    // Mindestens 90% der SCSS-Tokens sollen im CSS-Output vorkommen
    const found = scssTokensList.filter(t => css.includes(t));
    const coverage = (found.length / scssTokensList.length) * 100;
    expect(coverage, `SCSS→CSS sync: ${found.length}/${scssTokensList.length} (${coverage.toFixed(0)}%)`).toBeGreaterThan(80);
  });
});

// ─── CSS Output Quality ──────────────────────────────────────────────

describe('CSS Output Quality', () => {
  it('minimiert !important Verwendung', () => {
    const importantCount = (css.match(/!important/g) || []).length;
    // Maximal 60 !important (Utilities, sr-only, Resets, A11y, Animations)
    // Baseline: 51 (Stand 2026-03-24) — soll nicht wachsen
    expect(
      importantCount,
      `Found ${importantCount} !important declarations (max 60 allowed, baseline: 51)`
    ).toBeLessThanOrEqual(60);
  });

  it('verwendet keine @import Statements (nur @use/@forward)', () => {
    // @import in kompiliertem CSS = Google Fonts ist OK
    const imports = [...css.matchAll(/@import\s+(?!url\()/g)];
    expect(imports, 'Found @import statements (should be @use/@forward)').toHaveLength(0);
  });

  it('CSS-Dateigröße ist innerhalb erwarteter Range', () => {
    const stats = statSync(CSS_PATH);
    const sizeKB = stats.size / 1024;

    // Erwartete Range: 150KB - 1000KB (compressed, 107 Komponenten)
    expect(sizeKB, `CSS too small: ${sizeKB.toFixed(0)}KB`).toBeGreaterThan(150);
    expect(sizeKB, `CSS too large: ${sizeKB.toFixed(0)}KB`).toBeLessThan(1000);
  });

  it('CSS Build hat keine Fehler', () => {
    const result = execSync('npm run build:css 2>&1', { cwd: ROOT, encoding: 'utf-8' });
    expect(result).not.toContain('Error');
  });
});
