// Vorlage: events — Aufbau aus scss/scss/07-organisms/_events.scss (aus dem
// Drupal-Theme aufgenommen; eine Markup-Ernte gibt es nicht): Filterleiste
// mit Suche und Auswahl, Ergebniszahl, Karten-Raster, „Mehr laden". Texte aus
// data/markup/event.html.
import { an } from './_helfer.js'

const LUPE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>'

const EVENTS = [
  ['Konferenz', 'Digital Workplace Summit 2026', '20.05.2026', 'Congresshalle Saarbrücken'],
  ['Konferenz', 'NEO Partner Day 2026', '08.07.2026', 'Saarbrücken'],
  ['Webinar', 'Intranet-Relaunch: Erfahrungsbericht Festo', '15.09.2026', 'Online']
]

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
${an(m, 'filter-bar') ? `<div class="nc-events__filter-bar">
<div class="nc-events__search"><div class="nc-events__search-wrapper">
<span class="nc-events__search-icon">${LUPE}</span>
<input class="nc-events__search-input" type="search" placeholder="Events durchsuchen" aria-label="Events durchsuchen">
</div></div>
<select class="nc-events__filter-select" aria-label="Eventart"><option>Alle Formate</option><option>Konferenz</option><option>Webinar</option></select>
</div>` : ''}
${an(m, 'results-count') ? `<p class="nc-events__results-count">${EVENTS.length} Veranstaltungen</p>` : ''}
<div class="nc-events__grid">
${EVENTS.map(([typ, titel, datum, ort]) => `<a href="#" onclick="return false" class="nc-events__card">
<div class="nc-events__card-header">
${an(m, 'card-type') ? `<span class="nc-events__card-type">${typ}</span>` : ''}
<h3 class="nc-events__card-title">${titel}</h3>
</div>
<div class="nc-events__card-meta"><span class="nc-events__card-meta-item">${datum}</span><span class="nc-events__card-meta-item">${ort}</span></div>
<div class="nc-events__card-footer">Mehr erfahren</div>
</a>`).join('\n')}
</div>
${an(m, 'load-more') ? '<div class="nc-events__load-more"><button type="button" class="nc-button nc-button--outline">Mehr laden</button></div>' : ''}
</div>`
