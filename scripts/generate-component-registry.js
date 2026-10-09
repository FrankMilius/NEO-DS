#!/usr/bin/env node

/**
 * generate-component-registry.js
 *
 * Erzeugt data/component-registry.json — das kanonische Mapping
 * ALLER NEO Design System Artefakte über alle Pipeline-Schichten:
 *
 * - Foundations (Layer 00): Token-Kategorien aus design-tokens.json
 * - Tools (Layer 01): Mixins und Funktionen
 * - Generic (Layer 02): Reset, Fonts, Animations
 * - Elements (Layer 03): HTML-Element-Defaults
 * - Objects (Layer 04): Layout-Primitiven
 * - Components (Layer 05-07): Atoms, Molecules, Organisms
 * - Templates (Layer 08): Seiten-Layouts
 * - Utilities (Layer 10): Hilfsklassen
 *
 * Verwendung: node scripts/generate-component-registry.js
 *             node scripts/generate-component-registry.js --pruefen
 *               (CI: Datei == Erzeugnis, Datumszeile `generated` ausgenommen)
 * Ausgabe:    data/component-registry.json
 *
 * Seit 09.10.2026 (Restpunkte) stimmt der Generator wieder mit der von Hand
 * gepflegten Datei ueberein (Phase 4/5 wurden von Hand nachgetragen, weil der
 * Generator „fremde Drift" erzeugte):
 *   - Arena: die RecipeArena gilt fuer ein Bauteil, sobald es eine Vorlage
 *     apps/theme-configurator/src/arena-templates/<id>.js hat (Plan v3,
 *     Phase 3–5) oder als Alias-Sektion auf ein Recipe zeigt (ALIASE in
 *     useArenaResolver.js). Vorher setzte der Generator alle auf null.
 *   - Objects (04) ohne eigenes Bauteil-SCSS/Story stehen nur unter
 *     `objects`, nicht zusaetzlich als Komponente mit Layer `unknown`.
 *   - Templates tragen paths.recipe (navigation-builder liest es).
 *   - `generated` bleibt stehen, solange sich der Inhalt nicht aendert.
 */

import { readdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, basename, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
// Pfadunabhaengig wie in sync-drupal-css.js: DRUPAL11 wird als GESCHWISTER
// neben WEBSITE26 erwartet. War frueher absolut auf ~/Documents verdrahtet
// und brach beim Umzug der Projekte aus dem iCloud-Ordner.
//
// Seit 09.10.2026: Quelle der Drupal-Templates ist meta.pipeline.drupal der
// Recipes (im Repo, also in CI und lokal gleich). Der Standardpfad zeigte auf
// das Alt-Theme neo_theme und war hier nie vorhanden — jeder Lauf ohne
// Geschwister-Ordner loeschte die Drupal-Zeilen. Ein Theme-Ordner wird nur
// noch gelesen, wenn NEO_DRUPAL_THEME_LEGACY ausdruecklich gesetzt ist.
const DRUPAL_THEME = process.env.NEO_DRUPAL_THEME_LEGACY || null;

// --- Hilfsfunktionen ---

function listFiles(dir, pattern) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => pattern.test(f));
}

function extractName(filename, prefix, suffix) {
  return filename.replace(prefix, '').replace(suffix, '');
}

