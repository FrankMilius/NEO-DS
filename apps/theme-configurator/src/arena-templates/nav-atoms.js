// Vorlage: nav-atoms — Markup aus data/markup/nav-atoms.html (nc-nav__icon).
// Achse element zeigt Icon allein, Icon + Label oder Icon + Badge-Punkt.
const HAUS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>'

export default (zelle, m) => {
  const icon = `<span class="${m.klasse}"${m.attrs}>${HAUS}</span>`
  switch (m.wert('element')) {
    case 'label':
      return `<span class="nc-nav__link">${icon}<span class="nc-nav__label">Startseite</span></span>`
    case 'badge':
      return `<span class="nc-nav__link">${icon}<span class="nc-nav__badge" aria-label="3 neue Einträge">3</span></span>`
    default:
      return icon
  }
}
