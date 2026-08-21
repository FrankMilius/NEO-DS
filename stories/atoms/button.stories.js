// ============================================================
// Button — Auto-generated from button-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Button** v2.0.0 (stable)

Buttons muessen immer ein zugaengliches Label haben — entweder sichtbarer Text oder aria-label fuer Icon-Only.


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
  render: () => `<button type="submit" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit">Nachricht senden</button>`,
};
