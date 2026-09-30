// Vorlage: news — Aufbau aus scss/scss/07-organisms/_news.scss (aus dem
// Drupal-Theme aufgenommen; eine Markup-Ernte gibt es nicht). Hero mit Bild,
// Overlay, Eyebrow (Kicker + Datum), Titel, Lead und CTA; darunter Text und
// Fusszeile. Texte aus data/markup/card-grid.html (Produktnews).
import { BILD_SRC, an } from './_helfer.js'

export default (zelle, m) => `
<article class="${m.klasse}"${m.attrs}>
<header class="nc-news__hero">
${an(m, 'hero-media') ? `<div class="nc-news__hero-media"><img src="${BILD_SRC}" alt="" decoding="async" style="width: 100%; height: 100%; object-fit: cover;"></div>` : ''}
${an(m, 'hero-overlay') ? '<div class="nc-news__hero-overlay" aria-hidden="true"></div>' : ''}
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
</article>`
