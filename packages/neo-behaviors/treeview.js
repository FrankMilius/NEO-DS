// @ts-check
// ==========================================================================
// Treeview — nach data/treeview-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA Tree View. Markup wie im SCSS (06-molecules/_treeview.scss):
// ul[role=tree] > li.nc-treeview__item[role=treeitem] (aria-expanded an
// Zweigen, aria-selected bzw. im Checkbox-Modus aria-checked) mit der
// fokussierbaren Zeile .nc-treeview__node (roving tabindex: genau eine Zeile
// im Tab-Fluss) und den Kindern in .nc-treeview__children > ul[role=group].
//   Pfeil runter/hoch   naechster/vorheriger sichtbarer Eintrag (kein Rundum)
//   Pfeil rechts        Zweig zu → aufklappen; Zweig offen → erstes Kind
//   Pfeil links         Zweig offen → zuklappen; sonst → Eltern-Eintrag
//   Pos1 / Ende         erster / letzter sichtbarer Eintrag
//   Enter / Leertaste   auswaehlen (single) bzw. anhaken (multiple); steht
//                       ein .nc-treeview__link in der Zeile, folgt Enter ihm
//   Klick               Zeile waehlt bzw. hakt an; der Chevron
//                       (.nc-treeview__toggle) klappt nur auf/zu; Aktionen
//                       und Ziehgriff bleiben unberuehrt
// Auswahl single: aria-selected an allen Eintraegen + .nc-treeview__item--
// selected (das SCSS gestaltet die Auswahl ueber die Klasse). multiple
// (aria-multiselectable bzw. .nc-treeview--checkboxes): Anhaken schaltet den
// Eintrag samt Nachfahren; Eltern werden true/false/mixed, die Checkbox
// zeigt dasselbe (checked/indeterminate).
// Gesperrte Eintraege (aria-disabled, --disabled) werden uebersprungen.
// Zuklappen mit dem Fokus darin holt den Fokus auf den Zweig zurueck.
//
// Ereignisse `treeview-toggle` { value, expanded },
// `treeview-select` { value, selected, values } (values: alle gewaehlten).
// ==========================================================================
import { sende, gesperrt } from './kern.js'

const EINTRAG = '.nc-treeview__item'

