// Vorlage: spinner — Markup aus data/markup/spinner.html
// (<div class="nc-spinner" role="status">). Kompositionen: spinner-in-button
// (im Knopf, color=inverse im Primaerknopf, default im Sekundaerknopf) und
// spinner-overlay (nc-spinner-overlay ueber einer Flaeche).
export default (zelle, m) => {
  const spinner = `<div class="${m.klasse}" role="status" aria-label="Wird geladen"${m.attrs}></div>`
  const art = m.specimen.render?.compositionType
  if (art === 'spinner-in-button') {
    const primaer = m.wert('color') === 'inverse'
    return `<button type="button" class="nc-button ${primaer ? 'nc-button--primary' : 'nc-button--secondary'}" aria-busy="true">${spinner}<span>Speichern</span></button>`
  }
  if (art === 'spinner-overlay') {
    return `<div style="position: relative; width: 280px; height: 140px; border: 1px solid var(--fnd-color-border-secondary); border-radius: var(--fnd-radius-md); padding: var(--fnd-spacing-04);">
<p style="margin: 0;">Inhalt der Karte, der gerade neu geladen wird.</p>
<div class="nc-spinner-overlay">${spinner}</div>
</div>`
  }
  return spinner
}
