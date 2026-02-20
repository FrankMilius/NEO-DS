#!/usr/bin/env node
// ==========================================================================
// Docs Script Audit — Prüft alle gebauten Docs-Seiten auf Script-Konformität
// ==========================================================================
// Scannt alle HTML-Dateien in docs/ (ohne content/, _template.html,
// docs-sidebar.html) und prüft Script-Reihenfolge, Duplikate, Inline-Scripts,
// veraltete Muster und fehlende Scripts.
//
// Usage:
//   node scripts/_audit-scripts.js
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PAGES_PATH = path.join(DOCS_DIR, '_pages.json');

// ---------------------------------------------------------------------------
// Canonical mandatory script order (from _template.html lines 54-60)
// ---------------------------------------------------------------------------
const MANDATORY_SCRIPTS = [
  'docs-sidebar-loader.js',
  'docs-sidebar-toggle.js',
  'docs-sidebar.js',
  'docs-header-search.js',
  'docs-search.js',
  'docs-theme-toggle.js',
  'docs-tabs.js'
];

// ---------------------------------------------------------------------------
// Exclusion list — files to skip
// ---------------------------------------------------------------------------
const EXCLUDED_FILES = new Set([
  '_template.html',
  'docs-sidebar.html'
]);

// ---------------------------------------------------------------------------
// Load _pages.json for customScript metadata
// ---------------------------------------------------------------------------
let pagesConfig = [];
try {
  pagesConfig = JSON.parse(fs.readFileSync(PAGES_PATH, 'utf-8'));
} catch (e) {
  console.error(`ERROR: Could not read _pages.json: ${e.message}`);
  process.exit(1);
}

// Build lookup: filename -> page config
const pageConfigMap = new Map();
for (const page of pagesConfig) {
  const filename = page.slug === 'index' ? 'index.html' : `${page.slug}-docs.html`;
  pageConfigMap.set(filename, page);
}

// ---------------------------------------------------------------------------
// Parse script tags from HTML content
// ---------------------------------------------------------------------------

/**
 * Extracts all <script ...> tags with their line numbers, src attributes,
 * and whether they are inline.
 */
function extractScriptTags(html) {
  const lines = html.split('\n');
  const tags = [];

  // Multi-line aware regex: find all <script tags
  // We need to handle both self-closing-ish and normal script tags
  const fullText = html;

  // Match all <script...>...</script> or <script.../> occurrences
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(fullText)) !== null) {
    const attrs = match[1];
    const innerContent = match[2];
    const startOffset = match.index;

    // Calculate line number
    const textBefore = fullText.substring(0, startOffset);
    const lineNumber = textBefore.split('\n').length;

    // Extract src attribute
    const srcMatch = attrs.match(/src\s*=\s*"([^"]*)"/i) || attrs.match(/src\s*=\s*'([^']*)'/i);
    const src = srcMatch ? srcMatch[1] : null;

    // Check for attributes
    const hasDefer = /\bdefer\b/i.test(attrs);
    const hasAsync = /\basync\b/i.test(attrs);
    const typeMatch = attrs.match(/type\s*=\s*"([^"]*)"/i) || attrs.match(/type\s*=\s*'([^']*)'/i);
    const type = typeMatch ? typeMatch[1] : null;

    tags.push({
      line: lineNumber,
      src,
      inline: !src,
      innerContent: !src ? innerContent : '',
      hasDefer,
      hasAsync,
      type,
      fullTag: match[0].substring(0, Math.min(match[0].length, 200)),
      rawAttrs: attrs
    });
  }

  return tags;
}

/**
 * Determine which zone a script tag is in:
 * - 'head': inside <head>...</head>
 * - 'content': between <!-- Content Area --> and </div><!-- /.docs-layout -->
 * - 'mandatory': in the mandatory script zone
 * - 'page-specific': after the mandatory scripts ({{scripts}} zone)
 */
