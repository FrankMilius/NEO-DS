#!/usr/bin/env node
// ==========================================================================
// Icon Watcher Agent
// ==========================================================================
// Überwacht /assets/icons/ auf Änderungen (neue Dateien, neue Ordner,
// gelöschte Dateien, umbenannte Dateien) und regeneriert automatisch
// das icons-manifest.json.
//
// Starten:  npm run icons:watch
// Stoppen:  Ctrl+C
//
// Features:
//   - Erkennt neue/geloeschte SVG- und PNG-Dateien
//   - Erkennt neue/geloeschte Unterordner (= Kategorien)
//   - Debounced: wartet 300ms nach letzter Aenderung bevor Rebuild
//   - Zeigt detailliertes Log mit Zeitstempel
//   - Nutzt Node.js fs.watch (kein chokidar noetig)
//   - Rekursiv: ueberwacht auch neue Unterordner automatisch
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ICONS_DIR    = path.resolve(__dirname, '../assets/icons');
const MANIFEST     = path.resolve(__dirname, '../data/icons-manifest.json');
const GENERATE_CMD = 'node ' + path.resolve(__dirname, 'generate-icons-manifest.js');
const DEBOUNCE_MS  = 300;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

var debounceTimer = null;
var isRebuilding  = false;
var watchers      = new Map();   // dir-path → FSWatcher
var lastManifest  = null;        // Cached manifest summary for diff

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timestamp() {
  return new Date().toLocaleTimeString('de-DE', { hour12: false });
}

function log(icon, msg) {
  console.log('[' + timestamp() + '] ' + icon + '  ' + msg);
}

function loadManifestSummary() {
  try {
    var data = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    return {
      total: data.meta.total,
      categories: data.categories.slice(),
      iconNames: data.icons.map(function (i) { return i.path; }).sort()
    };
  } catch (e) {
    return { total: 0, categories: [], iconNames: [] };
  }
}

function diffManifest(before, after) {
  var added = after.iconNames.filter(function (n) { return before.iconNames.indexOf(n) === -1; });
  var removed = before.iconNames.filter(function (n) { return after.iconNames.indexOf(n) === -1; });
  var newCats = after.categories.filter(function (c) { return before.categories.indexOf(c) === -1; });
  var removedCats = before.categories.filter(function (c) { return after.categories.indexOf(c) === -1; });
  return { added: added, removed: removed, newCats: newCats, removedCats: removedCats };
}

// ---------------------------------------------------------------------------
// Validierung
// ---------------------------------------------------------------------------

