// Vorlage: tab-nav — wie der Tab-Navigations-Block im Drupal-Theme (neo_fe):
// Wurzel „nc-solution-tabs nc-tab-nav" aus block--block-content--neo-tab-nav
// .html.twig, Tabs/Panels aus js/neo-theme.js; siehe _loesungs-tabs.js.
// Plan v3, Phase 4 — nach data/markup/tab-nav.html (Website /node/1):
//   variant      line / contained (nc-solution-tabs--contained, Website)
//   Zustand      active waehlt den zweiten Tab
//   render.compositionType  Inhaltsmodul des Panels: feature-liste
//                (Standard der Website), features, bento, panels
// Animierter Website-Block: mit data-autoplay="on" laeuft der
// Fortschrittsbalken des aktiven Tabs (CSS-Keyframes des DS). „Zustände"
// zeigt das Standbild (autoplay off), „Abspielen" schaltet autoplay an —
// den Tabwechsel danach macht auf der Website neo-theme.js, die Arena nicht.
// Rahmen ra-desktop: der Block ist fuer die Seitenbreite gebaut.
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => `<div class="ra-desktop">${loesungsTabs(m, `nc-solution-tabs ${m.basisKlasse}`, {
  modus: 'tab-nav',
  aktiv: m.hat('active') ? 1 : 0,
  vertikal: false,
  autoplay: m.ausprobieren ? 'on' : 'off',
  fortschritt: true,
  modul: m.specimen.render?.compositionType || 'feature-liste',
  cta: true
})}</div>`

/** Animierter Block: Standbild in „Zustände", Autoplay-Fortschritt auf Wunsch. */
export const ausprobieren = {
  knopf: 'Abspielen',
  hinweis: 'Autoplay an: der Fortschrittsbalken des aktiven Tabs läuft (CSS des DS). Den Tabwechsel macht auf der Website neo-theme.js. Bei „Bewegung reduzieren" kein Balken.'
}
