// Vorlage: searchbar — Struktur aus COMPONENTS-CSS.md des Drupal-Themes
// (neo_fe, Abschnitt 3.2) und _searchbar.scss: .nc-searchbar[data-state]
// > __inner.nc-container > __field mit __icon, __input, __shortcut, __close.
// Plan v3, Phase 4.
//
// Ohne data-state="open" ist die Leiste display:none — jede Zelle zeigt sie
// geoeffnet (dann blendet das DS den Shortcut aus, wie auf der Website; der
// Shortcut ist damit nie zu sehen — Entscheidungsfall).
// Zustaende: hover (Schliessen-Knopf) und focus (Feld) nur echt — data-zustand
// am Element, an dem die Pseudoklasse greift. render.compositionType
// „eingabe": Feld mit Suchbegriff. Rahmen ra-feld--breit (die Leiste ist
// 100 % breit, in der Kopfzeile unter dem Header).
// Ein Verhalten in neo-behaviors gibt es nicht (Oeffnen per Lupe/„/",
// Schliessen per Escape macht die Website) — kein „Ausprobieren".
const LUPE = '<svg class="nc-searchbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path></svg>'
const KREUZ = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>'

export default (zelle, m) => {
  const zustand = m.attribute['data-zustand']
  const am = (wo) => (zustand && wo === (zustand === 'hover' ? 'close' : 'input') ? ` data-zustand="${zustand}"` : '')
  const wert = m.specimen.render?.compositionType === 'eingabe' ? ' value="Mitarbeiter-App"' : ''
  return `<div class="ra-feld ra-feld--breit">
<div class="${m.klasse}" data-state="open" role="search">
<div class="nc-searchbar__inner nc-container">
<div class="nc-searchbar__field">
${LUPE}
<input class="nc-searchbar__input" type="search" placeholder="Suchen…" aria-label="Website durchsuchen"${wert}${am('input')}>
<kbd class="nc-searchbar__shortcut">/</kbd>
<button type="button" class="nc-searchbar__close" aria-label="Suche schließen"${am('close')}>${KREUZ}</button>
</div>
</div>
</div>
</div>`
}
