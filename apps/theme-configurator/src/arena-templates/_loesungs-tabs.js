// Gemeinsames Markup fuer solution-tabs und tab-nav (Helfer, keine Vorlage).
// Abgeglichen mit dem Drupal-Theme (neo_fe): Beide Bloecke legen im Twig nur
// die Wurzel an (block--block-content--neo-solution-tabs / neo-tab-nav
// .html.twig), Tabliste und Panels baut js/neo-theme.js:
//   solution-tabs  Drupal.behaviors.neoSolutionTabs — Panel = <div> mit
//                  Titel, Text, nc-solution-tabs__features, CTA, daneben
//                  das Schaubild nc-solution-tabs__visual.
//   tab-nav        Wurzel „nc-solution-tabs nc-tab-nav"; Panel mit
//                  nc-tab-nav__panel-body und Inhaltsmodul (Standard:
//                  Feature-Liste nc-solution-tabs__features nc-tab-nav__features).
// Vertikal bekommt jeder Tab die Nummer (nc-solution-tabs__tab-index), den
// Fortschrittsbalken haengt Drupal immer an (sichtbar nur bei Autoplay).
// Gekuerzt auf drei Tabs; gerendert wird nur das aktive Panel.

const TABS = [
  { tab: 'neo workplace', chip: 'Social Intranet', accent: '#19C8C8', titel: 'Social Intranet und Mitarbeitendenportal', text: 'Das soziale Herzstück für Ihre digitale Arbeitswelt. Informationen fließen, Teams arbeiten zusammen, und Ihr Wissen ist auf Knopfdruck verfügbar.', features: ['Personalisierter News-Feed und Newskanäle', 'Wissens- und Inhaltsseiten', 'Vernetzung und Zusammenarbeit'] },
  { tab: 'neo app', chip: 'Mitarbeiter-App', accent: '#AEF359', titel: 'Die Mitarbeiter-App', text: 'Alle erreichen — auch ohne Schreibtisch. Informationen, Services und Austausch in einer App.', features: ['Push-Benachrichtigungen', 'Login ohne Firmen-E-Mail', 'Offline lesen'] },
  { tab: 'neo AI', chip: 'Intranet-KI', accent: '#8B5CF6', titel: 'Die Intranet-KI', text: 'Statt Suchen gibt es Antworten: sicher, offen, schnell — perfekt für den unternehmensinternen Einsatz.', features: ['Antworten mit Quellen', 'Datenschutzkonform', 'Eigene Wissensbasis'] }
]

function schaubild (t) {
  const name = t.tab.replace('neo ', '')
  return `<div class="nc-solution-tabs__visual" aria-hidden="true" style="--nc-solution-tabs-accent:${t.accent}">` +
    '<div class="nc-solution-tabs__visual-bar"><i></i><i></i><i></i></div>' +
    '<div class="nc-solution-tabs__visual-body">' +
    `<span class="nc-solution-tabs__visual-chip">${t.chip}</span>` +
    `<div class="nc-solution-tabs__visual-name">neo <b>${name}</b></div>` +
    '<div class="nc-solution-tabs__skel nc-solution-tabs__skel--w80"></div>' +
    '<div class="nc-solution-tabs__skel nc-solution-tabs__skel--w60"></div>' +
    '<div class="nc-solution-tabs__skel nc-solution-tabs__skel--w45"></div>' +
    '</div></div>'
}

// Inhaltsmodule des tab-nav-Panels wie auf der Website (data/markup/
// tab-nav.html): Feature-Liste (nc-feature-list__items), Features
// (nc-solution-tabs__features nc-tab-nav__features), Bento-Raster
// (nc-bento-grid nc-tab-nav__bento) und Expanding Panels
// (nc-expanding-panels nc-tab-nav__xpanels). Plan v3, Phase 4.
const HAKEN = '<svg viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const BENTO = [
  ['lg', 'KI-gestützte Antworten zu allen Fragen', 'Statt „Suchen" wird jetzt „gefragt". Die Antwort entsteht aus Inhalten des Intranets.'],
  ['wide', 'Nutzung von Wissen aus definierten Quellen', ''],
  ['', 'Sichere, lokal gehostete LLM-Sprachmodelle', ''],
  ['wide', 'Kundenspezifische LLM anbindbar', '']
]
const PANELE = ['iOS &amp; Android', 'White-Label: angepasst an das Kundendesign', 'Push-Benachrichtigungen']

