// Vorlage: badge — Markup aus data/markup/badge.html. decorator: icon
// (Slot per slotConfig), dot/pulse (ohne Text, aria-label), counter und
// decorator (Zahl aus render.counterValues je Zelle), status-string (Text aus
// render.labels je Zelle). Kompositionen: avatar-badge (Zaehler am Avatar)
// und icon-badge (Zaehler an einem Symbolknopf) — Anordnung per Inline-
// Position, das DS hat dafuer keine Wrapper-Klasse.
import { SYMBOL, esc, zellenIndex } from './_helfer.js'

const GLOCKE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>'

export default (zelle, m) => {
  const deko = m.wert('decorator')
  const render = m.specimen.render || {}
  if (deko === 'dot' || deko === 'pulse') {
    return `<span class="${m.klasse}" aria-label="${esc(m.text)}"${m.attrs}></span>`
  }
  const i = zellenIndex(m, 'tone')
  let text = esc(m.text)
  if (deko === 'counter' || deko === 'decorator') text = render.counterValues?.[i] ?? render.counterValues?.[0] ?? '3'
  if (deko === 'status-string') text = esc(render.labels?.[i] ?? m.text)
  const badge = `<span class="${m.klasse}"${m.attrs}>${m.slot('icon') ? `<span class="nc-badge__icon">${SYMBOL.kreis}</span>` : ''}<span class="nc-badge__label">${text}</span></span>`
  if (render.compositionType === 'avatar-badge') {
    return `<span style="position: relative; display: inline-flex;"><span class="nc-avatar" role="img" aria-label="Birgit Schwarz"><span class="nc-avatar__fallback">BS</span></span><span style="position: absolute; top: -6px; right: -10px;">${badge}</span></span>`
  }
  if (render.compositionType === 'icon-badge') {
    return `<span style="position: relative; display: inline-flex;"><button type="button" class="nc-button nc-button--ghost nc-button--sm" aria-label="Benachrichtigungen, ${text} neu">${GLOCKE}</button><span style="position: absolute; top: -4px; right: -6px;">${badge}</span></span>`
  }
  return badge
}
