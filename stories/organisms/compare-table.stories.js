// ============================================================
// CompareTable — Auto-generated from compare-table-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CompareTable',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CompareTable** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {
    "unknown": {
      "control": {
        "type": "select"
      },
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "description": ""
    }
  },
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
