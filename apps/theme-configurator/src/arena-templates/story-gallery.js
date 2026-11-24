// Vorlage: story-gallery — Markup aus data/markup/story-gallery.html
// (geerntet von der Website), abgeglichen mit
// block--block-content--neo-story-gallery.html.twig (neo_fe): der Footer mit
// den Paddles ist Geschwister der Galerie, nicht Kind.
// Nicht uebernommen, weil das DS sie nicht gestaltet (gemeldet):
//   .nc-story-gallery--nav-below   Website-Klasse ohne Regel in styles.css
// Das Medium ist auf der Website das DS-Bauteil shot (seit 07.10.2026,
// eigene Arena) — hier das Bild direkt im __media, wie es
// .nc-story-gallery__media img gestaltet.
// Die Groessen (--sg-card-height-block, --sg-card-ratio-w/-h) sind
// Instanzwerte, die Drupal je Block und Karte inline setzt (Hoehe seit I18
// als -block, damit die Handy-Hoehe greift).
//
// Achse navigation: below = Paddles unter der Galerie (__footer >
// __paddles--below), overlay = Paddles ueber den Karten (__paddles--overlay
// in der Galerie). Achse loop: on = .nc-story-gallery--loop (Spur ohne
// Einzug, Cursor-Paddle statt Mauszeiger); das Cursor-Paddle (position:
// fixed, folgt der Maus) zeigt die Zelle im Rahmen ra-bildschirm sichtbar
// (.is-visible, Richtung next) an fester Stelle.
//
// Kopf (I16 Phase 4, 23.11.2026): wie im Twig steht der Sektionskopf direkt
// vor der Galerie; das DS setzt ihn dort linksbündig, größer und mit mehr
// Abstand (--nc-story-gallery-head-*), sonst wirkten diese Werte nicht.
//
// Zustände: statisch, erste Karte am Anfang. Abspielen: die Spur blaettert
// Karte um Karte — die Bewegung ist scroll-behavior: smooth aus dem DS
// (bei prefers-reduced-motion: auto); „Zurueck"/„Weiter" sperren sich am
// Anfang bzw. Ende wie auf der Website.
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'
import { blaettere, alle } from './_bewegung.js'

const KARTEN = [
  ['Fokus-Crop', 'Ein Master-Bild, Ausschnitt per Fokuspunkt + Zoom.', 4, 3],
  ['Device-Frame', 'Derselbe Screenshot im Browser-Rahmen.', 16, 10],
  ['Hotspots', 'Annotationen mit Detail-Zoom.', 4, 3],
  ['Ken-Burns', 'Langsamer Zoom über den Ausschnitt.', 4, 3]
]

// Fußleiste (I16 Phase 5, 23.11.2026): bei „unten“ und im Endlos-Modus
// Fortschrittsbalken links, Pfeile rechts — wie das Twig. Der Balken steht
// statisch bei einem Viertel; die Lage setzt auf der Website das Skript.
const FORTSCHRITT = '<div class="nc-story-gallery__progress" aria-hidden="true"><span class="nc-story-gallery__progress-bar" style="--sg-fortschritt-breite: 0.25; --sg-fortschritt-lage: 0;"></span></div>'

const paddles = (art) => `<div class="nc-story-gallery__paddles nc-story-gallery__paddles--${art}">
<button type="button" class="nc-story-gallery__paddle nc-story-gallery__paddle--prev" aria-label="Zurück" disabled>${PFEIL_LINKS}</button>
<button type="button" class="nc-story-gallery__paddle nc-story-gallery__paddle--next" aria-label="Weiter">${PFEIL_RECHTS}</button>
</div>`

export default (zelle, m) => {
  const oben = m.wert('navigation') === 'overlay'
  const schleife = m.wert('loop') === 'on'
  const karten = KARTEN.map(([titel, text, w, h]) => `<li class="nc-story-gallery__card" style="--sg-card-ratio-w: ${w}; --sg-card-ratio-h: ${h};">
<div class="nc-story-gallery__media"><img src="${BILD_SRC}" alt="${titel}" decoding="async"></div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">${titel}</h3><p class="nc-story-gallery__desc">${text}</p></div>
</li>`).join('\n')
  const kopf = `<div class="nc-section-header">
<span class="nc-section-header__label">NEO Workplace</span>
<h2 class="nc-section-header__title">Unsere Highlights</h2>
</div>`
  const galerie = `${kopf}
<div class="${wurzelKlassen(m)}" style="--sg-card-height-block: 280px;" role="group" aria-roledescription="Galerie" aria-label="Screenshot-System"${m.attrs}>
<div class="nc-story-gallery__scroll" tabindex="0">
<ul class="nc-story-gallery__track" role="list">
${karten}
</ul>
</div>
${oben && !schleife ? paddles('overlay') + '\n' : ''}</div>
${oben && !schleife ? '' : `<div class="nc-story-gallery__footer">\n${FORTSCHRITT}\n${paddles('below')}\n</div>`}`
  if (!schleife) return galerie
  return `<div class="ra-bildschirm ra-bildschirm--voll">
${galerie}
<div class="nc-story-gallery__cursor-paddle is-visible" data-cursor-dir="next" aria-hidden="true" style="left: 70%; top: 140px;"><span class="nc-story-gallery__cursor-icon nc-story-gallery__cursor-icon--prev">${PFEIL_LINKS}</span><span class="nc-story-gallery__cursor-icon nc-story-gallery__cursor-icon--next">${PFEIL_RECHTS}</span></div>
</div>`
}

export const abspielen = {
  hinweis: 'Die Spur blättert Karte um Karte; die Bewegung ist scroll-behavior: smooth aus dem DS.',
  starten (zelle) {
    return alle([...zelle.querySelectorAll('.nc-story-gallery')].map((galerie) => {
      const spur = galerie.querySelector('.nc-story-gallery__scroll')
      const karten = [...galerie.querySelectorAll('.nc-story-gallery__card')]
      // Paddles: in der Galerie (overlay) oder im Footer dahinter (below)
      const bereich = galerie.querySelector('.nc-story-gallery__paddles') ? galerie : galerie.nextElementSibling
      const zurueck = bereich?.querySelector('.nc-story-gallery__paddle--prev')
      const weiter = bereich?.querySelector('.nc-story-gallery__paddle--next')
      return blaettere(spur, karten, (i) => {
        if (zurueck) zurueck.disabled = i === 0
        if (weiter) weiter.disabled = i === karten.length - 1
      })
    }))
  }
}
