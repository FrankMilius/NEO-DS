// @ts-check
// ==========================================================================
// Toolbar — nach data/toolbar-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA Toolbar (role="toolbar"): die Leiste ist EINE Tab-Station
// (roving tabindex: genau ein Bedienelement mit tabindex="0", alle anderen
// "-1"). Bedienelemente sind alle Knoepfe, Links und Felder in der Leiste —
// auch die in eingebetteten Gruppen (Toggle-Group, Segmented Control): die
// Pfeiltasten laufen flach ueber alle (wie im APG-Beispiel), Enter/
// Leertaste loesen das Element selbst aus (nativ bzw. dessen Behavior).
//   Pfeil rechts/links   naechstes/vorheriges Bedienelement (rundum,
//                        gesperrte uebersprungen)
//   Pos1 / Ende          erstes / letztes Bedienelement
//   Tab                  verlaesst die Leiste (vom Feld aus: siehe unten)
// Eingabefelder (Text, Suche, Zahl, Auswahl, Textbereich …): Pfeiltasten,
// Pos1 und Ende bleiben im Feld und bewegen den Cursor (Entscheidung
// 02.10.2026). Tab/Shift+Tab verlassen das Feld zum naechsten/vorherigen
// Bedienelement der Leiste; am Rand verlassen sie die Leiste. So bleibt
// ein Feld, das die Tab-Station traegt, keine Falle.
// Der Tab-Stopp folgt dem Fokus (Klick, Tab zurueck in die Leiste). Beim
// Loesen bekommen die Elemente ihren alten tabindex zurueck.
// Elemente in eingebetteten Menues, Listen und Dialogen zaehlen nicht mit.
// Entscheidungen 03.10.2026 (bestaetigt): Tab aus dem Feld zum Nachbarn
// (toolbar-tab), eingebettete Gruppen flach (toolbar-gruppen), Ereignis
// toolbar-focus bleibt (toolbar-ereignis).
//
// Sticky (nc-toolbar--sticky): .is-scrolled, solange die Leiste angeheftet
// ist (Schatten + Linie laut SCSS). Ein IntersectionObserver beobachtet die
// Leiste selbst mit einem um (top + 1px) verkleinerten Rahmen oben: klebt
// sie, ragt sie 1px darueber hinaus (Anteil < 1, Oberkante ueber dem
// Rahmen). Kein zusaetzliches Element im DOM. Ohne IntersectionObserver
// passiert nichts. Beim Loesen: Beobachter weg, Klasse wie vorher.
//
// Ereignis `toolbar-focus` { value, previousValue } — Name des Elements,
// das die Tab-Station uebernimmt (aria-label, Text oder placeholder).
// ==========================================================================
import { sende, zielFuerTaste, gesperrt } from './kern.js'

const BEDIENELEMENT = 'button, a[href], input:not([type="hidden"]), select, textarea, [contenteditable="true"], [role="button"], [role="radio"], [role="checkbox"], [role="switch"]'
const KEIN_FELD = ['button', 'submit', 'reset', 'checkbox', 'radio', 'image', 'file', 'color']

/** Pfeiltasten gehoeren dem Feld (Cursor, Wert). */
function istFeld (el) {
  if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable || el.getAttribute('contenteditable') === 'true') return true
  return el.tagName === 'INPUT' && !KEIN_FELD.includes(/** @type {HTMLInputElement} */ (el).type)
}

/** .is-scrolled an einer Sticky-Leiste, solange sie angeheftet ist. */
function beobachteSticky (wurzel, signal) {
  if (!wurzel.classList.contains('nc-toolbar--sticky')) return
  const fenster = wurzel.ownerDocument.defaultView
  const IO = fenster?.IntersectionObserver
  if (typeof IO !== 'function') return
  const vorher = wurzel.classList.contains('is-scrolled')
  const oben = parseFloat(fenster.getComputedStyle(wurzel).top) || 0
  const beobachter = new IO((eintraege) => {
    for (const e of eintraege) {
      const rahmenOben = e.rootBounds ? e.rootBounds.top : oben + 1
      wurzel.classList.toggle('is-scrolled', e.intersectionRatio < 1 && e.boundingClientRect.top < rahmenOben)
    }
  }, { rootMargin: `-${oben + 1}px 0px 0px 0px`, threshold: [1] })
  beobachter.observe(wurzel)
  signal.addEventListener('abort', () => {
    beobachter.disconnect()
    wurzel.classList.toggle('is-scrolled', vorher)
  })
}

const nameVon = (el) => (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || '').trim()

export const toolbar = {
  id: 'toolbar',
  selektor: '.nc-toolbar',
  binde (wurzel, signal) {
    beobachteSticky(wurzel, signal)
    const elemente = () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll(BEDIENELEMENT)])
      .filter((e) => !e.hasAttribute('disabled') && !e.closest('[hidden], [inert], [role="menu"], [role="listbox"], [role="dialog"]') && e.closest('.nc-toolbar') === wurzel)
    if (!elemente().length) return

    // Alte Werte merken (abbinden stellt sie wieder her)
    const vorher = new Map(elemente().map((e) => [e, e.getAttribute('tabindex')]))
    let aktuell = /** @type {HTMLElement|null} */ (null)

    const tabStopp = (el, melden = true) => {
      for (const e of elemente()) e.tabIndex = e === el ? 0 : -1
      const alt = aktuell
      aktuell = el
      if (melden && alt !== el) sende(wurzel, 'toolbar-focus', { value: nameVon(el), previousValue: alt ? nameVon(alt) : null })
    }
    tabStopp(elemente().find((e) => !gesperrt(e)) || elemente()[0], false)

    // Capture: vor eingebetteten Gruppen (z. B. Toggle-Group), die selbst
    // auf Pfeiltasten hoeren — in der Toolbar gilt die flache Folge.
    wurzel.addEventListener('keydown', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      const liste = elemente()
      if (!liste.includes(el)) return
      if (istFeld(el)) {
        if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return
        const bedienbar = liste.filter((x) => x === el || !gesperrt(x))
        const ziel = bedienbar[bedienbar.indexOf(el) + (e.shiftKey ? -1 : 1)]
        if (!ziel) return // am Rand: Tab verlaesst die Leiste
        e.preventDefault()
        tabStopp(ziel)
        ziel.focus()
        return
      }
      const ziel = zielFuerTaste(e.key, liste, el, 'horizontal')
      if (!ziel) return
      e.preventDefault()
      e.stopPropagation()
      tabStopp(ziel)
      ziel.focus()
    }, { signal, capture: true })

    wurzel.addEventListener('focusin', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      if (el !== aktuell && elemente().includes(el)) tabStopp(el)
    }, { signal })
    // Nach einem Klick (eingebettete Gruppen setzen ihren eigenen tabindex)
    wurzel.addEventListener('click', (e) => {
      const el = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest(BEDIENELEMENT))
      if (el && elemente().includes(el)) tabStopp(el)
    }, { signal })

    signal.addEventListener('abort', () => {
      for (const [e, wert] of vorher) {
        if (wert === null) e.removeAttribute('tabindex')
        else e.setAttribute('tabindex', wert)
      }
    })
  }
}
