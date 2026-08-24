// ============================================================
// FormSection — Auto-generated from form-section-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormSection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormSection** v1.0.0 (stable)

Logische Gruppierung innerhalb eines Formulars mit optionalem Titel + Beschreibung.


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
<!-- @punkte: 15 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-form-section">
<div class="nc-form-section__header">
<h3 class="nc-form-section__title">Adresse</h3>
<p class="nc-form-section__description">Ihre aktuelle Lieferadresse.</p>
</div>
<div class="nc-form-section__content">
<div class="nc-form-field">
<label class="nc-form-label">
<span class="nc-form-label__text">Straße</span>
</label>
<input class="nc-input" type="text" placeholder="Musterstraße 1">
</div>
<div class="nc-form-field">
<label class="nc-form-label">
<span class="nc-form-label__text">Stadt</span>
</label>
<input class="nc-input" type="text" placeholder="Berlin">
</div>
</div>
</div>`,
};
