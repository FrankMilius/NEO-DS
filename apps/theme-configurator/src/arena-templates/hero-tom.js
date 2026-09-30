// Vorlage: hero-tom — Markup aus data/markup/hero-tom.html. Die Expand-
// Animation beim Scrollen setzt die Website per JS (--tom-expand); die Arena
// zeigt den ausgefahrenen Endzustand.
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<section class="${m.klasse}" data-media-mode="expand"${m.attrs}>
<div class="nc-hero-tom__media" style="--tom-expand: 1;">
<img src="${BILD_SRC}" alt="" decoding="async">
<div class="nc-hero-tom__scrim"></div>
</div>
<div class="nc-hero-tom__content">
<div class="nc-hero-tom__copy">
<p class="nc-hero-tom__kicker">PIIPE Workplace</p>
<h2 class="nc-hero-tom__headline nc-headline--display">Und alles läuft einfach.</h2>
<div class="nc-hero-tom__subtext">
<p>PIIPE Workplace ist die leistungsstarke, benutzerfreundliche Plattform, die dein Team zum Team macht. Mit intuitiver Navigation. Automatischen Updates. Integrationen, die einfach funktionieren.</p>
</div>
</div>
</div>
</section>
`
