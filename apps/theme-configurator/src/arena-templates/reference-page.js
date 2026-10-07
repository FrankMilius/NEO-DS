// Vorlage: reference-page (07-organisms/_reference-page.scss) — Plan v3,
// Phase 5. Markup nach neo_fe/templates/content/node--reference-page.html
// .twig (Verzeichnis aus den Sections, serverseitig) und
// block--block-content--neo-doc-section.html.twig (Abschnitte). Der erste
// Eintrag traegt aria-current="true" — so setzt ihn der Scroll-Spy in
// neo-theme.js beim Laden. Der Umbruch (1024 px) ist eine Media Query der
// Fensterbreite: die Arena zeigt die Desktop-Lage. Rahmen ra-desktop.

const CHEVRON = '<svg class="nc-refpage__toc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>'

const ABSCHNITTE = [
  {
    id: 'betrieb', titel: 'Betrieb', kicker: 'Kapitel 1', lead: 'Wie die Plattform betrieben wird und wer wofür zuständig ist.',
    unter: [
      { id: 'betrieb-cloud', titel: 'Cloud', text: 'Betrieb in deutschen Rechenzentren, dokumentiert und prüfbar.' },
      { id: 'betrieb-vor-ort', titel: 'Vor Ort', text: 'Installation im eigenen Rechenzentrum mit denselben Paketen.', punkte: ['Updates im eigenen Takt', 'Anbindung an das vorhandene Verzeichnis'] }
    ]
  },
  {
    id: 'sicherheit', titel: 'Sicherheit', kicker: 'Kapitel 2', lead: 'Zugang, Rechte und Protokollierung.',
    unter: [
      { id: 'sicherheit-zugang', titel: 'Zugang', text: 'Anmeldung über Personalnummer, Einladungscode oder Single Sign-on.' }
    ]
  }
]

function verzeichnis (m, abschnitte, unterpunkte) {
  return abschnitte.map((a, i) => `<li><a class="nc-refpage__toc-link" href="#${m.uid}-${a.id}" data-text="${a.titel}"${i === 0 ? ' aria-current="true"' : ''}><span>${a.titel}</span></a>
${unterpunkte ? `<ul class="nc-refpage__toc-list nc-refpage__toc-list--sub">
${a.unter.map((u) => `<li><a class="nc-refpage__toc-link" href="#${m.uid}-${u.id}" data-text="${u.titel}"><span>${u.titel}</span></a></li>`).join('\n')}
</ul>` : ''}
</li>`).join('\n')
}

const abschnitt = (m, a) => `<div class="nc-refpage__section" id="${m.uid}-${a.id}">
<section class="nc-section nc-doc-section">
<div class="nc-container">
<div class="nc-section-header">
<span class="nc-section-header__label">${a.kicker}</span>
<h2 class="nc-section-header__title">${a.titel}</h2>
<p class="nc-section-header__subtitle">${a.lead}</p>
</div>
<div class="nc-doc-section__items">
${a.unter.map((u) => `<section class="nc-doc-section__item nc-refpage__section" id="${m.uid}-${u.id}">
<h3 class="nc-doc-section__title">${u.titel}</h3>
<p class="nc-doc-section__text">${u.text}</p>
${u.punkte ? `<ul class="nc-doc-section__list">${u.punkte.map((p) => `<li>${p}</li>`).join('')}</ul>` : ''}
</section>`).join('\n')}
</div>
</div>
</section>
</div>`

export default (zelle, m) => {
  const unterpunkte = m.specimen.render?.unterpunkte !== false
  return `<div class="ra-desktop">
<div class="${m.klasse} nc-container"${m.attrs}>
<nav class="nc-refpage__toc" aria-label="Inhaltsverzeichnis">
<details class="nc-refpage__toc-disclosure" open>
<summary class="nc-refpage__toc-summary">Inhalt ${CHEVRON}</summary>
<p class="nc-refpage__toc-title">Auf dieser Seite</p>
<ul class="nc-refpage__toc-list">
${verzeichnis(m, ABSCHNITTE, unterpunkte)}
</ul>
</details>
</nav>
<div class="nc-refpage__content" data-refpage-content>
${ABSCHNITTE.map((a) => abschnitt(m, a)).join('\n')}
</div>
</div>
</div>`
}
