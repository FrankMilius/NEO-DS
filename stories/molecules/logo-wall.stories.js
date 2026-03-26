// ============================================================
// LogoWall — Auto-generated from logo-wall-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/LogoWall',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**LogoWall** v2.0.0 (stable)

Root: display:grid (default), display:flex (marquee/cluster). Gap via Token.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>`,
};

export const GridDefault = {
  name: 'Grid (Default)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: Responsives auto-fit Raster mit Pill-Items.' },
    },
  },
};

export const MarqueeTicker = {
  name: 'Marquee Ticker',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Endlose horizontale Laufschrift. Pause bei Hover.' },
    },
  },
};

export const Cluster = {
  name: 'Cluster',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Organisches Flex-Layout mit Wrap.' },
    },
  },
};

export const MonochromeHoverReveal = {
  name: 'Monochrome + Hover Reveal',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Logos grau. Hover zeigt Originalfarben.' },
    },
  },
};

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM vs MD vs LG im Vergleich.' },
    },
  },
};

export const StaggeredFadeIn = {
  name: 'Staggered Fade-In',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-logo-wall">
    <span class="nc-logo-pill">pill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Logos blenden gestaffelt ein per Intersection Observer.' },
    },
  },
};

export const LayoutVariants = {
  name: 'Layout Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Grid vs Marquee vs Cluster im Vergleich.' },
    },
  },
};
