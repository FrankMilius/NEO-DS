// Vorlage: tab-nav — derselbe geerntete Block wie solution-tabs
// (data/markup/tab-nav.html), siehe _loesungs-tabs.js. Zustand active waehlt
// den zweiten Tab.
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => loesungsTabs(m, `nc-solution-tabs ${m.basisKlasse}`, {
  aktiv: m.hat('active') ? 1 : 0,
  fortschritt: false,
  features: true,
  cta: true
})
