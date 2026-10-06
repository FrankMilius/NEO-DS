// Helfer fuer die Layout-Vorlagen (container, grid, section, hero, shell,
// psychedelic-bg) — keine Vorlage (`_` am Anfang). Plan v3, Phase 3, Block
// Layout.
import { esc } from '../lib/recipe-arena.js'

/**
 * Modifier, die das Recipe beschreibt, die es in styles.css aber nicht gibt.
 * Bauen oder aus dem Recipe streichen ist eine Entscheidung — bis dahin
 * zeigt die Arena die Zelle als „nicht gebaut",
 * statt eine Klasse zu setzen, die nichts gestaltet. Der Test
 * (tests/arena/layout-block.test.js) prueft beide Richtungen: jede Klasse
 * hier fehlt in styles.css, und jeder fehlende Modifier der sechs Recipes
 * steht hier. Wird einer gebaut, faellt der Test auf und der Eintrag geht.
 *
 * Leer seit der Entscheidung vom 06.10.2026: container (vspace, align,
 * surface), grid (flow-col, dense, mobile-1/2/6) und section (divider-*)
 * sind gebaut; subgrid und edge-* sind aus den Recipes gestrichen.
 */
export const NICHT_GEBAUT = {}

/** Klassen des Modells, die nicht gebaut sind (leer = alles gebaut). */
export const fehlendeKlassen = (m) => m.klassen.filter((k) => k in NICHT_GEBAUT)

/**
 * Zelle fuer einen beschriebenen, aber nicht gebauten Modifier. Arena-Markup,
 * kein DS-Element: nennt die Klasse und das Recipe als Quelle.
 */
export function nichtGebaut (m, klassen) {
  const liste = klassen.map((k) => `<code>.${esc(k)}</code>`).join(', ')
  return `<div class="ra-fallback ra-nicht-gebaut" data-nicht-gebaut="${esc(klassen.join(' '))}">
<span>Nicht gebaut: ${liste} steht im Recipe, aber nicht in styles.css</span>
</div>`
}

/** Platzhalter-Inhalt (Arena, kein DS-Element) mit Beschriftung. */
export function platzhalter (text, zusatz = '') {
  return `<div class="ra-platzhalter${zusatz ? ' ' + zusatz : ''}">${esc(text)}</div>`
}

/** Beschreibung eines Achsenwerts aus dem Recipe (fuer Platzhalter). */
export function wertBeschreibung (m, achse) {
  const wert = m.wert(achse)
  return m.recipe.axes?.[achse]?.values?.[wert]?.description || ''
}
