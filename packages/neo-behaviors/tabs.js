// @ts-check
// ==========================================================================
// Tabs — nach data/tabs-recipe.json (keyboard, events)
// ==========================================================================
// Klick oder Enter/Leertaste aktiviert einen Tab. Pfeiltasten (vertikal:
// hoch/runter), Pos1, Ende wandern ueber die Tabs und aktivieren dabei
// (automatische Aktivierung, WAI-ARIA). Mit data-neo-tabs="manuell" nur
// fokussieren, Aktivieren per Enter/Leertaste. Gesperrte Tabs werden
// uebersprungen. Ereignis `tab-change` { value, previousValue }.
// ==========================================================================
import { sende, nachbar, ersterBedienbar } from './kern.js'

export const tabs = {
  id: 'tabs',
  selektor: '.nc-tabs',
  binde (wurzel, signal) {
    const liste = wurzel.querySelector('.nc-tabs__list')
    if (!liste) return
    const ausloeser = () => /** @type {HTMLElement[]} */ ([...liste.querySelectorAll('.nc-tabs__trigger')])
    const vertikal = liste.getAttribute('aria-orientation') === 'vertical' || wurzel.classList.contains('nc-tabs--vertical')
    const manuell = wurzel.dataset.neoTabs === 'manuell'

    const aktiviere = (tab) => {
      if (!tab || tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true') return
      const alle = ausloeser()
      const vorher = alle.find((t) => t.getAttribute('aria-selected') === 'true')
      if (vorher === tab) return
      for (const t of alle) {
        const an = t === tab
        t.classList.toggle('is-active', an)
        t.setAttribute('aria-selected', String(an))
        t.tabIndex = an ? 0 : -1
        const panel = t.getAttribute('aria-controls') && wurzel.querySelector('#' + CSS.escape(t.getAttribute('aria-controls')))
        if (panel) { panel.classList.toggle('is-active', an); panel.hidden = !an }
      }
      sende(wurzel, 'tab-change', { value: tab.id || tab.textContent.trim(), previousValue: vorher ? (vorher.id || vorher.textContent.trim()) : null })
    }

    liste.addEventListener('click', (e) => {
      const tab = /** @type {HTMLElement} */ (e.target).closest('.nc-tabs__trigger')
      if (tab && liste.contains(tab)) aktiviere(tab)
    }, { signal })

    liste.addEventListener('keydown', (e) => {
      const tab = /** @type {HTMLElement} */ (e.target).closest('.nc-tabs__trigger')
      if (!tab) return
      const alle = ausloeser()
      const vor = vertikal ? 'ArrowDown' : 'ArrowRight'
      const zurueck = vertikal ? 'ArrowUp' : 'ArrowLeft'
      let ziel = null
      if (e.key === vor) ziel = nachbar(alle, tab, 1)
      else if (e.key === zurueck) ziel = nachbar(alle, tab, -1)
      else if (e.key === 'Home') ziel = ersterBedienbar(alle)
      else if (e.key === 'End') ziel = ersterBedienbar(alle, true)
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aktiviere(tab); return }
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
      if (!manuell) aktiviere(ziel)
    }, { signal })
  }
}