export const treeview = {
  id: 'treeview',
  selektor: '.nc-treeview',
  binde (wurzel, signal) {
    const baum = /** @type {HTMLElement|null} */ (wurzel.querySelector('[role="tree"]') || wurzel.querySelector('.nc-treeview__list'))
    if (!baum) return
    const mehrfach = baum.getAttribute('aria-multiselectable') === 'true' || wurzel.classList.contains('nc-treeview--checkboxes')

    const alle = () => /** @type {HTMLElement[]} */ ([...baum.querySelectorAll(EINTRAG)])
    const zeile = (li) => /** @type {HTMLElement|null} */ (li.querySelector(':scope > .nc-treeview__node'))
    const eltern = (li) => {
      const p = /** @type {HTMLElement|null} */ (li.parentElement?.closest(EINTRAG) || null)
      return p && baum.contains(p) ? p : null
    }
    const kinder = (li) => alle().filter((x) => eltern(x) === li)
    const zweig = (li) => li.hasAttribute('aria-expanded')
    const offen = (li) => li.getAttribute('aria-expanded') === 'true'
    const gesperrtE = (li) => gesperrt(li) || li.classList.contains('nc-treeview__item--disabled')
    const sichtbar = (li) => { for (let p = eltern(li); p; p = eltern(p)) if (!offen(p)) return false; return true }
    const bedienbar = () => alle().filter((li) => sichtbar(li) && !gesperrtE(li) && zeile(li))
    const wertVon = (li) => li.dataset.value || (zeile(li)?.querySelector('.nc-treeview__label, .nc-treeview__link')?.textContent || '').trim()
    const gewaehlt = (li) => li.getAttribute(mehrfach ? 'aria-checked' : 'aria-selected') === 'true'

    /** Genau diese Zeile im Tab-Fluss. */
    const tabStopp = (li, fokus = false) => {
      for (const x of alle()) { const z = zeile(x); if (z) z.tabIndex = x === li ? 0 : -1 }
      if (fokus) zeile(li)?.focus()
    }

    // Startzustand: vorhandener Tab-Stopp, sonst Auswahl, sonst erster Eintrag
    const moegliche = bedienbar()
    const start = moegliche.find((li) => zeile(li)?.getAttribute('tabindex') === '0') || moegliche.find(gewaehlt) || moegliche[0]
    if (start) tabStopp(start)
    if (!mehrfach) for (const li of alle()) if (!li.hasAttribute('aria-selected')) li.setAttribute('aria-selected', 'false')

    const klappe = (li, an) => {
      if (!zweig(li) || gesperrtE(li) || offen(li) === an) return
      li.setAttribute('aria-expanded', String(an))
      if (!an) {
        // Fokus oder Tab-Stopp im zugeklappten Ast → auf den Zweig
        const aktiv = wurzel.ownerDocument.activeElement
        const stopp = alle().find((x) => zeile(x)?.tabIndex === 0)
        if (aktiv && li.contains(aktiv) && aktiv !== zeile(li)) tabStopp(li, true)
        else if (stopp && stopp !== li && li.contains(stopp)) tabStopp(li)
      }
      sende(wurzel, 'treeview-toggle', { value: wertVon(li), expanded: an })
    }

    const melde = (li) => sende(wurzel, 'treeview-select', { value: wertVon(li), selected: gewaehlt(li), values: alle().filter(gewaehlt).map(wertVon) })

    const setzeHaken = (li, wert) => {
      li.setAttribute('aria-checked', wert)
      const box = /** @type {HTMLInputElement|null} */ (zeile(li)?.querySelector('.nc-treeview__checkbox') || null)
      if (box) { box.checked = wert === 'true'; box.indeterminate = wert === 'mixed' }
    }
    const hake = (li) => {
      const neu = li.getAttribute('aria-checked') === 'true' ? 'false' : 'true'
      for (const x of [li, ...li.querySelectorAll(EINTRAG)]) if (!gesperrtE(/** @type {HTMLElement} */ (x))) setzeHaken(x, neu)
      for (let p = eltern(li); p; p = eltern(p)) {
        const werte = new Set(kinder(p).map((k) => k.getAttribute('aria-checked') || 'false'))
        setzeHaken(p, werte.size === 1 ? [...werte][0] : 'mixed')
      }
      melde(li)
    }
    const waehle = (li) => {
      if (gesperrtE(li)) return
      if (mehrfach) { hake(li); return }
      if (gewaehlt(li)) return
      for (const x of alle()) {
        x.setAttribute('aria-selected', String(x === li))
        x.classList.toggle('nc-treeview__item--selected', x === li)
      }
      melde(li)
    }

    baum.addEventListener('keydown', (e) => {
      const z = /** @type {HTMLElement} */ (e.target)
      if (!z.classList?.contains('nc-treeview__node')) return
      const li = /** @type {HTMLElement} */ (z.closest(EINTRAG))
      const liste = bedienbar()
      const i = liste.indexOf(li)
      let ziel = null
      switch (e.key) {
        case 'ArrowDown': ziel = liste[i + 1] || null; break
        case 'ArrowUp': ziel = i > 0 ? liste[i - 1] : null; break
        case 'Home': ziel = liste[0] || null; break
        case 'End': ziel = liste.at(-1) || null; break
        case 'ArrowRight':
          e.preventDefault()
          if (zweig(li) && !offen(li)) klappe(li, true)
          else if (zweig(li)) ziel = kinder(li).find((k) => !gesperrtE(k)) || null
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (zweig(li) && offen(li)) klappe(li, false)
          else ziel = eltern(li)
          break
        case 'Enter':
        case ' ': {
          e.preventDefault()
          waehle(li)
          const link = /** @type {HTMLElement|null} */ (z.querySelector('.nc-treeview__link'))
          if (e.key === 'Enter' && link) link.click()
          return
        }
        default: return
      }
      if (!ziel) return
      e.preventDefault()
      tabStopp(ziel, true)
    }, { signal })

    baum.addEventListener('click', (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      const z = /** @type {HTMLElement|null} */ (ziel.closest('.nc-treeview__node'))
      if (!z || !baum.contains(z)) return
      const li = /** @type {HTMLElement} */ (z.closest(EINTRAG))
      if (gesperrtE(li)) return
      if (ziel.closest('.nc-treeview__actions, .nc-treeview__drag-handle')) return
      tabStopp(li, true)
      if (ziel.closest('.nc-treeview__toggle')) { klappe(li, !offen(li)); return }
      waehle(li)
    }, { signal })

    // Fokus per Maus oder Skript: diese Zeile wird der Tab-Stopp
    baum.addEventListener('focusin', (e) => {
      const z = /** @type {HTMLElement} */ (e.target)
      if (z.classList?.contains('nc-treeview__node') && z.tabIndex !== 0) tabStopp(/** @type {HTMLElement} */ (z.closest(EINTRAG)))
    }, { signal })
  }
}
