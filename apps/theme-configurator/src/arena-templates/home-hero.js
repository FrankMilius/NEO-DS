// Vorlage: home-hero (08-templates/_home-hero.scss, .t-home-hero) — Plan v3,
// Phase 5. Markup aus der Doku (docs/content/template-home-hero.html): h1,
// Intro und der Sprunglink p.skip-button. Gestaltet ueber Element-Selektoren
// und die Zustandsklassen der frueheren Zeichen-Animation (.show, .animate,
// .char …), deren JS es im DS nicht mehr gibt — die Arena zeigt den
// statischen Zustand, keine Taste „Abspielen". Im SCSS als DEPRECATED
// markiert (Nachfolger: Shell-Preset data-layout="landing"). Rahmen ra-desktop.

import { slotAn } from './_bloecke-1.js'

export default (zelle, m) => `<div class="ra-desktop">
<section class="${m.klasse}"${m.attrs} aria-label="Einleitung">
<h1>${m.specimen.render?.hervorhebung ? 'Das Intranet, <em>das gelesen wird.</em>' : 'Das Intranet, das gelesen wird.'}</h1>
<p>Für Büro, Werkhalle und unterwegs — eine Plattform für alle Beschäftigten.</p>
${slotAn(m, 'skip-button') ? `<p class="skip-button"><a href="#${m.uid}-inhalt">Zum Inhalt springen</a></p>` : ''}
</section>
<div id="${m.uid}-inhalt"></div>
</div>`
