// Vorlage: video — Aufbau aus scss/scss/04-objects/_video.scss
// (video-wrap mit Medium, Play-Zeichen, Oeffnen-Knopf). Das Video bekommt nur
// ein Posterbild, keine Quelle (keine Netzlast, kein 404). behavior=autoplay
// per Modifier und ohne Play-Zeichen; Zustand playing blendet es ebenfalls aus.
import { BILD_SRC, an } from './_helfer.js'

export default (zelle, m) => {
  const autoplay = m.wert('behavior') === 'autoplay'
  const spielt = autoplay || m.hat('playing')
  return `
<div class="${m.klasse}"${m.attrs}>
<video poster="${BILD_SRC}" muted playsinline preload="none"${autoplay ? ' loop' : ''} aria-label="Produktvideo" style="width: 100%; display: block;"></video>
${!spielt && an(m, 'play-sign') ? '<span class="play-sign" aria-hidden="true"></span>' : ''}
${!autoplay && an(m, 'open-button') ? '<button type="button" class="open-button" aria-label="Video abspielen"></button>' : ''}
</div>`
}
