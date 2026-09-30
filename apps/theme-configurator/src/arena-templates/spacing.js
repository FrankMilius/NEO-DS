// Vorlage: spacing — Foundation, kein Bauteil: fnd-spacing ist die
// Recipe-Wurzel ohne eigene CSS-Regel. Die Zelle macht die semantische Rolle
// sichtbar: zwei Flaechen im Abstand var(--fnd-spacing-<rolle>) — vertikal
// fuer section/component/element/stack, horizontal fuer inline/gutter, als
// Innenabstand fuer inset. Die Achsen-Modifier des Recipes sind blanke Woerter
// (section, inline …) und kollidierten als Klassen mit Fremdregeln; die Rolle
// steht deshalb in data-rolle.
const WAAGERECHT = new Set(['inline', 'gutter'])
const BOX = 'background: color-mix(in srgb, var(--fnd-color-interactive-default) 14%, transparent); border: 1px dashed color-mix(in srgb, var(--fnd-color-interactive-default) 45%, transparent); border-radius: var(--fnd-radius-sm);'

export default (zelle, m) => {
  const rolle = m.wert('role') || 'element'
  const token = `var(--fnd-spacing-${rolle})`
  const label = `<code style="font-size: 11px; color: var(--fnd-color-text-secondary);">--fnd-spacing-${rolle}</code>`
  if (rolle === 'inset') {
    return `<div class="${m.root}" data-rolle="inset"${m.attrs} style="display: inline-flex; flex-direction: column; gap: 6px;">
<div style="${BOX} padding: ${token};"><div style="background: var(--fnd-color-background-secondary); padding: 4px 8px; font-size: 12px;">Inhalt</div></div>
${label}
</div>`
  }
  const richtung = WAAGERECHT.has(rolle) ? 'row' : 'column'
  const groesse = WAAGERECHT.has(rolle) ? 'width: 48px; height: 32px;' : 'width: 120px; height: 20px;'
  return `<div class="${m.root}" data-rolle="${rolle}"${m.attrs} style="display: inline-flex; flex-direction: column; gap: 6px;">
<div style="display: flex; flex-direction: ${richtung}; gap: ${token};"><div style="${BOX} ${groesse}"></div><div style="${BOX} ${groesse}"></div></div>
${label}
</div>`
}
