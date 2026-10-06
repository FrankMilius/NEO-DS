// Vorlage: feature-accordion — Markup aus data/markup/feature-accordion.html.
// Statisch: erster Link aktiv, erster Eintrag offen (<details open>); der
// Zustand open oeffnet zusaetzlich den zweiten Eintrag. Optionaler Titel per
// render.slotConfig (Plan v3, Phase 4). Das Modell setzt fuer open pauschal
// is-open und data-state — das DS kennt beides hier nicht, der Zustand steht
// am <details>.
//
// „Ausprobieren" (Entscheidung 06.10.2026, website-verhalten c): ein Kapitel
// je Link (Texte der weiteren Kapitel aus geerntetem Markup, gallery.html);
// das Behavior feature-accordion aus neo-behaviors wechselt das Kapitel per
// Klick auf die Links links (scrollt die rechte Spalte, markiert
// .is-active + aria-current) und markiert beim Scrollen der Spalte mit.
// Auf- und Zuklappen der Eintraege macht der Browser (<details>).
import { klassenOhne } from './_helfer.js'
import { slotAn as an, desktop } from './_bloecke-1.js'

const EINTRAEGE = [
  ['Echtzeit-Dashboard', 'Verfolgen Sie alle wichtigen KPIs in Echtzeit auf einem übersichtlichen Dashboard.', ['Live-Daten-Aktualisierung', 'Anpassbare Widgets', 'Export als PDF oder CSV']],
  ['Benutzerdefinierte Berichte', 'Erstellen Sie individuelle Berichte und Analysen nach Ihren eigenen Kriterien.', []],
  ['Prognosen &amp; Trends', 'KI-gestützte Vorhersagen helfen Ihnen, zukünftige Entwicklungen zu antizipieren.', []]
]

// Weitere Kapitel nur in „Ausprobieren" (Texte aus data/markup/gallery.html)
const WEITERE = [
  ['Integrationen', [['200+ Integrationen', 'Nahtlose Verbindung zu Slack, Microsoft 365, Google Workspace und mehr.', []]]],
  ['Automatisierung', [['KI-Assistent', 'Intelligente Vorschläge, automatische Zusammenfassungen und smarte Workflows.', []]]]
]

const eintrag = ([titel, text, liste], offen) => `<details class="nc-feature-accordeon__item"${offen ? ' open' : ''}>
<summary class="nc-feature-accordeon__item-summary">${titel}</summary>
<div class="nc-feature-accordeon__item-body">
<p class="nc-feature-accordeon__item-text">${text}</p>
${liste.length ? `<ul class="nc-feature-accordeon__item-list">${liste.map((l) => `<li class="nc-feature-accordeon__item-list-entry">${l}</li>`).join('')}</ul>` : ''}
</div>
</details>`

const vorlage = (zelle, m) => {
  const offen = (i) => i === 0 || (i === 1 && m.hat('open'))
  const weitere = m.ausprobieren
    ? WEITERE.map(([titel, eintraege]) => `
<div class="nc-feature-accordeon__chapter">
<h3 class="nc-feature-accordeon__chapter-title">${titel}</h3>
<div class="nc-feature-accordeon__chapter-items">
${eintraege.map((e) => eintrag(e, false)).join('\n')}
</div>
</div>`).join('')
    : ''
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
${EINTRAEGE.map((e, i) => eintrag(e, offen(i))).join('\n')}
</div>
</div>${weitere}
</div>
</div>`
}

// Rahmen ra-desktop: fuer die Seitenbreite gebaut (Plan v3, Phase 4)
export default (zelle, m) => desktop(vorlage(zelle, m))
