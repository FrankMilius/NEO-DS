// ============================================================
// Switch — Auto-generated from switch-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Switch',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Switch** v2.0.0 (stable)

Button-Pattern: <button role='switch' aria-checked='true/false'> als Track.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/switch-docs.html -->
<!-- @punkte: 24 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<label class="nc-switch">
<input type="checkbox" class="nc-switch__input" role="switch">
<span class="nc-switch__track">
<span class="nc-switch__thumb">
</span>
</span>
<span class="nc-switch__label">Aus</span>
</label>`,
};
