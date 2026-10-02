// Vorlage: textarea — <textarea class="nc-textarea"> mit den Mustern aus
// scss/scss/05-atoms/_textarea.scss (.nc-textarea-wrapper, __counter,
// __actions). Das Feld ist echt: tippen, Groesse ziehen (resize).
//
// Achsen: variant/size/resize/validation per Modifier aus dem Recipe;
// validation=error zusaetzlich aria-invalid="true"; content=with-actions
// stellt die Aktionsleiste (__actions) in den Wrapper.
// Zustaende: disabled nativ; hover/focus/focus-within nur echt; empty ist
// :placeholder-shown (leere Textarea), sonst steht Beispieltext darin.
// Specimens per compositionType: Zaehler (normal und Limit), Scrollbar und
// max-height (Token --nc-textarea-max-height als Instanzwert — so sieht es
// das DS vor), leer gegen befuellt, Komposition im Formularfeld.
import { esc, klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const KURZ = 'Die Besprechung ist auf Donnerstag verschoben.'
const LANG = 'Zeile eins der Notiz.\nZeile zwei mit etwas mehr Text, damit es umbricht.\nZeile drei.\nZeile vier.\nZeile fünf.\nZeile sechs.\nZeile sieben — hier beginnt der Scrollbereich.\nZeile acht.'

const KOPIEREN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
const LEEREN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
const FUNKE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>'

function aktionen () {
  return `<div class="nc-textarea__actions">
<button type="button" class="nc-button nc-button--ghost nc-button--sm" aria-label="Kopieren">${KOPIEREN}</button>
<button type="button" class="nc-button nc-button--ghost nc-button--sm" aria-label="Leeren">${LEEREN}</button>
<button type="button" class="nc-button nc-button--ghost nc-button--sm">${FUNKE}<span>Umformulieren</span></button>
</div>`
}

function textarea (m, { id, text, stil = '', beschriftet = true, beschreibung = '' }) {
  const fehler = m.wert('validation') === 'error'
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-textarea--disabled')
  return `<textarea class="${klasse}" id="${id}" rows="3" placeholder="Nachricht eingeben …"${beschriftet ? ' aria-label="Nachricht"' : ''}${fehler ? ' aria-invalid="true"' : ''}${beschreibung}${m.deaktiviert ? ' disabled' : ''}${stil}${m.attrsOhne(...NATIVE_ARIA)}>${esc(text)}</textarea>`
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const id = `${m.uid}-feld`
  const fehler = m.wert('validation') === 'error'
  const mitAktionen = m.wert('content') === 'with-actions'

  // Leer gegen befuellt: beide Felder in einer Zelle (Aktionen erscheinen
  // nur am befuellten oder fokussierten Feld).
  if (art === 'textarea-empty-filled') {
    return `<div class="ra-reihe">${['', KURZ].map((text, i) => `<div class="nc-textarea-wrapper ra-feld ra-feld--breit">${textarea(m, { id: `${id}-${i}`, text })}${aktionen()}</div>`).join('')}</div>`
  }

  const leer = m.hat('empty') || m.specimen.id === 'with-placeholder'
  const lang = art === 'textarea-scrollbar' || art === 'textarea-max-height'
  const text = leer ? '' : (lang ? LANG : KURZ)
  const zaehler = art === 'textarea-with-counter' || art === 'textarea-full-form'
  const feld = textarea(m, {
    id,
    text,
    stil: lang ? ' style="--nc-textarea-max-height: 160px"' : '',
    beschriftet: art !== 'textarea-full-form',
    beschreibung: art === 'textarea-full-form' ? ` aria-describedby="${m.uid}-zaehler ${m.uid}-hinweis"` : zaehler ? ` aria-describedby="${m.uid}-zaehler"` : ''
  })
  const zaehlerHtml = zaehler
    ? `<span class="nc-textarea__counter${fehler ? ' nc-textarea__counter--limit' : ''}" id="${m.uid}-zaehler">${fehler ? '500 / 500' : `${text.length} / 500`}</span>`
    : ''

  if (art === 'textarea-full-form') {
    return `<div class="nc-form-field ra-feld ra-feld--breit">
<label class="nc-form-label" for="${id}"><span class="nc-form-label__text">Nachricht</span></label>
<div class="nc-textarea-wrapper">${feld}${aktionen()}</div>
${zaehlerHtml}
<p class="nc-form-hint" id="${m.uid}-hinweis"><span class="nc-form-hint__text">Wir antworten innerhalb von zwei Werktagen.</span></p>
</div>`
  }
  if (mitAktionen) return `<div class="nc-textarea-wrapper ra-feld ra-feld--breit">${feld}${aktionen()}</div>`
  if (zaehler) return `<div class="nc-textarea-wrapper ra-feld">${feld}${zaehlerHtml}</div>`
  return `<div class="ra-feld">${feld}</div>`
}
