// ============================================================
// TextMedia — Auto-generated from text-media-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TextMedia',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TextMedia** v1.0.0 (stable)

Grid: 2 Spalten, media + content. Responsive: stacked auf mobile.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-text-media">
    <span class="nc-text-media__media">media</span>
    <span class="nc-text-media__content">content</span>
  </div>`,
};

export const MediaLinks = {
  name: 'Media Links',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-text-media">
    <span class="nc-text-media__media">media</span>
    <span class="nc-text-media__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: Media links, Content rechts.' },
    },
  },
};

export const MediaRechts = {
  name: 'Media Rechts',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-text-media">
    <span class="nc-text-media__media">media</span>
    <span class="nc-text-media__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Reversed: Content links, Media rechts.' },
    },
  },
};
