// ============================================================
// Marquee — Auto-generated from marquee-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Marquee',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Marquee** v1.0.0 (stable)

Overflow:hidden Container. Track: inline-flex, gap 2.5rem, will-change:transform.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-marquee">
    <span class="nc-marquee__track">track</span>
    <span class="nc-marquee__text">marquee</span>
  </div>`,
};

export const Marquee = {
  name: 'Marquee',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-marquee">
    <span class="nc-marquee__track">track</span>
    <span class="nc-marquee__text">marquee</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontaler Lauftext/Logo-Ticker' },
    },
  },
};
