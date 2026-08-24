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
  render: () => `<button class="nc-button nc-button--info nc-button--micro-c" data-demo="c-target" type="button">
<span class="nc-button__label">Absenden</span>
<span class="nc-button__spinner">
</span>
</button>`,
};
