#!/usr/bin/env node
// ==========================================================================
// Build Search Index — Generiert docs-search-index.json
// ==========================================================================
// Liest docs/_pages.json und reichert Komponentenseiten mit Keywords
// aus den zugehoerigen Recipe-Dateien an (Achsen, States, Tags).
//
// Nutzung:
//   node scripts/build-search-index.js
// ==========================================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_FILE = path.join(ROOT, 'docs', '_pages.json');
const DATA_DIR = path.join(ROOT, 'data');
const OUTPUT = path.join(DATA_DIR, 'docs-search-index.json');

const pages = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));

// Sidebar-Group zu Section-Label Mapping
function getSection(page) {
  if (page.sidebarGroup) return page.sidebarGroup;
  if (page.category === 'guides') return 'Guides';
  if (page.category === 'foundation') return 'Foundation';
  if (page.category === 'templates') return 'Templates';
  return 'Home';
}

// Keywords aus Seiten-Titel und Description extrahieren
function extractBaseKeywords(page) {
  var words = new Set();
  var slug = page.slug;

  // Slug-Parts
  slug.split('-').forEach(function (w) { if (w.length > 2) words.add(w); });

  // Kategorie
  if (page.category) words.add(page.category);

  // Sidebargroup
  if (page.sidebarGroup) {
    page.sidebarGroup.toLowerCase().split(/\s+/).forEach(function (w) {
      if (w.length > 2) words.add(w);
    });
  }

  // Generische Keywords fuer Kategorien
  if (page.category === 'foundation') {
    ['foundation', 'token', 'design', 'system', 'basis'].forEach(function (w) { words.add(w); });
  }
  if (page.category === 'components') {
    ['component', 'komponente'].forEach(function (w) { words.add(w); });
  }

  return Array.from(words);
}

// Recipe-Keywords extrahieren
function getRecipeKeywords(slug) {
  var recipeFile = path.join(DATA_DIR, slug + '-recipe.json');
  if (!fs.existsSync(recipeFile)) return [];

  try {
    var recipe = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));
    var keywords = new Set();

    // Tags
    if (recipe.meta && recipe.meta.tags) {
      recipe.meta.tags.forEach(function (t) { keywords.add(t); });
    }

    // Recipe-bezogene Keywords
    keywords.add('recipe');
    keywords.add('rezept');

    // Achsen-Namen und -Werte
    if (recipe.axes) {
      Object.keys(recipe.axes).forEach(function (axisKey) {
        keywords.add(axisKey);
        var axis = recipe.axes[axisKey];
        if (axis.values) {
          Object.keys(axis.values).forEach(function (v) { keywords.add(v); });
        }
      });
    }

    // States
    if (recipe.states && recipe.states.supported) {
      recipe.states.supported.forEach(function (s) { keywords.add(s); });
    }

    // Root-Element
    if (recipe.anatomy && recipe.anatomy.root && recipe.anatomy.root.element) {
      keywords.add(recipe.anatomy.root.element.replace('.', ''));
    }

    return Array.from(keywords);
  } catch (e) {
    return [];
  }
}

// Index bauen
var index = pages.map(function (page) {
  var baseKeywords = extractBaseKeywords(page);
  var recipeKeywords = page.category === 'components' ? getRecipeKeywords(page.slug) : [];
  var allKeywords = Array.from(new Set(baseKeywords.concat(recipeKeywords)));

  // Titel bereinigen (vor dem | Trenner)
  var title = page.title.split('|')[0].trim();

  return {
    title: title,
    fullTitle: page.title,
    url: './' + (page.slug === 'index' ? 'index.html' : page.slug + '-docs.html'),
    description: page.description || '',
    category: page.category,
    section: getSection(page),
    keywords: allKeywords
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2) + '\n');

console.log('Search-Index: ' + index.length + ' Eintraege → ' + OUTPUT);
var enriched = index.filter(function (e) { return e.keywords.indexOf('recipe') !== -1; }).length;
console.log('  Davon mit Recipe-Keywords: ' + enriched);
