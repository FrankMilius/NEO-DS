// ==========================================================================
// NEO Theme Configurator — Token Data Model
// ==========================================================================
// DEPRECATED: This file is now a thin re-export from the auto-generated
// tokens.generated.js. Edit data/design-tokens.json and run:
//   npm run tokens
// to regenerate.
// ==========================================================================

export {
  primitiveColors,
  supportingPalettes,
  foundationPalettes,
  neutralPalette,
  paperLadders,
  papers,
  praesentation,
  systemPalettes,
  semanticTokenGroups,
  semanticDefaults,
  componentTokenGroups,
  foundationTokens,
  typographyScale,
} from './tokens.generated.js'

// Navigation-Tree wird dynamisch aus dem Component Registry generiert
// statt statisch aus tokens.generated.js (ITCSS-Struktur, keine toten Links)
export { navigationTree } from './navigation-builder.js'
