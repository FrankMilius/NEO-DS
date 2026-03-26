// ============================================================
// StoryGallery — Auto-generated from story-gallery-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/StoryGallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**StoryGallery** v1.0.0 (stable)

Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-story-gallery">
    story-gallery
  </div>`,
};

export const StoryGallery = {
  name: 'Story Gallery',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-story-gallery">
    story-gallery
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).' },
    },
  },
};