function validateIcons() {
  var issues = [];

  try {
    var categories = fs.readdirSync(ICONS_DIR, { withFileTypes: true })
      .filter(function (d) { return d.isDirectory(); })
      .map(function (d) { return d.name; });

    // Duplikat-Erkennung: gleicher Dateiname in verschiedenen Kategorien
    var nameMap = {};

    categories.forEach(function (category) {
      var catDir = path.join(ICONS_DIR, category);
      var files = fs.readdirSync(catDir).filter(function (f) { return f.endsWith('.svg'); });

      files.forEach(function (file) {
        var filePath = path.join(catDir, file);
        var content = fs.readFileSync(filePath, 'utf8');

        // stroke-width Validierung (alle SVGs sollen 1.5 verwenden)
        var swMatch = content.match(/stroke-width="([^"]+)"/);
        if (swMatch && swMatch[1] !== '1.5') {
          issues.push({
            type: 'stroke-width',
            file: category + '/' + file,
            found: swMatch[1],
            expected: '1.5'
          });
        }

        // currentColor Validierung (keine hardcodierten Farben)
        if (/stroke="#[0-9a-fA-F]/.test(content)) {
          issues.push({
            type: 'hardcoded-stroke',
            file: category + '/' + file
          });
        }
        // fill mit Hex-Farbe (aber nicht fill="none")
        var fillMatch = content.match(/fill="#[0-9a-fA-F]/);
        if (fillMatch && !/fill="none"/.test(content.substring(0, content.indexOf(fillMatch[0]) + 20))) {
          // Genauere Pruefung: alle fill-Attribute einzeln
          var fills = content.match(/fill="(#[0-9a-fA-F]+)"/g);
          if (fills) {
            issues.push({
              type: 'hardcoded-fill',
              file: category + '/' + file
            });
          }
        }

        // Duplikat-Tracking
        var baseName = path.basename(file, '.svg');
        if (!nameMap[baseName]) {
          nameMap[baseName] = [];
        }
        nameMap[baseName].push(category);
      });
    });

    // Duplikate melden (gleicher Name in >1 Kategorie)
    Object.keys(nameMap).forEach(function (name) {
      if (nameMap[name].length > 1) {
        issues.push({
          type: 'duplicate',
          file: name + '.svg',
          categories: nameMap[name]
        });
      }
    });
  } catch (e) {
    log('⚠️ ', 'Validierung fehlgeschlagen: ' + e.message);
    return;
  }

  // Ergebnisse ausgeben
  if (issues.length === 0) {
    log('✅', 'VALIDIERUNG: Alle Icons entsprechen dem Standard');
    return;
  }

  var strokeIssues = issues.filter(function (i) { return i.type === 'stroke-width'; });
  var colorIssues = issues.filter(function (i) { return i.type === 'hardcoded-stroke' || i.type === 'hardcoded-fill'; });
  var dupeIssues = issues.filter(function (i) { return i.type === 'duplicate'; });

  if (strokeIssues.length > 0) {
    log('⚠️ ', 'VALIDIERUNG: ' + strokeIssues.length + ' Icons mit falschem stroke-width');
    strokeIssues.slice(0, 5).forEach(function (i) {
      log('  ', '  → ' + i.file + ': stroke-width="' + i.found + '" (erwartet: 1.5)');
    });
    if (strokeIssues.length > 5) {
      log('  ', '  ... und ' + (strokeIssues.length - 5) + ' weitere');
    }
  }

  if (colorIssues.length > 0) {
    log('⚠️ ', 'VALIDIERUNG: ' + colorIssues.length + ' Icons mit hardcodierten Farben');
    colorIssues.slice(0, 5).forEach(function (i) {
      log('  ', '  → ' + i.file);
    });
    if (colorIssues.length > 5) {
      log('  ', '  ... und ' + (colorIssues.length - 5) + ' weitere');
    }
  }

  if (dupeIssues.length > 0) {
    log('⚠️ ', 'VALIDIERUNG: ' + dupeIssues.length + ' doppelte Icon-Namen');
    dupeIssues.slice(0, 5).forEach(function (i) {
      log('  ', '  → ' + i.file + ' in: ' + i.categories.join(', '));
    });
    if (dupeIssues.length > 5) {
      log('  ', '  ... und ' + (dupeIssues.length - 5) + ' weitere');
    }
  }

  log('💡', 'Tipp: npm run icons:sync  normalisiert Tabler-Icons automatisch');
}

// ---------------------------------------------------------------------------
// Rebuild
// ---------------------------------------------------------------------------

function rebuild(trigger) {
  if (isRebuilding) return;
  isRebuilding = true;

  var before = loadManifestSummary();

  log('🔄', 'Rebuild ausgeloest durch: ' + trigger);

  try {
    execSync(GENERATE_CMD, { stdio: 'pipe' });
  } catch (e) {
    log('❌', 'Manifest-Generierung fehlgeschlagen: ' + e.message);
    isRebuilding = false;
    return;
  }

  var after = loadManifestSummary();
  var diff = diffManifest(before, after);

  // Log changes
  if (diff.newCats.length > 0) {
    diff.newCats.forEach(function (c) { log('📁', 'Neue Kategorie: ' + c); });
  }
  if (diff.removedCats.length > 0) {
    diff.removedCats.forEach(function (c) { log('🗑️ ', 'Kategorie entfernt: ' + c); });
  }
  if (diff.added.length > 0) {
    diff.added.forEach(function (p) { log('➕', p); });
  }
  if (diff.removed.length > 0) {
    diff.removed.forEach(function (p) { log('➖', p); });
  }

  log('✅', 'icons-manifest.json aktualisiert (' + after.total + ' Icons, ' + after.categories.length + ' Kategorien)');

  // Validierung nach jedem Rebuild
  validateIcons();

  // Refresh watchers (new dirs may have appeared, old ones removed)
  syncWatchers();

  isRebuilding = false;
}

