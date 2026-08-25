#!/usr/bin/env node
// ==========================================================================
// Add Icon Library — Generisches Script
// ==========================================================================
// Importiert eine beliebige SVG-basierte Icon-Library aus einem npm-Paket.
//
// Aufruf:
//   node scripts/add-icon-library.cjs <npm-package> [--name "Display Name"] [--subdir path/to/svgs]
//
// Beispiele:
//   node scripts/add-icon-library.cjs heroicons --name "Heroicons" --subdir 24/outline
//   node scripts/add-icon-library.cjs lucide-static --name "Lucide" --subdir icons
//   node scripts/add-icon-library.cjs @iconify-json/mdi --name "Material Design Icons"
//
// Was passiert:
//   1. npm install <package> --save-dev (falls nicht installiert)
//   2. SVG-Dateien werden aus node_modules/<package>/<subdir> gelesen
//      Falls --subdir nicht angegeben: Suche nach Verzeichnissen mit .svg Dateien
//   3. SVGs werden normalisiert (currentColor, Whitespace, XML-Dekl.)
//   4. Kopiert nach assets/icons-<id>/
//   5. Manifest wird generiert via generate-icons-manifest.js
//
// ==========================================================================

var fs = require('fs');
var path = require('path');
var { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// CLI Argument Parsing
// ---------------------------------------------------------------------------

var args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help') {
  console.log('');
  console.log('  Aufruf: node scripts/add-icon-library.cjs <npm-package> [optionen]');
  console.log('');
  console.log('  Optionen:');
  console.log('    --name "Name"       Display-Name (Standard: Package-Name)');
  console.log('    --subdir path       Pfad zu SVGs innerhalb des Packages');
  console.log('    --id custom-id      Library-ID (Standard: abgeleitet vom Package-Namen)');
  console.log('');
  console.log('  Beispiele:');
  console.log('    node scripts/add-icon-library.cjs heroicons --name "Heroicons" --subdir 24/outline');
  console.log('    node scripts/add-icon-library.cjs lucide-static --name "Lucide" --subdir icons');
  console.log('');
  process.exit(0);
}

var npmPackage = args[0];
var displayName = null;
var subdir = null;
var customId = null;

for (var i = 1; i < args.length; i++) {
  if (args[i] === '--name' && args[i + 1]) { displayName = args[++i]; }
  else if (args[i] === '--subdir' && args[i + 1]) { subdir = args[++i]; }
  else if (args[i] === '--id' && args[i + 1]) { customId = args[++i]; }
}

