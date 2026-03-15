#!/usr/bin/env node
// ==========================================================================
// Heroicons Sync Script
// ==========================================================================
// Synchronisiert alle Outline-Icons aus heroicons (24px) in eine eigene
// Icon-Bibliothek, getrennt von Tabler.
//
// Zielverzeichnis: assets/icons-heroicons/outline/
//
// Heroicons haben keine offiziellen Kategorien — alle landen in "outline".
// Die SVGs verwenden bereits currentColor + stroke-width 1.5.
//
// Ausfuehren:  npm run icons:sync-heroicons
// ==========================================================================

var fs = require('fs');
var path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

var HEROICONS_SOURCE = path.resolve(__dirname, '../node_modules/heroicons/24/outline');
var ICONS_DIR = path.resolve(__dirname, '../assets/icons-heroicons');
var OUTLINE_DIR = path.join(ICONS_DIR, 'outline');

// ---------------------------------------------------------------------------
// SVG Normalisierung
// ---------------------------------------------------------------------------

function normalizeSvg(svgContent) {
  var svg = svgContent;

  // XML-Deklarationen entfernen
  svg = svg.replace(/<\?xml[^?]*\?>\s*/g, '');

  // aria-hidden und data-slot Attribute entfernen (Heroicons-spezifisch)
  svg = svg.replace(/\s*aria-hidden="[^"]*"/g, '');
  svg = svg.replace(/\s*data-slot="[^"]*"/g, '');

  // Sicherstellen: currentColor
  svg = svg.replace(/stroke="#000000"/g, 'stroke="currentColor"');
  svg = svg.replace(/stroke="#000"/g, 'stroke="currentColor"');

  // Whitespace trimmen
  svg = svg.trim();

  return svg;
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

function syncHeroicons() {
  console.log('Heroicons Sync\n');

  // Pruefen ob heroicons installiert ist
  if (!fs.existsSync(HEROICONS_SOURCE)) {
    console.error('  ✗ heroicons nicht gefunden.');
    console.error('    Bitte ausfuehren: npm install heroicons --save-dev');
    process.exit(1);
  }

  // Zielverzeichnis erstellen
  if (!fs.existsSync(OUTLINE_DIR)) {
    fs.mkdirSync(OUTLINE_DIR, { recursive: true });
  }

  // Alle SVG-Dateien aus der Quelle lesen
  var sourceFiles = fs.readdirSync(HEROICONS_SOURCE)
    .filter(function(f) { return f.endsWith('.svg'); })
    .sort();

  var totalAdded = 0;
  var totalUpdated = 0;
  var totalUnchanged = 0;

  sourceFiles.forEach(function(file) {
    var sourcePath = path.join(HEROICONS_SOURCE, file);
    var targetPath = path.join(OUTLINE_DIR, file);
    var sourceContent = fs.readFileSync(sourcePath, 'utf8');
    var normalized = normalizeSvg(sourceContent);

    if (fs.existsSync(targetPath)) {
      var existing = fs.readFileSync(targetPath, 'utf8').trim();
      if (existing !== normalized) {
        fs.writeFileSync(targetPath, normalized, 'utf8');
        totalUpdated++;
      } else {
        totalUnchanged++;
      }
    } else {
      fs.writeFileSync(targetPath, normalized, 'utf8');
      totalAdded++;
    }
  });

  var totalSynced = totalAdded + totalUpdated + totalUnchanged;

  // Report
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║  Heroicons Sync — Ergebnis                          ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  Quelle:      heroicons/24/outline                  ║');
  console.log('  ║  Ziel:        assets/icons-heroicons/outline        ║');
  console.log('  ║  Stroke:      1.5 (Original beibehalten)            ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  Neu:         ' + String(totalAdded).padStart(5) +     '                                    ║');
  console.log('  ║  Aktualisiert:' + String(totalUpdated).padStart(5) +   '                                    ║');
  console.log('  ║  Unveraendert:' + String(totalUnchanged).padStart(5) + '                                    ║');
  console.log('  ║  Gesamt:      ' + String(totalSynced).padStart(5) +    '                                    ║');
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('  Naechster Schritt: npm run icons  (Manifest generieren)');
  console.log('');
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

syncHeroicons();
