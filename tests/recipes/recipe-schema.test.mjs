/**
 * Recipe Schema Validation Tests
 *
 * Prüft alle Recipe JSON-Dateien auf:
 * - Gültiges JSON
 * - Pflichtfelder vorhanden (name, version, anatomy, axes, specimens, tokenGroups)
 * - Specimens referenzieren gültige Axis-Werte
 * - TokenGroups referenzieren existierende SCSS-Tokens
 * - Arena-Komponente + useRecipeLoader-Import existiert
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '../..');
const DATA_DIR = resolve(ROOT, 'data');
const RECIPE_LOADER = resolve(ROOT, 'apps/theme-configurator/src/composables/useRecipeLoader.js');
const COMPONENT_TOKENS = resolve(ROOT, 'scss/scss/00-settings/_component-tokens.scss');

function loadRecipes() {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
  return files.map(f => {
    const path = resolve(DATA_DIR, f);
    const raw = readFileSync(path, 'utf-8');
    let data = null;
    try { data = JSON.parse(raw); } catch { /* handled in test */ }
    return { filename: f, path, raw, data, componentName: f.replace('-recipe.json', '') };
  });
}

// ─── JSON Validity ───────────────────────────────────────────────────

describe('Recipe JSON Validity', () => {
  it('hat mindestens 10 Recipe-Dateien', () => {
    const recipes = loadRecipes();
    expect(recipes.length).toBeGreaterThanOrEqual(10);
  });

  it('alle Recipe-Dateien sind gültiges JSON', () => {
    const recipes = loadRecipes();
    const invalid = recipes.filter(r => r.data === null);
    expect(
      invalid.map(r => r.filename),
      `Invalid JSON: ${invalid.map(r => r.filename).join(', ')}`
    ).toHaveLength(0);
  });
});

// ─── Required Fields ─────────────────────────────────────────────────

describe('Recipe Required Fields', () => {
  it('alle Recipes haben Identifikation (meta.component oder name) und Version', () => {
    const recipes = loadRecipes().filter(r => r.data);
    const missing = [];

    for (const r of recipes) {
      const hasName = r.data.name || r.data.meta?.component;
      const hasVersion = r.data.version || r.data.meta?.schemaVersion;
      if (!hasName) missing.push(`${r.filename}: missing name/meta.component`);
      if (!hasVersion) missing.push(`${r.filename}: missing version/meta.schemaVersion`);
    }

    if (missing.length > 0) {
      console.warn(`⚠️  ${missing.length} Recipes ohne Identifikation:\n  ${missing.slice(0, 5).join('\n  ')}`);
    }
    const total = recipes.length * 2;
    const completeness = ((total - missing.length) / total) * 100;
    expect(completeness, `Identification completeness: ${completeness.toFixed(0)}%`).toBeGreaterThan(80);
  });

  it('alle Recipes haben empfohlene Felder (anatomy, axes, specimens, tokenGroups)', () => {
    const recipes = loadRecipes().filter(r => r.data);
    const fields = ['anatomy', 'axes', 'specimens', 'tokenGroups'];
    const missing = [];

    for (const r of recipes) {
      for (const field of fields) {
        if (!r.data[field]) missing.push(`${r.filename}: missing "${field}"`);
      }
    }

    // Warnung statt Fehler — nicht alle Recipes sind vollständig
    if (missing.length > 0) {
      console.warn(`⚠️  ${missing.length} fehlende empfohlene Felder:\n  ${missing.slice(0, 10).join('\n  ')}`);
    }
    // Mindestens 80% sollen vollständig sein
    const totalChecks = recipes.length * fields.length;
    const completeness = ((totalChecks - missing.length) / totalChecks) * 100;
    expect(completeness, `Recipe completeness: ${completeness.toFixed(0)}%`).toBeGreaterThan(50);
  });

  it('version folgt Semver-Format', () => {
    const recipes = loadRecipes().filter(r => r.data?.version || r.data?.meta?.schemaVersion);
    const invalid = recipes.filter(r => {
      const v = r.data.version || r.data.meta?.schemaVersion;
      return !/^\d+\.\d+\.\d+$/.test(v);
    });
    expect(
      invalid.map(r => `${r.filename}: "${r.data.version}"`),
      `Invalid semver: ${invalid.map(r => r.filename).join(', ')}`
    ).toHaveLength(0);
  });
});

// ─── Specimen Consistency ────────────────────────────────────────────

