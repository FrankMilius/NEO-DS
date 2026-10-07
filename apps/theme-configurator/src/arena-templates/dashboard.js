// Vorlage: dashboard (08-templates/_dashboard.scss, .t-dashboard) — Plan v3,
// Phase 5. Markup aus der Doku (docs/content/template-dashboard.html,
// Abschnitte HTML-Struktur und Ueberschriften). Im SCSS als DEPRECATED
// markiert (Nachfolger: Shell-Preset data-layout="dashboard").
// Seitenlayout: Rahmen ra-fenster (Desktop-Fenster 1200 x 640, 1:2,2).

const KENNZAHLEN = [['Benutzer', '4.821'], ['Aktive heute', '1.209'], ['Beiträge', '317']]

import { slotAn } from './_bloecke-1.js'

export default (zelle, m) => `<div class="ra-fenster">
<div class="${m.klasse}"${m.attrs}>
<nav class="t-dashboard__sidebar" aria-label="Hauptnavigation">
<ul class="t-dashboard__sidebar-nav">
<li><a class="t-dashboard__sidebar-link" href="#" onclick="return false" aria-current="page">Übersicht</a></li>
<li><a class="t-dashboard__sidebar-link" href="#" onclick="return false">Berichte</a></li>
<li><a class="t-dashboard__sidebar-link" href="#" onclick="return false">Einstellungen</a></li>
</ul>
</nav>
<header class="t-dashboard__header">
<h1 class="t-dashboard__title">Übersicht</h1>
</header>
<main class="t-dashboard__main">
${slotAn(m, 'metrics') ? `<div class="t-dashboard__metrics">
${KENNZAHLEN.map(([l, w]) => `<div class="t-dashboard__metric-card">
<p class="t-dashboard__metric-label">${l}</p>
<p class="t-dashboard__metric-value">${w}</p>
</div>`).join('\n')}
</div>` : ''}
<section class="t-dashboard__card" aria-labelledby="${m.uid}-karte">
<div class="t-dashboard__card-header">
<h2 class="t-dashboard__card-title" id="${m.uid}-karte">Aktivität</h2>
</div>
<p>Diagramm oder Tabelle</p>
</section>
</main>
</div>
</div>`
