// Vorlage: mobile-drawer — Drawer der Mobil-Navigation, aus dem Drupal-Theme
// aufgenommen (neo-overrides.css). Ein geerntetes data/markup gibt es nicht;
// das Markup folgt den BEM-Klassen in scss/scss/07-organisms/
// _mobile-drawer.scss (Recipe-Anatomie):
//   div.nc-mobile-drawer__backdrop (+ --visible)   Geschwister, davor
//   aside.nc-mobile-drawer (+ --open)  aria-label
//     div.nc-mobile-drawer__header > span.__title + button.__close
//     nav.nc-mobile-drawer__nav > ul.__list > li > a.__link
//       (+ ul.__sublist > li > a.__sublink)
//
// Achse variante: default = geschlossen (translateX(100%), aus dem Bild
// geschoben), open = .nc-mobile-drawer--open + Backdrop sichtbar.
// Rahmen ra-buehne--mobil-drawer: beide Teile sind position: fixed — der
// Rahmen macht sich per contain zu ihrem Bezugsrahmen (wie ra-buehne). Das DS
// blendet Drawer und Backdrop ab 1200 px FENSTERbreite aus (display: none
// !important); der Rahmen stellt die Lage darunter dar (RecipeArena.vue).
//
// Specimens: zustand (geschlossen gegen offen), unterpunkte (offen, mit
// Unterliste und aktuellem Ast), hover (nur interaktiv: data-zustand am
// ersten Link).
//
// „Ausprobieren" (Entscheidung 06.10.2026, overlay-verhalten): Knopf
// „Menü öffnen" mit aria-controls im Rahmen, Drawer startet geschlossen; das
// Behavior mobile-drawer aus neo-behaviors oeffnet ihn (Fokus-Falle,
// Escape, Backdrop, Fokus zurueck). Auf der Website steuert ihn bis zur
// Umstellung neo-theme.js (neoMobileNav).
import { esc, SYMBOL } from './_helfer.js'

const PUNKTE = [
  ['Produkte', ['Social Intranet', 'Mitarbeiter App', 'Magazin']],
  ['Lösungen', []],
  ['Kunden', []],
  ['Über uns', []]
]

export default (zelle, m) => {
  const offen = m.wert('variante') === 'open' && !m.ausprobieren
  const mitUnterpunkten = m.specimen.render?.unterpunkte === true
  const marke = m.attribute['data-zustand']
  const klassen = ['nc-mobile-drawer', offen ? 'nc-mobile-drawer--open' : ''].filter(Boolean).join(' ')
  const eintraege = PUNKTE.map(([titel, unter], i) => {
    const liste = mitUnterpunkten && unter.length
      ? `\n<ul class="nc-mobile-drawer__sublist">\n${unter.map((u, k) => `<li><a class="nc-mobile-drawer__sublink" href="#"${k === 1 ? ' aria-current="page"' : ''}>${esc(u)}</a></li>`).join('\n')}\n</ul>`
      : ''
    const extra = i === 0 && marke ? ` data-zustand="${marke}"` : ''
    return `<li><a class="nc-mobile-drawer__link" href="#"${extra}>${esc(titel)}</a>${liste}</li>`
  }).join('\n')
  const knopf = m.ausprobieren
    ? `<button type="button" class="nc-button nc-button--outline" aria-controls="${m.uid}-drawer" aria-expanded="false">Menü öffnen</button>\n`
    : ''
  return `<div class="ra-buehne ra-buehne--mobil-drawer">
${knopf}<div class="nc-mobile-drawer__backdrop${offen ? ' nc-mobile-drawer__backdrop--visible' : ''}" aria-hidden="true"></div>
<aside class="${klassen}" id="${m.uid}-drawer" aria-label="Menü"${offen ? '' : ' aria-hidden="true"'}>
<div class="nc-mobile-drawer__header">
<span class="nc-mobile-drawer__title">Menü</span>
<button type="button" class="nc-mobile-drawer__close" aria-label="Menü schließen">${SYMBOL.schliessen}</button>
</div>
<nav class="nc-mobile-drawer__nav" aria-label="Hauptnavigation">
<ul class="nc-mobile-drawer__list">
${eintraege}
</ul>
</nav>
</aside>
</div>`
}
