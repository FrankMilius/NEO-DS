// @ts-check
/**
 * @file
 * Welche Kombinationen aus Variante und Modus die Bühne zeigt (Frank,
 * 19.10.2026): immer nur das geöffnete Theme.
 *
 * Ein Kunden-Theme liegt in der Variante „neo“ (Kopie des NEO-Standards,
 * App 1.1.0); die Website bekommt es über .neo-light-theme / .neo-dark-theme.
 * Die Variante „Kunde“ (customer-*) gibt es nur im lokalen Betrieb
 * (Entscheidung E3) — in Drupal wird sie nicht ausgeliefert. Vorher zeigte
 * „Alle vier“ das geöffnete Theme unter „NEO“ und unveränderte
 * Standardwerte unter „Customer“.
 */
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'
import { speicher } from '../speicher/index.js'

const VARIANTE = Object.freeze({ neo: 'NEO', customer: 'Kunde' })

/**
 * @typedef {{ set: 'neo'|'customer', modus: 'light'|'dark', klasse: string, label: string }} Kombination
 */
export function useVorschauKombinationen () {
  const store = useThemeStore()
  /** Varianten NEO · Kunde gibt es nur ohne Drupal */
  const variantenSichtbar = speicher().art !== 'drupal'
  const themaName = computed(() => store.state.currentThemeMeta?.name || '')

  /** @returns {Kombination} */
  function kombination (set, modus, mitVariante) {
    const teile = []
    if (themaName.value) teile.push(themaName.value)
    if (mitVariante || !themaName.value) teile.push(VARIANTE[set] || set)
    teile.push(modus === 'dark' ? 'Dunkel' : 'Hell')
    return { set, modus, klasse: `${set === 'neo' ? 'neo' : 'customer'}-${modus}-theme`, label: teile.join(' · ') }
  }

  const aktivesSet = computed(() => (variantenSichtbar ? store.state.activeThemeSet || 'neo' : 'neo'))

  /** Alle Kombinationen des geöffneten Themes (Themes-Bühne, „Alle vier“) */
  const alle = computed(() => (variantenSichtbar
    ? [kombination('neo', 'light', true), kombination('neo', 'dark', true), kombination('customer', 'light', true), kombination('customer', 'dark', true)]
    : [kombination('neo', 'light', false), kombination('neo', 'dark', false)]))

  /**
   * Kombinationen für einen Vorschaumodus der Kopfzeile.
   * @param {string} modus light | dark | split | matrix
   * @returns {Kombination[]}
   */
  function fuerModus (modus) {
    const set = aktivesSet.value
    if (modus === 'dark') return [kombination(set, 'dark', false)]
    if (modus === 'split') return [kombination(set, 'light', false), kombination(set, 'dark', false)]
    if (modus === 'matrix') return alle.value
    return [kombination(set, 'light', false)]
  }

  return { variantenSichtbar, themaName, alle, fuerModus }
}
