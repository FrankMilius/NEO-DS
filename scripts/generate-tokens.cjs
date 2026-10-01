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
      // `neutral` lag bis zum 24.08.2026 flach unter primitives. Seit die
      // Registry aus der SCSS-Quelle erzeugt wird (primitives-aus-quelle.cjs),
      // steht es als Palette in der Gruppe `system` und traegt seine Stufen
      // unter `shades`. Beide Formen lesen, damit dieser Generator die
      // Umstellung ueberlebt.
      neutral: p.neutral ?? p.system?.neutral?.shades ?? {},
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
  // Getrennte Verhaeltnisse je Viewport-Ende. `ratio` als Rueckfall, falls eine
  // aeltere Token-Datei nur den einen Wert kennt.
  out += `$token-fluid-ratio-min: ${typo.fluid.ratio_min ?? typo.fluid.ratio};\n`;
  out += `$token-fluid-ratio-max: ${typo.fluid.ratio_max ?? typo.fluid.ratio};\n\n`;

  // Feste Stufen: schlagen die Verhaeltnisrechnung. Leere Map, wenn keine gesetzt.
  out += `$token-fluid-fixed: (\n`;
  for (const [key, range] of Object.entries(typo.fluid.fixed_steps || {})) {
    out += `  '${key}': (min: ${range.min}px, max: ${range.max}px),\n`;
  }
  out += `);\n\n`;

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

  // Container-Query-Schwellen als SCSS-Map — @container-Bedingungen koennen
  // keine CSS-Variablen nutzen, daher muessen die Werte zur Build-Zeit als
  // Sass-Werte vorliegen (gleiche Quelle wie die --fnd-* CSS-Variablen).
  if (layout.container_query) {
    out += `\n$token-container-query: (\n`;
    for (const [comp, thresholds] of Object.entries(layout.container_query)) {
      for (const [name, val] of Object.entries(thresholds)) {
        out += `  '${toKebab(comp)}-${toKebab(name)}': ${val},\n`;
      }
    }
    out += `) !default;\n`;
  }

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
// Konfigurator: Bruecke zwischen Oberflaechen-Struktur und echten CSS-Namen
// ---------------------------------------------------------------------------
//
// foundation._configurator beschreibt die BEDIENOBERFLAECHE des Theme-
// Konfigurators. Sie ist von Hand gepflegt und kannte bisher die kanonischen
// CSS-Variablennamen NICHT — der Export schrieb deshalb den Rohschluessel
// heraus (`--base: xs` statt `--fnd-elevation-base: var(--fnd-shadow-xs)`).
//
// Diese Funktion stellt die Verbindung her: sie sucht zu jedem Oberflaechen-
// Token den passenden Eintrag in der ECHTEN, flach gemachten Foundation und
// haengt ihn als `cssVar` an. Findet sie keinen, bleibt `cssVar` null — der
// Export ueberspringt solche Tokens dann bewusst, statt Unbrauchbares zu
// erzeugen.
//
// Zusaetzlich wird `maps_to` aufgeloest: bei Elevation ist der Wert ("xs") ein
// VERWEIS in die Schattenskala, kein Wert. Bisher las den Verweis niemand.
const bruecke = (configurator, bekannt) => {
  const bericht = { verbunden: 0, ohne: [] };

  // Feste Zuordnungen fuer Tokens, die es im DS GIBT, dort aber anders heissen.
  // Ohne diese Tabelle wuerden sie als "ohne Entsprechung" gelten und der
  // naheliegende Reflex waere, sie ins DS aufzunehmen — das erzeugt Dubletten
  // und damit genau die Drift, die wir gerade beseitigen.
  const ALIAS = {
    'typography.font-body':      'font-body',
    'typography.font-heading':   'font-heading',
    'typography.font-mono':      'font-mono',
    'typography.weight-light':     'fnd-font-weight-light',
    'typography.weight-regular':   'fnd-font-weight-regular',
    'typography.weight-medium':    'fnd-font-weight-medium',
    'typography.weight-semibold':  'fnd-font-weight-semibold',
    'typography.weight-bold':      'fnd-font-weight-bold',
    'typography.weight-black':     'fnd-font-weight-black',
    // Rollen-Staerken, seit 2.4 (30.09.2026) im Konfigurator
    'typography.weight-heading':         'fnd-font-weight-heading',
    'typography.weight-heading-strong':  'fnd-font-weight-heading-strong',
    'typography.weight-body':            'fnd-font-weight-body',
    'typography.weight-mono':            'fnd-font-weight-mono',
    'motion.duration-quick':     'fnd-motion-duration-200',  // 0.2s
    'motion.duration-base':      'fnd-motion-duration-300',  // 0.3s
    'motion.duration-slow':      'fnd-motion-duration-450',  // 0.45s
    'focus.color':               'fnd-focus-ring-color',
    'focus.width':               'fnd-focus-ring-width',
    'focus.style':               'fnd-focus-ring-style',
    // Easing heisst im gebauten CSS --fnd-motion-ease-*, der JSON-Pfad
    // motion.easing-* traf vorher nur die Pfadnamen aus design-tokens.css,
    // die keine Komponente liest (Befund 29.09.2026).
    'motion.easing-informative': 'fnd-motion-ease-informative',
    'motion.easing-focused':     'fnd-motion-ease-focused',
    'motion.easing-expressive':  'fnd-motion-ease-expressive',
    // z-index liegt im DS strukturell unter layout, die Oberflaeche nennt es
    // zindex. Aufgenommen am 2026-08-12 (Entscheidung 5). Das gebaute CSS
    // nennt die Stufen --fnd-z-* (korrigiert 29.09.2026).
    'zindex.base':           'fnd-z-base',
    'zindex.dropdown':       'fnd-z-dropdown',
    'zindex.sticky':         'fnd-z-sticky',
    'zindex.fixed':          'fnd-z-fixed',
    'zindex.modal-backdrop': 'fnd-z-modal-backdrop',
    'zindex.modal':          'fnd-z-modal',
    'zindex.tooltip':        'fnd-z-tooltip',
  };

  const kandidaten = (kat, key) => [
    ...(kat === 'zindex' ? [`z-${key}`] : []), // --fnd-z-* (eine Skala seit 29.09.2026)
    `${kat}-${key}`,          // radius-md, spacing-06, elevation-base, border-width-sm
    `${kat}-levels-${key}`,   // shadow-levels-xs
    `${kat}-scale-${key}`,    // radii-scale-md
    `${kat}-ratio-${key}`,    // media-ratio-1-1
    key,                      // bereits vollstaendig
  ];

  for (const [kat, daten] of Object.entries(configurator)) {
    if (!daten || !daten.tokens) continue;
    for (const [key, token] of Object.entries(daten.tokens)) {
      // Alias hat Vorrang: er zeigt auf den Namen, den die Komponenten benutzen.
      const alias = ALIAS[`${kat}.${key}`];
      // Ein Alias zaehlt nur, wenn es den Namen im gebauten CSS wirklich gibt.
      // Vorher wurde er ungeprueft uebernommen und exportierte tote Namen.
      const aliasOk = alias && (bekannt.has(alias.replace(/^fnd-/, '')) || !alias.startsWith('fnd-'));
      const treffer = aliasOk ? alias : kandidaten(toKebab(kat), toKebab(key)).find((k) => bekannt.has(k));
      // Alias-Namen sind bereits vollstaendig (mit oder ohne fnd-Praefix).
      token.cssVar = treffer
        ? (aliasOk ? `--${treffer}` : `--fnd-${treffer}`)
        : null;
      if (alias && !bekannt.has(treffer.replace(/^fnd-/, ''))) {
        // Nur pruefen, nicht abbrechen: der Alias kann auch ausserhalb der
        // --fnd-* Familie liegen (z.B. --font-body).
      }
      if (treffer) bericht.verbunden++;
      else bericht.ohne.push(`${kat}.${key}`);

      // Verweis aufloesen: bei Elevation ist der Wert ein SCHLUESSEL der
      // Zielskala ("xs"), kein Wert. Ohne das schreibt der Export `xs` heraus.
      if (token.maps_to) {
        const ziel = [`${toKebab(token.maps_to)}-${toKebab(String(token.value))}`,
                      `${toKebab(token.maps_to)}-levels-${toKebab(String(token.value))}`]
          .find((k) => bekannt.has(k));
        if (ziel) token.resolved_value = `var(--fnd-${ziel})`;
      }
    }
  }
  return bericht;
};

