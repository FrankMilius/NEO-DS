// @ts-check
// ==========================================================================
// neo-behaviors — Einstieg fuer die Drupal-Library (Plan v3, Phase 2)
// ==========================================================================
// Wird von scripts/baue-behaviors.mjs zu dist/neo-behaviors.js gebuendelt
// (IIFE, ohne Abhaengigkeiten). Die Datei
//   - stellt window.NeoBehaviors bereit (anbinden, abbinden, BEHAVIORS,
//     MIT_VERHALTEN, version) — auch ohne Drupal nutzbar (Doku, Storybook);
//   - meldet sich, wenn Drupal da ist, als Drupal.behaviors.neoBehaviors an.
//
// Steuerung ueber drupalSettings (optional):
//   drupalSettings.neoBehaviors = { nur: ['tabs', 'select'] }   nur diese Bauteile
//   drupalSettings.neoBehaviors = { aus: true }                 nichts binden
// Ohne Angabe werden alle Bauteile gebunden, die im Kontext vorkommen —
// AUSSER denen in NUR_AUSDRUECKLICH (Website-Bauteile, deren Verhalten heute
// neo-theme.js liefert; Behaviors mit nurAusdruecklich: true). Die binden
// nur, wenn `nur` sie nennt (Entscheidung 06.10.2026) — so wird ein neues
// Behavior nicht still auf der Website aktiv.
// ==========================================================================
import { anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, NUR_AUSDRUECKLICH } from './index.js'
import paket from './package.json' with { type: 'json' }

const NeoBehaviors = Object.freeze({ anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, NUR_AUSDRUECKLICH, version: paket.version })
const STANDARD = MIT_VERHALTEN.filter((id) => !NUR_AUSDRUECKLICH.includes(id))

const g = /** @type {any} */ (globalThis)
g.NeoBehaviors = NeoBehaviors

if (g.Drupal && g.Drupal.behaviors) {
  g.Drupal.behaviors.neoBehaviors = {
    attach (context, settings) {
      const s = (settings && settings.neoBehaviors) || {}
      if (s.aus) return
      anbinden(context || document, Array.isArray(s.nur) ? s.nur : STANDARD)
    },
    detach (context, settings, trigger) {
      if (trigger === 'unload') abbinden(context || document)
    }
  }
}

export default NeoBehaviors
