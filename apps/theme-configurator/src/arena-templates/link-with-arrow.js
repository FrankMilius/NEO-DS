// Vorlage: link-with-arrow — Markup aus data/markup/link-with-arrow.html.
import { SYMBOL } from './_helfer.js'

export default (zelle, m) => `<a href="#" onclick="return false" class="${m.klasse}"${m.attrs}>Mehr erfahren ${SYMBOL.pfeil}</a>`
