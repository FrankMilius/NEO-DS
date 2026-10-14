// ============================================================
// Popover — Auto-generated from popover-recipe.json
// Version: 2.1.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Popover',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Popover** v2.1.0 (stable)

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
  render: () => `<div class="nc-popover">
  <button type="button" class="nc-popover__trigger nc-button nc-button--sm" aria-haspopup="dialog" aria-expanded="true" aria-controls="popover-demo-1">Trigger</button>
  <div class="nc-popover__panel nc-popover__panel--bottom-start" id="popover-demo-1" role="dialog" aria-labelledby="popover-demo-1-titel">
      <div class="nc-popover__header">
        <span id="popover-demo-1-titel">Einstellungen</span>
        <button type="button" class="nc-popover__close" aria-label="Schlie&szlig;en">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>
        </button>
      </div>
      <div class="nc-popover__body">
        <p style="margin: 0; font-size: var(--fs-sm); color: var(--fnd-color-text-secondary);">Hier k&ouml;nnen Einstellungen vorgenommen werden. Der Body-Bereich kann beliebige Inhalte enthalten.</p>
      </div>
      <div class="nc-popover__footer">
        <button type="button" class="nc-button nc-button--sm">Speichern</button>
      </div>
  </div>
</div>`,
};
