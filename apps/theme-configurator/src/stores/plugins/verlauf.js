// ==========================================================================
// Pinia-Plugin: Undo-Verlauf (Plan v2, 3.3c)
// ==========================================================================
// Ein Store meldet mit der Option `verlauf: [...]`, welche Aktionen einen
// Undo-Schritt anlegen. Das Plugin merkt sich vor der Aktion den Stand und
// legt den Schritt danach an — auch bei async-Aktionen (nach dem await)
// und wenn die Aktion mit einem Fehler endet, aber schon etwas geaendert hat.
// ==========================================================================

import { beginneSchritt, schliesseSchritt } from '../theme/verlauf.js'

export function verlaufPlugin({ store, options }) {
  const aktionen = new Set(options.verlauf || [])
  if (!aktionen.size) return
  store.$onAction(({ name, after, onError }) => {
    if (!aktionen.has(name)) return
    const schritt = beginneSchritt()
    after(() => schliesseSchritt(schritt))
    onError(() => schliesseSchritt(schritt))
  })
}
