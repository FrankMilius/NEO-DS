// @ts-check
// ==========================================================================
// Select — nach data/select-recipe.json (State-Regel „open")
// ==========================================================================
// Natives <select> (Entscheidung 01.10.2026): Oeffnen, Liste und Auswahl
// macht der Browser. Das Behavior setzt nur .is-open am .nc-select-wrapper,
// solange die Liste offen ist — der Chevron dreht sich. Der Browser meldet
// das Schliessen nicht; als Ende gelten Auswahl (change), Verlassen (blur)
// und Escape.
// ==========================================================================

export const select = {
  id: 'select',
  selektor: '.nc-select-wrapper',
  binde (wurzel, signal) {
    const feld = /** @type {HTMLSelectElement|null} */ (wurzel.querySelector('select.nc-select'))
    if (!feld || feld.multiple) return
    const setze = (offen) => wurzel.classList.toggle('is-open', offen)
    feld.addEventListener('mousedown', () => { if (!feld.disabled) setze(!wurzel.classList.contains('is-open')) }, { signal })
    feld.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Tab') setze(false)
      else if ((e.key === 'ArrowDown' && e.altKey) || e.key === 'F4' || ((e.key === ' ' || e.key === 'Enter') && !wurzel.classList.contains('is-open'))) setze(true)
    }, { signal })
    feld.addEventListener('change', () => setze(false), { signal })
    feld.addEventListener('blur', () => setze(false), { signal })
  }
}
