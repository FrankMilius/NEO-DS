// @ts-check
/**
 * @file
 * Erzeugt die CSS-Zeilen fuer Foundation-Tokens beim Export.
 *
 * Gemeinsame Stelle fuer beide Exportwege (drupal-adapter.js und der
 * CSS-Export im Store). Vorher hatte jeder seine eigene Schleife, beide mit
 * denselben drei Fehlern:
 *
 * 1. FALSCHE NAMEN. Geschrieben wurde `--${key}` mit dem Oberflaechen-
 *    Schluessel: `--base: xs`, `--width-sm: 1.5px`, `--10: 64px`. Keiner
 *    dieser Namen existiert im Design System. Der Fehler steckt seit dem
 *    ersten Commit des Adapters darin; die vorhandenen theme-overrides.css
 *    stammen aus einem aelteren Generator.
 *
 * 2. UNAUFGELOeSTE VERWEISE. Bei Elevation ist der Wert ein SCHLUESSEL der
 *    Schattenskala ("xs"), kein Wert. Das Feld `maps_to` sagt das auch — nur
 *    hat es nie jemand gelesen. Ergebnis auf der Website:
 *    `--fnd-elevation-base: xs`, also gar kein Schatten.
 *
 * 3. ALLES STATT ABWEICHUNGEN. foundationOverrides wird mit den DS-Vorgaben
 *    vorbelegt. Exportiert wurden deshalb alle ~90 Tokens, auch die
 *    unveraenderten — und ueberschrieben damit auf der Website Werte, die im
 *    DS laengst besser waren (z.B. die fluide Abstandsskala, die als fester
 *    px-Wert herauskam). Das ist die Hauptquelle der Drift zwischen DS und
 *    Website.
 *
 * Die Namen und die Verweisaufloesung liefert jetzt der Token-Generator als
 * `cssVar` bzw. `resolved_value` mit (scripts/generate-tokens.cjs, „Bruecke").
 */

import { foundationTokens } from '../data/tokens.generated.js'

/** DS-Vorgabe je Kategorie/Schluessel — dieselbe Quelle wie getDefaultFoundation(). */
function vorgabe(kategorie, schluessel) {
  return foundationTokens?.[kategorie]?.tokens?.[schluessel]?.value
}

/** Was soll als Wert im CSS stehen? Verweise werden aufgeloest. */
function ausgabewert(kategorie, schluessel, wert) {
  const token = foundationTokens?.[kategorie]?.tokens?.[schluessel]
  // Nur wenn der Nutzer den Verweis NICHT veraendert hat, gilt die
  // vorberechnete Aufloesung. Sonst selbst aufloesen.
  if (token?.maps_to) {
    if (wert === token.value && token.resolved_value) return token.resolved_value
    return `var(--fnd-${token.maps_to}-${wert})`
  }
  return wert
}

/**
 * @param {Object} overrides  foundationOverrides[themeSet], Form { kategorie: { key: wert } }
 * @param {Object} [opt]
 * @param {boolean} [opt.nurAbweichungen=true]  unveraenderte Tokens weglassen
 * @returns {{ zeilen: string[], uebersprungen: string[], abweichungen: number }}
 */
export function foundationZeilen(overrides, opt = {}) {
  const nurAbweichungen = opt.nurAbweichungen !== false
  const zeilen = []
  const uebersprungen = []
  let abweichungen = 0

  for (const [kategorie, tokens] of Object.entries(overrides || {})) {
    if (!tokens || typeof tokens !== 'object') continue
    // Folien-Grammatik: kein CSS, reist nur im JSON-Export mit (Plan v2, 2.5)
    if (kategorie === 'praesentation') continue
    for (const [schluessel, wert] of Object.entries(tokens)) {
      // Fokusfarbe je Modus: eigene Blöcke auf den Theme-Klassen (fokusFarbZeilen)
      if (kategorie === 'focus' && /^color-(light|dark)$/.test(schluessel)) continue
      const standard = vorgabe(kategorie, schluessel)
      if (nurAbweichungen && standard !== undefined && String(wert) === String(standard)) continue

      const name = foundationTokens?.[kategorie]?.tokens?.[schluessel]?.cssVar
      if (!name) {
        // Lieber nichts schreiben als einen Namen erfinden: ein Token ohne
        // Entsprechung im DS wuerde als tote Zeile im CSS landen.
        uebersprungen.push(`${kategorie}.${schluessel}`)
        continue
      }
      zeilen.push(`  ${name}: ${ausgabewert(kategorie, schluessel, wert)};`)
      abweichungen++
    }
  }
  return { zeilen, uebersprungen, abweichungen }
}

/**
 * Fokusring-Farbe je Modus (Befund UX-16, 15.10.2026). Das Design System
 * kennt eine Variable --fnd-focus-ring-color; der Editor pflegt Hell und
 * Dunkel getrennt (focus.color-light / color-dark). Ausgegeben wird jede auf
 * den Klassen, die die Website setzt — wie die semantischen Farben. Vorher
 * entfielen beide mit „im DS nicht vorhanden“.
 * @param {Record<string, any>} focus  foundationOverrides[set].focus
 * @param {string} [themeSet]  'neo' oder 'customer'
 * @returns {string[]}
 */
export function fokusFarbZeilen (focus, themeSet = 'neo') {
  const zeilen = []
  const name = foundationTokens?.focus?.tokens?.color?.cssVar || '--fnd-focus-ring-color'
  const praefix = themeSet === 'neo' ? 'neo' : 'customer'
  for (const [modus, selektor] of [['light', `:root, .${praefix}-light-theme`], ['dark', `.${praefix}-dark-theme`]]) {
    const wert = focus?.[`color-${modus}`]
    if (typeof wert !== 'string' || !wert.trim()) continue
    zeilen.push(`/* Fokusring (${modus === 'light' ? 'hell' : 'dunkel'}) */`, `${selektor} {`, `  ${name}: ${wert.trim()};`, '}', '')
  }
  return zeilen
}

/**
 * Eigene Spacing-Stufen und semantische Abstände als CSS (Befund UX-57,
 * 18.10.2026). Vorher gingen beide nur in den DTCG-Export — ein
 * semantischer Abstand, der auf eine eigene Stufe zeigte, war auf der
 * Website leer.
 * @param {Record<string, { value: string }>} eigene  customSpacingTokens[set]
 * @param {Record<string, string>} semantisch  semanticSpacing[set]
 * @returns {string[]}
 */
export function abstandZeilen (eigene = {}, semantisch = {}) {
  const name = /^[A-Za-z0-9_-]+$/
  const zeilen = []
  for (const [k, t] of Object.entries(eigene || {})) {
    const v = String(t?.value ?? '').trim()
    if (name.test(k) && v && !/[{};<>\\]/.test(v)) zeilen.push(`  --fnd-spacing-${k}: ${v};`)
  }
  for (const [k, wert] of Object.entries(semantisch || {})) {
    const v = String(wert ?? '').trim()
    if (name.test(k) && v && !/[{};<>\\]/.test(v)) zeilen.push(`  --fnd-spacing-${k}: ${v};`)
  }
  if (!zeilen.length) return []
  return ['/* === Abstände: eigene Stufen und semantische Abstände === */', ':root {', ...zeilen, '}\n']
}

