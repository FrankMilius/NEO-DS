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
  name: 'Standard',
  render: () => `<div class="nc-video" id="demo-video-section">
<!-- Media Column -->
<div class="nc-video__media" id="demo-video-media">
<img src="https://placehold.co/800x450/111827/ffffff?text=Video+Thumbnail" alt="Video-Vorschaubild">
<button class="nc-video__overlay" aria-label="Video abspielen" id="demo-play-btn">
<span class="nc-video__overlay-icon" aria-hidden="true">
</span>
</button>
</div>
<!-- Content Column -->
<div class="nc-video__content">
<h2 class="nc-video__title">So funktioniert unsere Plattform</h2>
<p class="nc-video__text">
 In diesem kurzen Video zeigen wir Ihnen, wie Sie in wenigen Minuten starten können
 und sofort produktiv werden.
 </p>
<button class="nc-button nc-button--primary">Jetzt kostenlos starten</button>
</div>
</div>`,
};
