#!/usr/bin/env node
// CommonJS mit Absicht: package.json fuehrt "type": "module", eine .js-Datei
// gilt damit als ESM und `require` scheitert zur Laufzeit. Bis zum 24.08.2026
// brach deshalb `npm run build` am Icon-Schritt ab — der Ausweg war
// `npm run build:drupal`, das den Schritt ueberspringt. Ein Werkzeug, das
// stillschweigend nicht laeuft, vermisst niemand.
// ==========================================================================
// Tabler Icons Sync Script
// ==========================================================================
// Synchronisiert alle Outline-Icons aus @tabler/icons in die Icon-Bibliothek,
// organisiert nach den 41 offiziellen Tabler-Kategorien (ohne Prefix).
//
// Kategorien werden als Unterordner angelegt:
//   assets/icons/system/
//   assets/icons/brand/
//   assets/icons/arrows/
//   ...
//
// Bei Namenskollisionen mit bestehenden Custom-Kategorien werden
// Custom-Icons in den Tabler-Ordner gemerged.
//
// Normalisierung:
//   - stroke-width: 1.5 (statt Tabler-Standard 2)
//   - Farben: currentColor
//   - Entfernt Tabler-spezifische CSS-Klassen
//   - Entfernt XML-Deklarationen
//
// Ausfuehren:  npm run icons:sync
// ==========================================================================

var fs = require('fs');
var path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

var TABLER_SOURCE = path.resolve(__dirname, '../node_modules/@tabler/icons/icons/outline');
var TABLER_META   = path.resolve(__dirname, '../node_modules/@tabler/icons/icons.json');
var ICONS_DIR     = path.resolve(__dirname, '../assets/icons');
var TAGS_OUTPUT   = path.resolve(__dirname, '../data/tabler-tags.json');

// ---------------------------------------------------------------------------
// SVG Normalisierung
// ---------------------------------------------------------------------------

function normalizeSvg(svgContent) {
  var svg = svgContent;

  // stroke-width="2" → stroke-width="1.5"
  svg = svg.replace(/stroke-width="2"/g, 'stroke-width="1.5"');

  // Farb-Normalisierung (Strokes)
  svg = svg.replace(/stroke="#000000"/g, 'stroke="currentColor"');
  svg = svg.replace(/stroke="#000"/g, 'stroke="currentColor"');
  svg = svg.replace(/stroke="#111111"/g, 'stroke="currentColor"');

  // Farb-Normalisierung (Fills — aber nicht fill="none")
  svg = svg.replace(/fill="#000000"/g, 'fill="currentColor"');
  svg = svg.replace(/fill="#000"/g, 'fill="currentColor"');

  // Tabler CSS-Klassen entfernen (class="icon icon-tabler ...")
  svg = svg.replace(/\s*class="[^"]*icon-tabler[^"]*"/g, '');

  // XML-Deklarationen entfernen
  svg = svg.replace(/<\?xml[^?]*\?>\s*/g, '');

  // Whitespace trimmen
  svg = svg.trim();

  return svg;
}

// ---------------------------------------------------------------------------
// Kategorie-Name normalisieren (fuer Verzeichnisnamen)
// ---------------------------------------------------------------------------

function categoryToDirName(category) {
  // "Version control" → "version-control"
  return category.toLowerCase().replace(/\s+/g, '-');
}

// ---------------------------------------------------------------------------
// Alte Verzeichnisse migrieren (tabler-* Prefix → ohne Prefix)
// ---------------------------------------------------------------------------

function migrateOldPrefixDirs() {
  var migrated = 0;
  var entries = fs.readdirSync(ICONS_DIR, { withFileTypes: true });

  entries.forEach(function(entry) {
    if (!entry.isDirectory() || !entry.name.startsWith('tabler-')) return;

    var oldDir = path.join(ICONS_DIR, entry.name);
    var newName = entry.name.replace(/^tabler-/, '');
    var newDir = path.join(ICONS_DIR, newName);

    if (fs.existsSync(newDir)) {
      // Zielordner existiert schon — Dateien hinein verschieben
      var files = fs.readdirSync(oldDir);
      files.forEach(function(f) {
        var src = path.join(oldDir, f);
        var dest = path.join(newDir, f);
        if (!fs.existsSync(dest)) {
          fs.renameSync(src, dest);
        } else {
          fs.unlinkSync(src); // Tabler-Version wird spaeter ueberschrieben
        }
      });
      fs.rmdirSync(oldDir);
    } else {
      // Einfach umbenennen
      fs.renameSync(oldDir, newDir);
    }
    migrated++;
  });

  // Altes flat tabler/ Verzeichnis entfernen (Legacy)
  var flatDir = path.join(ICONS_DIR, 'tabler');
  if (fs.existsSync(flatDir)) {
    var files = fs.readdirSync(flatDir);
    files.forEach(function(f) { fs.unlinkSync(path.join(flatDir, f)); });
    fs.rmdirSync(flatDir);
    migrated++;
  }

  return migrated;
}

