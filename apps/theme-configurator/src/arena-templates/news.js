// Vorlage: news — Aufbau aus scss/scss/07-organisms/_news.scss (aus dem
// Drupal-Theme aufgenommen; eine Markup-Ernte gibt es nicht). Hero mit Bild,
// Overlay, Eyebrow (Kicker + Datum), Titel, Lead und CTA; darunter Text und
// Fusszeile. Texte aus data/markup/card-grid.html (Produktnews).
// Plan v3, Phase 4:
//   - Rahmen ra-desktop: der Block ist fuer die Seitenbreite gebaut
//     (Container-Breite, Hero min. 400 px hoch)
//   - __hero-media ist eine Flaeche mit background-size: cover — das Bild
//     kommt als Hintergrundbild (Instanzwert wie in Drupal), kein <img>
//   - render.compositionType „ohne-bild": Hero ohne Medium und Overlay (die
//     Slots hero-media/hero-overlay fehlen, der Hero steht auf background-base)
import { BILD_SRC, an } from './_helfer.js'

export default (zelle, m) => {
  const bild = m.specimen.render?.compositionType !== 'ohne-bild'
  return `<div class="ra-desktop">
<article class="${m.klasse}"${m.attrs}>
<header class="nc-news__hero">
${bild && an(m, 'hero-media') ? `<div class="nc-news__hero-media" style="background-image: url(&quot;${BILD_SRC}&quot;);" aria-hidden="true"></div>` : ''}
${bild && an(m, 'hero-overlay') ? '<div class="nc-news__hero-overlay" aria-hidden="true"></div>' : ''}
<div class="nc-news__hero-inner nc-container">
<div class="nc-news__eyebrow">
${an(m, 'kicker') ? '<span class="nc-news__kicker">Produktnews</span>' : ''}
<time class="nc-news__date" datetime="2026-07-01">Juli 2026</time>
</div>
${an(m, 'title') ? '<h2 class="nc-news__title">Aus PIIPE Workplace wird neo workplace</h2>' : ''}
${an(m, 'lead') ? '<p class="nc-news__lead">Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der Produkte unter der Firmendachmarke vereinheitlicht.</p>' : ''}
<div class="nc-news__hero-cta"><a href="#" onclick="return false" class="nc-button nc-button--accent">Weiterlesen</a></div>
</div>
</header>
<div class="nc-news__body nc-container u-prose">
<p>neo AI – statt Suchen gibt es Antworten: sicher, offen, schnell. Perfekt für den unternehmensinternen Einsatz.</p>
</div>
<footer class="nc-news__footer nc-container">
<a href="#" onclick="return false">Alle News</a>
<a href="#" onclick="return false">Pressekontakt</a>
</footer>
</article>
</div>`
}
