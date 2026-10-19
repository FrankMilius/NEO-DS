// @ts-check
/**
 * @file
 * Kurztext „Steuert …“ je Token-Gruppe (Roadmap V02, 19.10.2026).
 *
 * Die Recipes kennen 359 verschiedene Gruppen, aber nur deren Bezeichnung
 * („Geometry“, „Colors (Outlined)“). Statt Texte von Hand zu pflegen,
 * leitet der Inspector sie aus den Token-Namen ab: nc-button-padding-x-md,
 * nc-button-radius-sm → „Innenabstand und Eckenradius“. Zustände (hover,
 * disabled …) kommen als Zusatz dazu.
 */

/**
 * Eigenschaft im Token-Namen → deutscher Begriff. Reihenfolge = Vorrang (lange zuerst).
 * @type {Array<[RegExp, string]>}
 */
const EIGENSCHAFTEN = [
  [/(^|-)touch-target(-|$)|(^|-)hit-area(-|$)/, 'Mindestgröße der Klickfläche'],
  [/(^|-)syntax(-|$)/, 'Syntaxfarben'],
  [/(^|-)scale(-|$)/, 'Vergrößerung'],
  [/(^|-)border-width(-|$)/, 'Rahmenbreite'],
  [/(^|-)border-color(-|$)|(^|-)border(-|$)/, 'Rahmen'],
  [/(^|-)outline(-|$)|(^|-)ring(-|$)/, 'Kontur'],
  [/(^|-)font-size(-|$)|(^|-)fs(-|$)/, 'Schriftgröße'],
  [/(^|-)font-weight(-|$)|(^|-)weight(-|$)/, 'Schriftstärke'],
  [/(^|-)font-family(-|$)|(^|-)font(-|$)/, 'Schriftart'],
  [/(^|-)line-height(-|$)|(^|-)leading(-|$)/, 'Zeilenhöhe'],
  [/(^|-)letter-spacing(-|$)|(^|-)tracking(-|$)/, 'Laufweite'],
  [/(^|-)text-transform(-|$)/, 'Schreibweise'],
  [/(^|-)(bg|background|surface|fill)(-|$)/, 'Hintergrund'],
  [/(^|-)(text|color|fg|foreground)(-|$)/, 'Textfarbe'],
  [/(^|-)icon-size(-|$)/, 'Symbolgröße'],
  [/(^|-)icon(-|$)/, 'Symbol'],
  [/(^|-)(shadow|elevation)(-|$)/, 'Schatten'],
  [/(^|-)radius(-|$)/, 'Eckenradius'],
  [/(^|-)padding(-|$)|(^|-)inset(-|$)/, 'Innenabstand'],
  [/(^|-)(gap|spacing|margin|offset|indent)(-|$)/, 'Abstand'],
  [/(^|-)(min-)?height(-|$)/, 'Höhe'],
  [/(^|-)(min-|max-)?width(-|$)/, 'Breite'],
  [/(^|-)size(-|$)/, 'Größe'],
  [/(^|-)(duration|delay)(-|$)/, 'Dauer'],
  [/(^|-)(easing|ease|timing)(-|$)/, 'Bewegungskurve'],
  [/(^|-)(opacity|alpha)(-|$)/, 'Deckkraft'],
  [/(^|-)(z|z-index|layer)(-|$)/, 'Stapelebene'],
  [/(^|-)(blur|backdrop)(-|$)/, 'Unschärfe'],
  [/(^|-)(overlay|scrim)(-|$)/, 'Abdunklung'],
  [/(^|-)(columns|cols)(-|$)/, 'Spalten'],
  [/(^|-)(aspect|ratio)(-|$)/, 'Seitenverhältnis'],
]

/** @type {Array<[RegExp, string]>} */
const ZUSTAENDE = [
  [/(^|-)hover(-|$)/, 'beim Überfahren'],
  [/(^|-)(active|pressed|selected|current|checked|open)(-|$)/, 'aktiv'],
  [/(^|-)focus(-|$)/, 'mit Fokus'],
  [/(^|-)disabled(-|$)/, 'deaktiviert'],
  [/(^|-)(error|invalid|danger)(-|$)/, 'bei Fehler'],
]

/** „a, b und c“ */
export function aufzaehlung (teile) {
  const t = [...teile]
  if (t.length <= 1) return t.join('')
  return `${t.slice(0, -1).join(', ')} und ${t.at(-1)}`
}

/**
 * @param {Array<string | { id?: string, name?: string, token?: string }>} tokenIds  z. B. ['nc-button-padding-x-md', …] (mit oder ohne --)
 * @param {string} [komponente]  Recipe-ID, deren Präfix entfernt wird
 * @returns {{ eigenschaften: string[], zustaende: string[], text: string }}
 */
export function gruppenWirkung (tokenIds, komponente = '') {
  const eigenschaften = new Set()
  const zustaende = new Set()
  const praefix = komponente ? `nc-${komponente}-` : 'nc-'
  for (const roh of tokenIds || []) {
    const name = typeof roh === 'object' && roh ? (roh.id || roh.name || roh.token || '') : roh
    let id = String(name || '').replace(/^--/, '')
    if (id.startsWith(praefix)) id = id.slice(praefix.length)
    else if (id.startsWith('nc-')) id = id.slice(3)
    for (const [re, wort] of EIGENSCHAFTEN) if (re.test(id)) { eigenschaften.add(wort); break }
    for (const [re, wort] of ZUSTAENDE) if (re.test(id)) zustaende.add(wort)
  }
  const e = [...eigenschaften]
  const z = [...zustaende]
  let text = e.length ? `Steuert ${aufzaehlung(e)}` : ''
  if (text && z.length) text += `, auch ${aufzaehlung(z)}`
  return { eigenschaften: e, zustaende: z, text: text ? `${text}.` : '' }
}
