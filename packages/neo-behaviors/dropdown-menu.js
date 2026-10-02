// @ts-check
// ==========================================================================
// Dropdown-Menue — nach data/dropdown-menu-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA Menu Button: .nc-dropdown__trigger (aria-haspopup,
// aria-expanded) oeffnet/schliesst .nc-dropdown__menu (role="menu",
// versteckt per [hidden]).
//   Oeffnen    Klick, Enter, Leertaste, Pfeil runter → erster Eintrag;
//              Pfeil hoch → letzter Eintrag
//   Im Menue   Pfeil hoch/runter (rundum), Pos1, Ende; Enter/Leertaste
//              loesen den Eintrag aus (nativ als Klick); Escape schliesst,
//              Fokus zurueck auf den Ausloeser; Tab schliesst und geht weiter
//   Untermenue Eintrag mit aria-haspopup="menu" (.nc-dropdown__item--has-submenu):
//              Pfeil rechts, Enter, Klick oeffnen und fokussieren den ersten
//              Eintrag; Pfeil links/Escape schliessen und fokussieren den Eltern-
//              eintrag; Maus: oeffnet nach 300 ms Verweilen
//   Auswahl    menuitemradio: genau einer je Gruppe (aria-checked +
//              .nc-dropdown__item--checked), Menue schliesst;
//              menuitemcheckbox: schaltet um, Menue bleibt offen
//   Aussen     Klick ausserhalb oder Fokus verlaesst das Bauteil → zu
// Gesperrte Eintraege (disabled/aria-disabled) werden uebersprungen.
//
// Ereignisse `dropdown-toggle` { open }, `dropdown-select` { value, checked }
// (checked = null bei reinen Aktionen).
// ==========================================================================
import { sende, zielFuerTaste, ersterBedienbar, gesperrt } from './kern.js'

const EINTRAG = '.nc-dropdown__item'
const VERWEILEN = 300

