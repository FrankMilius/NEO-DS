// ============================================================
// Checkbox — Auto-generated from checkbox-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Checkbox** v2.0.0 (stable)

Wrapper ist ein <label class='nc-checkbox'> — Klick auf Label aktiviert Input.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" id="stage-cb">
<span class="nc-checkbox__control">
</span>
<span class="nc-checkbox__label">Checkbox Label</span>
</label>`,
};
