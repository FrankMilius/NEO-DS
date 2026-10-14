// ============================================================
// TableInfoModal — Auto-generated from table-info-modal-recipe.json
// Version: 1.4.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TableInfoModal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TableInfoModal** v1.4.0 (stable)

Website (block--block-content--neo-table.html.twig, einer je Tabelle, nach der Tabelle in der Section): div.nc-table-info-modal#nc-table-info-<Block-ID>[role=dialog][aria-hidden=true] > __backdrop[data-modal-close] + __content > button.__close[data-modal-close][aria-label] + __body (leer). Ohne aria-modal und ohne Namen — aria-modal setzt das Behavior, den Namen bei jedem Oeffnen aus data-info-label des Ausloesers.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
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
