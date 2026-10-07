// Vorlage: home-basic (08-templates/_home-basic.scss, .t-home-basic) — Plan
// v3, Phase 5. Markup aus der Doku (docs/content/template-home-basic.html);
// die Doku nutzt den alten Namen .home-basic, das SCSS bedient beide — hier
// die Template-Klassen (&-title -> .t-home-basic-title). Im SCSS als
// DEPRECATED markiert (Nachfolger: Shell-Preset data-layout="landing").
// Das Raster (7/5 Spalten) greift ab desktop-up: Rahmen ra-desktop.
import { slotAn } from './_bloecke-1.js'
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `<div class="ra-desktop">
<section class="${m.klasse}"${m.attrs} aria-labelledby="${m.uid}-titel">
<h2 class="t-home-basic-title" id="${m.uid}-titel">Unsere <em>Produkte</em> auf einen Blick.</h2>
${slotAn(m, 'link') ? '<div class="t-home-basic-link"><a href="#" onclick="return false" class="nc-button nc-button--ghost nc-button--sm">Alle ansehen</a></div>' : ''}
${slotAn(m, 'body') ? `<div class="t-home-basic-body">
<p>Intranet, Mitarbeiter-App und Wissensdatenbank — auf einer Plattform, in Deutschland betrieben.</p>
<div class="button-container"><a href="#" onclick="return false" class="nc-button">Kontakt</a></div>
</div>` : ''}
${slotAn(m, 'media') ? `<div class="t-home-basic-media"><img src="${BILD_SRC}" alt="Produktbeschreibung" width="320" height="240"></div>` : ''}
</section>
</div>`
