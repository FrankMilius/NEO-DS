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
        "0"
      ],
      "description": ""
    }
  },
};

export const Default = {
  render: () => `<div class="nc-tbl-cell">
    <span class="nc-tbl-cell__icon-block">icon-block</span>
    <span class="nc-tbl-cell__info-btn">info-btn</span>
    <span class="nc-tbl-cell__sub">sub</span>
    <span class="nc-tbl-cell__text">tbl-cell</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-tbl-cell">
    <span class="nc-tbl-cell__icon-block">icon-block</span>
    <span class="nc-tbl-cell__info-btn">info-btn</span>
    <span class="nc-tbl-cell__sub">sub</span>
    <span class="nc-tbl-cell__text">tbl-cell</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'tbl-cell wie auf der Website' },
    },
  },
};
