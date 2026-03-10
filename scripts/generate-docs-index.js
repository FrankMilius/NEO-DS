#!/usr/bin/env node
// ==========================================================================
// Docs Search Index Generator
// ==========================================================================
// Liest die kanonische IA-Matrix + _pages.json und generiert
// data/docs-search-index.json fuer die Client-Side-Suche.
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_PATH = path.join(__dirname, '..', 'docs', '_pages.json');
const MATRIX_PATH = path.join(__dirname, '..', 'docs', 'ia', 'docs-ia-migration-matrix.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'docs-search-index.json');

const pages = JSON.parse(fs.readFileSync(PAGES_PATH, 'utf-8'));
const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf-8'));
const pagesBySlug = new Map(pages.map(function (page) { return [page.slug, page]; }));
const sectionById = new Map(matrix.targetModel.sections.map(function (section) {
  return [section.id, section.label];
}));
const groupById = new Map(matrix.targetModel.groups.map(function (group) {
  return [group.id, group.label];
}));

function docsFileExists(slug) {
  var file = slug === 'index'
    ? path.join(ROOT, 'docs', 'index.html')
    : path.join(ROOT, 'docs', slug + '-docs.html');
  return fs.existsSync(file);
}

function shortTitle(title) {
  if (!title) return '';
  return title.split('|')[0].split('–')[0].trim();
}

function humanizeSlug(slug) {
  var explicit = {
    cta: 'CTA',
    faq: 'FAQ',
    kbd: 'Kbd',
    otp: 'OTP',
    a11y: 'A11y'
  };
  return slug.split('-').map(function (part) {
    if (explicit[part]) return explicit[part];
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(' ');
}

// Keyword-Map für erweiterte Suche
const GROUP_KEYWORDS = {
  'Color & Theme': ['color', 'theme', 'semantic', 'token', 'palette'],
  'Typography': ['typography', 'font', 'text', 'heading'],
  'Spacing & Sizing': ['spacing', 'size', 'layout', 'rhythm'],
  'Borders & Radii': ['border', 'radius', 'corner', 'stroke'],
  'Surfaces & Effects': ['shadow', 'elevation', 'motion', 'z-index', 'opacity'],
  'Icons & Elements': ['icons', 'elements', 'html', 'asset'],
  'Architecture': ['architecture', 'composition', 'system'],
  'Primitives': ['layout', 'grid', 'container', 'section', 'primitive'],
  'Layout Specs': ['layout-spec', 'extends', 'overrides', 'preset'],
  'Shell Presets': ['shell', 'preset', 'data-layout', 'scaffold'],
  'Actions': ['button', 'action', 'klick', 'click', 'submit'],
  'Form Inputs': ['form', 'input', 'formular', 'eingabe', 'feld'],
  'Form Structure': ['form', 'fieldset', 'layout', 'struktur', 'validation'],
  'Selection & Controls': ['control', 'selection', 'toggle', 'switch', 'segmented'],
  'Navigation': ['navigation', 'menü', 'menu', 'link', 'breadcrumb'],
  'Overlays & Feedback': ['feedback', 'overlay', 'dialog', 'toast', 'alert'],
  'Status & Loading': ['status', 'loading', 'skeleton', 'spinner', 'progress'],
  'Data Display': ['daten', 'anzeige', 'display', 'liste', 'tabelle'],
  'Content Blocks': ['content', 'section', 'hero', 'faq', 'marketing'],
  'Media & Rich Content': ['media', 'video', 'bild', 'galerie', 'animation'],
  'Search & Command': ['search', 'toolbar', 'command'],
  'Utilities & Micro Components': ['utility', 'helper', 'a11y', 'accessibility'],
  'Page Templates': ['template', 'vorlage', 'seite', 'page', 'layout'],
  'Architecture & Principles': ['guide', 'architecture', 'principles', 'system'],
  'Recipes & Governance': ['recipe', 'governance', 'status', 'lifecycle'],
  'Quality & Accessibility': ['quality', 'accessibility', 'states', 'rules'],
  'Migration & Status': ['migration', 'matrix', 'status'],
  'Start': ['home', 'overview', 'introduction']
};

const index = matrix.entries
  .filter(function (entry) {
    return docsFileExists(entry.newSlug);
  })
  .map(function (entry) {
  const page = pagesBySlug.get(entry.newSlug);

  // Generiere URL: index.html oder {slug}-docs.html
  var url = entry.newSlug === 'index'
    ? './index.html'
    : './' + entry.newSlug + '-docs.html';

  // Titel ohne Suffix für bessere Suche
  var title = page ? shortTitle(page.title) : humanizeSlug(entry.newSlug);
  var fullTitle = page ? page.title : title + ' | Design System Docs';
  var description = page ? page.description : 'Dokumentationsseite fuer ' + title + '.';
  var sectionLabel = groupById.get(entry.newGroup) || entry.newGroup;
  var categoryLabel = sectionById.get(entry.newSection) || entry.newSection;

  // Keywords aus Slug, IA-Section und IA-Group
  var keywords = [entry.newSlug.replace(/-/g, ' ')];
  if (GROUP_KEYWORDS[sectionLabel]) {
    keywords = keywords.concat(GROUP_KEYWORDS[sectionLabel]);
  }

  keywords.push(entry.newSection, entry.newGroup, categoryLabel.toLowerCase(), sectionLabel.toLowerCase());

  // Slug-Parts als Keywords
  entry.newSlug.split('-').forEach(function (part) {
    if (part.length > 2 && keywords.indexOf(part) === -1) {
      keywords.push(part);
    }
  });

  keywords = Array.from(new Set(keywords.map(function (kw) {
    return String(kw).toLowerCase();
  })));

  return {
    title: title,
    fullTitle: fullTitle,
    url: url,
    description: description,
    category: categoryLabel,
    section: sectionLabel,
    iaSection: entry.newSection,
    iaGroup: entry.newGroup,
    oldCategory: entry.oldCategory,
    oldGroup: entry.oldGroup,
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
