#!/usr/bin/env node
// ==========================================================================
// Docs Build Script — Template-System für Dokumentationsseiten
// ==========================================================================
// Generiert HTML-Dateien aus _template.html + Content-Fragmenten.
// Keine externen Dependencies — nur Node.js fs/path.
//
// Usage:
//   node scripts/build-docs.js          Build alle Seiten
//   node scripts/build-docs.js --watch  Watch-Modus
//   node scripts/build-docs.js --extract  Extrahiere Content aus bestehenden HTML-Dateien
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const CONTENT_DIR = path.join(DOCS_DIR, 'content');
const TEMPLATE_PATH = path.join(DOCS_DIR, '_template.html');
const PAGES_PATH = path.join(DOCS_DIR, '_pages.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ---------------------------------------------------------------------------
// Extract: Extrahiere Content-Fragmente aus bestehenden HTML-Dateien
// ---------------------------------------------------------------------------
// Extrahiert:
//   1. <style>-Block (zwischen <link rel="stylesheet"> und </head>)
//   2. <main>...</main> Inhalt
//   3. Benutzerdefinierte <script>-Tags (nach docs-theme-toggle.js)
// ---------------------------------------------------------------------------

function extractContent(page) {
  const slug = page.slug;
  const htmlFile = slug === 'index'
    ? path.join(DOCS_DIR, 'index.html')
    : path.join(DOCS_DIR, `${slug}-docs.html`);

  if (!fileExists(htmlFile)) {
    console.warn(`  SKIP: ${htmlFile} existiert nicht`);
    return null;
  }

  const html = readFile(htmlFile);

  // 1. Extrahiere <style>-Block
  let styles = '';
  if (page.customStyles) {
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
      styles = `  <style>${styleMatch[1]}</style>`;
    }
  }

  // 2. Extrahiere <main>...</main>
  const mainMatch = html.match(/(<main[\s\S]*?<\/main>)/);
  if (!mainMatch) {
    console.warn(`  WARN: Kein <main>-Tag gefunden in ${htmlFile}`);
    // Fallback: Versuche den Body-Content nach dem Sidebar-Aside
    const bodyMatch = html.match(/<aside[^>]*><\/aside>\s*([\s\S]*?)\s*<\/div>\s*<!--\s*\/\.docs-layout/);
    if (bodyMatch) {
      return { styles, body: bodyMatch[1].trim(), scripts: '' };
    }
    return null;
  }
  const body = '    ' + mainMatch[1];

  // 3. Extrahiere benutzerdefinierte Scripts (nach docs-theme-toggle.js)
  let scripts = '';
  if (page.customScript) {
    // Finde alle <script> Tags nach docs-theme-toggle.js
    const afterToggle = html.split('docs-theme-toggle.js');
    if (afterToggle.length > 1) {
      const tail = afterToggle[afterToggle.length - 1];
      const scriptMatches = tail.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/g);
      if (scriptMatches) {
        scripts = scriptMatches.map(s => '  ' + s).join('\n');
      }
    }
  }

  // Auch inline Scripts extrahieren (für Foundation-Seiten)
  const afterMain = html.split('</main>');
  if (afterMain.length > 1) {
    const tail = afterMain[afterMain.length - 1];
    const inlineScripts = tail.match(/<script>[\s\S]*?<\/script>/g);
    if (inlineScripts) {
      const inlineBlock = inlineScripts.map(s => '  ' + s).join('\n');
      scripts = scripts ? scripts + '\n' + inlineBlock : inlineBlock;
    }
  }

  return { styles, body, scripts };
}