// ---------------------------------------------------------------------------
// Custom-Icons aus kollidierenden Kategorien normalisieren
// ---------------------------------------------------------------------------

function normalizeExistingTablerIcons(tablerDirs) {
  var updated = [];

  var allDirs = fs.readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(function(d) { return d.isDirectory(); })
    .map(function(d) { return d.name; });

  allDirs.forEach(function(category) {
    var catDir = path.join(ICONS_DIR, category);
    var files = fs.readdirSync(catDir).filter(function(f) { return f.endsWith('.svg'); });

    files.forEach(function(file) {
      var filePath = path.join(catDir, file);
      var content = fs.readFileSync(filePath, 'utf8');

      // Pruefen ob es ein Tabler-Icon ist (hat icon-tabler Klasse)
      if (content.includes('icon-tabler') || content.includes('icons-tabler')) {
        var normalized = normalizeSvg(content);
        if (normalized !== content.trim()) {
          fs.writeFileSync(filePath, normalized, 'utf8');
          updated.push(category + '/' + file);
        }
      }
    });
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Sync: Tabler → assets/icons/{category}/
// ---------------------------------------------------------------------------

function syncTablerIcons() {
  console.log('Tabler Icons Sync\n');

  // Pruefen ob @tabler/icons installiert ist
  if (!fs.existsSync(TABLER_SOURCE)) {
    console.error('  ✗ @tabler/icons nicht gefunden.');
    console.error('    Bitte ausfuehren: npm install @tabler/icons --save-dev');
    process.exit(1);
  }

  if (!fs.existsSync(TABLER_META)) {
    console.error('  ✗ icons.json nicht gefunden (Tabler-Metadaten).');
    process.exit(1);
  }

  // Migration: alte tabler-* Prefix-Verzeichnisse umbenennen
  var migratedCount = migrateOldPrefixDirs();
  if (migratedCount > 0) {
    console.log('  ✓ ' + migratedCount + ' alte tabler-* Verzeichnisse migriert (Prefix entfernt)\n');
  }

  // Tabler-Metadaten laden (Kategorien + Tags)
  var tablerIcons = JSON.parse(fs.readFileSync(TABLER_META, 'utf8'));

  // Icons nach Kategorie gruppieren
  var categoryMap = {};  // dirName → [{ name, file, tags, category }]
  var tagsMap = {};       // iconName → { tags, category }

  Object.keys(tablerIcons).forEach(function(iconName) {
    var meta = tablerIcons[iconName];
    // Nur Outline-Icons (pruefen ob SVG-Datei existiert)
    var svgFile = iconName + '.svg';
    var svgPath = path.join(TABLER_SOURCE, svgFile);
    if (!fs.existsSync(svgPath)) return;

    var category = meta.category || 'Uncategorized';
    var dirName = categoryToDirName(category);

    if (!categoryMap[dirName]) {
      categoryMap[dirName] = [];
    }
    categoryMap[dirName].push({
      name: iconName,
      file: svgFile,
      sourcePath: svgPath,
      tags: meta.tags || [],
      category: category
    });

    // Tags fuer Manifest-Generator speichern
    tagsMap[iconName] = {
      tags: meta.tags || [],
      category: category
    };
  });

  // Statistiken
  var totalAdded = 0;
  var totalUpdated = 0;
  var totalUnchanged = 0;
  var totalRemoved = 0;
  var categoryStats = [];

  // Pro Kategorie synchronisieren
  var dirNames = Object.keys(categoryMap).sort();
  var tablerDirSet = new Set(dirNames);

  dirNames.forEach(function(dirName) {
    var icons = categoryMap[dirName];
    var targetDir = path.join(ICONS_DIR, dirName);

    // Verzeichnis erstellen falls noetig
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Bestehende SVG-Dateien im Zielverzeichnis erfassen
    var existingFiles = new Set(
      fs.readdirSync(targetDir).filter(function(f) { return f.endsWith('.svg'); })
    );

    // Tabler-Dateinamen sammeln (um Custom-Icons nicht zu loeschen)
    var tablerFileNames = new Set(icons.map(function(i) { return i.file; }));

    var catAdded = 0;
    var catUpdated = 0;
    var catUnchanged = 0;

    icons.forEach(function(icon) {
      var targetPath = path.join(targetDir, icon.file);
      var sourceContent = fs.readFileSync(icon.sourcePath, 'utf8');
      var normalized = normalizeSvg(sourceContent);

      if (existingFiles.has(icon.file)) {
        var existingContent = fs.readFileSync(targetPath, 'utf8').trim();
        if (existingContent !== normalized) {
          fs.writeFileSync(targetPath, normalized, 'utf8');
          catUpdated++;
        } else {
          catUnchanged++;
        }
        existingFiles.delete(icon.file);
      } else {
        fs.writeFileSync(targetPath, normalized, 'utf8');
        catAdded++;
      }
    });

    // Verwaiste Dateien zaehlen (aber Custom-Icons NICHT loeschen)
    // Nur Dateien entfernen die nicht als Custom-Icon erkennbar sind
    // Custom-Icons bleiben erhalten (sie haben keinen Tabler-Eintrag)
    var catRemoved = 0;
    // Hinweis: existingFiles enthaelt jetzt nur noch Dateien die NICHT
    // in Tabler sind. Diese koennten Custom-Icons sein → nicht loeschen.

    totalAdded += catAdded;
    totalUpdated += catUpdated;
    totalUnchanged += catUnchanged;
    totalRemoved += catRemoved;

    categoryStats.push({
      dir: dirName,
      total: icons.length,
      added: catAdded,
      updated: catUpdated,
      custom: existingFiles.size  // verbleibende Custom-Icons
    });
  });

  // Tags-Map speichern (fuer Manifest-Generator)
  fs.writeFileSync(TAGS_OUTPUT, JSON.stringify(tagsMap, null, 2), 'utf8');

  // Bestehende Tabler-Icons normalisieren (stroke-width etc.)
  console.log('  Normalisiere bestehende Tabler-Icons...');
  var updatedExisting = normalizeExistingTablerIcons(tablerDirSet);

  // Gesamtanzahl
  var totalSynced = totalAdded + totalUpdated + totalUnchanged;

  // Report
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║  Tabler Icons Sync — Ergebnis                       ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  Quelle:      @tabler/icons (Outline)               ║');
  console.log('  ║  Kategorien:  ' + String(dirNames.length).padStart(3) + ' Tabler-Kategorien                  ║');
  console.log('  ║  Stroke:      1.5 (normalisiert)                    ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  Neu:         ' + String(totalAdded).padStart(5) +     '                                    ║');
  console.log('  ║  Aktualisiert:' + String(totalUpdated).padStart(5) +   '                                    ║');
  console.log('  ║  Unveraendert:' + String(totalUnchanged).padStart(5) + '                                    ║');
  console.log('  ║  Gesamt:      ' + String(totalSynced).padStart(5) +    '                                    ║');
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');

  // Kategorie-Uebersicht
  console.log('  Kategorien:');
  categoryStats.forEach(function(stat) {
    var status = '';
    if (stat.added > 0) status = ' (+' + stat.added + ' neu)';
    if (stat.updated > 0) status += ' (~' + stat.updated + ' aktualisiert)';
    if (stat.custom > 0) status += ' [' + stat.custom + ' custom]';
    console.log('    ' + stat.dir.padEnd(25) + String(stat.total).padStart(5) + status);
  });

  if (updatedExisting.length > 0) {
    console.log('');
    console.log('  Bestehende Tabler-Icons normalisiert (' + updatedExisting.length + '):');
    updatedExisting.forEach(function(p) { console.log('    → ' + p); });
  }

  console.log('');
  console.log('  ✓ Tags gespeichert: data/tabler-tags.json');
  console.log('  Naechster Schritt: npm run icons  (Manifest generieren)');
  console.log('');
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

syncTablerIcons();
