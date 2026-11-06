// @ts-check
// ==========================================================================
// Flächenliste (I06 Phase 3): Steuerelement `type: "flaeche"` aus
// data/design-tokens.json. Eine Fläche ist ein Satz zusammengehöriger Tokens
// (Hintergrund, Text, Nebentext, Linie, Hover, Fokus), die nur gemeinsam
// gesetzt werden, damit der Kontrast gesichert bleibt. Die Vorgabe „Standard“
// hat keine Werte: Sie schreibt nichts, es gelten die Rückfälle im SCSS.
// ==========================================================================

/** Alle Token-IDs, die eine Fläche der Liste setzen kann. */
export function flaechenSchluessel (token) {
  return [...new Set((token.optionen || []).flatMap((o) => Object.keys(o.werte)))]
}

/**
 * Was beim Wählen einer Fläche zu tun ist.
 * @returns {{ setzen: Record<string, string>, entfernen: string[] }}
 */
export function flaechenAenderung (token, optionId) {
  const option = (token.optionen || []).find((o) => o.id === optionId)
  if (!option) return { setzen: {}, entfernen: [] }
  return {
    setzen: { ...option.werte },
    entfernen: flaechenSchluessel(token).filter((id) => !(id in option.werte))
  }
}

/**
 * Welche Fläche die Abweichungen ergeben: id der Option, oder 'eigene', wenn
 * ein Wert keiner Fläche entspricht (etwa aus einem älteren Theme mit freier Farbe).
 */
export function aktiveFlaeche (token, abweichungen) {
  const schluessel = flaechenSchluessel(token)
  const treffer = (token.optionen || []).find((o) =>
    schluessel.every((id) => abweichungen[id] === o.werte[id]))
  return treffer ? treffer.id : 'eigene'
}
