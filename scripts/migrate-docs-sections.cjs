#!/usr/bin/env node
// ==========================================================================
// Migration: .docs → Sections (Hero / Tab-Nav / Body)
// ==========================================================================
// Transformiert alle docs/content/*.html Fragmente:
//   1. Wraps h1 + subtitle in .docs__hero
//   2. Extracts .docs-tabs__list into .docs__tab-nav (tabbed pages)
//   3. Wraps remaining content (panels/sections) in .docs__body
//
// Verwendung: node scripts/migrate-docs-sections.js [--dry-run]
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'docs', 'content');
const DRY_RUN = process.argv.includes('--dry-run');

// Zaehler
let totalFiles = 0;
let tabbedFiles = 0;
let nonTabbedFiles = 0;
let skippedFiles = 0;
let errorFiles = [];

// -----------------------------------------------------------------------
// Hilfsfunktionen
// -----------------------------------------------------------------------

/**
 * Findet den Schliess-Index eines Tags auf gleicher Verschachtelungsebene.
 * Sucht ab startIndex nach dem passenden </tagName> zum oeffnenden Tag.
 */
function findClosingTag(html, tagName, openTagEnd) {
  const openTag = '<' + tagName;
  const closeTag = '</' + tagName;
  let depth = 1;
  let pos = openTagEnd;

  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf(openTag, pos);
    const nextClose = html.indexOf(closeTag, pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Pruefe ob es ein echtes open-Tag ist (naechstes Zeichen muss Whitespace oder > sein)
      var charAfter = html[nextOpen + openTag.length];
      if (charAfter === ' ' || charAfter === '>' || charAfter === '\n' || charAfter === '\r' || charAfter === '\t') {
        depth++;
      }
      pos = nextOpen + openTag.length + 1;
    } else {
      depth--;
      // Finde das Ende des Close-Tags (das >)
      var closeEnd = html.indexOf('>', nextClose);
      if (depth === 0) {
        return closeEnd + 1;
      }
      pos = closeEnd + 1;
    }
  }

  return -1;
}

/**
 * Extrahiert den Indent eines bestimmten Bereichs (Whitespace vor einem Tag).
 */
function getIndent(html, pos) {
  let start = pos;
  while (start > 0 && html[start - 1] !== '\n') start--;
  return html.substring(start, pos);
}

// -----------------------------------------------------------------------
// Hauptlogik: Seite transformieren
// -----------------------------------------------------------------------

