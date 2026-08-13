/**
 * Recipe → Storybook Story Generator
 *
 * Liest alle data/*-recipe.json Dateien und generiert
 * Storybook Stories unter stories/{layer}/{component}.stories.js
 *
 * Usage: node scripts/generate-stories.mjs [--component=button]
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'data');
const STORIES_DIR = resolve(ROOT, 'stories');

// ─── Layer Mapping ───────────────────────────────────────────────────
const LAYER_MAP = {
  // Atoms
  button: 'atoms', badge: 'atoms', chip: 'atoms', icon: 'atoms', input: 'atoms',
  checkbox: 'atoms', radio: 'atoms', select: 'atoms', switch: 'atoms',
  textarea: 'atoms', tag: 'atoms', avatar: 'atoms', spinner: 'atoms',
  slider: 'atoms', label: 'atoms', tooltip: 'atoms',
  // Molecules
  card: 'molecules', accordion: 'molecules', breadcrumb: 'molecules',
  'form-field': 'molecules', 'form-label': 'molecules', 'form-error': 'molecules',
  'form-hint': 'molecules', 'input-group': 'molecules', 'dropdown-menu': 'molecules',
  'logo-wall': 'molecules', 'link-with-arrow': 'molecules', 'otp-input': 'molecules',
  popover: 'molecules', stepper: 'molecules', tabs: 'molecules', toast: 'molecules',
  // Organisms
  hero: 'organisms', navigation: 'organisms', 'navigation-menu': 'organisms',
  footer: 'organisms', header: 'organisms', modal: 'organisms',
  'data-table': 'organisms', gallery: 'organisms', search: 'organisms',
  form: 'organisms', 'form-section': 'organisms', 'form-actions': 'organisms',
  shell: 'organisms', sidebar: 'organisms', banner: 'organisms',
  'product-showcase': 'organisms', 'text-media': 'organisms', 'hero-tom': 'organisms',
  'hero-tmob': 'organisms', 'story-gallery': 'organisms', 'fade-gallery': 'organisms',
  container: 'organisms', grid: 'organisms', section: 'organisms',
};

// ─── HTML Generators ─────────────────────────────────────────────────

function generateHTML(component, anatomy, axisValues) {
  const root = anatomy?.root?.element || `.nc-${component}`;
  const rootClass = root.replace('.', '');
  const modifiers = axisValues
    .filter(v => v.modifier)
    .map(v => v.modifier)
    .join(' ');

  const slots = (anatomy?.slots || [])
    .filter(s => !s.optional)
    .map(s => {
      const cls = (s.element || '').replace('.', '');
      if (s.name === 'label' || s.name === 'text') return `<span class="${cls}">${component}</span>`;
      if (s.name === 'icon') return `<span class="${cls}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>`;
      return `<span class="${cls}">${s.name}</span>`;
    })
    .join('\n    ');

  const tag = component === 'button' ? 'button' : 'div';

  return `<${tag} class="${rootClass}${modifiers ? ' ' + modifiers : ''}">
    ${slots || component}
  </${tag}>`;
}

function generateSpecimenHTML(component, anatomy, specimen, axes) {
  // Echtes Markup hat Vorrang. Aus der Anatomie abgeleitetes HTML zeigt bei
  // aufgenommenen Komponenten nur die Wurzel — fuer Prototyping wertlos.
  // specimen.markup traegt den tatsaechlichen Aufbau von der Website.
  if (specimen.markup) return specimen.markup;

  if (!specimen.matrix?.axes) {
    return generateHTML(component, anatomy, []);
  }

  const items = [];
  const firstAxis = Object.entries(specimen.matrix.axes)[0];
  if (!firstAxis) return generateHTML(component, anatomy, []);

  const [axisName, axisFilter] = firstAxis;
  const axisObj = Array.isArray(axes)
    ? axes.find(a => a.label?.toLowerCase().replace(/\s+/g, '') === axisName || a === axisName)
    : null;

  // Finde die Axis-Definition
  let axisValues = {};
  if (Array.isArray(axes)) {
    const ax = axes.find(a => {
      const normalizedLabel = (a.label || '').toLowerCase().replace(/\s+/g, '');
      return normalizedLabel === axisName.toLowerCase() || a === axisName;
    });
    axisValues = ax?.values || {};
  }

  // Welche Werte anzeigen?
  const valuesToShow = axisFilter === '*'
    ? Object.keys(axisValues)
    : Array.isArray(axisFilter) ? axisFilter : [axisFilter];

  for (const val of valuesToShow) {
    const valObj = axisValues[val] || {};
    items.push(generateHTML(component, anatomy, [{ modifier: valObj.modifier || '' }]));
  }

  const layout = specimen.layout === 'column' ? 'flex-direction: column;' : '';

  return `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ${layout}">
  ${items.join('\n  ')}
</div>`;
}

// ─── Story Generator ─────────────────────────────────────────────────

function generateStory(recipe) {
  const component = recipe.meta?.component || recipe.name || 'unknown';
  const version = recipe.meta?.version || recipe.version || '0.0.0';
  const status = recipe.meta?.status || 'unknown';
  // Ebene: erst die gepflegte Tabelle, dann das Recipe selbst. Aufgenommene
  // Komponenten tragen ihre ITCSS-Ebene in meta.tags — ohne diesen Rueckgriff
  // landeten sie alle unter 'organisms', auch Atome wie tbl-cell.
  const ausTags = (recipe.meta?.tags || []).find((t) => ['atoms', 'molecules', 'organisms', 'objects', 'utilities'].includes(t));
  const layer = LAYER_MAP[component] || ausTags || 'organisms';
  const titleComponent = component
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const specimens = recipe.specimens || [];
  const axes = recipe.axes || [];
  const anatomy = recipe.anatomy || {};
  const a11y = recipe.a11y || {};

  // Stories generieren
  let stories = '';

  // Default Story
  stories += `
export const Default = {
  render: () => \`${generateHTML(component, anatomy, [])}\`,
};
`;

  // Specimen Stories
  for (const specimen of specimens.slice(0, 8)) {
    const storyName = (specimen.label || specimen.id || 'Unnamed')
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/^(\d)/, '_$1');

    if (!storyName || storyName === 'Default') continue;

    const html = generateSpecimenHTML(component, anatomy, specimen, axes);

    stories += `
export const ${storyName} = {
  name: '${(specimen.label || specimen.id || '').replace(/'/g, "\\'")}',
  render: () => \`${html.replace(/`/g, '\\`')}\`,
  parameters: {
    docs: {
      description: { story: '${(specimen.description || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}' },
    },
  },
};
`;
  }

  // ArgTypes aus Axes
  const argTypes = {};
  if (Array.isArray(axes)) {
    for (const axis of axes) {
      const name = axis.label || 'unknown';
      const values = axis.values ? Object.keys(axis.values) : [];
      if (values.length > 0) {
        argTypes[name.toLowerCase()] = {
          control: { type: 'select' },
          options: values,
          description: axis.description || '',
        };
      }
    }
  }

  // A11y Info
  const a11yNotes = [];
  if (a11y.role) a11yNotes.push(`Role: ${a11y.role}`);
  if (a11y.aria) {
    for (const [attr, desc] of Object.entries(a11y.aria)) {
      a11yNotes.push(`${attr}: ${typeof desc === 'string' ? desc : JSON.stringify(desc)}`);
    }
  }
  if (a11y.keyboardInteractions) {
    for (const ki of a11y.keyboardInteractions) {
      a11yNotes.push(`${ki.key || ki.keys}: ${ki.action}`);
    }
  }

  // Token-Liste für Docs
  const tokenGroups = recipe.tokenGroups || recipe.recipes || [];
  const tokenList = [];
  for (const group of (Array.isArray(tokenGroups) ? tokenGroups : [])) {
    if (group.tokens) {
      tokenList.push(`### ${group.label || group.name || 'Tokens'}\n${group.tokens.map(t => `- \`${t}\``).join('\n')}`);
    }
  }

  const file = `// ============================================================
// ${titleComponent} — Auto-generated from ${component}-recipe.json
// Version: ${version} | Status: ${status}
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: '${layer.charAt(0).toUpperCase() + layer.slice(1)}/${titleComponent}',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: \`**${titleComponent}** v${version} (${status})

${(recipe.meta?.description || anatomy.domNotes?.[0] || '').replace(/`/g, '\\`')}

${a11yNotes.length > 0 ? `#### Accessibility\\n${a11yNotes.map(n => `- ${n}`).join('\\n')}` : ''}
\`,
      },
    },
    status: { type: '${status}' },
  },
  argTypes: ${JSON.stringify(argTypes, null, 2).replace(/\n/g, '\n  ')},
};
${stories}`;

  return { file, layer, component };
}

// ─── Main ────────────────────────────────────────────────────────────

const targetComponent = process.argv.find(a => a.startsWith('--component='))?.split('=')[1];

const files = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
let generated = 0;
let skipped = 0;

for (const filename of files) {
  const component = filename.replace('-recipe.json', '');
  if (targetComponent && component !== targetComponent) continue;

  const raw = readFileSync(resolve(DATA_DIR, filename), 'utf-8');
  let recipe;
  try { recipe = JSON.parse(raw); } catch { skipped++; continue; }

  const { file, layer } = generateStory(recipe);
  const outDir = resolve(STORIES_DIR, layer);
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${component}.stories.js`);
  writeFileSync(outPath, file);
  generated++;
}

console.log(`\n📖 Story Generator: ${generated} stories generated, ${skipped} skipped`);
console.log(`   Output: stories/{atoms,molecules,organisms}/*.stories.js\n`);
