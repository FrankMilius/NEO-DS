// Vorlage: square — Markup aus der Doku (docs/square-docs.html): Text mit
// Quadrat-Marker (::before). Plan v3, Phase 4.
//
// Die Farbvarianten sind im DS eigene Klassen, keine Modifier von .square:
// white-square, dark-square, adaptive-square, blinking-square ersetzen
// .square (Doku: <span class="adaptive-square">). Die Vorlage setzt deshalb
// genau eine Variantenklasse; data-recipe-wurzel markiert sie als Wurzel
// dieses Recipes. size per square-s/-l (an jeder Variante).
// white: weisses Quadrat — der Rahmen ra-kulisse gibt ihm den dunklen Grund.
// render.compositionType „legende": Legende wie in der Doku (Aktiv, Inaktiv,
// Live); „liste": Aufzaehlung untereinander.
const VARIANTE = {
  default: 'square',
  white: 'white-square',
  dark: 'dark-square',
  adaptive: 'adaptive-square',
  blinking: 'blinking-square'
}

function marker (m, variante, text) {
  const groesse = m.klassen.filter((k) => k === 'square-s' || k === 'square-l')
  const klasse = [VARIANTE[variante] || 'square', ...groesse].join(' ')
  const wurzel = variante && variante !== 'default' ? ` data-recipe-wurzel="${m.root}"` : ''
  return `<span class="${klasse}"${wurzel}${m.attrs}>${text}</span>`
}

export default (zelle, m) => {
  switch (m.specimen.render?.compositionType) {
    case 'legende':
      return `<div class="ra-reihe">${marker(m, 'default', 'Aktive Nutzer')}${marker(m, 'adaptive', 'Inaktive Nutzer')}${marker(m, 'blinking', 'Live-Daten')}</div>`
    case 'liste':
      return `<div class="ra-stapel">${['Erster Eintrag in der Liste', 'Zweiter Eintrag in der Liste', 'Dritter Eintrag in der Liste'].map((t) => marker(m, 'default', t)).join('')}</div>`
    default: {
      const v = m.wert('variant') || 'default'
      const html = marker(m, v, 'Aktive Nutzer')
      return v === 'white' ? `<div class="ra-kulisse ra-kulisse--invers">${html}</div>` : html
    }
  }
}
