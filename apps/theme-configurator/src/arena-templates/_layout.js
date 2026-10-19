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

// ---------------------------------------------------------------------------
// Inhalt wie auf der Website (Grundsatz „Bühne = Ausschnitt der echten
// Website“, Frank 19.10.2026). Vorher standen in Container, Grid und Section
// graue Platzhalter mit Maßangaben; jetzt echter Inhalt, an dem Breite,
// Spalten und Polsterung sichtbar werden. Die Maßangabe trägt das Element
// als data-hilfe — sie erscheint nur mit dem Schalter „Hilfslinien“.
// ---------------------------------------------------------------------------

const PFEIL = '<span class="nc-card__footer-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>'
const KARTEN = [
  ['Lösung', 'Interne Kommunikation', 'Alle erreichen, auch ohne Büroarbeitsplatz.'],
  ['Produkt', 'NEO Magazine', 'Nachrichten, die gelesen werden.'],
  ['Produkt', 'NEO Chat', 'Abstimmen ohne E-Mail-Flut.'],
  ['Lösung', 'Wissensmanagement', 'Antworten finden statt suchen.'],
  ['Branche', 'Öffentliche Verwaltung', 'Souverän und DSGVO-konform.'],
  ['Branche', 'Gesundheit und Pflege', 'Schichtteams verbinden.'],
]

/** Navigationskarte wie auf der Website (data/markup/card.html). */
export function karte (i = 0, { lang = false } = {}) {
  const [kicker, titel, text] = KARTEN[i % KARTEN.length]
  const mehr = lang ? ' Mit Rollen, Kanälen und Lesebestätigung — für Verwaltung, Werk und Pflege.' : ''
  return `<a href="#" class="nc-card nc-card--navigational" onclick="return false">
<div class="nc-card__content"><span class="nc-card__kicker">${kicker}</span><h3 class="nc-card__title">${titel}</h3><p class="nc-card__description">${text}${mehr}</p></div>
<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr erfahren</span>${PFEIL}</div>
</a>`
}

/** Abschnitt mit Überschrift, Text, Knopf und Karten (Website-Inhalt). */
export function abschnitt ({ karten = 3, knopf = true } = {}) {
  const reihe = karten ? `<div class="ra-karten">${Array.from({ length: karten }, (_, i) => karte(i)).join('\n')}</div>` : ''
  return `<div class="ra-abschnitt">
<h2>Der digitale Arbeitsplatz für alle</h2>
<p>Kommunikation, Wissen und Zusammenarbeit in einer offenen Plattform — sicher, flexibel und gehostet in der EU.</p>
${knopf ? '<p><a href="#" class="nc-button nc-button--primary" onclick="return false"><span class="nc-button__label">Demo anfragen</span></a></p>' : ''}
${reihe}
</div>`
}
