// Vorlage: tooltip — Markup aus data/markup/tooltip.html (vereinfacht: ein
// nc-button statt des Tabs als Ausloeser) und den Recipe-domNotes:
//   span.nc-tooltip[.nc-tooltip--<position>]
//     <Ausloeser> aria-describedby="<id des Inhalts>"
//     span.nc-tooltip__content  role="tooltip" id
//       span.nc-tooltip__arrow (dekorativ, aria-hidden)
// Ein- und Ausblenden macht das CSS (:hover/:focus-within, 300 ms
// Verzoegerung); neo-behaviors (tooltip.js) ergaenzt Escape (WCAG 1.4.13).
//
// Achsen: position per Modifier an der Wurzel (top = Standard ohne Modifier).
// Zustaende: visible — „Zustände" zeigt den Tooltip fest sichtbar ueber die
//   DS-Klasse .is-open an der Wurzel (Entscheidung 02.10.2026); default
//   zeigt den verborgenen Ruhezustand. „Ausprobieren": nie fest sichtbar —
//   Maus darueber oder Tab, Escape blendet aus.
// Specimens: all-positions, default-hidden, with-arrow (__arrow),
//   long-content, hover-intent, hoverable-content, on-disabled-trigger
//   (deaktivierter Knopf in <span tabindex="0">, domNotes).
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'

const TEXT = {
  standard: 'Änderungen speichern',
  lang: 'Speichert alle Änderungen dieser Seite als Entwurf. Veröffentlicht wird erst nach der Freigabe durch die Redaktion.',
  'tooltip-hover-intent': 'Erscheint erst nach 300 ms Verweilen',
  'tooltip-hoverable': 'Mit der Maus erreichbar: Text markieren und kopieren',
  'tooltip-disabled-trigger': 'Erst nach der Freigabe möglich'
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const lang = m.specimen.render?.contentHint === 'long-text'
  const text = lang ? TEXT.lang : TEXT[art] || TEXT.standard
  const pfeil = m.specimen.id === 'with-arrow' || m.slot('arrow')
  const sichtbar = m.hat('visible') && !m.ausprobieren
  const lage = m.wert('position') || 'top'
  const id = `${m.uid}-tipp`

  const ausloeser = art === 'tooltip-disabled-trigger'
    ? `<span tabindex="0" aria-describedby="${id}"><button type="button" class="nc-button nc-button--secondary nc-button--sm" disabled>Veröffentlichen</button></span>`
    : `<button type="button" class="nc-button nc-button--secondary nc-button--sm" aria-describedby="${id}">Speichern</button>`

  const anker = ['ra-anker', 'ra-anker--zentriert', 'ra-anker--mitte',
    lang ? '' : 'ra-anker--flach',
    lage === 'left' || lage === 'right' ? 'ra-anker--breit' : ''].filter(Boolean).join(' ')

  return `<div class="${anker}">
<span class="${wurzelKlassen(m, sichtbar ? ['is-open'] : [])}">
${ausloeser}
<span class="nc-tooltip__content" role="tooltip" id="${id}">${esc(text)}${pfeil ? '<span class="nc-tooltip__arrow" aria-hidden="true"></span>' : ''}</span>
</span>
</div>`
}
