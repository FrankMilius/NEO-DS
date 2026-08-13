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
  render: () => `<div class="nc-table-info-modal">
    <span class="nc-table-info-modal__backdrop">backdrop</span>
    <span class="nc-table-info-modal__body">body</span>
    <span class="nc-table-info-modal__close">close</span>
    <span class="nc-table-info-modal__content">content</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-table-info-modal">
    <span class="nc-table-info-modal__backdrop">backdrop</span>
    <span class="nc-table-info-modal__body">body</span>
    <span class="nc-table-info-modal__close">close</span>
    <span class="nc-table-info-modal__content">content</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'table-info-modal wie auf der Website' },
    },
  },
};
