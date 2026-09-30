// Vorlage: expanding-panels — Markup aus data/markup/expanding-panels.html.
// Zustand open klappt das erste Panel auf (aria-expanded), default zeigt
// alle Panels zugeklappt.
import { an } from './_helfer.js'

const PANELS = [
  ['01', 'Open Source', 'GPL / MIT', '100 % Open Source', 'Transparenter, auditierbarer Code ohne Vendor-Lock-in. Digitale Souveränität für Unternehmen und öffentliche Hand.'],
  ['02', 'Cloud &amp; On-Prem', 'Betriebsmodelle', 'Cloud &amp; On-Prem', 'SaaS, Private Cloud oder eigenes Rechenzentrum – Sie entscheiden, wo Ihre Daten liegen.'],
  ['03', 'KI-nativ', 'Entwicklung &amp; Betrieb', 'KI-nativ', 'KI-gestützte Workflows in Produktentwicklung und Plattformbetrieb – nicht nachgerüstet, sondern eingebaut.'],
  ['04', 'Barrierefrei', 'WCAG 2.1 AA', 'Barrierefrei', 'WCAG-konform und BITV-ready – Zugänglichkeit als Qualitätsmerkmal des gesamten Produkts.']
]

export default (zelle, m) => {
  const offen = m.hat('open')
  return `
<div class="${m.klasse}" role="group" aria-label="Warum neo workplace?"${m.attrsOhne('aria-expanded', 'data-state')}>
${PANELS.map(([nr, label, chip, titel, text], i) => `<button type="button" class="nc-expanding-panels__panel" aria-expanded="${offen && i === 0}">
${an(m, 'bg') ? '<span class="nc-expanding-panels__bg" aria-hidden="true"></span>' : ''}
${an(m, 'num') ? `<span class="nc-expanding-panels__num">${nr}</span>` : ''}
<span class="nc-expanding-panels__label">${label}</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">${chip}</span>
<span class="nc-expanding-panels__title" role="heading" aria-level="3">${titel}</span>
<span class="nc-expanding-panels__text">${text}</span>
</span>
</button>`).join('\n')}
</div>`
}
