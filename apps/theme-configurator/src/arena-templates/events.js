// Vorlage: events — abgeglichen mit dem Drupal-Theme (neo_fe):
// block--block-content--neo-events-listing.html.twig (Filterleiste, Zahl,
// Raster, Leerzustand, „Mehr laden") und createCard() in js/neo-theme.js
// (Karten kommen dort per JS aus /api/events). Die Wurzel .nc-events ist die
// Recipe-Wurzel; Drupal haengt die Bereiche direkt in .nc-container.
// Slots per render.slotConfig des Specimens; render.leer zeigt den
// Leerzustand (0 Treffer: .nc-events__empty statt Raster und „Mehr laden";
// Text wie im Template, als <p>) — Plan v3, Phase 4. Auf der Website stehen
// Leerzustand und „Mehr laden" immer im Markup und werden per hidden
// geschaltet; die Arena laesst den jeweils versteckten Teil weg.
import { slotAn as an, vorgabe, desktop } from './_bloecke-1.js'

const LUPE = '<svg class="nc-events__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path></svg>'
const KALENDER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
const UHR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
const PFEIL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'

const EVENTS = [
  ['Konferenz', 'Digital Workplace Summit 2026', '20.05.2026', '09:30 – 17:00 Uhr', 'Vor Ort'],
  ['Partnertag', 'NEO Partner Day 2026', '08.07.2026', '10:00 – 16:00 Uhr', 'Hybrid'],
  ['Webinar', 'Intranet-Relaunch: Erfahrungsbericht Festo', '15.09.2026', '11:00 – 12:00 Uhr', 'Online']
]

const vorlage = (zelle, m) => {
  const leer = vorgabe(m, 'leer', false)
  return `
<div class="${m.klasse}"${m.attrs}>
${an(m, 'filter-bar') ? `<div class="nc-events__filter-bar">
<div class="nc-events__search"><div class="nc-events__search-wrapper">
${LUPE}
<input type="search" class="nc-events__search-input" placeholder="Events durchsuchen…" aria-label="Events durchsuchen">
</div></div>
<select class="nc-events__filter-select" aria-label="Event-Typ"><option value="">Alle Event-Typen</option></select>
<select class="nc-events__filter-select" aria-label="Kategorie"><option value="">Alle Kategorien</option></select>
<select class="nc-events__filter-select" aria-label="Jahr"><option value="">Alle Jahre</option></select>
</div>` : ''}
${an(m, 'results-count') ? `<div class="nc-events__results-count">${leer ? 0 : EVENTS.length} Events gefunden</div>` : ''}
${leer ? '<div class="nc-events__empty"><p>Keine Events gefunden. Versuchen Sie andere Filtereinstellungen.</p></div>' : `<div class="nc-events__grid">
${EVENTS.map(([typ, titel, datum, zeit, ort]) => `<a href="#" onclick="return false" class="nc-events__card">
<div class="nc-events__card-header">
${an(m, 'card-type') ? `<span class="nc-events__card-type">${typ}</span>` : ''}
<h3 class="nc-events__card-title">${titel}</h3>
<div class="nc-events__card-meta"><span class="nc-events__card-meta-item">${KALENDER}${datum}</span><span class="nc-events__card-meta-item">${UHR}${zeit}</span><span class="nc-events__card-meta-item">${ort}</span></div>
</div>
<div class="nc-events__card-footer"><span>Mehr erfahren</span>${PFEIL}</div>
</a>`).join('\n')}
</div>`}
${!leer && an(m, 'load-more') ? '<div class="nc-events__load-more"><button type="button" class="nc-button nc-button--secondary"><span>Mehr laden</span></button></div>' : ''}
</div>`
}

// Rahmen ra-desktop: fuer die Seitenbreite gebaut (Plan v3, Phase 4)
export default (zelle, m) => desktop(vorlage(zelle, m))
