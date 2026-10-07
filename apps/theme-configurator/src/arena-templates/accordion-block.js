// Vorlage: accordion-block (07-organisms/_accordion-block.scss) — Plan v3,
// Phase 5. Markup nach neo_fe/templates/block/
// block--block-content--neo-accordion.html.twig:
//   <section class="nc-section nc-accordion-block nc-accordion-block--{ratio}">
//     <div class="nc-container nc-accordion-block__inner">
//       __text (neo_fe:block-header --flush) + __accordion (.nc-accordion)
// Eintraege und Akkordeon-Klassen wie auf der Website
// (data/markup/accordion.html; Vorgaben der Felder: separated, spacious,
// media-top). Seitenbreiter Block: Rahmen ra-desktop.
import { esc } from './_helfer.js'

const CHEVRON = '<span class="nc-accordion__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7.5L10 12.5L15 7.5"></path></svg></span>'

// Fragen und Antworten von der Website (data/markup/accordion.html)
const FAQ = [
  ['Brauchen Mitarbeitende eine Firmen-E-Mail?', 'Nein. Der Zugang läuft wahlweise über Personalnummer oder Einladungscode.'],
  ['Läuft die App auch ohne Internet?', 'Gelesene Inhalte bleiben verfügbar. Neue Beiträge und Kommentare werden übertragen, sobald wieder Verbindung besteht.'],
  ['Wo werden die Daten verarbeitet?', 'In Deutschland, dokumentiert und prüfbar.']
]

const eintrag = (m, i, [frage, antwort]) => `<details class="nc-accordion__item" id="${m.uid}-${i + 1}"${i === 0 ? ' open' : ''}>
<summary class="nc-accordion__trigger">
<span class="nc-accordion__trigger-body">
<span class="nc-accordion__trigger-text">${esc(frage)}</span>
</span>
${CHEVRON}
</summary>
<div class="nc-accordion__content">
<div class="nc-accordion__content-inner">
<div class="nc-accordion__text">${esc(antwort)}</div>
</div>
</div>
</details>`

export default (zelle, m) => {
  const liste = `${m.uid}-liste`
  return `<div class="ra-desktop">
<section class="nc-section ${m.klasse}"${m.attrs}>
<div class="nc-container nc-accordion-block__inner">
<div class="nc-accordion-block__text">
<div class="nc-section-header nc-section-header--flush">
<span class="nc-section-header__label">Häufige Fragen</span>
<h2 class="nc-section-header__title">Was Betriebe vor dem Start wissen wollen</h2>
<p class="nc-section-header__subtitle">Die Antworten auf die Fragen, die in fast jedem Erstgespräch kommen.</p>
</div>
</div>
<div class="nc-accordion-block__accordion">
${m.specimen.render?.alleAuf ? `<button type="button" class="nc-accordion-toggle-all" data-neo-accordion-toggle-all aria-controls="${liste}" aria-expanded="false">
<span data-label-auf>Alle aufklappen</span>
</button>` : ''}
<div class="nc-accordion nc-accordion--separated nc-accordion--spacious nc-accordion--media-top" id="${liste}" data-neo-accordion>
${FAQ.map((f, i) => eintrag(m, i, f)).join('\n')}
</div>
</div>
</div>
</section>
</div>`
}
