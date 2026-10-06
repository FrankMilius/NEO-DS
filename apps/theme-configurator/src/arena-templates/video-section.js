// Vorlage: video-section — Markup aus data/markup/video-section.html.
// Zustand playing blendet das Overlay aus (.nc-video__media.is-playing).
// Plan v3, Phase 4:
//   - Rahmen ra-desktop: zwei Spalten erst ueber 900 px Fenster, Breite bis
//     --container-max-width — der Block ist fuer die Seitenbreite gebaut
//   - render.compositionType „video": natives <video> mit Vorschaubild
//     (poster) statt <img> (Doku „Mit nativem Video-Element")
//   - render.flaeche „dunkel": auf dunkler Flaeche (neo-dark-theme am
//     Block-Wrapper). Titel und Text sind text-primary und folgen der
//     Flaeche (Entscheidung 06.10.2026)
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => {
  const medium = m.specimen.render?.compositionType === 'video'
    ? `<video poster="${BILD_SRC}" preload="none" playsinline aria-label="Produktvideo"></video>`
    : `<img src="${BILD_SRC}" alt="Video-Vorschaubild">`
  return `<div class="ra-desktop">
<div class="${m.klasse}"${m.attrsOhne('data-state')}>
<div class="nc-video__media${m.hat('playing') ? ' is-playing' : ''}">
${medium}
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
</div>`
}
