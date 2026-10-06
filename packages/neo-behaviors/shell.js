// @ts-check
// ==========================================================================
// Shell — nach data/shell-recipe.json (keyboard, events)
// ==========================================================================
// Drawer der Shell in der Mobil-Lage (unter lg; Entscheidung 06.10.2026,
// shell-verhalten). Das SCSS (08-templates/_shell.scss) kennt die Zustaende
// schon: unter lg sind .nc-shell__sidebar-left/-right feste Off-Canvas-
// Panels, .nc-shell--sidebar-{seite}-drawer-open faehrt sie herein,
// .nc-shell__sidebar-overlay--visible zeigt den Backdrop. Das Behavior
// schaltet nur diese Klassen und kuemmert sich um Fokus und ARIA:
//
//   Oeffnen      ein Knopf mit aria-controls="<id der Sidebar>" (ueblich in
//                der Navbar, [data-shell-toggle]) — aria-expanded am Knopf,
//                Fokus auf das erste bedienbare Element der Sidebar (sonst
//                auf die Sidebar selbst, tabindex="-1" fuer die Dauer).
//                Es ist hoechstens ein Drawer offen: der andere schliesst.
//   Falle        Tab/Shift+Tab bleiben in der Sidebar (fokusFalle aus
//                kern.js); der Rest der Seite wird inert — Geschwister der
//                Sidebar und ihrer Vorfahren bis <body>, ausser dem Overlay.
//                Beim Schliessen (und Abbinden) nimmt das Behavior nur das
//                inert zurueck, das es selbst gesetzt hat (wie sidebar.js).
//   Schliessen   Escape, Klick auf das Overlay, erneut der Knopf (nur ohne
//                Falle erreichbar) oder die Shell verlaesst die Mobil-Lage
//                (Fenster waechst ueber lg). Fokus zurueck zum Ausloeser.
//   Overlay      .nc-shell__sidebar-overlay im Markup (Kind der Shell);
//                fehlt es, legt das Behavior beim ersten Oeffnen eines an
//                (aria-hidden="true") und entfernt es beim Abbinden.
//
// Mobil-Lage = die Sidebar ist position: fixed (so setzt sie das SCSS unter
// lg; die Arena stellt dieselbe Lage im Rahmen ra-fenster--mobil dar).
// Ab lg tut der Knopf nichts — Einklappen auf dem Desktop
// (.nc-shell--sidebar-*-collapsed) ist nicht Teil dieses Verhaltens.
//
// Ereignis `shell-drawer-toggle` { side, open, reason } — side: 'left' |
// 'right'; reason: 'trigger', 'escape', 'overlay-click', 'resize'.
// ==========================================================================
import { sende, fokussierbare, fokusFalle, gesperrt } from './kern.js'

const SEITEN = /** @type {const} */ (['left', 'right'])
const OFFEN = (seite) => `nc-shell--sidebar-${seite}-drawer-open`
const SICHTBAR = 'nc-shell__sidebar-overlay--visible'