function determineZone(html, scriptLine) {
  const lines = html.split('\n');

  // Find <head> and </head> line numbers
  let headStart = -1, headEnd = -1;
  let contentStart = -1, layoutEnd = -1;
  let mandatoryStart = -1, mandatoryEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (/<head[^>]*>/i.test(line) && headStart === -1) headStart = lineNum;
    if (/<\/head>/i.test(line) && headEnd === -1) headEnd = lineNum;
    if (/<!-- Content Area -->/.test(line) && contentStart === -1) contentStart = lineNum;
    if (/<!-- \/\.docs-layout -->/.test(line) || /<\/div><!-- \/\.docs-layout/.test(line)) layoutEnd = lineNum;
  }

  // Find mandatory script zone: first occurrence of docs-sidebar-loader.js
  // and last occurrence of docs-tabs.js
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (lines[i].includes('docs-sidebar-loader.js') && mandatoryStart === -1) {
      mandatoryStart = lineNum;
    }
    if (lines[i].includes('docs-tabs.js')) {
      mandatoryEnd = lineNum;
    }
  }

  if (headStart !== -1 && headEnd !== -1 && scriptLine >= headStart && scriptLine <= headEnd) {
    return 'head';
  }
  if (contentStart !== -1 && layoutEnd !== -1 && scriptLine > contentStart && scriptLine < layoutEnd) {
    return 'content';
  }
  if (mandatoryStart !== -1 && mandatoryEnd !== -1) {
    if (scriptLine >= mandatoryStart && scriptLine <= mandatoryEnd) {
      return 'mandatory';
    }
    if (scriptLine > mandatoryEnd) {
      return 'page-specific';
    }
    if (scriptLine < mandatoryStart && scriptLine > (layoutEnd || 0)) {
      return 'between-layout-and-mandatory';
    }
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// Audit checks
// ---------------------------------------------------------------------------

function auditPage(filename, html) {
  const issues = [];
  const allTags = extractScriptTags(html);

  // Get page config
  const config = pageConfigMap.get(filename);

  // ------ CHECK 1: Script Order ------
  // Extract all script tags with src attributes
  const srcTags = allTags.filter(t => t.src);
  const srcNames = srcTags.map(t => {
    // Extract just the filename from the src path
    const parts = t.src.split('/');
    return parts[parts.length - 1];
  });

  // Find the mandatory scripts in document order
  const mandatoryIndices = [];
  for (let i = 0; i < srcNames.length; i++) {
    if (MANDATORY_SCRIPTS.includes(srcNames[i])) {
      mandatoryIndices.push(i);
    }
  }

  // Check if first 7 src scripts match mandatory order exactly
  if (srcTags.length >= 7) {
    const first7SrcNames = srcNames.slice(0, 7);
    let orderCorrect = true;
    const mismatches = [];

    for (let i = 0; i < MANDATORY_SCRIPTS.length; i++) {
      if (first7SrcNames[i] !== MANDATORY_SCRIPTS[i]) {
        orderCorrect = false;
        mismatches.push({
          position: i + 1,
          expected: MANDATORY_SCRIPTS[i],
          got: first7SrcNames[i] || '(missing)'
        });
      }
    }

    if (!orderCorrect) {
      for (const m of mismatches) {
        issues.push({
          category: 'ORDER',
          severity: 'CRITICAL',
          detail: `Script position ${m.position}: expected "${m.expected}", found "${m.got}"`,
          line: srcTags[m.position - 1] ? srcTags[m.position - 1].line : 0
        });
      }
    }

    // Check if mandatory scripts are interleaved with non-mandatory
    // The first 7 src scripts should ALL be mandatory
    for (let i = 0; i < 7 && i < srcNames.length; i++) {
      if (!MANDATORY_SCRIPTS.includes(srcNames[i])) {
        issues.push({
          category: 'ORDER',
          severity: 'CRITICAL',
          detail: `Non-mandatory script "${srcNames[i]}" found at position ${i + 1}, interleaved with mandatory scripts`,
          line: srcTags[i].line
        });
      }
    }
  }

  // Check for inline scripts between mandatory scripts
  if (mandatoryIndices.length > 0) {
    const firstMandatoryLine = srcTags[mandatoryIndices[0]] ? srcTags[mandatoryIndices[0]].line : 0;
    const lastMandatoryLine = srcTags[mandatoryIndices[mandatoryIndices.length - 1]] ? srcTags[mandatoryIndices[mandatoryIndices.length - 1]].line : 0;

    const inlineBetween = allTags.filter(t => t.inline && t.line > firstMandatoryLine && t.line < lastMandatoryLine);
    for (const tag of inlineBetween) {
      issues.push({
        category: 'ORDER',
        severity: 'CRITICAL',
        detail: 'Inline script found between mandatory scripts',
        line: tag.line
      });
    }
  }

  // ------ CHECK 2: Duplicate Script Loads ------
  const srcCounts = new Map();
  for (const tag of srcTags) {
    const name = tag.src;
    srcCounts.set(name, (srcCounts.get(name) || 0) + 1);
  }
  for (const [src, count] of srcCounts) {
    if (count > 1) {
      const dupeLines = srcTags.filter(t => t.src === src).map(t => t.line);
      issues.push({
        category: 'DUPLICATE',
        severity: 'CRITICAL',
        detail: `Script "${src}" loaded ${count} times (lines: ${dupeLines.join(', ')})`,
        line: dupeLines[1] // Report on the second occurrence
      });
    }
  }

  // Check if mandatory scripts also appear in page-specific section
  // (after the first 7 src scripts)
  const pageSpecificSrcNames = srcNames.slice(7);
  for (const name of pageSpecificSrcNames) {
    if (MANDATORY_SCRIPTS.includes(name)) {
      const tag = srcTags.find((t, i) => i >= 7 && t.src && t.src.endsWith(name));
      issues.push({
        category: 'DUPLICATE',
        severity: 'CRITICAL',
        detail: `Mandatory script "${name}" also appears in page-specific section`,
        line: tag ? tag.line : 0
      });
    }
  }

  // ------ CHECK 3: Inline Scripts ------
  const inlineTags = allTags.filter(t => t.inline);

  // Determine mandatory zone boundaries
  let mandatoryFirstLine = Infinity;
  let mandatoryLastLine = 0;
  for (const idx of mandatoryIndices) {
    if (srcTags[idx]) {
      mandatoryFirstLine = Math.min(mandatoryFirstLine, srcTags[idx].line);
      mandatoryLastLine = Math.max(mandatoryLastLine, srcTags[idx].line);
    }
  }

  for (const tag of inlineTags) {
    let position;
    if (tag.line < mandatoryFirstLine) {
      position = 'BEFORE';
    } else if (tag.line > mandatoryLastLine) {
      position = 'AFTER';
    } else {
      position = 'BETWEEN';
    }

    if (position === 'BEFORE') {
      issues.push({
        category: 'INLINE',
        severity: 'WARNING',
        detail: `Inline script found BEFORE mandatory scripts`,
        line: tag.line
      });
    } else if (position === 'BETWEEN') {
      issues.push({
        category: 'INLINE',
        severity: 'CRITICAL',
        detail: `Inline script found BETWEEN mandatory scripts`,
        line: tag.line
      });
    }
    // AFTER is valid — in the {{scripts}} zone — only report as INFO
    if (position === 'AFTER') {
      issues.push({
        category: 'INLINE',
        severity: 'INFO',
        detail: `Inline script in page-specific zone (valid position)`,
        line: tag.line
      });
    }
  }

  // ------ CHECK 4: Deprecated/Disallowed Patterns ------
  for (const tag of allTags) {
    // type="module"
    if (tag.type === 'module') {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `<script type="module"> detected`,
        line: tag.line
      });
    }

    // defer or async
    if (tag.hasDefer) {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `<script defer> detected`,
        line: tag.line
      });
    }
    if (tag.hasAsync) {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `<script async> detected`,
        line: tag.line
      });
    }

    // External CDN scripts
    if (tag.src && /^https?:\/\//i.test(tag.src)) {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `External CDN script: "${tag.src}"`,
        line: tag.line
      });
    }

    // Depth mismatch: ../something (but ../js/ and ../styles.css are okay for page-level)
    // For docs-level scripts (in docs/), src should NOT use ../ prefix
    // UNLESS it's ../js/ or ../styles.css
    if (tag.src && tag.src.startsWith('../')) {
      // ../js/ is valid (shared JS from project root)
      // ../styles.css is valid (main stylesheet)
      if (!tag.src.startsWith('../js/') && tag.src !== '../styles.css') {
        issues.push({
          category: 'DEPRECATED',
          severity: 'WARNING',
          detail: `Depth-mismatched script src: "${tag.src}" (only ../js/ or ../styles.css are valid parent-relative paths)`,
          line: tag.line
        });
      }
    }

    // DOMContentLoaded in inline scripts
    if (tag.inline && tag.innerContent.includes("document.addEventListener('DOMContentLoaded'")) {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `document.addEventListener('DOMContentLoaded') found in inline script`,
        line: tag.line
      });
    }
    // Also check double-quote variant
    if (tag.inline && tag.innerContent.includes('document.addEventListener("DOMContentLoaded"')) {
      issues.push({
        category: 'DEPRECATED',
        severity: 'WARNING',
        detail: `document.addEventListener("DOMContentLoaded") found in inline script`,
        line: tag.line
      });
    }

    // Script tags inside <head>
    const zone = determineZone(html, tag.line);
    if (zone === 'head') {
      issues.push({
        category: 'DEPRECATED',
        severity: 'CRITICAL',
        detail: `Script tag found inside <head>: ${tag.src ? tag.src : '(inline)'}`,
        line: tag.line
      });
    }

    // Script tags inside main content area
    if (zone === 'content') {
      issues.push({
        category: 'DEPRECATED',
        severity: 'CRITICAL',
        detail: `Script tag found inside content area: ${tag.src ? tag.src : '(inline)'}`,
        line: tag.line
      });
    }
  }

  // ------ CHECK 5: Missing Required Scripts ------
  const allSrcNames = new Set(srcNames);
  for (const mandatory of MANDATORY_SCRIPTS) {
    if (!allSrcNames.has(mandatory)) {
      issues.push({
        category: 'MISSING',
        severity: 'CRITICAL',
        detail: `Mandatory script "${mandatory}" is missing`,
        line: 0
      });
    }
  }

  // Check customScript expectations from _pages.json
  if (config) {
    const pageSpecificScripts = srcTags.slice(7); // Scripts after the 7 mandatory
    const pageSpecificInline = inlineTags.filter(t => t.line > mandatoryLastLine);
    const hasPageScripts = pageSpecificScripts.length > 0 || pageSpecificInline.length > 0;

    if (config.customScript === true && pageSpecificScripts.length === 0) {
      // customScript: true but no page-specific src scripts
      // Inline scripts alone might count, but let's flag if there are zero src scripts
      if (pageSpecificInline.length === 0) {
        issues.push({
          category: 'MISSING',
          severity: 'WARNING',
          detail: `Page has customScript: true in _pages.json but no page-specific scripts found`,
          line: 0
        });
      }
    }

    if (config.customScript === false && pageSpecificScripts.length > 0) {
      for (const tag of pageSpecificScripts) {
        issues.push({
          category: 'MISSING',
          severity: 'WARNING',
          detail: `Page has customScript: false in _pages.json but has unexpected page-specific script: "${tag.src}"`,
          line: tag.line
        });
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Get all HTML files in docs/ (excluding content/ subdirectory, _template.html, docs-sidebar.html)
  const allFiles = fs.readdirSync(DOCS_DIR).filter(f => {
    if (!f.endsWith('.html')) return false;
    if (EXCLUDED_FILES.has(f)) return false;
    return true;
  });

  allFiles.sort();

  const report = {
    totalPages: allFiles.length,
    pagesAudited: 0,
    clean: [],
    violations: [],
    summary: {
      critical: 0,
      warning: 0,
      info: 0
    }
  };

  for (const filename of allFiles) {
    const filePath = path.join(DOCS_DIR, filename);
    let html;
    try {
      html = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      report.violations.push({
        file: filename,
        issues: [{
          category: 'MISSING',
          severity: 'CRITICAL',
          detail: `Could not read file: ${e.message}`,
          line: 0
        }]
      });
      continue;
    }

    report.pagesAudited++;
    const issues = auditPage(filename, html);

    if (issues.length === 0) {
      report.clean.push(filename);
    } else {
      report.violations.push({
        file: filename,
        issues
      });

      // Tally severity counts
      for (const issue of issues) {
        switch (issue.severity) {
          case 'CRITICAL': report.summary.critical++; break;
          case 'WARNING': report.summary.warning++; break;
          case 'INFO': report.summary.info++; break;
        }
      }
    }
  }

  // Output the report as JSON
  console.log(JSON.stringify(report, null, 2));
}

main();
