// Vorlage: marquee — Markup aus data/markup/marquee.html (Doku-Ernte), ohne
// die Inline-Stile der Doku-Seite. Zwei gleiche Texte im Track, damit der
// Lauf nahtlos wiederholen kann (translate um die halbe Spur).
//
// Specimens: default (Lauftext allein), im-container (DS-Regel
// `.nc-container > .nc-marquee`, 04-objects/_section.scss: der Container-
// Abstand geht an den Lauftext).
//
// Zustände: statisch — das DS gestaltet Spur und Text, bewegt sie aber
// nicht: .nc-marquee__track hat nur will-change: transform, keine Animation.
// Abspielen: die Arena haengt die DS-Keyframes `marquee`
// (02-generic/_animations.scss, translate3d auf --marquise-item-width,
// Standard -50 %) an die Spur — so, wie es die Doku-Seite per Inline-Stil tut.
// Gemeldet: ob die Bewegung (samt prefers-reduced-motion) ins SCSS gehoert.
import { alle } from './_bewegung.js'

const TEXT = 'Kommunikation — Wissen — Events — Vernetzung — Anwendungen — '

export default (zelle, m) => {
  const lauf = `<div class="${m.klasse}" aria-hidden="true"${m.attrs}>
<div class="nc-marquee__track">
<span class="nc-marquee__text">${TEXT}</span>
<span class="nc-marquee__text">${TEXT}</span>
</div>
</div>`
  if (m.specimen.render?.compositionType === 'marquee-in-container') {
    return `<div class="nc-container">\n${lauf}\n</div>`
  }
  return lauf
}

/** Dauer eines Durchlaufs in der Arena (die Doku-Seite nutzt 8 s fuer kurzen Text). */
export const DAUER = '20s'

export const abspielen = {
  hinweis: 'Die Spur läuft mit den DS-Keyframes „marquee“ (02-generic/_animations.scss); das Bauteil selbst bewegt sie nicht.',
  starten (zelle) {
    return alle([...zelle.querySelectorAll('.nc-marquee__track')].map((spur) => {
      spur.style.animation = `marquee ${DAUER} linear infinite`
      return () => { spur.style.animation = '' }
    }))
  }
}
