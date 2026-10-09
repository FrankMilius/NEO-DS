#!/usr/bin/env node
// ==========================================================================
// Recipe Lint — CI-Gate fuer Recipe-Dateien
// ==========================================================================
// Validiert alle *-recipe.json Dateien gegen das Canonical v3.1.0 Schema.
// Prueft: Struktur, Cross-Field-Referenzen, Token-Coverage, Specimen-Sanity.
//
// Laeuft als Teil von `npm test` via `npm run lint:recipes`.
// ==========================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
  loadRecipe,
  validateRecipe,
  validateTokenCoverage,
  validateScssParity,
  validateSpecimenSanity,
  validateSpecimenContract
} from '../packages/recipe-sdk/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(__dirname, '..', 'data');
const SCSS_TOKENS_FILE = path.join(__dirname, '..', 'scss', 'scss', '00-settings', '_component-tokens.scss');

// Load JSON Schema + validator for Phase 1
let schema = null;
let validateAgainstSchema = null;
try {
  const schemaPath = path.join(DATA_DIR, 'recipe-schema.json');
  schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validator = require('./validate-recipe-schema.cjs');
  validateAgainstSchema = validator.validateAgainstSchema;
} catch (e) {
  console.error(`  ⚠ Schema/Validator nicht geladen: ${e.message}`);
}

// Discover all recipe files
const recipeFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('-recipe.json') || f.endsWith('-recipes.json'))
  .map(f => path.join(DATA_DIR, f));

// Load token registry
const tokensFile = path.join(DATA_DIR, 'design-tokens.json');
let tokenRegistry = [];
try {
  const tokensData = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
  tokenRegistry = tokensData.components?.groups || tokensData.components || [];
} catch (e) {
  // Abbruch vor jeder Auswertung: Ausnahme statt exit(), Node setzt Exit 1
  // und gibt alles bis hierher Geschriebene vollstaendig aus.
  throw new Error(`Kann design-tokens.json nicht laden: ${e.message}`);
}

// Load SCSS component tokens (for parity check)
let scssContent = '';
try {
  // Alle Komponenten-Token-Dateien (auch _component-tokens-aufgenommen.scss),
  // sonst fehlen z. B. die Searchbar-Tokens scheinbar im SCSS (02.10.2026)
  const settings = path.dirname(SCSS_TOKENS_FILE);
  scssContent = fs.readdirSync(settings)
    .filter(f => /^_component-tokens.*\.scss$/.test(f)).sort()
    .map(f => fs.readFileSync(path.join(settings, f), 'utf8')).join('\n');
} catch (e) {
  console.error(`  ⚠ Kann _component-tokens.scss nicht laden: ${e.message}`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const isStrict = process.argv.includes('--strict');

let totalErrors = 0;
let totalWarnings = 0;
let filesChecked = 0;

console.log('');

for (const filePath of recipeFiles) {
  const fileName = path.basename(filePath);
  let recipe;

  try {
    recipe = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`  ✗ ${fileName}: JSON-Parse-Fehler — ${e.message}`);
    totalErrors++;
    continue;
  }

  const version = recipe.meta?.schemaVersion || recipe.schemaVersion || recipe.version || '1.0.0';
  const component = recipe.meta?.component || recipe.component || fileName.replace(/-recipes?\.json$/, '');

  // Skip legacy recipes with a note
  if (version.startsWith('1.')) {
    console.log(`  ◦ ${fileName} (v${version}, Legacy) — uebersprungen, Migration empfohlen`);
    filesChecked++;
    continue;
  }

  // 1. Structural + cross-field validation (with schema injection)
  const structResult = validateRecipe(recipe, { schema, validateAgainstSchema });

  // 2. Token coverage (against design-tokens.json)
  const normalized = loadRecipe(recipe);
  const coverageResult = validateTokenCoverage(normalized, tokenRegistry);

  // 3. SCSS parity
  const registryComponent = tokenRegistry.find(c => c.id === component);
  let parityResult = { errors: [], warnings: [] };
  if (registryComponent && scssContent) {
    parityResult = validateScssParity(scssContent, registryComponent, component, tokenRegistry);
  }

  // 4. Specimen sanity
  const sanityResult = validateSpecimenSanity(normalized);

  // 5. Specimen contract (cell-level rules + negative specimen expectations)
  const contractResult = validateSpecimenContract(normalized);

  // Aggregate — structural + sanity + contract + parity are always errors,
  // coverage is errors only in --strict mode (otherwise warnings)
  const errors = [
    ...structResult.errors,
    ...sanityResult.errors,
    ...contractResult.errors,
    ...parityResult.errors,
    ...(isStrict ? coverageResult.errors : [])
  ];
  const warnings = [
    ...structResult.warnings,
    ...sanityResult.warnings,
    ...contractResult.warnings,
    ...parityResult.warnings,
    ...coverageResult.warnings,
    ...(isStrict ? [] : coverageResult.errors)
  ];

  totalErrors += errors.length;
  totalWarnings += warnings.length;
  filesChecked++;

  // Output
  if (errors.length === 0 && warnings.length === 0) {
    const allSpecimens = recipe.specimens || [];
    const positiveCount = allSpecimens.filter(s => (s.type || 'positive') === 'positive').length;
    const negativeCount = allSpecimens.filter(s => s.type === 'negative').length;
    const axesCount = Object.keys(normalized.axes || {}).length;
    const negLabel = negativeCount > 0 ? `, ${negativeCount} Negative` : '';
    console.log(`  ✓ ${fileName} (v${version}) — ${axesCount} Achsen, ${positiveCount} Specimens${negLabel}, keine Probleme`);
  } else {
    console.log(`  ${errors.length > 0 ? '✗' : '⚠'} ${fileName} (v${version}):`);
    for (const e of errors) {
      console.log(`    ERROR: ${e}`);
    }
    for (const w of warnings) {
      console.log(`    WARN:  ${w}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('');
console.log('============================================================');
console.log(`Recipe-Lint: ${filesChecked} Dateien geprueft, ${totalErrors} Fehler, ${totalWarnings} Warnungen.`);

// exitCode statt exit(): sonst geht gepufferte Ausgabe ueber Pipes verloren
if (totalErrors > 0) {
  process.exitCode = 1;
}
