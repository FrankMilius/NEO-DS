#!/usr/bin/env node
// ==========================================================================
// Docs Token Lint: Prueft Content-Fragmente auf hardcodierte Farbwerte
// ==========================================================================
// Stellt sicher, dass Docs-Seiten semantische Tokens verwenden.
// Laueft als Teil von `npm test`.
//
// Usage:
//   node scripts/lint-docs-tokens.cjs
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'docs', 'content');

// -------------------------------------------------------------------------
// Dateien die komplett uebersprungen werden (intentionale Dokumentation)
// -------------------------------------------------------------------------
const SKIP_FILES = new Set([
  'color.html',      // Palette/Primitives Dokumentation
  'themes.html',     // Theme-Swatches Dokumentation
]);

// -------------------------------------------------------------------------
// Regeln fuer Docs Content-Fragmente
// -------------------------------------------------------------------------
const rules = [
  {
    name: 'hardcoded-hex-in-style',
    // Hex-Farbe in style= Attribut oder <style> Block
    pattern: /#(?:[0-9a-fA-F]{3}){1,2}\b/g,
    message: 'Hardcodierter Hex-Farbwert. Nutze var(--fnd-color-*) semantische Tokens.',
    // Erlaubt in: HTML-escaped Code-Beispielen, Kommentaren, code/pre Inhalte
    skipLine: function (line) {
      // Skip HTML-escaped code examples (&lt; means it's displayed, not rendered)
      if (/&lt;/.test(line)) return true;
      // Skip lines inside <code> or <pre> tags (documentation examples)
      if (/<code[^>]*>.*#[0-9a-fA-F]/.test(line)) return true;
      // Skip HTML/JS comments
      if (/^\s*\/\//.test(line)) return true;
      if (/^\s*\/\*/.test(line)) return true;
      if (/<!--/.test(line)) return true;
      // Skip CSS custom property definitions (showing token resolution)
      if (/--[a-z].*:\s*#/.test(line)) return true;
      return false;
    },
  },
  {
    name: 'hardcoded-hex-in-inline-style',
    // Specifically target style="...#hex..." which is a rendered inline style
    pattern: /style="[^"]*#(?:[0-9a-fA-F]{3}){1,2}\b/g,
    message: 'Hardcodierter Hex-Farbwert in inline style. Nutze var(--fnd-color-*) Token.',
    skipLine: function (line) {
      // Skip HTML-escaped examples
      if (/&lt;/.test(line)) return true;
      return false;
    },
  },
  {
    name: 'hardcoded-rgb-in-style',
    pattern: /(?:background|color|border-color|fill|stroke):\s*rgba?\(\s*\d/g,
    message: 'Hardcodierter rgb()/rgba() Farbwert. Nutze color-mix() mit semantischen Tokens.',
    skipLine: function (line) {
      if (/&lt;/.test(line)) return true;
      if (/<code/.test(line)) return true;
      if (/^\s*\/\//.test(line)) return true;
      return false;
    },
  },
  {
    name: 'legacy-neo-color-token',
    pattern: /var\(--neo-color-/g,
    message: 'Legacy --neo-color-* Token. Ersetze durch --fnd-color-* semantische Tokens.',
    skipLine: function (line) {
      if (/&lt;/.test(line)) return true;
      if (/<code/.test(line)) return true;
      if (/^\s*\/\//.test(line)) return true;
      return false;
    },
  },
  {
    name: 'deprecated-ds-token',
    pattern: /var\(--ds-/g,
    message: 'Deprecated --ds-* Token. Ersetze durch --fnd-* oder --nc-* Tokens.',
    skipLine: function (line) {
      // Allow in documentation text explaining the migration
      if (/&lt;/.test(line)) return true;
      if (/<code/.test(line)) return true;
      if (/^\s*\/\//.test(line)) return true;
      // Allow if it's showing old→new mapping
      if (/migration|deprecated|alt:|vorher/i.test(line)) return true;
      return false;
    },
  },
];

// -------------------------------------------------------------------------
// Context detection: are we inside a <style> block or style= attribute?
// Only flag hex colors that are in CSS context (not HTML content)
// -------------------------------------------------------------------------
function isInStyleContext(lines, lineIndex) {
  const line = lines[lineIndex];

  // Inline style attribute
  if (/style="[^"]*$/.test(line) || /style="/.test(line)) return true;

  // Inside a <style> block?
  let inStyle = false;
  for (let i = 0; i <= lineIndex; i++) {
    if (/<style/.test(lines[i])) inStyle = true;
    if (/<\/style>/.test(lines[i])) inStyle = false;
  }
  return inStyle;
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------
let totalErrors = 0;
let totalFiles = 0;

const files = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

for (const file of files) {
  if (SKIP_FILES.has(file)) continue;

  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let fileErrors = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const rule of rules) {
      // Skip if the line matches an exclusion
      if (typeof rule.skipLine === 'function' && rule.skipLine(line)) continue;

      // For generic hex rule, only flag if in CSS context
      if (rule.name === 'hardcoded-hex-in-style') {
        if (!isInStyleContext(lines, i)) continue;
      }

      // Reset regex lastIndex
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(line)) {
        if (fileErrors === 0) {
          console.log(`\ncontent/${file}:`);
          totalFiles++;
        }
        console.log(`  Zeile ${i + 1}: [${rule.name}] ${rule.message}`);
        console.log(`    > ${line.trim().substring(0, 120)}`);
        fileErrors++;
        totalErrors++;
      }
    }
  }
}

console.log('\n' + '='.repeat(60));
if (totalErrors === 0) {
  console.log('Docs-Token-Lint: Keine Probleme gefunden.');
  process.exit(0);
} else {
  console.log(`Docs-Token-Lint: ${totalErrors} Problem(e) in ${totalFiles} Datei(en).`);
  console.log('Ersetze hardcodierte Werte durch semantische Foundation-Tokens.');
  process.exit(1);
}
