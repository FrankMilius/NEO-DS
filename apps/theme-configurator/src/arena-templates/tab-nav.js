// Vorlage: tab-nav — wie der Tab-Navigations-Block im Drupal-Theme (neo_fe):
// Wurzel „nc-solution-tabs nc-tab-nav" aus block--block-content--neo-tab-nav
// .html.twig, Tabs/Panels aus js/neo-theme.js; siehe _loesungs-tabs.js.
// Plan v3, Phase 4 — nach data/markup/tab-nav.html (Website /node/1):
//   variant      line / contained (nc-solution-tabs--contained, Website)
//   Zustand      active waehlt den zweiten Tab
//   render.compositionType  Inhaltsmodul des Panels: feature-liste
//                (Standard der Website), features, bento, panels
// Animierter Website-Block: mit data-autoplay="on" laeuft der
// Fortschrittsbalken des aktiven Tabs (CSS-Keyframes des DS). Die Zellen
// zeigen das Standbild (autoplay off); die Taste „Abspielen" der RecipeArena
// (export abspielen) schaltet autoplay an, Anhalten wieder aus — den
// Tabwechsel danach macht auf der Website neo-theme.js, die Arena nicht.
// Rahmen ra-desktop: der Block ist fuer die Seitenbreite gebaut.
// Flaeche (Entscheidung 06.10.2026): wie im Twig steht der Block in
// section.nc-section.nc-section--full.nc-solution-tabs-section > .nc-container
// — die Section setzt die Farb-Tokens der Tabs und Texte
// (--nc-solution-tabs-title/-text/-tab-color…) und den Abstand. Der
// Haken nc-tab-nav-section und die Inline-Flaeche (field_st_bg, Standard
// background-base) sind Website-only und fehlen hier.
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => `<div class="ra-desktop">
<section class="nc-section nc-section--full nc-solution-tabs-section">
<div class="nc-container">${loesungsTabs(m, `nc-solution-tabs ${m.basisKlasse}`, {
  modus: 'tab-nav',
  aktiv: m.hat('active') ? 1 : 0,
  vertikal: false,
  autoplay: 'off',
  fortschritt: true,
  modul: m.specimen.render?.compositionType || 'feature-liste',
  cta: true
})}</div>
</section>
</div>`

/** Animierter Block: Standbild, Autoplay-Fortschritt mit „Abspielen" (Plan v3, Phase 4). */
export const abspielen = {
  hinweis: 'Autoplay an: der Fortschrittsbalken des aktiven Tabs läuft (CSS des DS). Den Tabwechsel macht auf der Website neo-theme.js.',
  starten (zelle) {
    const wurzeln = [...zelle.querySelectorAll('.nc-tab-nav[data-autoplay]')]
    for (const w of wurzeln) w.setAttribute('data-autoplay', 'on')
    return () => { for (const w of wurzeln) w.setAttribute('data-autoplay', 'off') }
  }
}
