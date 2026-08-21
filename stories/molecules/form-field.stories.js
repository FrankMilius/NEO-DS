// ============================================================
// FormField — Auto-generated from form-field-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormField',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormField** v2.0.0 (stable)

Flex-Column-Container der Label, Input, Hint und Error zusammenfasst.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /unternehmen/kontakt -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-form-field">
<label class="nc-form-label" for="nf-topic">
<span class="nc-form-label__text">Bitte waehlen …</span>
<span class="nc-form-label__optional"> (optional)</span>
</label>
<input class="nc-input" type="checkbox-group" name="topic" id="nf-topic">
</div>`,
};
