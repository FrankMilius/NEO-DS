// Vorlage: toggle-group — Markup aus data/markup/toggle-group.html:
//   type=single    role="radiogroup", Knoepfe mit role="radio" aria-checked
//   type=multiple  role="group", Knoepfe mit aria-pressed (0–n gewaehlt)
// Die Auswahl zeigt das DS ueber aria-checked/aria-pressed; Umschalten
// uebernimmt neo-behaviors (Arena: Ausprobieren).
//
// Achsen: size/variant/indicator/width per Modifier; content waehlt Text,
// Symbol + Text oder nur Symbol (__icon, mit aria-label).
// Zustaende am Knopf: Standard = erster gewaehlt, selected = der zweite
// (bei multiple zusaetzlich der dritte); disabled = ganze Gruppe aus;
// hover/focus nur echt. toolbar-pattern zeigt eine Formatierungsleiste,
// divider-variant den Modifier --divider (im Recipe als compositionType).
import { esc, klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const SVG = (inhalt) => `<span class="nc-toggle-group__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inhalt}</svg></span>`

const ANSICHT = [
  ['Raster', SVG('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>')],
  ['Liste', SVG('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>')],
  ['Kalender', SVG('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>')]
]

const FORMAT = [
  ['Fett', SVG('<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>')],
  ['Kursiv', SVG('<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>')],
  ['Unterstrichen', SVG('<path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>')],
  ['Durchgestrichen', SVG('<path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/>')]
]

export default (zelle, m) => {
  const werkzeug = m.specimen.render?.compositionType === 'toggle-toolbar'
  const trenner = m.specimen.render?.compositionType === 'toggle-divider'
  const mehrfach = m.wert('type') === 'multiple'
  const content = m.wert('content') || 'text'
  const nurSymbol = content === 'icon-only'
  const mitSymbol = nurSymbol || content === 'icon-text' || m.slot('icon')
  const liste = werkzeug ? FORMAT : ANSICHT
  const gewaehlt = new Set(m.hat('selected') ? (mehrfach ? [1, 2] : [1]) : [0])
  const klasse = [klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-toggle-group--disabled'), trenner ? 'nc-toggle-group--divider' : ''].filter(Boolean).join(' ')
  const aus = m.deaktiviert ? ' aria-disabled="true" disabled' : ''

  const knoepfe = liste.map(([text, symbol], i) => {
    const an = gewaehlt.has(i)
    const zustand = mehrfach
      ? ` aria-pressed="${an}"`
      : ` role="radio" aria-checked="${an}" tabindex="${an ? 0 : -1}"`
    return `<button type="button" class="nc-toggle-group__item"${zustand}${nurSymbol ? ` aria-label="${esc(text)}"` : ''}${aus}>${mitSymbol ? symbol : ''}${nurSymbol ? '' : `<span>${esc(text)}</span>`}</button>`
  }).join('\n')

  const rolle = mehrfach ? 'group' : 'radiogroup'
  const name = werkzeug ? 'Textformat' : 'Ansicht'
  return `<div class="${klasse}" role="${rolle}" aria-label="${name}"${m.attrsOhne(...NATIVE_ARIA)}>
${knoepfe}
</div>`
}
