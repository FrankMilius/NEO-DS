// Vorlage: kbd — Markup aus data/markup/kbd.html (<kbd class="nc-kbd">).
// variant=combination schaltet den Trenner per slotConfig.
export default (zelle, m) => {
  if (m.slot('separator')) {
    return `<span><kbd class="${m.klasse}"${m.attrs}>Strg</kbd><span class="nc-kbd__separator">+</span><kbd class="${m.klasse}">K</kbd></span>`
  }
  return `<kbd class="${m.klasse}"${m.attrs}>A</kbd>`
}
