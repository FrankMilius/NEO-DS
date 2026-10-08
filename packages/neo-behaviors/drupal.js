// @ts-check
// ==========================================================================
// neo-behaviors — Einstieg fuer die Drupal-Library (Plan v3, Phase 2)
// ==========================================================================
// Wird von scripts/baue-behaviors.mjs zu dist/neo-behaviors.js gebuendelt
// (IIFE, ohne Abhaengigkeiten). Die Datei
//   - stellt window.NeoBehaviors bereit (anbinden, abbinden, BEHAVIORS,
//     MIT_VERHALTEN, version, shotAufbauen — baut das Medien-Bauteil aus
//     Karten-Daten, Nachfolger von window.NeoShot.render) — auch ohne Drupal
//     nutzbar (Doku, Storybook);
//   - meldet sich, wenn Drupal da ist, als Drupal.behaviors.neoBehaviors an.
//
// Steuerung ueber drupalSettings (optional):
//   drupalSettings.neoBehaviors = { nur: ['tabs', 'select'] }   nur diese Bauteile
//   drupalSettings.neoBehaviors = { nur: { tabs: true } }       dasselbe als Objekt
//   drupalSettings.neoBehaviors = { aus: true }                 nichts binden
// Drupal fuehrt drupalSettings mehrerer Render-Elemente so zusammen, dass
// Listen mit Zahlenschluesseln einander UEBERSCHREIBEN (nur[0] des einen
// Blocks ersetzt nur[0] der Hauptnavigation — BubbleableMetadata::
// mergeAttachments). Das Theme setzt deshalb nur[<id>] = TRUE; hier werden
// beide Formen gelesen (Fehler 08.10.2026: Hauptnavigation ohne Verhalten auf
// Seiten mit weiteren Bauteilen).
// Ohne Angabe werden alle Bauteile gebunden, die im Kontext vorkommen —
// AUSSER denen in NUR_AUSDRUECKLICH (Website-Bauteile, deren Verhalten heute
// neo-theme.js liefert; Behaviors mit nurAusdruecklich: true). Die binden
// nur, wenn `nur` sie nennt (Entscheidung 06.10.2026) — so wird ein neues
// Behavior nicht still auf der Website aktiv.
// ==========================================================================
import { anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, NUR_AUSDRUECKLICH, shotAufbauen } from './index.js'
import paket from './package.json' with { type: 'json' }

const NeoBehaviors = Object.freeze({ anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, NUR_AUSDRUECKLICH, shotAufbauen, version: paket.version })
const STANDARD = MIT_VERHALTEN.filter((id) => !NUR_AUSDRUECKLICH.includes(id))

/**
 * Liste der Bauteile aus drupalSettings.neoBehaviors.nur — Liste oder Objekt
 * ({ id: true }; Zahlenschluessel mit Text-Wert zaehlen als Listeneintrag).
 * @param {unknown} nur
 * @returns {string[]|null} null = keine Angabe
 */
export function nurListe (nur) {
  if (Array.isArray(nur)) return nur.filter((id) => typeof id === 'string')
  if (!nur || typeof nur !== 'object') return null
  const ids = []
  for (const [schluessel, wert] of Object.entries(nur)) {
    if (typeof wert === 'string') ids.push(wert)
    else if (wert) ids.push(schluessel)
  }
  return [...new Set(ids)]
}

const g = /** @type {any} */ (globalThis)
g.NeoBehaviors = NeoBehaviors

if (g.Drupal && g.Drupal.behaviors) {
  g.Drupal.behaviors.neoBehaviors = {
    attach (context, settings) {
      const s = (settings && settings.neoBehaviors) || {}
      if (s.aus) return
      anbinden(context || document, nurListe(s.nur) ?? STANDARD)
    },
    detach (context, settings, trigger) {
      if (trigger === 'unload') abbinden(context || document)
    }
  }
}

export default NeoBehaviors
