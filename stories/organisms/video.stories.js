// ============================================================
// Video — Auto-generated from video-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Video',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Video** v1.0.0 (stable)

video-wrap als Wrapper fuer alle Video-Formate.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="video-wrap">
    <span class="video | iframe">media</span>
  </div>`,
};

export const ClicktoPlay = {
  name: 'Click to Play',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="video-wrap">
    <span class="video | iframe">media</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const Autoplay = {
  name: 'Autoplay',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="video-wrap">
    <span class="video | iframe">media</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};
