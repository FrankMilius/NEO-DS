// Vorlage: text-blocks — Markup aus data/markup/text-blocks.html und
// _text-blocks.scss: section-title, eyebrow und lead sind eigene Klassen
// (nc-section-title / nc-eyebrow / nc-lead). data-recipe-wurzel markiert
// eyebrow/lead als Wurzel dieses Recipes.
export default (zelle, m) => {
  switch (m.wert('variant')) {
    case 'eyebrow':
      return `<p class="nc-eyebrow" data-recipe-wurzel="${m.root}"${m.attrs}>Digital Workplace</p>`
    case 'lead':
      return `<p class="nc-lead" data-recipe-wurzel="${m.root}"${m.attrs}>Die vollständige Lösung für Ihr digitales Business.</p>`
    default:
      return `<h2 class="${m.klasse}"${m.attrs}>Jetzt starten</h2>`
  }
}
