// ============================================================
// Banner — Auto-generated from banner-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Banner** v2.0.0 (stable)

Seitenbreite Benachrichtigungsleiste — Unterschied zu Alert: Banner ist sticky/fixed, seitenbreit.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>`,
};

export const SeverityVariants = {
  name: 'Severity Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Info, Warning, Danger, Success — volle Farbflaeche' },
    },
  },
};

export const BorderAccentVariants = {
  name: 'Border-Accent Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Info, Warning, Danger, Success — dezente BG + Akzent-Border' },
    },
  },
};

export const WithTitlePrefix = {
  name: 'With Title Prefix',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Banner mit fettgedrucktem Titel-Praefix fuer bessere Scanbarkeit' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text-Only, With Icon, With Title, With Link, With Close, Full' },
    },
  },
};

export const DismissAnimation = {
  name: 'Dismiss Animation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slide-up Animation beim Schliessen — Hoehe schrumpft auf 0' },
    },
  },
};

export const PositionVariants = {
  name: 'Position Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Static, Sticky, Fixed — Positionierung des Banners' },
    },
  },
};

export const DangerAlertBanner = {
  name: 'Danger Alert Banner',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kritisches Banner mit role=\'alert\' fuer sofortige Ankuendigung' },
    },
  },
};

export const WithCTALink = {
  name: 'With CTA Link',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-banner">
    <span class="nc-banner__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Banner mit eingebettetem Call-to-Action Link' },
    },
  },
};
