// @ts-check
// ==========================================================================
// Akkordeon — nach data/accordion-recipe.json (keyboard, events)
// ==========================================================================
// Die Eintraege sind <details>/<summary>: Auf- und Zuklappen (Enter,
// Leertaste, Klick) macht der Browser. Das Behavior ergaenzt die Pfeiltasten
// (hoch/runter, Pos1, Ende) zwischen den Kopfzeilen, „nur eines offen" per
// data-neo-accordion="einzeln" (zusaetzlich zum name-Attribut) und das
// Ereignis `accordion-toggle` { itemId, open }.
//
// Gesperrte Eintraege (Ausloeser mit aria-disabled="true", Recipe-Zustand
// disabled): das DS nimmt ihnen nur die Maus (pointer-events: none) — Enter
// und Leertaste loesen am <summary> trotzdem einen Klick aus und klappten
// auf. Das Behavior verwirft diesen Klick; die Pfeiltasten ueberspringen
// gesperrte Ausloeser (nachbar/ersterBedienbar).
// ==========================================================================
import { sende, nachbar, ersterBedienbar } from './kern.js'

export const akkordeon = {
  id: 'accordion',
  selektor: '.nc-accordion',
  binde (wurzel, signal) {
    const eintraege = () => /** @type {HTMLDetailsElement[]} */ ([...wurzel.querySelectorAll(':scope > .nc-accordion__item, :scope > * > .nc-accordion__item')])
    const koepfe = () => eintraege().map((e) => /** @type {HTMLElement} */ (e.querySelector('.nc-accordion__trigger'))).filter(Boolean)
    const einzeln = wurzel.dataset.neoAccordion === 'einzeln'

    wurzel.addEventListener('toggle', (e) => {
      const item = /** @type {HTMLDetailsElement} */ (e.target)
      if (!item.classList?.contains('nc-accordion__item')) return
      if (einzeln && item.open) for (const andere of eintraege()) if (andere !== item && andere.open) andere.open = false
      sende(wurzel, 'accordion-toggle', { itemId: item.id || null, open: item.open })
    }, { signal, capture: true })

    wurzel.addEventListener('click', (e) => {
      const kopf = /** @type {HTMLElement} */ (e.target).closest?.('.nc-accordion__trigger')
      if (kopf?.getAttribute('aria-disabled') === 'true' && wurzel.contains(kopf)) e.preventDefault()
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const kopf = /** @type {HTMLElement} */ (e.target).closest('.nc-accordion__trigger')
      if (!kopf) return
      const alle = koepfe()
      let ziel = null
      if (e.key === 'ArrowDown') ziel = nachbar(alle, kopf, 1)
      else if (e.key === 'ArrowUp') ziel = nachbar(alle, kopf, -1)
      else if (e.key === 'Home') ziel = ersterBedienbar(alle)
      else if (e.key === 'End') ziel = ersterBedienbar(alle, true)
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })
  }
}
