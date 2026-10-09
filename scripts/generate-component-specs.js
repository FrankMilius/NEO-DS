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
 *   node scripts/generate-component-specs.js --pruefen          # Nur pruefen (CI):
 *       erzeugt alle Specs im Speicher und vergleicht mit specs/; Exit 1 mit
 *       Liste, wenn eine Datei abweicht, fehlt oder ohne Recipe uebrig ist.
 *       Das Datum `generated` in index.json zaehlt nicht als Abweichung.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';

const ROOT = resolve(import.meta.dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const SPECS_DIR = join(ROOT, 'specs');
const args = process.argv.slice(2);

const SINGLE = args.find(a => a.startsWith('--component='))?.split('=')[1];
const FORMAT = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'both';
const PRUEFEN = args.includes('--pruefen');

// ---------------------------------------------------------------------------
// Recipe → Spec Transformation
// ---------------------------------------------------------------------------

/**
 * Textliste aus dem Recipe ohne leere Eintraege. Ein leerer String in
 * domNotes (hero, bis 05.10.2026) ergab sonst eine leere Aufzaehlungszeile
 * `- ` im Markdown und einen leeren Eintrag im JSON.
 */
export function textListe(liste) {
  return (Array.isArray(liste) ? liste : []).filter((t) => typeof t === 'string' && t.trim() !== '');
}

export function recipeToSpec(recipe) {
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
      notes: textListe(recipe.anatomy?.domNotes),
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

/**
 * Alle --mod-*-Overrides, die das SCSS tatsaechlich liest (`var(--mod-…)`).
 *
 * Bis 09.10.2026 bekam jedes --nc-* einer Token-Gruppe ein --mod-* in die
 * Spec — auch wenn kein Selektor es auswertet (426 von 2511). Ein Verbraucher,
 * der so ein Override setzt, sah keine Wirkung. Quelle ist der SCSS-Quelltext
 * (deterministisch, ohne Build); das gebaute CSS liest dieselbe Menge
 * (tests/spec-generator.test.mjs prueft das, sobald styles.css vorliegt).
 * Interpolierte Namen (`--mod-#{…}`) gibt es nicht; kaemen sie dazu, fiele der
 * Test auf.
 * @returns {Set<string>}
 */
let _gelesen = null;
export function gelesenModOverrides() {
  if (_gelesen) return _gelesen;
  _gelesen = new Set();
  const lauf = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) lauf(p);
      else if (e.name.endsWith('.scss')) {
        for (const m of readFileSync(p, 'utf8').matchAll(/var\(\s*(--mod-[a-zA-Z0-9_-]+)/g)) _gelesen.add(m[1]);
      }
    }
  };
  lauf(join(ROOT, 'scss'));
  return _gelesen;
}

