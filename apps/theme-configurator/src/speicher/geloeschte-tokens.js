// @ts-check
// ==========================================================================
// Gelöschte Komponenten-Tokens (R14 Paket 5, 26.10.2026)
// ==========================================================================
// Diese Tokens gibt es im Design System nicht mehr: kein CSS las sie
// (Wirkungsprüfung „unbenutzt“, Löschliste entschieden von Frank am
// 23.10.2026). Gespeicherte Themes — im Browser und in Drupal — können noch
// Werte für sie enthalten, auch die Kundenwerte nc-card-nav-color-hover und
// nc-hero-padding-inline (Entscheidung Frank: gehen bewusst verloren).
//
// Beim Laden eines Themes verwirft die App diese Werte und zeigt das als
// Hinweis an (Entscheidung Frank 23.10.2026). Beim nächsten Speichern fehlen
// sie dann auch im Speicher.
//
// Bewusst eine feste Liste und keine Prüfung gegen die Registry: eigene
// Varianten (variantDefinitions) legen Token-IDs an, die es in der Registry
// nicht gibt — die dürfen nicht verloren gehen. Heißt ein umbenanntes
// Varianten-Token (nc-{komponente}-{variantenname}-…) wie ein gelöschtes,
// gehört der Wert der Variante und bleibt.
//
// Verworfen wird überall, wo ein Stand in die App kommt (Theme laden, Drupal,
// Arbeitsstand, Import, lokaler Zweig: Wechsel und Zusammenführen); beim
// Speichern (Arbeitsstand, Theme-Platz, Entwurf) werden sie nicht geschrieben.
//
// nc-avatar-border-color zusätzlich gelöscht (Entscheidung Frank 26.10.2026).
//
// Nicht gelöscht, weil JavaScript sie liest (neo-behaviors): nc-toast-
// auto-dismiss-duration, nc-toast-max-visible, nc-toast-swipe-threshold,
// nc-gallery-autoplay-interval, nc-logo-wall-fadein-delay-step.
//
// Reines Modul (kein Vue, keine Tokens): läuft auch in Node-Werkzeugen.
// ==========================================================================

/** Die 56 gelöschten Komponenten-Tokens (ohne führendes --). */
export const GELOESCHTE_TOKENS = new Set([
  'nc-accordion-padding-compact',
  'nc-accordion-padding-spacious',
  'nc-alert-close-size',
  'nc-avatar-border-color',
  'nc-avatar-transition-duration',
  'nc-card-grid-anim-delay',
  'nc-card-grid-cta-hover-scale',
  'nc-card-grid-cta-overlay-end',
  'nc-card-grid-cta-overlay-start',
  'nc-card-grid-cta-title-color',
  'nc-card-grid-cta-title-size',
  'nc-card-grid-cta-title-weight',
  'nc-card-header-padding',
  'nc-card-link-decoration',
  'nc-card-nav-color-hover',
  'nc-card-transition-duration',
  'nc-container-max-width-content',
  'nc-dt-stacked-breakpoint',
  'nc-dt-transition-duration',
  'nc-fade-gallery-fade-duration',
  'nc-fade-gallery-headline-size',
  'nc-fade-gallery-tab-indicator',
  'nc-footer-padding-inline',
  'nc-hero-footer-rule',
  'nc-hero-padding-inline',
  'nc-hero-tom-kicker-tracking',
  'nc-hero-tom-kicker-transform',
  'nc-input-borderless-underline-focus',
  'nc-input-filled-underline-color-focus',
  'nc-item-transition',
  'nc-label-transition-duration',
  'nc-logo-wall-item-height',
  'nc-metric-label-font-family',
  'nc-metric-label-tracking',
  'nc-metric-label-transform',
  'nc-notification-transition-duration',
  'nc-search-backdrop-z-index',
  'nc-search-clear-color-hover',
  'nc-search-results-top-offset',
  'nc-section-accent-bg',
  'nc-section-accent-color',
  'nc-section-edge-angle',
  'nc-section-edge-fill',
  'nc-section-edge-height',
  'nc-shell-sidebar-left-width-standard',
  'nc-shell-sidebar-right-width-standard',
  'nc-shell-z-linkbar',
  'nc-shell-z-sidebar',
  'nc-story-gallery-headline-size',
  'nc-table-color-secondary',
  'nc-table-transition-duration',
  'nc-tag-transition-duration',
  'nc-text-media-headline-size',
  'nc-text-media-subline-color',
  'nc-treeview-checkbox-gap',
  'nc-treeview-guide-style',
])

