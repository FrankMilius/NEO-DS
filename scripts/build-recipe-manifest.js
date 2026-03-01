#!/usr/bin/env node
// ==========================================================================
// Build Recipe Manifest — Kompaktes Manifest aller Recipe-Dateien
// ==========================================================================
// Liest alle data/*-recipe.json und erzeugt data/recipe-manifest.json
// mit Metadaten fuer Dashboard, Suche und Cross-Links.
//
// Nutzung:
//   node scripts/build-recipe-manifest.js
// ==========================================================================

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT = path.join(DATA_DIR, 'recipe-manifest.json');

// Alle *-recipe.json Dateien finden (nicht card-recipes.json legacy)
const files = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('-recipe.json') && f !== 'recipe-schema.json')
  .sort();

const manifest = files.map(file => {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const meta = raw.meta || {};
  const axes = raw.axes || {};
  const states = raw.states || {};
  const specimens = raw.specimens || [];
  const styling = raw.styling || {};
  const a11y = raw.a11y || {};

  // Token-Anzahl zaehlen
  const tokenGroups = styling.tokenGroups || {};
  let tokenCount = 0;
  Object.values(tokenGroups).forEach(group => {
    if (group.tokens) tokenCount += group.tokens.length;
  });

  // Achsen-Details
  const axesSummary = {};
  Object.keys(axes).forEach(key => {
    const axis = axes[key];
    axesSummary[key] = {
      label: axis.label || key,
      values: Object.keys(axis.values || {})
    };
  });

  return {
    file: file,
    component: meta.component || file.replace('-recipe.json', ''),
    version: meta.version || '?',
    schemaVersion: meta.schemaVersion || '?',
    status: meta.status || 'unknown',
    tags: meta.tags || [],
    axesCount: Object.keys(axes).length,
    axes: axesSummary,
    statesSupported: states.supported || [],
    interactive: !!states.interactive,
    specimensCount: specimens.length,
    tokenGroupsCount: Object.keys(tokenGroups).length,
    tokenCount: tokenCount,
    hasTokens: tokenCount > 0,
    contrastTarget: (a11y.base && a11y.base.contrastTarget) || null,
    docsLink: meta.links && meta.links.docs ? meta.links.docs : null
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Recipe-Manifest: ${manifest.length} Recipes → ${OUTPUT}`);
console.log(`  Stable: ${manifest.filter(m => m.status === 'stable').length}`);
console.log(`  Draft:  ${manifest.filter(m => m.status === 'draft').length}`);
console.log(`  Mit Tokens: ${manifest.filter(m => m.hasTokens).length}`);
console.log(`  Lean (ohne Tokens): ${manifest.filter(m => !m.hasTokens).length}`);