/** Alle --fnd-* Namen, die es TATSAECHLICH gibt.
 *
 *  Wichtig: es existieren zwei Ebenen. Der Generator schreibt die flachen
 *  JSON-Pfade (--fnd-radii-scale-md), das SCSS definiert daneben die
 *  Kurzformen (--fnd-radius-md) — und die Komponenten benutzen die Kurzformen.
 *  Gegen die JSON-Struktur allein zu pruefen, verband nur 32 von 91 Tokens. */
const bekannteNamen = () => {
  const namen = new Set();
  const sammle = (text) => {
    for (const m of text.matchAll(/--fnd-([a-z0-9-]+)\s*:/g)) namen.add(m[1]);
  };
  // Das GEBAUTE CSS ist die einzige verlaessliche Quelle. Im SCSS entstehen
  // viele Namen erst durch Interpolation (--fnd-radius-#{$size}) und sind als
  // Literal gar nicht vorhanden — ein Quelltext-Scan fand sie deshalb nicht.
  //
  // NUR styles.css: design-tokens.css enthaelt die JSON-Pfadnamen
  // (--fnd-radii-scale-md), die keine Komponente liest. Zaehlte sie mit,
  // galten tote Namen als bekannt. Fehlt styles.css, bricht der Lauf ab,
  // statt still 22 x cssVar:null zu schreiben (Befund 29.09.2026).
  const gebaut = path.join(__dirname, '..', 'styles.css');
  try { sammle(fs.readFileSync(gebaut, 'utf8')); } catch (e) { /* fehlt */ }
  if (!namen.size) {
    console.error('  ✗ styles.css fehlt oder ist leer — erst `npm run build:css`, dann `npm run tokens`.');
    process.exit(1);
  }
  return namen;
};

