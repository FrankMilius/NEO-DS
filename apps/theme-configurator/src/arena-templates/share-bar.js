// Vorlage: share-bar — Markup aus _blog.js (wie data/markup/share-bar.html,
// I15 Phase 1, 22.11.2026). Knoepfe sind Ghost-Icon-Buttons des Design
// Systems. Specimen „Blase“ zeigt .nc-share-bar__popover ueber einer
// markierten Textstelle (nur Aussehen; das Verhalten kommt mit Phase 3).
import { shareBar, popover } from './_blog.js'

export default (zelle, m) => {
  const render = m.specimen?.render || {}
  if (render.compositionType === 'share-bar-popover') {
    return `<div data-recipe-wurzel="nc-share-bar" style="display: grid; justify-items: center; gap: var(--fnd-spacing-03); padding-block-start: var(--fnd-spacing-04);">${popover()}<p style="margin: 0;"><mark>Ein Assistent findet nur, was jemand vorher sauber aufgeschrieben hat.</mark></p></div>`
  }
  return shareBar({
    klasse: m.klasse,
    beschriftung: (m.wert('label') || 'none') === 'text',
    attrs: ` style="inline-size: 100%;"${m.attrs}`
  })
}
