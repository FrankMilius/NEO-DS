#!/usr/bin/env node
// ==========================================================================
// Docs Build Script — Template-System für Dokumentationsseiten
// ==========================================================================
// Generiert HTML-Dateien aus _template.html + Content-Fragmenten.
// Keine externen Dependencies — nur Node.js fs/path.
//
// Usage:
//   node scripts/build-docs.cjs          Build alle Seiten
//   node scripts/build-docs.cjs --watch  Watch-Modus
//   node scripts/build-docs.cjs --extract  Extrahiere Content aus bestehenden HTML-Dateien
//   ... --only=a,b      nur diese Seiten (Build und Extract)
//   ... --extract --force   vorhandene Inhaltsdatei ueberschreiben (Seite -> Quelle)
//   node scripts/build-docs.cjs --check    Exit 1, wenn eine fertige Seite nicht
//                                          mehr aus ihrer Inhaltsdatei entsteht
//                                          (= von Hand geaendert, Entscheidung
//                                          29.09.2026: Inhaltsdatei ist die Quelle)
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const CONTENT_DIR = path.join(DOCS_DIR, 'content');
const TEMPLATE_PATH = path.join(DOCS_DIR, '_template.html');
const PAGES_PATH = path.join(DOCS_DIR, '_pages.json');

const ARGS = process.argv.slice(2);
const ONLY = (ARGS.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const FORCE = ARGS.includes('--force');
const auswahl = (pages) => (ONLY.length ? pages.filter((p) => ONLY.includes(p.slug)) : pages);

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
        // Skripte, die die Vorlage schon laedt, nicht doppelt uebernehmen —
        // sonst binden docs-tabs/docs-toc ihre Handler zweimal.
        const vorlage = readFile(TEMPLATE_PATH);
        scripts = scriptMatches.filter(s => !vorlage.includes(s)).map(s => '  ' + s).join('\n');
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

  for (const page of auswahl(pages)) {
    const contentFile = path.join(CONTENT_DIR, `${page.slug}.html`);

    // Nicht überschreiben wenn Content-Fragment bereits existiert (ausser --force)
    if (fileExists(contentFile) && !FORCE) {
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

function renderPage(page, template) {
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
  } else {
    // Ohne BODY-Marker waere der Inhalt leer — die Seite wuerde mit leerem
    // Inhaltsbereich ueberschrieben. So geschehen am 09.09.2026 mit
    // form-field-docs.html (−1.468 Zeilen, Befund 29.09.2026).
    console.warn(`  ⚠ ${slug}: content/${slug}.html ohne <!-- /BODY --> — Seite NICHT ueberschrieben`);
    return false;
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

  return html;
}

function ausgabeDatei(slug) {
  return slug === 'index'
    ? path.join(DOCS_DIR, 'index.html')
    : path.join(DOCS_DIR, `${slug}-docs.html`);
}

function buildPage(page, template) {
  const html = renderPage(page, template);
  if (html === false) return false;
  writeFile(ausgabeDatei(page.slug), html);
  return true;
}

function runBuild() {
  const pages = JSON.parse(readFile(PAGES_PATH));
  const template = readFile(TEMPLATE_PATH);

  let built = 0;
  let skipped = 0;

  for (const page of auswahl(pages)) {
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

function runCheck() {
  const pages = JSON.parse(readFile(PAGES_PATH));
  const template = readFile(TEMPLATE_PATH);
  const abweichend = [];
  for (const page of auswahl(pages)) {
    const html = renderPage(page, template);
    const datei = ausgabeDatei(page.slug);
    if (html === false) { abweichend.push(path.basename(datei) + ' (Inhaltsdatei fehlt oder unvollstaendig)'); continue; }
    if (!fileExists(datei) || readFile(datei) !== html) abweichend.push(path.basename(datei));
  }
  if (abweichend.length) {
    console.error(`  ✗ ${abweichend.length} Seite(n) entstehen nicht aus ihrer Inhaltsdatei:`);
    console.error('    ' + abweichend.join('\n    '));
    console.error('  → Aenderung in docs/content/<slug>.html machen und `npm run docs:build`,');
    console.error('    oder den Stand der Seite uebernehmen: node scripts/build-docs.cjs --extract --force --only=<slug>');
    process.exit(1);
  }
  console.log('  ✓ Alle Docs-Seiten entstehen aus ihren Inhaltsdateien.');
}

const args = ARGS;

if (args.includes('--check')) {
  runCheck();
} else if (args.includes('--extract')) {
  console.log('Extracting content fragments from existing HTML files...\n');
  runExtract();
} else if (args.includes('--watch')) {
  runWatch();
} else {
  console.log('Building documentation pages...\n');
  runBuild();
}
