#!/usr/bin/env node

/**
 * generate-component-specs.js
 *
 * Phase 7: Cross-Framework Spec Repo
 * Extrahiert framework-agnostische Komponentenspezifikationen aus Recipe-JSONs.
 *
 * Ausgabe:
 *   specs/{component}.spec.json  — Maschinenlesbare Spec
 *   specs/{component}.spec.md   — Menschenlesbare Dokumentation
 *   specs/index.json             — Verzeichnis aller Specs
 *
 * Verwendung:
 *   node scripts/generate-component-specs.js                    # Alle Recipes
 *   node scripts/generate-component-specs.js --component=button # Einzeln
 *   node scripts/generate-component-specs.js --format=json      # Nur JSON
 *   node scripts/generate-component-specs.js --format=md        # Nur Markdown
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const SPECS_DIR = join(ROOT, 'specs');
const args = process.argv.slice(2);

const SINGLE = args.find(a => a.startsWith('--component='))?.split('=')[1];
const FORMAT = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'both';

if (!existsSync(SPECS_DIR)) mkdirSync(SPECS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Recipe → Spec Transformation
// ---------------------------------------------------------------------------

function recipeToSpec(recipe) {
  const meta = recipe.meta;
  const spec = {
    $schema: '../data/component-spec-schema.json',
    component: meta.component,
    version: meta.version,
    status: meta.status,
    layer: meta.layer || 'unknown',
    tags: meta.tags || [],

    // --- Anatomie ---
    anatomy: {
      rootElement: recipe.anatomy?.root?.element || null,
      slots: (recipe.anatomy?.slots || []).map(s => ({
        name: s.name,
        selector: s.element,
        required: !s.optional,
        description: s.description || null,
      })),
      notes: recipe.anatomy?.domNotes || [],
    },

    // --- HTML API ---
    api: extractApi(recipe),

    // --- Varianten (Axes) ---
    variants: extractVariants(recipe),

    // --- States ---
    states: extractStates(recipe),

    // --- CSS API (Token Contract) ---
    cssApi: extractCssApi(recipe),

    // --- Keyboard Interactions ---
    keyboard: recipe.keyboard || null,

    // --- Test Selectors ---
    testSelectors: recipe.testSelectors || null,

    // --- Events ---
    events: recipe.events || null,

    // --- Accessibility ---
    a11y: extractA11y(recipe),

    // --- Dependencies ---
    dependencies: meta.dependencies || [],

    // --- Pipeline Paths ---
    pipeline: meta.pipeline || null,
  };

  return spec;
}

function extractApi(recipe) {
  if (!recipe.api) return null;
  return {
    elements: recipe.api.elements || {},
    attributes: (recipe.api.attributes || []).map(a => ({
      name: a.name,
      type: a.type || 'string',
      appliesTo: a.appliesTo || [],
    })),
  };
}

function extractVariants(recipe) {
  if (!recipe.axes) return {};
  const variants = {};
  for (const [axisId, axis] of Object.entries(recipe.axes)) {
    // Handle both object and array formats for values
    const values = Array.isArray(axis.values)
      ? axis.values
      : Object.entries(axis.values || {}).map(([key, val]) => ({ value: key, ...val }));

    variants[axisId] = {
      label: axis.label,
      description: axis.description || null,
      values: values.map(v => ({
        value: v.value,
        cssModifier: v.modifier || null,
        default: v.default || false,
        label: v.label || v.value,
      })),
    };
  }
  return variants;
}

function extractStates(recipe) {
  if (!recipe.states) return { supported: [], rules: [] };
  return {
    supported: recipe.states.supported || [],
    interactive: recipe.states.interactive ?? null,
    rules: (recipe.states.rules || []).map(r => {
      if (typeof r === 'string') return { description: r };
      return {
        state: r.state,
        effects: r.effects || [],
        attributes: r.attributes || {},
        description: typeof r === 'string' ? r : null,
      };
    }),
  };
}

function extractCssApi(recipe) {
  if (!recipe.styling) return { baseClasses: [], tokenGroups: {} };

  const tokenGroups = {};
  const groups = recipe.styling.tokenGroups;

  if (Array.isArray(groups)) {
    // Array-Format: [{ name, tokens: [...] }]
    for (const g of groups) {
      tokenGroups[g.name] = (g.tokens || []).map(t => {
        if (typeof t === 'string') return { token: tokenNormal(t) };
        return { token: tokenNormal(t.token), property: t.property || null, description: t.description || null };
      });
    }
  } else if (groups && typeof groups === 'object') {
    // Object-Format: { groupId: { label, tokens: [...] } }
    for (const [key, val] of Object.entries(groups)) {
      tokenGroups[val.label || key] = (val.tokens || []).map(t => {
        if (typeof t === 'string') return { token: tokenNormal(t) };
        // Bis zum 24.08.2026 stand hier `{ token: t, … }` — bei einem
        // Objekt-Token landete damit das ganze Objekt im Feld `token`.
        // Aufgefallen, als die vier Recipes mit Listenform umgestellt wurden:
        // ihre `property`-Angaben haetten sich in der Objektform sonst nicht
        // abbilden lassen, und die Umstellung haette 14 Angaben verloren.
        return { token: tokenNormal(t.token), property: t.property || null, description: t.description || null };
      });
    }
  }

  return {
    baseClasses: recipe.styling.baseClasses || [],
    tokenGroups,
    modTokens: generateModTokens(tokenGroups),
  };
}

/**
 * Schreibt einen Tokennamen in die Form, die ein CSS-Verbraucher braucht.
 *
 * Die Recipes speichern uneinheitlich: 127 fuehren `nc-accordion-border`, vier
 * fuehrten `--nc-tabs-trigger-color`. Beide meinen dasselbe. Statt die eine
 * Seite umzuschreiben, wird hier an der Grenze normalisiert — dann ist es
 * gleichgueltig, wie ein Recipe es haelt.
 */
