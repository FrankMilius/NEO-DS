// ============================================================
// FadeGallery — Auto-generated from fade-gallery-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FadeGallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FadeGallery** v1.0.0 (stable)

Tab-basierte Fade-Gallery (Apple-Style). Medium + Description faden ein.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-fade-gallery">
    fade-gallery
  </div>`,
};

export const FadeGallery = {
  name: 'Fade Gallery',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-fade-gallery">
    fade-gallery
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tab-basierte Fade-Gallery (Apple-Style). Medium + Description faden ein.' },
    },
  },
};
