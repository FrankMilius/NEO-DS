// Vorlage: navigation — das DS-Bauteil Kopfzeile + Hauptnavigation
// (.nc-header / .nc-nav), Markup nach scss/scss/07-organisms/_navigation.scss,
// dem Code-Beispiel in docs/navigation-docs.html und data/markup/navigation.html
// (dort ohne die Inline-Stile der Doku):
//   header.nc-header (+ --transparent/--solid, .is-scrolled/.is-hidden)
//     nav.nc-nav (+ --align-center/--align-right)  aria-label
//       div.nc-nav__inner
//         a.nc-brand
//         ul.nc-nav__list > li.nc-nav__item > a.nc-nav__link (nav-molecules)
//         div.nc-nav__actions > a.nc-button.nc-button--primary
//         button.nc-mobile-toggle > span.nc-mobile-toggle__icon (nav-molecules)
//
// Achsen: emphasis = Modifier an der Wurzel (nc-header), alignment =
// Modifier am Kind nc-nav (nicht an der Wurzel).
// Zustaende scrolled/hidden: .is-scrolled bzw. .is-hidden am Header (setzt in
// Drupal das Scroll-Skript). Der versteckte Header schiebt sich aus seinem
// Rahmen (ra-kopf) — die Zelle zeigt den leeren Rahmen, wie die Seite.
// emphasis=transparent liegt auf einem dunklen Arena-Grund (ra-kulisse),
// sonst stuende Weiss auf Weiss.
//
// Hinweis: Liste, Aktionen und Burger schaltet das DS ueber die Breite des
// FENSTERS (ab 1200 px Liste/Aktionen, darunter Burger) — nicht ueber die
// Zellenbreite. Die Arena zeigt deshalb, was das Fenster vorgibt. Die
// Mobil-Lage unabhaengig vom Fenster gibt es per DS-Klasse .nc-header--mobile
// (Entscheidung 02.10.2026); das Recipe hat dafuer noch kein Specimen.
//
// Die Website-Navigation „V3 Tab-Mega" (Drupal-Modul neo_nav) ist NICHT
// Gegenstand dieses Recipes — sie hat ein eigenes: navigation-tab-mega
// (Entscheidung 02.10.2026).
import { wurzelKlassen, kindModifier } from './_overlay.js'

const LINKS = ['Produkte', 'Lösungen', 'Kunden', 'News', 'Über uns']

export default (zelle, m) => {
  const kopf = [wurzelKlassen(m)]
  if (m.hat('scrolled')) kopf.push('is-scrolled')
  if (m.hat('hidden')) kopf.push('is-hidden')
  const nav = ['nc-nav', ...kindModifier(m, 'nc-nav--')].join(' ')
  const links = LINKS.map((t, i) => `<li class="nc-nav__item"><a class="nc-nav__link" href="#"${i === 0 ? ' aria-current="page"' : ''}>${t}</a></li>`).join('\n')
  const rahmen = ['ra-kopf', m.wert('emphasis') === 'transparent' ? 'ra-kulisse' : ''].filter(Boolean).join(' ')

  return `<div class="${rahmen}">
<header class="${kopf.join(' ')}">
<nav class="${nav}" aria-label="Hauptnavigation">
<div class="nc-nav__inner">
<a class="nc-brand" href="#">neocosmo</a>
<ul class="nc-nav__list">
${links}
</ul>
<div class="nc-nav__actions">
<a class="nc-button nc-button--primary" href="#">Demo anfragen</a>
</div>
<button type="button" class="nc-mobile-toggle" aria-expanded="false" aria-label="Navigation öffnen"><span class="nc-mobile-toggle__icon" aria-hidden="true"></span></button>
</div>
</nav>
</header>
</div>`
}
