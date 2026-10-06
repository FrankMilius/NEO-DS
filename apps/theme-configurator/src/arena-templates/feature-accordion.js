// Vorlage: feature-accordion — Markup aus data/markup/feature-accordion.html.
// Statisch: erster Link aktiv, erster Eintrag offen (<details open>); der
// Zustand open oeffnet zusaetzlich den zweiten Eintrag. Optionaler Titel per
// render.slotConfig (Plan v3, Phase 4). Das Modell setzt fuer open pauschal
// is-open und data-state — das DS kennt beides hier nicht, der Zustand steht
// am <details>.
//
// „Ausprobieren": Auf- und Zuklappen der Eintraege macht der Browser
// (<details>). Den Wechsel der Kapitel ueber die Links links macht auf der
// Website neo-theme.js — in neo-behaviors gibt es dafuer nichts, und das
// Akkordeon-Verhalten bindet nur .nc-accordion.
import { klassenOhne } from './_helfer.js'
import { slotAn as an, desktop } from './_bloecke-1.js'

export const ausprobieren = {
  hinweis: 'Einträge rechts auf- und zuklappen (Klick, Enter/Leertaste) — das macht der Browser (<details>). Die Links links wechseln auf der Website per Skript das Kapitel; das gibt es hier nicht.'
}

const EINTRAEGE = [
  ['Echtzeit-Dashboard', 'Verfolgen Sie alle wichtigen KPIs in Echtzeit auf einem übersichtlichen Dashboard.', ['Live-Daten-Aktualisierung', 'Anpassbare Widgets', 'Export als PDF oder CSV']],
  ['Benutzerdefinierte Berichte', 'Erstellen Sie individuelle Berichte und Analysen nach Ihren eigenen Kriterien.', []],
  ['Prognosen &amp; Trends', 'KI-gestützte Vorhersagen helfen Ihnen, zukünftige Entwicklungen zu antizipieren.', []]
]

const vorlage = (zelle, m) => {
  const offen = (i) => i === 0 || (i === 1 && m.hat('open'))
  return `
<div class="${klassenOhne(m, 'is-open')}"${m.attrsOhne('data-state')}>
<div class="nc-feature-accordeon__left">
${an(m, 'title') ? '<h2 class="nc-feature-accordeon__title">Alle Features im Überblick</h2>' : ''}
<p class="nc-feature-accordeon__lead">Entdecken Sie den vollständigen Funktionsumfang unserer Plattform.</p>
<ul class="nc-feature-accordeon__links" role="list">
<li><button class="nc-feature-accordeon__link is-active" type="button">Analytics &amp; Reporting</button></li>
<li><button class="nc-feature-accordeon__link" type="button">Integrationen</button></li>
<li><button class="nc-feature-accordeon__link" type="button">Automatisierung</button></li>
</ul>
</div>
<div class="nc-feature-accordeon__right">
<div class="nc-feature-accordeon__chapter">
<h3 class="nc-feature-accordeon__chapter-title">Analytics &amp; Reporting</h3>
<div class="nc-feature-accordeon__chapter-items">
${EINTRAEGE.map(([titel, text, liste], i) => `<details class="nc-feature-accordeon__item"${offen(i) ? ' open' : ''}>
<summary class="nc-feature-accordeon__item-summary">${titel}</summary>
<div class="nc-feature-accordeon__item-body">
<p class="nc-feature-accordeon__item-text">${text}</p>
${liste.length ? `<ul class="nc-feature-accordeon__item-list">${liste.map((l) => `<li class="nc-feature-accordeon__item-list-entry">${l}</li>`).join('')}</ul>` : ''}
</div>
</details>`).join('\n')}
</div>
</div>
</div>
</div>`
}

// Rahmen ra-desktop: fuer die Seitenbreite gebaut (Plan v3, Phase 4)
export default (zelle, m) => desktop(vorlage(zelle, m))
