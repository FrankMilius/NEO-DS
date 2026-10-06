// Vorlage: hero-tmob (Text und Medium ueber Grund) — Markup aus
// data/markup/hero-tmob.html (geerntet von der Website). Die Grundfarbe
// setzt Drupal je Block inline (dort #0a0a1a); die Arena nimmt dafuer
// always-dark bzw. bei tone=light background-secondary (Instanzwert, kein
// DS-Modifier). Rahmen ra-desktop: der Block ist fuer die Seitenbreite
// gebaut (min-height 80svh, Medium bis 960 px).
//
// Achsen: tone (light = .nc-hero-tmob--light, dunkle Schrift auf hellem
// Grund), contentWidth (.nc-hero-tmob--cw-*, begrenzt __content).
// Specimens: default, tone, content-width, badges (Badge-Zeile ueber der
// Headline), parallax (render.parallax: der Parallax-Grund liegt im Hero —
// DS-Regel `.nc-hero-tmob .nc-parallax-bg`; Markup wie parallax-bg).
//
// Bewegung: auf der Website faehrt GSAP (neo-theme.js) den Block beim
// Scrollen ein und steuert den Parallax-Grund — das DS hat dafuer keine
// Klassen oder Zustaende. „Abspielen" bleibt mit Grund gesperrt
// (Entscheidungsfall), Zustände zeigt den Endzustand.
import { BILD_SRC, esc } from './_helfer.js'
import { nurGsap } from './_bewegung.js'
import { parallaxFlaeche } from './parallax-bg.js'

const BADGES = ['Neu', 'Version 5']

export default (zelle, m) => {
  const hell = m.wert('tone') === 'light'
  const grund = hell ? 'var(--fnd-color-background-secondary)' : 'var(--fnd-color-always-dark)'
  const badges = m.specimen.render?.badges === true
    ? `<div class="nc-badge-row nc-hero-tmob__badges">\n${BADGES.map((b) => `<span class="nc-label nc-label--pill">${esc(b)}</span>`).join('\n')}\n</div>\n`
    : ''
  const parallax = m.specimen.render?.parallax === true ? parallaxFlaeche({ imHero: true }) + '\n' : ''
  return `<div class="ra-desktop">
<section class="${m.klasse}" style="background-color: ${grund};"${m.attrs}>
${parallax}<div class="nc-hero-tmob__content">
<div class="nc-hero-tmob__text">
${badges}<h2 class="nc-hero-tmob__headline nc-headline--display">Die Zukunft der Zusammenarbeit</h2>
<p class="nc-hero-tmob__subtext">PIIPE Workplace verbindet Teams, Projekte und Wissen in einer einzigen Plattform. Intuitiv, sicher und leistungsstark.</p>
</div>
<div class="nc-hero-tmob__media">
<img src="${BILD_SRC}" alt="Die Zukunft der Zusammenarbeit" decoding="async">
</div>
</div>
</section>
</div>`
}

export const abspielen = {
  hinweis: '',
  gesperrt: nurGsap('Das Einfahren des Blocks und den Parallax-Grund')
}
