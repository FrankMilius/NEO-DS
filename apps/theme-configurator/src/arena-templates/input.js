// Vorlage: input — Markup aus data/markup/input.html (<input class="nc-input">)
// und den Wrapper-Mustern aus scss/scss/05-atoms/_input.scss
// (.nc-input-wrapper mit __icon, __label, __prefix/__suffix, __clear).
// Das Feld ist echt: tippen, markieren, fokussieren.
//
// Achsen: variant/size/type/validation per Modifier aus dem Recipe.
//   type=search    Lupe links (nc-input__icon), type="search"
//   type=password  Auge rechts (nc-input__icon--end), type="password"
//   validation=error  zusaetzlich aria-invalid="true"
// Zustaende: disabled und readonly als native Attribute; not-empty fuellt
// das Feld (Label schwebt, Loeschknopf erscheint); hover/focus nur echt.
// Specimens per compositionType: input-with-label (schwebendes Label),
// input-with-clear (Loeschknopf), input-with-affix (Praefix/Suffix),
// input-with-icon (Symbol im Wrapper).
// Symbol und Praefix stehen im Markup NACH dem Feld: das Feld ist selbst
// positioniert (Touch-Target ::after) und hat einen deckenden Hintergrund —
// davor stehende absolute Elemente malt es zu.
import { esc, klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const LUPE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
const AUGE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
const KREUZ = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'

const WERT = { text: 'Max Mustermann', search: 'Urlaubsantrag', password: 'geheim123' }
const PLATZHALTER = { text: 'Name eingeben …', search: 'Suchen …', password: 'Passwort eingeben …' }

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const typ = m.wert('type') || 'text'
  const mitLabel = art === 'input-with-label'
  const mitIcon = art === 'input-with-icon'
  const gefuellt = m.hat('not-empty') || m.hat('readonly') || (m.hat('disabled') && m.specimen.id === 'disabled-readonly')

  const extra = []
  // Das Symbol links braucht den Innenabstand von --search (das DS kennt
  // dafuer keinen eigenen Modifier).
  if ((typ === 'search' || mitIcon) && !m.klassen.includes('nc-input--search')) extra.push('nc-input--search')
  if (mitLabel) extra.push('nc-input--has-label')
  const klasse = [klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-input--disabled'), ...extra].join(' ')

  const id = `${m.uid}-feld`
  const fehler = m.wert('validation') === 'error'
  // Schwebendes Label: Platzhalter ist ein Leerzeichen, damit
  // :placeholder-shown den leeren Zustand erkennt.
  const affix = art === 'input-with-affix'
  const platzhalter = mitLabel ? ' ' : affix ? '0,00' : PLATZHALTER[typ]
  const name = affix ? 'Preis ab, in Euro' : typ === 'search' ? 'Suchen' : typ === 'password' ? 'Passwort' : 'Name'
  const attrs = [
    ` class="${klasse}"`,
    ` type="${typ}"`,
    ` id="${id}"`,
    gefuellt ? ` value="${esc(WERT[typ])}"` : '',
    ` placeholder="${esc(platzhalter)}"`,
    mitLabel ? '' : ` aria-label="${esc(name)}"`,
    affix ? ' inputmode="decimal"' : '',
    fehler ? ' aria-invalid="true"' : '',
    m.deaktiviert ? ' disabled' : '',
    m.hat('readonly') ? ' readonly' : '',
    m.attrsOhne(...NATIVE_ARIA)
  ].join('')
  const feld = `<input${attrs}>`

  if (mitLabel) {
    return `<div class="nc-input-wrapper ra-feld">${feld}<label class="nc-input__label" for="${id}">E-Mail-Adresse</label></div>`
  }
  if (art === 'input-with-clear') {
    return `<div class="nc-input-wrapper ra-feld">${feld}<button type="button" class="nc-input__clear" aria-label="Eingabe löschen">${KREUZ}</button></div>`
  }
  if (affix) {
    return `<div class="nc-input-wrapper nc-input-wrapper--has-prefix nc-input-wrapper--has-suffix ra-feld">${feld}<span class="nc-input__prefix" aria-hidden="true">ab</span><span class="nc-input__suffix" aria-hidden="true">€</span></div>`
  }
  if (mitIcon || typ === 'search') {
    return `<div class="nc-input-wrapper ra-feld">${feld}<span class="nc-input__icon">${LUPE}</span></div>`
  }
  if (typ === 'password') {
    return `<div class="nc-input-wrapper ra-feld">${feld}<span class="nc-input__icon nc-input__icon--end">${AUGE}</span></div>`
  }
  return `<div class="ra-feld">${feld}</div>`
}
