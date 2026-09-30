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

/**
 * @param {object} m          Arena-Modell
 * @param {string} wurzel     Klassen der Wurzel
 * @param {object} o          { modus: 'solution-tabs'|'tab-nav', aktiv, vertikal,
 *                              autoplay, fortschritt, features, cta, schaubild }
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
<div class="nc-tab-nav__module">${features}</div>
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
${TABS.map((x, i) => `<button type="button" class="nc-solution-tabs__tab${i === o.aktiv ? ' is-active' : ''}" role="tab" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === o.aktiv}" tabindex="${i === o.aktiv ? 0 : -1}">${o.vertikal ? `<span class="nc-solution-tabs__tab-index">0${i + 1}</span>` : ''}${x.tab}${o.fortschritt ? `<span class="nc-solution-tabs__progress" aria-hidden="true"${i === o.aktiv && o.autoplay === 'on' ? ' style="--progress: 0.4;"' : ''}></span>` : ''}</button>`).join('\n')}
</div>
<div class="nc-solution-tabs__panel${tabNav ? ' nc-tab-nav__panel' : ''} is-active" role="tabpanel" id="${u}-p${o.aktiv}" aria-labelledby="${u}-t${o.aktiv}">
${inhalt}
</div>
</div>`
}
