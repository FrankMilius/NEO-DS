// ============================================================
// Popover — Auto-generated from popover-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Popover',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Popover** v2.0.0 (stable)

Root: inline-flex Wrapper mit Trigger und Panel.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/popover-docs.html -->
<!-- @punkte: 14 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-popover" style="position: absolute; top: 100%; left: 0; margin-top: 8px; z-index: 10;">
<div class="nc-popover__header">
<span>Einstellungen</span>
<button class="nc-popover__close" aria-label="Schließen">
<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
<line x1="4" y1="4" x2="16" y2="16">
</line>
<line x1="16" y1="4" x2="4" y2="16">
</line>
</svg>
</button>
</div>
<div class="nc-popover__body">
<p style="margin: 0; font-size: var(--fs-sm); color: var(--fnd-color-text-secondary);">Hier können Einstellungen vorgenommen werden. Der Body-Bereich kann beliebige Inhalte enthalten.</p>
</div>
<div class="nc-popover__footer">
<button class="nc-button nc-button--sm">Speichern</button>
</div>
</div>`,
};
