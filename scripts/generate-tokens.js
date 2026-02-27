const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const tokensPath = path.resolve(__dirname, '../data/design-tokens.json');
const settingsDir = path.resolve(__dirname, '../scss/scss/00-settings');
const outCss = path.resolve(__dirname, '../data/design-tokens.css');
const outLegacy = path.resolve(settingsDir, '_design-tokens.generated.scss');
const outThemeApp = path.resolve(__dirname, '../apps/theme-configurator/src/data/tokens.generated.js');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// ---------------------------------------------------------------------------
// Unified Contract (v2) vs Legacy (v1) detection
// ---------------------------------------------------------------------------
// v2 has top-level "foundation" and "primitives" keys.
// v1 has top-level "modules" key.
// Support both for backward compatibility during migration.

const isV2 = !!tokens.foundation;
const modules = isV2 ? tokens.foundation : tokens.modules;

// Color primitives path differs between v1 and v2
const getColorPrimitives = () => {
  if (isV2) {
    // In v2, primitives are at top-level: tokens.primitives
    const p = tokens.primitives;
    return {
      neutral: p.neutral,
      primary: p.brand.primary,
      secondary: p.brand.secondary,
      accent: p.brand.accent,
      system: {
        info: p.system.info.base,
        success: p.system.success.base,
        warning: p.system.warning.base,
        danger: p.system.danger.base
      },
      system_text: p.system_text,
      system_bg: p.system_bg
    };
  }
  // v1: modules.color.primitives
  return tokens.modules.color.primitives;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toKebab = (str) => str.replace(/_/g, '-');

const scssValue = (value) => {
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "\\'")}'`;
};

const toScssMap = (obj, indent = 0) => {
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);
  const entries = Object.entries(obj).map(([key, value]) => {
    const k = `'${String(key).replace(/'/g, "\\'")}'`;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return `${innerPad}${k}: ${toScssMap(value, indent + 1)}`;
    }
    return `${innerPad}${k}: ${scssValue(value)}`;
  });
  return `(${entries.join(',\n')}\n${pad})`;
};

const flatten = (obj, prefix = []) => {
  const entries = [];
  Object.entries(obj).forEach(([key, value]) => {
    const next = [...prefix, toKebab(key)];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      entries.push(...flatten(value, next));
    } else {
      entries.push({ key: next.join('-'), value });
    }
  });
  return entries;
};

const header = (module) =>
  `// AUTO-GENERATED from data/design-tokens.json — DO NOT EDIT DIRECTLY.\n// Module: ${module}\n\n`;

