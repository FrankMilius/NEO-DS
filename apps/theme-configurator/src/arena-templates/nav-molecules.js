// Vorlage: nav-molecules — Markup aus data/markup/nav-molecules.html.
// Achse element: link, toggle (Dropdown-Ausloeser), mobile (Hamburger),
// lang (Sprachumschalter). Zustand active → is-active + aria-current.
const PFEIL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>'
const MENUE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'

export default (zelle, m) => {
  const aktuell = m.hat('active') ? ' aria-current="page"' : ''
  switch (m.wert('element')) {
    case 'toggle':
      return `<button class="nc-nav__toggle ${m.klasse}" type="button" aria-expanded="false" aria-haspopup="true"${m.attrs}>
<span class="nc-nav__label">Produkte</span>${PFEIL}
</button>`
    case 'mobile':
      return `<div class="nc-nav__item"><a class="${m.klasse}" href="#" onclick="return false"${m.attrs}>Menü</a>
<button class="nc-mobile-toggle" type="button" aria-expanded="false" aria-label="Menü öffnen">${MENUE}</button></div>`
    case 'lang':
      return `<div class="nc-nav__item"><a class="${m.klasse}" href="#" onclick="return false"${m.attrs}>Sprache</a>
<button class="nc-lang-toggle" type="button" aria-label="Sprache wählen">DE ${PFEIL}</button></div>`
    default:
      return `<a class="${m.klasse}" href="#" onclick="return false"${aktuell}${m.attrs}><span class="nc-nav__label">Produkte</span></a>`
  }
}
