// ============================================================
// TableBlock — Auto-generated from table-block-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/TableBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TableBlock** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-table-block">
    table-block
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-table-block">
    table-block
  </div>`,
  parameters: {
    docs: {
      description: { story: 'table-block wie auf der Website' },
    },
  },
};
