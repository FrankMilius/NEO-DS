// @ts-check
// ==========================================================================
// Multiselect — nach data/multiselect-recipe.json (keyboard, events)
// ==========================================================================
// Formularfeld „multiselect" aus dem Drupal-Theme (Entscheidung 06.10.2026,
// multiselect-verhalten). Ersetzt in neo_fe/js/neo-theme.js (neoForm,
// case 'multiselect') updateMs/openMs/closeMs und die Ereignisse am Knopf,
// am Panel und am Dokument — das Feld selbst (Label, Knopf, Panel mit
// Checkboxen name[]) rendert dann Drupal fertig.
//
// Disclosure-Muster: der Knopf .nc-multiselect__trigger (aria-expanded,
// aria-controls → Panel) zeigt das Panel .nc-multiselect__panel ([hidden])
// mit nativen Checkboxen. .is-open am Feld dreht den Pfeil (SCSS).
//
// Geschlossen setzt das Behavior neben [hidden] auch display: none inline:
// .nc-multiselect__panel hat display: flex, das gegen das [hidden] des
// Browsers gewinnt. Die Regel .nc-multiselect__panel[hidden] im DS
// (06-molecules/_multiselect.scss) blendet ebenfalls aus — sie ist
// website-sichtbar und wartet auf Freigabe; die Inline-Angabe haelt das
// Behavior auch ohne sie richtig (mit ihr nur doppelt).
//
//   Oeffnen      Klick auf den Knopf (schaltet); Enter, Leertaste, Pfeil
//                runter auf dem Knopf oeffnen und setzen den Fokus auf die
//                erste Checkbox (wie die Website). Das Panel sitzt unter
//                dem Knopf (insetBlockStart wie neo-theme.js).
//   Liste        Pfeil runter/hoch (rundum), Pos1, Ende zwischen den
//                Checkboxen; Leertaste waehlt (nativ).
//   Schliessen   Escape (Fokus zurueck auf den Knopf), Klick ausserhalb des
//                Felds, Fokus verlaesst das Feld (Tab weiter).
//   Zusammenfassung  im Knopf (.nc-multiselect__value): keine Auswahl →
//                Platzhalter mit --empty, bis zwei → Namen mit Komma, mehr
//                → „<n> ausgewählt" / „<n> selected". Platzhalter aus
//                data-placeholder (Knopf oder Feld), sonst dem Text beim
//                Binden (falls leer), sonst dem Text der Sprache.
//   Sprache      lang am Feld bzw. seinem naechsten Vorfahren (in der Regel
//                <html lang>, das Drupal setzt): „de…" oder ohne Angabe
//                deutsch, sonst englisch. Ueberschreibbar am Bauteil:
//                data-placeholder und data-count-text (Feld oder Knopf;
//                @count steht fuer die Anzahl, wie in Drupal.t) — neo_fe
//                setzt sie, wenn Drupal eine Uebersetzung hat (Restpunkte
//                09.10.2026, multiselect-sprache; vorher fest deutsch).
//
// Pflichtfeld-Pruefung und Fehlermeldung bleiben beim Formular (neoForm,
// validateMs) — das ist Formular-, nicht Bauteil-Verhalten.
//
// Ereignis `multiselect-change` { values } — Werte der gewaehlten
// Checkboxen, bei jeder Aenderung.
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

let zaehler = 0

// Texte je Sprache; @count = Anzahl der gewaehlten Optionen
const TEXTE = {
  de: { platzhalter: 'Bitte wählen…', anzahl: '@count ausgewählt' },
  en: { platzhalter: 'Please select…', anzahl: '@count selected' }
}

/** Sprache des Felds: lang am Feld oder Vorfahren; de (auch ohne Angabe) oder en
 * @param {HTMLElement} feld */
function spracheVon (feld) {
  const lang = (feld.closest('[lang]')?.getAttribute('lang') || '').trim().toLowerCase()
  return !lang || lang === 'de' || lang.startsWith('de-') ? 'de' : 'en'
}

