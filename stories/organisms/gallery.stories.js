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
  render: () => `<div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>`,
};

export const DefaultSlideGallery = {
  name: 'Default Slide Gallery',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-gallery">
    <span class="nc-gallery__track">track</span>
    <span class="nc-gallery__slide">slide</span>
    <span class="nc-gallery__slide-bg">slide-bg</span>
    <span class="nc-gallery__slide-content">slide-content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dots vs Lines vs Thumbnails — alle 3 Nav-Darstellungen.' },
    },
  },
};
