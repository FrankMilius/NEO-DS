// ============================================================
// FormError — Auto-generated from form-error-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormError',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormError** v1.0.0 (stable)

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
  render: () => `<p class="nc-form-error" role="alert" id="error-email">
<span class="nc-form-error__icon">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="12" y1="8" x2="12" y2="12">
</line>
<line x1="12" y1="16" x2="12.01" y2="16">
</line>
</svg>
</span>
<span class="nc-form-error__text">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
</p>`,
};
