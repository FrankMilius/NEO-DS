#!/usr/bin/env node
// ==========================================================================
// scaffold-docs.js
// ==========================================================================
// Erstellt Doc-Pages fuer Recipes die noch keine haben.
// Generiert Standard-Tab-Struktur (Benutzung + Style + API + A11y).
// Die Tabs werden dann via update-docs-from-recipes.js befuellt.
//
// Usage:
//   node scripts/scaffold-docs.cjs              # Alle fehlenden
//   node scripts/scaffold-docs.cjs --dry-run    # Nur Report
// ==========================================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RECIPE_DIR = path.join(ROOT, 'data');
const DOCS_DIR = path.join(ROOT, 'docs', 'content');

const DRY_RUN = process.argv.includes('--dry-run');

// Sub-components that are documented in their parent's page
const SUB_COMPONENTS = new Set([
  'checkbox-group', 'radio-group',
  'form-label', 'form-hint', 'form-error',
  'form', 'form-actions', 'form-section', 'fieldset', 'validation-summary',
  'navigation-orchestration'
]);

// Title overrides for display
const TITLE_MAP = {
  'dropdown-menu': 'Dropdown Menu',
  'empty-state': 'Empty State',
  'kbd': 'Keyboard (Kbd)',
  'nav-molecules': 'Nav Molecules',
  'toggle-group': 'Toggle Group',
  'code-snippet': 'Code Snippet',
  'input-group': 'Input Group',
  'segmented-control': 'Segmented Control',
  'data-table': 'Data Table',
  'alert-dialog': 'Alert Dialog',
  'form-field': 'Form Field',
  'square-value': 'Square Value',
  'link-with-arrow': 'Link with Arrow',
  'security-list': 'Security List',
  'text-blocks': 'Text Blocks',
  'text-only': 'Text Only',
  'video-section': 'Video Section',
  'otp-input': 'OTP Input',
  'feature-accordion': 'Feature Accordion',
  'logo-wall': 'Logo Wall',
  'navigation-menu': 'Navigation Menu',
  'nav-atoms': 'Nav Atoms',
};

function titleCase(name) {
  if (TITLE_MAP[name]) return TITLE_MAP[name];
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function generateDocPage(recipe) {
  const name = recipe.meta.component;
  const title = titleCase(name);
  const rootClass = recipe.anatomy?.root?.element || `.nc-${name}`;
  const blockName = rootClass.replace(/^\./, '');
  const tags = recipe.meta.tags || [];
  const isInteractive = recipe.states?.interactive !== false;

  // Build subtitle from recipe data
  const tagStr = tags.length > 0 ? tags.join(', ') : name;
  const interactiveHint = isInteractive ? 'Interaktive' : 'Nicht-interaktive';

  return `<!-- BODY -->
    <main class="docs">


      <!-- Page Header -->
            <div class="docs__hero">
        <h1 class="docs__title">${title}</h1>
        <p class="docs__subtitle">
        ${interactiveHint} Komponente (${tagStr}).
        Kanonische Klasse: <code class="docs__token">${rootClass}</code> (BEM).
        Alle Werte kommen aus <code class="docs__token">--${blockName}-*</code> Component-Tokens.
      </p>
      </div>

      <div class="docs__tab-nav">
        <div class="docs-tabs__list" role="tablist" aria-label="${title}-Dokumentation">
          <button class="docs-tabs__trigger" role="tab" aria-selected="true" aria-controls="tab-usage" id="trigger-usage">Benutzung</button>
          <button class="docs-tabs__trigger" role="tab" aria-selected="false" aria-controls="tab-style" id="trigger-style">Style</button>
          <button class="docs-tabs__trigger" role="tab" aria-selected="false" aria-controls="tab-api" id="trigger-api">API</button>
          <button class="docs-tabs__trigger" role="tab" aria-selected="false" aria-controls="tab-a11y" id="trigger-a11y">Accessibility</button>
        </div>
      </div>

      <div class="docs__body">
        <div class="docs-tabs" id="${name}-tabs">
<!-- ============================================================ -->
        <!-- TAB 1: Benutzung (Live Demo / Showcase)                     -->
        <!-- ============================================================ -->
        <div class="docs-tabs__panel is-active" role="tabpanel" id="tab-usage" aria-labelledby="trigger-usage">

          <h2 class="docs__section-title">Live Demo</h2>
          <p class="docs__section-desc">
            Beispiele und Konfigurationsm&ouml;glichkeiten f&uuml;r ${title}.
          </p>

          <p class="docs__section-desc" style="color: var(--fnd-color-text-tertiary); font-style: italic;">
            Live-Demos werden manuell gepflegt. Siehe Recipe <code>${name}-recipe.json</code> f&uuml;r Specimens.
          </p>

        </div>

        <!-- ============================================================ -->
        <!-- TAB 2: Style (Token-Referenz)                               -->
        <!-- ============================================================ -->
        <div class="docs-tabs__panel" role="tabpanel" id="tab-style" aria-labelledby="trigger-style">
        </div>

        <!-- ============================================================ -->
        <!-- TAB 3: API Reference                                        -->
        <!-- ============================================================ -->
        <div class="docs-tabs__panel" role="tabpanel" id="tab-api" aria-labelledby="trigger-api">
        </div>

        <!-- ============================================================ -->
        <!-- TAB 4: Accessibility                                         -->
        <!-- ============================================================ -->
        <div class="docs-tabs__panel" role="tabpanel" id="tab-a11y" aria-labelledby="trigger-a11y">
        </div>

      </div>
        </div><!-- /.docs-tabs -->
      </div>



    </main>
<!-- /BODY -->

<!-- SCRIPTS -->
  <script src="${name}-docs.js"></script>
<!-- /SCRIPTS -->`;
}

function main() {
  const recipeFiles = fs.readdirSync(RECIPE_DIR)
    .filter(f => f.endsWith('-recipe.json'));

  let created = 0;
  let skipped = 0;

  for (const file of recipeFiles) {
    const name = file.replace(/-recipe\.json$/, '');

    // Skip sub-components
    if (SUB_COMPONENTS.has(name)) {
      console.log(`  SKIP  ${name} (Sub-Komponente)`);
      skipped++;
      continue;
    }

    const docFile = path.join(DOCS_DIR, `${name}.html`);
    if (fs.existsSync(docFile)) {
      continue; // Already has a doc page
    }

    const recipe = JSON.parse(fs.readFileSync(path.join(RECIPE_DIR, file), 'utf-8'));
    const html = generateDocPage(recipe);

    if (DRY_RUN) {
      console.log(`  WOULD CREATE  ${name}.html`);
    } else {
      fs.writeFileSync(docFile, html, 'utf-8');
      console.log(`  ✓ ${name}.html`);
    }
    created++;
  }

  console.log(`\n--- Report ---`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped} (Sub-Komponenten)`);
  if (DRY_RUN) console.log('\n  (Dry run — keine Dateien erstellt)');
}

main();