function tokenNormal(name) {
  if (typeof name !== 'string') return null;
  return name.startsWith('--') ? name : `--${name}`;
}

function generateModTokens(tokenGroups) {
  // Leite --mod-* Override-API aus --nc-* Token-Gruppen ab.
  //
  // Bis zum 24.08.2026 stand hier `token.startsWith('--nc-')` gegen Namen, die
  // in 127 von 131 Recipes ohne Striche stehen. Ergebnis: die --mod-*-API war
  // in fast jeder Spec leer, obwohl es sie im Stylesheet laengst gibt. Es fiel
  // nicht auf, weil die vier Recipes mit Listenform Werte lieferten und der
  // Rest schlicht nie nachgesehen wurde.
  const modTokens = [];
  for (const tokens of Object.values(tokenGroups)) {
    for (const t of tokens) {
      const token = tokenNormal(t.token || t);
      if (token && token.startsWith('--nc-')) modTokens.push(token.replace('--nc-', '--mod-'));
    }
  }
  return modTokens;
}

function extractA11y(recipe) {
  if (!recipe.a11y) return null;
  return {
    role: recipe.a11y.base?.role || null,
    interactive: recipe.a11y.base?.interactive ?? null,
    contrastTarget: recipe.a11y.base?.contrastTarget || null,
    focusIndicator: recipe.a11y.base?.focusIndicator || null,
    assertions: recipe.a11y.base?.assertions || [],
    overrides: (recipe.a11y.overrides || []).map(o => ({
      when: o.when,
      require: o.require || [],
      suggest: o.suggest || [],
      note: o.note || null,
    })),
  };
}

// ---------------------------------------------------------------------------
// Spec → Markdown
// ---------------------------------------------------------------------------

