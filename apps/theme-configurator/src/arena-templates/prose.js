// Vorlage: prose (04-objects/_prose.scss) — Plan v3, Phase 5. Markup nach
// neo_fe/templates/field/field--body.html.twig: das Body-Feld liegt in
// <div class="nc-prose [nc-prose--left]">, Medien brechen per
// data-bleed="content|wide|full" aus der Lesespalte aus (gefilterte
// Body-HTML). Die Stufen greifen erst auf Seitenbreite: Rahmen ra-massstab
// (Desktop-Seite 1600 px, Massstab 1:2,7).
import { BILD_SRC } from './_helfer.js'

const figur = (stufe, text) => `<figure data-bleed="${stufe}">
<img src="${BILD_SRC}" alt="" width="1600" height="900">
<figcaption>${text}</figcaption>
</figure>`

export default (zelle, m) => `<div class="ra-massstab">
<div class="${m.klasse}"${m.attrs}>
<h2>Die erste Welle</h2>
<p>Begonnen wurde mit den Standorten, an denen die meisten Beschäftigten ohne eigenen Rechner arbeiten. Dort entscheidet sich, ob eine Mitarbeiter-App angenommen wird — und dort zeigt sich, ob die Lesespalte trägt.</p>
${figur('content', 'data-bleed="content" — bis zur Content-Breite (1090 px)')}
<p>Jedes direkte Kind steht in der Prosa-Spalte; nur ausgewiesene Medien brechen aus.</p>
${figur('wide', 'data-bleed="wide" — bis zur Wide-Breite (1290 px)')}
${figur('full', 'data-bleed="full" — volle Breite, gekappt auf xwide (1536 px)')}
</div>
</div>`
