// Vorlage: gallery — Markup aus data/markup/gallery.html (drei Slides,
// statisch: erster Slide aktiv, kein Autoplay-JS). animation/navStyle/
// height/contentAlign per Modifier; navStyle=thumbnails zeigt Vorschaubilder
// statt Punkten. height=viewport waere in der Arena-Zelle bildschirmhoch —
// die Zelle begrenzt die Hoehe deshalb ueber die Mod-Variable.
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS, an } from './_helfer.js'

const SLIDES = [
  ['SaaS Platform', 'PIIPE Workplace', 'Die intelligente Arbeitsplatz-Plattform für moderne Teams.', 'Jetzt starten'],
  ['Neu', 'Analytics Dashboard', 'Echtzeit-Einblicke in Team-Performance und Projektfortschritt.', 'Dashboard entdecken'],
  ['Security', 'Enterprise Security', 'ISO 27001 zertifiziert. Ende-zu-Ende-Verschlüsselung. DSGVO-konform.', 'Mehr erfahren']
]

const PAUSE = '<svg class="nc-gallery__autoplay-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'

export default (zelle, m) => {
  const thumbs = m.wert('navStyle') === 'thumbnails'
  const hoehe = m.wert('height') === 'viewport' ? ' style="--mod-gallery-height: 26rem;"' : ''
  return `
<div class="${m.klasse}" role="group" aria-roledescription="Karussell" aria-label="Bild-Galerie"${hoehe}${m.attrs}>
<div class="nc-gallery__track">
${SLIDES.map(([tag, titel, text, cta], i) => `<div class="nc-gallery__slide${i === 0 ? ' is-active' : ''}" role="tabpanel" aria-roledescription="Slide" aria-label="${titel}"${i ? ' aria-hidden="true"' : ''} data-slide-theme="dark">
<div class="nc-gallery__slide-bg"><img src="${BILD_SRC}" alt="" decoding="async"></div>
${an(m, 'slide-overlay') ? '<div class="nc-gallery__slide-overlay"></div>' : ''}
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">${tag}</span>
<h3 class="nc-gallery__slide-title">${titel}</h3>
<p class="nc-gallery__slide-description">${text}</p>
<div class="nc-gallery__slide-actions"><a class="nc-button nc-button--primary nc-button--lg" href="#" onclick="return false">${cta}</a></div>
</div>
</div>
</div>`).join('\n')}
</div>
${an(m, 'controls') ? `<div class="nc-gallery__controls">
<button class="nc-gallery__paddle nc-gallery__paddle--prev" type="button" aria-label="Vorheriger Slide">${PFEIL_LINKS}</button>
<button class="nc-gallery__paddle nc-gallery__paddle--next" type="button" aria-label="Nächster Slide">${PFEIL_RECHTS}</button>
<nav class="nc-gallery__nav" role="tablist" aria-label="Slide-Navigation">
${SLIDES.map(([, titel], i) => `<button class="nc-gallery__nav-dot${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" aria-label="${titel}">${thumbs ? `<img src="${BILD_SRC}" alt="">` : ''}</button>`).join('\n')}
</nav>
<button class="nc-gallery__autoplay" type="button" aria-label="Galerie pausieren">${PAUSE}</button>
</div>` : ''}
</div>`
}