function specToMarkdown(spec) {
  const lines = [];
  const h = (level, text) => lines.push(`${'#'.repeat(level)} ${text}`);
  const p = (text) => lines.push(`${text}\n`);
  const code = (lang, text) => lines.push(`\`\`\`${lang}\n${text}\n\`\`\``);
  const table = (headers, rows) => {
    lines.push(`| ${headers.join(' | ')} |`);
    lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
    for (const row of rows) {
      lines.push(`| ${row.join(' | ')} |`);
    }
    lines.push('');
  };

  // Title
  h(1, `${spec.component} Component Spec`);
  p(`> Version ${spec.version} | Status: ${spec.status} | Layer: ${spec.layer}`);
  if (spec.tags.length > 0) p(`Tags: ${spec.tags.map(t => `\`${t}\``).join(', ')}`);

  // Anatomy
  h(2, 'Anatomy');
  p(`Root element: \`${spec.anatomy.rootElement}\``);
  if (spec.anatomy.slots.length > 0) {
    table(
      ['Slot', 'Selector', 'Required', 'Description'],
      spec.anatomy.slots.map(s => [
        s.name,
        `\`${s.selector}\``,
        s.required ? 'Yes' : 'No',
        s.description || '—',
      ])
    );
  }
  if (spec.anatomy.notes.length > 0) {
    h(3, 'DOM Notes');
    for (const note of spec.anatomy.notes) {
      lines.push(`- ${note}`);
    }
    lines.push('');
  }

  // API
  if (spec.api) {
    h(2, 'HTML API');
    if (spec.api.elements && Object.keys(spec.api.elements).length > 0) {
      h(3, 'Elements');
      table(
        ['Variant', 'Element', 'Attributes'],
        Object.entries(spec.api.elements).map(([key, val]) => [
          key,
          `\`<${val.element}>\``,
          (val.attributes || []).join(', '),
        ])
      );
    }
    if (spec.api.attributes?.length > 0) {
      h(3, 'Attributes');
      table(
        ['Name', 'Type', 'Applies To'],
        spec.api.attributes.map(a => [
          `\`${a.name}\``,
          a.type,
          a.appliesTo.join(', '),
        ])
      );
    }
  }

  // Variants
  if (Object.keys(spec.variants).length > 0) {
    h(2, 'Variants');
    for (const [axisId, axis] of Object.entries(spec.variants)) {
      h(3, `${axis.label} (\`${axisId}\`)`);
      if (axis.description) p(axis.description);
      table(
        ['Value', 'CSS Modifier', 'Default'],
        axis.values.map(v => [
          v.label || v.value,
          v.cssModifier ? `\`.${v.cssModifier}\`` : '—',
          v.default ? 'Yes' : '',
        ])
      );
    }
  }

  // States
  if (spec.states.supported.length > 0) {
    h(2, 'States');
    p(`Supported: ${spec.states.supported.map(s => `\`${s}\``).join(', ')}`);
    if (spec.states.rules.length > 0) {
      for (const rule of spec.states.rules) {
        if (rule.description) lines.push(`- ${rule.description}`);
        else if (rule.state) lines.push(`- **${rule.state}**: ${(rule.effects || []).join(', ')}`);
      }
      lines.push('');
    }
  }

  // CSS API
  h(2, 'CSS Token API');
  p(`Base classes: ${spec.cssApi.baseClasses.map(c => `\`${c}\``).join(', ')}`);
  for (const [groupName, tokens] of Object.entries(spec.cssApi.tokenGroups)) {
    h(3, groupName);
    if (tokens.length > 0) {
      table(
        ['Token', 'CSS Property', 'Override'],
        tokens.map(t => [
          `\`${t.token}\``,
          t.property || '—',
          t.token.startsWith('--nc-') ? `\`${t.token.replace('--nc-', '--mod-')}\`` : '—',
        ])
      );
    }
  }

  // Keyboard
  if (spec.keyboard) {
    h(2, 'Keyboard Interactions');
    table(
      ['Key', 'Action', 'Notes'],
      Object.entries(spec.keyboard).map(([key, val]) => [
        `\`${key}\``,
        val.action,
        val.note || '—',
      ])
    );
  }

  // Test Selectors
  if (spec.testSelectors) {
    h(2, 'Test Selectors');
    table(
      ['Slot', 'Selector'],
      Object.entries(spec.testSelectors).map(([slot, sel]) => [
        slot,
        `\`${sel}\``,
      ])
    );
  }

  // Events
  if (spec.events) {
    h(2, 'Events');
    table(
      ['Event', 'Bubbles', 'Detail'],
      Object.entries(spec.events).map(([name, val]) => [
        `\`${name}\``,
        val.bubbles ? 'Yes' : 'No',
        val.detail ? `\`${JSON.stringify(val.detail)}\`` : '—',
      ])
    );
  }

  // Accessibility
  if (spec.a11y) {
    h(2, 'Accessibility');
    if (spec.a11y.role) p(`ARIA Role: \`${spec.a11y.role}\``);
    if (spec.a11y.contrastTarget) p(`Contrast Target: ${spec.a11y.contrastTarget}`);
    if (spec.a11y.assertions.length > 0) {
      for (const a of spec.a11y.assertions) {
        lines.push(`- ${a}`);
      }
      lines.push('');
    }
  }

  // Dependencies
  if (spec.dependencies.length > 0) {
    h(2, 'Dependencies');
    p(spec.dependencies.map(d => `\`${d}\``).join(', '));
  }

  // Web Components Mapping
  h(2, 'Web Components Mapping');
  p('Derived from anatomy for potential `<nc-' + spec.component + '>` custom element:');
  code('js', `class Nc${toPascal(spec.component)} extends HTMLElement {
  static observedAttributes = [${Object.keys(spec.variants).map(v => `'${v}'`).join(', ')}];
  // Slots: ${spec.anatomy.slots.filter(s => s.required).map(s => `<slot name="${s.name}">`).join(', ') || 'default'}
}`);

  lines.push('\n---\n');
  lines.push(`*Generated from \`data/${spec.component}-recipe.json\` by \`scripts/generate-component-specs.js\`*`);

  return lines.join('\n');
}

