// ============================================================
// ParallaxBg — Auto-generated from parallax-bg-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ParallaxBg',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ParallaxBg** v1.0.0 (stable)

Staircase Grid Reveal mit animierten Quadraten.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-parallax-bg">
    parallax-bg
  </div>`,
};

export const ParallaxBackground = {
  name: 'Parallax Background',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-parallax-bg">
    parallax-bg
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Staircase Grid Reveal mit animierten Quadraten.' },
    },
  },
};
