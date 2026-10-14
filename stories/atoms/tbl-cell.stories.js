// ============================================================
// TblCell — Auto-generated from tbl-cell-recipe.json
// Version: 1.5.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/TblCell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TblCell** v1.5.0 (stable)

Zelle der Vergleichstabelle (Tabellen-Block, Recipe table-block): div.nc-tbl-cell (flex, gap spacing-02) in th oder td — der Ort gestaltet sie: th[scope=row] (erste Spalte) links, umbrechend, Text semibold; td mittig. Ohne Tabelle hat die Zelle keine Ausrichtung (die Arena stellt jede Zelle in eine Tabelle, Rahmen ra-tabelle).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>`,
};
