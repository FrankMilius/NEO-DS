// @ts-check
// ==========================================================================
// Treeview — nach data/treeview-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA Tree View. Markup wie im SCSS (06-molecules/_treeview.scss):
// ul[role=tree] > li.nc-treeview__item[role=treeitem] (aria-expanded an
// Zweigen, aria-selected bzw. im Checkbox-Modus aria-checked) mit der Zeile
// .nc-treeview__node und den Kindern in .nc-treeview__children >
// ul[role=group].
// Fokus (Entscheidung 03.10.2026, nav-a11y): der Fokus liegt auf dem
// Element mit role="treeitem" (roving tabindex: genau ein Eintrag im
// Tab-Fluss), nicht auf der Zeile. Aelteres Markup mit tabindex an der
// Zeile wird beim Binden umgestellt. Toggle, Checkbox, Link und Ziehgriff
// bleiben mit tabindex="-1" aus der Tab-Folge — sie werden ueber die Tasten
// am Eintrag bedient.
//   Pfeil runter/hoch   naechster/vorheriger sichtbarer Eintrag (kein Rundum)
//   Pfeil rechts        Zweig zu → aufklappen; Zweig offen → erstes Kind
//   Pfeil links         Zweig offen → zuklappen; sonst → Eltern-Eintrag
//   Pos1 / Ende         erster / letzter sichtbarer Eintrag
//   Enter / Leertaste   auswaehlen (single) bzw. anhaken (multiple); steht
//                       ein .nc-treeview__link in der Zeile, folgt Enter ihm
//   Tab                 vom fokussierten Eintrag in die Aktionen SEINER
//                       Zeile (.nc-treeview__action — nur die Zeile mit dem
//                       Tab-Stopp hat sie im Tab-Fluss), danach aus dem Baum;
//                       Shift+Tab von der ersten Aktion zurueck zum Eintrag
//   Escape              in einer Aktion: zurueck auf den Eintrag
//   Klick               Zeile waehlt bzw. hakt an; der Chevron
//                       (.nc-treeview__toggle) klappt nur auf/zu; Aktionen
//                       und Ziehgriff bleiben unberuehrt
// Auswahl single: aria-selected an allen Eintraegen + .nc-treeview__item--
// selected (das SCSS gestaltet die Auswahl ueber die Klasse). multiple
// (aria-multiselectable bzw. .nc-treeview--checkboxes): Anhaken schaltet den
// Eintrag samt Nachfahren; Eltern werden true/false/mixed, die Checkbox
// zeigt dasselbe (checked/indeterminate).
// Gesperrte Eintraege (aria-disabled, --disabled) werden uebersprungen
// (Entscheidung 03.10.2026, tree-gesperrt = Ueberspringen).
// Zugeklappte Kinder blendet das SCSS per visibility/display aus (auch fuer
// Tastatur und Screenreader, ohne JS). Zuklappen mit dem Fokus darin holt
// den Fokus auf den Zweig zurueck.
//
// Ereignisse `treeview-toggle` { value, expanded },
// `treeview-select` { value, selected, values } (values: alle gewaehlten).
// ==========================================================================
import { sende, gesperrt } from './kern.js'

