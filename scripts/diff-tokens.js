#!/usr/bin/env node
// ==========================================================================
// Token Diff: Vergleicht design-tokens.json mit dem Golden Master
// ==========================================================================
// Zeigt hinzugefuegte, entfernte und geaenderte Token-Werte.
// Laeuft als Teil von `npm run tokens:diff`.
// ==========================================================================

const fs = require('fs');
const path = require('path');

const currentPath = path.resolve(__dirname, '../data/design-tokens.json');
const goldenPath = path.resolve(__dirname, '../data/design-tokens.golden.json');

// ---------------------------------------------------------------------------
// Load files
// ---------------------------------------------------------------------------

let current, golden;

try {
  current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
} catch (e) {
  console.error(`Failed to load current tokens: ${e.message}`);
  process.exit(1);
}

try {
  golden = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
} catch (e) {
  console.error(`No golden master found at ${goldenPath}`);
  console.error('Run: npm run tokens:golden  to create one.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Deep diff utility
// ---------------------------------------------------------------------------

function deepDiff(a, b, path = '') {
  const diffs = [];

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) {
        diffs.push({ type: 'added', path: p, value: b[i] });
      } else if (i >= b.length) {
        diffs.push({ type: 'removed', path: p, value: a[i] });
      } else {
        diffs.push(...deepDiff(a[i], b[i], p));
      }
    }
    return diffs;
  }

  // Handle objects
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        diffs.push({ type: 'added', path: p, value: b[key] });
      } else if (!(key in b)) {
        diffs.push({ type: 'removed', path: p, value: a[key] });
      } else {
        diffs.push(...deepDiff(a[key], b[key], p));
      }
    }
    return diffs;
  }

  // Handle primitives
  if (a !== b) {
    diffs.push({ type: 'changed', path, from: a, to: b });
  }

  return diffs;
}

// ---------------------------------------------------------------------------
// Run diff
// ---------------------------------------------------------------------------

console.log('Comparing design tokens against golden master...\n');

const diffs = deepDiff(golden, current);

if (diffs.length === 0) {
  console.log('  No changes detected. Tokens match golden master.\n');
  console.log('='.repeat(60));
  console.log('Token diff: 0 changes.');
  process.exit(0);
}

// Group by type
const added = diffs.filter(d => d.type === 'added');
const removed = diffs.filter(d => d.type === 'removed');
const changed = diffs.filter(d => d.type === 'changed');

if (added.length > 0) {
  console.log(`  ADDED (${added.length}):`);
  for (const d of added.slice(0, 20)) {
    const val = typeof d.value === 'object' ? JSON.stringify(d.value).slice(0, 60) : d.value;
    console.log(`    + ${d.path}: ${val}`);
  }
  if (added.length > 20) console.log(`    ... and ${added.length - 20} more`);
  console.log('');
}

if (removed.length > 0) {
  console.log(`  REMOVED (${removed.length}):`);
  for (const d of removed.slice(0, 20)) {
    const val = typeof d.value === 'object' ? JSON.stringify(d.value).slice(0, 60) : d.value;
    console.log(`    - ${d.path}: ${val}`);
  }
  if (removed.length > 20) console.log(`    ... and ${removed.length - 20} more`);
  console.log('');
}

if (changed.length > 0) {
  console.log(`  CHANGED (${changed.length}):`);
  for (const d of changed.slice(0, 20)) {
    console.log(`    ~ ${d.path}: ${d.from} → ${d.to}`);
  }
  if (changed.length > 20) console.log(`    ... and ${changed.length - 20} more`);
  console.log('');
}

console.log('='.repeat(60));
console.log(`Token diff: ${added.length} added, ${removed.length} removed, ${changed.length} changed.`);
console.log('Run: npm run tokens:golden  to update the golden master.');
