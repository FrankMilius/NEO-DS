// ============================================================
// Footer — Auto-generated from footer-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Footer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Footer** v2.0.0 (stable)

Root: <footer> mit role='contentinfo'. BEM-Root: .nc-footer.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>`,
};

export const SimpleLegalSocial = {
  name: 'Simple (Legal + Social)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Minimaler Footer: Copyright links, Social-Icons rechts. Heller Hintergrund.' },
    },
  },
};

export const SimpleDark = {
  name: 'Simple (Dark)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Minimaler Footer auf dunklem Hintergrund.' },
    },
  },
};

export const Sitemap3Spalten = {
  name: 'Sitemap (3 Spalten)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sitemap-Footer mit 3-Spalten-Grid. Headings + Link-Listen.' },
    },
  },
};

export const Sitemap4SpaltenDark = {
  name: 'Sitemap (4 Spalten, Dark)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sitemap-Footer mit 4 Spalten auf dunklem Hintergrund.' },
    },
  },
};

export const EngagementCTAColumns = {
  name: 'Engagement (CTA + Columns)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Footer mit CTA-Bereich oben (Kicker, Headline, Button) + Sitemap-Grid.' },
    },
  },
};

export const ThemeVergleich = {
  name: 'Theme Vergleich',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Base vs Inverse Theme im direkten Vergleich.' },
    },
  },
};

export const SpaltenVergleich = {
  name: 'Spalten-Vergleich',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-footer">
    <span class="nc-footer__legal">legal-area</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '2 vs 3 vs 4 Spalten im Vergleich.' },
    },
  },
};
