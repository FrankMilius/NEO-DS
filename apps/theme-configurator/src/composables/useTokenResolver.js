// ==========================================================================
// Token-Aufloesung fuer die Arenen — eine Stelle statt 49 Kopien
// ==========================================================================
// Plan v2, Schritt 3.1 (30.09.2026). Bis dahin trug jede Arena eine eigene
// resolveToken()-Funktion: 44 wortgleich, 4 mit einem fehlenden `?.`, eine
// ohne Rollen-Verweise (Grid). Jede Korrektur an der Aufloesung haette 49
// Dateien gebraucht.
//
// Reihenfolge der Aufloesung (unveraendert gegenueber den Kopien):
//   1. Override aus dem Store (auch ein leerer String zaehlt als gesetzt)
//   2. Token der Komponente: Verweis auf eine semantische Rolle, sonst default
//   3. TOKEN_REFS der Arena: Verweis auf eine semantische Rolle
//   4. TOKEN_DEFAULTS der Arena, sonst ''
//
// Verwendung in einer Arena:
//   const { resolveToken } = useTokenResolver({
//     store, componentData, refs: TOKEN_REFS, defaults: TOKEN_DEFAULTS,
//   })
//   resolveToken(semanticMap, 'nc-button-bg')
//
// ShellArena loest anders auf (Rueckfallwert je Aufruf, zwei Token-Tabellen)
// und nutzt diesen Resolver bewusst nicht.
// ==========================================================================

/**
 * Reine Aufloesung — ohne Vue, direkt testbar.
 * @param {Record<string,string>} semanticMap  Rolle → Wert (aktuelles Thema)
 * @param {string} tokenId                      z. B. 'nc-button-bg'
 * @param {{overrides?: Record<string,string>, tokens?: Array<{id:string, ref?:string, default?:string}>,
 *          refs?: Record<string,string>, defaults?: Record<string,string>}} kontext
 * @returns {string}
 */
export function resolveTokenValue(semanticMap, tokenId, { overrides, tokens, refs = {}, defaults = {} } = {}) {
  const override = overrides?.[tokenId]
  if (override !== undefined) return override

  const tok = tokens?.find((t) => t.id === tokenId)
  if (tok) {
    if (tok.ref && semanticMap?.[tok.ref]) return semanticMap[tok.ref]
    if (tok.default) return tok.default
  }

  const rolle = refs[tokenId]
  if (rolle && semanticMap?.[rolle]) return semanticMap[rolle]

  return defaults[tokenId] || ''
}

/**
 * Resolver fuer eine Arena. Liest Store und componentData bei jedem Aufruf
 * neu — reaktiv wie die bisherigen Kopien.
 */
export function useTokenResolver({ store, componentData, refs = {}, defaults = {} }) {
  function resolveToken(semanticMap, tokenId) {
    return resolveTokenValue(semanticMap, tokenId, {
      overrides: store.currentComponentOverrides?.value,
      tokens: componentData?.value?.tokens,
      refs,
      defaults,
    })
  }
  return { resolveToken }
}
