#!/usr/bin/env node

/**
 * generate-component-index.js
 *
 * Phase 8: Co-Location — Generiert pro Komponente einen README.md
 * im Verzeichnis components/{name}/ als zentralen Einstiegspunkt.
 *
 * Die SCSS-Dateien bleiben in ihren ITCSS-Layern.
 * Die READMEs sind reine Referenz-Dateien die alle Artefakte verlinken.
 *
 * Verwendung:
 *   node scripts/generate-component-index.js           # Alle Komponenten
 *   node scripts/generate-component-index.js --clean    # Verzeichnis vorher leeren
 *
 * Ausgabe: components/{name}/README.md
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const REGISTRY_PATH = join(ROOT, 'data/component-registry.json');
const COMPONENTS_DIR = join(ROOT, 'components');
const args = process.argv.slice(2);
const CLEAN = args.includes('--clean');

if (!existsSync(REGISTRY_PATH)) {
  console.error('✗ component-registry.json nicht gefunden. Zuerst: npm run registry');
  process.exit(1);
}

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));

// Optional: Altes Verzeichnis leeren
if (CLEAN && existsSync(COMPONENTS_DIR)) {
  rmSync(COMPONENTS_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// README Generator
// ---------------------------------------------------------------------------

function toPascal(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function statusBadge(score, max) {
  if (score >= max) return 'complete';
  if (score >= max * 0.7) return 'good';
  if (score >= max * 0.4) return 'partial';
  return 'minimal';
}

function generateComponentReadme(entry) {
  const { name, layer, paths, coverage, coverageScore, dependencies } = entry;
  const pascal = toPascal(name);
  const score = coverageScore || Object.values(coverage).filter(Boolean).length;
  const maxScore = Object.keys(coverage).length;
  const badge = statusBadge(score, maxScore);

  const lines = [];
  lines.push(`# ${pascal}`);
  lines.push('');
  lines.push(`> **Layer:** ${layer} | **Coverage:** ${score}/${maxScore} (${badge}) | **Status:** ${entry.status || 'stable'}`);
  lines.push('');
  lines.push('*AUTO-GENERIERT — nicht manuell bearbeiten. Neu generieren: `npm run components`*');
  lines.push('');

  // Pipeline-Artefakte
  lines.push('## Pipeline-Artefakte');
  lines.push('');
  lines.push('| Artefakt | Pfad | Status |');
  lines.push('|----------|------|--------|');

  const artifacts = [
    { label: 'Recipe', path: paths.recipe, key: 'recipe' },
    { label: 'SCSS', path: paths.scss?.length > 0 ? paths.scss.join(', ') : null, key: 'scss' },
    { label: 'Storybook', path: paths.story, key: 'story' },
    { label: 'Arena', path: paths.arena, key: 'arena' },
    { label: 'Docs', path: paths.docs, key: 'docs' },
  ];

  // Drupal separat (kann Array sein)
  if (paths.drupal?.length > 0) {
    artifacts.push({ label: 'Drupal', path: paths.drupal.join(', '), key: 'drupal' });
  } else {
    artifacts.push({ label: 'Drupal', path: null, key: 'drupal' });
  }

  for (const a of artifacts) {
    const status = coverage[a.key] ? 'present' : 'missing';
    const pathStr = a.path ? `\`${a.path}\`` : '—';
    lines.push(`| ${a.label} | ${pathStr} | ${status} |`);
  }

  lines.push('');

  // Spec
  const specPath = `specs/${name}.spec.md`;
  if (existsSync(join(ROOT, specPath))) {
    lines.push(`## Spec`);
    lines.push('');
    lines.push(`- [Component Spec (Markdown)](../${specPath})`);
    lines.push(`- [Component Spec (JSON)](../specs/${name}.spec.json)`);
    lines.push('');
  }

  // Dependencies
  if (dependencies && dependencies.length > 0) {
    lines.push('## Dependencies');
    lines.push('');
    lines.push(dependencies.map(d => `- [\`${d}\`](../${d}/)`).join('\n'));
    lines.push('');
  }

  // Quick Links
  lines.push('## Quick Links');
  lines.push('');
  if (paths.recipe) lines.push(`- [Recipe JSON](../${paths.recipe})`);
  if (paths.scss?.length > 0) {
    for (const scss of paths.scss) {
      lines.push(`- [SCSS](../${scss})`);
    }
  }
  if (paths.story) lines.push(`- [Storybook Story](../${paths.story})`);
  if (paths.arena) lines.push(`- [Theme Configurator Arena](../${paths.arena})`);
  if (paths.docs) lines.push(`- [Documentation](../${paths.docs})`);
  lines.push('');

  return lines.join('\n');
}

function generateFoundationReadme(entry) {
  const { name, tokenSource, tokenCount, paths, coverage } = entry;
  const pascal = toPascal(name);

  const lines = [];
  lines.push(`# ${pascal} (Foundation)`);
  lines.push('');
  lines.push(`> **Category:** foundation | **Tokens:** ${tokenCount} | **Source:** \`${tokenSource}\``);
  lines.push('');
  lines.push('*AUTO-GENERIERT — nicht manuell bearbeiten.*');
  lines.push('');

  lines.push('## Artefakte');
  lines.push('');
  lines.push('| Artefakt | Pfad | Status |');
  lines.push('|----------|------|--------|');

  if (paths.scss?.length > 0) lines.push(`| SCSS | ${paths.scss.map(s => `\`${s}\``).join(', ')} | present |`);
  if (paths.generatedScss?.length > 0) lines.push(`| Generated SCSS | ${paths.generatedScss.map(s => `\`${s}\``).join(', ')} | present |`);
  lines.push(`| Docs | ${paths.docs ? `\`${paths.docs}\`` : '—'} | ${coverage.docs ? 'present' : 'missing'} |`);
  lines.push(`| Editor | ${paths.editor ? `\`${paths.editor}\`` : '—'} | ${coverage.editor ? 'present' : 'missing'} |`);
  lines.push(`| Story | ${paths.story ? `\`${paths.story}\`` : '—'} | ${coverage.story ? 'present' : 'missing'} |`);
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Hauptlogik
// ---------------------------------------------------------------------------

let componentCount = 0;
let foundationCount = 0;

// Components (Layer 05-07)
for (const [name, entry] of Object.entries(registry.components)) {
  const dir = join(COMPONENTS_DIR, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'README.md'), generateComponentReadme(entry));
  componentCount++;
}

// Foundations (Layer 00)
for (const [name, entry] of Object.entries(registry.foundations)) {
  const dir = join(COMPONENTS_DIR, `_foundations/${name}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'README.md'), generateFoundationReadme(entry));
  foundationCount++;
}

// Objects (Layer 04)
for (const [name, entry] of Object.entries(registry.objects)) {
  const dir = join(COMPONENTS_DIR, `_objects/${name}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'README.md'), generateComponentReadme(entry));
  componentCount++;
}

// Templates (Layer 08)
for (const [name, entry] of Object.entries(registry.templates)) {
  const dir = join(COMPONENTS_DIR, `_templates/${name}`);
  mkdirSync(dir, { recursive: true });

  const lines = [];
  lines.push(`# ${toPascal(name)} (Template)`);
  lines.push('');
  lines.push(`> **Layer:** template`);
  lines.push('');
  lines.push('*AUTO-GENERIERT*');
  lines.push('');
  lines.push('## Artefakte');
  lines.push('');
  if (entry.paths.scss) lines.push(`- SCSS: \`${entry.paths.scss}\``);
  if (entry.paths.docs) lines.push(`- Docs: \`${entry.paths.docs}\``);
  if (entry.paths.layoutPreset) lines.push(`- Layout Preset: \`${entry.paths.layoutPreset}\``);
  lines.push('');

  writeFileSync(join(dir, 'README.md'), lines.join('\n'));
  componentCount++;
}

// Root README
const rootReadme = `# NEO Design System — Component Index

> AUTO-GENERIERT — \`npm run components\`

## Verzeichnisstruktur

\`\`\`
components/
  _foundations/          # Foundation Token-Kategorien (Layer 00)
  _objects/              # Layout-Primitiven (Layer 04)
  _templates/            # Seiten-Layouts (Layer 08)
  accordion/             # Komponente: README.md mit allen Pipeline-Links
  alert/
  button/
  card/
  ...
\`\`\`

Jeder Ordner enthält ein \`README.md\` das alle Pipeline-Artefakte verlinkt:
- Recipe JSON (Single Source of Truth)
- SCSS (bleibt in ITCSS-Layern)
- Storybook Story
- Theme Configurator Arena
- Drupal Template
- Documentation
- Component Spec

## Statistik

- **${componentCount}** Komponenten/Objects/Templates
- **${foundationCount}** Foundations
- **${componentCount + foundationCount}** READMEs generiert
`;

writeFileSync(join(COMPONENTS_DIR, 'README.md'), rootReadme);

console.log(`✓ Component Index generiert: components/`);
console.log(`  ${componentCount} Komponenten + ${foundationCount} Foundations = ${componentCount + foundationCount} READMEs`);
