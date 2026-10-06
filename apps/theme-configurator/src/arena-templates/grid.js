// Grid (04-objects/_grid.scss, .o-grid mit .o-col-*) — Plan v3, Phase 3,
// Block Layout.
//
// 12-Spalten-Raster; die Kinder tragen ihre Spanne als .o-col-N. Die
// Platzhalter nennen die Spanne. Unter 768 px Fensterbreite stellt das DS
// auf 4 Spalten um (Spannen > 4 laufen ueber die volle Breite) — die Arena
// zeigt diese Lage im Rahmen ra-mobil (390 px), weil das DS sie nur ueber
// die Fensterbreite schaltet (wie ra-nav-mobil im Block Navigation).
//
// Flow und Mobil-Spalten sind seit dem 06.10.2026 gebaut (Entscheidung
// layout-grid-modifier), Subgrid ist aus dem Recipe gestrichen.
//   Flow: nummerierte Kinder machen die Platzierung lesbar. row und dense
//   zeigen dieselben Spannen (8, 6, 4, 2) — dense zieht die 4 in die Luecke
//   der ersten Zeile. column braucht vorgegebene Zeilen: der Rahmen
//   ra-zeilen gibt zwei vor (wie es eine Seite taete), sechs Spannen 3
//   fuellen dann Spalte fuer Spalte.
//   Mobil: alle Werte im Rahmen ra-mobil (die Lage schaltet das DS ueber die
//   Fensterbreite; der Rahmen setzt dieselben Werte).
// Website-Specimens (render.website): .nc-grid--split und
// .nc-grid--with-sidebar, wie der Layout Builder sie setzt — Recipe-Block
// website.
// Was das Recipe kuenftig ohne CSS beschreibt, zeigt „nicht gebaut" (siehe
// _layout.js).
import { fehlendeKlassen, nichtGebaut, platzhalter } from './_layout.js'

const spalte = (n, zusatz = '', text = String(n)) => `<div class="o-col-${n}">${platzhalter(text, zusatz)}</div>`
const nummeriert = (liste) => liste.map((n, i) => spalte(n, '', `${i + 1} · ${n}`)).join('\n')
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
  // Flow: Reihenfolge und Luecken sichtbar machen
  if (m.wert('flow') === 'column') return nummeriert([3, 3, 3, 3, 3, 3])
  if (m.wert('flow') !== undefined) return nummeriert([8, 6, 4, 2])
  // Mobil: Spannen bis 4 und darueber (laufen ueber die volle Breite)
  if (m.wert('mobile-columns') !== undefined) return spalten([2, 2, 4, 6, 3, 1])
  return spalten([6, 6, 4, 4, 4, 3, 3, 3, 3])
}

export default (zelle, m) => {
  // Website-Form (Recipe-Block website, Entscheidung 06.10.2026): eigenstaendige
  // Aufteilung ohne .o-grid, die Kinder sind die Spalten
  const website = m.specimen.render?.website
  if (website) {
    const [a, b] = website === 'nc-grid--with-sidebar' ? ['Inhalt · 2fr', 'Seitenspalte · 1fr'] : ['1fr', '1fr']
    return `<div class="${website}" data-recipe-wurzel="${m.root}">
<div>${platzhalter(a)}</div>
<div>${platzhalter(b)}</div>
</div>`
  }
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const raster = `<div class="${m.klasse}"${m.attrs}>
${inhalt(m)}
</div>`
  if (m.wert('mobile-columns') !== undefined) return `<div class="ra-mobil">${raster}</div>`
  if (m.wert('flow') === 'column') return `<div class="ra-zeilen">${raster}</div>`
  return raster
}