// ---------------------------------------------------------------------------
// CSS Custom Properties (flat output for non-SCSS consumers)
// ---------------------------------------------------------------------------

// Objekt ohne _-Schluessel (Notizen, _configurator), rekursiv; Listen bleiben
// Listen. `auch` nennt zusaetzliche Schluessel der obersten Ebene zum Weglassen.
const ohneUnterstrich = (obj, auch = []) => {
  if (Array.isArray(obj)) return obj.map((v) => ohneUnterstrich(v));
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(Object.entries(obj)
    .filter(([k]) => !k.startsWith('_') && !auch.includes(k))
    .map(([k, v]) => [k, ohneUnterstrich(v)]));
};

const generateCss = () => {
  // Flatten the foundation/modules section for CSS custom properties
  // Nicht als Custom Properties: praesentation (Folien-Grammatik mit Verweisen
  // und Listen, geht als Objekt nach tokens.generated.js), _configurator
  // (Oberflaechentexte der App) und alle _-Schluessel (Notizen). Vorher
  // standen hier ~470 ungueltige Zeilen (Notizen und rohe Verweise als Werte).
  const flatSource = ohneUnterstrich(isV2 ? tokens.foundation : modules, ['praesentation']);
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
      // Seit 24.08.2026 steht neutral unter primitives.system (wie in
      // getColorPrimitives oben). Hier stand noch p.neutral: die Stufen fielen
      // still weg, IconsEditor, FocusRingEditor und ComponentEditor brachen mit
      // "Cannot convert undefined or null to object" ab (Befund 30.09.2026).
      shades: p.neutral ?? p.system?.neutral?.shades ?? {}
    }
  };
  out += `export const neutralPalette = ${JSON.stringify(neutralWrapped, null, 2)}\n\n`;

  // paperLadders + papers — die Leitern des Markenbuchs (Kapitel 04.2) und die
  // Zuordnung Bereich → Papier. Seit dem 09.09.2026 (Papiersystem, Phase 3).
  // Quelle der Leitern ist _neutral-ramps.scss, die JSON wird daraus geschrieben.
  out += `// --- Leitern (Markenbuch 04.2): sechs Papiere, zwei Reserveleitern, Forest, Lime ---\n`;
  out += `export const paperLadders = ${JSON.stringify(p.neutralleitern ?? {}, null, 2)}\n\n`;
  out += `// --- Papiere: Bereich, Charakter, Kanaele je Papier ---\n`;
  out += `export const papers = ${JSON.stringify(tokens.foundation?.praesentation?.papiere ?? {}, null, 2)}\n\n`;
  // praesentation — Folien-Grammatik (Raster, Zonen, Dichtestufen, Status,
  // Diagramm, Gruenfamilie, Welten) ohne Notizen. Farben bleiben Verweise
  // "palette.stufe"; die App loest sie in utils/praes-ref.js auf (Plan v2, 2.5).
  out += `// --- Praesentation: Folien-Grammatik (Bereich Praesentation) ---\n`;
  out += `export const praesentation = ${JSON.stringify(ohneUnterstrich(tokens.foundation?.praesentation ?? {}), null, 2)}\n\n`;

  // typographyScale — die fluide Schriftskala (Plan v2, 2.3 · 30.09.2026).
  // Parameter wie in _typography.scss: Stufe = Basis × Verhaeltnis^Schritt,
  // getrennt fuer Viewport-Minimum und -Maximum; feste Werte fuer die kleinen
  // Stufen, Boden 12 px ($type-min-floor). Die App rechnet damit dieselben
  // --fs-* wie das SCSS (Test: tests/utils/fluid-scale.test.js).
  const T = tokens.foundation?.typography ?? {};
  const skala = {
    fluid: {
      viewport_min: T.fluid?.viewport_min, viewport_max: T.fluid?.viewport_max,
      base_min_px: T.fluid?.base_min_px, base_max_px: T.fluid?.base_max_px,
      ratio_min: T.fluid?.ratio_min, ratio_max: T.fluid?.ratio_max,
      fixed_steps: T.fluid?.fixed_steps ?? {},
    },
    floor_px: 12,
    semantic_steps: T.semantic_steps ?? {},
    semantic_sizes_px: T.semantic_sizes_px ?? {},
    line_height: T.line_height ?? {},
    mappings: T.fluid_mappings ?? {},
    roles: { display: T.display ?? {}, heading: T.heading ?? {}, paragraph: T.paragraph ?? {} },
    tracking: tokens.foundation?.tracking ?? {},
  };
  out += `// --- Fluide Schriftskala (Typografie-Editor) ---\n`;
  out += `export const typographyScale = ${JSON.stringify(skala, null, 2)}\n\n`;

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

  // Kanonische CSS-Namen anhaengen, bevor die Datei geschrieben wird.
  const bericht = bruecke(configurator, bekannteNamen());
  console.log(`  ↳ Konfigurator-Bruecke: ${bericht.verbunden} Tokens verbunden, ${bericht.ohne.length} ohne CSS-Entsprechung`);
  if (bericht.ohne.length) {
    console.error(`     ohne: ${bericht.ohne.join(', ')}`);
    // Ohne CSS-Entsprechung exportiert die Konfig-App nichts oder Falsches.
    // Das ist ein Fehler, keine Warnung.
    process.exitCode = 1;
  }

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

  generateThemeAppTypes(out);
};

