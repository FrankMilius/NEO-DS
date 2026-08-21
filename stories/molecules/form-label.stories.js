// ============================================================
// FormLabel — Auto-generated from form-label-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormLabel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormLabel** v2.0.0 (stable)

Semantisch ein <label for='input-id'> Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /events/editionen-preise -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<label class="nc-form-label" for="nf-name">
<span class="nc-form-label__text">Name</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>`,
};
