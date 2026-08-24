// ============================================================
// Radio — Auto-generated from radio-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Radio** v2.0.0 (stable)

Wrapper ist ein <label class='nc-radio'> — Klick auf Label aktiviert Input.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/radio-docs.html -->
<!-- @punkte: 23 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="stage-radio">
<span class="nc-radio__control">
</span>
<span class="nc-radio__label">Option</span>
</label>`,
};
