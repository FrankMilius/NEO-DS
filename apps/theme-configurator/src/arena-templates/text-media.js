// Vorlage: text-media — Markup aus data/markup/text-media.html.
// layout=media-right setzt --reversed.
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-text-media__grid">
<div class="nc-text-media__media">
<img src="${BILD_SRC}" alt="" class="nc-text-media__image nc-media-frame" loading="lazy">
</div>
<div class="nc-text-media__content">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title">Verpasst? Jetzt als Aufzeichnung ansehen</h2>
<p class="nc-section-header__subtitle">Unser letztes Webinar „Intranet-Relaunch: Erfahrungsbericht Festo“ ist jetzt als Aufzeichnung verfügbar. Erfahren Sie, wie Festo 20.000 Mitarbeitende weltweit auf PIIPE Workplace migriert hat.</p>
</div>
<div class="nc-text-media__cta">
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Aufzeichnung ansehen</span></a>
</div>
</div>
</div>
</div>
`
