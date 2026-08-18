// ============================================================
// Carousel — Auto-generated from carousel-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Carousel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Carousel** v1.0.0 (stable)

Die Spur ist ein Grid mit grid-auto-flow: column — die Elemente stehen nebeneinander, unabhaengig von ihrer Zahl.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-carousel">
    <span class="nc-carousel__track">track</span>
  </div>`,
};

export const Karussell = {
  name: 'Karussell',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard gegen Medien-Variante.' },
    },
  },
};
