// Vorlage: story-gallery — Markup aus data/markup/story-gallery.html (drei
// Karten: Fokus-Crop, Device-Frame, Hotspots). Statisch ohne Scroll-JS; die
// Paddles stehen unter der Galerie (--nav-below wie in der Ernte). Abgeglichen
// mit block--block-content--neo-story-gallery.html.twig (neo_fe): der Footer
// mit den Paddles ist Geschwister der Galerie, nicht Kind; Karten und
// nc-shot-Medien baut Drupal per JS (neo-theme.js, neo-shot.js).
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse} nc-story-gallery--nav-below" style="--sg-card-height: 320px;" role="group" aria-roledescription="Galerie" aria-label="Screenshot-System"${m.attrs}>
<div class="nc-story-gallery__scroll" tabindex="0">
<ul class="nc-story-gallery__track" role="list">
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="none"><img src="${BILD_SRC}" alt="Fokus-Crop" class="nc-shot__img" style="object-position: 32% 38%; transform-origin: 32% 38%; transform: scale(1.6);"></div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Fokus-Crop</h3><p class="nc-story-gallery__desc">Ein Master-Bild, Ausschnitt per Fokuspunkt + Zoom.</p></div>
</li>
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 16; --sg-card-ratio-h: 10;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="frame">
<div class="nc-shot__frame nc-shot--shadow">
<div class="nc-shot__chrome-bar"><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-url">workplace.neocosmo.de</span></div>
<div class="nc-shot__viewport"><img src="${BILD_SRC}" alt="Device-Frame" class="nc-shot__img"></div>
</div>
</div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Device-Frame</h3><p class="nc-story-gallery__desc">Derselbe Screenshot im Browser-Rahmen.</p></div>
</li>
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="hotspots">
<img src="${BILD_SRC}" alt="Hotspots" class="nc-shot__img">
<button type="button" class="nc-shot__hotspot" aria-label="Detail 1" style="left: 30%; top: 32%;"></button>
<button type="button" class="nc-shot__hotspot" aria-label="Detail 2" style="left: 70%; top: 60%;"></button>
</div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Hotspots</h3><p class="nc-story-gallery__desc">Annotationen mit Detail-Zoom.</p></div>
</li>
</ul>
</div>
</div>
<div class="nc-story-gallery__footer">
<div class="nc-story-gallery__paddles nc-story-gallery__paddles--below">
<button type="button" class="nc-story-gallery__paddle nc-story-gallery__paddle--prev" aria-label="Zurueck" disabled>${PFEIL_LINKS}</button>
<button type="button" class="nc-story-gallery__paddle nc-story-gallery__paddle--next" aria-label="Weiter">${PFEIL_RECHTS}</button>
</div>
</div>`
