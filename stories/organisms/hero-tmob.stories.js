// ============================================================
// HeroTmob — Auto-generated from hero-tmob-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/HeroTmob',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**HeroTmob** v1.0.0 (stable)

Headline + Subtext + Media ueber konfigurierbarem Hintergrund.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-hero-tmob">
    hero-tmob
  </div>`,
};

export const HeroTextMediaoverBG = {
  name: 'Hero — Text + Media over BG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-hero-tmob">
    hero-tmob
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Headline + Subtext + Media ueber konfigurierbarem Hintergrund.' },
    },
  },
};
