// ============================================================
// Select — Auto-generated from select-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Select** v2.0.0 (stable)

Select ist ein natives <select class='nc-select'>. Kein JS fuer Basis-Funktion noetig.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<select class="nc-select nc-select--sm nc-data-table__page-select-input" data-dt-page-select="" aria-label="Seite auswaehlen">
<option value="1">1</option>
<option value="2">2</option>
</select>`,
};
