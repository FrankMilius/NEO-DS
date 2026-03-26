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
  render: () => `<div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>`,
};

export const DefaultPlain = {
  name: 'Default (Plain)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plain vs Card vs Borderless — alle drei Section-Styles' },
    },
  },
};

export const DensityComparison = {
  name: 'Density Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fieldset">
    <span class="nc-fieldset__legend">legend</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Deaktiviertes Fieldset — alle enthaltenen Controls deaktiviert' },
    },
  },
};
