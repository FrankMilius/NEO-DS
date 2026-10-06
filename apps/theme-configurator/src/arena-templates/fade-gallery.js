// Vorlage: fade-gallery — Markup aus data/markup/fade-gallery.html (geerntet
// von der Website; dort fuenf Ansichten, hier drei). navigation=paddles
// blendet die Pfeile (.nc-gallery__controls) in der Leiste ein, tabs zeigt
// nur die Tab-Leiste. Die Leiste .nc-fade-gallery__nav-row steht immer da
// (wie in der Ernte) — sie ist ein Kind, kein Modifier der Wurzel.
//
// Specimens: default, navigation (tabs gegen paddles), zweite-ansicht
// (render.aktiv: die zweite Ansicht ist aktiv — derselbe Zustand, den die
// Website nach einem Tab-Klick setzt: is-active am Medium, is-visible an der
// Beschreibung, aria-selected am Tab).
//
// Zustände: statisch. Abspielen: die Ansichten wechseln im Takt — die Arena
// setzt nur die Zustandsklassen, die Ueberblendung (opacity 0.5 s am Medium,
// opacity/transform 0.4 s an der Beschreibung) kommt aus dem SCSS. Die
// Website steuert den Wechsel per Klick (neo-theme.js), ohne Autoplay.
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'
import { imTakt, naechsterFrame, alle } from './_bewegung.js'

const ANSICHTEN = [
  ['Dashboard', 'PIIPE Workplace Dashboard mit Projektübersicht', 'Das zentrale Dashboard gibt dir den Überblick über alle laufenden Projekte, offene Aufgaben und Team-Aktivitäten.'],
  ['Zusammenarbeit', 'Team-Zusammenarbeit am Arbeitsplatz', 'Arbeite mit deinem Team in Echtzeit an Dokumenten, Aufgaben und Projekten.'],
  ['Community', 'PIIPE Community und Wissensaustausch', 'Interne Foren und Wissensdatenbanken fördern den Austausch über Abteilungsgrenzen hinweg.']
]

export default (zelle, m) => {
  const u = m.uid
  const pfeile = m.wert('navigation') === 'paddles'
  const aktiv = Math.min(ANSICHTEN.length - 1, Number(m.specimen.render?.aktiv) || 0)
  return `
<div class="${wurzelKlassen(m)}" aria-label="Eine Plattform für alles"${m.attrs}>
<div class="nc-fade-gallery__viewport">
${ANSICHTEN.map(([, alt], i) => `<div class="nc-fade-gallery__media${i === aktiv ? ' is-active' : ''}" role="tabpanel" id="${u}-p${i}" aria-labelledby="${u}-t${i}"${i !== aktiv ? ' aria-hidden="true"' : ''}><img src="${BILD_SRC}" alt="${alt}" decoding="async"></div>`).join('\n')}
</div>
<div class="nc-fade-gallery__nav-row">
${pfeile ? `<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Vorherige Ansicht">${PFEIL_LINKS}</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Nächste Ansicht">${PFEIL_RECHTS}</button>
</div>` : ''}
<div class="nc-fade-gallery__tabs" role="tablist">
${ANSICHTEN.map(([tab], i) => `<button type="button" class="nc-fade-gallery__tab" role="tab" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === aktiv}" tabindex="${i === aktiv ? 0 : -1}">${tab}</button>`).join('\n')}
</div>
</div>
<div class="nc-fade-gallery__caption" aria-live="polite">
${ANSICHTEN.map(([, , text], i) => `<p class="nc-fade-gallery__desc${i === aktiv ? ' is-visible' : ''}"${i !== aktiv ? ' hidden' : ''}>${text}</p>`).join('\n')}
</div>
</div>`
}

/** Eine Ansicht zeigen — dieselben Zustaende wie die Website nach einem Tab-Klick. */
export function zeigeAnsicht (galerie, i) {
  const medien = [...galerie.querySelectorAll('.nc-fade-gallery__media')]
  const tabs = [...galerie.querySelectorAll('.nc-fade-gallery__tab')]
  const texte = [...galerie.querySelectorAll('.nc-fade-gallery__desc')]
  medien.forEach((el, k) => {
    el.classList.toggle('is-active', k === i)
    if (k === i) el.removeAttribute('aria-hidden')
    else el.setAttribute('aria-hidden', 'true')
  })
  tabs.forEach((el, k) => {
    el.setAttribute('aria-selected', String(k === i))
    el.setAttribute('tabindex', k === i ? '0' : '-1')
  })
  texte.forEach((el, k) => {
    if (k === i) {
      // erst einblenden (hidden weg), dann im naechsten Bild is-visible —
      // sonst startet die Transition des SCSS nicht
      el.hidden = false
      naechsterFrame(() => el.classList.add('is-visible'))
    } else {
      el.classList.remove('is-visible')
      el.hidden = true
    }
  })
}

export const abspielen = {
  hinweis: 'Die Ansichten wechseln im Takt; die Überblendung kommt aus dem SCSS (is-active, is-visible).',
  starten (zelle) {
    return alle([...zelle.querySelectorAll('.nc-fade-gallery')].map((galerie) => {
      const medien = galerie.querySelectorAll('.nc-fade-gallery__media')
      const start = Math.max(0, [...medien].findIndex((el) => el.classList.contains('is-active')))
      const anhalten = imTakt((n) => zeigeAnsicht(galerie, (start + n) % medien.length))
      return () => { anhalten(); zeigeAnsicht(galerie, start) }
    }))
  }
}
