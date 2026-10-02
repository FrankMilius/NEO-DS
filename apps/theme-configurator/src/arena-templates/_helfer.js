// Helfer fuer die Arena-Vorlagen (keine Vorlage — `_` am Anfang).
export { esc } from '../lib/recipe-arena.js'

/**
 * Neutrales Platzhalterbild als data-URI. Die geernteten Vorlagen verweisen
 * auf Bilder der Website (picsum, /themes/custom/…, ddev) — im Konfigurator
 * sind die nicht erreichbar. Das Bild selbst ist nicht Gegenstand der Arena.
 */
export const BILD_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E'

export const SYMBOL = {
  kreis: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  fehler: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  schliessen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  pfeil: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
}

/**
 * Slot sichtbar, solange das Recipe ihn nicht ausdruecklich abschaltet.
 * Fuer Inhalte, die im geernteten Markup immer vorkommen, aber in der
 * Anatomie als optional gefuehrt sind (m.slot() waere dort zu streng).
 */
export const an = (m, slot) => m.slotConfig?.[slot] !== false

/** Endzustand einer Scroll-/Einblend-Animation: das DS-JS setzt is-revealed. */
export const eingeblendet = (m) => m.wert('animation') && m.wert('animation') !== 'none'

/** Haken im gruenen Kreis (feature-list, tbl-icon) — wie im geernteten Markup. */
export const HAKEN_KREIS = '<svg viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

export const PFEIL_LINKS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'
export const PFEIL_RECHTS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>'

/**
 * Position des Achsenwerts dieser Zelle innerhalb des Specimens — fuer
 * Specimen-Listen wie render.counterValues oder render.labels, die je Zelle
 * einen Wert vorgeben.
 */
export function zellenIndex (m, achse) {
  const eintrag = m.specimen.matrix?.axes?.[achse]
  const werte = eintrag === '*' ? Object.keys(m.recipe.axes?.[achse]?.values || {}) : (eintrag || [])
  return Math.max(0, werte.indexOf(m.wert(achse)))
}

/**
 * Klassen des Modells ohne die genannten. Das Modell haengt fuer Zustaende
 * pauschal is-disabled/is-active/is-selected und <root>--disabled an; viele
 * Formular-Bauteile kennen dafuer nur das native Attribut (disabled,
 * aria-checked …). Was das DS nicht kennt, bleibt weg.
 */
export function klassenOhne (m, ...weg) {
  return m.klassen.filter((k) => !weg.includes(k)).join(' ')
}

/** Zustandsklassen, die die Formular-Bauteile nicht als Klasse kennen. */
export const FREMDE_ZUSTANDSKLASSEN = ['is-disabled', 'is-active', 'is-selected']

/** Attribute des Modells, die die Vorlage nativ setzt (disabled, readonly, checked). */
export const NATIVE_ARIA = ['aria-disabled', 'aria-readonly', 'aria-selected', 'aria-invalid']
