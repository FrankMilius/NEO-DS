// Vorlage: toolbar — Markup aus data/markup/toolbar.html und der STRUKTUR in
// scss/scss/07-organisms/_toolbar.scss:
//   div.nc-toolbar  role="toolbar" aria-label (+ Modifier, .is-scrolled)
//     div.nc-toolbar__group > button.nc-button … (Komposition: enthaelt button)
//     div.nc-toolbar__separator  aria-hidden (Recipe: dekorativ)
//     div.nc-toolbar__spacer
//     span.nc-toolbar__label  (in einer Gruppe)
//     div.nc-toolbar__group.nc-toolbar__group--end
//
// Achsen: variant, density, alignment, sticky — Modifier an der Wurzel;
// content waehlt die Slots (buttons-only, with-separator, with-spacer,
// with-label, full). Zustand scrolled: .is-scrolled (setzt in Drupal das
// Scroll-Skript). Die Leiste braucht Breite, damit Ausrichtung und Spacer
// sichtbar werden: ra-feld--breit bzw. --sehr-breit.
// Kompositionen (Specimen composes): floating-editor und editor-toolbar mit
// Toggle-Groups (Markup wie src/arena-templates/toggle-group.js),
// table-toolbar mit Suche (Markup wie data/markup/search.html).
// blurred: auf einem Arena-Grund (ra-kulisse), sonst ist nichts zu
// verwischen.
//
// Verhalten: das Recipe fordert roving tabindex (constraints, a11y.note),
// gibt aber keine keyboard/events vor, neo-behaviors hat keins. Ohne
// Verhalten blieben Knoepfe mit tabindex="-1" unerreichbar — die Arena laesst
// deshalb alle Knoepfe in der Tab-Folge (offene Entscheidung im Bericht).
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'

const SVG = (inhalt) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inhalt}</svg>`
const TG = (inhalt) => `<span class="nc-toggle-group__icon">${SVG(inhalt)}</span>`

const knopf = (text, art = 'secondary') => `<button type="button" class="nc-button nc-button--sm nc-button--${art}">${esc(text)}</button>`
const gruppe = (inhalt, ende = false) => `<div class="nc-toolbar__group${ende ? ' nc-toolbar__group--end' : ''}">\n${inhalt}\n</div>`
const TRENNER = '<div class="nc-toolbar__separator" aria-hidden="true"></div>'
const LUECKE = '<div class="nc-toolbar__spacer"></div>'
const label = (text) => `<span class="nc-toolbar__label">${esc(text)}</span>`

const FORMAT = [
  ['Fett', TG('<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>')],
  ['Kursiv', TG('<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>')],
  ['Unterstrichen', TG('<path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>')]
]
const AUSRICHTUNG = [
  ['Linksbündig', TG('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>')],
  ['Zentriert', TG('<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>')],
  ['Rechtsbündig', TG('<line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>')]
]
const WERKZEUGE = [
  ['Auswählen', SVG('<path d="m4 4 7 16 2-7 7-2z"/>')],
  ['Rechteck', SVG('<rect x="4" y="5" width="16" height="14" rx="2"/>')],
  ['Text', SVG('<path d="M5 6V4h14v2M12 4v16M9 20h6"/>')]
]

/** Formatierung: Mehrfachauswahl mit aria-pressed (toggle-group, type=multiple). */
const format = () => `<div class="nc-toggle-group" role="group" aria-label="Textformat">
${FORMAT.map(([t, s], i) => `<button type="button" class="nc-toggle-group__item" aria-pressed="${i === 0}" aria-label="${t}">${s}</button>`).join('\n')}
</div>`

/** Einzelauswahl mit role="radio" (toggle-group, type=single). */
const einzeln = (liste, name) => `<div class="nc-toggle-group" role="radiogroup" aria-label="${name}">
${liste.map(([t, s], i) => `<button type="button" class="nc-toggle-group__item" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-label="${t}">${s}</button>`).join('\n')}
</div>`

const SUCHE = `<div class="nc-search">
<div class="nc-search__input-wrapper">
<span class="nc-search__icon" aria-hidden="true">${SVG('<circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15" y2="15"/>')}</span>
<input class="nc-input nc-search__input" type="search" placeholder="Einträge durchsuchen" aria-label="Einträge durchsuchen">
</div>
</div>`

function inhalt (m) {
  const art = m.specimen.render?.compositionType
  if (art === 'toolbar-floating') {
    return [gruppe(einzeln(WERKZEUGE, 'Werkzeug')), TRENNER, gruppe(format()), TRENNER, gruppe(knopf('Rückgängig', 'ghost'))].join('\n')
  }
  if (art === 'toolbar-editor') {
    return [gruppe(format()), TRENNER, gruppe(einzeln(AUSRICHTUNG, 'Ausrichtung')), TRENNER, gruppe(`${knopf('Link', 'ghost')}\n${knopf('Bild', 'ghost')}`)].join('\n')
  }
  if (art === 'toolbar-table') {
    return [gruppe(label('3 ausgewählt')), TRENNER, gruppe(`${knopf('Filter')}\n${SUCHE}`), LUECKE, gruppe(`${knopf('Exportieren')}\n${knopf('Löschen', 'primary')}`)].join('\n')
  }
  const content = m.wert('content') || 'buttons-only'
  const bearbeiten = gruppe(`${knopf('Neu', 'primary')}\n${knopf('Bearbeiten')}`)
  const ablage = gruppe(`${knopf('Exportieren')}\n${knopf('Archivieren')}`)
  const ende = gruppe(knopf('Alle löschen', 'ghost'), true)
  switch (content) {
    case 'with-separator': return [bearbeiten, TRENNER, ablage].join('\n')
    case 'with-spacer': return [bearbeiten, LUECKE, ablage].join('\n')
    case 'with-label': return [gruppe(label('Ansicht:')), ablage].join('\n')
    case 'full': return [gruppe(label('3 ausgewählt')), TRENNER, ablage, LUECKE, ende].join('\n')
    default: return [bearbeiten, ablage].join('\n')
  }
}

const NAMEN = {
  'toolbar-floating': 'Zeichenwerkzeuge',
  'toolbar-editor': 'Textformatierung',
  'toolbar-table': 'Tabellen-Aktionen'
}

export default (zelle, m) => {
  const klassen = [wurzelKlassen(m), m.hat('scrolled') ? 'is-scrolled' : ''].filter(Boolean).join(' ')
  const name = NAMEN[m.specimen.render?.compositionType] || 'Aktionen'
  const leiste = `<div class="${klassen}" role="toolbar" aria-label="${name}">
${inhalt(m)}
</div>`
  const breit = m.specimen.render?.compositionType === 'toolbar-table' ? 'ra-feld--sehr-breit' : 'ra-feld--breit'
  const feld = `<div class="ra-feld ${breit}">\n${leiste}\n</div>`
  return m.wert('variant') === 'blurred' ? `<div class="ra-kulisse">\n${feld}\n</div>` : feld
}
