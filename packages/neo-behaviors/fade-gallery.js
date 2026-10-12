// @ts-check
// ==========================================================================
// Fade-Gallery — nach data/fade-gallery-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6a, 12.10.2026). Ersetzt in
// neo_fe/js/neo-theme.js den Ueberblendungs-Zweig von
// Drupal.behaviors.neoFadeGallery. Das Markup steht seit 20.08.2026 im Twig
// (block--block-content--neo-fade-gallery.html.twig, field_fg_display =
// fade); hier wird nur umgeschaltet. Der Geraete-Zweig desselben Blocks ist
// das Behavior carousel.
//
// Markup (fertig): .nc-fade-gallery > .nc-fade-gallery__viewport >
// .nc-fade-gallery__media[role=tabpanel][id]; .nc-fade-gallery__nav-row >
// Paddles [data-fg-prev|next] bzw. .nc-gallery__paddle--prev|--next und
// .nc-fade-gallery__tabs[role=tablist] > .nc-fade-gallery__tab[role=tab]
// [aria-controls]; .nc-fade-gallery__caption[aria-live] >
// .nc-fade-gallery__desc[data-fg-desc=<Nr>] (ohne Angabe nach Reihenfolge).
//
//   Tabs     Tabs-Muster (automatische Aktivierung): aria-selected, wandernder
//            tabindex (nur der gewaehlte Tab in der Tab-Folge), aria-controls
//            auf das Medium (ids aus der Wurzel, falls sie fehlen). Auf einem
//            Tab Pfeil rechts/links rundum, Pos1, Ende — waehlen und
//            fokussieren. Enter/Leertaste: nativer Klick.
//   Paddles  blaettern rundum (wie bisher).
//   Ansicht  Medium .is-active, die anderen aria-hidden; die Beschreibung der
//            Ansicht wird sichtbar (hidden weg, im naechsten Bild .is-visible —
//            sonst startet die Blende des SCSS nicht), die anderen [hidden].
//   Anfang   der Tab mit aria-selected="true", sonst der erste.
//
// Ereignis: `fade-gallery-change` { index, previousIndex } bei jedem Wechsel.
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

let zaehler = 0

export const fadeGallery = {
  id: 'fade-gallery',
  selektor: '.nc-fade-gallery',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const medien = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__media')])
    const tabs = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__tab')])
    const texte = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__desc')])
    // Eine Ansicht allein braucht kein Umschalten (wie neoFadeGallery)
    if (medien.length < 2) return
    const ansicht = wurzel.ownerDocument.defaultView || window
    const liste = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-fade-gallery__tabs'))
    const zurueck = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-fg-prev], .nc-gallery__paddle--prev'))
    const vor = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-fg-next], .nc-gallery__paddle--next'))

    // --- ids und Tabs-Muster (das Twig liefert sie; die Arena ebenso) -------
    const basis = wurzel.id || 'nc-fade-gallery-' + (++zaehler)
    const vergeben = []
    const rollen = []
    const merkeRolle = (el, rolle) => {
      if (el.getAttribute('role') === rolle) return
      rollen.push([el, el.getAttribute('role')])
      el.setAttribute('role', rolle)
    }
    if (liste) merkeRolle(liste, 'tablist')
    medien.forEach((m, i) => {
      if (!m.id) { m.id = `${basis}-p${i}`; vergeben.push(m) }
      merkeRolle(m, 'tabpanel')
      const t = tabs[i]
      if (!t) return
      if (!t.id) { t.id = `${basis}-t${i}`; vergeben.push(t) }
      merkeRolle(t, 'tab')
      if (!t.hasAttribute('aria-controls')) { t.setAttribute('aria-controls', m.id); vergeben.push([t, 'aria-controls']) }
      if (!m.hasAttribute('aria-labelledby')) { m.setAttribute('aria-labelledby', t.id); vergeben.push([m, 'aria-labelledby']) }
    })

    /** Beschreibung zur Ansicht nr (data-fg-desc, sonst Reihenfolge) */
    const textVon = (el, k) => el.dataset.fgDesc !== undefined ? Number(el.dataset.fgDesc) : k

    let jetzt = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'))
    if (jetzt >= medien.length) jetzt = 0
    let bild = 0

    /** Zustand setzen (ohne Ereignis) */
    function zeige (nr) {
      jetzt = nr
      medien.forEach((m, i) => {
        m.classList.toggle('is-active', i === nr)
        if (i === nr) m.removeAttribute('aria-hidden')
        else m.setAttribute('aria-hidden', 'true')
      })
      tabs.forEach((t, i) => {
        t.setAttribute('aria-selected', String(i === nr))
        t.tabIndex = i === nr ? 0 : -1
      })
      ansicht.cancelAnimationFrame?.(bild)
      const sichtbar = []
      texte.forEach((p, k) => {
        if (textVon(p, k) === nr) { p.hidden = false; sichtbar.push(p) }
        else { p.classList.remove('is-visible'); p.hidden = true }
      })
      // Erst sichtbar machen, dann einblenden — sonst gibt es keinen
      // Zustand, von dem aus die Blende laufen koennte.
      if (sichtbar.length) {
        if (typeof ansicht.requestAnimationFrame === 'function') bild = ansicht.requestAnimationFrame(() => { for (const p of sichtbar) p.classList.add('is-visible') })
        else for (const p of sichtbar) p.classList.add('is-visible')
      }
    }

    /** @param {number} nr @param {boolean} [fokus] */
    function waehle (nr, fokus = false) {
      nr = (nr + medien.length) % medien.length
      const vorher = jetzt
      if (fokus) tabs[nr]?.focus()
      if (nr === vorher) return
      zeige(nr)
      sende(wurzel, 'fade-gallery-change', { index: nr, previousIndex: vorher })
    }

    // Anfang: nur die Zustaende angleichen (die sichtbare Beschreibung
    // behaelt is-visible, ohne neu einzublenden)
    medien.forEach((m, i) => { m.classList.toggle('is-active', i === jetzt); if (i === jetzt) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true') })
    tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === jetzt)); t.tabIndex = i === jetzt ? 0 : -1 })
    texte.forEach((p, k) => {
      const an = textVon(p, k) === jetzt
      p.hidden = !an
      p.classList.toggle('is-visible', an)
    })

    const tabVon = (e) => /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('.nc-fade-gallery__tab'))
    wurzel.addEventListener('click', (e) => {
      const tab = tabVon(e)
      if (tab && tabs.includes(tab)) waehle(tabs.indexOf(tab))
    }, { signal })
    wurzel.addEventListener('keydown', (e) => {
      const tab = tabVon(e)
      if (!tab || !tabs.includes(tab)) return
      const ziel = zielFuerTaste(e.key, tabs, tab, 'horizontal')
      if (!ziel) return
      e.preventDefault()
      waehle(tabs.indexOf(ziel), true)
    }, { signal })
    zurueck?.addEventListener('click', () => waehle(jetzt - 1), { signal })
    vor?.addEventListener('click', () => waehle(jetzt + 1), { signal })

    signal.addEventListener('abort', () => {
      ansicht.cancelAnimationFrame?.(bild)
      for (const v of vergeben) {
        if (Array.isArray(v)) v[0].removeAttribute(v[1])
        else v.removeAttribute('id')
      }
      for (const [el, rolle] of rollen) {
        if (rolle === null) el.removeAttribute('role')
        else el.setAttribute('role', rolle)
      }
    })
  }
}