function transformPage(html, filePath) {
  // Pruefe ob bereits migriert
  if (html.includes('class="docs__hero"') || html.includes("class='docs__hero'")) {
    return { html, changed: false, reason: 'already migrated' };
  }

  // Finde <main class="docs">
  const mainMatch = html.match(/<main\s+class="docs">/);
  if (!mainMatch) {
    return { html, changed: false, reason: 'no <main class="docs"> found' };
  }
  const mainStart = mainMatch.index;
  const mainOpenEnd = mainStart + mainMatch[0].length;

  // Finde </main> — mit Tag-Tiefe, da Template-Previews verschachtelte <main> enthalten koennen
  const mainCloseEnd = findClosingTag(html, 'main', mainOpenEnd);
  if (mainCloseEnd === -1) {
    return { html, changed: false, reason: 'no </main> found' };
  }
  const mainCloseIdx = html.lastIndexOf('</main', mainCloseEnd);

  // Extrahiere den Inhalt innerhalb von <main class="docs">...</main>
  let innerContent = html.substring(mainOpenEnd, mainCloseIdx);

  // --- Finde H1 ---
  const h1Match = innerContent.match(/<h1\s+class="docs__title">/);
  if (!h1Match) {
    return { html, changed: false, reason: 'no h1.docs__title found' };
  }
  const h1Start = h1Match.index;
  const h1End = findClosingTag(innerContent, 'h1', h1Start + h1Match[0].length);
  if (h1End === -1) {
    return { html, changed: false, reason: 'could not find closing </h1>' };
  }
  const h1Block = innerContent.substring(h1Start, h1End);

  // --- Finde Subtitle (p.docs__subtitle) ---
  // Suche nach dem h1
  const afterH1 = innerContent.substring(h1End);
  const subtitleMatch = afterH1.match(/<p\s+class="docs__subtitle">/);
  if (!subtitleMatch) {
    return { html, changed: false, reason: 'no p.docs__subtitle found' };
  }
  const subtitleStart = h1End + subtitleMatch.index;
  const subtitleOpenEnd = subtitleStart + subtitleMatch[0].length;
  const subtitleEnd = findClosingTag(innerContent, 'p', subtitleOpenEnd);
  if (subtitleEnd === -1) {
    return { html, changed: false, reason: 'could not find closing </p> for subtitle' };
  }
  const subtitleBlock = innerContent.substring(subtitleStart, subtitleEnd);

  // Alles VOR dem h1 (Kommentare, Whitespace)
  const beforeH1 = innerContent.substring(0, h1Start);

  // Alles NACH dem Subtitle
  let afterSubtitle = innerContent.substring(subtitleEnd);

  // Bestimme Indent (normalerweise 6 Spaces fuer Content innerhalb main)
  const baseIndent = '      ';

  // --- Pruefe ob Tabs vorhanden ---
  const tabsMatch = afterSubtitle.match(/<div\s+class="docs-tabs"\s+id="[^"]*">/);
  const hasTabs = !!tabsMatch;

  let newInnerContent;

  if (hasTabs) {
    // ===== TABBED PAGE =====
    tabbedFiles++;

    // Finde den .docs-tabs Container
    const tabsStart = afterSubtitle.indexOf(tabsMatch[0]);
    const tabsOpenEnd = tabsStart + tabsMatch[0].length;

    // Finde .docs-tabs__list innerhalb
    const tabListMatch = afterSubtitle.match(/<div\s+class="docs-tabs__list"\s+role="tablist"[^>]*>/);
    if (!tabListMatch) {
      return { html, changed: false, reason: 'tabs found but no tablist' };
    }

    const tabListStart = afterSubtitle.indexOf(tabListMatch[0]);
    const tabListOpenEnd = tabListStart + tabListMatch[0].length;
    const tabListEnd = findClosingTag(afterSubtitle, 'div', tabListOpenEnd);
    if (tabListEnd === -1) {
      return { html, changed: false, reason: 'could not find closing tag for tablist' };
    }

    const tabListBlock = afterSubtitle.substring(tabListStart, tabListEnd).trim();

    // Alles zwischen tabsOpen und tabsClose, OHNE die tabList
    // Finde das Ende des .docs-tabs Containers
    const tabsCloseIdx = findClosingTag(afterSubtitle, 'div', tabsOpenEnd);
    if (tabsCloseIdx === -1) {
      return { html, changed: false, reason: 'could not find closing tag for docs-tabs' };
    }

    // Content innerhalb docs-tabs NACH der tab-list
    const afterTabList = afterSubtitle.substring(tabListEnd, tabsCloseIdx);

    // Finde den Abschluss-Kommentar <!-- /.docs-tabs -->
    const tabsCloseComment = afterSubtitle.substring(tabsCloseIdx).match(/^(\s*<!--\s*\/\.docs-tabs\s*-->)?/);
    const tabsFullEnd = tabsCloseIdx + (tabsCloseComment ? tabsCloseComment[0].length : 0);

    // Content vor den Tabs (z.B. Kommentare)
    const beforeTabs = afterSubtitle.substring(0, tabsStart);

    // Content nach den Tabs (vor </main>)
    const afterTabs = afterSubtitle.substring(tabsFullEnd);

    // Die Panels kommen als .docs-tabs Container (ohne die List)
    // Wir behalten die .docs-tabs Wrapper um die Panels
    const tabsId = tabsMatch[0].match(/id="([^"]*)"/)[1];
    const panelsContent = afterTabList.trim();

    newInnerContent =
      beforeH1 +
      baseIndent + '<div class="docs__hero">\n' +
      baseIndent + '  ' + h1Block.trim() + '\n' +
      baseIndent + '  ' + subtitleBlock.trim() + '\n' +
      baseIndent + '</div>\n' +
      '\n' +
      baseIndent + '<div class="docs__tab-nav">\n' +
      baseIndent + '  ' + tabListBlock + '\n' +
      baseIndent + '</div>\n' +
      '\n' +
      baseIndent + '<div class="docs__body">\n' +
      baseIndent + '  <div class="docs-tabs" id="' + tabsId + '">\n' +
      panelsContent + '\n' +
      baseIndent + '  </div><!-- /.docs-tabs -->\n' +
      baseIndent + '</div>\n' +
      afterTabs;

  } else {
    // ===== NON-TABBED PAGE =====
    nonTabbedFiles++;

    // Alles nach dem Subtitle ist der Body-Content
    const bodyContent = afterSubtitle.trim();

    newInnerContent =
      beforeH1 +
      baseIndent + '<div class="docs__hero">\n' +
      baseIndent + '  ' + h1Block.trim() + '\n' +
      baseIndent + '  ' + subtitleBlock.trim() + '\n' +
      baseIndent + '</div>\n' +
      '\n' +
      baseIndent + '<div class="docs__body">\n' +
      '    ' + bodyContent + '\n' +
      baseIndent + '</div>\n';
  }

  const newHtml =
    html.substring(0, mainOpenEnd) +
    '\n' + newInnerContent +
    '\n    ' + html.substring(mainCloseIdx);

  return { html: newHtml, changed: true };
}

// -----------------------------------------------------------------------
// Alle Dateien verarbeiten
// -----------------------------------------------------------------------

const files = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log('Docs Sections Migration (Content-Fragmente)');
console.log('============================================');
console.log('Modus:', DRY_RUN ? 'DRY RUN (keine Aenderungen)' : 'LIVE');
console.log('Dateien gefunden:', files.length);
console.log('');

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  totalFiles++;

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const result = transformPage(html, filePath);

    if (result.changed) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, result.html, 'utf8');
      }
      console.log('  OK  ' + file);
    } else {
      skippedFiles++;
      console.log('  SKIP ' + file + ' (' + result.reason + ')');
    }
  } catch (err) {
    errorFiles.push(file);
    console.error('  ERR  ' + file + ': ' + err.message);
  }
}

console.log('');
console.log('Ergebnis:');
console.log('  Total:      ' + totalFiles);
console.log('  Mit Tabs:   ' + tabbedFiles);
console.log('  Ohne Tabs:  ' + nonTabbedFiles);
console.log('  Uebersprungen: ' + skippedFiles);
console.log('  Fehler:     ' + errorFiles.length);
if (errorFiles.length > 0) {
  console.log('  Fehlerdateien: ' + errorFiles.join(', '));
}
