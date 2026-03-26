// ============================================================
// Navigation — Auto-generated from navigation-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Navigation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Navigation** v2.0.0 (stable)

nc-header: sticky top, backdrop-filter blur, bg-base 90% opacity, border-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-header">
    <span class="nc-nav">nav</span>
    <span class="nc-nav__inner">inner</span>
    <span class="nc-brand">brand</span>
  </div>`,
};

export const EmphasisVariants = {
  name: 'Emphasis Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default (Blur), Transparent (Hero), Solid — Visueller Modus' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-nav">nav</span>
    <span class="nc-nav__inner">inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start, Center, Right — Ausrichtung der Links' },
    },
  },
};

export const StickyStates = {
  name: 'Sticky States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-nav">nav</span>
    <span class="nc-nav__inner">inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Scrolled (Shadow), Hidden (Intelligent Sticky)' },
    },
  },
};

export const LandingpageHeader = {
  name: 'Landingpage Header',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-nav">nav</span>
    <span class="nc-nav__inner">inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Transparent + Center — typischer Hero-Overlay-Header' },
    },
  },
};