function toPascalCase(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// --- Pipeline-Scanner ---

function scanRecipes() {
  const dir = join(ROOT, 'data');
  const files = listFiles(dir, /-recipe\.json$/);
  const map = {};
  for (const f of files) {
    const name = extractName(f, '', '-recipe.json');
    map[name] = `data/${f}`;
  }
  return map;
}

function scanLayoutPresets() {
  const dir = join(ROOT, 'data');
  const files = listFiles(dir, /^layout-.*\.json$/).filter(f => !f.includes('schema'));
  const map = {};
  for (const f of files) {
    map[f.replace('.json', '')] = `data/${f}`;
  }
  return map;
}

function scanScss() {
  const layers = [
    { dir: '05-atoms', layer: 'atom' },
    { dir: '06-molecules', layer: 'molecule' },
    { dir: '07-organisms', layer: 'organism' },
  ];
  const map = {};
  for (const { dir, layer } of layers) {
    const fullDir = join(ROOT, 'scss/scss', dir);
    const files = listFiles(fullDir, /^_[^_].*\.scss$/).filter(f => f !== '_index.scss');
    for (const f of files) {
      const name = extractName(f, '_', '.scss');
      if (!map[name]) map[name] = [];
      map[name].push({ path: `scss/scss/${dir}/${f}`, layer });
    }
  }
  return map;
}

function scanScssLayer(dirName, layerName) {
  const dir = join(ROOT, 'scss/scss', dirName);
  const files = listFiles(dir, /^_[^_].*\.scss$/).filter(f => f !== '_index.scss');
  return files.map(f => ({
    name: extractName(f, '_', '.scss'),
    path: `scss/scss/${dirName}/${f}`,
    layer: layerName,
    isGenerated: f.includes('.generated.'),
  }));
}

function scanStories() {
  // Nur Component-Layer Stories (05-07)
  const componentDirs = ['atoms', 'molecules', 'organisms'];
  const map = {};
  for (const layer of componentDirs) {
    const dir = join(ROOT, 'stories', layer);
    const files = listFiles(dir, /\.stories\.js$/);
    for (const f of files) {
      const name = extractName(f, '', '.stories.js');
      map[name] = { path: `stories/${layer}/${f}`, layer };
    }
  }
  return map;
}

function scanAllStories() {
  // Alle Stories inklusive Foundations, Layout, etc.
  const allDirs = ['atoms', 'molecules', 'organisms', 'foundations', 'layout', 'elements', 'utilities', 'templates'];
  const map = {};
  for (const layer of allDirs) {
    const dir = join(ROOT, 'stories', layer);
    const files = listFiles(dir, /\.stories\.js$/);
    for (const f of files) {
      const name = extractName(f, '', '.stories.js');
      map[name] = { path: `stories/${layer}/${f}`, layer };
    }
  }
  return map;
}

// Sektion → Recipe-ID, deren RecipeArena sie zeigt. Spiegel von ALIASE in
// apps/theme-configurator/src/composables/useArenaResolver.js.
const ARENA_ALIASE = { table: 'compare-table' };
const RECIPE_ARENA = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue';

/**
 * Bauteile, die die RecipeArena mit eigener Vorlage zeigt
 * (arena-templates/<id>.js; Dateien mit `_` sind Helfer, index.js die Registry).
 */
function scanRecipeArenaVorlagen() {
  const dir = join(ROOT, 'apps/theme-configurator/src/arena-templates');
  const map = {};
  for (const f of listFiles(dir, /^[^_].*\.js$/)) {
    if (f === 'index.js') continue;
    map[f.replace(/\.js$/, '')] = RECIPE_ARENA;
  }
  for (const sektion of Object.keys(ARENA_ALIASE)) map[sektion] = RECIPE_ARENA;
  return map;
}

function scanArenas() {
  const dir = join(ROOT, 'apps/theme-configurator/src/components/laboratory');
  const files = listFiles(dir, /Arena\.vue$/);
  const map = {};
  for (const f of files) {
    // RecipeArena.vue ist die Arena ALLER Recipes, kein Bauteil „recipe" —
    // bis 07.10.2026 stand sie als Komponente `recipe` (Layer unknown) in
    // der Registry (Inventur Plan v3, Phase 5).
    if (f === 'RecipeArena.vue') continue;
    const pascal = f.replace('Arena.vue', '');
    // PascalCase → kebab-case
    const name = pascal.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    map[name] = `apps/theme-configurator/src/components/laboratory/${f}`;
  }
  // Handgeschriebene *Arena.vue gehen vor, sonst die RecipeArena mit Vorlage
  return { ...scanRecipeArenaVorlagen(), ...map };
}

function scanFoundationEditors() {
  const dir = join(ROOT, 'apps/theme-configurator/src/components/foundation');
  if (!existsSync(dir)) return {};
  const files = listFiles(dir, /\.vue$/);
  const map = {};
  for (const f of files) {
    const pascal = f.replace('.vue', '');
    const name = pascal.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    map[name] = `apps/theme-configurator/src/components/foundation/${f}`;
  }
  return map;
}

function scanDrupal() {
  if (!DRUPAL_THEME) return {};
  const dir = join(DRUPAL_THEME, 'templates/block');
  if (!existsSync(dir)) return {};
  const files = listFiles(dir, /neo.*\.html\.twig$/);
  const map = {};
  for (const f of files) {
    const match = f.match(/--neo-(.+?)\.html\.twig$/);
    if (match) {
      const name = match[1];
      if (!map[name]) map[name] = [];
      map[name].push(f);
    }
  }
  return map;
}

/** Drupal-Templates je Recipe aus meta.pipeline.drupal. */
function scanRecipeDrupal(recipes) {
  const map = {};
  for (const [name, path] of Object.entries(recipes)) {
    try {
      const d = JSON.parse(readFileSync(join(ROOT, path), 'utf-8')).meta?.pipeline?.drupal;
      if (Array.isArray(d) && d.length > 0) map[name] = d;
    } catch { /* kaputtes Recipe meldet lint:recipes */ }
  }
  return map;
}

function scanDocs() {
  const dir = join(ROOT, 'docs');
  const files = listFiles(dir, /-docs\.html$/);
  const map = {};
  for (const f of files) {
    const name = extractName(f, '', '-docs.html');
    map[name] = `docs/${f}`;
  }
  return map;
}

// --- Foundation Token Scanner ---

function scanFoundationTokens() {
  const tokensPath = join(ROOT, 'data/design-tokens.json');
  if (!existsSync(tokensPath)) return [];
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));

  const foundations = [];
  const foundationSection = tokens.foundation || {};

  // Jede Foundation-Kategorie aus design-tokens.json
  for (const [category, data] of Object.entries(foundationSection)) {
    if (category.startsWith('_')) continue; // _configurator etc. überspringen
    foundations.push({
      name: category,
      tokenPath: `foundation.${category}`,
      tokenCount: countTokens(data),
    });
  }

  // Farb-Primitiven und Semantik separat
  if (tokens.primitives) {
    foundations.push({
      name: 'color-primitives',
      tokenPath: 'primitives',
      tokenCount: countTokens(tokens.primitives),
    });
  }
  if (tokens.semantic) {
    foundations.push({
      name: 'color-semantic',
      tokenPath: 'semantic',
      tokenCount: countTokens(tokens.semantic),
    });
  }

  return foundations;
}