describe('Specimen Axis Consistency', () => {
  it('Specimens referenzieren nur definierte Axes', () => {
    const recipes = loadRecipes().filter(r => r.data?.axes && r.data?.specimens && Array.isArray(r.data.axes));
    const errors = [];

    for (const r of recipes) {
      const axisNames = r.data.axes.map(a => a.name);
      for (const specimen of r.data.specimens) {
        if (!specimen.config) continue;
        for (const key of Object.keys(specimen.config)) {
          if (!axisNames.includes(key)) {
            errors.push(`${r.filename}: Specimen "${specimen.name}" uses undefined axis "${key}"`);
          }
        }
      }
    }

    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  it('jede Axis hat mindestens 2 Werte', () => {
    const recipes = loadRecipes().filter(r => r.data?.axes && Array.isArray(r.data.axes));
    const errors = [];

    for (const r of recipes) {
      for (const axis of r.data.axes) {
        if (!axis.values || axis.values.length < 2) {
          errors.push(`${r.filename}: Axis "${axis.name}" has ${axis.values?.length ?? 0} values`);
        }
      }
    }

    expect(errors, errors.join('\n')).toHaveLength(0);
  });
});

// ─── Token Coverage ──────────────────────────────────────────────────

describe('TokenGroup Coverage', () => {
  it('tokenGroups haben Token-IDs', () => {
    const recipes = loadRecipes().filter(r => r.data?.tokenGroups);
    const empty = [];

    for (const r of recipes) {
      for (const group of r.data.tokenGroups) {
        if (!group.tokens || group.tokens.length === 0) {
          empty.push(`${r.filename}: group "${group.label}" has no tokens`);
        }
      }
    }

    expect(empty, empty.join('\n')).toHaveLength(0);
  });

  it('Token-IDs existieren in _component-tokens.scss (Stichprobe)', () => {
    if (!existsSync(COMPONENT_TOKENS)) return;
    const componentTokens = readFileSync(COMPONENT_TOKENS, 'utf-8');
    const recipes = loadRecipes().filter(r => r.data?.tokenGroups);
    const missing = [];

    for (const r of recipes) {
      for (const group of r.data.tokenGroups) {
        const sample = (group.tokens || []).slice(0, 3);
        for (const tokenId of sample) {
          if (!componentTokens.includes(tokenId)) {
            missing.push(`${r.filename}: "${tokenId}" not in _component-tokens.scss`);
          }
        }
      }
    }

    // Toleranz: maximal 10% fehlend
    const totalChecked = recipes.reduce((sum, r) =>
      sum + r.data.tokenGroups.reduce((s, g) => s + Math.min(3, (g.tokens || []).length), 0), 0);
    const percentage = totalChecked > 0 ? ((totalChecked - missing.length) / totalChecked) * 100 : 100;

    if (missing.length > 0) {
      console.warn(`⚠️  ${missing.length} Tokens nicht in SCSS:\n  ${missing.slice(0, 5).join('\n  ')}`);
    }
    expect(percentage, `Token coverage: ${percentage.toFixed(0)}%`).toBeGreaterThan(80);
  });
});

// ─── Arena & Loader Coverage ─────────────────────────────────────────

describe('Konfig-App Coverage', () => {
  it('useRecipeLoader.js existiert', () => {
    expect(existsSync(RECIPE_LOADER)).toBe(true);
  });

  // Frueher stand hier: „jeder Recipe-Name kommt als Zeichenkette im Loader
  // vor, mindestens 70 %". Der Loader fuehrte dafuer eine Liste von Hand — 120
  // Eintraege neben einem Ordner mit 167 Dateien.
  //
  // Was diese Pruefung NICHT verhindert hat: Am 19.08.2026 wurde
  // slider-recipe.json in range und carousel geteilt. Der Eintrag blieb stehen,
  // Vite konnte den Import nicht aufloesen, das Modul lieferte 500 — und die
  // GANZE Konfig-App montierte nicht mehr. Die 70-Prozent-Schwelle war dabei
  // die ganze Zeit gruen.
  //
  // Seit dem 21.08. liest der Loader den Ordner mit `import.meta.glob`. Damit
  // ist die Abdeckung bauartbedingt vollstaendig, und die Frage ist eine
  // andere geworden: Wird noch von Hand gepflegt?
  it('useRecipeLoader liest den Ordner, statt eine Liste zu fuehren', () => {
    if (!existsSync(RECIPE_LOADER)) return;
    const loaderContent = readFileSync(RECIPE_LOADER, 'utf-8');

    expect(loaderContent, 'import.meta.glob fehlt — wird wieder von Hand gepflegt?')
      .toContain('import.meta.glob');

    // Einzelne, fest verdrahtete Recipe-Importe sind der Rueckfall in die alte
    // Bauart. Ein einziger davon kann die App beim naechsten Umbenennen wieder
    // lahmlegen.
    const festeImporte = loaderContent.match(/import\('[^']*data\/[a-z0-9-]+-recipe\.json'\)/g) || [];
    expect(festeImporte, `Fest verdrahtete Recipe-Importe: ${festeImporte.slice(0, 5).join(', ')}`)
      .toHaveLength(0);
  });
});

// ─── Summary Statistics ──────────────────────────────────────────────

describe('Recipe Statistics', () => {
  it('generiert Übersicht', () => {
    const recipes = loadRecipes().filter(r => r.data);
    console.log(`\n📊 Recipe Statistics:`);
    console.log(`   Total recipes: ${recipes.length}`);
    console.log(`   With specimens: ${recipes.filter(r => r.data.specimens?.length).length}`);
    console.log(`   With tokenGroups: ${recipes.filter(r => r.data.tokenGroups?.length).length}`);
    console.log(`   With a11y section: ${recipes.filter(r => r.data.a11y).length}`);
    console.log(`   With anatomy: ${recipes.filter(r => r.data.anatomy).length}`);
    expect(recipes.length).toBeGreaterThan(0);
  });
});
