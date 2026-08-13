// ============================================================
// Multiselect — Auto-generated from multiselect-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Multiselect',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Multiselect** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'multiselect wie auf der Website' },
    },
  },
};