function scheduleRebuild(trigger) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function () {
    rebuild(trigger);
  }, DEBOUNCE_MS);
}

// ---------------------------------------------------------------------------
// File Watching
// ---------------------------------------------------------------------------

function watchDir(dirPath) {
  if (watchers.has(dirPath)) return; // already watching

  try {
    var watcher = fs.watch(dirPath, function (eventType, filename) {
      if (!filename) return;

      // Ignore hidden files, temp files, and non-icon files at root level
      if (filename.startsWith('.') || filename.startsWith('~')) return;

      var fullPath = path.join(dirPath, filename);
      var isRoot = (dirPath === ICONS_DIR);

      if (isRoot) {
        // Root level: only react to directories (categories)
        // Use setTimeout to avoid ENOENT on rapid create/delete
        setTimeout(function () {
          try {
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
              scheduleRebuild('Neuer Ordner: ' + filename);
            } else if (!fs.existsSync(fullPath)) {
              scheduleRebuild('Ordner entfernt: ' + filename);
            }
          } catch (e) {
            // race condition — ignore
          }
        }, 50);
      } else {
        // Category subdirectory: react to SVG/PNG files
        var ext = path.extname(filename).toLowerCase();
        if (ext === '.svg' || ext === '.png') {
          var category = path.basename(dirPath);
          scheduleRebuild(category + '/' + filename);
        }
      }
    });

    watchers.set(dirPath, watcher);
  } catch (e) {
    log('⚠️ ', 'Konnte ' + dirPath + ' nicht ueberwachen: ' + e.message);
  }
}

function unwatchDir(dirPath) {
  var watcher = watchers.get(dirPath);
  if (watcher) {
    watcher.close();
    watchers.delete(dirPath);
  }
}

function syncWatchers() {
  // Get current set of category directories
  var currentDirs = new Set();
  currentDirs.add(ICONS_DIR); // root

  try {
    var entries = fs.readdirSync(ICONS_DIR, { withFileTypes: true });
    entries.forEach(function (entry) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        currentDirs.add(path.join(ICONS_DIR, entry.name));
      }
    });
  } catch (e) {
    log('⚠️ ', 'Konnte Icons-Verzeichnis nicht lesen: ' + e.message);
    return;
  }

  // Add watchers for new directories
  currentDirs.forEach(function (dir) {
    if (!watchers.has(dir)) {
      watchDir(dir);
      if (dir !== ICONS_DIR) {
        log('👁️ ', 'Ueberwache: ' + path.basename(dir) + '/');
      }
    }
  });

  // Remove watchers for deleted directories
  watchers.forEach(function (watcher, dir) {
    if (!currentDirs.has(dir)) {
      unwatchDir(dir);
      log('🔇', 'Ueberwachung beendet: ' + path.basename(dir) + '/');
    }
  });
}

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

console.log('');
console.log('  ╔══════════════════════════════════════════════════╗');
console.log('  ║  Icon Watcher Agent                             ║');
console.log('  ║  Ueberwacht /assets/icons/ auf Aenderungen      ║');
console.log('  ║  Stoppen mit Ctrl+C                             ║');
console.log('  ╚══════════════════════════════════════════════════╝');
console.log('');

// Load initial state
lastManifest = loadManifestSummary();
log('📊', 'Aktueller Stand: ' + lastManifest.total + ' Icons in ' + lastManifest.categories.length + ' Kategorien');
log('📁', 'Kategorien: ' + lastManifest.categories.join(', '));
console.log('');

// Initiale Validierung
validateIcons();
console.log('');

// Start watching
syncWatchers();
log('👁️ ', 'Watcher aktiv — warte auf Aenderungen...');
console.log('');

// Graceful shutdown
process.on('SIGINT', function () {
  console.log('');
  log('🛑', 'Watcher wird beendet...');
  watchers.forEach(function (watcher) { watcher.close(); });
  process.exit(0);
});

process.on('SIGTERM', function () {
  watchers.forEach(function (watcher) { watcher.close(); });
  process.exit(0);
});
