// Vorlage: card-cta — Markup aus data/markup/card-cta.html.
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse}" data-theme="dark"${m.attrs}>
<img class="nc-card-cta__media" src="${BILD_SRC}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="#" onclick="return false" class="nc-button nc-button--primary" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>
`
