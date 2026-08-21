// ============================================================
// TblCell — Auto-generated from tbl-cell-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/TblCell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TblCell** v1.0.0 (draft)

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
        "1"
      ],
      "description": ""
    }
  },
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /events/editionen-preise -->`,
};

export const Standard = {
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
