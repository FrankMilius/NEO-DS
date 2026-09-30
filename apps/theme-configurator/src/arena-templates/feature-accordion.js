// Vorlage: feature-accordion — Markup aus data/markup/feature-accordion.html.
// Statisch: erster Link aktiv, erster Eintrag offen (<details open>); der
// Zustand open oeffnet zusaetzlich den zweiten Eintrag.
import { an } from './_helfer.js'

const EINTRAEGE = [
  ['Echtzeit-Dashboard', 'Verfolgen Sie alle wichtigen KPIs in Echtzeit auf einem übersichtlichen Dashboard.', ['Live-Daten-Aktualisierung', 'Anpassbare Widgets', 'Export als PDF oder CSV']],
  ['Benutzerdefinierte Berichte', 'Erstellen Sie individuelle Berichte und Analysen nach Ihren eigenen Kriterien.', []],
  ['Prognosen &amp; Trends', 'KI-gestützte Vorhersagen helfen Ihnen, zukünftige Entwicklungen zu antizipieren.', []]
]

export default (zelle, m) => {
  const offen = (i) => i === 0 || (i === 1 && m.hat('open'))
  return `
<div class="${m.klasse}"${m.attrs}>
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
