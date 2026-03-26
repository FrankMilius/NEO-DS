/**
 * Figma → Design Tokens Sync
 *
 * Exportiert Design Tokens aus Figma via REST API und synchronisiert
 * sie mit data/design-tokens.json.
 *
 * Unterstützte Formate:
 * - Tokens Studio for Figma (W3C DTCG Draft)
 * - Figma Variables API (native)
 *
 * Usage:
 *   node scripts/figma-sync.mjs                    # Interaktiver Modus
 *   node scripts/figma-sync.mjs --pull             # Tokens aus Figma ziehen
 *   node scripts/figma-sync.mjs --push             # Tokens nach Figma pushen
 *   node scripts/figma-sync.mjs --diff             # Nur Diff anzeigen
 *   node scripts/figma-sync.mjs --from-file=X.json # Tokens Studio JSON importieren
 *
 * Environment:
 *   FIGMA_TOKEN        — Figma Personal Access Token
 *   FIGMA_FILE_KEY     — Figma File Key (aus URL)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKENS_PATH = resolve(ROOT, 'data/design-tokens.json');
const FIGMA_TOKENS_PATH = resolve(ROOT, 'data/figma-tokens.json');
const ENV_PATH = resolve(ROOT, '.env');

// ─── Environment ─────────────────────────────────────────────────────

function loadEnv() {
  if (existsSync(ENV_PATH)) {
    const lines = readFileSync(ENV_PATH, 'utf-8').split('\n');
    for (const line of lines) {
      const [key, ...val] = line.split('=');
      if (key && val.length) process.env[key.trim()] = val.join('=').trim();
    }
  }
}

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '';

// ─── Figma API ───────────────────────────────────────────────────────

function checkCredentials() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('❌ FIGMA_TOKEN und FIGMA_FILE_KEY müssen in .env gesetzt sein.');
    console.error('   Erstelle eine .env Datei mit:');
    console.error('   FIGMA_TOKEN=figd_xxxxx');
    console.error('   FIGMA_FILE_KEY=abc123xyz');
    process.exit(1);
  }
}

async function figmaGet(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `https://api.figma.com/v1${endpoint}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) {
    const body = await res.text();
    console.error(`❌ Figma API Error ${res.status}: ${body}`);
    process.exit(1);
  }
  return res.json();
}

// ─── Figma File API (funktioniert mit file_content:read) ─────────────

async function fetchFigmaFile() {
  checkCredentials();
  console.log('🔄 Fetching Figma File (Styles + Components)...');

  // 1. File Metadata + Styles
  const file = await figmaGet(`/files/${FIGMA_FILE_KEY}?geometry=paths&plugin_data=shared`);
  console.log(`   📄 File: "${file.name}" (v${file.version})`);
  console.log(`   📅 Last modified: ${file.lastModified}`);

  // 2. Styles separat (vollständige Style-Definitionen)
  const stylesData = await figmaGet(`/files/${FIGMA_FILE_KEY}/styles`);
  const styles = stylesData.meta?.styles || [];
  console.log(`   🎨 Styles: ${styles.length}`);

  // Zusammenführen
  const result = {
    name: file.name,
    version: file.version,
    lastModified: file.lastModified,
    styles,
    document: file.document,
  };

  writeFileSync(FIGMA_TOKENS_PATH, JSON.stringify(result, null, 2));
  console.log(`   ✅ Gespeichert: ${FIGMA_TOKENS_PATH}`);
  return result;
}

// ─── Figma Styles → NEO Token Format ─────────────────────────────────

function extractColorsFromDocument(document) {
  const colors = {};

  function walk(node) {
    // Farbstile aus Fills extrahieren
    if (node.fills && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === 'SOLID' && fill.color) {
          const hex = rgbaToHex(fill.color);
          const name = node.name || 'unknown';
          colors[name] = hex;
        }
      }
    }

    // Style-Referenzen
    if (node.styles) {
      for (const [type, styleId] of Object.entries(node.styles)) {
        if (!colors[`style:${styleId}`]) {
          colors[`style:${styleId}`] = { type, nodeId: node.id, nodeName: node.name };
        }
      }
    }

    // Rekursiv durch Kinder
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(document);
  return colors;
}

function transformFigmaFile(figmaData) {
  const result = {
    primitives: { colors: {} },
    semantic: { colors: {} },
    typography: {},
    effects: {},
    meta: {
      figmaFile: figmaData.name,
      figmaVersion: figmaData.version,
      lastModified: figmaData.lastModified,
      exportDate: new Date().toISOString(),
    },
  };

  // Styles kategorisieren
  for (const style of figmaData.styles || []) {
    const name = style.name || '';
    const type = style.style_type; // FILL, TEXT, EFFECT, GRID

    switch (type) {
      case 'FILL': {
        // Farb-Styles nach Pfad kategorisieren
        const parts = name.split('/').map(s => s.trim());
        if (parts[0]?.toLowerCase().includes('primitive') || parts[0]?.toLowerCase().includes('brand')) {
          setNested(result.primitives.colors, parts, {
            figmaKey: style.key,
            figmaNodeId: style.node_id,
            description: style.description || '',
          });
        } else {
          setNested(result.semantic.colors, parts, {
            figmaKey: style.key,
            figmaNodeId: style.node_id,
            description: style.description || '',
          });
        }
        break;
      }

      case 'TEXT': {
        const parts = name.split('/').map(s => s.trim());
        setNested(result.typography, parts, {
          figmaKey: style.key,
          figmaNodeId: style.node_id,
          description: style.description || '',
        });
        break;
      }

      case 'EFFECT': {
        const parts = name.split('/').map(s => s.trim());
        setNested(result.effects, parts, {
          figmaKey: style.key,
          figmaNodeId: style.node_id,
          description: style.description || '',
        });
        break;
      }
    }
  }

  // Resolve: Node-IDs → tatsächliche Farbwerte aus dem Document-Tree
  if (figmaData.document) {
    const docColors = extractColorsFromDocument(figmaData.document);
    result._resolvedColors = docColors;
  }

  return result;
}

// ─── Figma Style Node → Farb-/Typo-Werte auflösen ───────────────────

async function resolveStyleValues(styles) {
  const fillStyles = styles.filter(s => s.style_type === 'FILL');
  const textStyles = styles.filter(s => s.style_type === 'TEXT');
  const effectStyles = styles.filter(s => s.style_type === 'EFFECT');

  if (fillStyles.length === 0 && textStyles.length === 0) {
    return { colors: {}, typography: {}, effects: {} };
  }

  // Node-IDs sammeln
  const nodeIds = styles.map(s => s.node_id).filter(Boolean);
  if (nodeIds.length === 0) return { colors: {}, typography: {}, effects: {} };

  console.log(`   🔍 Resolving ${nodeIds.length} style nodes...`);

  // Batched API call (max 200 IDs pro Request)
  const resolved = { colors: {}, typography: {}, effects: {} };
  const batchSize = 200;

  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    const ids = batch.join(',');
    const nodesData = await figmaGet(`/files/${FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`);

    for (const [nodeId, nodeWrapper] of Object.entries(nodesData.nodes || {})) {
      const node = nodeWrapper?.document;
      if (!node) continue;

      const style = styles.find(s => s.node_id === nodeId);
      if (!style) continue;

      const name = style.name || '';
      const parts = name.split('/').map(s => s.trim());

      if (style.style_type === 'FILL' && node.fills?.[0]?.color) {
        const fill = node.fills[0];
        const hex = rgbaToHex(fill.color);
        const opacity = fill.opacity !== undefined ? fill.opacity : (fill.color.a !== undefined ? fill.color.a : 1);

        setNested(resolved.colors, parts, {
          value: hex,
          opacity: Math.round(opacity * 100) / 100,
          description: style.description || '',
        });
      }

      if (style.style_type === 'TEXT' && node.style) {
        const ts = node.style;
        setNested(resolved.typography, parts, {
          fontFamily: ts.fontFamily,
          fontWeight: ts.fontWeight,
          fontSize: ts.fontSize,
          lineHeight: ts.lineHeightPx ? `${Math.round(ts.lineHeightPx)}px` : 'auto',
          letterSpacing: ts.letterSpacing ? `${ts.letterSpacing}px` : '0',
          description: style.description || '',
        });
      }

      if (style.style_type === 'EFFECT' && node.effects?.length) {
        const effects = node.effects.map(e => ({
          type: e.type,
          color: e.color ? rgbaToHex(e.color) : null,
          offset: e.offset || null,
          radius: e.radius || 0,
          spread: e.spread || 0,
        }));
        setNested(resolved.effects, parts, { effects, description: style.description || '' });
      }
    }
  }

  return resolved;
}

// ─── Tokens Studio JSON Import ───────────────────────────────────────

function importTokensStudioFile(filePath) {
  console.log(`📥 Importiere Tokens Studio Datei: ${filePath}`);
  const raw = readFileSync(filePath, 'utf-8');
  const tsTokens = JSON.parse(raw);
  return transformTokensStudio(tsTokens);
}

// ─── Tokens Studio → NEO Format Transform ────────────────────────────

function transformTokensStudio(tsTokens) {
  const result = {
    primitives: { colors: {}, spacing: {}, sizing: {}, borderRadius: {} },
    semantic: { colors: {} },
    components: {},
  };

  // Tokens Studio Format: { "groupName": { "tokenName": { "$value": "x", "$type": "color" } } }
  function walk(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && '$value' in value) {
        // Leaf token
        const tokenPath = [...path, key];
        const type = value.$type || inferType(value.$value);
        categorizeToken(result, tokenPath, value.$value, type, value.$description);
      } else if (value && typeof value === 'object' && !key.startsWith('$')) {
        // Group
        walk(value, [...path, key]);
      }
    }
  }

  walk(tsTokens);
  return result;
}

function inferType(value) {
  if (typeof value === 'string') {
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color';
    if (value.endsWith('px') || value.endsWith('rem') || value.endsWith('em')) return 'dimension';
  }
  if (typeof value === 'number') return 'number';
  return 'string';
}

function categorizeToken(result, path, value, type, description) {
  const fullPath = path.join('.');
  const group = path[0]?.toLowerCase() || '';

  if (type === 'color') {
    if (group.includes('primitive') || group.includes('brand') || group.includes('neutral')) {
      setNested(result.primitives.colors, path.slice(1), { value, description });
    } else {
      setNested(result.semantic.colors, path.slice(1), { value, description });
    }
  } else if (type === 'dimension') {
    if (fullPath.includes('spacing')) {
      setNested(result.primitives.spacing, path.slice(1), { value, description });
    } else if (fullPath.includes('radius') || fullPath.includes('border-radius')) {
      setNested(result.primitives.borderRadius, path.slice(1), { value, description });
    } else {
      setNested(result.primitives.sizing, path.slice(1), { value, description });
    }
  }
}

function setNested(obj, keys, value) {
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// ─── Figma Variables → NEO Format Transform ──────────────────────────

function transformFigmaVariables(figmaData) {
  const result = {
    primitives: { colors: {} },
    semantic: { colors: {} },
  };

  const { meta } = figmaData;
  if (!meta?.variables || !meta?.variableCollections) return result;

  // Map collection IDs to names
  const collections = {};
  for (const [id, col] of Object.entries(meta.variableCollections)) {
    collections[id] = col.name;
  }

  // Map mode IDs to names
  const modes = {};
  for (const [, col] of Object.entries(meta.variableCollections)) {
    for (const mode of col.modes) {
      modes[mode.modeId] = mode.name;
    }
  }

  for (const [, variable] of Object.entries(meta.variables)) {
    const collection = collections[variable.variableCollectionId] || '';
    const name = variable.name; // e.g., "brand/primary/500"
    const path = name.split('/');

    // Resolve values per mode
    for (const [modeId, val] of Object.entries(variable.valuesByMode)) {
      const modeName = modes[modeId] || 'default';

      if (variable.resolvedType === 'COLOR' && val.r !== undefined) {
        const hex = rgbaToHex(val);
        const isPrimitive = collection.toLowerCase().includes('primitive') ||
                           path[0]?.toLowerCase() === 'brand' ||
                           path[0]?.toLowerCase() === 'neutral';

        if (isPrimitive) {
          setNested(result.primitives.colors, [...path], { value: hex, mode: modeName });
        } else {
          setNested(result.semantic.colors, [modeName, ...path], { value: hex });
        }
      }
    }
  }

  return result;
}

function rgbaToHex({ r, g, b, a }) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${toHex(a)}` : hex;
}

// ─── Diff Engine ─────────────────────────────────────────────────────

function diffTokens(current, incoming) {
  const changes = { added: [], modified: [], removed: [] };

  function compare(curr, inc, path = '') {
    const currKeys = curr ? Object.keys(curr) : [];
    const incKeys = inc ? Object.keys(inc) : [];

    for (const key of incKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      if (!curr || !(key in curr)) {
        changes.added.push({ path: fullPath, value: inc[key] });
      } else if (typeof inc[key] === 'object' && typeof curr[key] === 'object' && !('value' in inc[key])) {
        compare(curr[key], inc[key], fullPath);
      } else if (JSON.stringify(curr[key]) !== JSON.stringify(inc[key])) {
        changes.modified.push({ path: fullPath, old: curr[key], new: inc[key] });
      }
    }

    for (const key of currKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      if (!inc || !(key in inc)) {
        changes.removed.push({ path: fullPath, value: curr[key] });
      }
    }
  }

  compare(current, incoming);
  return changes;
}

function printDiff(diff) {
  const total = diff.added.length + diff.modified.length + diff.removed.length;

  if (total === 0) {
    console.log('✅ Keine Änderungen — Figma und Design Tokens sind synchron.');
    return;
  }

  console.log(`\n📊 Token Diff: ${total} Änderungen\n`);

  if (diff.added.length) {
    console.log(`  🟢 Hinzugefügt (${diff.added.length}):`);
    for (const c of diff.added.slice(0, 15)) {
      console.log(`     + ${c.path}: ${JSON.stringify(c.value).slice(0, 60)}`);
    }
    if (diff.added.length > 15) console.log(`     ... und ${diff.added.length - 15} weitere`);
  }

  if (diff.modified.length) {
    console.log(`  🟡 Geändert (${diff.modified.length}):`);
    for (const c of diff.modified.slice(0, 15)) {
      console.log(`     ~ ${c.path}: ${JSON.stringify(c.old).slice(0, 30)} → ${JSON.stringify(c.new).slice(0, 30)}`);
    }
    if (diff.modified.length > 15) console.log(`     ... und ${diff.modified.length - 15} weitere`);
  }

  if (diff.removed.length) {
    console.log(`  🔴 Entfernt (${diff.removed.length}):`);
    for (const c of diff.removed.slice(0, 10)) {
      console.log(`     - ${c.path}`);
    }
    if (diff.removed.length > 10) console.log(`     ... und ${diff.removed.length - 10} weitere`);
  }

  console.log('');
}

// ─── Merge into design-tokens.json ───────────────────────────────────

function mergeIntoDesignTokens(figmaTokens) {
  const current = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));

  // Merge primitive colors
  if (figmaTokens.primitives?.colors) {
    for (const [palette, shades] of Object.entries(figmaTokens.primitives.colors)) {
      const target = findPaletteTarget(current, palette);
      if (target && typeof shades === 'object') {
        for (const [shade, val] of Object.entries(shades)) {
          const value = typeof val === 'object' ? val.value : val;
          if (target.shades && shade in target.shades) {
            if (target.shades[shade] !== value) {
              console.log(`  Updated: ${palette}.${shade}: ${target.shades[shade]} → ${value}`);
              target.shades[shade] = value;
            }
          }
        }
      }
    }
  }

  // Update meta
  current.$meta.last_updated = new Date().toISOString().split('T')[0];

  writeFileSync(TOKENS_PATH, JSON.stringify(current, null, 2));
  console.log(`✅ design-tokens.json aktualisiert (${current.$meta.last_updated})`);
}

function findPaletteTarget(tokens, paletteName) {
  const name = paletteName.toLowerCase();
  const prims = tokens.primitives;

  if (prims?.brand) {
    for (const [key, val] of Object.entries(prims.brand)) {
      if (key.toLowerCase() === name || val.label?.toLowerCase().includes(name)) return val;
    }
  }
  if (prims?.neutral && name.includes('neutral')) return prims.neutral;
  if (prims?.system) {
    for (const [key, val] of Object.entries(prims.system)) {
      if (key.toLowerCase() === name) return val;
    }
  }
  return null;
}

// ─── Figma Component → Recipe Mapping ────────────────────────────────

async function fetchFigmaComponents() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('❌ FIGMA_TOKEN und FIGMA_FILE_KEY erforderlich.');
    process.exit(1);
  }

  console.log('🔄 Fetching Figma Components...');

  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );

  if (!res.ok) {
    console.error(`❌ Figma API Error ${res.status}`);
    process.exit(1);
  }

  const data = await res.json();
  return data.meta?.components || [];
}

function mapComponentsToRecipes(components) {
  const recipeUpdates = [];

  for (const comp of components) {
    const name = comp.name.toLowerCase().replace(/\s+/g, '-');
    const recipePath = resolve(ROOT, `data/${name}-recipe.json`);
    const hasRecipe = existsSync(recipePath);

    // Extract Figma variant properties
    const properties = comp.containing_frame?.containingStateGroup?.componentProperties || {};
    const variants = Object.keys(properties);

    recipeUpdates.push({
      name,
      figmaKey: comp.key,
      figmaName: comp.name,
      hasRecipe,
      recipePath,
      variants,
      action: hasRecipe ? 'update' : 'create',
    });
  }

  return recipeUpdates;
}

function printComponentMapping(updates) {
  console.log(`\n📦 Figma Components → Recipes (${updates.length}):\n`);

  const existing = updates.filter(u => u.action === 'update');
  const newOnes = updates.filter(u => u.action === 'create');

  if (existing.length) {
    console.log(`  🔄 Bestehende Recipes (${existing.length}):`);
    for (const u of existing) {
      console.log(`     ${u.name} — ${u.variants.length} Varianten in Figma`);
    }
  }

  if (newOnes.length) {
    console.log(`  🆕 Neue Komponenten ohne Recipe (${newOnes.length}):`);
    for (const u of newOnes) {
      console.log(`     ${u.name} (${u.figmaName})`);
    }
  }

  console.log('');
}

// ─── Helpers ─────────────────────────────────────────────────────────

function flattenObj(obj, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !('value' in value) && !('figmaKey' in value) && !('effects' in value)) {
      flattenObj(value, path, result);
    } else {
      result[path] = value;
    }
  }
  return result;
}

// ─── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const mode = args.find(a => a.startsWith('--'))?.replace('--', '').split('=')[0] || 'help';

switch (mode) {
  case 'pull': {
    const figmaData = await fetchFigmaFile();
    const resolved = await resolveStyleValues(figmaData.styles || []);

    console.log(`\n📊 Figma Styles aufgelöst:`);
    console.log(`   Farben:      ${Object.keys(flattenObj(resolved.colors)).length}`);
    console.log(`   Typografie:  ${Object.keys(flattenObj(resolved.typography)).length}`);
    console.log(`   Effekte:     ${Object.keys(flattenObj(resolved.effects)).length}`);

    // Diff gegen design-tokens.json
    const current = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));
    const figmaColors = flattenObj(resolved.colors);
    const currentColors = flattenObj(current.primitives || {});
    const diff = diffTokens(currentColors, figmaColors);
    printDiff(diff);

    // Resolved Daten speichern für manuelle Inspektion
    const resolvedPath = resolve(ROOT, 'data/figma-resolved.json');
    writeFileSync(resolvedPath, JSON.stringify(resolved, null, 2));
    console.log(`\n💾 Aufgelöste Werte: data/figma-resolved.json`);

    if (diff.added.length + diff.modified.length > 0) {
      console.log('\n🔧 Nächste Schritte:');
      console.log('   1. Prüfe data/figma-resolved.json');
      console.log('   2. npm run tokens          # SCSS regenerieren');
      console.log('   3. npm run build:css        # CSS kompilieren');
      console.log('   4. npm run test:unit        # Tests ausführen');
    }
    break;
  }

  case 'diff': {
    const figmaData = await fetchFigmaFile();
    const resolved = await resolveStyleValues(figmaData.styles || []);
    const current = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));
    const figmaColors = flattenObj(resolved.colors);
    const currentColors = flattenObj(current.primitives || {});
    const diff = diffTokens(currentColors, figmaColors);
    printDiff(diff);
    process.exit(diff.added.length + diff.modified.length + diff.removed.length > 0 ? 1 : 0);
  }

  case 'from-file': {
    const filePath = args.find(a => a.startsWith('--from-file='))?.split('=')[1];
    if (!filePath) {
      console.error('❌ Dateipfad erforderlich: --from-file=path/to/tokens.json');
      process.exit(1);
    }
    const transformed = importTokensStudioFile(resolve(process.cwd(), filePath));
    const current = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));
    const diff = diffTokens(current.primitives, transformed.primitives);
    printDiff(diff);

    if (diff.added.length + diff.modified.length > 0) {
      console.log('Merge? (nutze --pull oder --from-file mit --apply Flag)');
    }
    break;
  }

  case 'components': {
    checkCredentials();
    console.log('🔄 Fetching Figma Components...');
    const data = await figmaGet(`/files/${FIGMA_FILE_KEY}/components`);
    const components = data.meta?.components || [];
    console.log(`   📦 ${components.length} Components gefunden`);
    const updates = mapComponentsToRecipes(components);
    printComponentMapping(updates);
    break;
  }

  case 'push': {
    console.log('⚠️  Push nach Figma ist noch nicht implementiert.');
    console.log('   Nutze Tokens Studio for Figma Plugin für den Import.');
    break;
  }

  default:
    console.log(`
╔══════════════════════════════════════════════╗
║         Figma ↔ Design Tokens Sync          ║
╚══════════════════════════════════════════════╝

Usage:
  node scripts/figma-sync.mjs --pull             Tokens aus Figma ziehen
  node scripts/figma-sync.mjs --diff             Nur Diff anzeigen (kein Merge)
  node scripts/figma-sync.mjs --components       Figma Components → Recipe Mapping
  node scripts/figma-sync.mjs --from-file=X.json Tokens Studio JSON importieren
  node scripts/figma-sync.mjs --push             (WIP) Tokens nach Figma pushen

Environment (.env):
  FIGMA_TOKEN=figd_xxxxx                         Figma Personal Access Token
  FIGMA_FILE_KEY=abc123xyz                       Figma File Key (aus URL)

Pipeline:
  Figma → figma-sync.mjs → design-tokens.json → generate-tokens.js → SCSS
`);
}
