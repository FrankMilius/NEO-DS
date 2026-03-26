// ============================================================
// ProductShowcase — Auto-generated from product-showcase-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ProductShowcase',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ProductShowcase** v1.0.0 (stable)

Root: Display Grid/Flex. Layout horizontal (Options links, Media rechts) oder stacked (Options oben, Media darunter).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>`,
};

export const HorizontalSlide = {
  name: 'Horizontal + Slide',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: Options links, Media rechts. Bild fliegt von rechts rein bei Klick.' },
    },
  },
};

export const HorizontalFade = {
  name: 'Horizontal + Fade',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Options links, Media rechts. Bild blendet sanft ein/aus.' },
    },
  },
};

export const WithColorIndicators = {
  name: 'With Color Indicators',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Options mit Farbpunkt-Indikatoren (Polestar-Style).' },
    },
  },
};

export const StackedLayout = {
  name: 'Stacked Layout',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Options oben, Media darunter. Fuer Mobile oder Produkt-Detail-Seiten.' },
    },
  },
};

export const OptionStyles = {
  name: 'Option Styles',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text vs Indicator vs Card — alle 3 Option-Darstellungen.' },
    },
  },
};

export const AnimationVariants = {
  name: 'Animation Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slide vs Fade vs None — Uebergangs-Animationen.' },
    },
  },
};
