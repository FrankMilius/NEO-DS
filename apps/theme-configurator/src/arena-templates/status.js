// Vorlage: status — Markup aus data/markup/status.html. Der Punkt traegt
// keinen Text; die Bedeutung steht im aria-label. Kompositionen:
// status-label (nc-status-label mit __text, _status.scss) und avatar-status
// (Punkt mit Ring unten rechts am Avatar, Position inline).
import { esc } from './_helfer.js'

const TEXT = { neutral: 'Unbekannt', online: 'Online', offline: 'Offline', busy: 'Beschäftigt', away: 'Abwesend' }

export default (zelle, m) => {
  const v = m.wert('variant') || 'neutral'
  const art = m.specimen.render?.compositionType
  if (art === 'status-label') {
    return `<span class="nc-status-label"><span class="${m.klasse}" aria-hidden="true"${m.attrs}></span><span class="nc-status-label__text">${TEXT[v] || esc(v)}</span></span>`
  }
  const punkt = `<span class="${m.klasse}" role="img" aria-label="Status: ${esc(TEXT[v] || v)}"${m.attrs}></span>`
  if (art === 'avatar-status') {
    return `<span style="position: relative; display: inline-flex;"><span class="nc-avatar" role="img" aria-label="Birgit Schwarz"><span class="nc-avatar__fallback">BS</span></span><span style="position: absolute; right: 0; bottom: 0; display: inline-flex;">${punkt}</span></span>`
  }
  return punkt
}
