// ============================================================
// Stepper — Auto-generated from stepper-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Stepper',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Stepper** v1.0.0 (stable)

Inline-Flex Container: Decrement-Button | Input | Increment-Button.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-stepper" role="group" aria-label="Menge MD">
<button class="nc-stepper__decrement" type="button" aria-label="Wert verringern">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
<line x1="5" y1="12" x2="19" y2="12">
</line>
</svg>
</button>
<input class="nc-stepper__input" type="number" value="5" min="0" max="99" aria-label="Menge" readonly="">
<button class="nc-stepper__increment" type="button" aria-label="Wert erhöhen">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
<line x1="12" y1="5" x2="12" y2="19">
</line>
<line x1="5" y1="12" x2="19" y2="12">
</line>
</svg>
</button>
</div>`,
};
