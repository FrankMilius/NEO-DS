// ============================================================
// Searchbar — Auto-generated from searchbar-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Searchbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Searchbar** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-searchbar">
    <span class="nc-searchbar__close">close</span>
    <span class="nc-searchbar__field">field</span>
    <span class="nc-searchbar__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-searchbar__inner">inner</span>
    <span class="nc-searchbar__input">input</span>
    <span class="nc-searchbar__shortcut">shortcut</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-searchbar">
    <span class="nc-searchbar__close">close</span>
    <span class="nc-searchbar__field">field</span>
    <span class="nc-searchbar__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-searchbar__inner">inner</span>
    <span class="nc-searchbar__input">input</span>
    <span class="nc-searchbar__shortcut">shortcut</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'searchbar wie auf der Website' },
    },
  },
};
