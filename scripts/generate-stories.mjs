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
const MARKUP_DIR = resolve(DATA_DIR, 'markup');

// ─── Echtes Bauteil-Markup ───────────────────────────────────────────
//
// Der Generator kannte bis zum 21.08.2026 nur `specimen.markup` im Recipe.
// Getragen hat das kein einziges der 131 Recipes — HTML in JSON heisst
// maskierte Anfuehrungszeichen und ein Diff, den niemand liest.
//
// Zusaetzlich wird deshalb data/markup/<komponente>.html gelesen. Mehrere
// Fassungen trennt ein Kommentar `<!-- @fassung: Name -->`; ohne Trenner gilt
// die ganze Datei als eine Fassung.
//
// Siehe data/markup/LIESMICH.md.
function markupDateiLesen(component) {
  const pfad = resolve(MARKUP_DIR, `${component}.html`);
  if (!existsSync(pfad)) return [];

  const roh = readFileSync(pfad, 'utf-8').trim();
  if (!roh) return [];

  const teile = roh.split(/<!--\s*@fassung:\s*(.+?)\s*-->/);

  // Traegt der Text ueberhaupt ein Element, oder nur Kommentare?
  //
  // Vor dem ersten @fassung-Trenner stehen die Herkunftsmarken (@quelle,
  // @punkte). Bis zum 24.08.2026 wurden sie als eigene Fassung gezaehlt: jedes
  // geerntete Bauteil bekam eine Story `Default`, die nichts als zwei
  // Kommentare rendert — 102 leere Bilder neben den richtigen. Aufgefallen ist
  // es erst beim Nachsehen im erzeugten Code, weil alle Sichtpruefungen auf
  // `--standard` liefen.
  const traegtMarkup = (text) => /<[a-zA-Z]/.test(text.replace(/<!--[\s\S]*?-->/g, ''));

  // Ohne Trenner steht alles in teile[0] und die Liste hat genau ein Element.
  if (teile.length === 1) {
    return traegtMarkup(teile[0]) ? [{ name: 'Standard', markup: teile[0].trim() }] : [];
  }

  const fassungen = [];
  // teile[0] ist der Text VOR dem ersten Trenner — meist nur Herkunftsmarken.
  if (traegtMarkup(teile[0])) fassungen.push({ name: 'Standard', markup: teile[0].trim() });
  for (let i = 1; i < teile.length; i += 2) {
    const name = teile[i];
    const markup = (teile[i + 1] || '').trim();
    if (markup) fassungen.push({ name, markup });
  }
  return fassungen;
}

// ─── Layer Mapping ───────────────────────────────────────────────────
const LAYER_MAP = {
  // Atoms
  button: 'atoms', badge: 'atoms', chip: 'atoms', icon: 'atoms', input: 'atoms',
  checkbox: 'atoms', radio: 'atoms', select: 'atoms', switch: 'atoms',
  textarea: 'atoms', tag: 'atoms', avatar: 'atoms', spinner: 'atoms',
  range: 'atoms', label: 'atoms', tooltip: 'atoms', device: 'atoms',
  // Molecules
  card: 'molecules', accordion: 'molecules', breadcrumb: 'molecules',
  'form-field': 'molecules', 'form-label': 'molecules', 'form-error': 'molecules',
  'form-hint': 'molecules', 'input-group': 'molecules', 'dropdown-menu': 'molecules',
  'logo-wall': 'molecules', 'link-with-arrow': 'molecules', 'otp-input': 'molecules',
  popover: 'molecules', stepper: 'molecules', tabs: 'molecules', toast: 'molecules',
  carousel: 'molecules', 'app-store': 'molecules',
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

// ─── Der Platzhalter sagt, dass er einer ist ─────────────────────────
//
// generateHTML() reiht die Slots der Anatomie als Geschwister-<span> auf. Das
// ist kein Bauteil, sondern eine Liste von Klassennamen: keine Schachtelung,
// keine Zustaende, bei <details> nicht einmal das Element selbst.
//
// Solange es unbeschriftet im Canvas stand, sah jede Luecke aus wie eine
// fertige Komponente — 131 von 131, und niemandem ist es aufgefallen.
//
// Der Hinweis steht IM Canvas und nicht nur in der Beschreibung: Wer eine
// Story oeffnet, sieht zuerst das Bild.
function mitHinweis(html, component) {
  return `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/${component}.html</code>.
  </p>
  ${html}
</div>`;
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

  // Echtes Markup hat Vorrang vor allem anderen.
  const fassungen = markupDateiLesen(component);
  const hatEchtes = fassungen.length > 0
    || specimens.some((s) => s && s.markup);

  // Stories generieren
  let stories = '';

  if (fassungen.length) {
    // Aus data/markup/<komponente>.html — je Fassung eine Story.
    // Kein frueher Ausstieg: Der gemeinsame Schluss weiter unten baut Titel,
    // argTypes und die Doku-Beschreibung fuer BEIDE Wege.
    for (const [i, f] of fassungen.entries()) {
      const name = i === 0
        ? 'Default'
        : f.name.replace(/[^a-zA-Z0-9]/g, '') || `Fassung${i + 1}`;
      stories += `
export const ${name} = {
  name: '${f.name.replace(/'/g, "\\'")}',
  render: () => \`${f.markup.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`,
};
`;
    }
  }
  else {
  // Default Story
  stories += `
export const Default = {
  render: () => \`${mitHinweis(generateHTML(component, anatomy, []), component).replace(/`/g, '\\`')}\`,
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
  render: () => \`${mitHinweis(html, component).replace(/`/g, '\\`')}\`,
  parameters: {
    docs: {
      description: { story: '${(specimen.description || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}' },
    },
  },
};
`;
  }
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

  return { file, layer, component, hatEchtes };
}

