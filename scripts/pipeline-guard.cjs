#!/usr/bin/env node
// ==========================================================================
// Pipeline Guard: Design System → Drupal Synchronität
// ==========================================================================
// Prüft ob die Pipeline zwischen Design System, Konfig App und Drupal
// synchron ist. Warnt bei Problemen, die Stylings zurücksetzen könnten.
//
// Prüfungen:
//   1. Token Sync (SCSS ↔ tokens.generated.js)
//   2. theme-overrides.css Integrität (nicht leer/veraltet)
//   3. styles.css Build-Aktualität (neuer als SCSS-Quellen?)
//   4. Drupal CSS Bind-Mount Verifizierung
//
// Nutzung:
//   node scripts/pipeline-guard.cjs
//   npm run pipeline:check
//
// Teil von `npm test` (optional).
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCSS_PATH = path.join(ROOT, 'scss', 'scss', '00-settings', '_component-tokens.scss');
const REGISTRY_PATH = path.join(ROOT, 'apps', 'theme-configurator', 'src', 'data', 'tokens.generated.js');
const TOKENS_SOURCE = path.join(ROOT, 'data', 'design-tokens.json');
const TOKENS_CSS = path.join(ROOT, 'data', 'design-tokens.css');
const STYLES_PATH = path.join(ROOT, 'styles.css');
const OVERRIDES_PATH = path.join(ROOT, 'data', 'theme-overrides.css');
const DRUPAL_DIR = path.join(ROOT, '..', 'DRUPAL11');
const DOCKER_COMPOSE = path.join(DRUPAL_DIR, '.ddev', 'docker-compose.neo-css.yaml');

let errors = 0;
let warnings = 0;

function ok(msg) { console.log('  ✅ ' + msg); }
function warn(msg) { console.log('  ⚠️  ' + msg); warnings++; }
function fail(msg) { console.log('  ❌ ' + msg); errors++; }

console.log('');
console.log('Pipeline Guard: Design System → Drupal');
console.log('─'.repeat(55));

// ── 1. Token Sync ──
console.log('\n  1. Token Sync');
try {
  const result = execSync('node scripts/sync-component-tokens.cjs --check 2>&1', { cwd: ROOT, encoding: 'utf8' });
  if (result.includes('0 fehlend')) {
    ok('Alle Tokens synchron');
  } else {
    fail('Tokens nicht synchron — `npm run tokens:sync` ausführen');
  }
} catch (e) {
  fail('Token Sync fehlgeschlagen');
}

// ── 1b. Token Generation Freshness ──
// Inhalt statt Zeitstempel (29.09.2026): In einem frischen Git-Checkout
// (CI) haben alle Dateien die Checkout-Zeit als mtime, in zufaelliger
// Reihenfolge. Der alte mtime-Vergleich schlug dort seit 24.08.2026 bei jedem
// Lauf fehl. Jetzt: Generator in einer Kopie laufen lassen und die Ergebnisse
// mit den eingecheckten Dateien vergleichen (Datumszeile ausgenommen).
console.log('\n  1b. Token Generation Freshness');
if (fs.existsSync(TOKENS_SOURCE) && fs.existsSync(TOKENS_CSS) && fs.existsSync(REGISTRY_PATH)) {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'guard-tokens-'));
  const kopieren = ['scripts', 'data', 'scss', 'styles.css', 'apps/theme-configurator/src/data', 'packages'];
  try {
    for (const rel of kopieren) {
      const src = path.join(ROOT, rel);
      if (fs.existsSync(src)) fs.cpSync(src, path.join(tmp, rel), { recursive: true });
    }
    execSync('node scripts/generate-tokens.cjs', { cwd: tmp, stdio: 'pipe' });
    const ohneDatum = (t) => t.split('\n').filter((z) => !/Generated:/.test(z)).join('\n');
    const vergleiche = (absolut, label) => {
      const rel = path.relative(ROOT, absolut);
      const neu = fs.readFileSync(path.join(tmp, rel), 'utf8');
      const alt = fs.readFileSync(absolut, 'utf8');
      if (ohneDatum(neu) === ohneDatum(alt)) ok(label + ' ist aktuell');
      else fail(label + ' passt nicht zu design-tokens.json — `npm run tokens` ausfuehren und committen');
    };
    vergleiche(TOKENS_CSS, 'design-tokens.css');
    vergleiche(REGISTRY_PATH, 'tokens.generated.js');
  } catch (e) {
    fail('Token-Generator lief nicht: ' + String(e.message || e).split('\n')[0]);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
} else {
  warn('Token-Dateien nicht vollständig vorhanden');
}