// ---------------------------------------------------------------------------
// Typen fuer tokens.generated.js (Plan v2, 3.2)
// ---------------------------------------------------------------------------
// Schreibt tokens.generated.d.ts daneben: die Struktur jedes Exports, aus
// den Daten abgeleitet (Arrays: Elemente zusammengefuehrt, Schluessel, die
// nicht in jedem Element vorkommen, sind optional) plus Namenslisten
// (ThemeKey, SemanticTokenId, ComponentGroupId). TypeScript nimmt die
// .d.ts automatisch fuer Importe von './tokens.generated.js'.
// Ohne Datumszeile — sonst waere jeder Tag eine Abweichung.

const outThemeAppTypes = outThemeApp.replace(/\.js$/, '.d.ts');

function tsSchluessel(k) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

// Typ fuer alle Werte an derselben Stelle (z. B. alle Elemente eines Arrays)
function tsTyp(werte, tiefe) {
  const teile = [];
  const einr = '  '.repeat(tiefe);
  const prim = new Set();
  const arrays = [];
  const objekte = [];
  for (const w of werte) {
    if (w === null) prim.add('null');
    else if (Array.isArray(w)) arrays.push(w);
    else if (typeof w === 'object') objekte.push(w);
    else prim.add(typeof w);
  }
  for (const t of ['string', 'number', 'boolean', 'null']) if (prim.has(t)) teile.push(t);
  if (arrays.length) {
    const elemente = arrays.flat();
    const el = elemente.length ? tsTyp(elemente, tiefe) : 'unknown';
    teile.push(el.includes(' | ') ? `Array<${el}>` : `${el}[]`);
  }
  if (objekte.length) {
    const schluessel = [];
    for (const o of objekte) for (const k of Object.keys(o)) if (!schluessel.includes(k)) schluessel.push(k);
    if (!schluessel.length) teile.push('Record<string, never>');
    else {
      const zeilen = schluessel.map((k) => {
        const da = objekte.filter(o => k in o);
        const opt = da.length < objekte.length ? '?' : '';
        return `${einr}  ${tsSchluessel(k)}${opt}: ${tsTyp(da.map(o => o[k]), tiefe + 1)}`;
      });
      teile.push(`{\n${zeilen.join('\n')}\n${einr}}`);
    }
  }
  return teile.join(' | ') || 'unknown';
}

