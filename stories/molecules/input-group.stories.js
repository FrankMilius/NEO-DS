// ============================================================
// InputGroup — Auto-generated from input-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/InputGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**InputGroup** v2.0.0 (stable)

Flex-Row Container: display:flex, align-items:center. Prepend | Input | Append.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/input-group-docs.html -->
<!-- @punkte: 12 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-input-group">
<span class="nc-input-group__prepend">€</span>
<input class="nc-input" type="text" placeholder="0.00">
<span class="nc-input-group__append">EUR</span>
</div>`,
};