const EINTRAG = '.nc-treeview__item'
const AKTION = '.nc-treeview__action'
let zaehler = 0
const NIE_IM_TAB = '.nc-treeview__toggle, .nc-treeview__checkbox, .nc-treeview__link, .nc-treeview__drag-handle'

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

    const aktionen = (li) => /** @type {HTMLElement[]} */ ([...(zeile(li)?.querySelectorAll(AKTION) || [])])
    const kinderBox = (li) => /** @type {HTMLElement|null} */ (li.querySelector(':scope > .nc-treeview__children, :scope > .nc-treeview__list'))
    const eintragVon = (el) => /** @type {HTMLElement|null} */ (el?.closest?.(EINTRAG) || null)

    /** Genau dieser Eintrag im Tab-Fluss, dazu die Aktionen seiner Zeile. */
    const tabStopp = (li, fokus = false) => {
      for (const x of alle()) {
        x.tabIndex = x === li ? 0 : -1
        for (const a of aktionen(x)) a.tabIndex = x === li ? 0 : -1
      }
      if (fokus) li.focus()
    }

    // Startzustand: vorhandener Tab-Stopp (am Eintrag oder, aelteres Markup,
    // an der Zeile), sonst Auswahl, sonst erster Eintrag. Die Zeile selbst
    // ist danach nicht mehr fokussierbar; Bedienteile darin aus der Tab-Folge.
    const moegliche = bedienbar()
    const start = moegliche.find((li) => li.getAttribute('tabindex') === '0' || zeile(li)?.getAttribute('tabindex') === '0') || moegliche.find(gewaehlt) || moegliche[0]
    for (const li of alle()) {
      zeile(li)?.removeAttribute('tabindex')
      for (const el of zeile(li)?.querySelectorAll(NIE_IM_TAB) || []) /** @type {HTMLElement} */ (el).tabIndex = -1
    }
    if (start) tabStopp(start)
    // Name des Eintrags: nur das Label, nicht der ganze Ast (sonst liest der
    // Screenreader die Kinder mit). Fehlt aria-label(ledby), verweist das
    // Behavior auf das Label (id wird bei Bedarf vergeben).
    for (const li of alle()) {
      if (li.hasAttribute('aria-label') || li.hasAttribute('aria-labelledby')) continue
      const name = /** @type {HTMLElement|null} */ (zeile(li)?.querySelector('.nc-treeview__label, .nc-treeview__link') || null)
      if (!name) continue
      if (!name.id) name.id = `nc-treeview-name-${++zaehler}`
      li.setAttribute('aria-labelledby', name.id)
    }
    if (!mehrfach) for (const li of alle()) if (!li.hasAttribute('aria-selected')) li.setAttribute('aria-selected', 'false')

    const klappe = (li, an) => {
      if (!zweig(li) || gesperrtE(li) || offen(li) === an) return
      li.setAttribute('aria-expanded', String(an))
      if (!an) {
        // Fokus oder Tab-Stopp im zugeklappten Ast → auf den Zweig
        const box = kinderBox(li)
        const aktiv = wurzel.ownerDocument.activeElement
        const stopp = alle().find((x) => x.tabIndex === 0)
        if (box && aktiv && box.contains(aktiv)) tabStopp(li, true)
        else if (box && stopp && box.contains(stopp)) tabStopp(li)
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
      const ziel0 = /** @type {HTMLElement} */ (e.target)
      // In einer Zeilen-Aktion: Escape zurueck auf den Eintrag, sonst nativ
      if (ziel0.closest?.(AKTION)) {
        if (e.key === 'Escape') { e.preventDefault(); const li = eintragVon(ziel0); if (li) tabStopp(li, true) }
        return
      }
      if (!ziel0.matches?.(EINTRAG) || !baum.contains(ziel0)) return
      const li = ziel0
      const z = zeile(li)
      if (!z) return
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
      if (ziel.closest('.nc-treeview__actions, .nc-treeview__drag-handle')) { tabStopp(li); return }
      tabStopp(li, true)
      if (ziel.closest('.nc-treeview__toggle')) { klappe(li, !offen(li)); return }
      waehle(li)
    }, { signal })

    // Fokus per Maus oder Skript (auf dem Eintrag oder einer seiner
    // Aktionen): dieser Eintrag wird der Tab-Stopp
    baum.addEventListener('focusin', (e) => {
      const el = /** @type {HTMLElement} */ (e.target)
      const li = eintragVon(el)
      if (!li || !baum.contains(li) || li.tabIndex === 0) return
      if (el === li || el.closest(AKTION)) tabStopp(li)
    }, { signal })
  }
}
