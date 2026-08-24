// ============================================================
// FormHint — Auto-generated from form-hint-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormHint',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormHint** v2.0.0 (stable)

Flexbox-Layout: Icon + Text nebeneinander, align-items: flex-start.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/form-field-docs.html -->
<!-- @punkte: 0 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<p class="nc-form-hint" id="hint-textarea-type">Maximal 500 Zeichen.</p>`,
};
