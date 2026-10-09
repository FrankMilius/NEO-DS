#!/usr/bin/env node
// ==========================================================================
// Token Validator: Prueft design-tokens.json gegen das Token-Contract-Schema
// ==========================================================================
// Zero-dependency Validator (kein Ajv noetig). Prueft:
//   1. Strukturelle Vollstaendigkeit (required keys)
//   2. Namenskonventionen (semantic IDs, component IDs)
//   3. Referenz-Integritaet (component ref → semantic token)
//   4. Farbwert-Validierung (hex, rgba, CSS keywords)
//   5. Theme-Vollstaendigkeit (alle 4 Themes in semantic.defaults)
//   6. Duplikat-Pruefung (keine doppelten Token-IDs)
//
// Laeuft als Teil von `npm run tokens:validate`.
// ==========================================================================

const fs = require('fs');
const path = require('path');

// DTCG-Export (P1.2): loest Komponenten-refs auf Foundation-Tokens auf.
// Fehlt er, gelten nur semantische refs — wie bisher.
const DTCG = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/design-tokens.dtcg.json'), 'utf8')); }
  catch { return null; }
})();

const tokensPath = path.resolve(__dirname, '../data/design-tokens.json');

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`  ✗ ERROR: ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ WARN:  ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

// ---------------------------------------------------------------------------
// Load tokens
// ---------------------------------------------------------------------------

let tokens;
try {
  tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
} catch (e) {
  console.error(`\nFailed to load ${tokensPath}:`);
  console.error(e.message);
  // exitCode statt exit: process.exit schneidet gepufferte Ausgabe ueber
  // eine Pipe ab (lint:schwellen las dann keine Schlusszeile, 09.10.2026).
  process.exitCode = 1;
}

if (tokens) pruefen();

function pruefen() {
console.log('Validating design tokens...\n');

// ---------------------------------------------------------------------------
// 1. Structural completeness
// ---------------------------------------------------------------------------

const requiredTopLevel = ['$meta', 'primitives', 'semantic', 'components', 'foundation', 'navigation'];
for (const key of requiredTopLevel) {
  if (!tokens[key]) {
    error(`Missing required top-level key: "${key}"`);
  }
}
if (errors > 0) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Validation FAILED: ${errors} error(s). Fix structural issues first.`);
  process.exitCode = 1;
  return;
}
ok('All required top-level keys present');

// $meta
const meta = tokens.$meta;
if (!meta.name || !meta.version || !meta.description || !meta.last_updated) {
  error('$meta missing required fields (name, version, description, last_updated)');
} else if (!/^\d+\.\d+\.\d+$/.test(meta.version)) {
  error(`$meta.version "${meta.version}" is not valid semver (x.y.z)`);
} else {
  ok(`$meta: ${meta.name} v${meta.version}`);
}

// ---------------------------------------------------------------------------
// 2. Primitives validation
// ---------------------------------------------------------------------------

const prim = tokens.primitives;

// Brand palettes
const requiredBrand = ['primary', 'secondary', 'accent'];
for (const key of requiredBrand) {
  if (!prim.brand || !prim.brand[key]) {
    error(`primitives.brand.${key} missing`);
  } else if (!prim.brand[key].base || !prim.brand[key].label || !prim.brand[key].shades) {
    error(`primitives.brand.${key} missing base/label/shades`);
  }
}
ok('Brand palettes (primary, secondary, accent) present');

// Supporting palettes
if (!prim.supporting || Object.keys(prim.supporting).length === 0) {
  error('primitives.supporting is empty or missing');
} else {
  ok(`Supporting palettes: ${Object.keys(prim.supporting).length} palettes`);
}

// Neutral
// Seit 24.08.2026 steht neutral als Palette unter primitives.system (aus der
// SCSS-Quelle, primitives-aus-quelle.cjs); flach unter primitives war die
// alte Form. generate-tokens.cjs liest beide — der Validator jetzt auch.
const neutral = prim.neutral ?? prim.system?.neutral?.shades;
if (!neutral || Object.keys(neutral).length === 0) {
  error('primitives.neutral / primitives.system.neutral is empty or missing');
} else {
  ok(`Neutral palette: ${Object.keys(neutral).length} steps`);
}

// Foundation
if (!prim.foundation || !prim.foundation.black || !prim.foundation.white) {
  error('primitives.foundation missing black/white');
} else {
  ok('Foundation palettes (black, white) present');
}