function toPascal(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// ---------------------------------------------------------------------------
// Hauptlogik
// ---------------------------------------------------------------------------

function main() {
  const recipeFiles = readdirSync(DATA_DIR)
    .filter(f => f.endsWith('-recipe.json'))
    .filter(f => !SINGLE || f === `${SINGLE}-recipe.json`);

  if (recipeFiles.length === 0) {
    console.error(SINGLE ? `✗ Recipe nicht gefunden: ${SINGLE}` : '✗ Keine Recipe-Dateien gefunden');
    process.exit(1);
  }

  const index = { generated: new Date().toISOString().split('T')[0], specs: {} };
  let count = 0;

  for (const file of recipeFiles) {
    try {
      const recipe = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'));
      const spec = recipeToSpec(recipe);
      const name = spec.component;

      // JSON Spec
      if (FORMAT === 'both' || FORMAT === 'json') {
        writeFileSync(join(SPECS_DIR, `${name}.spec.json`), JSON.stringify(spec, null, 2) + '\n');
      }

      // Markdown Spec
      if (FORMAT === 'both' || FORMAT === 'md') {
        writeFileSync(join(SPECS_DIR, `${name}.spec.md`), specToMarkdown(spec) + '\n');
      }

      index.specs[name] = {
        version: spec.version,
        status: spec.status,
        layer: spec.layer,
        variants: Object.keys(spec.variants).length,
        tokens: Object.values(spec.cssApi.tokenGroups).reduce((sum, g) => sum + g.length, 0),
        hasKeyboard: !!spec.keyboard,
        hasTestSelectors: !!spec.testSelectors,
        hasEvents: !!spec.events,
      };

      count++;
    } catch (e) {
      console.warn(`⚠ ${file}: ${e.message}`);
    }
  }

  // Index schreiben
  writeFileSync(join(SPECS_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n');

  console.log(`✓ ${count} Component Specs generiert → specs/`);
  console.log(`  JSON: ${FORMAT !== 'md' ? count : 0} | Markdown: ${FORMAT !== 'json' ? count : 0}`);

  // Statistiken
  const specs = Object.values(index.specs);
  const withKeyboard = specs.filter(s => s.hasKeyboard).length;
  const withTestSelectors = specs.filter(s => s.hasTestSelectors).length;
  const withEvents = specs.filter(s => s.hasEvents).length;
  console.log(`  Keyboard: ${withKeyboard}/${count} | TestSelectors: ${withTestSelectors}/${count} | Events: ${withEvents}/${count}`);
}

main();
