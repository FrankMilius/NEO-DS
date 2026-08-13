// ============================================================
// MobileDrawer — Auto-generated from mobile-drawer-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/MobileDrawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**MobileDrawer** v1.0.0 (draft)

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
  render: () => `<div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__backdrop--visible">backdrop--visible</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__link">link</span>
    <span class="nc-mobile-drawer__list">list</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__backdrop--visible">backdrop--visible</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__link">link</span>
    <span class="nc-mobile-drawer__list">list</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'mobile-drawer wie auf der Website' },
    },
  },
};
