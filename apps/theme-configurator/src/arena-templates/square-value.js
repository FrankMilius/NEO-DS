// Vorlage: square-value — Aufbau aus _square-value.scss und
// docs/square-value-docs.html: .square-value-wrapper > .square-value
// (orientation-Modifier) > zwei .square-wrapper > .square-block > vier
// Flaechen. Gezeigt wird die Vorderseite (Flaeche 1); die Drehung setzt JS
// ueber --rotate. content: text (Beschriftung + Zahl), image (<picture>),
// video (<video> ohne Quelle, Poster).
import { BILD_SRC } from './_helfer.js'

const WERTE = [['Uptime', '99,9 %'], ['Länder', '47'], ['Projekte', '1.200'], ['Nutzer', '350.000']]

function flaeche (inhalt, [label, zahl]) {
  if (inhalt === 'image') return `<div><picture><img src="${BILD_SRC}" alt="" style="width: 100%; height: 100%; object-fit: cover;"></picture></div>`
  if (inhalt === 'video') return `<div><picture><video muted playsinline poster="${BILD_SRC}" aria-hidden="true" style="width: 100%; height: 100%; object-fit: cover;"></video></picture></div>`
  return `<div><p style="color: var(--fnd-color-text-inverse); margin: 0; padding-inline: var(--fnd-spacing-03);">${label}</p><p style="color: var(--fnd-color-text-inverse); margin: 0; padding-inline: var(--fnd-spacing-03); font-size: 1.75rem; font-weight: var(--fnd-font-weight-bold); line-height: 1;">${zahl}</p></div>`
}

export default (zelle, m) => {
  const inhalt = m.wert('content') || 'text'
  const wuerfel = (versatz) => `<div class="square-wrapper"><div class="square-block">${[0, 1, 2, 3].map((i) => flaeche(inhalt, WERTE[(i + versatz) % 4])).join('')}</div></div>`
  return `
<div class="square-value-wrapper">
<div class="${m.klasse}"${m.attrs}>
${wuerfel(0)}
${wuerfel(1)}
</div>
</div>`
}
