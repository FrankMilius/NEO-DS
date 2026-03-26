// ============================================================
// Facts — Auto-generated from facts-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Facts',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Facts** v1.0.0 (stable)

Block: background-base, radius-xl, elevation-raised.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-facts-block">
    <span class="nc-facts-list">list</span>
    <span class="nc-facts-term">term</span>
    <span class="nc-facts-desc">desc</span>
  </div>`,
};

export const FactsBlock = {
  name: 'Facts Block',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fakten-Block mit Titel und Term/Desc Paaren' },
    },
  },
};