const istObjekt = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * Token-IDs, die eigene Varianten eines Sets angelegt haben. Eine Variante
 * kann zufällig so heißen wie ein gelöschtes Token (Card-Variante „header“
 * aus Basis „footer“ → nc-card-header-padding) — dieser Wert gehört der
 * Variante und bleibt.
 *
 * Geschützt werden nur echt umbenannte IDs: createVariant
 * (stores/theme/komponenten.js) ersetzt nc-{komponente}-{basis}- durch
 * nc-{komponente}-{variantenname}-; IDs ohne dieses Muster übernimmt es
 * unverändert in definition.tokens (z. B. Variante „dicht“ aus density
 * „compact“: nc-accordion-padding-compact). Solche IDs sind Registry-Tokens
 * und keine eigenen — ein gelöschtes darunter wird verworfen
 * (Nachbesserung 2 nach dem Widersacher, B1, 26.10.2026).
 * @param {Record<string, any>|null|undefined} variantenDesSets  variantDefinitions[set]: { [komponente]: { [name]: { tokens: string[] } } }
 * @returns {Set<string>}
 */
export function variantenTokens(variantenDesSets) {
  const ids = new Set()
  if (!istObjekt(variantenDesSets)) return ids
  for (const [komponente, varianten] of Object.entries(variantenDesSets)) {
    if (!istObjekt(varianten)) continue
    for (const [name, def] of Object.entries(varianten)) {
      if (!istObjekt(def) || !Array.isArray(def.tokens)) continue
      const eigen = `nc-${komponente}-${name}-`
      for (const t of def.tokens) if (typeof t === 'string' && t.startsWith(eigen)) ids.add(t)
    }
  }
  return ids
}

/**
 * Ist das Token gelöscht — und nicht von einer eigenen Variante angelegt?
 * @param {string} token
 * @param {Set<string>} [eigene]  Ergebnis von variantenTokens()
 */
export const istGeloescht = (token, eigene) => GELOESCHTE_TOKENS.has(token) && !eigene?.has(token)

/**
 * Komponenten-Werte eines Sets ohne gelöschte Tokens (zum Speichern).
 * Ohne Treffer kommt dasselbe Objekt zurück.
 * @param {Record<string, any>|null|undefined} werte  componentOverrides[set]
 * @param {Record<string, any>|null|undefined} [variantenDesSets]  variantDefinitions[set]
 */
export function ohneGeloeschteTokens(werte, variantenDesSets) {
  if (!istObjekt(werte)) return werte
  const eigene = variantenTokens(variantenDesSets)
  if (!Object.keys(werte).some((t) => istGeloescht(t, eigene))) return werte
  return Object.fromEntries(Object.entries(werte).filter(([t]) => !istGeloescht(t, eigene)))
}

/**
 * Werte gelöschter Tokens aus Theme-Daten entfernen.
 * Betrachtet componentOverrides je Set (neo, customer); Tokens eigener
 * Varianten des Sets (variantDefinitions) bleiben. Die Eingabe bleibt
 * unverändert.
 * @param {Record<string, any>|null|undefined} daten  App-Stand (THEME_DATA_KEYS, je Set)
 * @returns {{ daten: Record<string, any>|null|undefined, verworfen: Array<{ set: string, token: string, wert: any }> }}
 */
export function verwirfGeloeschteTokens(daten) {
  const verworfen = []
  if (!istObjekt(daten) || !istObjekt(daten.componentOverrides)) return { daten, verworfen }
  const overrides = {}
  for (const [set, werte] of Object.entries(daten.componentOverrides)) {
    if (!istObjekt(werte)) { overrides[set] = werte; continue }
    const eigene = variantenTokens(daten.variantDefinitions?.[set])
    const rest = {}
    for (const [token, wert] of Object.entries(werte)) {
      if (istGeloescht(token, eigene)) verworfen.push({ set, token, wert })
      else rest[token] = wert
    }
    overrides[set] = rest
  }
  if (!verworfen.length) return { daten, verworfen }
  return { daten: { ...daten, componentOverrides: overrides }, verworfen }
}

/**
 * Hinweis für die Oberfläche (Anrede Sie). null, wenn nichts verworfen wurde.
 * Wer nur ansehen darf, kann nicht speichern — dann ohne den Satz zum
 * Speichern (neutral, nichts ist „ungespeichert“).
 * @param {Array<{ token: string }>} verworfen
 * @param {{ nurAnsehen?: boolean }} [o]
 * @returns {{ titel: string, text: string } | null}
 */
export function hinweisZuVerworfenen(verworfen, { nurAnsehen = false } = {}) {
  const namen = [...new Set((verworfen || []).map((v) => v.token))].sort()
  if (!namen.length) return null
  const liste = namen.map((n) => `--${n}`).join(', ')
  const anzahl = namen.length === 1 ? 'einen Wert für ein Token, das' : `Werte für ${namen.length} Tokens, die`
  const text = `Das Theme enthielt ${anzahl} es im Design System nicht mehr gibt: ${liste}. `
    + 'Diese Werte wirkten auf der Website nicht und werden in der Ansicht nicht gezeigt.'
  if (nurAnsehen) return { titel: 'Werte entfernter Tokens ausgeblendet', text }
  return {
    titel: 'Werte entfernter Tokens verworfen',
    text: `Das Theme enthielt ${anzahl} es im Design System nicht mehr gibt: ${liste}. `
      + 'Diese Werte wirkten auf der Website nicht und wurden beim Laden verworfen. '
      + 'Beim nächsten Speichern werden sie auch aus dem gespeicherten Theme entfernt.',
  }
}
