// Vorlage: block-bundle (07-organisms/_block-bundle.scss) — Plan v3, Phase 5.
// Markup nach neo_fe/templates/block/block--block-content--neo-block-bundle
// .html.twig: <section class="nc-section nc-block-bundle"> mit optionalem
// Kopf (.nc-container.nc-block-bundle__header: neo_fe:block-header --flush,
// Text mit .u-prose) und den gebuendelten Bloecken in __items. Die
// Kind-Bloecke rendern in Drupal ihr eigenes Template — hier Platzhalter
// (Arena-Inhalt), sie haben eigene Recipes. Rahmen ra-desktop.
import { slotAn } from './_bloecke-1.js'
import { platzhalter } from './_layout.js'

export default (zelle, m) => `<div class="ra-desktop">
<section class="nc-section ${m.klasse}"${m.attrs}>
${slotAn(m, 'header') ? `<div class="nc-container nc-block-bundle__header">
<div class="nc-section-header nc-section-header--flush">
<span class="nc-section-header__label">Für Betriebe</span>
<h2 class="nc-section-header__title">Alles für den Start an einem Ort</h2>
<p class="nc-section-header__subtitle">Editionen, Einführung und Betrieb — zusammengestellt aus den Bausteinen der Website.</p>
</div>
${slotAn(m, 'text') ? '<div class="nc-block-bundle__text u-prose"><p>Die folgenden Abschnitte bündeln, was Sie für die Entscheidung brauchen. Jeder Abschnitt steht auch für sich allein.</p></div>' : ''}
</div>` : ''}
<div class="nc-block-bundle__items">
${platzhalter('Gebündelter Block 1 (eigenes Template, z. B. text-media)', 'ra-platzhalter--hoch')}
${platzhalter('Gebündelter Block 2 (eigenes Template, z. B. card-grid)', 'ra-platzhalter--hoch')}
</div>
</section>
</div>`
