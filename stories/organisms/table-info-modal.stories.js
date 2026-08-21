// ============================================================
// TableInfoModal — Auto-generated from table-info-modal-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TableInfoModal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TableInfoModal** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /events/editionen-preise -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-table-info-modal" data-table-modal="" aria-hidden="true" role="dialog">
<div class="nc-table-info-modal__backdrop" data-modal-close="">
</div>
<div class="nc-table-info-modal__content">
<button class="nc-table-info-modal__close" data-modal-close="" aria-label="Schliessen">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M18 6L6 18M6 6l12 12">
</path>
</svg>
</button>
<div class="nc-table-info-modal__body">
</div>
</div>
</div>`,
};