// System
const requiredSystem = ['info', 'success', 'warning', 'danger'];
for (const key of requiredSystem) {
  if (!prim.system || !prim.system[key]) {
    error(`primitives.system.${key} missing`);
  }
}
ok('System palettes (info, success, warning, danger) present');

// System text & bg
if (!prim.system_text) error('primitives.system_text missing');
if (!prim.system_bg) error('primitives.system_bg missing');

// ---------------------------------------------------------------------------
// 3. Semantic validation
// ---------------------------------------------------------------------------

const semantic = tokens.semantic;

// Groups
if (!Array.isArray(semantic.groups) || semantic.groups.length === 0) {
  error('semantic.groups is empty or not an array');
} else {
  ok(`Semantic groups: ${semantic.groups.length} groups`);
}

// Collect all semantic token IDs
const allSemanticIds = new Set();
const duplicateSemanticIds = [];

for (const group of semantic.groups) {
  if (!group.id || !group.label || !group.icon || !Array.isArray(group.tokens)) {
    error(`Semantic group missing id/label/icon/tokens: ${JSON.stringify(group)}`);
    continue;
  }

  for (const token of group.tokens) {
    if (!token.id || !token.label) {
      error(`Semantic token missing id/label in group "${group.id}": ${JSON.stringify(token)}`);
      continue;
    }

    // Naming convention: semantic IDs should start with their group prefix
    // (text-*, background-*, border-*, etc.) or be in special groups (layer, on-color)
    const validPrefixes = [group.id + '-'];
    const specialGroups = ['layer', 'on-color'];
    if (!specialGroups.includes(group.id)) {
      const hasValidPrefix = validPrefixes.some(p => token.id.startsWith(p));
      if (!hasValidPrefix) {
        warn(`Semantic token "${token.id}" in group "${group.id}" does not start with "${group.id}-"`);
      }
    }

    if (allSemanticIds.has(token.id)) {
      duplicateSemanticIds.push(token.id);
    }
    allSemanticIds.add(token.id);
  }
}

if (duplicateSemanticIds.length > 0) {
  error(`Duplicate semantic token IDs: ${duplicateSemanticIds.join(', ')}`);
} else {
  ok(`Semantic tokens: ${allSemanticIds.size} unique IDs, no duplicates`);
}

// Defaults — 4 themes
const requiredThemes = ['neo-light', 'neo-dark', 'customer-light', 'customer-dark'];
for (const theme of requiredThemes) {
  if (!semantic.defaults[theme]) {
    error(`semantic.defaults missing theme: "${theme}"`);
  } else {
    const themeKeys = Object.keys(semantic.defaults[theme]);
    // Check that all semantic token IDs have a default in this theme
    const missingInTheme = [];
    for (const id of allSemanticIds) {
      if (!semantic.defaults[theme][id]) {
        missingInTheme.push(id);
      }
    }
    if (missingInTheme.length > 0) {
      warn(`Theme "${theme}" missing defaults for: ${missingInTheme.join(', ')}`);
    }
  }
}
ok(`Semantic defaults: ${requiredThemes.length} themes present`);

// ---------------------------------------------------------------------------
// 4. Component token validation
// ---------------------------------------------------------------------------

const components = tokens.components;

if (!Array.isArray(components.groups) || components.groups.length === 0) {
  error('components.groups is empty or not an array');
} else {
  ok(`Component groups: ${components.groups.length} groups`);
}

const allComponentIds = new Set();
const duplicateComponentIds = [];
let refErrors = 0;

for (const group of components.groups) {
  if (!group.id || !group.label || !group.icon || !Array.isArray(group.tokens)) {
    error(`Component group missing id/label/icon/tokens: ${JSON.stringify(group)}`);
    continue;
  }

  for (const token of group.tokens) {
    if (!token.id || !token.label || !token.type) {
      error(`Component token missing id/label/type in group "${group.id}": ${JSON.stringify(token)}`);
      continue;
    }

    // Naming convention: must start with nc-{component}-
    const expectedPrefix = `nc-${group.id}-`;
    if (!token.id.startsWith(expectedPrefix)) {
      warn(`Component token "${token.id}" should start with "${expectedPrefix}"`);
    }

    // Ref validation: ein ref zeigt auf eine semantische Rolle ODER auf einen
    // Foundation-Token (spacing-03, radius-full, motion-duration-200 …).
    // Ob ein Foundation-ref trifft, weiss der DTCG-Export: dort ist er dann
    // ein aufgeloester Alias, sonst CSS-Text (P1.2b, 29.09.2026).
    if (token.ref) {
      const dtcgWert = DTCG?.components?.[group.id]?.[token.id]?.$value;
      const trifftFoundation = typeof dtcgWert === 'string' && /^\{[^}]+\}$/.test(dtcgWert);
      if (!allSemanticIds.has(token.ref) && !trifftFoundation) {
        error(`Component token "${token.id}" ref "${token.ref}" does not match any semantic token ID`);
        refErrors++;
      }
    }

    // Must have either ref or default
    if (!token.ref && !token.default && token.default !== 0) {
      warn(`Component token "${token.id}" has neither ref nor default value`);
    }

    if (allComponentIds.has(token.id)) {
      duplicateComponentIds.push(token.id);
    }
    allComponentIds.add(token.id);
  }
}

