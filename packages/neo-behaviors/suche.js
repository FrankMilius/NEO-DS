// @ts-check
// ==========================================================================
// Suche — nach data/search-recipe.json (Anatomie, States)
// ==========================================================================
// Das Feld ist ein Combobox-Input (.nc-input .nc-search__input). Fokus oder
// Tippen oeffnet die Ergebnisliste, Escape oder Verlassen schliesst sie.
// Tippen filtert die Eintraege und markiert den Treffer; ohne Treffer
// erscheint ein Leerhinweis. Pfeiltasten wandern durch die Eintraege
// (aria-selected, aria-activedescendant), Enter waehlt. Bereichs-Knopf
// oeffnet/schliesst sein Menue. Ereignisse: `search-open` { open },
// `search-select` { value }.
// ==========================================================================
import { sende } from './kern.js'

const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export const suche = {
  id: 'search',
  selektor: '.nc-search',
  binde (wurzel, signal) {
    const feld = /** @type {HTMLInputElement|null} */ (wurzel.querySelector('.nc-search__input'))
    const liste = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-search__results'))
    if (!feld || !liste) return
    const eintraege = () => /** @type {HTMLElement[]} */ ([...liste.querySelectorAll('.nc-search__item')])
    // Ursprungstext je Eintrag merken, damit Markierungen neu gesetzt werden koennen
    for (const e of eintraege()) {
      const label = e.querySelector('.nc-search__item-label') || e
      if (!label.dataset.neoText) label.dataset.neoText = label.textContent
    }
    let leer = /** @type {HTMLElement|null} */ (liste.querySelector('.nc-search__empty'))
    // Startzustand: Liste zu, bis das Feld den Fokus bekommt
    if (document.activeElement !== feld) { liste.hidden = true; feld.setAttribute('aria-expanded', 'false') }

    const offen = () => !liste.hidden
    const setze = (an) => {
      if (offen() === an) return
      liste.hidden = !an
      feld.setAttribute('aria-expanded', String(an))
      if (!an) markiere(null)
      sende(wurzel, 'search-open', { open: an })
    }
    const markiere = (eintrag) => {
      for (const e of eintraege()) e.setAttribute('aria-selected', String(e === eintrag))
      if (eintrag?.id) feld.setAttribute('aria-activedescendant', eintrag.id)
      else feld.removeAttribute('aria-activedescendant')
      eintrag?.scrollIntoView?.({ block: 'nearest' })
    }
    const filtere = () => {
      const q = feld.value.trim().toLowerCase()
      let sichtbar = 0
      for (const e of eintraege()) {
        const label = /** @type {HTMLElement} */ (e.querySelector('.nc-search__item-label') || e)
        const text = label.dataset.neoText || ''
        const pos = q ? text.toLowerCase().indexOf(q) : -1
        const zeigen = !q || pos >= 0
        e.hidden = !zeigen
        if (zeigen) sichtbar++
        if (q && pos >= 0) label.innerHTML = escHtml(text.slice(0, pos)) + '<span class="nc-search__highlight">' + escHtml(text.slice(pos, pos + q.length)) + '</span>' + escHtml(text.slice(pos + q.length))
        else label.textContent = text
      }
      for (const g of liste.querySelectorAll('.nc-search__group')) {
        /** @type {HTMLElement} */ (g).hidden = ![...g.querySelectorAll('.nc-search__item')].some((e) => !(/** @type {HTMLElement} */ (e)).hidden)
      }
      if (!sichtbar && eintraege().length) {
        if (!leer) { leer = document.createElement('div'); leer.className = 'nc-search__empty'; liste.append(leer) }
        leer.textContent = `Keine Treffer für „${feld.value.trim()}“`
        leer.hidden = false
      } else if (leer && eintraege().length) leer.hidden = true
      markiere(null)
    }

    feld.addEventListener('focus', () => setze(true), { signal })
    feld.addEventListener('input', () => { setze(true); filtere() }, { signal })
    feld.addEventListener('keydown', (e) => {
      const sichtbare = eintraege().filter((x) => !x.hidden)
      const aktuell = sichtbare.find((x) => x.getAttribute('aria-selected') === 'true')
      if (e.key === 'Escape') { setze(false); return }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setze(true)
        if (!sichtbare.length) return
        const i = aktuell ? sichtbare.indexOf(aktuell) : -1
        const n = e.key === 'ArrowDown' ? (i + 1) % sichtbare.length : (i - 1 + sichtbare.length) % sichtbare.length
        markiere(sichtbare[n])
      } else if (e.key === 'Enter' && aktuell) {
        e.preventDefault()
        feld.value = /** @type {HTMLElement} */ (aktuell.querySelector('.nc-search__item-label') || aktuell).dataset.neoText || aktuell.textContent.trim()
        sende(wurzel, 'search-select', { value: feld.value })
        setze(false)
      }
    }, { signal })
    liste.addEventListener('mousedown', (e) => e.preventDefault(), { signal }) // Fokus bleibt im Feld
    liste.addEventListener('click', (e) => {
      const eintrag = /** @type {HTMLElement} */ (e.target).closest('.nc-search__item')
      if (!eintrag) return
      e.preventDefault()
      feld.value = /** @type {HTMLElement} */ (eintrag.querySelector('.nc-search__item-label') || eintrag).dataset.neoText || eintrag.textContent.trim()
      sende(wurzel, 'search-select', { value: feld.value })
      setze(false)
    }, { signal })
    wurzel.addEventListener('focusout', (e) => {
      if (!wurzel.contains(/** @type {Node} */ (e.relatedTarget))) setze(false)
    }, { signal })

    // Bereichs-Knopf mit Menue
    const bereich = wurzel.querySelector('.nc-search__scope-trigger')
    const menue = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-search__scope-menu'))
    if (bereich && menue) {
      bereich.addEventListener('click', () => {
        const an = menue.hidden
        menue.hidden = !an
        bereich.setAttribute('aria-expanded', String(an))
      }, { signal })
    }
  }
}
