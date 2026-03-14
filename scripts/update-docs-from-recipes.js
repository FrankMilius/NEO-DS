#!/usr/bin/env node
// ==========================================================================
// update-docs-from-recipes.js
// ==========================================================================
// Generiert Style-, API- und A11y-Tab-Inhalte in Docs aus Recipe-JSON-Dateien.
//
// Usage:
//   node scripts/update-docs-from-recipes.js              # Alle Docs
//   node scripts/update-docs-from-recipes.js --dry-run    # Nur Report
//   node scripts/update-docs-from-recipes.js --component badge  # Einzeln
// ==========================================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RECIPE_DIR = path.join(ROOT, 'data');
const DOCS_DIR = path.join(ROOT, 'docs', 'content');
const TOKENS_FILE = path.join(ROOT, 'scss', 'scss', '00-settings', '_component-tokens.scss');

// ---------------------------------------------------------------------------
// CLI Args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const singleIdx = args.indexOf('--component');
const SINGLE_COMPONENT = singleIdx !== -1 ? args[singleIdx + 1] : null;

// ---------------------------------------------------------------------------
// Token Parser
// ---------------------------------------------------------------------------
function parseComponentTokens() {
  const src = fs.readFileSync(TOKENS_FILE, 'utf-8');
  const map = new Map(); // token-name (without --) => { value, comment, raw }

  // Match lines like:  --nc-badge-height-sm: 20px;  // kompakter Zaehler
  // or:                --nc-badge-radius: var(--fnd-radius-full);  // 9999px
  // Use [^\S\n]* (non-newline whitespace) to prevent matching comments on the next line
  const re = /^\s*(--nc-[a-z0-9-]+):\s*([^;]+);[^\S\n]*(?:\/\/\s*([^\n]+))?$/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];
    const rawValue = m[2].trim();
    const comment = m[3] ? m[3].trim() : null;
    map.set(name.replace(/^--/, ''), { value: rawValue, comment, raw: name });
  }
  return map;
}

