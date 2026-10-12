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
// Pause-Knopf (Plan v4, Phase 2, 12.10.2026, WCAG 2.2.2): .nc-marquee__pause
// vor der Spur; der Lauftext ist dekorativ (aria-hidden an der Spur, nicht
// an der Wurzel — sonst laege der Knopf im verborgenen Bereich). Im Modus
// „Ausprobieren" laeuft die Spur ohne Standbild-Rahmen, das Behavior
// marquee schaltet den Knopf und haelt bei Maus/Fokus an.
// Abspielen: nimmt ra-standbild weg, die echte Animation des DS laeuft;
// Anhalten setzt den Rahmen wieder.
import { alle } from './_bewegung.js'

const TEXT = 'Kommunikation — Wissen — Events — Vernetzung — Anwendungen — '

const PAUSE_KNOPF = '<button type="button" class="nc-marquee__pause" data-playing="true">' +
  '<svg class="nc-marquee__pause-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path class="nc-marquee__pause-pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' +
  '<path class="nc-marquee__pause-play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg>' +
  '<span class="nc-marquee__pause-label">Laufband anhalten</span></button>'

export default (zelle, m) => {
  const lauf = `<div class="${m.klasse}"${m.attrs}>
${PAUSE_KNOPF}
<div class="nc-marquee__track" aria-hidden="true">
<span class="nc-marquee__text">${TEXT}</span>
<span class="nc-marquee__text">${TEXT}</span>
</div>
</div>`
  const inhalt = m.specimen.render?.compositionType === 'marquee-in-container'
    ? `<div class="nc-container">\n${lauf}\n</div>`
    : lauf
  return m.ausprobieren ? inhalt : `<div class="ra-standbild">\n${inhalt}\n</div>`
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
