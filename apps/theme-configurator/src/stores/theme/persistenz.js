// Theme-Store · Speichern auf Server und in localStorage, Laden, Auto-Save
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { toRaw, watch } from 'vue'
import { currentThemeId } from './getter.js'
import { _validComponentTokenIds, state } from './kern.js'
import { loadSavedThemesList, persistSavedThemesList } from './themes.js'
import { ergaenzeFoundation } from './token-aktionen.js'
import { speicher } from '../../speicher/index.js'
import { LOKALE_SCHLUESSEL, leseArbeitsstand, schreibeArbeitsstand, schreibeTheme } from '../../speicher/lokal.js'
import { speichereTheme } from './themes.js'

// ---------------------------------------------------------------------------
// Save to Server (full theme format)
// ---------------------------------------------------------------------------

export async function saveToServer() {
  // Plan v2, 2.6: Mit Drupal-Speicher heisst "Speichern" (Strg+S) das
  // aktuelle Theme in Drupal speichern (Abweichungen vom Standard, If-Match).
  // Lokal bleibt alles wie bisher.
  const sp = speicher()
  if (sp.art !== 'lokal') return speichereTheme()

  const themeSet = state.activeThemeSet
  const payload = {
    meta: {
      name: state.currentThemeMeta?.name || (themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'),
      version: state.version,
      generated: new Date().toISOString(),
      generator: 'NEO Theme Configurator'
    },
    theme: currentThemeId.value,
    primitives: toRaw(state.primitiveOverrides[themeSet]),
    semantic: {
      [themeSet + '-light']: toRaw(state.themes[themeSet].light),
      [themeSet + '-dark']: toRaw(state.themes[themeSet].dark)
    },
    components: toRaw(state.componentOverrides[themeSet]),
    foundation: toRaw(state.foundationOverrides[themeSet]),
    typeScale: toRaw(state.typeScale[themeSet])
  }

  // POST /api/save-theme des Docs-Servers (speicher/lokal.js)
  return sp.sichereEntwurf(payload)
}

// ---------------------------------------------------------------------------
// Persist to localStorage
// ---------------------------------------------------------------------------

export const STORAGE_KEY = LOKALE_SCHLUESSEL.arbeitsstand

// Debounce timer for named-theme auto-save (avoids excessive localStorage writes)
export let _namedThemeSaveTimer = null

export function saveToStorage() {
  try {
    const data = {
      activeThemeSet: state.activeThemeSet,
      previewMode: state.previewMode,
      themes: toRaw(state.themes),
      foundationOverrides: toRaw(state.foundationOverrides),
      componentOverrides: toRaw(state.componentOverrides),
      primitiveOverrides: toRaw(state.primitiveOverrides),
      customFonts: toRaw(state.customFonts),
      focusRingMode: toRaw(state.focusRingMode),
      componentLocks: toRaw(state.componentLocks),
      componentVersions: toRaw(state.componentVersions),
      variantDefinitions: toRaw(state.variantDefinitions),
      customSpacingTokens: toRaw(state.customSpacingTokens),
      customRadiiTokens: toRaw(state.customRadiiTokens),
      customBorderWidthTokens: toRaw(state.customBorderWidthTokens),
      customMediaRatioTokens: toRaw(state.customMediaRatioTokens),
      customShadowTokens: toRaw(state.customShadowTokens),
      customElevationTokens: toRaw(state.customElevationTokens),
      customOpacityTokens: toRaw(state.customOpacityTokens),
      customZindexTokens: toRaw(state.customZindexTokens),
      customMotionTokens: toRaw(state.customMotionTokens),
      customMotionEffectTokens: toRaw(state.customMotionEffectTokens),
      iconLibraries: toRaw(state.iconLibraries),
      iconStrokeWidths: toRaw(state.iconStrokeWidths),
      iconStrokeColors: toRaw(state.iconStrokeColors),
      semanticSpacing: toRaw(state.semanticSpacing),
      semanticTypography: toRaw(state.semanticTypography),
      typeScale: toRaw(state.typeScale),
      currentThemeMeta: toRaw(state.currentThemeMeta),
      activeSection: state.activeSection
    }
    schreibeArbeitsstand(data)
  } catch (e) {
    console.warn('Failed to save theme state:', e)
  }

  // Also persist to the named theme slot (debounced, 500ms)
  // This ensures that when a named theme is loaded and the user edits tokens,
  // the individual theme snapshot stays in sync with the working state.
  if (state.currentThemeMeta) {
    clearTimeout(_namedThemeSaveTimer)
    _namedThemeSaveTimer = setTimeout(() => {
      try {
        const meta = state.currentThemeMeta
        if (!meta) return  // guard in case theme was unloaded during debounce
        meta.updatedAt = new Date().toISOString()
        const snapshot = {
          themes: JSON.parse(JSON.stringify(toRaw(state.themes))),
          foundationOverrides: JSON.parse(JSON.stringify(toRaw(state.foundationOverrides))),
          componentOverrides: JSON.parse(JSON.stringify(toRaw(state.componentOverrides))),
          primitiveOverrides: JSON.parse(JSON.stringify(toRaw(state.primitiveOverrides))),
          customFonts: JSON.parse(JSON.stringify(toRaw(state.customFonts))),
          focusRingMode: JSON.parse(JSON.stringify(toRaw(state.focusRingMode))),
          componentLocks: JSON.parse(JSON.stringify(toRaw(state.componentLocks))),
          componentVersions: JSON.parse(JSON.stringify(toRaw(state.componentVersions))),
          variantDefinitions: JSON.parse(JSON.stringify(toRaw(state.variantDefinitions))),
          customSpacingTokens: JSON.parse(JSON.stringify(toRaw(state.customSpacingTokens))),
          customRadiiTokens: JSON.parse(JSON.stringify(toRaw(state.customRadiiTokens))),
          customBorderWidthTokens: JSON.parse(JSON.stringify(toRaw(state.customBorderWidthTokens))),
          customMediaRatioTokens: JSON.parse(JSON.stringify(toRaw(state.customMediaRatioTokens))),
          customShadowTokens: JSON.parse(JSON.stringify(toRaw(state.customShadowTokens))),
          customElevationTokens: JSON.parse(JSON.stringify(toRaw(state.customElevationTokens))),
          customOpacityTokens: JSON.parse(JSON.stringify(toRaw(state.customOpacityTokens))),
          customZindexTokens: JSON.parse(JSON.stringify(toRaw(state.customZindexTokens))),
          customMotionTokens: JSON.parse(JSON.stringify(toRaw(state.customMotionTokens))),
          customMotionEffectTokens: JSON.parse(JSON.stringify(toRaw(state.customMotionEffectTokens))),
          iconLibraries: JSON.parse(JSON.stringify(toRaw(state.iconLibraries))),
          iconStrokeWidths: JSON.parse(JSON.stringify(toRaw(state.iconStrokeWidths))),
          iconStrokeColors: JSON.parse(JSON.stringify(toRaw(state.iconStrokeColors))),
          semanticSpacing: JSON.parse(JSON.stringify(toRaw(state.semanticSpacing))),
          semanticTypography: JSON.parse(JSON.stringify(toRaw(state.semanticTypography))),
          typeScale: JSON.parse(JSON.stringify(toRaw(state.typeScale))),
          activeThemeSet: state.activeThemeSet,
          meta: JSON.parse(JSON.stringify(toRaw(meta)))
        }
        schreibeTheme(meta.id, snapshot)
        // Also update the catalogue entry with the new updatedAt timestamp
        const idx = state.savedThemes.findIndex(t => t.id === meta.id)
        if (idx >= 0) {
          state.savedThemes[idx] = JSON.parse(JSON.stringify(toRaw(meta)))
          persistSavedThemesList()
        }
      } catch (e) {
        console.warn('Failed to auto-save named theme:', e)
      }
    }, 500)
  }
}

export function loadFromStorage() {
  try {
    const data = leseArbeitsstand()
    if (data) {
      if (data.themes) Object.assign(state.themes, data.themes)
      if (data.foundationOverrides) Object.assign(state.foundationOverrides, data.foundationOverrides)
      if (data.componentOverrides) Object.assign(state.componentOverrides, data.componentOverrides)
      if (data.primitiveOverrides) Object.assign(state.primitiveOverrides, data.primitiveOverrides)
      if (data.customFonts) Object.assign(state.customFonts, data.customFonts)
      if (data.focusRingMode) Object.assign(state.focusRingMode, data.focusRingMode)
      if (data.componentLocks) Object.assign(state.componentLocks, data.componentLocks)
      if (data.componentVersions) Object.assign(state.componentVersions, data.componentVersions)
      if (data.variantDefinitions) Object.assign(state.variantDefinitions, data.variantDefinitions)
      if (data.customSpacingTokens) Object.assign(state.customSpacingTokens, data.customSpacingTokens)
      if (data.customRadiiTokens) Object.assign(state.customRadiiTokens, data.customRadiiTokens)
      if (data.customBorderWidthTokens) Object.assign(state.customBorderWidthTokens, data.customBorderWidthTokens)
      if (data.customMediaRatioTokens) Object.assign(state.customMediaRatioTokens, data.customMediaRatioTokens)
      if (data.customShadowTokens) Object.assign(state.customShadowTokens, data.customShadowTokens)
      if (data.customElevationTokens) Object.assign(state.customElevationTokens, data.customElevationTokens)
      if (data.customOpacityTokens) Object.assign(state.customOpacityTokens, data.customOpacityTokens)
      if (data.customZindexTokens) Object.assign(state.customZindexTokens, data.customZindexTokens)
      if (data.customMotionTokens) Object.assign(state.customMotionTokens, data.customMotionTokens)
      if (data.customMotionEffectTokens) Object.assign(state.customMotionEffectTokens, data.customMotionEffectTokens)
      if (data.iconLibraries) Object.assign(state.iconLibraries, data.iconLibraries)
      if (data.iconStrokeWidths) Object.assign(state.iconStrokeWidths, data.iconStrokeWidths)
      if (data.iconStrokeColors) Object.assign(state.iconStrokeColors, data.iconStrokeColors)

      // --- Migration: Built-in Icon Libraries sicherstellen ---
      const builtInLibs = [
        { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
        { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
      ]
      const defaultStrokes = {
        tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
        heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
      }
      const defaultColors = {
        tabler: { light: 'currentColor', dark: 'currentColor' },
        heroicons: { light: 'currentColor', dark: 'currentColor' }
      }
      for (const ts of ['neo', 'customer']) {
        const libs = state.iconLibraries[ts]
        // Sicherstellen, dass alle Built-in Libraries vorhanden sind + manifestPath haben
        for (const builtIn of builtInLibs) {
          const existing = libs.find(l => l.id === builtIn.id)
          if (!existing) {
            libs.push(builtIn)
          } else {
            if (!existing.manifestPath) existing.manifestPath = builtIn.manifestPath
            if (!existing.builtIn) existing.builtIn = builtIn.builtIn
          }
        }
        // Per-Library Stroke-Daten migrieren (alte Flat-Struktur → nested)
        const sw = state.iconStrokeWidths[ts]
        if (sw && !sw.tabler && sw.xs !== undefined) {
          // Alte Flat-Struktur: { xs: '1', ... } → { tabler: { xs: '1', ... } }
          state.iconStrokeWidths[ts] = { tabler: { ...sw }, heroicons: defaultStrokes.heroicons }
        }
        // Sicherstellen, dass jede Library Stroke Widths hat
        if (!state.iconStrokeWidths[ts].tabler) state.iconStrokeWidths[ts].tabler = defaultStrokes.tabler
        if (!state.iconStrokeWidths[ts].heroicons) state.iconStrokeWidths[ts].heroicons = defaultStrokes.heroicons

        const sc = state.iconStrokeColors[ts]
        if (sc && !sc.tabler && (sc.light !== undefined || sc.dark !== undefined)) {
          // Alte Flat-Struktur: { light: '...', dark: '...' } → { tabler: { ... } }
          state.iconStrokeColors[ts] = { tabler: { ...sc }, heroicons: defaultColors.heroicons }
        }
        if (!state.iconStrokeColors[ts].tabler) state.iconStrokeColors[ts].tabler = defaultColors.tabler
        if (!state.iconStrokeColors[ts].heroicons) state.iconStrokeColors[ts].heroicons = defaultColors.heroicons
      }
      if (data.semanticSpacing) Object.assign(state.semanticSpacing, data.semanticSpacing)
      if (data.semanticTypography) Object.assign(state.semanticTypography, data.semanticTypography)
      if (data.typeScale) Object.assign(state.typeScale, data.typeScale)
      if (data.activeThemeSet) state.activeThemeSet = data.activeThemeSet
      // previewMode wird NICHT restored — startet immer im Light Mode
      state.previewMode = 'light'
      if (data.currentThemeMeta) state.currentThemeMeta = data.currentThemeMeta
      if (data.activeSection) state.activeSection = data.activeSection
    }
  } catch (e) {
    console.warn('Failed to load theme state:', e)
  }
  // Also load the saved themes catalogue
  loadSavedThemesList()

  // ---------------------------------------------------------------------------
  // Fehlende Foundation-Werte aus den Vorgaben ergaenzen (Plan v2, 2.4).
  // Neue Kategorien und Tokens der Quelle (size, tracking, weight-heading …)
  // fehlen in aelteren gespeicherten Staenden; ohne Ergaenzung wuerden sie im
  // Export fehlen. Gesetzte Werte bleiben unberuehrt.
  // ---------------------------------------------------------------------------
  ergaenzeFoundation()

  // ---------------------------------------------------------------------------
  // Prune stale component overrides (tokens removed during token hygiene)
  // ---------------------------------------------------------------------------
  for (const themeSet of ['neo', 'customer']) {
    const overrides = state.componentOverrides[themeSet]
    if (!overrides) continue
    for (const key of Object.keys(overrides)) {
      if (!_validComponentTokenIds.has(key)) {
        console.warn('[Theme Store] Pruning stale component override:', key)
        delete overrides[key]
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Migrate legacy custom fonts from isolated localStorage keys into store state
  // Old format: neo-cfg-custom-fonts (NEO default) or neo-cfg-custom-fonts-{themeId}
  // ---------------------------------------------------------------------------
  try {
    const LEGACY_KEY = 'neo-cfg-custom-fonts'
    // Migrate NEO default custom fonts
    if (state.customFonts.neo.length === 0) {
      const legacyNeo = localStorage.getItem(LEGACY_KEY)
      if (legacyNeo) {
        const parsed = JSON.parse(legacyNeo)
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.customFonts.neo = parsed
          localStorage.removeItem(LEGACY_KEY)
          console.log('[MIGRATE] Migrated', parsed.length, 'legacy custom fonts (NEO default)')
        }
      }
    }
    // Migrate per-theme custom fonts for the currently loaded theme
    if (state.currentThemeMeta) {
      const themeSet = state.activeThemeSet
      if (state.customFonts[themeSet].length === 0) {
        const legacyKey = `${LEGACY_KEY}-${state.currentThemeMeta.id}`
        const legacyFonts = localStorage.getItem(legacyKey)
        if (legacyFonts) {
          const parsed = JSON.parse(legacyFonts)
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.customFonts[themeSet] = parsed
            localStorage.removeItem(legacyKey)
            console.log('[MIGRATE] Migrated', parsed.length, 'legacy custom fonts for theme', state.currentThemeMeta.name)
          }
        }
      }
    }
  } catch (e) {
    console.warn('[MIGRATE] Failed to migrate legacy custom fonts:', e)
  }
}

// Auto-save on changes
watch(
  () => [state.themes, state.foundationOverrides, state.componentOverrides, state.primitiveOverrides, state.customFonts, state.focusRingMode, state.componentLocks, state.componentVersions, state.variantDefinitions, state.customSpacingTokens, state.customRadiiTokens, state.customBorderWidthTokens, state.customMediaRatioTokens, state.customShadowTokens, state.customElevationTokens, state.customOpacityTokens, state.customZindexTokens, state.customMotionTokens, state.customMotionEffectTokens, state.iconLibraries, state.iconStrokeWidths, state.iconStrokeColors, state.semanticSpacing, state.semanticTypography, state.typeScale],
  () => saveToStorage(),
  { deep: true }
)

// Aktive Sektion separat speichern (leichtgewichtig, kein deep watch noetig)
watch(() => state.activeSection, () => saveToStorage())
