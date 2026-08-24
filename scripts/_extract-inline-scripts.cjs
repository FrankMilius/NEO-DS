#!/usr/bin/env node
// ==========================================================================
// Extract Inline Scripts from Content Fragments
// ==========================================================================
// Extracts large inline <script> blocks (>= 40 lines) from docs/content/*.html
// into separate docs/{slug}-docs.js files.
//
// - Preserves existing <script src="..."> tags
// - Skips extraction if {slug}-docs.js already exists
// - Wraps extracted code in IIFE if not already wrapped
// - Replaces inline <script> with <script src="{slug}-docs.js">
//
// Usage:
//   node scripts/_extract-inline-scripts.js
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const CONTENT_DIR = path.join(DOCS_DIR, 'content');
const MIN_LINES = 40;

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

/**
 * Derive a human-readable label from a slug, e.g. "card-events" -> "Card Events"
 */
function slugToLabel(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Check whether the given JS source is already wrapped in an IIFE.
 * Recognises both `(function () { ... })();` and `(() => { ... })();` forms.
 * Also handles leading single-line comments before the IIFE.
 */
function isWrappedInIIFE(src) {
  const trimmed = src.trim();

  // Strip leading single-line comments (// ...) to get to the actual code
  const withoutLeadingComments = trimmed.replace(/^(\s*\/\/[^\n]*\n)+/, '').trim();

  // Pattern 1: (function ... { ... })();
  if (/^\(function\s*\(/.test(withoutLeadingComments) && /\}\s*\)\s*\(\s*\)\s*;?\s*$/.test(withoutLeadingComments)) {
    return true;
  }

  // Pattern 2: (() => { ... })();
  if (/^\(\(\)\s*=>/.test(withoutLeadingComments) && /\}\s*\)\s*\(\s*\)\s*;?\s*$/.test(withoutLeadingComments)) {
    return true;
  }

  return false;
}

/**
 * Dedent a block of code: remove the common leading whitespace from all
 * non-empty lines so the extracted file uses clean 2-space indentation.
 */
function dedent(code) {
  const lines = code.split('\n');

  // Find minimum indentation across non-empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^(\s*)/);
    if (match && match[1].length < minIndent) {
      minIndent = match[1].length;
    }
  }

  if (minIndent === Infinity || minIndent === 0) return code;

  return lines
    .map(line => (line.trim().length === 0 ? '' : line.slice(minIndent)))
    .join('\n');
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------

console.log('\n=== Inline Script Extraction ===\n');

const fragmentFiles = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

let extractedCount = 0;
let skippedExistsCount = 0;
let skippedSmallCount = 0;
let noScriptsCount = 0;

for (const file of fragmentFiles) {
  const slug = file.replace('.html', '');
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Find the <!-- SCRIPTS --> ... <!-- /SCRIPTS --> block
  const scriptsBlockMatch = content.match(
    /<!-- SCRIPTS -->([\s\S]*?)<!-- \/SCRIPTS -->/
  );

  if (!scriptsBlockMatch) {
    continue; // No SCRIPTS block at all
  }

  const scriptsBlock = scriptsBlockMatch[1];
  const scriptsBlockFull = scriptsBlockMatch[0];

  // 2. Find inline <script>...</script> tags (NOT <script src="...">)
  //    We need to match <script> that does NOT have a src attribute.
  const inlineScriptRegex = /<script>[\s\S]*?<\/script>/g;
  const inlineMatches = [];
  let match;

  while ((match = inlineScriptRegex.exec(scriptsBlock)) !== null) {
    inlineMatches.push({
      fullMatch: match[0],
      index: match.index
    });
  }

  if (inlineMatches.length === 0) {
    continue; // No inline scripts
  }

  // 3. Process each inline script (typically only one per fragment)
  for (const inlineMatch of inlineMatches) {
    // Extract the JS code between <script> and </script>
    const jsCodeRaw = inlineMatch.fullMatch
      .replace(/^<script>\n?/, '')
      .replace(/\n?\s*<\/script>$/, '');

    // Count lines
    const lineCount = jsCodeRaw.split('\n').length;

    if (lineCount < MIN_LINES) {
      skippedSmallCount++;
      console.log(`  SKIP (${lineCount} lines < ${MIN_LINES}): ${file}`);
      continue;
    }

    // 4. Check if the target .js file already exists
    const jsFileName = `${slug}-docs.js`;
    const jsFilePath = path.join(DOCS_DIR, jsFileName);

    if (fs.existsSync(jsFilePath)) {
      skippedExistsCount++;
      console.log(`  WARN: ${jsFileName} already exists — skipping extraction from ${file}`);
      continue;
    }

    // 5. Dedent and prepare the JS code
    let jsCode = dedent(jsCodeRaw).trim();

    // 6. Wrap in IIFE if not already wrapped
    const alreadyIIFE = isWrappedInIIFE(jsCode);
    if (!alreadyIIFE) {
      // Indent all lines by 2 spaces and wrap
      const indented = jsCode
        .split('\n')
        .map(line => (line.trim().length === 0 ? '' : '  ' + line))
        .join('\n');
      jsCode = `(function () {\n${indented}\n})();`;
    }

    // 7. Build the file header
    const label = slugToLabel(slug);
    const header = `// ${label} Docs — Inline-Script extrahiert`;

    const fileContent = `${header}\n\n${jsCode}\n`;

    // 8. Write the .js file
    fs.writeFileSync(jsFilePath, fileContent, 'utf-8');
    console.log(`  EXTRACTED: ${file} (${lineCount} lines) -> ${jsFileName}${alreadyIIFE ? '' : ' [IIFE wrapped]'}`);

    // 9. Replace the inline <script>...</script> in the fragment with <script src="...">
    //    Detect the indentation of the original <script> tag
    const blockLines = scriptsBlock.split('\n');
    let scriptIndent = '';

    for (const line of blockLines) {
      if (line.includes(inlineMatch.fullMatch.split('\n')[0])) {
        const indentMatch = line.match(/^(\s*)/);
        if (indentMatch) {
          scriptIndent = indentMatch[1];
        }
        break;
      }
    }

    const replacement = `${scriptIndent}<script src="${jsFileName}"></script>`;
    const newContent = content.replace(inlineMatch.fullMatch, replacement);

    fs.writeFileSync(filePath, newContent, 'utf-8');
    extractedCount++;
  }
}

// -------------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
console.log(`Extracted: ${extractedCount}`);
console.log(`Skipped (already exists): ${skippedExistsCount}`);
console.log(`Skipped (< ${MIN_LINES} lines): ${skippedSmallCount}`);
console.log('='.repeat(60) + '\n');
