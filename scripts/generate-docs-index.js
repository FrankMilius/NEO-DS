#!/usr/bin/env node
// ==========================================================================
// Docs Search Index Generator
// ==========================================================================
// Liest _pages.json und generiert data/docs-search-index.json
// für die Client-Side-Suche in der Dokumentation.
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const PAGES_PATH = path.join(__dirname, '..', 'docs', '_pages.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'docs-search-index.json');

const pages = JSON.parse(fs.readFileSync(PAGES_PATH, 'utf-8'));

// Keyword-Map für erweiterte Suche
const CATEGORY_KEYWORDS = {
  'Foundation': ['foundation', 'token', 'design', 'system', 'basis'],
  'Layout': ['layout', 'grid', 'container', 'responsive'],
  'Actions': ['button', 'action', 'klick', 'click', 'submit'],
  'Form Inputs': ['form', 'input', 'formular', 'eingabe', 'feld'],
  'Form Structure': ['form', 'fieldset', 'layout', 'struktur', 'validation'],
  'Data Display': ['daten', 'anzeige', 'display', 'liste', 'tabelle'],
  'Controls': ['control', 'steuerung', 'toggle', 'switch'],
  'Navigation': ['navigation', 'menü', 'menu', 'link', 'breadcrumb'],
  'Feedback': ['feedback', 'meldung', 'nachricht', 'notification', 'alert'],
  'Sections': ['section', 'abschnitt', 'bereich', 'hero', 'landing'],
  'Media': ['media', 'video', 'bild', 'galerie', 'animation'],
  'Utilities': ['utility', 'helfer', 'a11y', 'accessibility', 'sichtbarkeit'],
  'Templates': ['template', 'vorlage', 'seite', 'page', 'layout'],
  'Guides': ['guide', 'anleitung', 'howto', 'entscheidung']
};

const index = pages.map(function (page) {
  // Generiere URL: index.html oder {slug}-docs.html
  var url = page.slug === 'index'
    ? './index.html'
    : './' + page.slug + '-docs.html';

  // Titel ohne Suffix für bessere Suche
  var shortTitle = page.title.split('|')[0].split('–')[0].trim();

  // Keywords aus Slug, Kategorie und Sidebar-Gruppe
  var keywords = [page.slug.replace(/-/g, ' ')];
  if (page.sidebarGroup && CATEGORY_KEYWORDS[page.sidebarGroup]) {
    keywords = keywords.concat(CATEGORY_KEYWORDS[page.sidebarGroup]);
  }
  // Slug-Parts als Keywords
  page.slug.split('-').forEach(function (part) {
    if (part.length > 2 && keywords.indexOf(part) === -1) {
      keywords.push(part);
    }
  });

  return {
    title: shortTitle,
    fullTitle: page.title,
    url: url,
    description: page.description,
    category: page.category,
    section: page.sidebarGroup || 'Home',
    keywords: keywords
  };
});

// Sicherstellen, dass data/ existiert
var dataDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');
console.log('Search index generated: ' + index.length + ' entries → ' + OUTPUT_PATH);
