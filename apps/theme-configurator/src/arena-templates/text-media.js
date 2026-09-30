// Vorlage: text-media — Markup aus data/markup/text-media.html, abgeglichen
// mit block--block-content--neo-text-media.html.twig (neo_fe).
// Drupal setzt die Medienposition als nc-text-media--media-left|right; nur
// diese Klasse kennt das SCSS (_text-media.scss). Der Recipe-Modifier
// nc-text-media--reversed fuer layout=media-right hat dort keine Regel und
// wird deshalb durch die Drupal-Klasse ersetzt.
import { BILD_SRC } from './_helfer.js'

function textMediaKlasse (m) {
  const seite = m.wert('layout') === 'media-right' ? 'right' : 'left'
  return [...m.klassen.filter((k) => k !== 'nc-text-media--reversed'), `nc-text-media--media-${seite}`].join(' ')
}

export default (zelle, m) => `
<div class="${textMediaKlasse(m)}"${m.attrs}>
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
