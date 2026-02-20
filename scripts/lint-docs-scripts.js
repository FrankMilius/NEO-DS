#!/usr/bin/env node
// ==========================================================================
// Docs Script Integrity Lint: Bidirektionale Pruefung
// ==========================================================================
// Prueft:
//   1. Jede *-docs.js Datei in docs/ wird von einem Fragment referenziert
//   2. Jede <script src="..."> in einem Fragment zeigt auf eine existierende Datei
//   3. customScript-Flag in _pages.json stimmt mit Fragment-Inhalt ueberein
//
// Laueft als Teil von `npm test`.
//
// Usage:
//   node scripts/lint-docs-scripts.js
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const CONTENT_DIR = path.join(DOCS_DIR, 'content');
const PAGES_PATH = path.join(DOCS_DIR, '_pages.json');

// Mandatory template scripts — excluded from orphan check
const MANDATORY_SCRIPTS = new Set([
  'docs-sidebar-loader.js',
  'docs-sidebar-toggle.js',
  'docs-sidebar.js',
  'docs-header-search.js',
  'docs-search.js',
  'docs-theme-toggle.js',
  'docs-tabs.js',
]);

let errors = 0;
let warnings = 0;

function error(msg) {
  console.log(`  ERROR: ${msg}`);
  errors++;
}

function warn(msg) {
  console.log(`  WARN:  ${msg}`);
  warnings++;
}

// -------------------------------------------------------------------------
// 1. Collect all *-docs.js files in docs/
// -------------------------------------------------------------------------
const jsFiles = fs.readdirSync(DOCS_DIR)
  .filter(f => f.endsWith('-docs.js'))
  .sort();

// -------------------------------------------------------------------------
// 2. Collect all <script src="..."> references from content fragments
// -------------------------------------------------------------------------
const fragmentFiles = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

const referencedScripts = new Map(); // script filename -> referencing fragment
const referencedPaths = new Map(); // full src path -> referencing fragment
const fragmentHasSrcScript = new Map(); // fragment -> boolean
const fragmentHasInlineScript = new Map(); // fragment -> boolean

for (const file of fragmentFiles) {
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find <script src="..."> tags
  const srcMatches = content.match(/<script\s+src="([^"]+)"/g) || [];
  let hasSrc = false;

  for (const match of srcMatches) {
    const srcMatch = match.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      const filename = path.basename(src);
      referencedScripts.set(filename, file);
      referencedPaths.set(src, file);
      hasSrc = true;
    }
  }

  // Check for inline scripts (no src attribute)
  const inlineMatch = content.match(/<script>[\s\S]*?<\/script>/g);
  fragmentHasInlineScript.set(file, inlineMatch && inlineMatch.length > 0);
  fragmentHasSrcScript.set(file, hasSrc);
}

// -------------------------------------------------------------------------
// 3. Check A: Orphaned script files (exist but unreferenced)
// -------------------------------------------------------------------------
console.log('\n--- Orphan Check: *-docs.js files without fragment reference ---');
let orphanCount = 0;

for (const jsFile of jsFiles) {
  if (MANDATORY_SCRIPTS.has(jsFile)) continue;

  if (!referencedScripts.has(jsFile)) {
    error(`${jsFile} exists in docs/ but no content fragment references it.`);
    orphanCount++;
  }
}

if (orphanCount === 0) {
  console.log('  Alle *-docs.js Dateien werden referenziert.');
}

// -------------------------------------------------------------------------
// 4. Check B: Dead references (fragment references non-existent file)
// -------------------------------------------------------------------------
console.log('\n--- Dead Reference Check: fragment <script src> targets ---');
let deadCount = 0;

for (const [srcPath, fragment] of referencedPaths) {
  // Resolve relative to docs/ (where built pages live)
  const resolvedPath = path.resolve(DOCS_DIR, srcPath);

  if (!fs.existsSync(resolvedPath)) {
    error(`${fragment} references "${srcPath}" but file does not exist at ${resolvedPath}`);
    deadCount++;
  }
}

if (deadCount === 0) {
  console.log('  Alle referenzierten Scripts existieren.');
}

// -------------------------------------------------------------------------
// 5. Check C: customScript metadata alignment
// -------------------------------------------------------------------------
console.log('\n--- Metadata Check: customScript alignment ---');
let metaCount = 0;

let pages;
try {
  pages = JSON.parse(fs.readFileSync(PAGES_PATH, 'utf-8'));
} catch (e) {
  error(`Konnte _pages.json nicht lesen: ${e.message}`);
  pages = [];
}

for (const page of pages) {
  const fragmentName = page.slug === 'index' ? 'index.html' : `${page.slug}.html`;
  const hasSrc = fragmentHasSrcScript.get(fragmentName) || false;
  const hasInline = fragmentHasInlineScript.get(fragmentName) || false;
  const hasAnyScript = hasSrc || hasInline;

  if (page.customScript === true && !hasAnyScript) {
    warn(`${fragmentName}: customScript=true but fragment has no scripts.`);
    metaCount++;
  }

  if (page.customScript === false && hasAnyScript) {
    warn(`${fragmentName}: customScript=false but fragment has ${hasSrc ? 'src' : 'inline'} scripts.`);
    metaCount++;
  }
}

if (metaCount === 0) {
  console.log('  Alle customScript-Flags stimmen mit Fragment-Inhalt ueberein.');
}

// -------------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
if (errors === 0 && warnings === 0) {
  console.log(`Script-Integrity-Lint: ${jsFiles.length} Scripts, ${fragmentFiles.length} Fragmente, keine Probleme.`);
  process.exit(0);
} else {
  console.log(`Script-Integrity-Lint: ${errors} ERROR(s), ${warnings} WARNING(s).`);
  if (errors > 0) {
    process.exit(1);
  }
  // Warnings alone don't fail the build
  process.exit(0);
}
