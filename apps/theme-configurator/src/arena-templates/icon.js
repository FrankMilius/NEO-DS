// Vorlage: icon — Aufbau aus scss/scss/05-atoms/_icon.scss (Huelle mit SVG,
// fill: currentColor). size/color/interactive per Modifier; interactive
// rendert einen Knopf (Touch-Target), das Specimen in-context setzt das
// Symbol in eine Textzeile. Den dunklen Grund fuer color=inverse setzt die
// Arena-Zelle (zellenFlaeche in src/lib/recipe-arena.js).
const STERN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>'

export default (zelle, m) => {
  const interaktiv = m.wert('interactive') === 'interactive'
  const huelle = interaktiv
    ? `<button type="button" class="${m.klasse}" aria-label="Favorit"${m.attrs}>${STERN}</button>`
    : `<span class="${m.klasse}"${m.attrs}>${STERN}</span>`
  if (m.specimen.id === 'in-context') {
    return `<p style="display: inline-flex; align-items: center; gap: var(--fnd-spacing-02); margin: 0;">${huelle}<span>Als Favorit markiert</span></p>`
  }
  return huelle
}