if (duplicateComponentIds.length > 0) {
  error(`Duplicate component token IDs: ${duplicateComponentIds.join(', ')}`);
} else {
  ok(`Component tokens: ${allComponentIds.size} unique IDs, no duplicates`);
}

if (refErrors === 0) {
  ok('All component token refs resolve to valid semantic token IDs');
}

// ---------------------------------------------------------------------------
// 5. Foundation validation
// ---------------------------------------------------------------------------

const fnd = tokens.foundation;
const requiredFoundation = ['typography', 'spacing', 'radii', 'border', 'shadow', 'elevation', 'layout', 'breakpoints', 'motion', 'icons', 'a11y'];
const missingFoundation = requiredFoundation.filter(k => !fnd[k]);
if (missingFoundation.length > 0) {
  error(`Foundation missing sections: ${missingFoundation.join(', ')}`);
} else {
  ok(`Foundation: ${requiredFoundation.length} sections present`);
}

// Typography
if (fnd.typography) {
  if (!fnd.typography.fonts || !fnd.typography.fonts.body || !fnd.typography.fonts.heading || !fnd.typography.fonts.mono) {
    error('foundation.typography.fonts missing body/heading/mono');
  }
  if (!fnd.typography.fluid) {
    error('foundation.typography.fluid missing');
  }
}

// Spacing
if (fnd.spacing) {
  if (!fnd.spacing.base_unit || !fnd.spacing.scale) {
    error('foundation.spacing missing base_unit or scale');
  }
}

// ---------------------------------------------------------------------------
// 6. Navigation validation
// ---------------------------------------------------------------------------

const nav = tokens.navigation;
if (!Array.isArray(nav) || nav.length === 0) {
  error('navigation is empty or not an array');
} else {
  let navNodes = 0;
  for (const node of nav) {
    if (!node.id || !node.label || !node.icon) {
      error(`Navigation node missing id/label/icon: ${JSON.stringify(node)}`);
    }
    if (node.children) {
      navNodes += node.children.length;
      for (const child of node.children) {
        if (!child.id || !child.label) {
          error(`Navigation child missing id/label in "${node.id}": ${JSON.stringify(child)}`);
        }
      }
    }
  }
  ok(`Navigation: ${nav.length} top-level nodes, ${navNodes} children`);
}

// ---------------------------------------------------------------------------
// 7. Color value validation (spot check)
// ---------------------------------------------------------------------------

const colorPattern = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|transparent|inherit|currentColor|none)$/;

function validateColorValues(obj, path) {
  if (typeof obj === 'string') {
    if (path.includes('shade') || path.includes('base') || path.endsWith('bg') || path.endsWith('color')) {
      if (!colorPattern.test(obj.trim())) {
        // Don't flag CSS variable references, font stacks, or non-color values
        if (!obj.startsWith('var(') && !obj.includes(',') && !obj.includes('px') && !obj.includes('rem')) {
          warn(`Possible invalid color at ${path}: "${obj}"`);
        }
      }
    }
    return;
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const [key, val] of Object.entries(obj)) {
      validateColorValues(val, `${path}.${key}`);
    }
  }
}

// Validate semantic defaults colors
for (const [theme, defaults] of Object.entries(semantic.defaults)) {
  for (const [id, value] of Object.entries(defaults)) {
    if (!colorPattern.test(value.trim())) {
      warn(`Invalid color in semantic.defaults.${theme}.${id}: "${value}"`);
    }
  }
}
ok('Semantic default color values validated');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n' + '='.repeat(60));
if (errors === 0) {
  if (warnings > 0) {
    console.log(`Token validation PASSED with ${warnings} warning(s).`);
  } else {
    console.log('Token validation PASSED. No issues found.');
  }
} else {
  console.log(`Token validation FAILED: ${errors} error(s), ${warnings} warning(s).`);
  process.exitCode = 1;
}
}
