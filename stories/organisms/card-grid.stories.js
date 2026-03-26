// ============================================================
// CardGrid — Auto-generated from card-grid-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CardGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardGrid** v1.0.0 (stable)

CSS Grid mit auto-fit oder fester Spaltenanzahl. Cards per JSON gerendert.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-card-grid">
    <span class="nc-card">card</span>
  </div>`,
};

export const StandardGrid = {
  name: 'Standard Grid',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card-grid">
    <span class="nc-card">card</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Cards mit Bild, Titel, Beschreibung.' },
    },
  },
};

export const ReverseDomino = {
  name: 'Reverse Domino',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card-grid">
    <span class="nc-card">card</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Cards werden nacheinander von unten eingeblendet (staggered slide-up) beim Scrollen in den Viewport.' },
    },
  },
};
