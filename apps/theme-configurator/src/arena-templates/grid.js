// Grid (04-objects/_grid.scss, .o-grid mit .o-col-*) — Plan v3, Phase 3,
// Block Layout.
//
// 12-Spalten-Raster; die Kinder tragen ihre Spanne als .o-col-N. Die
// Platzhalter nennen die Spanne. Unter 768 px Fensterbreite stellt das DS
// auf 4 Spalten um (Spannen > 4 laufen ueber die volle Breite) — die Arena
// zeigt diese Lage im Rahmen ra-mobil (390 px), weil das DS sie nur ueber
// die Fensterbreite schaltet (wie ra-nav-mobil im Block Navigation).
//
// Modifier ohne CSS (flow-col, dense, mobile-1/2/6, subgrid*) zeigen
// „nicht gebaut" — Entscheidungsfall layout-grid-modifier, siehe _layout.js.
import { fehlendeKlassen, nichtGebaut, platzhalter } from './_layout.js'

const spalte = (n, zusatz = '') => `<div class="o-col-${n}">${platzhalter(String(n), zusatz)}</div>`
const spalten = (liste) => liste.map((n) => spalte(n)).join('\n')

function inhalt (m) {
  // Auto-fit: Spalten aus dem Inhalt, keine Spannen
  if (m.wert('layout') === 'auto-fit') {
    return ['1', '2', '3', '4', '5'].map((n) => `<div>${platzhalter('auto ' + n)}</div>`).join('\n')
  }
  // Ausrichtung: unterschiedlich hohe Kinder machen align-items sichtbar
  if (m.wert('alignment') !== undefined) {
    return [spalte(4, 'ra-platzhalter--hoch'), spalte(4), spalte(4, 'ra-platzhalter--mittel')].join('\n')
  }
  // Verschachteltes Raster ohne Subgrid: das innere Raster ist unabhaengig
  if (m.wert('subgrid') === 'none') {
    return `<div class="o-col-8">
<div class="o-grid">
${spalten([6, 6])}
</div>
</div>
${spalte(4)}`
  }
  // Mobil: Spannen bis 4 und darueber (laufen ueber die volle Breite)
  if (m.wert('mobile-columns') !== undefined) return spalten([2, 2, 4, 6, 3, 1])
  return spalten([6, 6, 4, 4, 4, 3, 3, 3, 3])
}

export default (zelle, m) => {
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const raster = `<div class="${m.klasse}"${m.attrs}>
${inhalt(m)}
</div>`
  return m.wert('mobile-columns') !== undefined ? `<div class="ra-mobil">${raster}</div>` : raster
}
