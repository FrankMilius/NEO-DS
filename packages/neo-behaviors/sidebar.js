// @ts-check
// ==========================================================================
// Sidebar — nach data/sidebar-recipe.json (keyboard, events)
// ==========================================================================
// Drei Dinge, alle ueber Knoepfe (Enter/Leertaste/Klick nativ) und mit den
// Zustaenden, die das SCSS (07-organisms/_sidebar.scss) kennt:
//   Untermenue   button.nc-sidebar__item[aria-expanded][aria-controls]
//                klappt den Container (__submenu-items) per [hidden] auf/zu
//   Einklappen   .nc-sidebar__toggle schaltet .nc-sidebar--collapsed,
//                aria-expanded und aria-label („Navigation einklappen" /
//                „ausklappen"). Eingeklappt sind die Labels unsichtbar —
//                Eintraege ohne aria-label bekommen dann ihren Text als
//                aria-label (beim Ausklappen wieder entfernt)
//   Mobil-Lage   ein Knopf mit aria-controls="<id der Sidebar>" ausserhalb
//                oeffnet (.nc-sidebar--open, Backdrop .nc-sidebar-backdrop
//                ohne [hidden], aria-expanded am Knopf), Fokus in die
//                Sidebar. Escape, Klick auf den Backdrop oder erneut der
//                Knopf schliessen, Fokus zurueck auf den Knopf. Das SCSS
//                zeigt --open nur unter md; darueber ist die Klasse wirkungslos.
//
// Ereignisse `sidebar-submenu-toggle` { value, open },
// `sidebar-collapse` { collapsed }, `sidebar-toggle` { open, reason } —
// reason: 'trigger', 'escape', 'overlay-click'.
// ==========================================================================
import { sende, fokussierbare, gesperrt } from './kern.js'

const UNTER = 'button.nc-sidebar__item[aria-controls]'
const EINKLAPPEN = 'Navigation einklappen'
const AUSKLAPPEN = 'Navigation ausklappen'

export const sidebar = {
  id: 'sidebar',
  selektor: '.nc-sidebar',
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const ziel = (knopf) => /** @type {HTMLElement|null} */ (dok.getElementById(knopf.getAttribute('aria-controls') || ''))
    const label = (el) => (el.querySelector('.nc-sidebar__item-label')?.textContent || el.getAttribute('aria-label') || el.textContent || '').trim()

    // --- Untermenue --------------------------------------------------------
    for (const k of wurzel.querySelectorAll(UNTER)) {
      const panel = ziel(k)
      if (!panel || !wurzel.contains(panel)) continue
      if (!k.hasAttribute('aria-expanded')) k.setAttribute('aria-expanded', String(!panel.hidden))
      panel.hidden = k.getAttribute('aria-expanded') !== 'true'
    }
    const klappe = (k) => {
      const panel = ziel(k)
      if (!panel || gesperrt(k)) return
      const an = k.getAttribute('aria-expanded') !== 'true'
      k.setAttribute('aria-expanded', String(an))
      panel.hidden = !an
      sende(wurzel, 'sidebar-submenu-toggle', { value: label(k), open: an })
    }

    // --- Einklappen --------------------------------------------------------
    const kopfKnopf = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-sidebar__toggle'))
    const vonUns = new Set() // aria-label, die das Behavior beim Einklappen gesetzt hat
    const klappeEin = (an) => {
      wurzel.classList.toggle('nc-sidebar--collapsed', an)
      if (kopfKnopf) {
        kopfKnopf.setAttribute('aria-expanded', String(!an))
        kopfKnopf.setAttribute('aria-label', an ? AUSKLAPPEN : EINKLAPPEN)
      }
      if (an) {
        for (const el of wurzel.querySelectorAll('.nc-sidebar__item:not(.nc-sidebar__item--sub)')) {
          if (el.hasAttribute('aria-label')) continue
          el.setAttribute('aria-label', label(el))
          vonUns.add(el)
        }
      } else {
        for (const el of vonUns) el.removeAttribute('aria-label')
        vonUns.clear()
      }
      sende(wurzel, 'sidebar-collapse', { collapsed: an })
    }
    if (kopfKnopf) kopfKnopf.setAttribute('aria-expanded', String(!wurzel.classList.contains('nc-sidebar--collapsed')))

    wurzel.addEventListener('click', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      const k = /** @type {HTMLElement|null} */ (el.closest(UNTER))
      if (k && wurzel.contains(k) && wurzel.contains(ziel(k))) { klappe(k); return }
      if (kopfKnopf && el.closest('.nc-sidebar__toggle') === kopfKnopf && !gesperrt(kopfKnopf)) klappeEin(!wurzel.classList.contains('nc-sidebar--collapsed'))
    }, { signal })

    // --- Mobil-Lage --------------------------------------------------------
    const hinten = /** @type {HTMLElement|null} */ (wurzel.parentElement?.querySelector(':scope > .nc-sidebar-backdrop') || null)
    const offen = () => wurzel.classList.contains('nc-sidebar--open')
    let oeffner = /** @type {HTMLElement|null} */ (null)
    if (hinten) hinten.hidden = !offen()

    const setze = (an, grund, knopf = null) => {
      if (offen() === an) return
      wurzel.classList.toggle('nc-sidebar--open', an)
      if (hinten) hinten.hidden = !an
      if (an) {
        oeffner = knopf
        oeffner?.setAttribute('aria-expanded', 'true')
        const start = /** @type {HTMLElement|null} */ (wurzel.querySelector('[aria-current="page"]')) || fokussierbare(wurzel)[0]
        start?.focus()
      } else {
        const zurueck = oeffner
        oeffner = null
        zurueck?.setAttribute('aria-expanded', 'false')
        if (zurueck && (wurzel.contains(dok.activeElement) || grund !== 'trigger')) zurueck.focus()
      }
      sende(wurzel, 'sidebar-toggle', { open: an, reason: grund })
    }

    if (wurzel.id) {
      for (const k of dok.querySelectorAll(`[aria-controls="${CSS.escape(wurzel.id)}"]`)) if (!wurzel.contains(k)) k.setAttribute('aria-expanded', String(offen()))
      dok.addEventListener('click', (e) => {
        const knopf = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[aria-controls]') || null)
        if (!knopf || knopf.getAttribute('aria-controls') !== wurzel.id || wurzel.contains(knopf) || gesperrt(knopf)) return
        e.preventDefault()
        if (offen()) setze(false, 'trigger')
        else setze(true, 'trigger', knopf)
      }, { signal })
    }
    hinten?.addEventListener('click', () => setze(false, 'overlay-click'), { signal })
    dok.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && offen()) { e.preventDefault(); setze(false, 'escape') }
    }, { signal })
  }
}