function countTokens(obj, depth = 0) {
  if (depth > 6 || typeof obj !== 'object' || obj === null) return 0;
  let count = 0;
  for (const val of Object.values(obj)) {
    if (typeof val === 'string' || typeof val === 'number') {
      count++;
    } else if (typeof val === 'object' && val !== null) {
      count += countTokens(val, depth + 1);
    }
  }
  return count;
}

// --- Layer-Bestimmung ---

function determineLayer(name, scssMap) {
  const scss = scssMap[name];
  if (scss && scss.length > 0) {
    // Höchste Komplexitätsstufe gewinnt
    const priority = { organism: 3, molecule: 2, atom: 1 };
    const sorted = [...scss].sort((a, b) => (priority[b.layer] || 0) - (priority[a.layer] || 0));
    return sorted[0].layer;
  }
  return null;
}

// --- Dependency-Erkennung (aus Recipe anatomy + SCSS @use) ---

function extractDependencies(recipePath, allComponentNames) {
  if (!existsSync(join(ROOT, recipePath))) return [];
  try {
    const recipe = JSON.parse(readFileSync(join(ROOT, recipePath), 'utf-8'));
    const componentName = recipe.meta?.component;
    const deps = new Set();

    // Strategie: Suche nach .nc-{name} Referenzen im gesamten Recipe-Text
    // Nur echte Komponentennamen akzeptieren (müssen in allComponentNames existieren)
    const text = JSON.stringify(recipe);
    const matches = text.match(/\.nc-([a-z][a-z0-9-]*?)(?:__|--|\s|"|\\|\.|\b)/g) || [];
    for (const m of matches) {
      const dep = m.replace(/^\.nc-/, '').replace(/[_\-\s"\\.].*$/, '');
      if (dep && dep !== componentName && dep.length > 1 && allComponentNames.has(dep)) {
        deps.add(dep);
      }
    }

    return [...deps].sort();
  } catch {
    return [];
  }
}

// --- Hauptlogik ---

function generateRegistry() {
  const recipes = scanRecipes();
  const scss = scanScss();
  const stories = scanStories();        // Nur atoms/molecules/organisms
  const allStories = scanAllStories();   // Alle inkl. foundations/layout/etc.
  const arenas = scanArenas();
  const drupalAusRecipes = scanRecipeDrupal(recipes);
  const drupalAusTheme = scanDrupal();
  const drupal = { ...drupalAusRecipes };
  for (const [name, dateien] of Object.entries(drupalAusTheme)) {
    drupal[name] = [...new Set([...(drupal[name] || []), ...dateien])];
  }
  const docs = scanDocs();
  const foundationEditors = scanFoundationEditors();
  const layoutPresets = scanLayoutPresets();

  // Zusätzliche SCSS-Layer scannen
  const settingsFiles = scanScssLayer('00-settings', 'foundation');
  const toolsFiles = scanScssLayer('01-tools', 'tool');
  const genericFiles = scanScssLayer('02-generic', 'generic');
  const elementsFiles = scanScssLayer('03-elements', 'element');
  const objectsFiles = scanScssLayer('04-objects', 'object');
  const templatesFiles = scanScssLayer('08-templates', 'template');
  const utilitiesFiles = scanScssLayer('10-utilities', 'utility');

  // Foundation-Tokens aus design-tokens.json
  const foundationTokens = scanFoundationTokens();

  // Alle einzigartigen Komponentennamen sammeln
  const allNames = new Set([
    ...Object.keys(recipes),
    ...Object.keys(scss),
    ...Object.keys(stories),
    ...Object.keys(arenas),
  ]);

  const registry = {
    $schema: './component-registry-schema.json',
    generated: new Date().toISOString().split('T')[0],
    description: 'Kanonisches Mapping ALLER NEO Design System Artefakte über alle 10 ITCSS-Schichten. AUTO-GENERIERT — nicht manuell bearbeiten. Neu generieren: node scripts/generate-component-registry.js',

    // ========== FOUNDATIONS (Layer 00) ==========
    foundations: {},

    // ========== INFRASTRUCTURE (Layer 01-03) ==========
    infrastructure: {
      tools: [],
      generic: [],
      elements: [],
    },

    // ========== OBJECTS (Layer 04) ==========
    objects: {},

    // ========== COMPONENTS (Layer 05-07) ==========
    components: {},

    // ========== TEMPLATES (Layer 08) ==========
    templates: {},

    // ========== UTILITIES (Layer 10) ==========
    utilities: {},

    // ========== LAYOUT PRESETS ==========
    layoutPresets: {},

    // ========== STATISTIKEN ==========
    stats: {},
    gaps: {},
  };

  // --- Foundations aufbauen ---
  // Mapping: Foundation-Name → SCSS-Datei(en) + Token-Quelle + Docs + Editor
  const foundationDocMap = {
    'color-primitives': 'color',
    'color-semantic': 'theming-architecture',
    typography: 'typography',
    spacing: 'spacing',
    radii: 'radii',
    border: 'border',
    shadow: 'shadow-elevation',
    elevation: 'shadow-elevation',
    opacity: 'opacity-zindex-motion',
    layout: 'layout-architecture',
    breakpoints: 'breakpoints',
    motion: 'opacity-zindex-motion',
    icons: 'icons',
    a11y: 'utility-a11y',
  };

  const foundationScssMap = {
    'color-primitives': ['_color-primitives.scss', '_colors.scss', '_color-functions.scss'],
    'color-semantic': ['_color-semantic.scss', '_color-themes.scss'],
    typography: ['_typography.scss'],
    spacing: ['_spacing.scss'],
    radii: ['_radii.scss'],
    border: ['_border.scss'],
    shadow: ['_shadow.scss'],
    opacity: ['_opacity.scss'],
    layout: ['_layout.scss', '_breakpoints.scss'],
    breakpoints: ['_breakpoints.scss'],
    motion: ['_motion.scss', '_state-mixins.scss'],
    icons: [],
    a11y: ['_a11y.scss'],
    elevation: [],
  };

  const foundationEditorMap = {
    'color-primitives': 'foundation-colors',
    'color-semantic': 'themes-overview',
    typography: 'typography-editor',
    spacing: 'spacing-inspector',
    radii: 'radii-editor',
    border: 'border-editor',
    shadow: 'shadow-editor',
    opacity: 'opacity-zindex-motion-editor',
    layout: 'grid-inspector',
    motion: 'opacity-zindex-motion-editor',
    icons: 'icons-editor',
    a11y: null,
    breakpoints: null,
    elevation: 'shadow-editor',
  };

  for (const ft of foundationTokens) {
    const scssFiles = (foundationScssMap[ft.name] || []).map(f => `scss/scss/00-settings/${f}`);
    const generatedFiles = settingsFiles
      .filter(s => s.isGenerated && s.name.includes(ft.name.replace('color-', '')))
      .map(s => s.path);

    const docName = foundationDocMap[ft.name];
    const editorKey = foundationEditorMap[ft.name];

    registry.foundations[ft.name] = {
      name: ft.name,
      category: 'foundation',
      tokenSource: `data/design-tokens.json → ${ft.tokenPath}`,
      tokenCount: ft.tokenCount,
      paths: {
        scss: scssFiles,
        generatedScss: generatedFiles,
        docs: docName ? docs[docName] || `docs/${docName}-docs.html` : null,
        editor: editorKey ? (foundationEditors[editorKey] || null) : null,
        story: allStories[ft.name]?.path || null,
      },
      coverage: {
        tokenSource: true,
        scss: scssFiles.length > 0,
        generatedScss: generatedFiles.length > 0,
        docs: !!docName && !!docs[docName],
        editor: !!editorKey && !!foundationEditors[editorKey],
        story: !!allStories[ft.name],
      },
    };
  }

  // --- Infrastructure (Layer 01-03) ---
  registry.infrastructure.tools = toolsFiles.map(f => ({
    name: f.name,
    path: f.path,
    docs: docs[f.name] || null,
  }));

  registry.infrastructure.generic = genericFiles.map(f => ({
    name: f.name,
    path: f.path,
    docs: docs[f.name] || null,
  }));

  registry.infrastructure.elements = elementsFiles.map(f => ({
    name: f.name,
    path: f.path,
    docs: docs[f.name] || docs['elements'] || null,
    story: stories[f.name]?.path || null,
  }));

  // --- Objects (Layer 04) ---
  for (const obj of objectsFiles) {
    registry.objects[obj.name] = {
      name: obj.name,
      layer: 'object',
      paths: {
        recipe: recipes[obj.name] || null,
        scss: [obj.path],
        story: stories[obj.name]?.path || null,
        arena: arenas[obj.name] || null,
        docs: docs[obj.name] || null,
      },
      coverage: {
        recipe: !!recipes[obj.name],
        scss: true,
        story: !!stories[obj.name],
        arena: !!arenas[obj.name],
        docs: !!docs[obj.name],
      },
    };
  }

  // --- Muster (Kompositionen ohne eigenes SCSS/Recipe) ---
  // Entscheidung 29.09.2026: form-layout ist eine Komposition aus
  // form-section, form-field, form-actions und validation-summary, keine
  // Komponente. Vorher layer 'unknown' — damit fiel es aus der Konfig-App-
  // Navigation, obwohl es eine Arena hat.
  // Entscheidung 06.10.2026: FormLayoutArena gestrichen — form-layout hat
  // damit weder Arena noch Recipe und faellt aus der Registry; die
  // Komposition zeigt die RecipeArena von `form`. Die Liste bleibt fuer
  // kuenftige Muster.
  const PATTERNS = new Set([]);

  // --- Components (Layer 05-07) ---
  const sortedNames = [...allNames].sort();
  const objectNames = new Set(objectsFiles.map(o => o.name));

  for (const name of sortedNames) {
    const layer = determineLayer(name, scss);
    // Reine Objects (nur 04-objects, kein Bauteil-SCSS, keine Story) stehen
    // unter `objects` — hier kaemen sie nur als Layer `unknown` dazu.
    if (!layer && !stories[name] && objectNames.has(name)) continue;
    const recipePath = recipes[name] || null;
    const dependencies = recipePath ? extractDependencies(recipePath, allNames) : [];

    const entry = {
      name,
      layer: PATTERNS.has(name) ? 'pattern' : layer || (stories[name]?.layer === 'atoms' ? 'atom' : stories[name]?.layer === 'molecules' ? 'molecule' : stories[name]?.layer === 'organisms' ? 'organism' : 'unknown'),
      paths: {
        recipe: recipePath,
        scss: scss[name] ? scss[name].map(s => s.path) : [],
        story: stories[name]?.path || null,
        arena: arenas[name] || null,
        drupal: drupal[name] || [],
        docs: docs[name] || null,
      },
      dependencies: dependencies.length > 0 ? dependencies : undefined,
      coverage: {
        recipe: !!recipePath,
        scss: !!(scss[name] && scss[name].length > 0),
        story: !!stories[name],
        arena: !!arenas[name],
        drupal: !!(drupal[name] && drupal[name].length > 0),
        docs: !!docs[name],
      },
    };

    entry.coverageScore = Object.values(entry.coverage).filter(Boolean).length;
    registry.components[name] = entry;
  }

  // --- Templates (Layer 08) ---
  for (const tmpl of templatesFiles) {
    // Template-Docs haben Prefix "template-"
    const templateDocName = `template-${tmpl.name}`;
    registry.templates[tmpl.name] = {
      name: tmpl.name,
      layer: 'template',
      paths: {
        // Nur Templates, deren Recipe nicht schon als Komponente gefuehrt
        // wird (shell): sonst zeigte der Konfigurator die Sektion doppelt.
        recipe: (!registry.components[tmpl.name] && recipes[tmpl.name]) || null,
        scss: [tmpl.path],
        layoutPreset: layoutPresets[`layout-${tmpl.name}`] || null,
        story: stories[tmpl.name]?.path || stories[templateDocName]?.path || null,
        docs: docs[templateDocName] || docs[tmpl.name] || null,
      },
      coverage: {
        scss: true,
        layoutPreset: !!layoutPresets[`layout-${tmpl.name}`],
        story: !!(stories[tmpl.name] || stories[templateDocName]),
        docs: !!(docs[templateDocName] || docs[tmpl.name]),
      },
    };
  }

  // --- Utilities (Layer 10) ---
  for (const util of utilitiesFiles) {
    const utilDocName = `utility-${util.name}`;
    registry.utilities[util.name] = {
      name: util.name,
      layer: 'utility',
      paths: {
        scss: [util.path],
        docs: docs[utilDocName] || docs[util.name] || null,
        story: stories[util.name]?.path || null,
      },
      coverage: {
        scss: true,
        docs: !!(docs[utilDocName] || docs[util.name]),
        story: !!stories[util.name],
      },
    };
  }

  // --- Layout Presets ---
  for (const [name, path] of Object.entries(layoutPresets)) {
    registry.layoutPresets[name] = {
      name,
      path,
      docs: docs['layout-architecture'] || null,
    };
  }

  // --- Statistiken ---
  const components = Object.values(registry.components);
  const foundations = Object.values(registry.foundations);
  const objects = Object.values(registry.objects);
  const templates = Object.values(registry.templates);
  const utilities = Object.values(registry.utilities);

  registry.stats = {
    components: {
      total: components.length,
      withRecipe: components.filter(c => c.coverage.recipe).length,
      withScss: components.filter(c => c.coverage.scss).length,
      withStory: components.filter(c => c.coverage.story).length,
      withArena: components.filter(c => c.coverage.arena).length,
      withDrupal: components.filter(c => c.coverage.drupal).length,
      withDocs: components.filter(c => c.coverage.docs).length,
    },
    foundations: {
      total: foundations.length,
      withDocs: foundations.filter(f => f.coverage.docs).length,
      withEditor: foundations.filter(f => f.coverage.editor).length,
      withStory: foundations.filter(f => f.coverage.story).length,
    },
    objects: {
      total: objects.length,
      withRecipe: objects.filter(o => o.coverage.recipe).length,
      withDocs: objects.filter(o => o.coverage.docs).length,
      withStory: objects.filter(o => o.coverage.story).length,
    },
    templates: {
      total: templates.length,
      withRecipe: templates.filter(t => t.paths.recipe).length,
      withDocs: templates.filter(t => t.coverage.docs).length,
      withStory: templates.filter(t => t.coverage.story).length,
      withLayoutPreset: templates.filter(t => t.coverage.layoutPreset).length,
    },
    utilities: {
      total: utilities.length,
      withDocs: utilities.filter(u => u.coverage.docs).length,
      withStory: utilities.filter(u => u.coverage.story).length,
    },
    infrastructure: {
      tools: registry.infrastructure.tools.length,
      generic: registry.infrastructure.generic.length,
      elements: registry.infrastructure.elements.length,
    },
    layoutPresets: Object.keys(registry.layoutPresets).length,
    coverageDistribution: {},
  };

  // Coverage-Verteilung (nur Components)
  const coverageDist = {};
  for (const c of components) {
    const score = c.coverageScore;
    coverageDist[`${score}/6`] = (coverageDist[`${score}/6`] || 0) + 1;
  }
  registry.stats.coverageDistribution = coverageDist;

  // --- Lücken ---
  registry.gaps = {
    components: {
      missingRecipe: components.filter(c => !c.coverage.recipe).map(c => c.name),
      missingScss: components.filter(c => !c.coverage.scss).map(c => c.name),
      missingStory: components.filter(c => !c.coverage.story).map(c => c.name),
      missingArena: components.filter(c => !c.coverage.arena).map(c => c.name),
      missingDocs: components.filter(c => !c.coverage.docs).map(c => c.name),
    },
    foundations: {
      missingDocs: foundations.filter(f => !f.coverage.docs).map(f => f.name),
      missingEditor: foundations.filter(f => !f.coverage.editor).map(f => f.name),
      missingStory: foundations.filter(f => !f.coverage.story).map(f => f.name),
    },
    objects: {
      missingRecipe: objects.filter(o => !o.coverage.recipe).map(o => o.name),
      missingDocs: objects.filter(o => !o.coverage.docs).map(o => o.name),
      missingStory: objects.filter(o => !o.coverage.story).map(o => o.name),
    },
    templates: {
      missingDocs: templates.filter(t => !t.coverage.docs).map(t => t.name),
      missingStory: templates.filter(t => !t.coverage.story).map(t => t.name),
    },
    utilities: {
      missingDocs: utilities.filter(u => !u.coverage.docs).map(u => u.name),
    },
  };

  return registry;
}

// --- Ausführung ---

const registry = generateRegistry();
const outPath = join(ROOT, 'data/component-registry.json');
const pruefen = process.argv.includes('--pruefen');

// Datumszeile: bleibt, solange sich sonst nichts aendert — sonst waere jeder
// Tag eine Abweichung (gleiche Regel wie tokens.generated.js im CI).
let bisher = null;
try { bisher = JSON.parse(readFileSync(outPath, 'utf-8')); } catch { /* neu */ }
const ohneDatum = (r) => JSON.stringify({ ...r, generated: null });
const unveraendert = bisher && ohneDatum(bisher) === ohneDatum(registry);
if (unveraendert) registry.generated = bisher.generated;

if (pruefen) {
  if (unveraendert) {
    console.log('✓ data/component-registry.json == Erzeugnis (npm run registry)');
  } else {
    console.error('✗ data/component-registry.json ist veraltet oder von Hand geaendert — `npm run registry` ausfuehren und den Diff pruefen.');
    process.exitCode = 1;
  }
} else {
  writeFileSync(outPath, JSON.stringify(registry, null, 2) + '\n');
}

if (!pruefen) bericht();

function bericht() {
  const s = registry.stats;
  console.log(`✓ Design System Registry generiert: ${outPath}`);
  console.log(`\n  FOUNDATIONS (Layer 00)`);
  console.log(`    ${s.foundations.total} Kategorien | Docs: ${s.foundations.withDocs} | Editor: ${s.foundations.withEditor} | Story: ${s.foundations.withStory}`);
  console.log(`  INFRASTRUCTURE (Layer 01-03)`);
  console.log(`    Tools: ${s.infrastructure.tools} | Generic: ${s.infrastructure.generic} | Elements: ${s.infrastructure.elements}`);
  console.log(`  OBJECTS (Layer 04)`);
  console.log(`    ${s.objects.total} Objekte | Recipe: ${s.objects.withRecipe} | Docs: ${s.objects.withDocs} | Story: ${s.objects.withStory}`);
  console.log(`  COMPONENTS (Layer 05-07)`);
  console.log(`    ${s.components.total} Komponenten | Recipe: ${s.components.withRecipe} | SCSS: ${s.components.withScss} | Story: ${s.components.withStory}`);
  console.log(`    Arena: ${s.components.withArena} | Drupal: ${s.components.withDrupal} | Docs: ${s.components.withDocs}`);
  console.log(`  TEMPLATES (Layer 08)`);
  console.log(`    ${s.templates.total} Templates | Docs: ${s.templates.withDocs} | Story: ${s.templates.withStory} | Layout-Preset: ${s.templates.withLayoutPreset}`);
  console.log(`  UTILITIES (Layer 10)`);
  console.log(`    ${s.utilities.total} Utilities | Docs: ${s.utilities.withDocs} | Story: ${s.utilities.withStory}`);
  console.log(`  LAYOUT PRESETS: ${s.layoutPresets}`);
  console.log(`\n  Coverage (Components): ${JSON.stringify(s.coverageDistribution)}`);

  // Lücken-Zusammenfassung
  const g = registry.gaps;
  const criticalGaps = [];
  if (g.foundations.missingDocs.length > 0) criticalGaps.push(`Foundations ohne Docs: ${g.foundations.missingDocs.join(', ')}`);
  if (g.foundations.missingStory.length > 0) criticalGaps.push(`Foundations ohne Story: ${g.foundations.missingStory.length}/${s.foundations.total}`);
  if (g.objects.missingRecipe.length > 0) criticalGaps.push(`Objects ohne Recipe: ${g.objects.missingRecipe.join(', ')}`);
  if (g.templates.missingStory.length > 0) criticalGaps.push(`Templates ohne Story: ${g.templates.missingStory.length}/${s.templates.total}`);
  if (g.components.missingRecipe.length > 0) criticalGaps.push(`Components ohne Recipe: ${g.components.missingRecipe.join(', ')}`);

  if (criticalGaps.length > 0) {
    console.log(`\n⚠ Kritische Lücken:`);
    for (const gap of criticalGaps) {
      console.log(`  - ${gap}`);
    }
  }
}
