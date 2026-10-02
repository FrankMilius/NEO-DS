// @ts-check
// ==========================================================================
// Navigationsmenue — nach data/navigation-menu-recipe.json (keyboard, events)
// ==========================================================================
// Menue-Leiste mit Panels (WAI-ARIA Menubar, Markup wie im SCSS und in
// website/js/site.js): ul.__list[role=menubar] > li.__item mit
// button.__trigger (Panel) oder a.__link--top (direkter Link). Der Inhalt
// .__content im Item ist nur Vorlage (das SCSS blendet ihn dort aus); offen
// zeigt ihn eine Kopie im Viewport (.__viewport-wrapper > .__viewport).
// Zustaende wie im SCSS: data-state="open|closed" an Ausloeser, Inhalt,
// Huelle und Viewport, aria-expanded am Ausloeser, data-motion fuer den
// Panel-Wechsel, Indikator data-state="visible|hidden" (Lage per left/width
// wie in site.js).
//   Leiste    roving tabindex (eine Tab-Station); Pfeil rechts/links
//             (rundum), Pos1, Ende; ist ein Panel offen, folgt es dem Fokus.
//             Pfeil runter, Enter, Leertaste oeffnen → erster Eintrag;
//             Pfeil hoch → letzter Eintrag
//   Panel     Pfeil runter/hoch (rundum), Pos1, Ende; Pfeil rechts/links
//             schliesst und geht zum naechsten/vorherigen Leisten-Eintrag
//             (dessen Panel oeffnet, Fokus bleibt in der Leiste); Escape
//             schliesst, Fokus zurueck; Tab schliesst und geht weiter
//   Maus      data-trigger="hover": oeffnet nach 150 ms Verweilen, schliesst
//             150 ms nach Verlassen (Viewport haelt offen);
//             data-trigger="click": nur Klick. Klick auf den Ausloeser
//             schaltet immer; Klick ausserhalb und Fokusverlust schliessen.
// Die Vorlagen im Item bekommen `inert` (sonst per Tab erreichbar und
// doppelt im Barrierefreiheits-Baum), die Kopie im Viewport nicht.
//
// Ereignis `navigation-menu-change` { value, previousValue } — Name des
// offenen Panels (Text des Ausloesers), null = alle zu.
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

const VERWEILEN = 150
const OBEN = ':scope > .nc-navigation-menu__item > .nc-navigation-menu__trigger, :scope > .nc-navigation-menu__item > .nc-navigation-menu__link--top'
const EINTRAG = '[role="menuitem"], a[href], button:not([disabled])'

