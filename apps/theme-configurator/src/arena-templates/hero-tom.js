// Vorlage: hero-tom (Text ueber Medium) — Markup aus
// data/markup/hero-tom.html (geerntet von der Website).
//
// Was das DS davon gestaltet: nur die Inhaltsbreite (.nc-hero-tom--cw-*
// begrenzt .nc-hero-tom__content, 07-organisms/_hero-tom.scss) und die
// Badge-Zeile (.nc-hero-tom__badges, 05-atoms/_badge-row.scss). Wurzel,
// Medium, Scrim und Text gestaltet das Drupal-Theme (neo_fe), nicht
// styles.css — die Arena zeigt deshalb, was das DS hergibt (gemeldet).
// Die Klassen stehen als Anatomie im Recipe.
//
// Expand-Animation: auf der Website setzt GSAP/ScrollTrigger (neo-theme.js)
// beim Scrollen --tom-expand am Medium; das DS kennt die Eigenschaft nicht.
// Zustände zeigt den ausgefahrenen Endzustand (--tom-expand: 1, wie in der
// Ernte), „Abspielen" bleibt mit Grund gesperrt (Entscheidungsfall).
//
// Specimens: default, content-width (Achse contentWidth: Modifier
// --cw-* an der Wurzel), badges (render.badges: Badge-Zeile ueber dem
// Kicker, wie im Hero).
import { BILD_SRC, esc } from './_helfer.js'
import { nurGsap } from './_bewegung.js'

const BADGES = ['Open Source', 'DSGVO-konform']

export default (zelle, m) => {
  const badges = m.specimen.render?.badges === true
    ? `<div class="nc-badge-row nc-hero-tom__badges">\n${BADGES.map((b) => `<span class="nc-label nc-label--pill">${esc(b)}</span>`).join('\n')}\n</div>\n`
    : ''
  return `<div class="ra-desktop">
<section class="${m.klasse}" data-media-mode="expand"${m.attrs}>
<div class="nc-hero-tom__media" style="--tom-expand: 1;">
<img src="${BILD_SRC}" alt="" decoding="async">
<div class="nc-hero-tom__scrim"></div>
</div>
<div class="nc-hero-tom__content">
<div class="nc-hero-tom__copy">
${badges}<p class="nc-hero-tom__kicker">PIIPE Workplace</p>
<h2 class="nc-hero-tom__headline nc-headline--display">Und alles läuft einfach.</h2>
<div class="nc-hero-tom__subtext">
<p>PIIPE Workplace ist die leistungsstarke, benutzerfreundliche Plattform, die dein Team zum Team macht. Mit intuitiver Navigation. Automatischen Updates. Integrationen, die einfach funktionieren.</p>
</div>
</div>
</div>
</section>
</div>`
}

export const abspielen = {
  hinweis: '',
  gesperrt: nurGsap('Das Aufziehen des Mediums beim Scrollen (--tom-expand)')
}