export const multiselect = {
  id: 'multiselect',
  selektor: '.nc-multiselect',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} feld @param {AbortSignal} signal */
  binde (feld, signal) {
    const dok = feld.ownerDocument
    const knopf = /** @type {HTMLButtonElement|null} */ (feld.querySelector('.nc-multiselect__trigger'))
    const panel = /** @type {HTMLElement|null} */ (feld.querySelector('.nc-multiselect__panel'))
    if (!knopf || !panel) return
    const wert = /** @type {HTMLElement|null} */ (knopf.querySelector('.nc-multiselect__value'))
    const boxen = () => /** @type {HTMLInputElement[]} */ ([...panel.querySelectorAll('input[type="checkbox"]')])
    const name = (box) => (box.closest('.nc-multiselect__option')?.querySelector('.nc-checkbox__label')?.textContent || box.value).trim()
    const texte = TEXTE[spracheVon(feld)]
    const platzhalter = knopf.dataset.placeholder || feld.dataset.placeholder ||
      (wert?.classList.contains('nc-multiselect__value--empty') ? wert.textContent?.trim() : '') || texte.platzhalter
    const anzahlText = feld.dataset.countText || knopf.dataset.countText || texte.anzahl

    const vorher = { controls: knopf.getAttribute('aria-controls'), panelId: panel.id, display: panel.style.display }
    if (!panel.id) panel.id = `neo-multiselect-${++zaehler}`
    knopf.setAttribute('aria-controls', panel.id)

    const istOffen = () => !panel.hidden
    /** @param {boolean} offen */
    function zeige (offen) {
      panel.hidden = !offen
      // display: flex des Panels gewinnt sonst gegen [hidden] (siehe oben)
      if (offen) panel.style.removeProperty('display')
      else panel.style.display = 'none'
    }
    function oeffne () {
      panel.style.insetBlockStart = `${knopf.offsetTop + knopf.offsetHeight + 4}px`
      zeige(true)
      knopf.setAttribute('aria-expanded', 'true')
      feld.classList.add('is-open')
    }
    function schliesse () {
      zeige(false)
      knopf.setAttribute('aria-expanded', 'false')
      feld.classList.remove('is-open')
    }
    function fasseZusammen () {
      if (!wert) return
      const gewaehlt = boxen().filter((b) => b.checked)
      wert.classList.toggle('nc-multiselect__value--empty', !gewaehlt.length)
      wert.textContent = !gewaehlt.length
        ? platzhalter
        : gewaehlt.length <= 2 ? gewaehlt.map(name).join(', ') : anzahlText.replace('@count', String(gewaehlt.length))
    }

    // Anfangszustand: aria-expanded, .is-open und display folgen dem Panel
    zeige(istOffen())
    knopf.setAttribute('aria-expanded', String(istOffen()))
    feld.classList.toggle('is-open', istOffen())
    fasseZusammen()

    knopf.addEventListener('click', () => { istOffen() ? schliesse() : oeffne() }, { signal })
    knopf.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && istOffen()) { e.preventDefault(); schliesse() }
      else if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !istOffen()) {
        e.preventDefault()
        oeffne()
        boxen()[0]?.focus()
      }
    }, { signal })

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); schliesse(); knopf.focus(); return }
      const box = /** @type {HTMLElement} */ (e.target)
      if (box.tagName !== 'INPUT') return
      const ziel = zielFuerTaste(e.key, boxen(), box, 'vertikal')
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })

    panel.addEventListener('change', () => {
      fasseZusammen()
      sende(feld, 'multiselect-change', { values: boxen().filter((b) => b.checked).map((b) => b.value) })
    }, { signal })

    dok.addEventListener('click', (e) => { if (istOffen() && !feld.contains(/** @type {Node} */ (e.target))) schliesse() }, { signal })
    feld.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (istOffen() && nach && !feld.contains(nach)) schliesse()
    }, { signal })

    signal.addEventListener('abort', () => {
      if (vorher.controls === null) knopf.removeAttribute('aria-controls')
      else knopf.setAttribute('aria-controls', vorher.controls)
      if (!vorher.panelId) panel.removeAttribute('id')
      panel.style.removeProperty('inset-block-start')
      panel.style.display = vorher.display
    })
  }
}