export const navigationMenu = {
  id: 'navigation-menu',
  selektor: '.nc-navigation-menu',
  binde (wurzel, signal) {
    const leiste = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-navigation-menu__list'))
    if (!leiste) return
    const dok = wurzel.ownerDocument
    const huelle = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-navigation-menu__viewport-wrapper'))
    const sicht = /** @type {HTMLElement|null} */ (huelle?.querySelector(':scope > .nc-navigation-menu__viewport') || null)
    const zeiger = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-navigation-menu__indicator'))
    const perHover = wurzel.dataset.trigger !== 'click'

    const oben = () => /** @type {HTMLElement[]} */ ([...leiste.querySelectorAll(OBEN)])
    const istAusloeser = (el) => el.classList.contains('nc-navigation-menu__trigger')
    const vorlage = (a) => /** @type {HTMLElement|null} */ (a.parentElement?.querySelector(':scope > .nc-navigation-menu__content') || null)
    const name = (a) => (a.querySelector('span')?.textContent || a.textContent || '').trim()
    const eintraege = () => sicht ? /** @type {HTMLElement[]} */ ([...sicht.querySelectorAll(EINTRAG)]) : []
    let offen = /** @type {HTMLElement|null} */ (null)
    let uhr = 0

    // Startzustand: Vorlagen inert, eine Tab-Station in der Leiste
    for (const a of oben()) { const v = istAusloeser(a) && vorlage(a); if (v) v.setAttribute('inert', '') }
    const start = oben().find((a) => a.dataset.state === 'open' || a.dataset.current === 'true' || a.getAttribute('aria-current') === 'page') || oben()[0]
    const tabStopp = (el) => { for (const a of oben()) a.tabIndex = a === el ? 0 : -1 }
    if (start) tabStopp(start)
    for (const a of oben()) if (istAusloeser(a) && !a.hasAttribute('aria-expanded')) a.setAttribute('aria-expanded', 'false')

    const zustand = (el, an) => { if (el) el.dataset.state = an ? 'open' : 'closed' }

    const oeffne = (a, fokus = /** @type {'erster'|'letzter'|null} */ (null)) => {
      const v = vorlage(a)
      if (!sicht || !v || a.hasAttribute('disabled')) return
      clearTimeout(uhr)
      if (offen !== a) {
        const liste = oben()
        const vorher = offen
        if (vorher) {
          zustand(vorher, false)
          vorher.setAttribute('aria-expanded', 'false')
          const alt = vorlage(vorher)
          zustand(alt, false)
          if (alt) alt.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? 'to-start' : 'to-end'
        }
        offen = a
        zustand(a, true)
        a.setAttribute('aria-expanded', 'true')
        zustand(v, true)
        if (vorher) v.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? 'from-end' : 'from-start'
        else delete v.dataset.motion
        const kopie = /** @type {HTMLElement} */ (v.cloneNode(true))
        kopie.removeAttribute('inert')
        sicht.replaceChildren(kopie)
        for (const e of eintraege()) e.tabIndex = -1
        zustand(huelle, true)
        zustand(sicht, true)
        if (zeiger) {
          const r = a.getBoundingClientRect()
          const n = wurzel.getBoundingClientRect()
          zeiger.dataset.state = 'visible'
          zeiger.style.left = `${r.left - n.left + r.width / 2 - 5}px`
          zeiger.style.width = '10px'
        }
        sende(wurzel, 'navigation-menu-change', { value: name(a), previousValue: vorher ? name(vorher) : null })
      }
      if (fokus) {
        const liste = eintraege()
        ;(fokus === 'letzter' ? liste.at(-1) : liste[0])?.focus()
      }
    }

    const schliesse = (fokusZurueck = false) => {
      clearTimeout(uhr)
      const a = offen
      if (!a) return
      offen = null
      zustand(a, false)
      a.setAttribute('aria-expanded', 'false')
      zustand(vorlage(a), false)
      zustand(huelle, false)
      zustand(sicht, false)
      sicht?.replaceChildren()
      if (zeiger) zeiger.dataset.state = 'hidden'
      sende(wurzel, 'navigation-menu-change', { value: null, previousValue: name(a) })
      if (fokusZurueck) a.focus()
    }

    /** Fokus auf einen Leisten-Eintrag; ist ein Panel offen, folgt es. */
    const wechsle = (ziel, panelMit) => {
      tabStopp(ziel)
      ziel.focus()
      if (panelMit && istAusloeser(ziel)) oeffne(ziel)
      else if (panelMit) schliesse()
    }

    leiste.addEventListener('keydown', (e) => {
      const a = /** @type {HTMLElement} */ (e.target)
      if (!oben().includes(a)) return
      const ausloeser = istAusloeser(a)
      if (ausloeser && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); oeffne(a, 'erster'); return }
      if (ausloeser && e.key === 'ArrowUp') { e.preventDefault(); oeffne(a, 'letzter'); return }
      if (e.key === 'Escape') { if (offen) { e.preventDefault(); schliesse(true) } return }
      if (e.key === 'Tab') { schliesse(); return }
      const ziel = zielFuerTaste(e.key, oben(), a, 'horizontal')
      if (!ziel) return
      e.preventDefault()
      wechsle(ziel, !!offen)
    }, { signal })

    sicht?.addEventListener('keydown', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target)
      if (!offen || !eintraege().includes(eintrag)) return
      const a = offen
      if (e.key === 'Escape') { e.preventDefault(); schliesse(true); return }
      if (e.key === 'Tab') { schliesse(); return }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const ziel = zielFuerTaste(e.key, oben(), a, 'horizontal')
        schliesse()
        if (ziel) wechsle(ziel, true)
        return
      }
      const ziel = zielFuerTaste(e.key, eintraege(), eintrag, 'vertikal')
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })

    leiste.addEventListener('click', (e) => {
      const a = /** @type {HTMLElement} */ (e.target).closest('.nc-navigation-menu__trigger')
      if (!a || !leiste.contains(a)) return
      tabStopp(/** @type {HTMLElement} */ (a))
      if (offen === a) schliesse()
      else oeffne(/** @type {HTMLElement} */ (a))
    }, { signal })
    sicht?.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).closest('a[href]')) schliesse()
    }, { signal })

    leiste.addEventListener('focusin', (e) => {
      const a = /** @type {HTMLElement} */ (e.target)
      if (oben().includes(a) && a.tabIndex !== 0) tabStopp(a)
    }, { signal })

    // Maus (data-trigger="hover"): Verweilen oeffnet, Verlassen schliesst
    const spaeter = (fn) => { clearTimeout(uhr); uhr = window.setTimeout(fn, VERWEILEN) }
    if (perHover) {
      for (const a of oben().filter(istAusloeser)) {
        const item = /** @type {HTMLElement} */ (a.parentElement)
        item.addEventListener('mouseenter', () => spaeter(() => oeffne(a)), { signal })
        item.addEventListener('mouseleave', () => spaeter(() => schliesse()), { signal })
      }
      huelle?.addEventListener('mouseenter', () => clearTimeout(uhr), { signal })
      huelle?.addEventListener('mouseleave', () => spaeter(() => schliesse()), { signal })
    }
    signal.addEventListener('abort', () => {
      clearTimeout(uhr)
      for (const a of oben()) vorlage(a)?.removeAttribute('inert')
    })

    // Light Dismiss: Klick ausserhalb, Fokus verlaesst das Menue
    dok.addEventListener('click', (e) => {
      if (offen && !wurzel.contains(/** @type {Node} */ (e.target))) schliesse()
    }, { signal, capture: true })
    wurzel.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (offen && nach && !wurzel.contains(nach)) schliesse()
    }, { signal })
  }
}
