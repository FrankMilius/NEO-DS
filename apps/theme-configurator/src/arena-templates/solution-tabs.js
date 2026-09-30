// Vorlage: solution-tabs — wie Drupal.behaviors.neoSolutionTabs (neo_fe,
// js/neo-theme.js) auf der Wurzel aus block--block-content--neo-solution-tabs
// .html.twig; siehe _loesungs-tabs.js. orientation/variant per Modifier;
// autoplay=on belebt den Fortschrittsbalken; Zustand active waehlt den
// zweiten Tab.
import { an } from './_helfer.js'
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => loesungsTabs(m, m.basisKlasse, {
  modus: 'solution-tabs',
  aktiv: m.hat('active') ? 1 : 0,
  vertikal: m.wert('orientation') === 'vertical',
  autoplay: m.wert('autoplay'),
  fortschritt: an(m, 'progress'),
  features: an(m, 'features'),
  cta: an(m, 'cta'),
  schaubild: an(m, 'visual')
})
