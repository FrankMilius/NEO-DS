// Vorlage: square — Markup aus der Doku (docs/square-docs.html): Text mit
// Quadrat-Marker. size per Modifier (square-s/-l); variant hat keinen
// Modifier im Recipe, das DS fuehrt dafuer eigene Klassen
// (white-square, dark-square, adaptive-square, blinking-square).
export default (zelle, m) => {
  const v = m.wert('variant')
  const extra = v && v !== 'default' ? ` ${v}-square` : ''
  const dunkel = v === 'white' ? ' style="background: var(--fnd-color-always-dark); color: var(--fnd-color-always-light); padding: var(--fnd-spacing-02) var(--fnd-spacing-03);"' : ''
  return `<span class="${m.klasse}${extra}"${dunkel}${m.attrs}>Aktive Nutzer</span>`
}
