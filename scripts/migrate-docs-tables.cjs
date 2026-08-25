#!/usr/bin/env node
/**
 * Einmal-Migration: .docs__table → .nc-data-table--static
 *
 * Transformiert alle <table class="docs__table"> in docs/content/*.html
 * zu einem .nc-data-table Wrapper-Pattern mit --static Modifier.
 *
 * Aufruf: node scripts/migrate-docs-tables.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT_DIR = path.join(__dirname, '..', 'docs', 'content');

// Regex: <table class="docs__table..."> mit optionalem --compact Modifier,
// optionalen Extra-Klassen und optionalen weiteren Attributen (style, etc.)
const TABLE_OPEN_RE = /<table\s+class="docs__table(?:\s+docs__table--compact)?(?:\s+[^"]*?)?"(?:\s+[^>]*)?\s*>/g;

let totalFiles = 0;
let totalTables = 0;

const files = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Zaehle Treffer
  const matches = content.match(TABLE_OPEN_RE);
  if (!matches) continue;

  let fileCount = 0;

  // Ersetze jede <table class="docs__table..."> Zeile
  content = content.replace(TABLE_OPEN_RE, (match) => {
    fileCount++;

    const isCompact = match.includes('docs__table--compact');
    const wrapperClasses = ['nc-data-table', 'nc-data-table--static'];
    if (isCompact) wrapperClasses.push('nc-data-table--compact');
    wrapperClasses.push('nc-data-table--striped');

    // Extra-Attribute (style, etc.) vom <table> auf den Wrapper verschieben
    // Entferne class="..." und extrahiere verbleibende Attribute
    const withoutTag = match.replace(/^<table\s+/, '').replace(/\s*>$/, '');
    const withoutClass = withoutTag.replace(/class="[^"]*"/, '').trim();
    const wrapperAttrs = withoutClass ? ` ${withoutClass}` : '';

    return `<div class="${wrapperClasses.join(' ')}"${wrapperAttrs}>\n` +
           `INDENT_PLACEHOLDER<table class="nc-data-table__table"><!-- MIGRATED -->`;
  });

  // Jetzt mit Zeilenkontext die Einrueckung fixieren
  const lines = content.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('INDENT_PLACEHOLDER')) {
      // Vorherige Zeile hat den <div> — ermittle dessen Einrueckung
      const prevLine = result[result.length - 1];
      const indentMatch = prevLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      // <div> auf vorheriger Zeile bekommt die Einrueckung
      result[result.length - 1] = indent + prevLine.trimStart();

      // <table> bekommt eine Ebene mehr Einrueckung
      result.push(indent + '  ' + line.replace('INDENT_PLACEHOLDER', '').trimStart());
    } else {
      result.push(line);
    }
  }

  // Jetzt </table> → </table>\n</div> fuer migrierte Tabellen
  // Nur Tabellen mit <!-- MIGRATED --> Marker tracken (nicht pre-existierende)
  let output = result.join('\n');

  const finalLines = output.split('\n');
  const finalResult = [];
  let insideStaticTable = 0;

  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i];

    if (line.includes('<!-- MIGRATED -->')) {
      insideStaticTable++;
      // Marker entfernen
      finalResult.push(line.replace('<!-- MIGRATED -->', ''));
      continue;
    }

    if (insideStaticTable > 0 && line.trim() === '</table>') {
      insideStaticTable--;
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      // Wrapper-<div> schliesst eine Ebene weniger eingerueckt
      const wrapperIndent = indent.length >= 2 ? indent.slice(2) : indent;
      finalResult.push(line);
      finalResult.push(wrapperIndent + '</div>');
      continue;
    }

    finalResult.push(line);
  }

  const finalContent = finalResult.join('\n');

  if (finalContent !== fs.readFileSync(filePath, 'utf8')) {
    totalFiles++;
    totalTables += fileCount;

    if (DRY_RUN) {
      console.log(`[DRY-RUN] ${file}: ${fileCount} Tabelle(n)`);
    } else {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✓ ${file}: ${fileCount} Tabelle(n) migriert`);
    }
  }
}

console.log(`\n${DRY_RUN ? '[DRY-RUN] ' : ''}Fertig: ${totalTables} Tabellen in ${totalFiles} Dateien.`);
