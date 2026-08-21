// ============================================================
// ValidationSummary — Auto-generated from validation-summary-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ValidationSummary',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ValidationSummary** v1.0.0 (stable)

Error-Summary-Box am Anfang eines Formulars — zeigt alle Fehler gesammelt.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
};

export const DefaultValidationSummary = {
  name: 'Default Validation Summary',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Error-Summary mit Titel und Fehlerliste als Links' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'With Links, Text-Only, With Icon im Vergleich' },
    },
  },
};

export const SingleError = {
  name: 'Single Error',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary mit nur einem Fehler' },
    },
  },
};

export const MultipleErrors = {
  name: 'Multiple Errors',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary mit mehreren Fehlern — typischer Formular-Submit' },
    },
  },
};

export const InFormContext = {
  name: 'In Form Context',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary am Anfang eines Formulars mit markierten Feldern' },
    },
  },
};

export const HighContrastMode = {
  name: 'High Contrast Mode',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/validation-summary.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Darstellung in Windows High Contrast Mode (forced-colors)' },
    },
  },
};