function tsUnion(namen) {
  const liste = [...new Set(namen)].filter(n => typeof n === 'string');
  return liste.length ? liste.map(n => `  | ${JSON.stringify(n)}`).join('\n') : '  never';
}

const generateThemeAppTypes = (jsQuelle) => {
  // Das Generat besteht nur aus `export const NAME = <JSON>` — direkt auswerten.
  const exporte = {};
  new Function('exporte', jsQuelle.replace(/^export const (\w+) = /gm, 'exporte.$1 = '))(exporte);

  let d = '';
  d += `// AUTO-GENERATED by scripts/generate-tokens.cjs — DO NOT EDIT DIRECTLY.\n`;
  d += `// Typen zu tokens.generated.js (aus den Daten abgeleitet). Neu erzeugen: npm run tokens\n\n`;

  d += `/** Theme-Schluessel in semanticDefaults */\n`;
  d += `export type ThemeKey =\n${tsUnion(Object.keys(exporte.semanticDefaults || {}))}\n\n`;
  d += `/** IDs der semantischen Tokens (semanticTokenGroups[].tokens[].id) */\n`;
  d += `export type SemanticTokenId =\n${tsUnion((exporte.semanticTokenGroups || []).flatMap(g => (g.tokens || []).map(t => t.id)))}\n\n`;
  d += `/** IDs der Komponenten-Gruppen (componentTokenGroups[].id) */\n`;
  d += `export type ComponentGroupId =\n${tsUnion((exporte.componentTokenGroups || []).map(g => g.id))}\n\n`;

  for (const [name, wert] of Object.entries(exporte)) {
    d += `export declare const ${name}: ${tsTyp([wert], 0)}\n\n`;
  }

  fs.writeFileSync(outThemeAppTypes, d.replace(/\n+$/, '\n'), 'utf8');
  console.log(`  ✓ tokens.generated.d.ts (Typen, ${Object.keys(exporte).length} Exporte)`);
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
