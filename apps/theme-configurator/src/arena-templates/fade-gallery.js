// Vorlage: fade-gallery — Markup aus data/markup/fade-gallery.html (drei
// Ansichten, erste aktiv). navigation=paddles blendet die Pfeile ein, tabs
// zeigt nur die Tab-Leiste.
import { BILD_SRC, PFEIL_LINKS, PFEIL_RECHTS } from './_helfer.js'

const ANSICHTEN = [
  ['Dashboard', 'PIIPE Workplace Dashboard mit Projektübersicht', 'Das zentrale Dashboard gibt dir den Überblick über alle laufenden Projekte, offene Aufgaben und Team-Aktivitäten.'],
  ['Zusammenarbeit', 'Team-Zusammenarbeit am Arbeitsplatz', 'Arbeite mit deinem Team in Echtzeit an Dokumenten, Aufgaben und Projekten.'],
  ['Community', 'PIIPE Community und Wissensaustausch', 'Interne Foren und Wissensdatenbanken fördern den Austausch über Abteilungsgrenzen hinweg.']
]

export default (zelle, m) => {
  const u = m.uid
  const pfeile = m.wert('navigation') === 'paddles'
  return `
<div class="${m.klasse}" aria-label="Eine Plattform für alles"${m.attrs}>
<div class="nc-fade-gallery__viewport">
${ANSICHTEN.map(([, alt], i) => `<div class="nc-fade-gallery__media${i === 0 ? ' is-active' : ''}" role="tabpanel" id="${u}-p${i}" aria-labelledby="${u}-t${i}"${i ? ' aria-hidden="true"' : ''}><img src="${BILD_SRC}" alt="${alt}" decoding="async"></div>`).join('\n')}
</div>
<div class="nc-fade-gallery__nav-row">
${pfeile ? `<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Vorherige Ansicht">${PFEIL_LINKS}</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Nächste Ansicht">${PFEIL_RECHTS}</button>
</div>` : ''}
<div class="nc-fade-gallery__tabs" role="tablist">
${ANSICHTEN.map(([tab], i) => `<button type="button" class="nc-fade-gallery__tab" role="tab" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${tab}</button>`).join('\n')}
</div>
</div>
<div class="nc-fade-gallery__caption" aria-live="polite">
${ANSICHTEN.map(([, , text], i) => `<p class="nc-fade-gallery__desc${i === 0 ? ' is-visible' : ''}"${i ? ' hidden' : ''}>${text}</p>`).join('\n')}
</div>
</div>`
}
