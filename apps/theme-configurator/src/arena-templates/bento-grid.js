// Vorlage: bento-grid — Markup aus data/markup/bento-grid.html (vier Zellen).
// columns=3 per Modifier; animation=reveal setzt data-animation und den
// Endzustand is-revealed (sonst blieben die Zellen unsichtbar).
//
// Plan v3, Phase 4:
// - Einblenden ist eine Website-Animation (das Drupal-JS setzt is-revealed
//   beim Scrollen). Die Zelle zeigt den Endzustand fest; die Taste
//   „Abspielen" der RecipeArena (export abspielen, Mechanismus aus
//   arena-templates/index.js) nimmt is-revealed im Takt weg und setzt es
//   wieder — die Transition des DS laeuft ab (kein GSAP im Konfigurator).
// - Specimen „medienlagen" (render.medienLagen): Zellen mit Bild, wie das
//   aus dem Drupal-Theme aufgenommene SCSS sie kennt — data-media-pos an der
//   Zelle (cover, top, bottom, left, right), Bild in .nc-bento-grid__media,
//   Text in .nc-bento-grid__content, bei cover zusaetzlich der Verlauf
//   .nc-bento-grid__scrim. Die Cover-Zelle traegt das Zellen-Thema
//   neo-dark-theme (heller Text auf dem Bild; Regel
//   .nc-bento-grid__cell.neo-dark-theme).
import { BILD_SRC } from './_helfer.js'
import { slotAn, vorgabe, desktop } from './_bloecke-1.js'
import { spieleEin, alle } from './_bewegung.js'

const ICON = {
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C7.2 1.6 6.1 1.9 6.1 1.9a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.7 8.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V20"></path></svg>',
  wolke: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.4 4.5 4.5 0 0 0 6.5 19h11Z"></path></svg>',
  ki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="12" cy="5" r="2"></circle><path d="M4 9h16M12 9v5M12 14l-4 7M12 14l4 7"></path></svg>'
}

const ZELLEN = [
  { mod: ' nc-bento-grid__cell--lg', icon: 'code', badge: 'GPL · MIT', titel: '100 % Open Source', text: 'Volle Transparenz, kein Vendor-Lock-in. Auditierbarer Code, aktive Community, digitale Souveränität.' },
  { mod: '', icon: 'wolke', titel: 'Cloud &amp; On-Prem', text: 'Flexible Betriebsmodelle für jede Compliance-Anforderung.' },
  { mod: '', icon: 'ki', titel: 'KI-nativ', text: 'KI in Entwicklung &amp; Betrieb – von Anfang an mitgedacht.' },
  { mod: ' nc-bento-grid__cell--wide', icon: 'person', titel: 'Barrierefrei', text: 'WCAG-konform nach BITV 2.0 – Zugänglichkeit als Standard, nicht als Feature.' }
]

// Lage → Groesse der Zelle (cover gross, seitliche Lagen breit) und Text.
const MEDIEN = {
  cover: { mod: ' nc-bento-grid__cell--lg', titel: 'Bild als Fläche', text: 'data-media-pos="cover": Bild füllt die Zelle, Verlauf darüber, Text unten.' },
  top: { mod: '', titel: 'Bild oben', text: 'data-media-pos="top"' },
  bottom: { mod: '', titel: 'Bild unten', text: 'data-media-pos="bottom"' },
  right: { mod: ' nc-bento-grid__cell--wide', titel: 'Bild rechts', text: 'data-media-pos="right": Bild und Text nebeneinander.' },
  left: { mod: ' nc-bento-grid__cell--wide', titel: 'Bild links', text: 'data-media-pos="left"' }
}

function medienZelle (lage) {
  const z = MEDIEN[lage]
  const thema = lage === 'cover' ? ' neo-dark-theme' : ''
  return `<article class="nc-bento-grid__cell${z.mod}${thema}" data-media-pos="${lage}">
<div class="nc-bento-grid__media"><img src="${BILD_SRC}" alt="" loading="lazy" decoding="async">${lage === 'cover' ? '<span class="nc-bento-grid__scrim" aria-hidden="true"></span>' : ''}</div>
<div class="nc-bento-grid__content">
<h3 class="nc-bento-grid__title">${z.titel}</h3>
<p class="nc-bento-grid__text">${z.text}</p>
</div>
</article>`
}

export default (zelle, m) => {
  const reveal = m.wert('animation') === 'reveal'
  const lagen = vorgabe(m, 'medienLagen', null)
  const inhalt = lagen
    ? lagen.map(medienZelle).join('\n')
    : ZELLEN.map((z, i) => `<article class="nc-bento-grid__cell${z.mod}">
${i === 0 && slotAn(m, 'mesh') ? '<span class="nc-bento-grid__mesh" aria-hidden="true"></span>' : ''}${z.badge && slotAn(m, 'badge') ? `<span class="nc-bento-grid__badge">${z.badge}</span>` : ''}${slotAn(m, 'icon') ? `<span class="nc-bento-grid__icon" aria-hidden="true">${ICON[z.icon]}</span>` : ''}
<h3 class="nc-bento-grid__title">${z.titel}</h3>
${slotAn(m, 'text') ? `<p class="nc-bento-grid__text">${z.text}</p>` : ''}
</article>`).join('\n')
  const raster = `<div class="${m.klasse}${reveal ? ' is-revealed' : ''}"${reveal ? ' data-animation="reveal"' : ''}${m.attrs}>
${inhalt}
</div>`
  // Rahmen ra-desktop: das Raster ist fuer die Seitenbreite gebaut
  return desktop(raster)
}

/**
 * „Abspielen" der Einblendung (Plan v3, Phase 4): in jeder Zelle mit
 * animation=reveal is-revealed weg und wieder an, im Takt; Anhalten stellt
 * den Endzustand her. Zellen ohne Einblendung bleiben unberuehrt.
 */
export const abspielen = {
  hinweis: 'Einblenden (animation=reveal): is-revealed weg und wieder an — die Transition des DS läuft ab. Auf der Website setzt das Drupal-JS die Klasse beim Scrollen.',
  starten (zelle) {
    return alle([...zelle.querySelectorAll('.nc-bento-grid[data-animation="reveal"]')].map((raster) => spieleEin(raster, 'is-revealed')))
  }
}