// Library-ID ableiten
var libraryId = customId || npmPackage
  .replace(/^@/, '').replace(/\//g, '-')  // @scope/pkg → scope-pkg
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

if (!displayName) {
  displayName = libraryId.split('-').map(function(w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

console.log('');
console.log('  ╔══════════════════════════════════════════════════════╗');
console.log('  ║  Add Icon Library                                    ║');
console.log('  ╠══════════════════════════════════════════════════════╣');
console.log('  ║  Package:  ' + npmPackage.padEnd(41) + '║');
console.log('  ║  Name:     ' + displayName.padEnd(41) + '║');
console.log('  ║  ID:       ' + libraryId.padEnd(41) + '║');
if (subdir) {
  console.log('  ║  Subdir:   ' + subdir.padEnd(41) + '║');
}
console.log('  ╚══════════════════════════════════════════════════════╝');
console.log('');

// ---------------------------------------------------------------------------
// Step 1: Install npm package
// ---------------------------------------------------------------------------

var packageDir = path.resolve(__dirname, '../node_modules', npmPackage);

if (!fs.existsSync(packageDir)) {
  console.log('  [1/4] Installiere ' + npmPackage + '...');
  try {
    execSync('npm install ' + npmPackage + ' --save-dev', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('  ✗ npm install fehlgeschlagen');
    process.exit(1);
  }
} else {
  console.log('  [1/4] ' + npmPackage + ' bereits installiert ✓');
}

// ---------------------------------------------------------------------------
// Step 2: Find SVG source directory
// ---------------------------------------------------------------------------

console.log('  [2/4] Suche SVG-Dateien...');

var svgSourceDir = null;

if (subdir) {
  svgSourceDir = path.join(packageDir, subdir);
  if (!fs.existsSync(svgSourceDir)) {
    console.error('  ✗ Verzeichnis nicht gefunden: ' + svgSourceDir);
    process.exit(1);
  }
} else {
  // Auto-detect: search for directories containing .svg files
  var candidates = findSvgDirs(packageDir, 3);
  if (candidates.length === 0) {
    console.error('  ✗ Keine SVG-Dateien gefunden in ' + npmPackage);
    console.error('    Versuche --subdir anzugeben');
    process.exit(1);
  }
  // Prefer directories named "outline", "24", "icons", or the one with most SVGs
  var preferred = candidates.find(function(c) { return /outline|24/.test(c.dir); });
  if (!preferred) preferred = candidates.find(function(c) { return /icons/.test(c.dir); });
  if (!preferred) preferred = candidates.sort(function(a, b) { return b.count - a.count; })[0];

  svgSourceDir = preferred.path;
  console.log('    Auto-detected: ' + path.relative(packageDir, svgSourceDir) + ' (' + preferred.count + ' SVGs)');
}

function findSvgDirs(dir, maxDepth) {
  var results = [];
  if (maxDepth <= 0) return results;
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    var svgCount = entries.filter(function(e) { return e.isFile() && e.name.endsWith('.svg'); }).length;
    if (svgCount > 0) {
      results.push({ dir: path.basename(dir), path: dir, count: svgCount });
    }
    entries.filter(function(e) { return e.isDirectory() && !e.name.startsWith('.'); })
      .forEach(function(e) {
        results = results.concat(findSvgDirs(path.join(dir, e.name), maxDepth - 1));
      });
  } catch (e) { /* ignore */ }
  return results;
}

// Count source SVGs
var sourceSvgs = fs.readdirSync(svgSourceDir).filter(function(f) { return f.endsWith('.svg'); });
console.log('    Gefunden: ' + sourceSvgs.length + ' SVGs');

// ---------------------------------------------------------------------------
// Step 3: Normalize and copy SVGs
// ---------------------------------------------------------------------------

console.log('  [3/4] Normalisiere und kopiere SVGs...');

var targetDir = path.resolve(__dirname, '../assets/icons-' + libraryId);
// Organize into a single "outline" category (or could be subcategories)
var outlineDir = path.join(targetDir, 'outline');

if (!fs.existsSync(outlineDir)) {
  fs.mkdirSync(outlineDir, { recursive: true });
}

var added = 0;
var updated = 0;
var unchanged = 0;

sourceSvgs.forEach(function(file) {
  var sourcePath = path.join(svgSourceDir, file);
  var targetPath = path.join(outlineDir, file);
  var content = fs.readFileSync(sourcePath, 'utf8');

  // Normalize
  var normalized = content;
  normalized = normalized.replace(/<\?xml[^?]*\?>\s*/g, '');
  normalized = normalized.replace(/\s*aria-hidden="[^"]*"/g, '');
  normalized = normalized.replace(/\s*data-slot="[^"]*"/g, '');
  normalized = normalized.replace(/stroke="#000000"/g, 'stroke="currentColor"');
  normalized = normalized.replace(/stroke="#000"/g, 'stroke="currentColor"');
  normalized = normalized.replace(/fill="#000000"/g, 'fill="currentColor"');
  normalized = normalized.replace(/fill="#000"/g, 'fill="currentColor"');
  normalized = normalized.trim();

  if (fs.existsSync(targetPath)) {
    var existing = fs.readFileSync(targetPath, 'utf8').trim();
    if (existing !== normalized) {
      fs.writeFileSync(targetPath, normalized, 'utf8');
      updated++;
    } else {
      unchanged++;
    }
  } else {
    fs.writeFileSync(targetPath, normalized, 'utf8');
    added++;
  }
});

console.log('    Neu: ' + added + ' | Aktualisiert: ' + updated + ' | Unveraendert: ' + unchanged);

// ---------------------------------------------------------------------------
// Step 4: Regenerate manifests
// ---------------------------------------------------------------------------

console.log('  [4/4] Generiere Manifests...');
try {
  execSync('node scripts/generate-icons-manifest.cjs', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (e) {
  console.error('  ✗ Manifest-Generierung fehlgeschlagen');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

var totalCount = added + updated + unchanged;

console.log('');
console.log('  ╔══════════════════════════════════════════════════════╗');
console.log('  ║  ✓ Library erfolgreich hinzugefuegt                  ║');
console.log('  ╠══════════════════════════════════════════════════════╣');
console.log('  ║  Name:     ' + displayName.padEnd(41) + '║');
console.log('  ║  ID:       ' + libraryId.padEnd(41) + '║');
console.log('  ║  Icons:    ' + String(totalCount).padEnd(41) + '║');
console.log('  ║  Manifest: /data/icons-manifest-' + (libraryId + '.json').padEnd(19) + '║');
console.log('  ╚══════════════════════════════════════════════════════╝');
console.log('');
console.log('  Um die Library im Theme Configurator zu verwenden,');
console.log('  fuege sie in der Icon Foundation hinzu:');
console.log('');
console.log('  Store-Eintrag (bereits automatisch bei builtIn Libraries):');
console.log('    { id: "' + libraryId + '", name: "' + displayName + '",');
console.log('      builtIn: true, iconCount: ' + totalCount + ',');
console.log('      manifestPath: "/data/icons-manifest-' + libraryId + '.json" }');
console.log('');
