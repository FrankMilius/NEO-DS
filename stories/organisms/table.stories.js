// ============================================================
// Table — Auto-generated from table-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Table',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Table** v2.0.0 (stable)

Einfache Vergleichstabelle mit inverser Header-Zeile.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<table class="nc-compare-table">
<thead>
<tr>
<th>Funktion</th>
<th>Starter</th>
<th>Enterprise</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nutzer</td>
<td>5</td>
<td>Unbegrenzt</td>
</tr>
<tr>
<td>Speicher</td>
<td>10 GB</td>
<td>1 TB</td>
</tr>
<tr>
<td>Support</td>
<td>E-Mail</td>
<td>Dediziert</td>
</tr>
</tbody>
</table>`,
};
