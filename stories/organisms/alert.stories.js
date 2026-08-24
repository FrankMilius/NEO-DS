// ============================================================
// Alert — Auto-generated from alert-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Alert** v2.0.0 (stable)

Alert ist ein <div class='nc-alert' role='alert|status'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-alert nc-alert--warning" role="alert">
<span class="nc-alert__icon" aria-hidden="true">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
</path>
<line x1="12" y1="9" x2="12" y2="13">
</line>
<line x1="12" y1="17" x2="12.01" y2="17">
</line>
</svg>
</span>
<div class="nc-alert__content">
<p class="nc-alert__title">Sitzung läuft ab</p>
<p class="nc-alert__description">Ihre Sitzung läuft in 5 Minuten ab.</p>
<div class="nc-alert__action">
<button class="nc-button nc-button--sm nc-button--outline">Sitzung verlängern</button>
</div>
</div>
</div>`,
};
