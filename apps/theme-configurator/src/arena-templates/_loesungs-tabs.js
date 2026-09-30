// Gemeinsames Markup fuer solution-tabs und tab-nav (Helfer, keine Vorlage).
// Beide Recipes beschreiben denselben geernteten Block
// (data/markup/solution-tabs.html = data/markup/tab-nav.html): die Wurzel
// traegt nc-solution-tabs UND nc-tab-nav. Gekuerzt auf drei Tabs; das Panel
// zeigt ein Feature-Listen-Modul wie in der Ernte.
import { HAKEN_KREIS } from './_helfer.js'

const TABS = [
  ['neo workplace', 'Social Intranet und Mitarbeitendenportal', 'Das soziale Herzstück für Ihre digitale Arbeitswelt. Informationen fließen, Teams arbeiten zusammen, und Ihr Wissen ist auf Knopfdruck verfügbar.', ['Personalisierter News-Feed und Newskanäle', 'Wissens- und Inhaltsseiten', 'Vernetzung und Zusammenarbeit']],
  ['neo app', 'Die Mitarbeiter-App', 'Alle erreichen — auch ohne Schreibtisch. Informationen, Services und Austausch in einer App.', ['Push-Benachrichtigungen', 'Login ohne Firmen-E-Mail', 'Offline lesen']],
  ['neo AI', 'Die Intranet-KI', 'Statt Suchen gibt es Antworten: sicher, offen, schnell — perfekt für den unternehmensinternen Einsatz.', ['Antworten mit Quellen', 'Datenschutzkonform', 'Eigene Wissensbasis']]
]

/**
 * @param {object} m          Arena-Modell
 * @param {string} wurzel     Klassen der Wurzel
 * @param {object} o          { aktiv, fortschritt, features, cta }
 */
export function loesungsTabs (m, wurzel, o) {
  const u = m.uid
  const [, titel, text, punkte] = TABS[o.aktiv]
  return `
<div class="${wurzel}"${o.autoplay ? ` data-autoplay="${o.autoplay}"` : ''}${m.attrsOhne('aria-selected')}>
<div class="nc-solution-tabs__tablist" role="tablist">
${TABS.map(([name], i) => `<button class="nc-solution-tabs__tab${i === o.aktiv ? ' is-active' : ''}" type="button" role="tab" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === o.aktiv}" tabindex="${i === o.aktiv ? 0 : -1}">${name}${o.fortschritt ? `<span class="nc-solution-tabs__progress" aria-hidden="true"${i === o.aktiv ? ' style="--progress: 0.4;"' : ''}></span>` : ''}</button>`).join('\n')}
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel is-active" role="tabpanel" id="${u}-p${o.aktiv}" aria-labelledby="${u}-t${o.aktiv}">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">${titel}</h3>
<p class="nc-solution-tabs__panel-text">${text}</p>
${o.features ? `<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
${punkte.map((p) => `<li class="nc-feature-list__item"><span class="nc-feature-list__icon">${HAKEN_KREIS}</span><span class="nc-feature-list__item-text">${p}</span></li>`).join('\n')}
</ul>
</div>` : ''}
${o.cta ? '<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg nc-solution-tabs__cta"><span>Mehr erfahren</span></a>' : ''}
</div>
</div>
</div>`
}