// Resolve display value + foundation ref for a token
function resolveToken(tokenName, tokenMap) {
  const prefixed = `nc-${tokenName}`.replace(/^nc-nc-/, 'nc-'); // normalize
  const key = prefixed.startsWith('nc-') ? prefixed : `nc-${prefixed}`;
  const entry = tokenMap.get(key);

  if (!entry) return { displayValue: '—', foundation: '—', raw: `--${key}` };

  const isFoundationRef = /^var\(--fnd-/.test(entry.value) || /^var\(--fs-/.test(entry.value);

  // Comment is a resolved value only if it looks like a CSS value (px, rem, %, number, etc.)
  const commentTrimmed = entry.comment ? entry.comment.trim() : '';
  const isResolvedComment = commentTrimmed && /^[\d.]+(?:px|rem|em|%|s|ms)?(?:\s*\(.*\))?$/.test(commentTrimmed);
  const displayValue = isResolvedComment ? commentTrimmed : entry.value;
  const foundation = isFoundationRef ? entry.value : '—';
  // Description: non-resolved comment text (explanatory comments)
  const description = (entry.comment && !isResolvedComment) ? commentTrimmed : '';

  return { displayValue, foundation, description, raw: entry.raw };
}

// ---------------------------------------------------------------------------
// Escape HTML entities (like the existing docs do)
// ---------------------------------------------------------------------------
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Detect tone-like token groups
// ---------------------------------------------------------------------------
function detectToneGroups(tokenGroups) {
  const tonePrefix = /^tone-/;
  const toneKeys = Object.keys(tokenGroups).filter(k => tonePrefix.test(k));
  if (toneKeys.length < 2) return null;

  // Check if all tone groups have matching token structure (e.g. *-bg, *-color, *-border)
  const suffixes = new Set();
  for (const key of toneKeys) {
    const group = tokenGroups[key];
    for (const token of group.tokens) {
      // Extract suffix after the tone name: nc-badge-success-bg -> bg
      const parts = token.split('-');
      suffixes.add(parts[parts.length - 1]);
    }
  }
  return { keys: toneKeys, suffixes: [...suffixes] };
}

// ---------------------------------------------------------------------------
// HTML Generators
// ---------------------------------------------------------------------------

function generateStyleTab(recipe, tokenMap) {
  const { styling, meta } = recipe;
  if (!styling || !styling.tokenGroups) return null;

  const component = meta.component;
  const groups = styling.tokenGroups;
  const baseGroupKeys = styling.baseTokenGroups || [];
  const toneInfo = detectToneGroups(groups);
  const toneKeys = toneInfo ? toneInfo.keys : [];

  const lines = [];
  lines.push('<!-- AUTO:STYLE:START -->');
  lines.push('<section class="docs__section" id="style-tokens">');
  lines.push('  <h2 class="docs__section-title">Component Tokens</h2>');

  // Base token groups first
  for (const key of baseGroupKeys) {
    const group = groups[key];
    if (!group) continue;
    lines.push(...generateTokenGroupTable(group, tokenMap));
  }

  // Tone cross-reference table if applicable
  if (toneKeys.length > 0) {
    lines.push(`  <h3 class="docs__section-title" style="font-size: var(--fnd-typography-heading-s-font-size);">Farb-Tokens je Tone</h3>`);
    lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--striped">');
    lines.push('    <table class="nc-data-table__table">');

    // Determine columns from token suffixes
    const suffixLabels = { bg: 'Background', color: 'Color', border: 'Border' };
    const suffixes = toneInfo.suffixes.filter(s => suffixLabels[s]);
    const extraSuffixes = toneInfo.suffixes.filter(s => !suffixLabels[s]);

    lines.push(`    <thead><tr><th>Tone</th>${suffixes.map(s => `<th>${suffixLabels[s] || s}</th>`).join('')}</tr></thead>`);
    lines.push('    <tbody>');

    for (const key of toneKeys) {
      const group = groups[key];
      const label = group.label;
      const cells = suffixes.map(suffix => {
        const token = group.tokens.find(t => t.endsWith(`-${suffix}`));
        return token
          ? `<td><code class="docs__token">--${token}</code></td>`
          : '<td>—</td>';
      });
      lines.push(`      <tr><td><strong>${esc(label)}</strong></td>${cells.join('')}</tr>`);
    }

    lines.push('    </tbody>');
    lines.push('    </table>');
    lines.push('  </div>');
  }

  // Non-base, non-tone groups
  const shownKeys = new Set([...baseGroupKeys, ...toneKeys]);
  for (const [key, group] of Object.entries(groups)) {
    if (shownKeys.has(key)) continue;
    lines.push(...generateTokenGroupTable(group, tokenMap));
  }

  lines.push('</section>');
  lines.push('<!-- AUTO:STYLE:END -->');
  return lines.join('\n');
}

function generateTokenGroupTable(group, tokenMap) {
  const lines = [];
  lines.push(`  <h3 class="docs__section-title" style="font-size: var(--fnd-typography-heading-s-font-size);">${esc(group.label)}</h3>`);
  lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--striped">');
  lines.push('    <table class="nc-data-table__table">');
  lines.push('    <thead><tr><th>Token</th><th>Wert</th><th>Beschreibung</th></tr></thead>');
  lines.push('    <tbody>');

  for (const tokenName of group.tokens) {
    const resolved = resolveToken(tokenName, tokenMap);
    // Description: show explanatory comment; avoid duplicating the foundation ref if it's already the display value
    let desc = resolved.description;
    if (!desc && resolved.foundation !== '—' && resolved.foundation !== resolved.displayValue) {
      desc = resolved.foundation;
    }
    lines.push(`      <tr><td><code class="docs__token">--${tokenName}</code></td><td>${esc(resolved.displayValue)}</td><td>${desc ? esc(desc) : ''}</td></tr>`);
  }

  lines.push('    </tbody>');
  lines.push('    </table>');
  lines.push('  </div>');
  return lines;
}

// ---------------------------------------------------------------------------
// API Tab
// ---------------------------------------------------------------------------
function generateApiTab(recipe, tokenMap) {
  const { anatomy, axes, styling, meta, states } = recipe;
  if (!anatomy || !styling) return null;

  const component = meta.component;
  const rootClass = anatomy.root?.element || `.nc-${component}`;
  const isInteractive = states?.interactive !== false;

  const lines = [];
  lines.push('<!-- AUTO:API:START -->');

  // 1. Overview
  lines.push('<section class="docs__section" id="api-overview">');
  lines.push('  <h2 class="docs__section-title">Component Overview</h2>');
  lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--striped">');
  lines.push('    <table class="nc-data-table__table">');
  lines.push('    <tbody>');
  lines.push(`      <tr><td><strong>Kanonische Klasse</strong></td><td><code class="docs__token">${esc(rootClass)}</code></td></tr>`);
  lines.push(`      <tr><td><strong>BEM-Block</strong></td><td><code class="docs__token">${esc(rootClass.replace(/^\./, ''))}</code></td></tr>`);
  lines.push(`      <tr><td><strong>Token-Namespace</strong></td><td><code class="docs__token">--${rootClass.replace(/^\./, '')}-*</code></td></tr>`);
  lines.push(`      <tr><td><strong>Status</strong></td><td>${meta.status || 'stable'}</td></tr>`);
  lines.push(`      <tr><td><strong>Interaktiv</strong></td><td>${isInteractive ? 'Ja' : 'Nein'}</td></tr>`);
  lines.push('    </tbody>');
  lines.push('    </table>');
  lines.push('  </div>');
  lines.push('</section>');

  // 2. CSS Classes (BEM)
  lines.push('<section class="docs__section" id="api-classes">');
  lines.push('  <h2 class="docs__section-title">CSS-Klassen (BEM)</h2>');

  // Block & Elements
  lines.push(`  <h3 class="docs__section-title" style="font-size: var(--fnd-typography-heading-s-font-size);">Block &amp; Elemente</h3>`);
  lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--striped">');
  lines.push('    <table class="nc-data-table__table">');
  lines.push('    <thead><tr><th>Klasse</th><th>Typ</th><th>Beschreibung</th></tr></thead>');
  lines.push('    <tbody>');
  lines.push(`      <tr><td><code class="docs__token">${esc(rootClass)}</code></td><td>Block</td><td>${esc(component)}-Container</td></tr>`);

  if (anatomy.slots) {
    for (const slot of anatomy.slots) {
      const optLabel = slot.optional ? ' (optional)' : '';
      lines.push(`      <tr><td><code class="docs__token">${esc(slot.element)}</code></td><td>Element${optLabel}</td><td>${esc(slot.name)}</td></tr>`);
    }
  }

  lines.push('    </tbody>');
  lines.push('    </table>');
  lines.push('  </div>');

  // Axes as modifier tables
  if (axes) {
    for (const [axisKey, axis] of Object.entries(axes)) {
      lines.push(`  <h3 class="docs__section-title" style="font-size: var(--fnd-typography-heading-s-font-size);">${esc(axis.label)}-Modifier</h3>`);
      lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--striped">');
      lines.push('    <table class="nc-data-table__table">');
      lines.push('    <thead><tr><th>Klasse</th><th>Wert</th><th>Beschreibung</th></tr></thead>');
      lines.push('    <tbody>');

      for (const [valKey, valObj] of Object.entries(axis.values)) {
        const modifier = valObj.modifier;
        const cls = modifier
          ? `<code class="docs__token">.${esc(modifier)}</code>`
          : '<em>(kein Modifier)</em>';
        lines.push(`      <tr><td>${cls}</td><td>${esc(valKey)}</td><td>${esc(axis.description || '')}</td></tr>`);
      }

      lines.push('    </tbody>');
      lines.push('    </table>');
      lines.push('  </div>');
    }
  }

  lines.push('</section>');

  // 3. CSS Custom Properties
  lines.push('<section class="docs__section" id="api-tokens">');
  lines.push('  <h2 class="docs__section-title">CSS Custom Properties</h2>');
  lines.push('  <p class="docs__section-desc">');
  lines.push('    Alle Tokens werden in <code class="docs__token">:root</code> registriert und k&ouml;nnen auf jedem Scope &uuml;berschrieben werden.');
  lines.push('  </p>');
  lines.push('  <div class="nc-data-table nc-data-table--static nc-data-table--compact nc-data-table--striped">');
  lines.push('    <table class="nc-data-table__table">');
  lines.push('    <thead><tr><th>Token</th><th>Default</th><th>Foundation</th></tr></thead>');
  lines.push('    <tbody>');

  if (styling.tokenGroups) {
    for (const [groupKey, group] of Object.entries(styling.tokenGroups)) {
      // Group header row
      lines.push(`      <tr><td colspan="3" style="padding: var(--fnd-spacing-02); background: var(--fnd-color-background-secondary); font-weight: 600;">${esc(group.label)}</td></tr>`);

      for (const tokenName of group.tokens) {
        const resolved = resolveToken(tokenName, tokenMap);
        lines.push(`      <tr><td><code class="docs__token">--${tokenName}</code></td><td>${esc(resolved.displayValue)}</td><td>${resolved.foundation !== '—' ? esc(resolved.foundation) : '&mdash;'}</td></tr>`);
      }
    }
  }

  lines.push('    </tbody>');
  lines.push('    </table>');
  lines.push('  </div>');
  lines.push('</section>');

  // 4. Slots / Element Structure (from domNotes)
  if (anatomy.domNotes && anatomy.domNotes.length > 0) {
    lines.push('<section class="docs__section" id="api-dom-notes">');
    lines.push('  <h2 class="docs__section-title">DOM-Hinweise</h2>');
    lines.push('  <ul>');
    for (const note of anatomy.domNotes) {
      lines.push(`    <li>${esc(note)}</li>`);
    }
    lines.push('  </ul>');
    lines.push('</section>');
  }

  lines.push('<!-- AUTO:API:END -->');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// A11y Tab
// ---------------------------------------------------------------------------

// SVG icons for a11y blocks
const A11Y_ICONS = {
  contrast: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>',
  keyboard: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>',
  noInteract: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
  screenReader: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  focus: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
  generic: '<svg class="docs-a11y-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

// Map assertion IDs to German labels + icons
const ASSERTION_MAP = {
  hasAccessibleName: {
    title: 'Zugänglicher Name erforderlich',
    icon: 'screenReader',
    text: 'Komponente muss einen zugänglichen Namen haben (via Text-Inhalt, aria-label oder aria-labelledby).'
  },
  doNotRelyOnColorOnly: {
    title: 'Farbe nie als alleiniges Signal',
    icon: 'contrast',
    text: 'Farbe darf nicht das einzige Mittel sein, um Informationen zu vermitteln (WCAG 1.4.1).'
  },
  focusVisible: {
    title: 'Sichtbarer Fokus-Indikator',
    icon: 'focus',
    text: 'Interaktive Elemente müssen einen sichtbaren Fokus-Indikator haben (WCAG 2.4.7).'
  },
  keyboardOperable: {
    title: 'Tastaturbedienbar',
    icon: 'keyboard',
    text: 'Alle Funktionen müssen per Tastatur erreichbar sein (WCAG 2.1.1).'
  },
  ariaRequired: {
    title: 'ARIA-Attribute erforderlich',
    icon: 'screenReader',
    text: 'Komponente benötigt spezifische ARIA-Attribute für Screenreader-Kompatibilität.'
  },
  roleRequired: {
    title: 'ARIA-Rolle erforderlich',
    icon: 'screenReader',
    text: 'Komponente benötigt eine explizite ARIA-Rolle.'
  }
};

function generateA11yTab(recipe) {
  const { a11y, meta } = recipe;
  if (!a11y || !a11y.base) return null;

  const base = a11y.base;
  const overrides = a11y.overrides || [];

  const lines = [];
  lines.push('<!-- AUTO:A11Y:START -->');
  lines.push('<h2 class="docs__section-title">Accessibility Referenz</h2>');

  // Note as intro
  if (base.note) {
    lines.push(`<p class="docs__section-desc">${esc(base.note)}</p>`);
  }

  // Interactive / non-interactive block
  if (base.interactive === false) {
    lines.push('<div class="docs-a11y-block">');
    lines.push(`  ${A11Y_ICONS.noInteract}`);
    lines.push('  <div class="docs-a11y-block__content">');
    lines.push('    <h4>Nicht interaktiv</h4>');
    lines.push('    <ul>');
    lines.push(`      <li>Diese Komponente ist nicht fokussierbar und nicht klickbar.</li>`);
    lines.push('    </ul>');
    lines.push('  </div>');
    lines.push('</div>');
  }

  // Contrast target
  if (base.contrastTarget) {
    lines.push('<div class="docs-a11y-block">');
    lines.push(`  ${A11Y_ICONS.contrast}`);
    lines.push('  <div class="docs-a11y-block__content">');
    lines.push(`    <h4>Farbkontrast: ${esc(base.contrastTarget)}</h4>`);
    lines.push('    <ul>');
    lines.push(`      <li>Alle Farbvarianten erfüllen dieses Kontrastziel im Default-Theme.</li>`);
    lines.push('      <li>Bei Custom-Überschreibungen den Kontrast manuell prüfen.</li>');
    lines.push('    </ul>');
    lines.push('  </div>');
    lines.push('</div>');
  }

  // Focus indicator
  if (base.focusIndicator) {
    lines.push('<div class="docs-a11y-block">');
    lines.push(`  ${A11Y_ICONS.focus}`);
    lines.push('  <div class="docs-a11y-block__content">');
    lines.push(`    <h4>Fokus-Indikator</h4>`);
    lines.push('    <ul>');
    lines.push(`      <li>${esc(base.focusIndicator)}</li>`);
    lines.push('    </ul>');
    lines.push('  </div>');
    lines.push('</div>');
  }

  // Assertions
  if (base.assertions) {
    for (const assertion of base.assertions) {
      const mapped = ASSERTION_MAP[assertion];
      if (!mapped) continue;

      lines.push('<div class="docs-a11y-block">');
      lines.push(`  ${A11Y_ICONS[mapped.icon] || A11Y_ICONS.generic}`);
      lines.push('  <div class="docs-a11y-block__content">');
      lines.push(`    <h4>${esc(mapped.title)}</h4>`);
      lines.push('    <ul>');
      lines.push(`      <li>${esc(mapped.text)}</li>`);
      lines.push('    </ul>');
      lines.push('  </div>');
      lines.push('</div>');
    }
  }

  // Overrides
  for (const override of overrides) {
    const whenDesc = describeWhen(override.when);
    const title = `Wenn: ${whenDesc}`;

    lines.push('<div class="docs-a11y-block">');
    lines.push(`  ${A11Y_ICONS.generic}`);
    lines.push('  <div class="docs-a11y-block__content">');
    lines.push(`    <h4>${esc(title)}</h4>`);
    lines.push('    <ul>');

    if (override.require) {
      for (const req of override.require) {
        lines.push(`      <li><strong>Pflicht:</strong> <code class="docs__token">${esc(req)}</code></li>`);
      }
    }
    if (override.suggest) {
      for (const sug of override.suggest) {
        lines.push(`      <li><strong>Empfohlen:</strong> <code class="docs__token">${esc(sug)}</code></li>`);
      }
    }
    if (override.contrastTarget) {
      lines.push(`      <li>Kontrastziel: ${esc(override.contrastTarget)}</li>`);
    }
    if (override.note) {
      lines.push(`      <li>${esc(override.note)}</li>`);
    }

    lines.push('    </ul>');
    lines.push('  </div>');
    lines.push('</div>');
  }

  lines.push('<!-- AUTO:A11Y:END -->');
  return lines.join('\n');
}

function describeWhen(when) {
  if (!when || !when.axes) return 'Spezialbedingung';
  const parts = [];
  for (const [axis, values] of Object.entries(when.axes)) {
    parts.push(`${axis} = ${Array.isArray(values) ? values.join(', ') : values}`);
  }
  return parts.join(' + ');
}

// ---------------------------------------------------------------------------
// Sub-Component → Parent Doc Mapping
// ---------------------------------------------------------------------------
const SUB_COMPONENT_MAP = {
  'checkbox-group': 'checkbox',
  'radio-group': 'radio',
  'form-label': 'form-field',
  'form-hint': 'form-field',
  'form-error': 'form-field',
  'form': 'form-layout',
  'form-actions': 'form-layout',
  'form-section': 'form-layout',
  'fieldset': 'form-layout',
  'validation-summary': 'form-layout',
};

// ---------------------------------------------------------------------------
// Doc File Matching
// ---------------------------------------------------------------------------
function findDocFile(recipe) {
  const component = recipe.meta.component;

  // Check sub-component mapping first
  const parentName = SUB_COMPONENT_MAP[component];
  if (parentName) {
    const parentFile = path.join(DOCS_DIR, `${parentName}.html`);
    if (fs.existsSync(parentFile)) return parentFile;
  }

  // Try meta.links.docs path first
  if (recipe.meta.links?.docs) {
    // Path like /docs/badge-docs → try badge.html
    const docsPath = recipe.meta.links.docs;
    const baseName = docsPath.split('/').pop().replace(/-docs$/, '');
    const candidate = path.join(DOCS_DIR, `${baseName}.html`);
    if (fs.existsSync(candidate)) return candidate;
  }

  // Direct name match
  const direct = path.join(DOCS_DIR, `${component}.html`);
  if (fs.existsSync(direct)) return direct;

  return null;
}

function isSubComponent(recipeName) {
  return recipeName in SUB_COMPONENT_MAP;
}

// Replace generic AUTO markers with sub-component-specific markers and add a heading
function rewrapForSub(content, subName, tabType) {
  const title = subName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Strip existing AUTO markers from the generated content
  content = content
    .replace(`<!-- AUTO:${tabType}:START -->`, '')
    .replace(`<!-- AUTO:${tabType}:END -->`, '')
    .trim();

  // Wrap with sub-component markers and a divider heading
  return `<!-- AUTO:SUB:${subName}:${tabType}:START -->\n` +
    `<hr style="margin-block: var(--fnd-spacing-08); border-color: var(--fnd-color-border-secondary);">\n` +
    `<h2 class="docs__section-title">Sub-Komponente: ${title}</h2>\n` +
    content + '\n' +
    `<!-- AUTO:SUB:${subName}:${tabType}:END -->`;
}

// ---------------------------------------------------------------------------
// Marker Insertion / Replacement
// ---------------------------------------------------------------------------
function replaceOrAppendMarkerBlock(html, marker, content, isSub) {
  const startTag = `<!-- AUTO:${marker}:START -->`;
  const endTag = `<!-- AUTO:${marker}:END -->`;

  const startIdx = html.indexOf(startTag);
  const endIdx = html.indexOf(endTag);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    return html.substring(0, startIdx) + content + html.substring(endIdx + endTag.length);
  }

  if (isSub) {
    // For sub-components: append before the panel's closing </div>
    // Find the parent's main marker end to insert after it, or append before panel end
    const baseTab = marker.split(':').pop(); // STYLE, API, or A11Y
    const parentEndTag = `<!-- AUTO:${baseTab}:END -->`;
    const parentEndIdx = html.indexOf(parentEndTag);

    if (parentEndIdx !== -1) {
      // Insert after the parent's AUTO block
      const insertPos = parentEndIdx + parentEndTag.length;
      return html.substring(0, insertPos) + '\n\n' + content + html.substring(insertPos);
    }

    // Fallback: find panel and append
    return appendToPanel(html, baseTab, content);
  }

  // Standalone: replace entire panel content
  return replaceMarkerBlock(html, marker, content);
}

function appendToPanel(html, tabType, content) {
  const tabId = tabType === 'STYLE' ? 'tab-style'
    : tabType === 'API' ? 'tab-api'
    : tabType === 'A11Y' ? 'tab-a11y'
    : null;
  if (!tabId) return html;

  const panelRegex = new RegExp(`(<div[^>]*id="${tabId}"[^>]*>)`, 's');
  const panelMatch = html.match(panelRegex);
  if (!panelMatch) return html;

  const panelStart = html.indexOf(panelMatch[0]);
  const insertPos = panelStart + panelMatch[0].length;
  const panelEnd = findPanelEnd(html, insertPos);
  if (panelEnd === -1) return html;

  // Insert before closing </div>
  return html.substring(0, panelEnd) + '\n' + content + '\n' + html.substring(panelEnd);
}

function replaceMarkerBlock(html, marker, content) {
  const startTag = `<!-- AUTO:${marker}:START -->`;
  const endTag = `<!-- AUTO:${marker}:END -->`;

  const startIdx = html.indexOf(startTag);
  const endIdx = html.indexOf(endTag);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    return html.substring(0, startIdx) + content + html.substring(endIdx + endTag.length);
  }

  // Insert markers into existing tab panel
  const tabId = marker === 'STYLE' ? 'tab-style'
    : marker === 'API' ? 'tab-api'
    : marker === 'A11Y' ? 'tab-a11y'
    : null;

  if (!tabId) return html;

  // Find the panel opening tag
  const panelRegex = new RegExp(`(<div[^>]*id="${tabId}"[^>]*>)`, 's');
  const panelMatch = html.match(panelRegex);

  if (!panelMatch) return html; // Tab panel not found

  const panelStart = html.indexOf(panelMatch[0]);
  const insertPos = panelStart + panelMatch[0].length;

  // Find the closing </div> for this panel
  // We need to find the content area between panel open and close
  // Strategy: find all content between panel open and next panel or closing structure
  const nextPanelOrEnd = findPanelEnd(html, insertPos);

  if (nextPanelOrEnd === -1) return html;

  // Replace entire panel content
  const indent = '\n\n          ';
  return html.substring(0, insertPos) +
    indent + content + '\n\n        ' +
    html.substring(nextPanelOrEnd);
}

function findPanelEnd(html, startPos) {
  // Find the matching closing </div> for the panel
  // The panel is a single div, so we count nesting
  let depth = 1;
  let pos = startPos;

  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);

    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + 6;
    }
  }
  return -1;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const tokenMap = parseComponentTokens();
  console.log(`  Token-Map: ${tokenMap.size} Tokens geladen`);

  // Find all recipe files — process parents first, then sub-components
  const allRecipeFiles = fs.readdirSync(RECIPE_DIR)
    .filter(f => f.endsWith('-recipe.json'))
    .map(f => path.join(RECIPE_DIR, f));

  const parentFiles = allRecipeFiles.filter(f => !isSubComponent(path.basename(f, '-recipe.json')));
  const subFiles = allRecipeFiles.filter(f => isSubComponent(path.basename(f, '-recipe.json')));
  const recipeFiles = [...parentFiles, ...subFiles];

  console.log(`  Recipes: ${recipeFiles.length} gefunden (${parentFiles.length} Parent + ${subFiles.length} Sub)`);

  const stats = { updated: 0, skipped: 0, noDoc: 0, errors: [] };

  for (const recipeFile of recipeFiles) {
    const recipeName = path.basename(recipeFile, '-recipe.json');

    if (SINGLE_COMPONENT && recipeName !== SINGLE_COMPONENT) continue;

    let recipe;
    try {
      recipe = JSON.parse(fs.readFileSync(recipeFile, 'utf-8'));
    } catch (e) {
      stats.errors.push(`${recipeName}: JSON parse error — ${e.message}`);
      continue;
    }

    const docFile = findDocFile(recipe);
    if (!docFile) {
      stats.noDoc++;
      if (DRY_RUN) console.log(`  SKIP  ${recipeName} — keine Doc-Datei`);
      continue;
    }

    let html = fs.readFileSync(docFile, 'utf-8');

    // Check if this doc has tabs
    if (!html.includes('id="tab-style"') && !html.includes('id="tab-api"') && !html.includes('id="tab-a11y"')) {
      stats.skipped++;
      if (DRY_RUN) console.log(`  SKIP  ${recipeName} — keine Tab-Struktur`);
      continue;
    }

    let changed = false;
    const isSub = isSubComponent(recipeName);

    // Style Tab
    if (html.includes('id="tab-style"')) {
      let styleContent = generateStyleTab(recipe, tokenMap);
      if (styleContent) {
        if (isSub) styleContent = rewrapForSub(styleContent, recipeName, 'STYLE');
        const marker = isSub ? `SUB:${recipeName}:STYLE` : 'STYLE';
        html = replaceOrAppendMarkerBlock(html, marker, styleContent, isSub);
        changed = true;
      }
    }

    // API Tab
    if (html.includes('id="tab-api"')) {
      let apiContent = generateApiTab(recipe, tokenMap);
      if (apiContent) {
        if (isSub) apiContent = rewrapForSub(apiContent, recipeName, 'API');
        const marker = isSub ? `SUB:${recipeName}:API` : 'API';
        html = replaceOrAppendMarkerBlock(html, marker, apiContent, isSub);
        changed = true;
      }
    }

    // A11y Tab
    if (html.includes('id="tab-a11y"')) {
      let a11yContent = generateA11yTab(recipe);
      if (a11yContent) {
        if (isSub) a11yContent = rewrapForSub(a11yContent, recipeName, 'A11Y');
        const marker = isSub ? `SUB:${recipeName}:A11Y` : 'A11Y';
        html = replaceOrAppendMarkerBlock(html, marker, a11yContent, isSub);
        changed = true;
      }
    }

    if (changed) {
      if (DRY_RUN) {
        console.log(`  WOULD UPDATE  ${recipeName} → ${path.basename(docFile)}`);
      } else {
        fs.writeFileSync(docFile, html, 'utf-8');
        console.log(`  ✓ ${recipeName} → ${path.basename(docFile)}`);
      }
      stats.updated++;
    } else {
      stats.skipped++;
    }
  }

  console.log('\n--- Report ---');
  console.log(`  Updated:  ${stats.updated}`);
  console.log(`  Skipped:  ${stats.skipped}`);
  console.log(`  No Doc:   ${stats.noDoc}`);
  if (stats.errors.length > 0) {
    console.log(`  Errors:   ${stats.errors.length}`);
    for (const err of stats.errors) console.log(`    ⚠ ${err}`);
  }
  if (DRY_RUN) console.log('\n  (Dry run — keine Dateien geändert)');
}

main();
