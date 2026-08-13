// ============================================================
// TabNav — Auto-generated from tab-nav-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/TabNav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TabNav** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-tab-nav">
    <span class="nc-tab-nav__badges">badges</span>
    <span class="nc-tab-nav__bento">bento</span>
    <span class="nc-tab-nav__module">module</span>
    <span class="nc-tab-nav__panel-body">panel-body</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-tab-nav">
    <span class="nc-tab-nav__badges">badges</span>
    <span class="nc-tab-nav__bento">bento</span>
    <span class="nc-tab-nav__module">module</span>
    <span class="nc-tab-nav__panel-body">panel-body</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'tab-nav wie auf der Website' },
    },
  },
};
