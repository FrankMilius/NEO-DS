// ============================================================
// HeroTom — Auto-generated from hero-tom-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/HeroTom',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**HeroTom** v1.0.0 (stable)

Text ueber Hintergrund-Medium. Optionaler Parallax-Expand.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-hero-tom">
    hero-tom
  </div>`,
};

export const HeroTextoverMedia = {
  name: 'Hero — Text over Media',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-hero-tom">
    hero-tom
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text ueber Hintergrund-Medium. Optionaler Parallax-Expand.' },
    },
  },
};