// ─── Main ────────────────────────────────────────────────────────────

const targetComponent = process.argv.find(a => a.startsWith('--component='))?.split('=')[1];

const files = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
let generated = 0;
let skipped = 0;
const mitMarkup = [];
const ohneMarkup = [];
const geruest = [];

// Bauteile, die kein eigenes Story-Markup bekommen — nicht weil es fehlt,
// sondern weil es keines gibt. Sie als Luecke zu zaehlen macht die Quote
// unehrlich: "101 von 131" liest sich wie 30 offene Aufgaben, dabei sind
// zehn davon Seitengeruest, das als eigenstaendiges Beispiel nichts zeigt.
// Die Liste steht in data/geruest-bauteile.json, weil die Markup-Ernte sie
// ebenfalls braucht.
const GERUEST = new Set(
  Object.keys(JSON.parse(readFileSync(resolve(DATA_DIR, 'geruest-bauteile.json'), 'utf-8')).bauteile),
);

for (const filename of files) {
  const component = filename.replace('-recipe.json', '');
  if (targetComponent && component !== targetComponent) continue;

  const raw = readFileSync(resolve(DATA_DIR, filename), 'utf-8');
  let recipe;
  try { recipe = JSON.parse(raw); } catch { skipped++; continue; }

  const { file, layer, hatEchtes } = generateStory(recipe);
  const outDir = resolve(STORIES_DIR, layer);
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${component}.stories.js`);
  writeFileSync(outPath, file);
  generated++;
  if (GERUEST.has(component)) geruest.push(component);
  else (hatEchtes ? mitMarkup : ohneMarkup).push(component);
}

// ─── Abdeckung ───────────────────────────────────────────────────────
//
// Die Zahl am Ende ist der Zweck dieser Aenderung. Ohne sie sah jede Luecke
// aus wie eine fertige Komponente: 131 Stories, alle Platzhalter, ueber Monate
// unbemerkt. Ab jetzt steht der Stand nach jedem Lauf da.
const gesamt = mitMarkup.length + ohneMarkup.length;
const anteil = gesamt ? Math.round((mitMarkup.length / gesamt) * 100) : 0;

console.log(`\n📖 Story Generator: ${generated} Stories erzeugt, ${skipped} uebersprungen`);
console.log(`   Ausgabe: stories/{atoms,molecules,organisms}/*.stories.js`);
console.log(`\n   Echtes Bauteil-Markup: ${mitMarkup.length} von ${gesamt} (${anteil} %)`);
if (geruest.length) {
  console.log(`   Nicht mitgezaehlt — Seitengeruest ohne eigenes Beispiel (${geruest.length}): ${geruest.sort().join(', ')}`);
}

if (ohneMarkup.length && !targetComponent) {
  const zeigen = ohneMarkup.slice(0, 12);
  console.log(`   Ohne Markup (Platzhalter): ${zeigen.join(', ')}${ohneMarkup.length > zeigen.length ? `, … +${ohneMarkup.length - zeigen.length}` : ''}`);
  console.log(`   -> data/markup/<komponente>.html anlegen, siehe data/markup/LIESMICH.md`);
}
console.log('');

// Fuer den Waechter in npm test — damit die Zahl nicht wieder sinkt.
if (!targetComponent) {
  writeFileSync(
    resolve(DATA_DIR, 'markup-abdeckung.json'),
    JSON.stringify({
      hinweis: 'Erzeugt von scripts/generate-stories.mjs. `mindestens` haendisch anheben, wenn Markup dazugekommen ist — scripts/pruefe-markup.mjs faellt darunter aus.',
      stand: { mit: mitMarkup.length, gesamt, anteil },
      mit: mitMarkup.sort(),
      ohne: ohneMarkup.sort(),
      geruest: geruest.sort(),
    }, null, 2) + '\n',
  );
}
