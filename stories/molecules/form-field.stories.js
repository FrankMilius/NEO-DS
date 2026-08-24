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
  render: () => `<div class="nc-form-field nc-form-field--error">
<label class="nc-form-label" for="demo-error">
<span class="nc-form-label__text">E-Mail</span>
<span class="nc-form-label__required" aria-hidden="true">*</span>
</label>
<input class="nc-input" type="email" id="demo-error" value="ungueltig" aria-invalid="true" aria-describedby="error-email" aria-required="true">
<p class="nc-form-error" role="alert" id="error-email">
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
</p>
</div>`,
};
