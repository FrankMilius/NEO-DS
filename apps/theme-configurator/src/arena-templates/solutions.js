// Vorlage: solutions — Aufbau aus _solutions.scss und
// docs/solutions-docs.html: .solutions-wrapper > Mobil-Tableiste (erstes
// Kind: div > ul > li > span, auf dem Desktop ausgeblendet) + .solutions mit
// Seitenpanel (1. Kind, grid-area side), Akkordeon .accordion--solutions
// (details .accordion-item mit h2, Kurztext, .accordion-item-content und
// .accordion-progress) und Inhaltspanel (letztes Kind, grid-area content).
// Plan v3, Phase 4:
//   - Die Mobil-Tableiste stand vorher nicht im Markup — dann war .solutions
//     das erste Kind des Wrappers und auf dem Desktop display:none (leere
//     Zelle). Jetzt wie im SCSS vorgesehen.
//   - Rahmen ra-desktop: das 6/1/5-Raster greift erst ab desktop-up (Fenster),
//     der Block ist fuer die Seitenbreite gebaut.
// Zustaende: default = erste Loesung offen (Startzustand, Fortschritt aktiv),
// open = eine andere Loesung geoeffnet (die zweite) — es ist immer genau
// eine offen, wie auf der Website.
import { BILD_SRC } from './_helfer.js'

const LOESUNGEN = [
  ['Interne Kommunikation', 'Alle erreichen — vom Büro bis zur Werkhalle.'],
  ['Wissensmanagement', 'Wissen finden statt suchen.'],
  ['Zusammenarbeit', 'Teams und Projekte an einem Ort.']
]

export default (zelle, m) => {
  const aktiv = m.hat('open') ? 1 : 0
  return `<div class="ra-desktop">
<div class="solutions-wrapper">
<div><ul>${LOESUNGEN.map(([titel], i) => `<li${i === aktiv ? ' class="selected"' : ''}><span>${titel}</span></li>`).join('')}</ul></div>
<div class="${m.klasse}"${m.attrsOhne('data-state')}>
<div><div>
<h3>${LOESUNGEN[aktiv][0]}</h3>
<p>News, Kampagnen und Umfragen erreichen alle Mitarbeitenden — mit Lesebestätigung, wo es darauf ankommt.</p>
<div class="labels-container"><span class="nc-label nc-label--pill label"><span class="nc-label__text">Mitarbeiter-App</span></span></div>
<p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>Mehr erfahren</span></a></p>
</div></div>
<div class="accordion accordion--solutions">
${LOESUNGEN.map(([titel, text], i) => `<details class="accordion-item"${i === aktiv ? ' open' : ''}>
<summary class="accordion-item-summary"><span class="accordion-item-summary-icon" aria-hidden="true"></span><span class="nc-sr-only">${titel}</span></summary>
<h2>${titel}</h2>
<p>${text}</p>
<div class="accordion-item-content"><p>${text}</p></div>
<div class="accordion-progress${i === aktiv ? ' active' : ''}"></div>
</details>`).join('\n')}
</div>
<div><div><picture><img src="${BILD_SRC}" alt=""></picture></div></div>
</div>
</div>
</div>`
}
