// Vorlage: divider — Markup aus data/markup/divider.html (<hr class="nc-divider">).
// Die Variante with-label ist im DS ein eigener Block (_divider.scss:
// <div class="nc-divider-label" role="separator"><span>oder</span></div>).
// data-recipe-wurzel markiert ihn als Wurzel dieses Recipes.
export default (zelle, m) => {
  if (m.wert('variant') === 'with-label') {
    return `<div class="nc-divider-label" data-recipe-wurzel="${m.root}" role="separator"${m.attrs}><span>oder</span></div>`
  }
  const senkrecht = m.wert('orientation') === 'vertical'
  return `<hr class="${m.klasse}"${senkrecht ? ' aria-orientation="vertical"' : ''}${m.attrs}>`
}
