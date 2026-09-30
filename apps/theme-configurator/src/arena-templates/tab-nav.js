// Vorlage: tab-nav — wie der Tab-Navigations-Block im Drupal-Theme (neo_fe):
// Wurzel „nc-solution-tabs nc-tab-nav" aus block--block-content--neo-tab-nav
// .html.twig, Tabs/Panels aus js/neo-theme.js; siehe _loesungs-tabs.js.
// Zustand active waehlt den zweiten Tab.
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => loesungsTabs(m, `nc-solution-tabs ${m.basisKlasse}`, {
  modus: 'tab-nav',
  aktiv: m.hat('active') ? 1 : 0,
  vertikal: /nc-solution-tabs--vertical/.test(m.basisKlasse),
  fortschritt: true,
  features: true,
  cta: true
})
