// Vorlage: video — Aufbau aus scss/scss/04-objects/_video.scss
// (video-wrap mit Medium, Play-Zeichen, Oeffnen-Knopf). Das Video bekommt nur
// ein Posterbild, keine Quelle (keine Netzlast, kein 404). behavior=autoplay
// per Modifier und ohne Play-Zeichen; Zustand playing blendet es ebenfalls aus.
// Autoplay ist die Wurzel des Behaviors video ([data-neo-video], Plan v4,
// Phase 3) mit dem Pause-Knopf .nc-video-pause — verborgen, bis „Ausprobieren"
// bindet (ohne Quelle meldet das Video „blockiert": der Knopf bietet Abspielen an).
import { BILD_SRC, an } from './_helfer.js'

export default (zelle, m) => {
  const autoplay = m.wert('behavior') === 'autoplay'
  const spielt = autoplay || m.hat('playing')
  return `
<div class="${m.klasse}"${m.attrs}${autoplay ? ' data-neo-video' : ''}>
<video poster="${BILD_SRC}" muted playsinline preload="none"${autoplay ? ' loop' : ''} aria-label="Produktvideo" style="width: 100%; display: block;"></video>
${!spielt && an(m, 'play-sign') ? '<span class="play-sign" aria-hidden="true"></span>' : ''}
${!autoplay && an(m, 'open-button') ? '<button type="button" class="open-button" aria-label="Video abspielen"></button>' : ''}
${autoplay ? '<button type="button" class="nc-video-pause" data-playing="true" hidden><svg class="nc-video-pause__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path class="nc-video-pause__pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/><path class="nc-video-pause__play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg></button>' : ''}
</div>`
}
