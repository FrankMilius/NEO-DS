// Vorlage: metric — Markup aus data/markup/metric.html (geerntet von der
// Website) und der SCSS-Struktur (scss/scss/06-molecules/_metric.scss):
//   div.nc-metric[.nc-metric--subtle|--md|--xl|--trend-<richtung>]
//     span.nc-metric__label
//     div.nc-metric__value-row > span.nc-metric__unit + span.nc-metric__value
//     span.nc-metric__trend > svg.nc-metric__trend-icon (aria-hidden) + Text
//     span.nc-metric__footer
// Der Trend steht als Text da („+12,5 %"), nicht nur als Farbe (Recipe a11y).
//
// Kompositionen: metric-full (alle Slots), metric-minimal (nur Wert),
// metric-grid (vier Kennzahlen in .nc-metric-grid), metric-hero (xl).
// Kein Verhalten, nur „Zustände".
import { esc } from './_helfer.js'

const PFEIL = {
  up: '<path d="M4.5 15.75l7.5-7.5 7.5 7.5"/>',
  down: '<path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>',
  neutral: '<path d="M5 12h14"/>'
}
const TREND_TEXT = { up: '+12,5 %', down: '−4,2 %', neutral: '±0 %' }

function kennzahl (m, o) {
  const trend = o.trend ?? m.wert('trend') ?? 'none'
  const klassen = m.klassen.filter((k) => !/^nc-metric--trend-/.test(k))
  if (trend !== 'none') klassen.push(`nc-metric--trend-${trend}`)
  const teile = []
  if (o.label) teile.push(`<span class="nc-metric__label">${esc(o.label)}</span>`)
  teile.push(`<div class="nc-metric__value-row">${o.einheit ? `<span class="nc-metric__unit">${esc(o.einheit)}</span>` : ''}<span class="nc-metric__value">${esc(o.wert)}</span></div>`)
  if (trend !== 'none') {
    teile.push(`<span class="nc-metric__trend"><svg class="nc-metric__trend-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PFEIL[trend]}</svg>${esc(o.trendText || TREND_TEXT[trend])}</span>`)
  }
  if (o.fuss) teile.push(`<span class="nc-metric__footer">${esc(o.fuss)}</span>`)
  return `<div class="${[...new Set(klassen)].join(' ')}"${m.attrs}>${teile.join('')}</div>`
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType

  if (art === 'metric-minimal') return `<div class="ra-feld">${kennzahl(m, { wert: '98 %' })}</div>`

  if (art === 'metric-grid') {
    const vier = [
      { label: 'Umsatz', einheit: '€', wert: '24.521', trend: 'up', trendText: '+12,5 %' },
      { label: 'Nutzer', wert: '8.420', trend: 'up', trendText: '+3,2 %' },
      { label: 'Konversion', einheit: '%', wert: '3,8', trend: 'down', trendText: '−0,4 %' },
      { label: 'Ø Bestellung', einheit: '€', wert: '68', trend: 'none' }
    ]
    return `<div class="ra-feld ra-feld--sehr-breit"><div class="nc-metric-grid">${vier.map((o) => kennzahl(m, o)).join('')}</div></div>`
  }

  if (art === 'metric-hero') {
    return `<div class="ra-feld ra-feld--breit">${kennzahl(m, { label: 'Aktive Nutzer weltweit', wert: '1,2 Mio.', trendText: '+18 % zum Vorjahr', fuss: 'Stand: September 2026' })}</div>`
  }

  // metric-full und die Vergleiche: alle Slots
  // xl (Hero) braucht Breite, sonst laeuft die Zahl aus dem Feld
  return `<div class="ra-feld${m.wert('size') === 'xl' ? ' ra-feld--breit' : ''}">${kennzahl(m, { label: 'Gesamtumsatz', einheit: '€', wert: '24.521', fuss: 'vs. Vormonat' })}</div>`
}
