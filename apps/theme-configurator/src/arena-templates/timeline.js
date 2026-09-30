// Vorlage: timeline — Markup aus data/markup/timeline.html (drei Phasen).
// variant per Modifier; icon zeigt Symbole in den Knoten, compact laesst
// Liste und CTA weg. nodeStatus hat keinen Wurzel-Modifier, sondern setzt
// nc-timeline__node--<status> an die Knoten. Die Einblendung beim Scrollen
// ist als Endzustand gesetzt (is-visible).
import { an } from './_helfer.js'

const ICONS = [
  '<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path></svg>',
  '<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2M12 19v2M3 12h2M19 12h2"></path></svg>',
  '<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"></path></svg>'
]

const PHASEN = [
  ['Woche 1–2', 'danger', 'Gemeinsam', 'Phase 1', 'Planung', 'Wir lernen uns kennen — und hören genau hin.', ['Kick-off-Workshop', 'Bedarfsanalyse &amp; IT-Infrastruktur-Klärung'], 'Beratung anfragen'],
  ['Woche 3–5', 'info', 'NEOCOSMO', 'Phase 2', 'Aufbau', 'Wir bauen — Sie arbeiten weiter.', ['Konfiguration Standardsystem &amp; Anpassung', 'Corporate-Design-Anpassung'], 'Leistungen ansehen'],
  ['Ab Monat 3', 'accent', 'Kunde', 'Phase 3', 'Betrieb &amp; Ausbau', 'Wir bleiben dabei — auch danach.', ['Redaktions- &amp; Kundensupport', 'Kundenspezifische Erweiterungen'], 'Support kontaktieren']
]

export default (zelle, m) => {
  const variante = m.wert('variant') || 'default'
  const status = m.wert('nodeStatus')
  const knotenKlasse = `nc-timeline__node${status && status !== 'default' ? ` nc-timeline__node--${status}` : ''}`
  const kompakt = variante === 'compact'
  return `
<ol class="${m.klasse}" aria-label="In drei Schritten zur produktiven Plattform"${m.attrs}>
${PHASEN.map(([zeit, ton, badge, phase, titel, lead, liste, cta], i) => `<li class="nc-timeline__item is-visible">
<div class="${knotenKlasse}">${variante === 'icon' ? ICONS[i] : ''}</div>
<div class="nc-timeline__content">
<div class="nc-timeline__meta">
${an(m, 'period') ? `<span class="nc-timeline__period">${zeit}</span>` : ''}
${an(m, 'badge') ? `<span class="nc-timeline__badge nc-timeline__badge--${ton}">${badge}</span>` : ''}
</div>
${an(m, 'phase') ? `<p class="nc-timeline__phase">${phase}</p>` : ''}
<h3 class="nc-timeline__title">${titel}</h3>
${an(m, 'lead') ? `<p class="nc-timeline__lead">${lead}</p>` : ''}
${!kompakt && an(m, 'list') ? `<ul class="nc-timeline__list">${liste.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
${!kompakt && an(m, 'cta') ? `<div class="nc-timeline__cta"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>${cta}</span></a></div>` : ''}
</div>
</li>`).join('\n')}
</ol>`
}
