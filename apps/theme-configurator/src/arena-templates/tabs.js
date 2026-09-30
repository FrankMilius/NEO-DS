// Vorlage: tabs — Markup aus data/markup/tabs.html (Trigger mit Symbol und
// Beschriftung, ohne die Tooltip-Huelle der Doku-Ernte). variant/orientation/
// size/overflow per Modifier; overflow=scrollable zeigt die Scroll-Knoepfe.
// Zustaende: active markiert den zweiten Tab, disabled deaktiviert den
// letzten, hover/focus zeigen den Ruhezustand.
import { PFEIL_LINKS, PFEIL_RECHTS, an } from './_helfer.js'

const ICON = {
  haus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21H3z"></path></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>',
  lupe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
  glocke: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>'
}

const TABS = [['Startseite', 'haus'], ['Profil', 'person'], ['Suche', 'lupe'], ['Benachrichtigungen', 'glocke']]

export default (zelle, m) => {
  const u = m.uid
  const aktiv = m.hat('active') ? 1 : 0
  const scroll = m.wert('overflow') === 'scrollable'
  const vertikal = m.wert('orientation') === 'vertical'
  return `
<div class="${m.basisKlasse}"${m.attrsOhne('aria-disabled', 'aria-selected')}>
<div class="nc-tabs__list" role="tablist" aria-label="Demo Tabs"${vertikal ? ' aria-orientation="vertical"' : ''}>
${scroll && an(m, 'scroll-btn') ? `<button type="button" class="nc-tabs__scroll-btn nc-tabs__scroll-btn--prev" aria-label="Nach links">${PFEIL_LINKS}</button>` : ''}
${TABS.map(([label, icon], i) => {
  const gesperrt = m.deaktiviert && i === TABS.length - 1
  return `<button class="nc-tabs__trigger${i === aktiv ? ' is-active' : ''}" role="tab" type="button" id="${u}-t${i}" aria-controls="${u}-p${i}" aria-selected="${i === aktiv}" tabindex="${i === aktiv ? 0 : -1}"${gesperrt ? ' aria-disabled="true" disabled' : ''}>
<span class="nc-tabs__trigger-icon">${ICON[icon]}</span><span class="nc-tabs__trigger-label">${label}</span></button>`
}).join('\n')}
${scroll && an(m, 'scroll-btn') ? `<button type="button" class="nc-tabs__scroll-btn nc-tabs__scroll-btn--next" aria-label="Nach rechts">${PFEIL_RECHTS}</button>` : ''}
</div>
${TABS.map(([label], i) => `<div class="nc-tabs__panel${i === aktiv ? ' is-active' : ''}" role="tabpanel" id="${u}-p${i}" aria-labelledby="${u}-t${i}"${i === aktiv ? '' : ' hidden'}><p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">${label}-Panel.</p></div>`).join('\n')}
</div>`
}
