// ============================================================
// Gallery — Auto-generated from gallery-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Gallery** v1.0.0 (stable)

Root: position:relative, overflow:hidden, width:100%, height via --nc-gallery-height.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>`,
};

export const DefaultSlideGallery = {
  name: 'Default Slide Gallery',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: Viewport-Hoehe, Slide-Animation, Dot-Navigation, Content links.' },
    },
  },
};

export const FadeAnimation = {
  name: 'Fade Animation',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slides blenden sanft ein/aus statt zu schieben.' },
    },
  },
};

export const CenteredContent = {
  name: 'Centered Content',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Content zentriert ausgerichtet — fuer symmetrische Layouts.' },
    },
  },
};

export const LineNavigation = {
  name: 'Line Navigation',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Balken-Indikatoren statt Dots.' },
    },
  },
};

export const FixedHeight = {
  name: 'Fixed Height',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Feste Hoehe (500-700px) statt Viewport-Hoehe.' },
    },
  },
};

export const NavigationStyles = {
  name: 'Navigation Styles',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/gallery.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dots vs Lines vs Thumbnails — alle 3 Nav-Darstellungen.' },
    },
  },
};
