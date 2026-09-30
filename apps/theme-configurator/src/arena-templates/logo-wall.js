// Vorlage: logo-wall — Markup aus data/markup/logo-wall.html (sechs Logos).
// layout/size/appearance/animation per Modifier; marquee legt die Logos in
// den Track (nc-logo-wall__track) und doppelt sie wie das DS-JS fuer die
// Endlosschleife; fadein zeigt den eingeblendeten Endzustand (is-visible).
// Logos als neutraler Platzhalter — die Kundenlogos liegen nur auf der Website.
import { BILD_SRC } from './_helfer.js'

const KUNDEN = ['AWO', 'Dataport', 'degewo', 'Deutsche Rentenversicherung', 'Festo', 'KVNO']

export default (zelle, m) => {
  const layout = m.wert('layout') || 'grid'
  const fadein = m.wert('animation') === 'fadein'
  const pille = (name, kopie) => `<div class="nc-logo-pill${fadein ? ' is-visible' : ''}" aria-label="${name}"${kopie ? ' aria-hidden="true"' : ''}><img class="nc-logo-pill__img" src="${BILD_SRC}" alt="${kopie ? '' : name}" loading="lazy" decoding="async"></div>`
  const pillen = KUNDEN.map((k) => pille(k, false)).join('\n')
  const inhalt = layout === 'marquee'
    ? `<div class="nc-logo-wall__track">\n${pillen}\n${KUNDEN.map((k) => pille(k, true)).join('\n')}\n</div>`
    : pillen
  return `
<div class="${m.klasse}" data-layout="${layout}" aria-label="Unsere Kunden"${m.attrs}>
${inhalt}
</div>`
}
