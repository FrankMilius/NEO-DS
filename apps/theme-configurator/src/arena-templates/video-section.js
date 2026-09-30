// Vorlage: video-section — Markup aus data/markup/video-section.html.
// Zustand playing blendet das Overlay aus (.nc-video__media.is-playing).
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-video__media${m.hat('playing') ? ' is-playing' : ''}">
<img src="${BILD_SRC}" alt="Video-Vorschaubild">
<button class="nc-video__overlay" type="button" aria-label="Video abspielen">
<span class="nc-video__overlay-icon" aria-hidden="true"></span>
</button>
</div>
<div class="nc-video__content">
<h2 class="nc-video__title">So funktioniert unsere Plattform</h2>
<p class="nc-video__text">In diesem kurzen Video zeigen wir Ihnen, wie Sie in wenigen Minuten starten können und sofort produktiv werden.</p>
<button class="nc-button nc-button--primary" type="button">Jetzt kostenlos starten</button>
</div>
</div>
`
