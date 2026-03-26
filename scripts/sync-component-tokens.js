#!/usr/bin/env node
// ==========================================================================
// Token Sync: SCSS → Configurator Registry
// ==========================================================================
// Stellt sicher, dass alle --nc-* Tokens aus _component-tokens.scss
// in tokens.generated.js registriert sind.
//
// Modi:
//   --check   Nur prüfen, Exit-Code 1 bei Drift (CI-Gate)
//   --fix     Fehlende Tokens automatisch ergänzen
//   (default) --check
//
// Nutzung:
//   node scripts/sync-component-tokens.js --check
//   node scripts/sync-component-tokens.js --fix
//
// Teil von `npm test` (als --check).
// ==========================================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCSS_PATH = path.join(ROOT, 'scss', 'scss', '00-settings', '_component-tokens.scss');
const REGISTRY_PATH = path.join(ROOT, 'apps', 'theme-configurator', 'src', 'data', 'tokens.generated.js');

const mode = process.argv.includes('--fix') ? 'fix' : 'check';

// ---------------------------------------------------------------------------
// 1. Parse SCSS: Alle --nc-* Token-Deklarationen extrahieren
// ---------------------------------------------------------------------------

function parseScssTokens(scssContent) {
  const tokens = new Map(); // id → { id, default, component, line }
  let currentComponent = null;
  let currentSubSection = null;
  const lines = scssContent.split('\n');
  let darkBlockDepth = 0;
  let inDarkBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Dark-Mode-Block überspringen (Overrides, nicht Definitionen)
    if (line.includes('@media (prefers-color-scheme: dark)')) {
      inDarkBlock = true;
      darkBlockDepth = 0;
    }
    if (inDarkBlock) {
      // Zähle { und } um das Ende des @media-Blocks zu finden
      for (const ch of line) {
        if (ch === '{') darkBlockDepth++;
        if (ch === '}') darkBlockDepth--;
      }
      if (darkBlockDepth <= 0 && line.includes('}')) {
        inDarkBlock = false;
      }
      continue;
    }

    // Komponent-Header erkennen: // Component Name Tokens
    const headerMatch = line.match(/^\/\/\s+(.+?)\s+Tokens/);
    if (headerMatch && lines[i - 1]?.match(/^\/\/ -{10,}/)) {
      currentComponent = headerMatch[1]
        .replace(/\s*\(.*\)/, '') // "(Input, Textarea, Select)" entfernen
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      currentSubSection = null;
      continue;
    }

    // Sub-Section erkennen: // -- Label --
    const subMatch = line.match(/^\s*\/\/\s+--\s+(.+?)\s+--/);
    if (subMatch) {
      currentSubSection = subMatch[1].trim();
      continue;
    }

    // Token-Deklaration: --nc-xxx-yyy: value;
    const tokenMatch = line.match(/^\s+--nc-([a-z0-9-]+):\s*(.+?)\s*;\s*(?:\/\/.*)?$/);
    if (tokenMatch) {
      const id = 'nc-' + tokenMatch[1];
      const defaultVal = tokenMatch[2].trim();

      // Duplikate ignorieren (Dark-Mode-Overrides in :root:not())
      if (!tokens.has(id)) {
        tokens.set(id, {
          id,
          default: defaultVal,
          component: currentComponent || 'unknown',
          subSection: currentSubSection,
          line: lineNum,
        });
      }
      continue;
    }

    // Auch Kommentar-Zeilen nach --nc-* durchsuchen (Ausschluss)
    // Diese sollen NICHT als echte Tokens zählen
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// 2. Parse Registry: Alle Token-IDs aus tokens.generated.js extrahieren
// ---------------------------------------------------------------------------

function parseRegistryTokens(jsContent) {
  const tokenIds = new Set();

  // Token-Definitionen in "tokens" Arrays: "id": "nc-xxx-yyy"
  const idRegex = /"id":\s*"(nc-[a-z0-9-]+)"/g;
  let m;
  while ((m = idRegex.exec(jsContent)) !== null) {
    tokenIds.add(m[1]);
  }

  // Token-Referenzen in "tokenIds" Arrays
  const refRegex = /"(nc-[a-z0-9-]+)"/g;
  while ((m = refRegex.exec(jsContent)) !== null) {
    tokenIds.add(m[1]);
  }

  return tokenIds;
}

// ---------------------------------------------------------------------------
// 3. Token-Typ aus Default-Wert ableiten
// ---------------------------------------------------------------------------

function inferTokenType(defaultVal, tokenId) {
  if (!defaultVal) return 'generic';

  // ID-basierte Heuristiken (höchste Priorität)
  if (tokenId.includes('-radius')) return 'border-radius';
  if (tokenId.includes('-font-weight')) return 'fontWeight';
  if (tokenId.includes('-font-size')) return 'size';
  if (tokenId.includes('-opacity')) return 'generic';
  if (tokenId.includes('-duration') || tokenId.includes('-transition')) return 'generic';
  if (tokenId.includes('-breakpoint')) return 'size';
  if (tokenId.includes('-ratio')) return 'other';

  // Value-basierte Heuristiken
  if (defaultVal.match(/var\(--fnd-color-/)) return 'color';
  if (defaultVal.match(/var\(--fnd-radius-/)) return 'border-radius';
  if (defaultVal.match(/var\(--fnd-font-weight-/)) return 'fontWeight';
  if (defaultVal.match(/var\(--fnd-spacing-/)) return 'size';
  if (defaultVal.match(/var\(--fnd-size-/)) return 'size';
  if (defaultVal.match(/var\(--fnd-shadow-/)) return 'shadow';
  if (defaultVal.match(/var\(--fnd-border-width-/)) return 'size';
  if (defaultVal.match(/var\(--fnd-opacity-/)) return 'generic';
  if (defaultVal.match(/var\(--fnd-motion-/)) return 'generic';
  if (defaultVal.match(/var\(--fnd-media-/)) return 'other';
  if (defaultVal.match(/var\(--fs-/)) return 'size';
  if (defaultVal.match(/var\(--nc-/)) return 'generic'; // Alias-Token
  if (defaultVal === 'transparent') return 'color';
  if (defaultVal.match(/^#[0-9a-f]{3,8}$/i)) return 'color';
  if (defaultVal.match(/^rgba?\(/)) return 'color';
  if (defaultVal.match(/color-mix\(/)) return 'generic';
  if (defaultVal.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) return 'size';
  if (defaultVal.match(/^\d+(\.\d+)?$/)) return 'generic';
  if (defaultVal.match(/^\d+\s*\/\s*\d+$/)) return 'other'; // aspect ratio

  return 'generic';
}

// ---------------------------------------------------------------------------
// 4. Semantic-Ref aus Default-Wert ableiten (für color tokens)
// ---------------------------------------------------------------------------

function inferRef(defaultVal) {
  const refMatch = defaultVal.match(/var\(--fnd-color-(.+?)\)/);
  if (refMatch) return refMatch[1];

  const radiusMatch = defaultVal.match(/var\(--fnd-radius-(.+?)\)/);
  if (radiusMatch) return 'radius-' + radiusMatch[1];

  const weightMatch = defaultVal.match(/var\(--fnd-font-weight-(.+?)\)/);
  if (weightMatch) return 'font-weight-' + weightMatch[1];

  return null;
}

// ---------------------------------------------------------------------------
// 5. Komponenten-ID aus Token-ID extrahieren
// ---------------------------------------------------------------------------

function extractComponentId(tokenId) {
  // nc-button-primary-bg → button
  // nc-form-control-bg → form-control
  // nc-dt-radius → data-table (Sonderfall)
  // nc-nav-menu-trigger-color → nav-menu (Sonderfall)

  const COMPONENT_MAP = {
    'nc-button-': 'button',
    'nc-input-': 'input',
    'nc-form-control-': 'input', // Form-Control Tokens gehören zur Input-Komponente
    'nc-form-label-': 'form-label',
    'nc-form-error-': 'form-error',
    'nc-checkbox-': 'checkbox',
    'nc-radio-': 'radio',
    'nc-switch-': 'switch',
    'nc-select-': 'select',
    'nc-textarea-': 'textarea',
    'nc-badge-': 'badge',
    'nc-avatar-': 'avatar',
    'nc-card-': 'card',
    'nc-accordion-': 'accordion',
    'nc-tabs-': 'tabs',
    'nc-modal-': 'modal',
    'nc-dialog-': 'dialog',
    'nc-toast-': 'toast',
    'nc-alert-': 'alert',
    'nc-tooltip-': 'tooltip',
    'nc-popover-': 'popover',
    'nc-dropdown-': 'dropdown-menu',
    'nc-nav-menu-': 'nav-menu',
    'nc-nav-': 'navigation',
    'nc-hero-': 'hero',
    'nc-shell-': 'shell',
    'nc-dt-': 'data-table',
    'nc-table-': 'table',
    'nc-item-': 'item',
    'nc-chip-': 'chip',
    'nc-tag-': 'tag',
    'nc-progress-': 'progress',
    'nc-spinner-': 'spinner',
    'nc-skeleton-': 'skeleton',
    'nc-breadcrumb-': 'breadcrumb',
    'nc-pagination-': 'pagination',
    'nc-search-': 'search',
    'nc-segmented-': 'segmented-control',
    'nc-sidebar-': 'sidebar',
    'nc-drawer-': 'drawer',
    'nc-fieldset-': 'fieldset',
    'nc-grid-': 'grid',
    'nc-aspect-ratio-': 'aspect-ratio',
    'nc-video-': 'video',
    'nc-product-showcase-': 'product-showcase',
    'nc-compare-table-': 'compare-table',
    'nc-text-media-': 'text-media',
    'nc-slider-': 'slider',
    'nc-meter-': 'meter',
    'nc-toolbar-': 'toolbar',
    'nc-action-bar-': 'action-bar',
    'nc-code-block-': 'code-block',
    'nc-blockquote-': 'blockquote',
    'nc-kbd-': 'kbd',
    'nc-logo-wall-': 'logo-wall',
    'nc-card-grid-cta-': 'card-grid-cta',
    'nc-story-gallery-': 'story-gallery',
    'nc-fade-gallery-': 'fade-gallery',
    'nc-hero-tom-': 'hero-tom',
    'nc-hero-tmob-': 'hero-tmob',
    'nc-parallax-': 'parallax-bg',
    'nc-anim-': 'animations',
    'nc-timeline-': 'timeline',
    'nc-stepper-': 'stepper',
    'nc-treeview-': 'treeview',
    'nc-color-swatch-': 'color-swatch',
    'nc-file-upload-': 'file-upload',
    'nc-calendar-': 'calendar',
    'nc-date-picker-': 'date-picker',
  };

  // Longest-match-first
  const sorted = Object.entries(COMPONENT_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, comp] of sorted) {
    if (tokenId.startsWith(prefix)) return comp;
  }

  // Fallback: nc-{component}-* → component (nimm die ersten 2 Segmente)
  const parts = tokenId.replace(/^nc-/, '').split('-');
  if (parts.length >= 2) {
    return parts[0];
  }

  return null;
}

// ---------------------------------------------------------------------------
// 6. Human-Label aus Token-ID generieren
// ---------------------------------------------------------------------------

function generateLabel(tokenId, componentPrefix) {
  // nc-button-primary-bg → "Primary BG"
  let label = tokenId;
  if (componentPrefix) {
    label = label.replace(componentPrefix, '');
  }
  // Kebab → Title Case
  return label
    .replace(/^-+/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ---------------------------------------------------------------------------
// 7. Fix: Fehlende Tokens in tokens.generated.js einfügen
// ---------------------------------------------------------------------------

function fixMissingTokens(jsContent, missingTokens) {
  // Gruppiere nach Komponente
  const byComponent = new Map();
  for (const token of missingTokens) {
    const comp = extractComponentId(token.id) || 'unknown';
    if (!byComponent.has(comp)) byComponent.set(comp, []);
    byComponent.get(comp).push(token);
  }

  let content = jsContent;
  let addedCount = 0;
  const newComponents = [];

  for (const [compId, tokens] of byComponent) {
    // Prüfe ob Komponente in Registry existiert
    const compPattern = new RegExp(`"id":\\s*"${compId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*\\n\\s*"label"`);
    const compMatch = compPattern.exec(content);

    if (compMatch) {
      // Komponente existiert — Token-Definitionen hinzufügen
      // Finde das Ende des tokens-Arrays
      const compStart = compMatch.index;
      const tokensArrayStart = content.indexOf('"tokens":', compStart);
      if (tokensArrayStart === -1 || tokensArrayStart - compStart > 20000) {
        console.warn(`  ⚠ Konnte tokens-Array für "${compId}" nicht finden`);
        continue;
      }

      // Finde das Ende des letzten Token-Objekts im Array
      // Suche die schließende ] des tokens-Arrays
      let depth = 0;
      let arrayEnd = -1;
      for (let i = tokensArrayStart + 9; i < content.length; i++) {
        if (content[i] === '[') depth++;
        if (content[i] === ']') {
          depth--;
          if (depth === 0) {
            arrayEnd = i;
            break;
          }
        }
      }

      if (arrayEnd === -1) {
        console.warn(`  ⚠ Konnte tokens-Array-Ende für "${compId}" nicht finden`);
        continue;
      }

      // Token-Definitionen generieren
      const tokenDefs = tokens.map(t => {
        const type = inferTokenType(t.default, t.id);
        const ref = inferRef(t.default);
        const label = generateLabel(t.id, t.id.match(/^nc-[a-z]+-/)?.[0]);

        let def = `      {\n        "id": "${t.id}",\n        "label": "${label}",\n        "type": "${type}"`;
        if (ref && type === 'color') {
          def += `,\n        "ref": "${ref}"`;
        } else {
          def += `,\n        "default": "${t.default}"`;
        }
        def += '\n      }';
        return def;
      });

      // Vor dem ] einfügen
      const insertPoint = arrayEnd;
      const comma = content[arrayEnd - 1] === '\n' ? '' : '';
      const insertion = ',\n' + tokenDefs.join(',\n');
      content = content.substring(0, insertPoint) + insertion + content.substring(insertPoint);
      addedCount += tokens.length;

      console.log(`  ✓ ${compId}: ${tokens.length} Token(s) hinzugefügt`);
    } else {
      // Neue Komponente nötig
      newComponents.push({ compId, tokens });
    }
  }

  // Neue Komponenten einfügen (vor dem letzten Element in componentTokenGroups)
  if (newComponents.length > 0) {
    for (const { compId, tokens } of newComponents) {
      const tokenDefs = tokens.map(t => {
        const type = inferTokenType(t.default, t.id);
        const ref = inferRef(t.default);
        const label = generateLabel(t.id, t.id.match(/^nc-[a-z]+-/)?.[0]);

        let def = `      {\n        "id": "${t.id}",\n        "label": "${label}",\n        "type": "${type}"`;
        if (ref && type === 'color') {
          def += `,\n        "ref": "${ref}"`;
        } else {
          def += `,\n        "default": "${t.default}"`;
        }
        def += '\n      }';
        return def;
      });

      const compLabel = compId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const newComp = `  {\n    "id": "${compId}",\n    "label": "${compLabel}",\n    "icon": "box",\n    "tokens": [\n${tokenDefs.join(',\n')}\n    ],\n    "subgroups": [\n      {\n        "id": "core",\n        "label": "Core",\n        "tokenIds": [${tokens.map(t => `"${t.id}"`).join(', ')}]\n      }\n    ]\n  }`;

      // Einfügen vor dem Ende von componentTokenGroups
      // Das Array endet mit "]\n" gefolgt von "// ---" oder "export const"
      const foundationIdx = content.indexOf('export const foundationTokens');
      if (foundationIdx === -1) {
        console.warn(`  ⚠ Konnte Einfüge-Position für neue Komponente "${compId}" nicht finden`);
        continue;
      }

      // Suche rückwärts nach dem letzten "}" + "]" vor foundationTokens
      // Das componentTokenGroups Array endet mit "  }\n]\n"
      let closeArrayIdx = -1;
      for (let j = foundationIdx - 1; j > 0; j--) {
        if (content[j] === ']' && content.substring(j - 1, j + 1).match(/\n?\]/)) {
          closeArrayIdx = j;
          break;
        }
      }
      if (closeArrayIdx === -1) continue;

      // Vor "]" einfügen — nach dem letzten "  }" des letzten Eintrags
      // Finde die "  }" vor dem "]"
      const lastBrace = content.lastIndexOf('}', closeArrayIdx);
      if (lastBrace === -1) continue;

      // Nach "  }" einfügen (mit Komma falls nötig)
      const afterBrace = lastBrace + 1;
      const needsComma = !content.substring(lastBrace + 1, closeArrayIdx).includes(',');
      const prefix = needsComma ? ',\n' : '\n';
      content = content.substring(0, afterBrace) + prefix + newComp + content.substring(afterBrace);
      addedCount += tokens.length;

      console.log(`  ✓ ${compId}: Neue Komponente mit ${tokens.length} Token(s) erstellt`);
    }
  }

  return { content, addedCount };
}

// ---------------------------------------------------------------------------
// 8. Main
// ---------------------------------------------------------------------------

function main() {
  console.log('');
  console.log('Token Sync: _component-tokens.scss → tokens.generated.js');
  console.log('─'.repeat(60));

  // Dateien lesen
  const scssContent = fs.readFileSync(SCSS_PATH, 'utf8');
  const jsContent = fs.readFileSync(REGISTRY_PATH, 'utf8');

  // Tokens parsen
  const scssTokens = parseScssTokens(scssContent);
  const registryTokenIds = parseRegistryTokens(jsContent);

  // Kommentar-Fragmente filtern (unvollständige Token-IDs aus Kommentaren)
  const commentPatterns = /^nc-(button-bg|form-control-)$/;
  const realScssTokens = new Map();
  for (const [id, token] of scssTokens) {
    if (!commentPatterns.test(id)) {
      realScssTokens.set(id, token);
    }
  }

  console.log(`  SCSS:     ${realScssTokens.size} Token-Deklarationen`);
  console.log(`  Registry: ${registryTokenIds.size} Token-IDs`);

  // Diff
  const missing = [];
  for (const [id, token] of realScssTokens) {
    if (!registryTokenIds.has(id)) {
      missing.push(token);
    }
  }

  // Bericht nur für fehlende in Registry
  const orphaned = [];
  for (const id of registryTokenIds) {
    if (!realScssTokens.has(id)) {
      orphaned.push(id);
    }
  }

  if (missing.length === 0) {
    console.log('');
    console.log('  ✅ Alle Tokens synchron — 0 fehlend');
    if (orphaned.length > 0) {
      console.log(`  ℹ  ${orphaned.length} Token(s) nur in Registry (kein SCSS-Match — evtl. Alias oder Legacy)`);
    }
    console.log('');
    process.exit(0);
  }

  // Fehlende Tokens ausgeben
  console.log('');
  console.log(`  ❌ ${missing.length} Token(s) fehlen in Registry:`);
  console.log('');

  // Gruppiert nach Komponente
  const grouped = new Map();
  for (const token of missing) {
    const comp = extractComponentId(token.id) || 'unknown';
    if (!grouped.has(comp)) grouped.set(comp, []);
    grouped.get(comp).push(token);
  }

  for (const [comp, tokens] of [...grouped].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${comp} (${tokens.length}):`);
    for (const t of tokens) {
      console.log(`    - ${t.id}  →  ${t.default}`);
    }
  }

  if (mode === 'check') {
    console.log('');
    console.log('  Zum automatischen Beheben: node scripts/sync-component-tokens.js --fix');
    console.log('');
    process.exit(1);
  }

  // Fix-Modus
  console.log('');
  console.log('  Behebe...');
  const { content: fixed, addedCount } = fixMissingTokens(jsContent, missing);
  fs.writeFileSync(REGISTRY_PATH, fixed, 'utf8');
  console.log('');
  console.log(`  ✅ ${addedCount} Token(s) zu tokens.generated.js hinzugefügt`);
  console.log('');
}

main();
