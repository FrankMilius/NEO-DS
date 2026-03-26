// ============================================================
// Carousel — Auto-generated from carousel-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Carousel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Carousel** v1.0.0 (stable)

Slides: ul/li, flex nowrap, dynamische Breite via carousel-slide-width-{1-12}.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="carousel">
    <span class="carousel-slides-wrapper">slides-wrapper</span>
    <span class="carousel-bottom-nav-wrapper">bottom-nav</span>
  </div>`,
};

export const CarouselVariants = {
  name: 'Carousel Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Autoplay' },
    },
  },
};