function runExtract() {
  const pages = JSON.parse(readFile(PAGES_PATH));

  if (!fileExists(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  let extracted = 0;
  let skipped = 0;

  for (const page of pages) {
    const contentFile = path.join(CONTENT_DIR, `${page.slug}.html`);

    // Nicht überschreiben wenn Content-Fragment bereits existiert
    if (fileExists(contentFile)) {
      console.log(`  EXISTS: ${page.slug}.html (übersprungen)`);
      skipped++;
      continue;
    }

    const content = extractContent(page);
    if (!content) {
      skipped++;
      continue;
    }

    // Content-Fragment schreiben
    let fragment = '';
    if (content.styles) {
      fragment += `<!-- STYLES -->\n${content.styles}\n<!-- /STYLES -->\n\n`;
    }
    fragment += `<!-- BODY -->\n${content.body}\n<!-- /BODY -->`;
    if (content.scripts) {
      fragment += `\n\n<!-- SCRIPTS -->\n${content.scripts}\n<!-- /SCRIPTS -->`;
    }

    writeFile(contentFile, fragment);
    console.log(`  EXTRACTED: ${page.slug}.html`);
    extracted++;
  }

  console.log(`\nExtraction complete: ${extracted} extracted, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Build: Generiere HTML aus Template + Content-Fragmenten
// ---------------------------------------------------------------------------

function buildPage(page, template) {
  const slug = page.slug;
  const contentFile = path.join(CONTENT_DIR, `${slug}.html`);

  if (!fileExists(contentFile)) {
    console.warn(`  SKIP: ${contentFile} existiert nicht`);
    return false;
  }

  const content = readFile(contentFile);

  // Parse Content-Fragment: Styles, Body, Scripts
  let styles = '';
  let body = '';
  let scripts = '';

  const stylesMatch = content.match(/<!-- STYLES -->\n([\s\S]*?)\n<!-- \/STYLES -->/);
  if (stylesMatch) {
    styles = stylesMatch[1];
  }

  const bodyMatch = content.match(/<!-- BODY -->\n([\s\S]*?)\n<!-- \/BODY -->/);
  if (bodyMatch) {
    body = bodyMatch[1];
  }

  const scriptsMatch = content.match(/<!-- SCRIPTS -->\n([\s\S]*?)\n<!-- \/SCRIPTS -->/);
  if (scriptsMatch) {
    scripts = scriptsMatch[1];
  }

  // Template-Platzhalter ersetzen
  let html = template
    .replace('{{title}}', page.title)
    .replace('{{description}}', page.description)
    .replace('{{styles}}', styles)
    .replace('{{body}}', body)
    .replace('{{scripts}}', scripts);

  // Ausgabe-Datei
  const outFile = slug === 'index'
    ? path.join(DOCS_DIR, 'index.html')
    : path.join(DOCS_DIR, `${slug}-docs.html`);

  writeFile(outFile, html);
  return true;
}

function runBuild() {
  const pages = JSON.parse(readFile(PAGES_PATH));
  const template = readFile(TEMPLATE_PATH);

  let built = 0;
  let skipped = 0;

  for (const page of pages) {
    if (buildPage(page, template)) {
      console.log(`  BUILD: ${page.slug}-docs.html`);
      built++;
    } else {
      skipped++;
    }
  }

  console.log(`\nBuild complete: ${built} built, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Watch: Beobachte Content-Fragmente und Template auf Änderungen
// ---------------------------------------------------------------------------

function runWatch() {
  console.log('Watching for changes in docs/content/ and docs/_template.html...\n');

  // Erstmal initial bauen
  runBuild();

  // Template-Änderungen → alles neu bauen
  fs.watch(TEMPLATE_PATH, () => {
    console.log('\n_template.html changed — rebuilding all...');
    runBuild();
  });

  // Content-Änderungen → nur betroffene Seite neu bauen
  fs.watch(CONTENT_DIR, (eventType, filename) => {
    if (!filename || !filename.endsWith('.html')) return;

    const slug = filename.replace('.html', '');
    const pages = JSON.parse(readFile(PAGES_PATH));
    const page = pages.find(p => p.slug === slug);

    if (!page) {
      console.log(`  SKIP: ${filename} — kein Eintrag in _pages.json`);
      return;
    }

    console.log(`\n${filename} changed — rebuilding...`);
    const template = readFile(TEMPLATE_PATH);
    if (buildPage(page, template)) {
      console.log(`  REBUILT: ${slug}-docs.html`);
    }
  });

  // _pages.json-Änderungen → alles neu bauen
  fs.watch(PAGES_PATH, () => {
    console.log('\n_pages.json changed — rebuilding all...');
    runBuild();
  });
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--extract')) {
  console.log('Extracting content fragments from existing HTML files...\n');
  runExtract();
} else if (args.includes('--watch')) {
  runWatch();
} else {
  console.log('Building documentation pages...\n');
  runBuild();
}
