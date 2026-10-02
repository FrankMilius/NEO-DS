// Vorlage: rating — Markup aus data/markup/rating.html und den Mustern aus
// scss/scss/05-atoms/_rating.scss:
//   mode=readonly     role="img" mit __item/__item--active/__item--half
//   mode=interactive  role="radiogroup": versteckter Null-Radio
//                     (__input--clear) und je Stern <input class="nc-rating__input">
//                     + <label class="nc-rating__item"> — echte Radios, per
//                     Tastatur und Maus waehlbar. Das Einfaerben bis zum
//                     gewaehlten Stern (__item--active) setzt im DS das JS;
//                     die Vorlage zeigt den Startwert 3.
// Der Versatz der Hover-Kaskade kommt ueber --nc-rating-item-index je Stern
// (so im DS vorgesehen).
//
// Achsen: size/mode/display/sentiment per Modifier; display steuert Wert
// (__value) und Anzahl (__count); iconType waehlt das Symbol (data-icon).
// Zustaende: disabled nativ + nc-rating--disabled; hover/focus/active nur
// echt (active = Bounce beim Waehlen). error-state setzt nc-rating--error,
// clear-reset zeigt den Reset-Knopf, half-stars und sentiment-scale stellen
// mehrere Werte untereinander.
import { esc, klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const PFAD = {
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  thumb: '<path d="M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h5.7a2 2 0 0 1 2 2.3l-1.4 8a2 2 0 0 1-2 1.7H7"/>',
  // Augen und Mund als Aussparung (evenodd) — keine eigenen Farben im Symbol
  smiley: '<path fill-rule="evenodd" stroke="none" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 8.25a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM7.5 13.5h9a4.5 4.5 0 0 1-9 0z"/>'
}
const NAME = { star: 'Sternen', heart: 'Herzen', thumb: 'Daumen', smiley: 'Smileys' }

const symbol = (typ) => `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">${PFAD[typ] || PFAD.star}</svg>`
const KREUZ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'

function stimmung (wert) {
  if (wert <= 2) return 'nc-rating--sentiment-low'
  if (wert < 4) return 'nc-rating--sentiment-mid'
  return 'nc-rating--sentiment-high'
}

function zusatz (m, wert) {
  const display = m.wert('display') || 'stars-only'
  const mitWert = display !== 'stars-only' || m.slot('value')
  const zahl = String(wert.toFixed(1)).replace('.', ',')
  return (mitWert ? `<span class="nc-rating__value">${zahl}</span>` : '') +
    (display === 'with-count' || m.slot('count') ? '<span class="nc-rating__count">(128 Bewertungen)</span>' : '')
}

function anzeige (m, wert, extra = []) {
  const typ = m.wert('iconType') || 'star'
  const klasse = [klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN), ...extra].join(' ')
  const sterne = [1, 2, 3, 4, 5].map((i) => {
    if (wert >= i) return `<span class="nc-rating__item nc-rating__item--active">${symbol(typ)}</span>`
    if (wert > i - 1) return `<span class="nc-rating__item nc-rating__item--half">${symbol(typ)}${symbol(typ)}</span>`
    return `<span class="nc-rating__item">${symbol(typ)}</span>`
  }).join('')
  const text = `Bewertung: ${String(wert).replace('.', ',')} von 5 ${NAME[typ] || NAME.star}`
  return `<div class="${klasse}" role="img" aria-label="${esc(text)}" data-icon="${typ}" data-rating-value="${wert}"${m.attrsOhne(...NATIVE_ARIA)}>${sterne}${zusatz(m, wert)}</div>`
}

function auswahl (m, wert, extra = []) {
  const typ = m.wert('iconType') || 'star'
  const name = m.uid
  const aus = m.deaktiviert ? ' disabled' : ''
  const klasse = [klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN), ...extra].join(' ')
  const sterne = [1, 2, 3, 4, 5].map((i) => `<input class="nc-rating__input" type="radio" name="${name}" value="${i}" id="${name}-${i}" aria-label="${i} von 5"${i === wert ? ' checked' : ''}${aus}><label class="nc-rating__item${i <= wert ? ' nc-rating__item--active' : ''}" for="${name}-${i}" style="--nc-rating-item-index: ${i - 1}">${symbol(typ)}</label>`).join('')
  const reset = m.specimen.render?.compositionType === 'rating-clear'
    ? `<button type="button" class="nc-rating__clear" aria-label="Bewertung zurücksetzen"${aus}>${KREUZ}</button>`
    : ''
  return `<div class="${klasse}" role="radiogroup" aria-label="Bewertung" data-icon="${typ}"${m.attrsOhne(...NATIVE_ARIA)}>
<input class="nc-rating__input nc-rating__input--clear" type="radio" name="${name}" value="0" id="${name}-0" aria-label="Keine Bewertung"${wert ? '' : ' checked'}${aus}>
${sterne}${reset}${zusatz(m, wert)}
</div>`
}

export default (zelle, m) => {
  const id = m.specimen.id
  if (id === 'half-stars') {
    return `<div class="ra-stapel">${[2.5, 3.5, 4.5].map((w) => anzeige(m, w)).join('')}</div>`
  }
  if (id === 'sentiment-scale') {
    return `<div class="ra-stapel">${[2, 3, 5].map((w) => anzeige(m, w, [stimmung(w)])).join('')}</div>`
  }
  if (m.wert('mode') === 'readonly') return anzeige(m, 4)
  const extra = id === 'error-state' ? ['nc-rating--error'] : []
  return auswahl(m, id === 'error-state' ? 0 : 3, extra)
}
