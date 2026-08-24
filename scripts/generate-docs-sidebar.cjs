#!/usr/bin/env node
// ==========================================================================
// Docs Sidebar Generator
// ==========================================================================
// Generiert docs/docs-sidebar.html aus der kanonischen IA-Matrix:
//   docs/ia/docs-ia-migration-matrix.json
//
// Optionale Metadaten (Titel/Description) werden aus docs/_pages.json gelesen.
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const PAGES_PATH = path.join(DOCS_DIR, '_pages.json');
const MATRIX_PATH = path.join(DOCS_DIR, 'ia', 'docs-ia-migration-matrix.json');
const OUTPUT_PATH = path.join(DOCS_DIR, 'docs-sidebar.html');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function shortTitle(title) {
  if (!title) return '';
  return title.split('|')[0].split('–')[0].trim();
}

function humanizeSlug(slug) {
  const explicit = {
    cta: 'CTA',
    faq: 'FAQ',
    kbd: 'Kbd',
    otp: 'OTP',
    a11y: 'A11y'
  };
  return slug
    .split('-')
    .map(function (part) {
      if (explicit[part]) return explicit[part];
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function pageUrl(slug) {
  return slug === 'index' ? './index.html' : './' + slug + '-docs.html';
}

function docsFileForSlug(slug) {
  return slug === 'index'
    ? path.join(DOCS_DIR, 'index.html')
    : path.join(DOCS_DIR, slug + '-docs.html');
}

function iconSvg(type) {
  if (type === 'collapse') {
    return '<svg class="docs-sidebar__icon-collapse" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
  }
  return '<svg class="docs-sidebar__icon-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
}

function sortByLabel(a, b) {
  return a.label.localeCompare(b.label, 'de', { sensitivity: 'base' });
}

function generate() {
  const pages = readJson(PAGES_PATH);
  const matrix = readJson(MATRIX_PATH);

  const pageBySlug = new Map(pages.map(function (p) { return [p.slug, p]; }));
  const sectionById = new Map(matrix.targetModel.sections.map(function (s) { return [s.id, s]; }));
  const groupById = new Map(matrix.targetModel.groups.map(function (g) { return [g.id, g]; }));

  const entries = matrix.entries
    .filter(function (entry) {
      return fs.existsSync(docsFileForSlug(entry.newSlug));
    })
    .map(function (entry) {
      const page = pageBySlug.get(entry.newSlug);
      const label = page ? shortTitle(page.title) : humanizeSlug(entry.newSlug);
      return {
        slug: entry.newSlug,
        label: label,
        section: entry.newSection,
        group: entry.newGroup
      };
    });

  const grouped = new Map(); // section -> group -> entries[]
  entries.forEach(function (entry) {
    if (!grouped.has(entry.section)) grouped.set(entry.section, new Map());
    const sectionMap = grouped.get(entry.section);
    if (!sectionMap.has(entry.group)) sectionMap.set(entry.group, []);
    sectionMap.get(entry.group).push(entry);
  });

  const lines = [];
  lines.push('<aside class="docs-sidebar" id="docs-sidebar" aria-label="Dokumentations-Navigation">');
  lines.push('  <nav aria-label="Docs-Seitennavigation">');

  matrix.targetModel.sections.forEach(function (section) {
    const sectionMap = grouped.get(section.id);
    if (!sectionMap) return;

    const groups = matrix.targetModel.groups
      .filter(function (g) { return g.section === section.id && sectionMap.has(g.id); });
    if (groups.length === 0) return;

    lines.push('    <div class="docs-sidebar__section">');
    lines.push('      <button class="docs-sidebar__toggle" aria-expanded="true" aria-controls="sidebar-' + section.id + '">');
    lines.push('        ' + section.label);
    lines.push('        ' + iconSvg('collapse'));
    lines.push('        ' + iconSvg('expand'));
    lines.push('      </button>');
    lines.push('      <ul class="docs-sidebar__list" id="sidebar-' + section.id + '" role="list">');

    groups.forEach(function (group) {
      const groupEntries = (sectionMap.get(group.id) || [])
        .sort(sortByLabel);

      if (groupEntries.length === 0) return;

      lines.push('        <li class="docs-sidebar__subgroup">');
      lines.push('          <span class="docs-sidebar__subgroup-label">' + group.label + '</span>');
      lines.push('          <ul class="docs-sidebar__sublist" id="sidebar-' + group.id + '" role="list">');

      groupEntries.forEach(function (entry) {
        lines.push('            <li><a class="docs-sidebar__link" href="' + pageUrl(entry.slug) + '">' + entry.label + '</a></li>');
      });

      lines.push('          </ul>');
      lines.push('        </li>');
    });

    lines.push('      </ul>');
    lines.push('    </div>');
  });

  lines.push('  </nav>');
  lines.push('</aside>');

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n') + '\n', 'utf-8');
  console.log('Sidebar generated: ' + OUTPUT_PATH + ' (' + entries.length + ' links)');
}

generate();
