// Vorlage: share-bar — Markup aus _blog.js (wie data/markup/share-bar.html,
// I15 Phase 1, 22.11.2026). Knoepfe sind Ghost-Icon-Buttons des Design
// Systems. Specimen „Blase“ zeigt .nc-share-bar__popover ueber einer
// markierten Textstelle als festes Beispiel (Aussehen).
// „Ausprobieren“ (I15 Phase 3): Leiste und zwei Absaetze Artikeltext
// ([data-teilen-text]) in einem <article> — das Behavior share-bar
// verdrahtet Teilen und Link kopieren und oeffnet die Blase an einer
// markierten Stelle (ab drei Woertern), wie auf der Website.
import { shareBar, popover, PROSA, ARTIKEL } from './_blog.js'

// Zwei Absaetze aus dem Beispielartikel, ohne Markierung
const TEXT = PROSA.slice(0, 2).map((p) => p.replace(/<\/?mark>/g, '').replace('<p>', '<p style="margin: 0;">')).join('')

export default (zelle, m) => {
  const render = m.specimen?.render || {}
  if (m.ausprobieren) {
    return `<article style="display: grid; gap: var(--fnd-spacing-04); inline-size: 100%;">` +
      shareBar({ klasse: 'nc-share-bar', beschriftung: render.label === 'beschriftet', attrs: ` data-teilen-url="${ARTIKEL.url}" data-teilen-titel="${ARTIKEL.titel}"` }) +
      `<div data-teilen-text style="display: grid; gap: var(--fnd-spacing-03);">${TEXT}</div>` +
      '</article>'
  }
  if (render.compositionType === 'share-bar-popover') {
    return `<div data-recipe-wurzel="nc-share-bar" style="display: grid; justify-items: center; gap: var(--fnd-spacing-03); padding-block-start: var(--fnd-spacing-04);">${popover()}<p style="margin: 0;"><mark>Ein Assistent findet nur, was jemand vorher sauber aufgeschrieben hat.</mark></p></div>`
  }
  return shareBar({
    klasse: m.klasse,
    beschriftung: (m.wert('label') || 'none') === 'text',
    attrs: ` style="inline-size: 100%;"${m.attrs}`
  })
}