const writePartial = (filename, content) => {
  const filePath = path.resolve(settingsDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${filename}`);
};

// Sort numeric-like keys naturally (01, 02, ..., 09, 10, 11) instead of JS default
const sortedEntries = (obj) => {
  return Object.entries(obj).sort(([a], [b]) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
};

// ---------------------------------------------------------------------------
// Module: Spacing
// ---------------------------------------------------------------------------

const generateSpacing = () => {
  const sp = modules.spacing;
  let out = header('spacing');
  out += `$token-base-unit: ${sp.base_unit} !default;\n\n`;
  out += `$token-spacing: (\n`;
  for (const [key, val] of sortedEntries(sp.scale)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `) !default;\n\n`;

  if (sp.fluid && sp.fluid.fluid_steps) {
    out += `$token-spacing-fluid: (\n`;
    for (const [key, range] of sortedEntries(sp.fluid.fluid_steps)) {
      out += `  '${key}': (min: ${range.min}, max: ${range.max}),\n`;
    }
    out += `) !default;\n\n`;
    out += `$token-fluid-vw-min: ${sp.fluid.viewport_min} !default;\n`;
    out += `$token-fluid-vw-max: ${sp.fluid.viewport_max} !default;\n`;
  }

  writePartial('_tokens-spacing.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Typography
// ---------------------------------------------------------------------------

const generateTypography = () => {
  const typo = modules.typography;
  let out = header('typography');

  out += `$token-font-body: ${scssValue(typo.fonts.body)};\n`;
  out += `$token-font-heading: ${scssValue(typo.fonts.heading)};\n`;
  out += `$token-font-mono: ${scssValue(typo.fonts.mono)};\n\n`;

  out += `$token-fluid-base-min-px: ${typo.fluid.base_min_px}px;\n`;
  out += `$token-fluid-base-max-px: ${typo.fluid.base_max_px}px;\n`;
  out += `$token-fluid-ratio: ${typo.fluid.ratio};\n\n`;

  out += `$token-line-height: (\n`;
  for (const [key, val] of Object.entries(typo.line_height)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `);\n\n`;

  out += `$token-semantic-steps: (\n`;
  for (const [key, val] of Object.entries(typo.semantic_steps)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `);\n`;

  writePartial('_tokens-typography.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Motion
// ---------------------------------------------------------------------------

const generateMotion = () => {
  const motion = modules.motion;
  let out = header('motion');

  out += `$token-motion-ease: (\n`;
  for (const [key, val] of Object.entries(motion.easing)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `);\n\n`;

  out += `$token-motion-duration: (\n`;
  for (const [key, val] of sortedEntries(motion.duration)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `);\n\n`;

  out += `$token-motion-duration-semantic: (\n`;
  for (const [key, val] of Object.entries(motion.duration_semantic)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `);\n\n`;

  out += `$token-motion-delay: (\n`;
  for (const [key, val] of sortedEntries(motion.delay)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `);\n`;

  writePartial('_tokens-motion.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Layout
// ---------------------------------------------------------------------------

const generateLayout = () => {
  const layout = modules.layout;
  let out = header('layout');

  out += `$token-z-index: (\n`;
  for (const [key, val] of Object.entries(layout.z_index)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `);\n\n`;

  out += `$token-nav-height-mobile: ${layout.nav_height.mobile};\n`;
  out += `$token-nav-height-desktop: ${layout.nav_height.desktop};\n\n`;

  out += `$token-media-ratios: (\n`;
  for (const [key, val] of Object.entries(layout.media_ratios)) {
    out += `  '${key}': '${val}',\n`;
  }
  out += `);\n\n`;

  out += `$token-container-max-width: ${layout.container.max_width};\n`;
  out += `$token-container-max-width-wide: ${layout.container.max_width_wide};\n\n`;

  out += `$token-grid-columns: ${layout.grid.columns};\n`;
  out += `$token-grid-gap: ${layout.grid.gap};\n`;
  out += `$token-grid-gap-lg: ${layout.grid.gap_lg};\n`;

  writePartial('_tokens-layout.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Radii
// ---------------------------------------------------------------------------

const generateRadii = () => {
  const radii = modules.radii;
  let out = header('radii');

  out += `$token-radii: (\n`;
  for (const [key, val] of Object.entries(radii.scale)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `);\n`;

  writePartial('_tokens-radii.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Border
// ---------------------------------------------------------------------------

const generateBorder = () => {
  const border = modules.border;
  let out = header('border');

  out += `$token-border-width: (\n`;
  for (const [key, val] of Object.entries(border.width)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `);\n\n`;

  // Width aliases (semantic names → scale keys)
  if (border.width_aliases) {
    out += `$token-border-width-aliases: (\n`;
    for (const [key, val] of Object.entries(border.width_aliases)) {
      out += `  '${toKebab(key)}': '${val}',\n`;
    }
    out += `);\n\n`;
  }

  // Default width
  if (border.width_default) {
    out += `$token-border-width-default: '${border.width_default}';\n\n`;
  }

  out += `$token-border-style: (\n`;
  for (const [key, val] of Object.entries(border.style)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `);\n`;

  writePartial('_tokens-border.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Shadow & Elevation
// ---------------------------------------------------------------------------

const generateShadow = () => {
  const shadow = modules.shadow;
  const elevation = modules.elevation;
  let out = header('shadow');

  out += `$token-shadow-levels: (\n`;
  for (const [key, val] of Object.entries(shadow.levels)) {
    out += `  '${key}': ${scssValue(val)},\n`;
  }
  out += `);\n\n`;

  out += `$token-elevation-levels: (\n`;
  for (const [key, val] of Object.entries(elevation.levels)) {
    out += `  '${key}': ${scssValue(val)},\n`;
  }
  out += `);\n`;

  writePartial('_tokens-shadow.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Color Primitives
// ---------------------------------------------------------------------------

const generateColors = () => {
  const prim = getColorPrimitives();
  if (!prim) {
    console.log('  ⊘ No color primitives in tokens, skipping.');
    return;
  }

  let out = header('color-primitives');

  // Neutral palette (handcrafted, not auto-generated)
  out += `$token-neutral: (\n`;
  for (const [step, hex] of sortedEntries(prim.neutral)) {
    out += `  ${step}: ${hex},\n`;
  }
  out += `) !default;\n\n`;

  // Brand base colors
  out += `$token-primary-base: ${prim.primary.base} !default;\n`;
  out += `$token-secondary-base: ${prim.secondary.base} !default;\n`;
  out += `$token-accent-base: ${prim.accent.base} !default;\n\n`;

  // System colors
  out += `$token-system: (\n`;
  for (const [key, val] of Object.entries(prim.system)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `) !default;\n\n`;

  // System text colors
  out += `$token-system-text: (\n`;
  for (const [key, val] of Object.entries(prim.system_text)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `) !default;\n\n`;

  // System background colors
  out += `$token-system-bg: (\n`;
  for (const [key, val] of Object.entries(prim.system_bg)) {
    out += `  '${toKebab(key)}': ${val},\n`;
  }
  out += `) !default;\n`;

  writePartial('_tokens-color.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Module: Icons
// ---------------------------------------------------------------------------

const generateIcons = () => {
  const icons = modules.icons;
  if (!icons) {
    console.log('  ⊘ No icons module in tokens, skipping.');
    return;
  }

  let out = header('icons');

  // Size scale
  out += `$token-icon-size: (\n`;
  for (const [key, val] of Object.entries(icons.size)) {
    out += `  '${key}': ${val},\n`;
  }
  out += `) !default;\n\n`;

  // Deprecated sizes (backward compat)
  if (icons.deprecated_sizes) {
    out += `$token-icon-size-deprecated: (\n`;
    for (const [key, val] of Object.entries(icons.deprecated_sizes)) {
      out += `  '${key}': ${val},\n`;
    }
    out += `) !default;\n\n`;
  }

  // Default size
  out += `$token-icon-default-size: '${icons.default_size}' !default;\n\n`;

  // Touch target
  out += `$token-icon-touch-target: ${icons.touch_target_min} !default;\n\n`;

  // Button-icon mapping
  out += `$token-icon-button-map: (\n`;
  for (const [key, val] of Object.entries(icons.button_icon_map)) {
    out += `  '${key}': '${val}',\n`;
  }
  out += `) !default;\n`;

  writePartial('_tokens-icons.generated.scss', out);
};

// ---------------------------------------------------------------------------
// Legacy: Monolithic Map (backwards-compatible)
// ---------------------------------------------------------------------------

const generateLegacy = () => {
  // For the legacy monolithic map, reconstruct the old { meta, modules } shape
  // so that existing SCSS consumers using $design-tokens map paths continue to work
  const legacyShape = isV2
    ? { meta: tokens.$meta, modules: tokens.foundation }
    : tokens;

  const content = `// AUTO-GENERATED. DO NOT EDIT DIRECTLY.\n// Source: data/design-tokens.json\n// Legacy monolithic map — prefer modular _tokens-*.generated.scss partials.\n\n$design-tokens: ${toScssMap(legacyShape)};\n`;
  fs.writeFileSync(outLegacy, content, 'utf8');
  console.log('  ✓ _design-tokens.generated.scss (legacy)');
};

// ---------------------------------------------------------------------------
// CSS Custom Properties (flat output for non-SCSS consumers)
// ---------------------------------------------------------------------------

const generateCss = () => {
  // Flatten the foundation/modules section for CSS custom properties
  const flatSource = isV2 ? tokens.foundation : modules;
  const flat = flatten(flatSource);
  const cssLines = [':root {'];
  flat.forEach(({ key, value }) => {
    cssLines.push(`  --fnd-${key}: ${value};`);
  });
  cssLines.push('}');
  fs.writeFileSync(outCss, cssLines.join('\n') + '\n', 'utf8');
  console.log('  ✓ design-tokens.css');
};

// ---------------------------------------------------------------------------
// Theme App: Generated tokens.js (v2 only)
// ---------------------------------------------------------------------------

const generateThemeApp = () => {
  if (!isV2) {
    console.log('  ⊘ Token contract v1 — skipping Theme App generator.');
    return;
  }

  const p = tokens.primitives;
  const configurator = tokens.foundation._configurator;

  if (!configurator) {
    console.log('  ⊘ No _configurator metadata in foundation — skipping Theme App generator.');
    return;
  }

  let out = `// AUTO-GENERATED from data/design-tokens.json — DO NOT EDIT DIRECTLY.\n`;
  out += `// Token Contract v${tokens.$meta.version} — Theme Configurator App Data Model\n`;
  out += `// Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;

  // 3-tier header comment
  out += `// ==========================================================================\n`;
  out += `// NEO Theme Configurator — Token Data Model (Generated)\n`;
  out += `// ==========================================================================\n`;
  out += `// 3-Tier Token System:\n`;
  out += `//   Level 1: Primitives (raw values)\n`;
  out += `//   Level 2: Semantic (intent-based)\n`;
  out += `//   Level 3: Component (usage-specific)\n`;
  out += `// ==========================================================================\n\n`;

  // ---------------------------------------------------------------------------
  // Level 1: Primitives
  // ---------------------------------------------------------------------------

  out += `// ---------------------------------------------------------------------------\n`;
  out += `// Level 1: Primitives\n`;
  out += `// ---------------------------------------------------------------------------\n\n`;

  // primitiveColors (brand palettes)
  out += `// --- Main Palettes (Brand) ---\n`;
  out += `export const primitiveColors = ${JSON.stringify(p.brand, null, 2)}\n\n`;

  // supportingPalettes
  out += `// --- Supporting Palettes ---\n`;
  out += `export const supportingPalettes = ${JSON.stringify(p.supporting, null, 2)}\n\n`;

  // foundationPalettes
  out += `// --- Foundation Palettes (Black / White Transparency) ---\n`;
  out += `export const foundationPalettes = ${JSON.stringify(p.foundation, null, 2)}\n\n`;

  // neutralPalette
  out += `// --- Neutral Palette ---\n`;
  const neutralWrapped = {
    neutral: {
      label: 'Neutral',
      base: '#7a7a7a',
      shades: p.neutral
    }
  };
  out += `export const neutralPalette = ${JSON.stringify(neutralWrapped, null, 2)}\n\n`;

  // systemPalettes
  out += `// --- System Palettes (Feedback / Status with shade scales) ---\n`;
  out += `export const systemPalettes = ${JSON.stringify(p.system, null, 2)}\n\n`;

  // ---------------------------------------------------------------------------
  // Level 2: Semantic Tokens
  // ---------------------------------------------------------------------------

  out += `// ---------------------------------------------------------------------------\n`;
  out += `// Level 2: Semantic Tokens (all 4 themes)\n`;
  out += `// ---------------------------------------------------------------------------\n\n`;

  out += `export const semanticTokenGroups = ${JSON.stringify(tokens.semantic.groups, null, 2)}\n\n`;

  out += `// Default semantic values for all 4 themes\n`;
  out += `export const semanticDefaults = ${JSON.stringify(tokens.semantic.defaults, null, 2)}\n\n`;

  // ---------------------------------------------------------------------------
  // Level 3: Component Tokens
  // ---------------------------------------------------------------------------

  out += `// ---------------------------------------------------------------------------\n`;
  out += `// Level 3: Component Tokens\n`;
  out += `// ---------------------------------------------------------------------------\n\n`;

  out += `export const componentTokenGroups = ${JSON.stringify(tokens.components.groups, null, 2)}\n\n`;

  // ---------------------------------------------------------------------------
  // Foundation non-color tokens
  // ---------------------------------------------------------------------------

  out += `// ---------------------------------------------------------------------------\n`;
  out += `// Foundation non-color tokens\n`;
  out += `// ---------------------------------------------------------------------------\n\n`;

  out += `export const foundationTokens = ${JSON.stringify(configurator, null, 2)}\n\n`;

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  out += `// ---------------------------------------------------------------------------\n`;
  out += `// Sidebar navigation tree structure\n`;
  out += `// ---------------------------------------------------------------------------\n\n`;

  out += `export const navigationTree = ${JSON.stringify(tokens.navigation, null, 2)}\n`;

  // Ensure output directory exists
  const outDir = path.dirname(outThemeApp);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outThemeApp, out, 'utf8');
  console.log(`  ✓ tokens.generated.js (Theme App)`);
};

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log(`Generating design tokens${isV2 ? ' (v2 unified contract)' : ''}...\n`);

fs.mkdirSync(settingsDir, { recursive: true });

generateSpacing();
generateTypography();
generateMotion();
generateLayout();
generateRadii();
generateBorder();
generateShadow();
generateColors();
generateIcons();
// generateLegacy() entfernt — monolithische Map wird nicht mehr konsumiert
generateCss();
generateThemeApp();

console.log('\nDone. All token files generated.');
