// Vorlage: skeleton — Markup aus data/markup/skeleton.html. Form
// (text/heading/circle/rect) und Groesse per Modifier. Kompositionen aus
// _skeleton.scss: skeleton-text-group (nc-skeleton-group, letzte Zeile
// kuerzer per CSS), skeleton-card (Flaeche + Ueberschrift + Zeilen) und
// skeleton-avatar-text (Kreis neben zwei Zeilen). Das DS kennt dafuer nur
// nc-skeleton-group; die Anordnung von Karte und Avatar ist inline.
const zeile = (extra = '') => `<div class="nc-skeleton${extra}" aria-hidden="true"></div>`

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  if (art === 'skeleton-text-group') {
    return `<div class="nc-skeleton-group" aria-busy="true" aria-label="Inhalt wird geladen" style="width: 280px;">${zeile()}${zeile()}${zeile()}</div>`
  }
  if (art === 'skeleton-card') {
    return `<div aria-busy="true" aria-label="Karte wird geladen" style="display: flex; flex-direction: column; gap: var(--fnd-spacing-03); width: 280px;">
<div class="${m.klasse}" aria-hidden="true"${m.attrs}></div>
${zeile(' nc-skeleton--heading')}
<div class="nc-skeleton-group">${zeile()}${zeile()}</div>
</div>`
  }
  if (art === 'skeleton-avatar-text') {
    return `<div aria-busy="true" aria-label="Profil wird geladen" style="display: flex; align-items: center; gap: var(--fnd-spacing-03); width: 280px;">
<div class="${m.klasse}" aria-hidden="true"${m.attrs}></div>
<div class="nc-skeleton-group" style="flex: 1;">${zeile()}${zeile()}</div>
</div>`
  }
  return `<div class="${m.klasse}" aria-hidden="true"${m.attrs}></div>`
}
