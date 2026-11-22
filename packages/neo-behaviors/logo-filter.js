// @ts-check
// ==========================================================================
// Logo filter — sector filter of the logo wall (data/logo-wall-recipe.json)
// ==========================================================================
// Website component (logo wall improvements, 22.11.2026). Root: the button
// group [data-logo-filter] above the wall; every button carries
// data-sector ("" = all) and aria-controls = id of the wall.
//
//   - Without script the group stays [hidden] and all logos show.
//   - Binding shows the group. A click presses exactly one button
//     (aria-pressed) and hides the logos of other sectors ([hidden]); logos
//     without a sector only show under "all".
//   - A polite live region after the group reports the number of logos
//     shown ("8 Logos angezeigt" / "8 logos shown", by lang).
//
// Event `logo-filter` { sector, count } at the root after each change.
// Unbinding hides the group again, shows all logos, restores aria-pressed
// and removes the live region.
// ==========================================================================
import { sende } from './kern.js'
import { spracheVon } from './gallery.js'

export const TEXTS = {
  de: (/** @type {number} */ n) => `${n} ${n === 1 ? 'Logo' : 'Logos'} angezeigt`,
  en: (/** @type {number} */ n) => `${n} ${n === 1 ? 'logo' : 'logos'} shown`
}

export const logoFilter = {
  id: 'logo-filter',
  selektor: '[data-logo-filter]',
  recipes: ['logo-wall'],
  // Website component: in Drupal only via drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...wurzel.querySelectorAll('button[data-sector]')])
    const doc = wurzel.ownerDocument
    const wallId = buttons[0] && buttons[0].getAttribute('aria-controls')
    const wall = wallId ? doc.getElementById(wallId) : null
    if (!buttons.length || !wall) return

    const logos = /** @type {HTMLElement[]} */ ([...wall.querySelectorAll('.nc-logo-pill')])
    const pressedBefore = buttons.map((b) => b.getAttribute('aria-pressed'))
    const wasHidden = wurzel.hidden
    const text = TEXTS[/** @type {'de'|'en'} */ (spracheVon(wurzel))] || TEXTS.de

    const status = doc.createElement('p')
    status.className = 'u-sr-only'
    status.setAttribute('aria-live', 'polite')
    wurzel.after(status)
    wurzel.hidden = false

    signal.addEventListener('abort', () => {
      wurzel.hidden = wasHidden
      status.remove()
      for (const l of logos) l.hidden = false
      buttons.forEach((b, i) => {
        const v = pressedBefore[i]
        if (v === null) b.removeAttribute('aria-pressed')
        else b.setAttribute('aria-pressed', v)
      })
    })

    /** @param {HTMLButtonElement} pressed */
    const apply = (pressed) => {
      const sector = pressed.dataset.sector || ''
      for (const b of buttons) b.setAttribute('aria-pressed', String(b === pressed))
      let count = 0
      for (const l of logos) {
        l.hidden = sector !== '' && l.dataset.sector !== sector
        if (!l.hidden) count++
      }
      status.textContent = text(count)
      sende(wurzel, 'logo-filter', { sector, count })
    }

    for (const b of buttons) b.addEventListener('click', () => apply(b), { signal })
  }
}
