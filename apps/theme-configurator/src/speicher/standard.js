// @ts-check
// ==========================================================================
// NEO-Standard als vollständiger App-Stand (Plan v2, 2.6)
// ==========================================================================
// Die Werkseinstellung kommt als Datei mit dem Design System
// (data/neo-theme-defaults/neo-theme-defaults.json, Entscheidung Frage 9a;
// lokal GET /api/neo-theme-defaults, in Drupal GET {basis}/neo-standard).
// Die Datei enthält nur themes, foundationOverrides, componentOverrides und
// primitiveOverrides. Die übrigen THEME_DATA_KEYS haben feste
// Werkseinstellungen — dieselben, die loadNeoDefaults()/resetToDefaults()
// setzen (abgeglichen in tests/speicher/abweichungen.test.js).
//
// standardDaten(datei) liefert den vollständigen Standard, gegen den
// abweichungen.js rechnet. Reines Modul (Node-tauglich).
// ==========================================================================

import { THEME_DATA_KEYS } from '../stores/theme/theme-schluessel.js'

const ICON_BIBLIOTHEKEN = [
  { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
  { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' },
]
const ICON_STRICHSTAERKEN = {
  tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
  heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' },
}
const ICON_STRICHFARBEN = {
  tabler: { light: 'currentColor', dark: 'currentColor' },
  heroicons: { light: 'currentColor', dark: 'currentColor' },
}

/** Werkseinstellung je Set für die Schlüssel, die nicht in der Datei stehen. */
const FEST = {
  customFonts: () => [],
  focusRingMode: () => 'offset',
  iconLibraries: () => ICON_BIBLIOTHEKEN,
  iconStrokeWidths: () => ICON_STRICHSTAERKEN,
  iconStrokeColors: () => ICON_STRICHFARBEN,
}

/** Schlüssel, die die Standard-Datei liefern muss. */
export const STANDARD_DATEI_SCHLUESSEL = ['themes', 'foundationOverrides', 'componentOverrides', 'primitiveOverrides']

const kopie = (v) => JSON.parse(JSON.stringify(v))

/**
 * @param {object} datei  Inhalt von neo-theme-defaults.json
 * @returns {object} vollständiger Standard über alle THEME_DATA_KEYS (beide Sets)
 */
export function standardDaten(datei) {
  if (!datei || typeof datei !== 'object') throw new TypeError('NEO-Standard fehlt.')
  const fehlt = STANDARD_DATEI_SCHLUESSEL.filter(k => !datei[k]?.neo || !datei[k]?.customer)
  if (fehlt.length) throw new TypeError(`NEO-Standard unvollständig: ${fehlt.join(', ')}`)
  const aus = {}
  for (const k of THEME_DATA_KEYS) {
    if (STANDARD_DATEI_SCHLUESSEL.includes(k)) aus[k] = kopie({ neo: datei[k].neo, customer: datei[k].customer })
    else {
      const wert = FEST[k] ? FEST[k]() : {}
      aus[k] = { neo: kopie(wert), customer: kopie(wert) }
    }
  }
  return aus
}

/** Version des Standards (aus _meta.version) oder null. */
export function standardVersion(datei) {
  return datei?._meta?.version ?? null
}
