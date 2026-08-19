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
  render: () => `<div class="nc-compare-table">
    <span class="nc-compare-table__section-row">section-row</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-compare-table">
    <span class="nc-compare-table__section-row">section-row</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'compare-table wie auf der Website' },
    },
  },
};
