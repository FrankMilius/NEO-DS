// @ts-check
// ==========================================================================
// Code-Snippet — nach data/code-snippet-recipe.json (keyboard, events)
// ==========================================================================
// Block-Snippets (single, multi); das Inline-Snippet hat kein Verhalten.
// Beide Knoepfe sind native <button>: Enter, Leertaste und Klick macht der
// Browser. Das Behavior ergaenzt:
//   Kopieren  .nc-code-snippet__copy schreibt den Text von
//             .nc-code-snippet__code in die Zwischenablage. Erfolg: Klasse
//             .nc-code-snippet__copy--success (Haken-Symbol) und aria-label
//             „Kopiert!" fuer 2 s, danach wieder „Code kopieren".
//             Ereignis `code-snippet-copy` { ok }.
//   Mehr      .nc-code-snippet__show-more schaltet .nc-code-snippet--expanded,
//             aria-expanded und den Text („Mehr/Weniger anzeigen").
//             Ereignis `code-snippet-toggle` { expanded }.
//             Passt der Code ohnehin in die eingeklappte Hoehe
//             (--nc-cs-multi-max-height), ist der Knopf [hidden].
// Syntax-Hervorhebung (Prism) gehoert nicht dazu: das Markup bringt die
// .token-Spans mit. Ersetzt den Kopieren-/Mehr-Teil von js/code-snippet.js.
// ==========================================================================
import { sende } from './kern.js'

const DAUER = 2000
const NAME = 'Code kopieren'

/** @param {string} text @param {Document} doc @returns {Promise<boolean>} */
async function inZwischenablage (text, doc) {
  try {
    const ablage = doc.defaultView?.navigator?.clipboard
    if (ablage?.writeText) { await ablage.writeText(text); return true }
  } catch { /* Ersatzweg unten */ }
  // Ersatz fuer unsichere Kontexte (http) und aeltere Browser
  try {
    const feld = doc.createElement('textarea')
    feld.value = text
    feld.setAttribute('readonly', '')
    feld.style.position = 'fixed'
    feld.style.opacity = '0'
    doc.body.append(feld)
    feld.select()
    const ok = typeof doc.execCommand === 'function' && doc.execCommand('copy')
    feld.remove()
    return !!ok
  } catch {
    return false
  }
}

export const codeSnippet = {
  id: 'code-snippet',
  selektor: '.nc-code-snippet:not(.nc-code-snippet--inline)',
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const eigen = (/** @type {Element|null} */ el) => !!el && el.closest('.nc-code-snippet') === wurzel
    let zeit = /** @type {ReturnType<typeof setTimeout>|undefined} */ (undefined)
    signal.addEventListener('abort', () => clearTimeout(zeit))

    wurzel.addEventListener('click', async (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      const kopieren = /** @type {HTMLElement|null} */ (ziel.closest('.nc-code-snippet__copy'))
      if (kopieren && eigen(kopieren)) {
        const code = wurzel.querySelector('.nc-code-snippet__code')
        const ok = await inZwischenablage(code?.textContent || '', wurzel.ownerDocument)
        if (signal.aborted) return
        if (ok) {
          clearTimeout(zeit)
          kopieren.classList.add('nc-code-snippet__copy--success')
          kopieren.setAttribute('aria-label', 'Kopiert!')
          zeit = setTimeout(() => {
            kopieren.classList.remove('nc-code-snippet__copy--success')
            kopieren.setAttribute('aria-label', NAME)
          }, DAUER)
        }
        sende(wurzel, 'code-snippet-copy', { ok })
        return
      }
      const mehr = /** @type {HTMLElement|null} */ (ziel.closest('.nc-code-snippet__show-more'))
      if (mehr && eigen(mehr)) {
        const offen = wurzel.classList.toggle('nc-code-snippet--expanded')
        mehr.setAttribute('aria-expanded', String(offen))
        const text = mehr.querySelector('.nc-code-snippet__show-more-label')
        if (text) text.textContent = offen ? 'Weniger anzeigen' : 'Mehr anzeigen'
        sende(wurzel, 'code-snippet-toggle', { expanded: offen })
      }
    }, { signal })

    // Knopf nur, wenn es etwas aufzuklappen gibt. Ohne Layout (Hoehe 0,
    // z. B. verborgen oder ohne CSS) bleibt er stehen.
    const mehr = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-code-snippet__show-more'))
    const pre = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-code-snippet__pre'))
    if (mehr && pre && pre.scrollHeight > 0) {
      const sicht = wurzel.ownerDocument.defaultView
      const max = parseFloat(sicht?.getComputedStyle(wurzel).getPropertyValue('--nc-cs-multi-max-height') || '') || 240
      if (pre.scrollHeight <= max && !wurzel.classList.contains('nc-code-snippet--expanded')) {
        mehr.hidden = true
        signal.addEventListener('abort', () => { mehr.hidden = false })
      }
    }
  }
}