// ── 2. theme-overrides.css Integrität ──
console.log('\n  2. Theme Overrides');
if (fs.existsSync(OVERRIDES_PATH)) {
  const overrides = fs.readFileSync(OVERRIDES_PATH, 'utf8');
  const lines = overrides.split('\n').length;
  if (lines < 10) {
    warn('theme-overrides.css hat nur ' + lines + ' Zeilen — möglicherweise zurückgesetzt');
  } else {
    ok('theme-overrides.css intakt (' + lines + ' Zeilen)');
  }

  // Prüfe ob Datei älter als 7 Tage
  const stat = fs.statSync(OVERRIDES_PATH);
  const age = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
  if (age > 7) {
    warn('theme-overrides.css ist ' + Math.round(age) + ' Tage alt — Configurator Save nötig?');
  } else {
    ok('theme-overrides.css aktuell (vor ' + Math.round(age * 24) + 'h generiert)');
  }
} else {
  fail('theme-overrides.css nicht gefunden');
}

// ── 3. styles.css Build-Aktualität ──
console.log('\n  3. CSS Build');
if (fs.existsSync(STYLES_PATH)) {
  const stylesStat = fs.statSync(STYLES_PATH);
  const scssStat = fs.statSync(SCSS_PATH);

  if (stylesStat.mtime >= scssStat.mtime) {
    ok('styles.css ist aktuell (neuer als SCSS-Quellen)');
  } else {
    warn('styles.css ist ÄLTER als _component-tokens.scss — `npm run build:css` nötig');
  }

  // Dateigröße prüfen
  const sizeMB = (stylesStat.size / 1024 / 1024).toFixed(1);
  ok('styles.css: ' + sizeMB + ' MB');
} else {
  fail('styles.css nicht gefunden');
}

// ── 4. Drupal Bind-Mount ──
console.log('\n  4. Drupal Integration');
if (fs.existsSync(DOCKER_COMPOSE)) {
  const dc = fs.readFileSync(DOCKER_COMPOSE, 'utf8');
  const mounts = ['styles.css', 'design-tokens.css', 'theme-overrides.css'];
  mounts.forEach(function(file) {
    if (dc.includes(file)) {
      ok('Bind-Mount: ' + file);
    } else {
      fail('Bind-Mount fehlt: ' + file);
    }
  });
} else {
  warn('Docker-Compose nicht gefunden (DDEV nicht konfiguriert?)');
}

// ── 5. Recipe Coverage ──
console.log('\n  5. Recipe Coverage');
const recipeDir = path.join(ROOT, 'data');
const recipeFiles = fs.readdirSync(recipeDir).filter(f => f.endsWith('-recipe.json'));
ok(recipeFiles.length + ' Recipe-Dateien gefunden');

// ── Ergebnis ──
console.log('\n' + '─'.repeat(55));
if (errors === 0 && warnings === 0) {
  console.log('  ✅ Pipeline vollständig synchron');
} else if (errors === 0) {
  console.log('  ⚠️  ' + warnings + ' Warnung(en) — Pipeline funktional, aber prüfen');
} else {
  console.log('  ❌ ' + errors + ' Fehler — Pipeline NICHT synchron');
}
console.log('');

process.exit(errors > 0 ? 1 : 0);
