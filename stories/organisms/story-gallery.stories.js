// ============================================================
// StoryGallery — Auto-generated from story-gallery-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/StoryGallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**StoryGallery** v1.2.0 (stable)

Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-story-gallery nc-story-gallery--nav-below nc-story-gallery--loop" data-neo-story-gallery="" data-loop="on" style="--sg-card-height: 520px;" aria-label="Screenshot-System — ein Master, drei Ausschnitte" role="group" aria-roledescription="Galerie" data-sg-init="1">
<div class="nc-story-gallery__scroll" tabindex="0">
<ul class="nc-story-gallery__track" role="list">
<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="none">
<img src="https://picsum.photos/id/180/1600/1000" alt="Fokus-Crop" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 32% 38%; transform-origin: 32% 38%; transform: scale(1.6);">
</div>
<div class="nc-story-gallery__caption" style="min-height: 100.062px;">
<h3 class="nc-story-gallery__title">Fokus-Crop</h3>
<p class="nc-story-gallery__desc">Ein Master-Bild, Ausschnitt per Fokuspunkt + Zoom.</p>
</div>
</li>
<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: 16; --sg-card-ratio-h: 10;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="frame">
<div class="nc-shot__frame nc-shot--shadow">
<div class="nc-shot__chrome-bar">
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-url">workplace.neocosmo.de</span>
</div>
<div class="nc-shot__viewport">
<img src="https://picsum.photos/id/180/1600/1000" alt="Device-Frame" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50% 45%; transform-origin: 50% 45%; transform: scale(1.1);">
</div>
</div>
</div>
<div class="nc-story-gallery__caption" style="min-height: 100.062px;">
<h3 class="nc-story-gallery__title">Device-Frame</h3>
<p class="nc-story-gallery__desc">Derselbe Screenshot im Browser-Rahmen.</p>
</div>
</li>
<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="kenburns" style="--nc-shot-dur: 7s;">
<img src="https://picsum.photos/id/180/1600/1000" alt="Ken-Burns" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 20% 25%; transform-origin: 20% 25%; transform: scale(1.7);">
</div>
<div class="nc-story-gallery__caption" style="min-height: 100.062px;">
<h3 class="nc-story-gallery__title">Ken-Burns</h3>
<p class="nc-story-gallery__desc">Langsame Fokus-Fahrt (pausiert ausser Sicht).</p>
</div>
</li>
<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="hotspots">
<img src="https://picsum.photos/id/180/1600/1000" alt="Hotspots" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50% 50%; transform-origin: 50% 50%;">
<button type="button" class="nc-shot__hotspot" aria-label="Detail 1" style="left: 30%; top: 32%;">
</button>
<button type="button" class="nc-shot__hotspot" aria-label="Detail 2" style="left: 70%; top: 60%;">
</button>
</div>
<div class="nc-story-gallery__caption" style="min-height: 100.062px;">
<h3 class="nc-story-gallery__title">Hotspots</h3>
<p class="nc-story-gallery__desc">Annotationen mit Detail-Zoom.</p>
</div>
</li>
<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: 16; --sg-card-ratio-h: 10;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="compare">
<div class="nc-shot__compare">
<div class="nc-shot">
<img src="https://picsum.photos/id/180/1600/1000" alt="Vergleich" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50% 50%; transform-origin: 50% 50%;">
</div>
<div class="nc-shot" style="clip-path: inset(0px 50% 0px 0px);">
<img src="https://picsum.photos/id/48/1600/1000" alt="" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50% 50%; transform-origin: 50% 50%;">
</div>
<div class="nc-shot__divider" style="left: 50%;">
</div>
<input type="range" min="0" max="100" aria-label="Vergleichsposition">
</div>
</div>
<div class="nc-story-gallery__caption" style="min-height: 100.062px;">
<h3 class="nc-story-gallery__title">Vergleich</h3>
<p class="nc-story-gallery__desc">Vorher/Nachher per Schieberegler.</p>
</div>
</li>
</ul>
</div>
<div class="nc-story-gallery__cursor-paddle" data-sg-cursor-paddle="" aria-hidden="true" data-cursor-dir="next">
<svg class="nc-story-gallery__cursor-icon nc-story-gallery__cursor-icon--prev" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M15 6l-6 6 6 6">
</path>
</svg>
<svg class="nc-story-gallery__cursor-icon nc-story-gallery__cursor-icon--next" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M9 6l6 6-6 6">
</path>
</svg>
</div>
</div>`,
};
