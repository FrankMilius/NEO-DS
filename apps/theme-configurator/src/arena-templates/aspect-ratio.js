// Vorlage: aspect-ratio — Markup aus data/markup/aspect-ratio.html.
import { BILD_SRC, esc } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<img class="nc-aspect-ratio__content" src="${BILD_SRC}" alt="${esc((m.wert('ratio') || '').replace('-', ':'))} Beispiel">
</div>
`