export const dropdownMenu = {
  id: 'dropdown-menu',
  selektor: '.nc-dropdown',
  binde (wurzel, signal) {
    const ausloeser = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-dropdown__trigger'))
    const menue = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-dropdown__menu'))
    if (!ausloeser || !menue) return
    const dok = wurzel.ownerDocument

    /** Eintraege genau dieses Menues (ohne die der Untermenues). */
    const eintraege = (m) => /** @type {HTMLElement[]} */ ([...m.querySelectorAll(EINTRAG)]).filter((e) => e.closest('.nc-dropdown__menu') === m)
    const untermenue = (eintrag) => /** @type {HTMLElement|null} */ (eintrag.querySelector(':scope > .nc-dropdown__menu'))
    const offen = () => !menue.hidden

    for (const e of wurzel.querySelectorAll(EINTRAG)) /** @type {HTMLElement} */ (e).tabIndex = -1
    if (!ausloeser.hasAttribute('aria-haspopup')) ausloeser.setAttribute('aria-haspopup', 'true')
    ausloeser.setAttribute('aria-expanded', String(offen()))

    const unterZu = (eintrag) => {
      const u = untermenue(eintrag)
      if (!u || u.hidden) return
      for (const e of eintraege(u)) if (untermenue(e)) unterZu(e)
      u.hidden = true
      eintrag.setAttribute('aria-expanded', 'false')
    }
    const unterAuf = (eintrag, fokus) => {
      const u = untermenue(eintrag)
      if (!u || gesperrt(eintrag)) return
      // Geschwister-Untermenues schliessen
      const eltern = /** @type {HTMLElement} */ (eintrag.closest('.nc-dropdown__menu'))
      for (const e of eintraege(eltern)) if (e !== eintrag) unterZu(e)
      u.hidden = false
      eintrag.setAttribute('aria-expanded', 'true')
      if (fokus) ersterBedienbar(eintraege(u))?.focus()
    }

    const setze = (an, fokus = null) => {
      if (offen() !== an) {
        menue.hidden = !an
        ausloeser.setAttribute('aria-expanded', String(an))
        if (!an) for (const e of eintraege(menue)) unterZu(e)
        sende(wurzel, 'dropdown-toggle', { open: an })
      }
      if (an && fokus) ersterBedienbar(eintraege(menue), fokus === 'letzter')?.focus()
    }
    const schliesse = (fokusZurueck) => {
      if (!offen()) return
      setze(false)
      if (fokusZurueck) ausloeser.focus()
    }

    const loese = (eintrag) => {
      if (gesperrt(eintrag)) return
      if (untermenue(eintrag)) { unterAuf(eintrag, true); return }
      const rolle = eintrag.getAttribute('role')
      let checked = null
      if (rolle === 'menuitemradio') {
        const gruppe = eintrag.closest('.nc-dropdown__group, [role="group"]') || eintrag.closest('.nc-dropdown__menu')
        for (const e of eintraege(/** @type {HTMLElement} */ (eintrag.closest('.nc-dropdown__menu')))) {
          if (e.getAttribute('role') !== 'menuitemradio' || !gruppe.contains(e)) continue
          e.setAttribute('aria-checked', String(e === eintrag))
          e.classList.toggle('nc-dropdown__item--checked', e === eintrag)
        }
        checked = true
      } else if (rolle === 'menuitemcheckbox') {
        checked = eintrag.getAttribute('aria-checked') !== 'true'
        eintrag.setAttribute('aria-checked', String(checked))
        eintrag.classList.toggle('nc-dropdown__item--checked', checked)
      }
      const label = eintrag.querySelector('.nc-dropdown__item-label') || eintrag
      sende(wurzel, 'dropdown-select', { value: eintrag.dataset.value || label.textContent.trim(), checked })
      if (rolle !== 'menuitemcheckbox') schliesse(true)
    }

    ausloeser.addEventListener('click', () => {
      if (gesperrt(ausloeser)) return
      if (offen()) schliesse(false)
      else setze(true, 'erster')
    }, { signal })
    ausloeser.addEventListener('keydown', (e) => {
      if (gesperrt(ausloeser)) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setze(true, 'erster') }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setze(true, 'letzter') }
      else if (e.key === 'Escape') schliesse(true)
    }, { signal })

    menue.addEventListener('click', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target).closest(EINTRAG)
      // closest() liefert im Untermenue den innersten Eintrag
      if (eintrag && menue.contains(eintrag)) loese(eintrag)
    }, { signal })

    menue.addEventListener('keydown', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target).closest(EINTRAG)
      if (!eintrag) return
      const eigenesMenue = /** @type {HTMLElement} */ (eintrag.closest('.nc-dropdown__menu'))
      const elternEintrag = eigenesMenue === menue ? null : /** @type {HTMLElement|null} */ (eigenesMenue.closest(EINTRAG))
      if (e.key === 'Escape' || (e.key === 'ArrowLeft' && elternEintrag)) {
        e.preventDefault()
        if (elternEintrag) { unterZu(elternEintrag); elternEintrag.focus() } else schliesse(true)
        return
      }
      if (e.key === 'ArrowRight' && untermenue(eintrag)) { e.preventDefault(); unterAuf(eintrag, true); return }
      if (e.key === 'Tab') { schliesse(false); return }
      const ziel = zielFuerTaste(e.key, eintraege(eigenesMenue), eintrag, 'vertikal')
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })

    // Maus: Untermenue nach kurzem Verweilen oeffnen, beim Verlassen schliessen
    let uhr = 0
    menue.addEventListener('mouseover', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target).closest(EINTRAG)
      if (!eintrag) return
      clearTimeout(uhr)
      uhr = window.setTimeout(() => {
        const eltern = /** @type {HTMLElement} */ (eintrag.closest('.nc-dropdown__menu'))
        for (const x of eintraege(eltern)) if (x !== eintrag) unterZu(x)
        if (untermenue(eintrag)) unterAuf(eintrag, false)
      }, VERWEILEN)
    }, { signal })
    signal.addEventListener('abort', () => clearTimeout(uhr))

    // Light Dismiss: Klick ausserhalb, Fokus verlaesst das Bauteil
    dok.addEventListener('click', (e) => {
      if (offen() && !wurzel.contains(/** @type {Node} */ (e.target))) schliesse(false)
    }, { signal, capture: true })
    wurzel.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (nach && !wurzel.contains(nach)) schliesse(false)
    }, { signal })
  }
}
