// Vorlage: input-group — Markup aus data/markup/input-group.html:
// <div class="nc-input-group"> mit __prepend, <input class="nc-input"> und
// __append. Komposition im Recipe: enthaelt input — das Feld ist ein echter
// Input (gleiche Groessen-Modifier), Rahmen, Fokus und Zustaende kommen vom
// Input.
//
// Achsen: size/validation per Modifier aus dem Recipe (size zusaetzlich am
// Input: nc-input--sm/--lg); content schaltet Prepend/Append (slotConfig).
// Zustaende: disabled = nc-input-group--disabled + Feld disabled; readonly =
// nc-input-group--readonly + Feld readonly; hover/focus nur echt.
// Specimens: URL-Eingabe, Suchfeld mit Knopf, Knoepfe links und rechts
// (Mengenwahl), schreibgeschuetzter Schluessel mit Kopierknopf. Knoepfe sind
// nc-button als direkte Kinder der Gruppe: die Radius-Logik der Gruppe
// (aussen rund, innen 0) greift, die Hoehe entspricht dem Input. In einem
// __prepend/__append stuende der Knopf mit Addon-Polster und niedriger als
// das Feld (das Addon hat keine eigene Hoehe).
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const KOPIEREN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const extra = m.hat('readonly') ? ['nc-input-group--readonly'] : []
  const klasse = [klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN), ...extra].join(' ')
  const groesse = m.wert('size') === 'sm' ? ' nc-input--sm' : m.wert('size') === 'lg' ? ' nc-input--lg' : ''
  const validation = m.wert('validation')
  const feldAttrs = [
    validation === 'error' ? ' aria-invalid="true"' : '',
    m.deaktiviert ? ' disabled' : '',
    m.hat('readonly') ? ' readonly' : ''
  ].join('')
  const feld = (typ, platz, name, wert = '') => `<input class="nc-input${groesse}" type="${typ}" placeholder="${platz}" aria-label="${name}"${wert ? ` value="${wert}"` : ''}${feldAttrs}>`
  const knopf = (text, label = '') => `<button type="button" class="nc-button nc-button--secondary${groesse.replace('nc-input', 'nc-button')}"${label ? ` aria-label="${label}"` : ''}${m.deaktiviert ? ' disabled' : ''}>${text}</button>`

  let innen
  if (art === 'input-group-url') {
    innen = `<span class="nc-input-group__prepend" aria-hidden="true">https://</span>${feld('text', 'firma.de', 'Website', '')}`
  } else if (art === 'input-group-search') {
    innen = `${feld('search', 'Suchbegriff …', 'Suchen')}${knopf('Suchen')}`
  } else if (art === 'input-group-buttons') {
    innen = `${knopf('−', 'Weniger')}${feld('number', '1', 'Menge', '1')}${knopf('+', 'Mehr')}`
  } else if (art === 'input-group-readonly-copy') {
    innen = `${feld('text', '', 'API-Schlüssel', 'sk-live-4f9a…c21e')}${knopf(KOPIEREN, 'Kopieren')}`
  } else {
    const vorne = m.slot('prepend') ? '<span class="nc-input-group__prepend" aria-hidden="true">€</span>' : ''
    const hinten = m.slot('append') ? '<span class="nc-input-group__append" aria-hidden="true">EUR</span>' : ''
    innen = `${vorne}${feld('text', '0,00', 'Betrag in Euro', m.hat('readonly') || m.deaktiviert ? '49,90' : '')}${hinten}`
  }

  return `<div class="ra-feld"><div class="${klasse}"${m.attrsOhne(...NATIVE_ARIA)}>${innen}</div></div>`
}
