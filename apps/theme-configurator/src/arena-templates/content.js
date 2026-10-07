// Vorlage: content (04-objects/_content.scss) — Plan v3, Phase 5. Markup nach
// neo_fe/templates/content/node.html.twig (Vollansicht): <article
// class="node … nc-content"> mit __title (nur eingebettet, `label and not
// page`), __meta (display_submitted) und __body mit dem Body-Feld (.nc-prose,
// field--body.html.twig). Rahmen ra-desktop: die Lesespalte (72ch) zeigt sich
// erst neben dem weiten Rahmen (xwide 1536 px).

import { slotAn } from './_bloecke-1.js'

export default (zelle, m) => `<div class="ra-desktop">
<article class="${m.klasse}"${m.attrs}>
${slotAn(m, 'title') ? '<h2 class="nc-content__title"><a href="#" onclick="return false" rel="bookmark">Intranet-Relaunch: Erfahrungsbericht Festo</a></h2>' : ''}
${slotAn(m, 'meta') ? '<div class="nc-content__meta"><span>Redaktion — 15.09.2026</span></div>' : ''}
${slotAn(m, 'body') ? `<div class="nc-content__body">
<div class="nc-prose">
<p>Wie migriert man 20.000 Mitarbeitende weltweit auf eine neue Plattform, ohne dass der Betrieb stockt? Festo hat es in drei Wellen gemacht — mit einem festen Kern aus Redaktion, IT und Betriebsrat.</p>
<h2>Die erste Welle</h2>
<p>Begonnen wurde mit den Standorten, an denen die meisten Beschäftigten ohne eigenen Rechner arbeiten. Dort entscheidet sich, ob eine Mitarbeiter-App angenommen wird.</p>
</div>
</div>` : ''}
</article>
</div>`
