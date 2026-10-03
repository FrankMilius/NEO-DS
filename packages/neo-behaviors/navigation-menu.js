// @ts-check
// ==========================================================================
// Navigationsmenue — nach data/navigation-menu-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA Disclosure-Navigation (Recipe 3.0.0, Entscheidung 03.10.2026;
// https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).
// Markup:
//   nav.nc-navigation-menu[aria-label] > ul.__list > li.__item mit
//     button.__trigger[type=button][aria-expanded][aria-controls] + div.__content#id[hidden]
//     oder a.__link--top (aria-current="page" fuer die aktuelle Seite)
//   div.__indicator (dekorativ, data-state="visible|hidden")
// Keine Rollen menubar/menu/menuitem/none, kein roving tabindex: jeder Link
// und jeder Ausloeser der obersten Ebene ist eine eigene Tab-Station. Das
// Panel liegt im Item direkt nach seinem Ausloeser, die Tab-Folge fuehrt
// also vom offenen Ausloeser in sein Panel. Offen = aria-expanded="true" am
// Ausloeser und kein [hidden] am Panel (das SCSS liest genau das).
//   Ausloeser  Enter/Leertaste (nativer Klick) und Klick schalten das Panel
//   Escape     schliesst das offene Panel, Fokus auf dessen Ausloeser
//   Pfeile     (optional, APG erlaubt es) Pfeil rechts/links, Pos1, Ende
//              zwischen den Eintraegen der obersten Ebene (rundum, Panel
//              bleibt wie es ist); Pfeil runter auf einem Ausloeser oeffnet
//              und fokussiert den ersten Link im Panel; im Panel Pfeil
//              runter/hoch (rundum), Pos1, Ende zwischen den Links
//   Schliessen Fokus verlaesst das offene Item (Tab weiter, anderer
//              Eintrag) oder das Menue, Klick ausserhalb, Klick auf einen
//              Link im Panel; es ist immer hoechstens ein Panel offen
//   Maus       data-trigger="hover": oeffnet nach 150 ms Verweilen am Item,
//              schliesst 150 ms nach Verlassen (das Panel gehoert zum Item);
//              data-trigger="click": nur Klick
// Panel-Wechsel: data-motion (from-start|from-end) am neuen Panel fuer die
// Animation im SCSS. Indikator: Lage per Custom Property
// --_indicator-left/--_indicator-width.
//
// Ereignis `navigation-menu-change` { value, previousValue } — Name des
// offenen Panels (Text des Ausloesers), null = alle zu.
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

const VERWEILEN = 150
const OBEN = ':scope > .nc-navigation-menu__item > .nc-navigation-menu__trigger, :scope > .nc-navigation-menu__item > .nc-navigation-menu__link--top'
const LINK = 'a[href], button:not([disabled])'
let laufnummer = 0