/** --mod-* zu einem --nc-*-Token, wenn das SCSS es liest — sonst null. */
function modOverride(token) {
  if (!token || !token.startsWith('--nc-')) return null;
  const mod = token.replace('--nc-', '--mod-');
  return gelesenModOverrides().has(mod) ? mod : null;
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
      const mod = modOverride(token);
      if (mod) modTokens.push(mod);
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
    assertions: textListe(recipe.a11y.base?.assertions),
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

export function specToMarkdown(spec) {
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
          modOverride(t.token) ? `\`${modOverride(t.token)}\`` : '—',
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

/**
 * Fuehrt neu erzeugte Index-Eintraege mit dem bestehenden specs/index.json
 * zusammen.
 *
 * Vollstaendiger Lauf: der Index entsteht neu (nur die erzeugten Eintraege,
 * Datum = heute).
 *
 * Einzellauf (--component): bis 05.10.2026 schrieb er den Index mit nur
 * EINEM Eintrag — alle anderen Specs verschwanden aus dem Verzeichnis. Jetzt
 * wird nur der Eintrag des Bauteils ersetzt (an seiner Stelle) oder, falls
 * neu, in Dateinamen-Reihenfolge eingefuegt (wie readdirSync die Recipes
 * liefert, z. B. alert-dialog vor alert). Uebrige Eintraege, ihre
 * Reihenfolge und das Datum `generated` bleiben unveraendert — das Datum
 * beschreibt den letzten vollstaendigen Lauf.
 *
 * @param {{ generated?: string, specs?: Record<string, object> } | null} bestehend
 * @param {Record<string, object>} eintraege  neu erzeugt, Name -> Eintrag
 * @param {{ einzeln: boolean, heute: string }} optionen
 */
export function indexZusammenfuehren(bestehend, eintraege, { einzeln, heute }) {
  if (!einzeln || !bestehend || typeof bestehend.specs !== 'object') {
    return { generated: heute, specs: { ...eintraege } };
  }
  const reihenfolge = Object.keys(bestehend.specs);
  const dateiname = (name) => `${name}-recipe.json`;
  for (const name of Object.keys(eintraege)) {
    if (reihenfolge.includes(name)) continue;
    const nach = reihenfolge.findIndex((k) => dateiname(k) > dateiname(name));
    reihenfolge.splice(nach === -1 ? reihenfolge.length : nach, 0, name);
  }
  const specs = {};
  for (const name of reihenfolge) specs[name] = eintraege[name] ?? bestehend.specs[name];
  return { ...bestehend, specs };
}

function bestehenderIndex() {
  const pfad = join(SPECS_DIR, 'index.json');
  if (!existsSync(pfad)) return null;
  try {
    return JSON.parse(readFileSync(pfad, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Erzeugt Spec-Dateien aus Recipes im Speicher (ohne zu schreiben).
 *
 * @param {Array<{ datei: string, recipe: object }>} recipes
 * @param {{ format?: 'both'|'json'|'md', warnen?: (text: string) => void }} [optionen]
 * @returns {{ dateien: Map<string, string>, eintraege: Record<string, object> }}
 *   dateien: Dateiname in specs/ -> Inhalt (ohne index.json)
 */
export function specsErzeugen(recipes, { format = 'both', warnen = () => {} } = {}) {
  const dateien = new Map();
  const eintraege = {};
  for (const { datei, recipe, fehler } of recipes) {
    try {
      if (fehler) throw fehler;
      const spec = recipeToSpec(recipe);
      const name = spec.component;
      if (format === 'both' || format === 'json') {
        dateien.set(`${name}.spec.json`, JSON.stringify(spec, null, 2) + '\n');
      }
      if (format === 'both' || format === 'md') {
        dateien.set(`${name}.spec.md`, specToMarkdown(spec) + '\n');
      }
      eintraege[name] = {
        version: spec.version,
        status: spec.status,
        layer: spec.layer,
        variants: Object.keys(spec.variants).length,
        tokens: Object.values(spec.cssApi.tokenGroups).reduce((sum, g) => sum + g.length, 0),
        hasKeyboard: !!spec.keyboard,
        hasTestSelectors: !!spec.testSelectors,
        hasEvents: !!spec.events,
      };
    } catch (e) {
      warnen(`${datei}: ${e.message}`);
    }
  }
  return { dateien, eintraege };
}

/**
 * Vergleicht erzeugte Specs mit dem Bestand in specs/.
 *
 * @param {Map<string, string>} soll  Dateiname -> erwarteter Inhalt (inkl. index.json)
 * @param {Map<string, string>} ist   Dateiname -> Inhalt im Ordner (*.spec.json|md, index.json)
 * @returns {Array<{ datei: string, grund: 'abweichend'|'fehlt'|'ohne Recipe' }>}
 */
export function specsVergleichen(soll, ist) {
  const ohneDatum = (text) => {
    try {
      const { generated, ...rest } = JSON.parse(text);
      return JSON.stringify(rest);
    } catch {
      return text;
    }
  };
  const abweichungen = [];
  for (const [datei, inhalt] of soll) {
    if (!ist.has(datei)) abweichungen.push({ datei, grund: 'fehlt' });
    else if (datei === 'index.json' ? ohneDatum(ist.get(datei)) !== ohneDatum(inhalt) : ist.get(datei) !== inhalt) {
      abweichungen.push({ datei, grund: 'abweichend' });
    }
  }
  for (const datei of ist.keys()) {
    if (!soll.has(datei)) abweichungen.push({ datei, grund: 'ohne Recipe' });
  }
  return abweichungen.sort((a, b) => a.datei.localeCompare(b.datei));
}

function recipesLesen(filter) {
  return readdirSync(DATA_DIR)
    .filter(f => f.endsWith('-recipe.json'))
    .filter(filter)
    .map(datei => {
      try {
        return { datei, recipe: JSON.parse(readFileSync(join(DATA_DIR, datei), 'utf-8')) };
      } catch (fehler) {
        return { datei, fehler };
      }
    });
}

function pruefen() {
  const heute = new Date().toISOString().split('T')[0];
  const warnungen = [];
  const { dateien, eintraege } = specsErzeugen(recipesLesen(() => true), { warnen: (t) => warnungen.push(t) });
  dateien.set('index.json', JSON.stringify({ generated: heute, specs: eintraege }, null, 2) + '\n');
  const ist = new Map();
  if (existsSync(SPECS_DIR)) {
    for (const datei of readdirSync(SPECS_DIR)) {
      if (datei === 'index.json' || /\.spec\.(json|md)$/.test(datei)) {
        ist.set(datei, readFileSync(join(SPECS_DIR, datei), 'utf-8'));
      }
    }
  }
  const abweichungen = specsVergleichen(dateien, ist);
  for (const w of warnungen) abweichungen.push({ datei: w, grund: 'Recipe nicht lesbar' });
  if (abweichungen.length) {
    console.error(`✗ ${abweichungen.length} Spec-Datei(en) passen nicht zu den Recipes:`);
    for (const { datei, grund } of abweichungen) console.error(`    ${datei} (${grund})`);
    console.error('  → `npm run specs` ausfuehren und specs/ mitcommitten.');
    process.exit(1);
  }
  console.log(`✓ specs/ passt zu den Recipes (${dateien.size - 1} Spec-Dateien + index.json).`);
}

function main() {
  if (PRUEFEN) return pruefen();
  if (!existsSync(SPECS_DIR)) mkdirSync(SPECS_DIR, { recursive: true });

  const recipes = recipesLesen(f => !SINGLE || f === `${SINGLE}-recipe.json`);

  if (recipes.length === 0) {
    console.error(SINGLE ? `✗ Recipe nicht gefunden: ${SINGLE}` : '✗ Keine Recipe-Dateien gefunden');
    process.exit(1);
  }

  const heute = new Date().toISOString().split('T')[0];
  const { dateien, eintraege } = specsErzeugen(recipes, { format: FORMAT, warnen: (t) => console.warn(`⚠ ${t}`) });
  for (const [datei, inhalt] of dateien) writeFileSync(join(SPECS_DIR, datei), inhalt);
  const count = Object.keys(eintraege).length;

  // Index schreiben — beim Einzellauf nur den einen Eintrag ersetzen
  const gesamt = indexZusammenfuehren(
    SINGLE ? bestehenderIndex() : null,
    eintraege,
    { einzeln: !!SINGLE, heute },
  );
  writeFileSync(join(SPECS_DIR, 'index.json'), JSON.stringify(gesamt, null, 2) + '\n');

  console.log(`✓ ${count} Component Specs generiert → specs/`);
  console.log(`  JSON: ${FORMAT !== 'md' ? count : 0} | Markdown: ${FORMAT !== 'json' ? count : 0}`);

  // Statistiken
  const specs = Object.values(eintraege);
  const withKeyboard = specs.filter(s => s.hasKeyboard).length;
  const withTestSelectors = specs.filter(s => s.hasTestSelectors).length;
  const withEvents = specs.filter(s => s.hasEvents).length;
  console.log(`  Keyboard: ${withKeyboard}/${count} | TestSelectors: ${withTestSelectors}/${count} | Events: ${withEvents}/${count}`);
}

// Nur als Skript ausfuehren, nicht beim Import (Tests)
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
