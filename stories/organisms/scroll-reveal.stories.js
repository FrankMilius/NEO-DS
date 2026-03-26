// ============================================================
// ScrollReveal — Auto-generated from scroll-reveal-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ScrollReveal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ScrollReveal** v1.0.0 (stable)

Staggered Fade-In via Intersection Observer.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-scroll-reveal">
    scroll-reveal
  </div>`,
};

export const ScrollReveal = {
  name: 'Scroll Reveal',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-scroll-reveal">
    scroll-reveal
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Staggered Fade-In via Intersection Observer.' },
    },
  },
};
