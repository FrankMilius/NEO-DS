// ============================================================
// Cta — Auto-generated from cta-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Cta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Cta** v1.0.0 (stable)

3-Spalten Grid: clamp padding, clamp gap. Farbe: always-light auf dunklem BG.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-cta">
    <span class="nc-cta__left">left</span>
  </div>`,
};

export const CTASection = {
  name: 'CTA Section',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-cta">
    <span class="nc-cta__left">left</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Call-to-Action mit Newsletter und Demo' },
    },
  },
};
