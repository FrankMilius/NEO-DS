#!/usr/bin/env node

/**
 * enhance-recipes.js
 *
 * Phase 2: Recipe als Single Source of Truth stärken
 * Liest component-registry.json und ergänzt jede Recipe JSON um:
 *   - meta.layer (atom | molecule | organism)
 *   - meta.pipeline (Pfade zu SCSS, Story, Arena, Drupal, Docs)
 *   - meta.dependencies (referenzierte Komponenten)
 *
 * Verwendung: node scripts/enhance-recipes.js
 * Voraussetzung: node scripts/generate-component-registry.js (zuerst ausführen)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const REGISTRY_PATH = join(ROOT, 'data/component-registry.json');

if (!existsSync(REGISTRY_PATH)) {
  console.error('✗ component-registry.json nicht gefunden. Zuerst: node scripts/generate-component-registry.js');
  process.exit(1);
}

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));

let updated = 0;
let skipped = 0;
let errors = 0;

for (const [name, entry] of Object.entries(registry.components)) {
  const recipePath = entry.paths.recipe;
  if (!recipePath) {
    skipped++;
    continue;
  }

  const fullPath = join(ROOT, recipePath);
  if (!existsSync(fullPath)) {
    console.warn(`⚠ Datei nicht gefunden: ${recipePath}`);
    errors++;
    continue;
  }

  try {
    const raw = readFileSync(fullPath, 'utf-8');
    const recipe = JSON.parse(raw);

    // meta.layer hinzufügen/aktualisieren
    recipe.meta.layer = entry.layer;

    // meta.pipeline hinzufügen/aktualisieren
    recipe.meta.pipeline = {
      scss: entry.paths.scss,
      story: entry.paths.story,
      arena: entry.paths.arena,
      drupal: entry.paths.drupal,
      docs: entry.paths.docs,
    };

    // meta.dependencies hinzufügen (nur wenn vorhanden)
    if (entry.dependencies && entry.dependencies.length > 0) {
      recipe.meta.dependencies = entry.dependencies;
    } else {
      // Entferne leere Dependencies
      delete recipe.meta.dependencies;
    }

    // Schreiben mit gleicher Formatierung (2 Spaces, trailing newline)
    const output = JSON.stringify(recipe, null, 2) + '\n';

    // Nur schreiben wenn sich etwas geändert hat
    if (output !== raw) {
      writeFileSync(fullPath, output);
      updated++;
    } else {
      skipped++;
    }
  } catch (e) {
    console.error(`✗ Fehler bei ${recipePath}: ${e.message}`);
    errors++;
  }
}

console.log(`✓ Recipe Enhancement abgeschlossen`);
console.log(`  ${updated} aktualisiert | ${skipped} übersprungen | ${errors} Fehler`);
