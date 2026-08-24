// ============================================================
// FormActions — Auto-generated from form-actions-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormActions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormActions** v1.0.0 (stable)

Flex-Container fuer Formular-Buttons (Submit, Cancel, Reset).


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
<!-- @punkte: 0 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-form-actions nc-form-actions--end" style="margin-block-end: var(--fnd-spacing-06);">
<button type="button" class="nc-button nc-button--primary">Speichern</button>
<button type="button" class="nc-button nc-button--secondary">Abbrechen</button>
</div>`,
};
