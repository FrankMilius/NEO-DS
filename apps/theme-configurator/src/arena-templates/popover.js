// Vorlage: popover — Markup aus data/markup/popover.html (Struktur nach SCSS
// und Recipe, 02.10.2026):
//   div.nc-popover[.nc-popover--hover-trigger]
//     button.nc-popover__trigger.nc-button.nc-button--sm  aria-haspopup="dialog"
//       aria-expanded aria-controls
//     div.nc-popover__panel[.nc-popover__panel--<placement>]  role="dialog"
//       aria-labelledby (Titel im Header) bzw. aria-label
//       div.nc-popover__arrow (aria-hidden) / __header (Titel + __close) /
//       __body / __footer
// Das Verhalten (Umschalten, Fokus ins Panel, Fokus-Falle, Escape, Light
// Dismiss, Hover-Modus) kommt aus neo-behaviors (popover.js).
//
// Achsen:
//   placement  Modifier am PANEL (bottom ohne Modifier = Standard des SCSS)
//   content    body-only, with-header (+ __close), with-footer, full,
//              with-arrow (__arrow), form (Formularfelder im Body: kein
//              Light Dismiss, Fokus aufs erste Feld)
//   trigger    hover: nc-popover--hover-trigger, Panel OHNE [hidden]
//              (Recipe-domNotes: ohne JS oeffnet es per CSS)
// Zustaende: das Recipe kennt nur default. „Zustände" zeigt das Panel offen
//   (aria-expanded="true"), „Ausprobieren" geschlossen ([hidden]).
// Specimens: default, placement-variants, content-variants, with-arrow,
//   full-popover, alignment-variants, inline-filter (composes form-field,
//   button), light-dismiss, overlay-hierarchy (Inhalt erklaert den Fall).
import { esc } from './_helfer.js'
import { offen, wurzelKlassen, kindModifier, schliessen } from './_overlay.js'

const TEXT = {
  'popover-light-dismiss': 'Klick außerhalb schließt das Popover.',
  'popover-overlay-hierarchy': 'Ebene 2: über Dropdown, unter Modal.'
}
const STANDARD = 'Benachrichtigungen und Sichtbarkeit für diesen Bereich.'

function formular (m) {
  const feld = (name, typ, platzhalter) => `<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-${name}"><span class="nc-form-label__text">${esc(platzhalter)}</span></label>
<input class="nc-input nc-input--sm" type="${typ}" id="${m.uid}-${name}" name="${name}">
</div>`
  return `<div class="ra-stapel">${feld('von', 'date', 'Von')}${feld('bis', 'date', 'Bis')}</div>`
}

export default (zelle, m) => {
  const auf = offen(m)
  const content = m.wert('content') || 'body-only'
  const hover = m.wert('trigger') === 'hover'
  const lage = m.wert('placement') || 'bottom'
  const kopf = ['with-header', 'full', 'form'].includes(content) || m.slot('header')
  const fuss = ['with-footer', 'full', 'form'].includes(content) || m.slot('footer')
  const pfeil = content === 'with-arrow' || m.slot('arrow')
  const istFormular = content === 'form'
  const titel = istFormular ? 'Zeitraum filtern' : 'Einstellungen'
  const titelId = `${m.uid}-titel`

  const panelKlasse = ['nc-popover__panel', ...kindModifier(m, 'nc-popover__panel--')].join(' ')
  const name = kopf ? ` aria-labelledby="${titelId}"` : ` aria-label="${titel}"`
  // Hover-Modus: Panel ohne [hidden] (CSS-Rueckfall), sonst geschlossen per [hidden]
  const verborgen = auf || hover ? '' : ' hidden'

  const teile = []
  if (pfeil) teile.push('<div class="nc-popover__arrow" aria-hidden="true"></div>')
  if (kopf) teile.push(`<div class="nc-popover__header"><span id="${titelId}">${titel}</span>${schliessen('nc-popover__close')}</div>`)
  teile.push(`<div class="nc-popover__body">${istFormular ? formular(m) : `<p>${esc(TEXT[m.specimen.render?.compositionType] || STANDARD)}</p>`}</div>`)
  if (fuss) {
    teile.push(istFormular
      ? '<div class="nc-popover__footer"><button type="button" class="nc-button nc-button--ghost nc-button--sm">Zurücksetzen</button><button type="button" class="nc-button nc-button--sm">Anwenden</button></div>'
      : '<div class="nc-popover__footer"><button type="button" class="nc-button nc-button--sm">Speichern</button></div>')
  }

  // Platz fuer das Panel: unten Standard, oben/links/rechts je nach Lage
  const anker = ['ra-anker',
    lage === 'top' ? 'ra-anker--oben' : '',
    lage === 'left' || lage === 'right' ? 'ra-anker--zentriert ra-anker--sehr-breit' : 'ra-anker--breit',
    lage === 'bottom' || lage === 'top' || lage === 'left' || lage === 'right' ? 'ra-anker--mitte' : '',
    lage === 'bottom-end' ? 'ra-anker--ende' : '',
    istFormular || content === 'full' || content === 'with-footer' ? 'ra-anker--hoch' : ''
  ].filter(Boolean).join(' ')

  return `<div class="${anker}">
<div class="${wurzelKlassen(m)}">
<button type="button" class="nc-popover__trigger nc-button nc-button--sm" aria-haspopup="dialog" aria-expanded="${auf}" aria-controls="${m.uid}-panel">${istFormular ? 'Filter' : 'Einstellungen'}</button>
<div class="${panelKlasse}" id="${m.uid}-panel" role="dialog"${name}${verborgen}>
${teile.join('\n')}
</div>
</div>
</div>`
}
