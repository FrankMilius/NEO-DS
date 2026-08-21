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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>`,
};

export const HorizontalSlide = {
  name: 'Horizontal + Slide',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/product-showcase.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-product-showcase">
    <span class="nc-product-showcase__options">options</span>
    <span class="nc-product-showcase__option">option</span>
    <span class="nc-product-showcase__media-panel">media-panel</span>
    <span class="nc-product-showcase__media-item">media-item</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slide vs Fade vs None — Uebergangs-Animationen.' },
    },
  },
};
