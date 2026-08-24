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
  name: 'Standard',
  render: () => `<div class="nc-marquee" aria-hidden="true" style="border-block: 1px solid var(--fnd-color-border-secondary); padding-block: var(--fnd-spacing-02);">
<div class="nc-marquee__track" style="animation: marquee-scroll-demo 8s linear infinite;">
<span class="nc-marquee__text">A — B — C — D — A — B — C — D</span>
</div>
</div>`,
};
