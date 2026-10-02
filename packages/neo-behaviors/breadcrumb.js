// @ts-check
// ==========================================================================
// Breadcrumb — nach data/breadcrumb-recipe.json (keyboard, events)
// ==========================================================================
// Nur die Smart-Truncation braucht Verhalten: der Ellipsis-Knopf
// (.nc-breadcrumb__ellipsis, aria-haspopup, aria-expanded) klappt das Menue
// der ausgeblendeten Ebenen auf (.nc-breadcrumb__dropdown, role="menu",
// sichtbar per .is-open — so kennt es das SCSS). Die Links selbst sind
// native Links.
//   Oeffnen    Klick, Enter, Leertaste → erster Eintrag; Pfeil runter →
//              erster, Pfeil hoch → letzter Eintrag
//   Im Menue   Pfeil hoch/runter (rundum), Pos1, Ende; Enter folgt dem Link
//              (nativ); Escape schliesst, Fokus zurueck auf den Knopf; Tab
//              schliesst und geht weiter
//   Aussen     Klick ausserhalb oder Fokus verlaesst das Bauteil → zu
// Die Eintraege bleiben ausserhalb der Tab-Folge (tabindex="-1").
//
// js/breadcrumb.js (Doku/Website) baut das Menue aus
// data-breadcrumb-hidden-items selbst; dieses Behavior erwartet das Menue im
// Markup (wie data/markup/breadcrumb.html und die Arena).
//
// Ereignis `breadcrumb-toggle` { open }.
// ==========================================================================
import { sende, zielFuerTaste, ersterBedienbar, gesperrt } from './kern.js'

const EINTRAG = '.nc-breadcrumb__dropdown-item'

export const breadcrumb = {
  id: 'breadcrumb',
  selektor: '.nc-breadcrumb',
  binde (wurzel, signal) {
    const knopf = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-breadcrumb__ellipsis'))
    const menue = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-breadcrumb__dropdown'))
    if (!knopf || !menue) return
    const dok = wurzel.ownerDocument
    const huelle = /** @type {HTMLElement} */ (knopf.closest('.nc-breadcrumb__ellipsis-wrap') || knopf.parentElement || wurzel)
    const eintraege = () => /** @type {HTMLElement[]} */ ([...menue.querySelectorAll(EINTRAG)])
    const offen = () => menue.classList.contains('is-open')

    for (const e of eintraege()) e.tabIndex = -1
    if (!knopf.hasAttribute('aria-haspopup')) knopf.setAttribute('aria-haspopup', 'true')
    knopf.setAttribute('aria-expanded', String(offen()))

    /** @param {boolean} an @param {'erster'|'letzter'|null} [fokus] */
    const setze = (an, fokus = null) => {
      if (offen() !== an) {
        menue.classList.toggle('is-open', an)
        knopf.setAttribute('aria-expanded', String(an))
        sende(wurzel, 'breadcrumb-toggle', { open: an })
      }
      if (an && fokus) ersterBedienbar(eintraege(), fokus === 'letzter')?.focus()
    }
    const schliesse = (fokusZurueck) => {
      if (!offen()) return
      setze(false)
      if (fokusZurueck) knopf.focus()
    }

    knopf.addEventListener('click', () => {
      if (gesperrt(knopf)) return
      if (offen()) schliesse(false)
      else setze(true, 'erster')
    }, { signal })
    knopf.addEventListener('keydown', (e) => {
      if (gesperrt(knopf)) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setze(true, 'erster') }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setze(true, 'letzter') }
      else if (e.key === 'Escape') schliesse(true)
    }, { signal })

    menue.addEventListener('keydown', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target).closest(EINTRAG)
      if (!eintrag) return
      if (e.key === 'Escape') { e.preventDefault(); schliesse(true); return }
      if (e.key === 'Tab') { schliesse(false); return }
      const ziel = zielFuerTaste(e.key, eintraege(), eintrag, 'vertikal')
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })

    // Ein Eintrag fuehrt weg: Menue schliessen (Link folgt nativ)
    menue.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).closest(EINTRAG)) schliesse(false)
    }, { signal })

    // Light Dismiss: Klick ausserhalb, Fokus verlaesst die Ellipsis
    dok.addEventListener('click', (e) => {
      if (offen() && !huelle.contains(/** @type {Node} */ (e.target))) schliesse(false)
    }, { signal, capture: true })
    huelle.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (nach && !huelle.contains(nach)) schliesse(false)
    }, { signal })
  }
}
