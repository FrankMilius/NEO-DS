#!/usr/bin/env node

/**
 * migrate-mod-tokens.js
 *
 * Phase 4: Fallback/Override Token Pattern (Spectrum-Stil)
 * Transformiert var(--nc-*) → var(--mod-*, var(--nc-*)) in Component SCSS.
 *
 * Regeln:
 *   - var(--nc-foo)           → var(--mod-foo, var(--nc-foo))
 *   - var(--nc-foo, fallback) → var(--mod-foo, var(--nc-foo, fallback))
 *   - NUR in Consumption-Sites (Layer 01, 04-07)
 *   - NICHT in _component-tokens.scss (Deklarationen)
 *   - NICHT in 00-settings (außer explizit gelistet)
 *
 * Verwendung:
 *   node scripts/migrate-mod-tokens.js           # Dry-Run (zeigt Änderungen)
 *   node scripts/migrate-mod-tokens.js --apply    # Schreibt Änderungen
 *   node scripts/migrate-mod-tokens.js --revert   # Macht Änderungen rückgängig
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const REVERT = args.includes('--revert');

// Verzeichnisse die migriert werden
const TARGET_DIRS = [
  'scss/scss/01-tools',
  'scss/scss/04-objects',
  'scss/scss/05-atoms',
  'scss/scss/06-molecules',
  'scss/scss/07-organisms',
];

// Dateien die NICHT migriert werden
const EXCLUDE_FILES = [
  '_index.scss',
  '_component-tokens.scss',
];

// ---------------------------------------------------------------------------
// Regex: Matcht var(--nc-...) mit optionalem Fallback
// ---------------------------------------------------------------------------
// Gruppe 1: Token-Name (z.B. "button-primary-bg")
// Gruppe 2: Optionaler Fallback (z.B. ", 40px" oder ", var(--fnd-...)")
//
// Wichtig: Muss verschachtelte var() im Fallback korrekt handhaben.
// Strategie: Matche var(--nc- gefolgt von balanciertem Klammerinhalt.
// ---------------------------------------------------------------------------

function wrapVarNc(content) {
  // Iterativ ersetzen, da Regex mit verschachtelten Klammern schwierig ist
  let result = '';
  let i = 0;

  while (i < content.length) {
    // Suche nach "var(--nc-"
    const marker = 'var(--nc-';
    const idx = content.indexOf(marker, i);

    if (idx === -1) {
      result += content.slice(i);
      break;
    }

    // Alles vor dem Match übernehmen
    result += content.slice(i, idx);

    // Prüfe ob bereits gewrapped: "var(--mod-" direkt davor
    const beforeStr = result.slice(-9);
    if (beforeStr.includes('--mod-')) {
      // Bereits gewrapped — nicht nochmal wrappen
      result += marker;
      i = idx + marker.length;
      continue;
    }

    // Token-Name extrahieren (bis zum ersten , oder ) ohne verschachtelte Klammern)
    const afterMarker = content.slice(idx + marker.length);
    const tokenName = extractTokenName(afterMarker);

    if (!tokenName) {
      // Konnte Token nicht parsen — unverändert übernehmen
      result += marker;
      i = idx + marker.length;
      continue;
    }

    // Gesamtes var(--nc-...) extrahieren (mit balancierten Klammern)
    const fullVar = extractBalancedVar(content, idx);

    if (!fullVar) {
      result += marker;
      i = idx + marker.length;
      continue;
    }

    // Wrappen: var(--mod-{tokenName}, {originalVar})
    result += `var(--mod-${tokenName}, ${fullVar})`;
    i = idx + fullVar.length;
  }

  return result;
}

function unwrapModTokens(content) {
  // Revert: var(--mod-foo, var(--nc-foo)) → var(--nc-foo)
  // Auch: var(--mod-foo, var(--nc-foo, fallback)) → var(--nc-foo, fallback)
  return content.replace(/var\(--mod-[a-z0-9-]+,\s*(var\(--nc-[^)]*(?:\([^)]*\))*[^)]*\))\)/g, '$1');
}

function extractTokenName(str) {
  // Extrahiert den Token-Namen bis zum ersten , ) oder Whitespace+)
  const match = str.match(/^([a-z0-9-]+)/);
  return match ? match[1] : null;
}

function extractBalancedVar(content, startIdx) {
  // Extrahiert var(...) mit balancierten Klammern ab startIdx
  if (content.slice(startIdx, startIdx + 4) !== 'var(') return null;

  let depth = 0;
  let i = startIdx + 3; // Position der öffnenden Klammer

  for (; i < content.length; i++) {
    if (content[i] === '(') depth++;
    else if (content[i] === ')') {
      depth--;
      if (depth === 0) {
        return content.slice(startIdx, i + 1);
      }
    }
  }

  return null; // Unbalancierte Klammern
}

// ---------------------------------------------------------------------------
// Dateien verarbeiten
// ---------------------------------------------------------------------------

function collectFiles() {
  const files = [];
  for (const dir of TARGET_DIRS) {
    const fullDir = join(ROOT, dir);
    if (!existsSync(fullDir)) continue;
    const entries = readdirSync(fullDir).filter(f =>
      f.endsWith('.scss') && !EXCLUDE_FILES.includes(f)
    );
    for (const f of entries) {
      files.push(join(dir, f));
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Hauptlogik
// ---------------------------------------------------------------------------

const files = collectFiles();
let totalChanged = 0;
let totalOccurrences = 0;

for (const relPath of files) {
  const fullPath = join(ROOT, relPath);
  const original = readFileSync(fullPath, 'utf-8');

  let transformed;
  if (REVERT) {
    transformed = unwrapModTokens(original);
  } else {
    transformed = wrapVarNc(original);
  }

  if (transformed !== original) {
    // Zähle Änderungen
    const origCount = (original.match(/var\(--nc-/g) || []).length;
    const newCount = (transformed.match(/var\(--mod-/g) || []).length;
    const changes = REVERT
      ? (original.match(/var\(--mod-/g) || []).length
      : newCount;

    totalChanged++;
    totalOccurrences += changes;

    if (APPLY || REVERT) {
      writeFileSync(fullPath, transformed);
      console.log(`  ✓ ${relPath} (${changes} ${REVERT ? 'reverted' : 'wrapped'})`);
    } else {
      console.log(`  → ${relPath} (${changes} would be ${REVERT ? 'reverted' : 'wrapped'})`);
    }
  }
}

const action = REVERT ? 'Revert' : APPLY ? 'Migration' : 'Dry-Run';
console.log(`\n${action} abgeschlossen:`);
console.log(`  ${totalChanged} Dateien ${APPLY || REVERT ? 'geändert' : 'würden geändert'}`);
console.log(`  ${totalOccurrences} var(--nc-*) ${REVERT ? 'unwrapped' : 'wrapped'}`);

if (!APPLY && !REVERT) {
  console.log(`\n  Zum Anwenden: node scripts/migrate-mod-tokens.js --apply`);
  console.log(`  Zum Rückgängig: node scripts/migrate-mod-tokens.js --revert`);
}