export const shell = {
  id: 'shell',
  selektor: '.nc-shell',
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const ansicht = dok.defaultView
    const leiste = (seite) => /** @type {HTMLElement|null} */ (wurzel.querySelector(`.nc-shell__sidebar-${seite}`))
    const seiteVon = (el) => SEITEN.find((s) => leiste(s) === el) || null
    const istMobil = (el) => ansicht?.getComputedStyle(el).position === 'fixed'

    let overlay = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-shell__sidebar-overlay'))
    let eigenesOverlay = false
    const holeOverlay = () => {
      if (overlay) return overlay
      overlay = dok.createElement('div')
      overlay.className = 'nc-shell__sidebar-overlay'
      overlay.setAttribute('aria-hidden', 'true')
      wurzel.append(overlay)
      eigenesOverlay = true
      overlay.addEventListener('click', () => { if (offen) schliesse('overlay-click') }, { signal })
      return overlay
    }

    /** @type {null | { seite: 'left'|'right', panel: HTMLElement, knopf: HTMLElement|null, tabindex: boolean }} */
    let offen = null
    const vonUnsInert = /** @type {Set<Element>} */ (new Set())
    const sperreRest = (panel) => {
      for (let el = /** @type {Element} */ (panel); el.parentElement && el !== dok.body; el = el.parentElement) {
        for (const g of el.parentElement.children) {
          if (g === el || g === overlay || g.hasAttribute('inert')) continue
          g.setAttribute('inert', '')
          vonUnsInert.add(g)
        }
      }
    }
    const gibRestFrei = () => {
      for (const g of vonUnsInert) g.removeAttribute('inert')
      vonUnsInert.clear()
    }
    const knoepfeFuer = (panel) => panel.id
      ? /** @type {HTMLElement[]} */ ([...dok.querySelectorAll(`[aria-controls="${CSS.escape(panel.id)}"]`)]).filter((k) => !panel.contains(k))
      : []

    function oeffne (seite, panel, knopf) {
      if (offen) schliesse('trigger', false)
      wurzel.classList.add(OFFEN(seite))
      holeOverlay().classList.add(SICHTBAR)
      for (const k of knoepfeFuer(panel)) k.setAttribute('aria-expanded', 'true')
      sperreRest(panel)
      const start = fokussierbare(panel)[0]
      const tabindex = !start && !panel.hasAttribute('tabindex')
      if (tabindex) panel.setAttribute('tabindex', '-1')
      offen = { seite, panel, knopf, tabindex }
      ;(start || panel).focus()
      sende(wurzel, 'shell-drawer-toggle', { side: seite, open: true, reason: 'trigger' })
    }

    function schliesse (grund, fokusZurueck = true) {
      if (!offen) return
      const { seite, panel, knopf, tabindex } = offen
      offen = null
      wurzel.classList.remove(OFFEN(seite))
      overlay?.classList.remove(SICHTBAR)
      gibRestFrei()
      for (const k of knoepfeFuer(panel)) k.setAttribute('aria-expanded', 'false')
      const fokusDrin = panel.contains(dok.activeElement)
      if (tabindex) panel.removeAttribute('tabindex')
      if (fokusZurueck && knopf && (fokusDrin || grund !== 'trigger')) knopf.focus()
      sende(wurzel, 'shell-drawer-toggle', { side: seite, open: false, reason: grund })
    }

    // Anfangszustand der Knoepfe
    for (const seite of SEITEN) {
      const panel = leiste(seite)
      if (panel) for (const k of knoepfeFuer(panel)) k.setAttribute('aria-expanded', String(wurzel.classList.contains(OFFEN(seite))))
    }

    dok.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[aria-controls]') || null)
      if (!knopf || gesperrt(knopf)) return
      const panel = dok.getElementById(knopf.getAttribute('aria-controls') || '')
      const seite = panel && wurzel.contains(panel) ? seiteVon(panel) : null
      if (!panel || !seite || panel.contains(knopf) || !istMobil(panel)) return
      e.preventDefault()
      if (offen?.panel === panel) schliesse('trigger')
      else oeffne(seite, panel, knopf)
    }, { signal })

    overlay?.addEventListener('click', () => { if (offen) schliesse('overlay-click') }, { signal })

    dok.addEventListener('keydown', (e) => {
      if (!offen) return
      if (e.key === 'Escape') { e.preventDefault(); schliesse('escape') }
      else if (wurzel.isConnected) fokusFalle(e, offen.panel)
    }, { signal })

    // Mobil-Lage verlassen (Fenster waechst ueber lg): Drawer zu, Rest frei
    ansicht?.addEventListener('resize', () => { if (offen && !istMobil(offen.panel)) schliesse('resize') }, { signal })

    signal.addEventListener('abort', () => {
      if (offen) {
        wurzel.classList.remove(OFFEN(offen.seite))
        if (offen.tabindex) offen.panel.removeAttribute('tabindex')
        offen = null
      }
      gibRestFrei()
      overlay?.classList.remove(SICHTBAR)
      if (eigenesOverlay) { overlay?.remove(); overlay = null }
    })
  }
}
