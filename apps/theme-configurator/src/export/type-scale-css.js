/**
 * @file
 * CSS-Zeilen fuer die fluide Schriftskala (--fs-*) beim Export (Plan v2, 2.3).
 *
 * Wie foundation-css.js: nur ABWEICHUNGEN. Solange Basis und Verhaeltnisse
 * der Quelle entsprechen, schreibt der Export nichts — die Website rechnet
 * die Skala dann selbst. Hat jemand die Skala veraendert, werden alle 14
 * Stufen geschrieben, weil jede Stufe von Basis und Verhaeltnis abhaengt.
 * Die Rolle-Tokens (--fnd-typography-heading-*-font-size usw.) verweisen im
 * Design System auf --fs-* und folgen damit von selbst.
 */
import { typographyScale } from '../data/tokens.generated.js'
import { skalenParameter, berechneSkala, istGeaendert } from '../utils/fluid-scale.js'

/**
 * @param {object} [aenderung] typeScale[themeSet], z. B. { base_max_px: 19 }
 * @returns {string[]} CSS-Zeilen ohne umschliessendes :root
 */
export function schriftskalaZeilen(aenderung = {}) {
  if (!istGeaendert(typographyScale, aenderung)) return []
  return berechneSkala(skalenParameter(typographyScale, aenderung))
    .map((s) => `  --fs-${s.stufe}: ${s.css};`)
}
