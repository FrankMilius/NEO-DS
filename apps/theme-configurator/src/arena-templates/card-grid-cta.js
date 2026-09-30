// Vorlage: card-grid-cta — Markup aus data/markup/card-grid-cta.html (vier
// von sechs Kacheln). Die Inline-Variablen fuer Knopffarben auf dunklem Bild
// stehen so im geernteten Markup.
import { BILD_SRC } from './_helfer.js'

const HELL = 'style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);"'
const GHOST = 'style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);"'

const KACHELN = [
  ['Workplace Platform', 'Plattform entdecken', 'primary', 60],
  ['Analytics &amp; Reporting in Echtzeit', 'Dashboard testen', 'ghost', 80],
  ['Enterprise Security für Ihr Team', 'Mehr erfahren', 'primary', 60],
  ['Nahtlose Integrationen', 'Alle Apps', 'ghost', 100]
]

export default (zelle, m) => `
<div class="${m.klasse}" style="--cgc-columns: 2; --cgc-ratio: 4/3;"${m.attrs}>
${KACHELN.map(([titel, cta, art, breite]) => `<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="${BILD_SRC}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: ${breite}%;">${titel}</h3>
<div class="nc-card-cta__actions"><a href="#" onclick="return false" class="nc-button nc-button--${art}" ${art === 'ghost' ? GHOST : HELL}>${cta}</a></div>
</div>
</div>`).join('\n')}
</div>`
