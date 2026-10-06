// Vorlage: marquee — Markup aus data/markup/marquee.html (Doku-Ernte), ohne
// die Inline-Stile der Doku-Seite. Zwei gleiche Texte im Track, damit der
// Lauf nahtlos wiederholen kann (translate um die halbe Spur).
//
// Specimens: default (Lauftext allein), im-container (DS-Regel
// `.nc-container > .nc-marquee`, 04-objects/_section.scss: der Container-
// Abstand geht an den Lauftext).
//
// Bewegung (Entscheidung 06.10.2026): das DS laesst .nc-marquee__track
// endlos laufen (Keyframes `marquee`, Dauer --nc-marquee-duration; bei
// prefers-reduced-motion steht sie). Zustände: Standbild — die Zelle steht
// im Rahmen ra-standbild, der die Animation des DS anhaelt.
// Abspielen: nimmt ra-standbild weg, die echte Animation des DS laeuft;
// Anhalten setzt den Rahmen wieder.
import { alle } from './_bewegung.js'

const TEXT = 'Kommunikation — Wissen — Events — Vernetzung — Anwendungen — '

export default (zelle, m) => {
  const lauf = `<div class="${m.klasse}" aria-hidden="true"${m.attrs}>
<div class="nc-marquee__track">
<span class="nc-marquee__text">${TEXT}</span>
<span class="nc-marquee__text">${TEXT}</span>
</div>
</div>`
  const inhalt = m.specimen.render?.compositionType === 'marquee-in-container'
    ? `<div class="nc-container">\n${lauf}\n</div>`
    : lauf
  return `<div class="ra-standbild">\n${inhalt}\n</div>`
}

export const abspielen = {
  hinweis: 'Die Spur läuft mit der Animation des DS (.nc-marquee__track, Keyframes „marquee“, Dauer --nc-marquee-duration); bei reduzierter Bewegung steht sie.',
  starten (zelle) {
    return alle([...zelle.querySelectorAll('.ra-standbild')].map((rahmen) => {
      rahmen.classList.remove('ra-standbild')
      return () => { rahmen.classList.add('ra-standbild') }
    }))
  }
}
