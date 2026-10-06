// Vorlage: spacing — Foundation, kein Bauteil: fnd-spacing ist die
// Recipe-Wurzel ohne eigene CSS-Regel (Skala und Rollen sind Tokens,
// data/foundation-spacing.json, Konfigurator-Foundation „Spacing"). Die
// Zelle macht die semantische Rolle sichtbar: zwei Flaechen im Abstand
// var(--fnd-spacing-<rolle>) — vertikal fuer section/component/element/stack,
// waagerecht fuer inline/gutter, als Innenabstand fuer inset.
// Plan v3, Phase 4: Gestaltung aus dem Arena-Rahmen ra-abstand (RecipeArena,
// Token je data-rolle, um die Wurzel fnd-spacing) statt Inline-Stilen. Die Rolle steht in data-rolle —
// das Recipe hat keine Modifier-Klassen (die frueheren Werte section,
// inline … kollidierten mit Fremdregeln wie .section).
const WAAGERECHT = new Set(['inline', 'gutter'])

export default (zelle, m) => {
  const rolle = m.wert('role') || 'element'
  const token = `<code class="ra-abstand__token">--fnd-spacing-${rolle}</code>`
  if (rolle === 'inset') {
    return `<div class="ra-abstand" data-rolle="inset"><div class="${m.root}"${m.attrs}>
<div class="ra-abstand__flaeche ra-abstand__flaeche--innen"><div class="ra-abstand__inhalt">Inhalt</div></div>
</div>
${token}
</div>`
  }
  const paar = WAAGERECHT.has(rolle) ? 'ra-abstand__paar ra-abstand__paar--waagerecht' : 'ra-abstand__paar'
  return `<div class="ra-abstand" data-rolle="${rolle}"><div class="${m.root}"${m.attrs}>
<div class="${paar}"><div class="ra-abstand__flaeche"></div><div class="ra-abstand__flaeche"></div></div>
</div>
${token}
</div>`
}
