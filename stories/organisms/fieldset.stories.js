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
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/form-layout-docs.html -->
<!-- @punkte: 12 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<fieldset class="nc-fieldset">
<legend class="nc-fieldset__legend">Persönliche Daten</legend>
<div class="nc-form-field">
<label class="nc-form-label">
<span class="nc-form-label__text">Vorname</span>
</label>
<input class="nc-input" type="text" placeholder="Max">
</div>
<div class="nc-form-field">
<label class="nc-form-label">
<span class="nc-form-label__text">Nachname</span>
</label>
<input class="nc-input" type="text" placeholder="Mustermann">
</div>
</fieldset>`,
};
