// Vorlage: status — Markup aus data/markup/status.html. Sonderfall-Arena
// vorhanden. Der Punkt traegt keinen Text; die Bedeutung steht im aria-label.
import { esc } from './_helfer.js'

export default (zelle, m) => `<span class="${m.klasse}" role="img" aria-label="Status: ${esc(m.wert('variant') || 'neutral')}"${m.attrs}></span>`
