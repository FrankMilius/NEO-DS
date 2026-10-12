// Vorlage: logo-wall — Markup aus data/markup/logo-wall.html (sechs Logos).
// layout/size/appearance/animation per Modifier; marquee legt die Logos in
// den Track (nc-logo-wall__track) und doppelt sie wie das DS-JS fuer die
// Endlosschleife; fadein zeigt den eingeblendeten Endzustand (is-visible).
// Logos als neutraler Platzhalter — die Kundenlogos liegen nur auf der Website.
// Plan v4, Phase 2 (12.10.2026): Name aus alt (kein aria-label an Pille oder
// Wand — ein div ohne Rolle traegt keinen Namen); im Laufband vor der Spur
// der Pause-Knopf .nc-logo-wall__pause wie im Twig, die Kopien aria-hidden
// (das Behavior marquee macht sie inert und schaltet den Knopf).
import { BILD_SRC } from './_helfer.js'

const PAUSE_KNOPF = '<button type="button" class="nc-logo-wall__pause" data-playing="true">' +
  '<svg class="nc-logo-wall__pause-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path class="nc-logo-wall__pause-pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' +
  '<path class="nc-logo-wall__pause-play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg>' +
  '<span class="nc-logo-wall__pause-label">Laufband anhalten</span></button>'

const KUNDEN = ['AWO', 'Dataport', 'degewo', 'Deutsche Rentenversicherung', 'Festo', 'KVNO']

export default (zelle, m) => {
  const layout = m.wert('layout') || 'grid'
  const fadein = m.wert('animation') === 'fadein'
  const pille = (name, kopie) => `<div class="nc-logo-pill${fadein ? ' is-visible' : ''}"${kopie ? ' aria-hidden="true"' : ''}><img class="nc-logo-pill__img" src="${BILD_SRC}" alt="${kopie ? '' : name}" loading="lazy" decoding="async"></div>`
  const pillen = KUNDEN.map((k) => pille(k, false)).join('\n')
  const inhalt = layout === 'marquee'
    ? `${PAUSE_KNOPF}\n<div class="nc-logo-wall__track">\n${pillen}\n${KUNDEN.map((k) => pille(k, true)).join('\n')}\n</div>`
    : pillen
  return `
<div class="${m.klasse}" data-layout="${layout}"${m.attrs}>
${inhalt}
</div>`
}
