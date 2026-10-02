// @ts-check
// ==========================================================================
// Token-Erbe zwischen Komponenten (Plan v3, Phase 1)
// ==========================================================================
// Zeigt ein Komponenten-Token im Standard auf das Token einer anderen
// Komponente (z. B. --nc-search-input-height: var(--nc-input-height-md)),
// erbt es dessen Wert: Aendert ein Admin den Input, aendert sich die Suche
// mit. Der Inspector zeigt das als „erbt von Input" mit Link.
// ==========================================================================

import { componentTokenGroups } from '../data/tokens.js'

/** @type {Map<string, { gruppe: string, gruppenLabel: string, label: string }>} */
const TOKEN_ZU_GRUPPE = new Map()
for (const g of componentTokenGroups) {
  for (const t of g.tokens || []) {
    if (!TOKEN_ZU_GRUPPE.has(t.id)) TOKEN_ZU_GRUPPE.set(t.id, { gruppe: g.id, gruppenLabel: g.label, label: t.label })
  }
}

/**
 * @param {string|undefined} standardWert  Default des Tokens (z. B. "var(--nc-input-radius)")
 * @param {string} eigeneGruppe            ID der Komponente, zu der das Token gehoert
 * @returns {{ source: 'komponente', gruppe: string, category: string, label: string, varName: string } | null}
 */
export function komponentenErbe (standardWert, eigeneGruppe) {
  if (typeof standardWert !== 'string') return null
  const m = /var\(--(nc-[a-z0-9-]+)/.exec(standardWert)
  if (!m) return null
  const quelle = TOKEN_ZU_GRUPPE.get(m[1])
  if (!quelle || quelle.gruppe === eigeneGruppe) return null
  return { source: 'komponente', gruppe: quelle.gruppe, category: quelle.gruppenLabel, label: quelle.label, varName: `--${m[1]}` }
}

/** Link auf die Komponente im Konfigurator (Hash-Router). */
export const komponentenLink = (gruppe) => `#/component/${gruppe}`

/** Standardwert je Komponenten-Token (aus tokens.generated). */
const STANDARD = new Map()
for (const g of componentTokenGroups) for (const t of g.tokens || []) if (!STANDARD.has(t.id)) STANDARD.set(t.id, t.default)

/**
 * Loest eine Kette aus Komponenten-Tokens auf, bis ein Wert ohne
 * var(--nc-…) entsteht: zuerst der Wert aus dem Store (Override), sonst der
 * Standard. Foundation-Verweise (var(--fnd-…)) bleiben stehen — die zeigt der
 * Inspector schon mit Namen an.
 * @param {string} wert
 * @param {Record<string,string>} [overrides] componentOverrides des aktiven Sets
 * @returns {{ wert: string, quelle: string|null }} quelle = erstes Token der Kette
 */
export function loeseKette (wert, overrides = {}) {
  let aktuell = wert
  let quelle = null
  for (let i = 0; i < 8 && typeof aktuell === 'string'; i++) {
    const m = /^var\(--(nc-[a-z0-9-]+)\)$/.exec(aktuell.trim())
    if (!m) break
    quelle ??= m[1]
    const naechster = overrides[m[1]] || STANDARD.get(m[1])
    if (!naechster) break
    aktuell = naechster
  }
  return { wert: aktuell, quelle }
}
