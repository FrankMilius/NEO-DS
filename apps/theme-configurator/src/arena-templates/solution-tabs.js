// Vorlage: solution-tabs — Markup aus data/markup/solution-tabs.html, siehe
// _loesungs-tabs.js. orientation/variant per Modifier; autoplay=on zeigt die
// Fortschrittsbalken (Slot progress); Zustand active waehlt den zweiten Tab.
import { an } from './_helfer.js'
import { loesungsTabs } from './_loesungs-tabs.js'

export default (zelle, m) => loesungsTabs(m, `${m.basisKlasse} nc-tab-nav`, {
  aktiv: m.hat('active') ? 1 : 0,
  autoplay: m.wert('autoplay'),
  fortschritt: m.wert('autoplay') === 'on' && an(m, 'progress'),
  features: an(m, 'features'),
  cta: an(m, 'cta')
})
