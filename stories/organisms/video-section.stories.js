// ============================================================
// VideoSection — Auto-generated from video-section-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/VideoSection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**VideoSection** v1.0.0 (stable)

2-Spalten Grid: media + content, gap 4rem. Single-Column unter 900px.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-video">
    <span class="nc-video__media">media</span>
    <span class="nc-video__content">content</span>
  </div>`,
};

export const VideoSection = {
  name: 'Video Section',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-video">
    <span class="nc-video__media">media</span>
    <span class="nc-video__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Video mit Content und Play-Overlay' },
    },
  },
};
