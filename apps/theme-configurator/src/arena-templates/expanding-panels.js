// Vorlage: expanding-panels — Markup aus data/markup/expanding-panels.html.
// Zustand open klappt das erste Panel auf (aria-expanded) — so startet die
// Website (das Drupal-Skript setzt das aktive Panel); default zeigt alle
// Panels zugeklappt (Stand ohne Skript). Hover und Fokus klappen per CSS auf
// (:hover, :focus-within). Optionale Slots num/bg per render.slotConfig
// (Plan v3, Phase 4). „Ausprobieren" (Entscheidung 06.10.2026,
// website-verhalten): das Behavior expanding-panels aus neo-behaviors
// oeffnet beim Binden das erste Panel und macht Single-Open per Klick und
// Pfeiltasten (Pos1/Ende). Auf der Website bis zur Umstellung neo-theme.js
// (NeoExpandingPanels.render).
import { klassenOhne } from './_helfer.js'
import { slotAn as an, desktop } from './_bloecke-1.js'

const PANELS = [
  ['01', 'Open Source', 'GPL / MIT', '100 % Open Source', 'Transparenter, auditierbarer Code ohne Vendor-Lock-in. Digitale Souveränität für Unternehmen und öffentliche Hand.'],
  ['02', 'Cloud &amp; On-Prem', 'Betriebsmodelle', 'Cloud &amp; On-Prem', 'SaaS, Private Cloud oder eigenes Rechenzentrum – Sie entscheiden, wo Ihre Daten liegen.'],
  ['03', 'KI-nativ', 'Entwicklung &amp; Betrieb', 'KI-nativ', 'KI-gestützte Workflows in Produktentwicklung und Plattformbetrieb – nicht nachgerüstet, sondern eingebaut.'],
  ['04', 'Barrierefrei', 'WCAG 2.1 AA', 'Barrierefrei', 'WCAG-konform und BITV-ready – Zugänglichkeit als Qualitätsmerkmal des gesamten Produkts.']
]

const vorlage = (zelle, m) => {
  const offen = m.hat('open')
  return `
<div class="${klassenOhne(m, 'is-open')}" role="group" aria-label="Warum neo workplace?"${m.attrsOhne('aria-expanded', 'data-state')}>
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

// Rahmen ra-desktop: fuer die Seitenbreite gebaut (Plan v3, Phase 4)
export default (zelle, m) => desktop(vorlage(zelle, m))