function modulHtml (modul, t) {
  switch (modul) {
    case 'features':
      return `<ul class="nc-solution-tabs__features nc-tab-nav__features">${t.features.map((f) => `<li class="nc-solution-tabs__feature">${f}</li>`).join('')}</ul>`
    case 'bento':
      return `<div class="nc-bento-grid nc-tab-nav__bento">${BENTO.map(([g, titel, text]) => `<article class="nc-bento-grid__cell${g ? ` nc-bento-grid__cell--${g}` : ''}"><h3 class="nc-bento-grid__title">${titel}</h3>${text ? `<p class="nc-bento-grid__text">${text}</p>` : ''}</article>`).join('')}</div>`
    case 'panels':
      return `<div class="nc-expanding-panels nc-tab-nav__xpanels" role="group">${PANELE.map((titel, i) => `<button type="button" class="nc-expanding-panels__panel" aria-expanded="${i === 0}"><span class="nc-expanding-panels__bg" aria-hidden="true"></span><span class="nc-expanding-panels__num">0${i + 1}</span><span class="nc-expanding-panels__body"><h3 class="nc-expanding-panels__title">${titel}</h3></span></button>`).join('')}</div>`
    default:
      return `<ul class="nc-feature-list__items">${t.features.map((f) => `<li class="nc-feature-list__item"><span class="nc-feature-list__icon">${HAKEN}</span><span class="nc-feature-list__item-text">${f}</span></li>`).join('')}</ul>`
  }
}

/**
 * @param {object} m          Arena-Modell
 * @param {string} wurzel     Klassen der Wurzel
 * @param {object} o          { modus: 'solution-tabs'|'tab-nav', aktiv, vertikal,
 *                              autoplay, fortschritt, features, cta, schaubild,
 *                              modul (nur tab-nav: feature-liste|features|bento|panels) }
 */
export function loesungsTabs (m, wurzel, o) {
  const u = m.uid
  const t = TABS[o.aktiv]
  const tabNav = o.modus === 'tab-nav'
  const features = o.features
    ? `<ul class="nc-solution-tabs__features${tabNav ? ' nc-tab-nav__features' : ''}">${t.features.map((f) => `<li class="nc-solution-tabs__feature">${f}</li>`).join('')}</ul>`
    : ''
  const cta = o.cta ? '<a class="nc-button nc-button--accent nc-button--lg" href="#" onclick="return false"><span>Mehr erfahren</span></a>' : ''
  const inhalt = tabNav
    ? `<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">${t.titel}</h3>
<p class="nc-solution-tabs__panel-text">${t.text}</p>
<div class="nc-tab-nav__module">${o.modul ? modulHtml(o.modul, t) : features}</div>
${cta}
</div>`
    : `<div>
<h3 class="nc-solution-tabs__panel-title">${t.titel}</h3>
<p class="nc-solution-tabs__panel-text">${t.text}</p>
${features}
${cta}
</div>${o.schaubild ? schaubild(t) : ''}`
  return `
<div class="${wurzel}" data-orientation="${o.vertikal ? 'vertical' : 'horizontal'}"${o.autoplay ? ` data-autoplay="${o.autoplay}"` : ''}${m.attrsOhne('aria-selected')}>
<div class="nc-solution-tabs__tablist" role="tablist"${o.vertikal ? ' aria-orientation="vertical"' : ''}>
${TABS.map((x, i) => `<button type="button" class="nc-solution-tabs__tab${i === o.aktiv ? ' is-active' : ''}" role="tab" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === o.aktiv}" tabindex="${i === o.aktiv ? 0 : -1}">${o.vertikal ? `<span class="nc-solution-tabs__tab-index">0${i + 1}</span>` : ''}${x.tab}${o.fortschritt ? `<span class="nc-solution-tabs__progress" aria-hidden="true"${i === o.aktiv && o.autoplay === 'on' && !tabNav ? ' style="--progress: 0.4;"' : ''}></span>` : ''}</button>`).join('\n')}
</div>
<div class="nc-solution-tabs__panel${tabNav ? ' nc-tab-nav__panel' : ''} is-active" role="tabpanel" id="${u}-p${o.aktiv}" aria-labelledby="${u}-t${o.aktiv}">
${inhalt}
</div>
</div>`
}
