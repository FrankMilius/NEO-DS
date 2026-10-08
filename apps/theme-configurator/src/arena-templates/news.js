// Vorlage: news — wie node--news--full.html.twig (neo_fe); eine Markup-Ernte
// gibt es nicht. Hero mit Bild, Overlay, Eyebrow (Kicker + Datum), Titel,
// Lead und CTA; darunter Text und Fusszeile. Texte aus
// data/markup/card-grid.html (Produktnews).
// Plan v3, Phase 4:
//   - Rahmen ra-desktop: der Block ist fuer die Seitenbreite gebaut
//     (Container-Breite, Hero min. 400 px hoch)
//   - __hero-media ist eine Flaeche mit background-size: cover — das Bild
//     kommt als Hintergrundbild (Instanzwert wie in Drupal), kein <img>
//   - render.compositionType „ohne-bild": Hero ohne Medium und Overlay (die
//     Slots hero-media/hero-overlay fehlen, der Hero steht auf background-base)
// Freigabe (Abschluss Plan v3, 08.10.2026) — Struktur wie im Template:
//   - mit Bild traegt der Hero nc-news__hero--has-media und neo-dark-theme
//     (dunkel gebundene Theme-Tokens, heller Text auf dem Verlauf)
//   - Fokuspunkt und Zoom inline am Medium wie in Drupal (hier Mitte, 1)
//   - Hero-Inhalt und Textbereich mit nc-cw-* (Vorgaben wide und content)
//     statt nc-container; die Fusszeile nimmt nc-container
//   - Fusszeile mit den Huellen __footer-cta und __contact
//   - Titel als h2 (die Website setzt h1; der Konfigurator traegt die
//     Seitenueberschrift selbst)
import { BILD_SRC, an } from './_helfer.js'

export default (zelle, m) => {
  const bild = m.specimen.render?.compositionType !== 'ohne-bild' && an(m, 'hero-media')
  return `<div class="ra-desktop">
<article class="${m.klasse}"${m.attrs}>
<header class="nc-news__hero${bild ? ' nc-news__hero--has-media neo-dark-theme' : ''}">
${bild ? `<div class="nc-news__hero-media" style="background-image: url(&quot;${BILD_SRC}&quot;); background-position: 50% 50%; transform: scale(1); transform-origin: 50% 50%;"></div>` : ''}
${bild && an(m, 'hero-overlay') ? '<div class="nc-news__hero-overlay" aria-hidden="true"></div>' : ''}
<div class="nc-news__hero-inner nc-cw-wide">
<div class="nc-news__eyebrow">
${an(m, 'kicker') ? '<span class="nc-news__kicker">Produktnews</span>' : ''}
${an(m, 'date') ? '<span class="nc-news__date"><time datetime="2026-07-01">Juli 2026</time></span>' : ''}
</div>
<h2 class="nc-news__title">Aus PIIPE Workplace wird neo workplace</h2>
${an(m, 'lead') ? '<div class="nc-news__lead"><p>Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der Produkte unter der Firmendachmarke vereinheitlicht.</p></div>' : ''}
${an(m, 'hero-cta') ? '<div class="nc-news__hero-cta"><a href="#" onclick="return false" class="nc-button nc-button--accent">Weiterlesen</a></div>' : ''}
</div>
</header>
<div class="nc-news__body u-prose nc-cw-content">
<p>neo AI – statt Suchen gibt es Antworten: sicher, offen, schnell. Perfekt für den unternehmensinternen Einsatz.</p>
</div>
${an(m, 'footer') ? `<footer class="nc-news__footer nc-container">
${an(m, 'footer-cta') ? '<div class="nc-news__footer-cta"><a href="#" onclick="return false">Alle News</a></div>' : ''}
${an(m, 'contact') ? '<div class="nc-news__contact"><a href="#" onclick="return false">Pressekontakt</a></div>' : ''}
</footer>` : ''}
</article>
</div>`
}