export const navigationMenu = {
  id: 'navigation-menu',
  selektor: '.nc-navigation-menu',
  binde (wurzel, signal) {
    const leiste = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-navigation-menu__list'))
    if (!leiste) return
    const dok = wurzel.ownerDocument
    const zeiger = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-navigation-menu__indicator'))
    const perHover = wurzel.dataset.trigger !== 'click'

    const oben = () => /** @type {HTMLElement[]} */ ([...leiste.querySelectorAll(OBEN)])
    const istAusloeser = (el) => el.classList.contains('nc-navigation-menu__trigger')
    const ausloeser = () => oben().filter(istAusloeser)
    /** Panel eines Ausloesers: der Nachbar im Item, sonst per aria-controls (zuerst im Menue). */
    const panel = (a) => {
      const nachbar = a.parentElement?.querySelector(':scope > .nc-navigation-menu__content')
      if (nachbar) return /** @type {HTMLElement} */ (nachbar)
      const id = a.getAttribute('aria-controls')
      if (!id) return null
      return /** @type {HTMLElement|null} */ (wurzel.querySelector(`[id="${CSS.escape(id)}"]`) || dok.getElementById(id))
    }
    const name = (a) => (a.querySelector('span')?.textContent || a.textContent || '').trim()
    const links = (a) => { const p = panel(a); return p ? /** @type {HTMLElement[]} */ ([...p.querySelectorAll(LINK)]) : [] }
    let offen = /** @type {HTMLElement|null} */ (null)
    let uhr = 0

    // Startzustand: jeder Ausloeser mit aria-expanded und aria-controls,
    // jedes Panel ohne offenen Ausloeser [hidden]
    for (const a of ausloeser()) {
      const p = panel(a)
      if (!p) continue
      if (!p.id) p.id = `nc-navigation-menu-panel-${++laufnummer}`
      a.setAttribute('aria-controls', p.id)
      const auf = a.getAttribute('aria-expanded') === 'true' && !offen
      a.setAttribute('aria-expanded', String(auf))
      p.hidden = !auf
      if (auf) offen = a
    }

    const zeigerAuf = (a) => {
      if (!zeiger) return
      if (!a) { zeiger.dataset.state = 'hidden'; return }
      const r = a.getBoundingClientRect()
      const n = wurzel.getBoundingClientRect()
      zeiger.dataset.state = 'visible'
      zeiger.style.setProperty('--_indicator-left', `${r.left - n.left + r.width / 2 - 5}px`)
      zeiger.style.setProperty('--_indicator-width', '10px')
    }
    if (offen) zeigerAuf(offen)

    const zu = (a) => {
      a.setAttribute('aria-expanded', 'false')
      const p = panel(a)
      if (p) p.hidden = true
    }

    const oeffne = (a) => {
      const p = panel(a)
      clearTimeout(uhr)
      if (!p || a.hasAttribute('disabled') || offen === a) return
      const vorher = offen
      const liste = oben()
      if (vorher) zu(vorher)
      offen = a
      a.setAttribute('aria-expanded', 'true')
      if (vorher) p.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? 'from-end' : 'from-start'
      else delete p.dataset.motion
      p.hidden = false
      zeigerAuf(a)
      sende(wurzel, 'navigation-menu-change', { value: name(a), previousValue: vorher ? name(vorher) : null })
    }

    const schliesse = (fokusZurueck = false) => {
      clearTimeout(uhr)
      const a = offen
      if (!a) return
      offen = null
      zu(a)
      zeigerAuf(null)
      sende(wurzel, 'navigation-menu-change', { value: null, previousValue: name(a) })
      if (fokusZurueck) a.focus()
    }

    wurzel.addEventListener('keydown', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      if (e.key === 'Escape') {
        if (offen) { e.preventDefault(); schliesse(true) }
        return
      }
      // Oberste Ebene: Pfeil rechts/links, Pos1, Ende; Pfeil runter ins Panel
      if (oben().includes(el)) {
        if (e.key === 'ArrowDown' && istAusloeser(el)) {
          e.preventDefault()
          oeffne(el)
          links(el)[0]?.focus()
          return
        }
        const ziel = zielFuerTaste(e.key, oben(), el, 'horizontal')
        if (!ziel) return
        e.preventDefault()
        ziel.focus()
        return
      }
      // Im offenen Panel: Pfeil runter/hoch, Pos1, Ende zwischen den Links
      if (offen) {
        const liste = links(offen)
        if (!liste.includes(el)) return
        const ziel = zielFuerTaste(e.key, liste, el, 'vertikal')
        if (!ziel) return
        e.preventDefault()
        ziel.focus()
      }
    }, { signal })

    leiste.addEventListener('click', (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      const a = /** @type {HTMLElement|null} */ (ziel.closest('.nc-navigation-menu__trigger'))
      if (a && leiste.contains(a)) {
        if (offen === a) schliesse()
        else oeffne(a)
        return
      }
      if (offen && ziel.closest('a[href]') && panel(offen)?.contains(ziel)) schliesse()
    }, { signal })

    // Fokus verlaesst das offene Item (anderer Eintrag, Tab hinaus) → zu.
    // Ausnahme: Mausdruck auf einen anderen Ausloeser — der Klick wechselt
    // dann direkt das Panel (ein Ereignis, Animation mit Richtung).
    let druck = /** @type {HTMLElement|null} */ (null)
    leiste.addEventListener('mousedown', (e) => {
      druck = /** @type {HTMLElement} */ (e.target).closest('.nc-navigation-menu__trigger')
      window.setTimeout(() => { druck = null }, 0)
    }, { signal })
    wurzel.addEventListener('focusin', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      if (!offen || offen.parentElement?.contains(el) || (druck && druck === el)) return
      schliesse()
    }, { signal })
    wurzel.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (offen && nach && !wurzel.contains(nach)) schliesse()
    }, { signal })

    // Maus (data-trigger="hover"): Verweilen oeffnet, Verlassen schliesst
    const spaeter = (fn) => { clearTimeout(uhr); uhr = window.setTimeout(fn, VERWEILEN) }
    if (perHover) {
      for (const a of ausloeser()) {
        const item = /** @type {HTMLElement} */ (a.parentElement)
        item.addEventListener('mouseenter', () => spaeter(() => oeffne(a)), { signal })
        item.addEventListener('mouseleave', () => spaeter(() => { if (offen === a) schliesse() }), { signal })
      }
    }
    signal.addEventListener('abort', () => clearTimeout(uhr))

    // Light Dismiss: Klick ausserhalb
    dok.addEventListener('click', (e) => {
      if (offen && !wurzel.contains(/** @type {Node} */ (e.target))) schliesse()
    }, { signal, capture: true })
  }
}
