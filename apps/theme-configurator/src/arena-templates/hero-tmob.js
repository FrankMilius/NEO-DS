// Vorlage: hero-tmob — Markup aus data/markup/hero-tmob.html.
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<section class="${m.klasse}"${m.attrs}>
<div class="nc-hero-tmob__content">
<div class="nc-hero-tmob__text">
<h2 class="nc-hero-tmob__headline nc-headline--display">Die Zukunft der Zusammenarbeit</h2>
<p class="nc-hero-tmob__subtext">PIIPE Workplace verbindet Teams, Projekte und Wissen in einer einzigen Plattform. Intuitiv, sicher und leistungsstark.</p>
</div>
<div class="nc-hero-tmob__media">
<img src="${BILD_SRC}" alt="Die Zukunft der Zusammenarbeit" decoding="async">
</div>
</div>
</section>
`
