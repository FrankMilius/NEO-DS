// Vorlage: carousel — Markup aus data/markup/carousel.html. media=media setzt
// den Modifier und legt Geraete-Figuren in den Track (wie in der Ernte);
// default zeigt einfache Karten. Steuerung statisch.
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS, an } from './_helfer.js'

const ANSICHTEN = [
  ['News', 'Unternehmensnews und Meldungen aus den Bereichen — sortiert nach dem, was für die eigene Rolle zählt.'],
  ['Mitarbeiterservices', 'Urlaubsantrag, Gehaltsnachweis, Krankmeldung: drei Fingertipps entfernt.'],
  ['Event-Kalender', 'Betriebsversammlung, Schulung, Sommerfest — mit Zusage direkt aus der App.']
]

export default (zelle, m) => {
  const medien = m.wert('media') === 'media'
  const eintrag = ([name, text]) => medien
    ? `<figure class="nc-device-figure">
<div class="nc-device"><div class="nc-device__screen"><img src="${BILD_SRC}" alt="" decoding="async"></div></div>
<figcaption class="nc-device-figure__caption"><span class="nc-device-figure__name">${name}</span><span class="nc-device-figure__text">${text}</span></figcaption>
</figure>`
    : `<article class="nc-card"><div class="nc-card__content"><h3 class="nc-card__title">${name}</h3><p class="nc-card__description">${text}</p></div></article>`
  return `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-carousel__track${medien ? ' nc-carousel__track--media' : ''}" tabindex="0" role="group" aria-label="Ansichten, waagerecht scrollbar">
${ANSICHTEN.map(eintrag).join('\n')}
</div>
${an(m, 'controls') ? `<div class="nc-carousel__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Zurück">${PFEIL_LINKS}</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Weiter">${PFEIL_RECHTS}</button>
</div>` : ''}
</div>`
}
