// @ts-check
// Theme-Store · Liste der Theme-Daten-Schluessel (Plan v2, 2.6)
// Reines Modul ohne Vue und Tokens: Store, Speicher-Adapter und Node-Werkzeuge
// (scripts/pruefe-kunden-themes.mjs) benutzen dieselbe Liste.

// EIN Schema fuer alle Theme-Inhalte (H1, 29.09.2026). Undo, benannte
// Themes, Branches und Merge benutzen dieselbe Liste. Vorher gab es vier
// Abschriften mit 9, 10 und 24 Feldern: Custom-Tokens, Icons und die
// semantischen Spacing/Typo-Werte fielen aus Undo und Branches heraus und
// "leckten" zwischen Branches.
// Neues Theme-Feld? Hier eintragen — der Test in theme-schema.test.js prueft,
// dass saveToStorage() es auch persistiert.
export const THEME_DATA_KEYS = [
  'themes', 'foundationOverrides', 'componentOverrides', 'primitiveOverrides',
  'customFonts', 'focusRingMode', 'componentLocks', 'componentVersions',
  'variantDefinitions',
  'customSpacingTokens', 'customRadiiTokens', 'customBorderWidthTokens',
  'customMediaRatioTokens', 'customShadowTokens', 'customElevationTokens',
  'customOpacityTokens', 'customZindexTokens', 'customMotionTokens',
  'customMotionEffectTokens',
  'iconLibraries', 'iconStrokeWidths', 'iconStrokeColors',
  'semanticSpacing', 'semanticTypography', 'typeScale'
]
