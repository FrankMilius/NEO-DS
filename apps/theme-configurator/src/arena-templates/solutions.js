// Vorlage: solutions — Aufbau aus _solutions.scss und
// docs/solutions-docs.html: .solutions-wrapper > .solutions mit Seitenpanel
// (1. Kind, grid-area side), Akkordeon .accordion--solutions (details
// .accordion-item mit h2, Kurztext, .accordion-item-content und
// .accordion-progress) und Inhaltspanel (letztes Kind, grid-area content).
// Das erste Item ist geoeffnet (Fortschritt aktiv); Zustand open oeffnet
// zusaetzlich das zweite.
import { BILD_SRC } from './_helfer.js'

const LOESUNGEN = [
  ['Interne Kommunikation', 'Alle erreichen — vom Büro bis zur Werkhalle.'],
  ['Wissensmanagement', 'Wissen finden statt suchen.'],
  ['Zusammenarbeit', 'Teams und Projekte an einem Ort.']
]

export default (zelle, m) => {
  const offen = (i) => i === 0 || (i === 1 && m.hat('open'))
  return `
<div class="solutions-wrapper">
<div class="${m.klasse}"${m.attrsOhne('data-state')}>
<div><div>
<h3>Interne Kommunikation</h3>
<p>News, Kampagnen und Umfragen erreichen alle Mitarbeitenden — mit Lesebestätigung, wo es darauf ankommt.</p>
<div class="labels-container"><span class="nc-label nc-label--pill label"><span class="nc-label__text">Mitarbeiter-App</span></span></div>
<p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>Mehr erfahren</span></a></p>
</div></div>
<div class="accordion accordion--solutions">
${LOESUNGEN.map(([titel, text], i) => `<details class="accordion-item"${offen(i) ? ' open' : ''}>
<summary class="accordion-item-summary"><span class="accordion-item-summary-icon" aria-hidden="true"></span><span class="nc-sr-only">${titel}</span></summary>
<h2>${titel}</h2>
<p>${text}</p>
<div class="accordion-item-content"><p>${text}</p></div>
<div class="accordion-progress${i === 0 ? ' active' : ''}"></div>
</details>`).join('\n')}
</div>
<div><div><picture><img src="${BILD_SRC}" alt="" loading="lazy" style="width: 100%; height: auto; display: block;"></picture></div></div>
</div>
</div>`
}
