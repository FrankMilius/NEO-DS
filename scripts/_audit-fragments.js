#!/usr/bin/env node
// ==========================================================================
// Fragment Audit — Validiert alle Content-Fragmente in docs/content/
// ==========================================================================
// Prüft, ob HTML-Fragmente dem Template-System-Vertrag entsprechen:
//   - Korrekte Marker-Kommentare (BODY required, STYLES/SCRIPTS optional)
//   - Kein HTML-Boilerplate (doctype, <html>, <head>, <body>, etc.)
//   - Keine doppelten Infrastruktur-Elemente (Sidebar, Header, Theme-Toggle)
//   - Marker-Reihenfolge und Eindeutigkeit
//
// Usage:  node scripts/_audit-fragments.js
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'docs', 'content');

// ---------------------------------------------------------------------------
// Marker definitions
// ---------------------------------------------------------------------------

const MARKERS = {
  STYLES_OPEN:  '<!-- STYLES -->',
  STYLES_CLOSE: '<!-- /STYLES -->',
  BODY_OPEN:    '<!-- BODY -->',
  BODY_CLOSE:   '<!-- /BODY -->',
  SCRIPTS_OPEN: '<!-- SCRIPTS -->',
  SCRIPTS_CLOSE:'<!-- /SCRIPTS -->'
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find all occurrences of `needle` in `text`, return array of 1-based line numbers */
function findLineNumbers(text, needle) {
  const lines = [];
  let idx = -1;
  while ((idx = text.indexOf(needle, idx + 1)) !== -1) {
    const lineNum = text.substring(0, idx).split('\n').length;
    lines.push(lineNum);
  }
  return lines;
}

/** Find 1-based line number of first occurrence, or null */
function firstLine(text, needle) {
  const idx = text.indexOf(needle);
  if (idx === -1) return null;
  return text.substring(0, idx).split('\n').length;
}

/** Regex-based line search (returns first match line number or null) */
function firstLineRegex(text, regex) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return null;
}

/** All regex match line numbers */
function findLineNumbersRegex(text, regex) {
  const results = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) results.push(i + 1);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Check functions
// ---------------------------------------------------------------------------

function check1_requiredBody(content, issues) {
  const hasOpen = content.includes(MARKERS.BODY_OPEN);
  const hasClose = content.includes(MARKERS.BODY_CLOSE);

  if (!hasOpen) {
    issues.push({
      check: 'CHECK_1',
      severity: 'CRITICAL',
      detail: 'Missing required <!-- BODY --> opening marker',
      line: null
    });
  }
  if (!hasClose) {
    issues.push({
      check: 'CHECK_1',
      severity: 'CRITICAL',
      detail: 'Missing required <!-- /BODY --> closing marker',
      line: null
    });
  }
}

function check2_stylesPaired(content, issues) {
  const hasOpen = content.includes(MARKERS.STYLES_OPEN);
  const hasClose = content.includes(MARKERS.STYLES_CLOSE);

  if (hasOpen && !hasClose) {
    issues.push({
      check: 'CHECK_2',
      severity: 'WARNING',
      detail: 'Found <!-- STYLES --> but missing <!-- /STYLES --> closing marker',
      line: firstLine(content, MARKERS.STYLES_OPEN)
    });
  }
  if (!hasOpen && hasClose) {
    issues.push({
      check: 'CHECK_2',
      severity: 'WARNING',
      detail: 'Found <!-- /STYLES --> but missing <!-- STYLES --> opening marker',
      line: firstLine(content, MARKERS.STYLES_CLOSE)
    });
  }
}

function check3_scriptsPaired(content, issues) {
  const hasOpen = content.includes(MARKERS.SCRIPTS_OPEN);
  const hasClose = content.includes(MARKERS.SCRIPTS_CLOSE);

  if (hasOpen && !hasClose) {
    issues.push({
      check: 'CHECK_3',
      severity: 'WARNING',
      detail: 'Found <!-- SCRIPTS --> but missing <!-- /SCRIPTS --> closing marker',
      line: firstLine(content, MARKERS.SCRIPTS_OPEN)
    });
  }
  if (!hasOpen && hasClose) {
    issues.push({
      check: 'CHECK_3',
      severity: 'WARNING',
      detail: 'Found <!-- /SCRIPTS --> but missing <!-- SCRIPTS --> opening marker',
      line: firstLine(content, MARKERS.SCRIPTS_CLOSE)
    });
  }
}

