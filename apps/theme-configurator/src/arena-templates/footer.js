// Vorlage: footer — Markup aus data/markup/footer.html.
// layout: simple blendet Sitemap und Newsletter aus (slotConfig des Recipes),
// cta-active stellt den Engagement-CTA (nc-footer__cta) voran. columns
// bestimmt Modifier UND Zahl der Spalten; theme=inverse per Modifier.
import { an } from './_helfer.js'

const SPALTEN = [
  ['Produkte', ['neo workplace', 'neo workplace App', 'neo magazine', 'neo AI']],
  ['Lösungen', ['Lösungen im Überblick', 'Integrationen', 'Technologie &amp; Sicherheit', 'Editionen &amp; Preise']],
  ['Unternehmen', ['Über NEOCOSMO', 'Kunden', 'News', 'Karriere']],
  ['Inside', ['Support-Portal', 'Dokumentation', 'Innovation Blog', 'App Store']]
]

const LINKEDIN = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 11v5"></path><path d="M8 8v.01"></path><path d="M12 16v-5"></path><path d="M16 16v-3a2 2 0 1 0-4 0"></path><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4z"></path></svg>'
const MAIL = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><path d="M3 7l9 6 9-6"></path></svg>'

export default (zelle, m) => {
  const anzahl = Number(m.wert('columns')) || 3
  const spalten = an(m, 'columns') ? `
<nav class="nc-footer__nav" aria-label="Footer Navigation">
<div class="nc-footer__columns">
${SPALTEN.slice(0, anzahl).map(([titel, links]) => `<div class="nc-footer__column">
<h3 class="nc-footer__heading">${titel}</h3>
<ul class="nc-footer__links">${links.map((l) => `<li><a class="nc-footer__link" href="#" onclick="return false">${l}</a></li>`).join('')}</ul>
</div>`).join('\n')}
</div>
</nav>` : ''
  const newsletter = an(m, 'newsletter') ? `
<div class="nc-footer__newsletter">
<h3 class="nc-footer__heading">Newsletter</h3>
<p class="nc-footer__newsletter-text">Neuigkeiten zu Produkten, Releases und Veranstaltungen — etwa monatlich.</p>
<form class="nc-footer__newsletter-form" novalidate onsubmit="return false">
<label class="nc-sr-only" for="${m.uid}-nl">E-Mail-Adresse</label>
<input class="nc-input nc-footer__newsletter-input" type="email" id="${m.uid}-nl" placeholder="name@firma.de">
<button type="button" class="nc-button nc-button--accent">Abonnieren</button>
</form>
</div>` : ''
  const cta = m.slot('cta-area') ? `
<div class="nc-footer__cta">
<p class="nc-footer__cta-kicker">Bereit?</p>
<p class="nc-footer__cta-headline">Lassen Sie uns über Ihren digitalen Arbeitsplatz sprechen.</p>
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg">Demo vereinbaren</a>
</div>
<div class="nc-footer__separator" aria-hidden="true"></div>` : ''
  return `
<footer class="${m.klasse}" aria-label="Fußzeile"${m.attrs}>
<div class="nc-footer__inner nc-container">${cta}
<div class="nc-footer__main">
<div class="nc-footer__brand">
<div class="nc-footer__contact">
<h3 class="nc-footer__heading">Kontakt</h3>
<address class="nc-footer__address">NEOCOSMO GmbH<br>Science Park 2<br>66123 Saarbrücken</address>
<a class="nc-footer__contact-link" href="#" onclick="return false">welcome@neocosmo.de</a>
</div>
</div>${spalten}${newsletter}
</div>
${an(m, 'separator') ? '<div class="nc-footer__separator" aria-hidden="true"></div>' : ''}
<div class="nc-footer__bottom">
${an(m, 'social-links') ? `<div class="nc-footer__social">
<a class="nc-footer__social-link" href="#" onclick="return false" aria-label="LinkedIn">${LINKEDIN}</a>
<a class="nc-footer__social-link" href="#" onclick="return false" aria-label="Mail">${MAIL}</a>
</div>` : ''}
<div class="nc-footer__legal">
<span class="nc-footer__copyright">© 2026. neocosmo GmbH. Alle Rechte vorbehalten.</span>
<nav class="nc-footer__legal-links" aria-label="Rechtliches">
<a href="#" onclick="return false">Impressum</a>
<a href="#" onclick="return false">Datenschutz</a>
<a href="#" onclick="return false">Barrierefreiheit</a>
</nav>
</div>
</div>
</div>
</footer>`
}
