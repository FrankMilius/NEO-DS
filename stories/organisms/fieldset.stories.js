// ============================================================
// Fieldset — Auto-generated from fieldset-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Fieldset',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Fieldset** v2.0.0 (stable)

Root: gestyltes <fieldset> — Browser-Defaults zurueckgesetzt (margin:0, min-width:0).


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>`,
};

export const DefaultPlain = {
  name: 'Default (Plain)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fieldset mit Border, Legend und Form-Fields' },
    },
  },
};

export const CardVariant = {
  name: 'Card Variant',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fieldset mit Hintergrund-Fuellung und Schatten statt Border' },
    },
  },
};

export const AppearanceComparison = {
  name: 'Appearance Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plain vs Card vs Borderless — alle drei Section-Styles' },
    },
  },
};

export const DensityComparison = {
  name: 'Density Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Compact vs Loose — Abstände im Vergleich' },
    },
  },
};

export const CenteredLegend = {
  name: 'Centered Legend',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zentrierte Legend fuer symmetrische Formulare (Login, Registrierung)' },
    },
  },
};

export const WithHelperText = {
  name: 'With Helper Text',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fieldset mit Gruppen-Beschreibung unter der Legend' },
    },
  },
};

export const RequiredGroup = {
  name: 'Required Group',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fieldset mit Pflicht-Indikator in der Legend' },
    },
  },
};

export const DisabledFieldset = {
  name: 'Disabled Fieldset',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/fieldset.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Deaktiviertes Fieldset — alle enthaltenen Controls deaktiviert' },
    },
  },
};