function check4_noBoilerplate(content, issues) {
  // DOCTYPE
  const doctypeLine = firstLineRegex(content, /<!doctype\b/i);
  if (doctypeLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <!DOCTYPE> — template provides this',
      line: doctypeLine
    });
  }

  // <html tag
  const htmlLine = firstLineRegex(content, /<html[\s>]/i);
  if (htmlLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <html> tag — template provides this',
      line: htmlLine
    });
  }

  // <head> or </head>
  const headOpenLine = firstLineRegex(content, /<head>/i);
  if (headOpenLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <head> tag — template provides this',
      line: headOpenLine
    });
  }
  const headCloseLine = firstLineRegex(content, /<\/head>/i);
  if (headCloseLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains </head> tag — template provides this',
      line: headCloseLine
    });
  }

  // <body or </body> — actual HTML tags only (not CSS class references)
  // Match <body> or <body followed by space/attributes, but not inside strings/CSS
  const bodyLines = findLineNumbersRegex(content, /<body[\s>]/i);
  for (const line of bodyLines) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <body> tag — template provides this',
      line
    });
  }
  const bodyCloseLines = findLineNumbersRegex(content, /<\/body>/i);
  for (const line of bodyCloseLines) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains </body> tag — template provides this',
      line
    });
  }

  // <meta charset
  const metaCharsetLine = firstLineRegex(content, /<meta\s+charset/i);
  if (metaCharsetLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <meta charset> — template provides this',
      line: metaCharsetLine
    });
  }

  // <meta name="viewport"
  const metaViewportLine = firstLineRegex(content, /<meta\s+name\s*=\s*["']viewport["']/i);
  if (metaViewportLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <meta name="viewport"> — template provides this',
      line: metaViewportLine
    });
  }

  // Main stylesheet link
  const mainCssLine = firstLineRegex(content, /<link\s+rel\s*=\s*["']stylesheet["']\s+href\s*=\s*["']\.\.\/styles\.css["']/i);
  if (mainCssLine) {
    issues.push({
      check: 'CHECK_4',
      severity: 'CRITICAL',
      detail: 'Contains <link rel="stylesheet" href="../styles.css"> — template provides this',
      line: mainCssLine
    });
  }
}

function check5_noDuplicateInfra(content, issues) {
  // Infrastructure IDs
  const infraIds = [
    { id: 'docs-theme-toggle', desc: 'theme toggle button' },
    { id: 'docs-sidebar', desc: 'sidebar' },
    { id: 'docs-header', desc: 'header' },
    { id: 'docs-search-toggle', desc: 'search toggle button' },
    { id: 'docs-sidebar-open', desc: 'sidebar open button' }
  ];

  for (const { id, desc } of infraIds) {
    const regex = new RegExp(`id\\s*=\\s*["']${id}["']`, 'i');
    const line = firstLineRegex(content, regex);
    if (line) {
      issues.push({
        check: 'CHECK_5',
        severity: 'CRITICAL',
        detail: `Contains id="${id}" (${desc}) — template provides this`,
        line
      });
    }
  }

  // Mandatory template scripts
  const templateScripts = [
    'docs-sidebar-loader.js',
    'docs-sidebar-toggle.js',
    'docs-sidebar.js',
    'docs-header-search.js',
    'docs-search.js',
    'docs-theme-toggle.js',
    'docs-tabs.js'
  ];

  for (const scriptName of templateScripts) {
    const regex = new RegExp(`<script\\s+src\\s*=\\s*["'][^"']*${scriptName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i');
    const line = firstLineRegex(content, regex);
    if (line) {
      issues.push({
        check: 'CHECK_5',
        severity: 'CRITICAL',
        detail: `Contains <script src="${scriptName}"> — template provides this`,
        line
      });
    }
  }
}

function check6_markerOrder(content, issues) {
  const stylesPos = content.indexOf(MARKERS.STYLES_OPEN);
  const bodyPos = content.indexOf(MARKERS.BODY_OPEN);
  const scriptsPos = content.indexOf(MARKERS.SCRIPTS_OPEN);

  // Only check if the markers exist
  if (stylesPos !== -1 && bodyPos !== -1 && stylesPos > bodyPos) {
    issues.push({
      check: 'CHECK_6',
      severity: 'WARNING',
      detail: 'STYLES marker appears after BODY marker — expected STYLES before BODY',
      line: firstLine(content, MARKERS.STYLES_OPEN)
    });
  }

  if (scriptsPos !== -1 && bodyPos !== -1 && scriptsPos < bodyPos) {
    issues.push({
      check: 'CHECK_6',
      severity: 'WARNING',
      detail: 'SCRIPTS marker appears before BODY marker — expected SCRIPTS after BODY',
      line: firstLine(content, MARKERS.SCRIPTS_OPEN)
    });
  }

  if (stylesPos !== -1 && scriptsPos !== -1 && stylesPos > scriptsPos) {
    issues.push({
      check: 'CHECK_6',
      severity: 'WARNING',
      detail: 'STYLES marker appears after SCRIPTS marker — expected order: STYLES, BODY, SCRIPTS',
      line: firstLine(content, MARKERS.STYLES_OPEN)
    });
  }
}

function check7_contentOutsideMarkers(content, issues) {
  const lines = content.split('\n');

  // Find first and last marker positions
  const allMarkerStrings = Object.values(MARKERS);
  let firstMarkerLine = null;
  let lastMarkerLine = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (allMarkerStrings.some(m => trimmed === m)) {
      if (firstMarkerLine === null) firstMarkerLine = i;
      lastMarkerLine = i;
    }
  }

  if (firstMarkerLine === null) return; // No markers at all — CHECK_1 catches this

  // Check content before first marker
  for (let i = 0; i < firstMarkerLine; i++) {
    if (lines[i].trim().length > 0) {
      issues.push({
        check: 'CHECK_7',
        severity: 'INFO',
        detail: `Non-whitespace content before first marker: "${lines[i].trim().substring(0, 80)}"`,
        line: i + 1
      });
      break; // Only report once for "before"
    }
  }

  // Check content after last marker
  for (let i = lastMarkerLine + 1; i < lines.length; i++) {
    if (lines[i].trim().length > 0) {
      issues.push({
        check: 'CHECK_7',
        severity: 'INFO',
        detail: `Non-whitespace content after last marker: "${lines[i].trim().substring(0, 80)}"`,
        line: i + 1
      });
      break; // Only report once for "after"
    }
  }
}

function check8_markerUniqueness(content, issues) {
  const markerChecks = [
    { marker: MARKERS.STYLES_OPEN, name: '<!-- STYLES -->' },
    { marker: MARKERS.STYLES_CLOSE, name: '<!-- /STYLES -->' },
    { marker: MARKERS.BODY_OPEN, name: '<!-- BODY -->' },
    { marker: MARKERS.BODY_CLOSE, name: '<!-- /BODY -->' },
    { marker: MARKERS.SCRIPTS_OPEN, name: '<!-- SCRIPTS -->' },
    { marker: MARKERS.SCRIPTS_CLOSE, name: '<!-- /SCRIPTS -->' }
  ];

  for (const { marker, name } of markerChecks) {
    const occurrences = findLineNumbers(content, marker);
    if (occurrences.length > 1) {
      issues.push({
        check: 'CHECK_8',
        severity: 'CRITICAL',
        detail: `Duplicate marker ${name} found ${occurrences.length} times (lines: ${occurrences.join(', ')})`,
        line: occurrences[1] // Report second occurrence
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Main audit
// ---------------------------------------------------------------------------

function auditFragment(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  check1_requiredBody(content, issues);
  check2_stylesPaired(content, issues);
  check3_scriptsPaired(content, issues);
  check4_noBoilerplate(content, issues);
  check5_noDuplicateInfra(content, issues);
  check6_markerOrder(content, issues);
  check7_contentOutsideMarkers(content, issues);
  check8_markerUniqueness(content, issues);

  return issues;
}

function run() {
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();

  const result = {
    totalFragments: files.length,
    valid: [],
    violations: [],
    summary: {
      critical: 0,
      warning: 0,
      info: 0
    }
  };

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const issues = auditFragment(filePath);

    if (issues.length === 0) {
      result.valid.push(file);
    } else {
      result.violations.push({ file, issues });

      for (const issue of issues) {
        if (issue.severity === 'CRITICAL') result.summary.critical++;
        else if (issue.severity === 'WARNING') result.summary.warning++;
        else if (issue.severity === 'INFO') result.summary.info++;
      }
    }
  }

  // Output: --json flag outputs full JSON, otherwise concise summary
  var jsonMode = process.argv.includes('--json');

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    // Concise CI-friendly output
    if (result.violations.length > 0) {
      for (var v of result.violations) {
        for (var issue of v.issues) {
          console.log(`  ${v.file}:${issue.line} [${issue.severity}] ${issue.detail}`);
        }
      }
    }
    console.log('\n' + '='.repeat(60));
    if (result.summary.critical === 0 && result.summary.warning === 0) {
      console.log(`Fragment-Lint: ${result.totalFragments} Fragmente geprueft, keine Probleme.`);
    } else {
      console.log(`Fragment-Lint: ${result.summary.critical} CRITICAL, ${result.summary.warning} WARNING in ${result.violations.length} Datei(en).`);
    }
  }

  // Exit code: non-zero if critical issues found
  if (result.summary.critical > 0) {
    process.exit(1);
  }
}

run();
