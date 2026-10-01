// ==========================================================================
// Recipe SDK — Canonical v3.1.0
// ==========================================================================
// Single Source of Truth fuer das Recipe-Modell im NEO Design System.
//
// Konsumiert von:
//   - lint-recipes.mjs (CI-Gate)
//   - ButtonArena.vue, RecipeArena.vue (Theme Configurator)
//   - zukuenftig: Docs-Generator, Figma-Plugin
//
// Alle Funktionen sind pure (kein Seiteneffekt, kein State, kein fs/path).
// Validation-Funktionen akzeptieren Schema + Validator als Parameter,
// damit das Modul browser-sicher bleibt.
//
// @see /docs/recipes/schema.md — Canonical Form v3.1.0 Dokumentation
// @see /data/recipe-schema.json — JSON Schema Draft 2020-12
// ==========================================================================

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// 1. Loading & Normalization
// ---------------------------------------------------------------------------

/**
 * Load and normalize recipe data to canonical v3.1 shape.
 * Returns a full canonical object with all 9 sections populated.
 *
 * Handles:
 *   v3.0: variantAxes / top-level baseClasses / flat matrix
 *   v3.1: axes / styling container / nested matrix
 *   v1.x: returned as-is (legacy, not canonical)
 *
 * @param {Object} raw - Raw recipe JSON
 * @returns {Object} Canonical v3.1 recipe
 */
export function loadRecipe(raw) {
  const version = raw.meta?.schemaVersion || raw.schemaVersion || '1.0.0';
  const isV31 = version.startsWith('3.1');
  const isV30 = version.startsWith('3.0');

  if (isV31) {
    // Already canonical — ensure all sections have defaults
    return {
      meta: raw.meta,
      anatomy: raw.anatomy || { root: {}, slots: [] },
      axes: raw.axes || {},
      states: raw.states || { supported: ['default'], precedence: ['default'], rules: [] },
      a11y: normalizeA11y(raw.a11y),
      constraints: raw.constraints || {},
      styling: {
        baseClasses: raw.styling?.baseClasses || [],
        baseTokenGroups: raw.styling?.baseTokenGroups || [],
        tokenGroups: raw.styling?.tokenGroups || {}
      },
      recipes: raw.recipes || { mode: 'derived' },
      specimens: normalizeSpecimens(raw.specimens || [])
    };
  }

  if (isV30) {
    // v3.0 → v3.1 migration
    return {
      meta: raw.meta || {
        schemaVersion: '3.1.0',
        component: raw.component || 'unknown',
        version: raw.version || '1.0.0',
        status: 'stable',
        tags: [],
        links: {}
      },
      anatomy: raw.anatomy || { root: {}, slots: [] },
      axes: raw.variantAxes || raw.axes || {},
      states: raw.states || { supported: ['default'], precedence: ['default'], rules: [] },
      a11y: normalizeA11y(raw.a11y),
      constraints: raw.constraints || {},
      styling: {
        baseClasses: raw.baseClasses || [],
        baseTokenGroups: raw.baseTokenGroups || [],
        tokenGroups: raw.tokenGroups || {}
      },
      recipes: typeof raw.recipes === 'string'
        ? { mode: raw.recipes === 'derived' ? 'derived' : 'static' }
        : raw.recipes || { mode: 'derived' },
      specimens: normalizeSpecimens(raw.specimens || [])
    };
  }

  // v1.0 (legacy, e.g. card-recipes) — return as-is, not canonical
  return raw;
}

/**
 * Normalize a11y from flat (v3.0) to base+overrides (v3.1).
 */
export function normalizeA11y(a11y) {
  if (!a11y) return { base: { interactive: false }, overrides: [] };
  if (a11y.base) return a11y; // already v3.1
  // v3.0 flat → v3.1
  const { overrides, ...base } = a11y;
  return { base, overrides: overrides || [] };
}

/**
 * Normalize specimen matrices from flat to nested format.
 */
export function normalizeSpecimens(specimens) {
  return specimens.map(s => {
    if (s.matrix && !s.matrix.axes) {
      // Flat matrix → nested
      return {
        ...s,
        matrix: {
          axes: s.matrix,
          states: ['default']
        }
      };
    }
    return s;
  });
}

// ---------------------------------------------------------------------------
// 2. Structural Validation
// ---------------------------------------------------------------------------

/**
 * Validate a recipe against the v3.1 canonical schema.
 *
 * Phase 1: JSON Schema validation (if schema + validateAgainstSchema provided)
 * Phase 2: Semantic cross-field checks (always runs)
 *
 * @param {Object} recipe - Raw recipe JSON (will be normalized first)
 * @param {Object} [opts] - Optional schema/validator injection
 * @param {Object} [opts.schema] - Parsed recipe-schema.json
 * @param {Function} [opts.validateAgainstSchema] - Schema validator function
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateRecipe(recipe, opts = {}) {
  const errors = [];
  const warnings = [];
  const version = recipe.meta?.schemaVersion || recipe.schemaVersion || '1.0.0';
  const component = recipe.meta?.component || recipe.component || 'unknown';

  // Skip legacy recipes (v1.x)
  if (version.startsWith('1.')) {
    warnings.push(`[${component}] Schema v${version} ist Legacy — Migration auf v3.1 empfohlen.`);
    return { errors, warnings };
  }

  // Normalize for validation
  const normalized = loadRecipe(recipe);

  // Phase 1: JSON Schema structural validation (if schema provided)
  if (opts.schema && opts.validateAgainstSchema) {
    try {
      const schemaErrors = opts.validateAgainstSchema(normalized, opts.schema);
      for (const e of schemaErrors) {
        errors.push(`[${component}] Schema: ${e}`);
      }
    } catch (e) {
      warnings.push(`[${component}] Schema-Validierung uebersprungen: ${e.message}`);
    }
  }

  // Phase 2: Semantic cross-field checks
  validateAxes(normalized, errors, warnings, component);
  validateSpecimensCrossField(normalized, errors, warnings, component);
  validateTokenGroupRefs(normalized, errors, warnings, component);
  validateStates(normalized, errors, warnings, component);

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 3. Cross-Field Validation (internal helpers)
// ---------------------------------------------------------------------------

/**
 * Validate axis definitions.
 */
function validateAxes(recipe, errors, warnings, component) {
  const axes = recipe.axes;
  if (!axes || typeof axes !== 'object') return;

  for (const [axisId, axis] of Object.entries(axes)) {
    if (!axis.label) {
      warnings.push(`[${component}] axes.${axisId}.label fehlt`);
    }
    if (!axis.values || typeof axis.values !== 'object') {
      errors.push(`[${component}] axes.${axisId}.values fehlt oder ist kein Object`);
      continue;
    }

    let hasDefault = false;
    for (const [valueId, valueDef] of Object.entries(axis.values)) {
      if (!('modifier' in valueDef)) {
        errors.push(`[${component}] axes.${axisId}.values.${valueId}.modifier fehlt`);
      }
      if (valueDef.modifier === null) hasDefault = true;

      if (valueDef.tokenGroups !== undefined && !Array.isArray(valueDef.tokenGroups)) {
        errors.push(`[${component}] axes.${axisId}.values.${valueId}.tokenGroups muss Array sein`);
      }

      if (valueDef.tokenGroups === undefined) {
        warnings.push(`[${component}] axes.${axisId}.values.${valueId}.tokenGroups fehlt — sollte explizit [] sein`);
      }

      if (valueDef.excludeAxes) {
        for (const excl of valueDef.excludeAxes) {
          if (!axes[excl]) {
            errors.push(`[${component}] axes.${axisId}.values.${valueId}.excludeAxes referenziert unbekannte Achse "${excl}"`);
          }
        }
      }

      // Composition fields validation
      if (valueDef.wrapper) {
        if (!valueDef.wrapper.element) {
          errors.push(`[${component}] axes.${axisId}.values.${valueId}.wrapper.element fehlt — ist Pflichtfeld`);
        }
        if (valueDef.wrapper.attributes && typeof valueDef.wrapper.attributes !== 'object') {
          errors.push(`[${component}] axes.${axisId}.values.${valueId}.wrapper.attributes muss Object sein`);
        }
      }
    }

    if (!hasDefault) {
      warnings.push(`[${component}] axes.${axisId} hat keinen Default-Wert (modifier: null)`);
    }
  }
}

/**
 * Validate specimens: matrix references valid axes/values, layout consistency.
 */
function validateSpecimensCrossField(recipe, errors, warnings, component) {
  const axes = recipe.axes || {};
  const specimens = recipe.specimens || [];
  const specimenIds = new Set();

  for (const specimen of specimens) {
    if (!specimen.id) {
      errors.push(`[${component}] Specimen ohne ID gefunden`);
      continue;
    }
    if (specimenIds.has(specimen.id)) {
      errors.push(`[${component}] Doppelte Specimen-ID: "${specimen.id}"`);
    }
    specimenIds.add(specimen.id);

    const matrixAxes = specimen.matrix?.axes || specimen.matrix || {};
    for (const [axisId, values] of Object.entries(matrixAxes)) {
      if (!axes[axisId]) {
        errors.push(`[${component}] Specimen "${specimen.id}" referenziert unbekannte Achse "${axisId}"`);
        continue;
      }
      if (values === '*') continue;
      if (!Array.isArray(values)) {
        errors.push(`[${component}] Specimen "${specimen.id}" matrix.${axisId} muss Array oder "*" sein`);
        continue;
      }
      for (const v of values) {
        if (!axes[axisId].values[v]) {
          errors.push(`[${component}] Specimen "${specimen.id}" referenziert unbekannten Wert "${v}" in Achse "${axisId}"`);
        }
      }
    }

    if (specimen.layout === 'grid') {
      if (!specimen.layoutConfig?.rowAxis && !specimen.layoutConfig?.colAxis) {
        warnings.push(`[${component}] Specimen "${specimen.id}" hat layout="grid" aber kein layoutConfig.rowAxis/colAxis`);
      }
      if (specimen.layoutConfig?.rowAxis && !axes[specimen.layoutConfig.rowAxis]) {
        errors.push(`[${component}] Specimen "${specimen.id}" layoutConfig.rowAxis="${specimen.layoutConfig.rowAxis}" referenziert unbekannte Achse`);
      }
      if (specimen.layoutConfig?.colAxis && !axes[specimen.layoutConfig.colAxis]) {
        errors.push(`[${component}] Specimen "${specimen.id}" layoutConfig.colAxis="${specimen.layoutConfig.colAxis}" referenziert unbekannte Achse`);
      }
    }

    if (specimen.focusTokenGroups) {
      const allGroups = recipe.styling?.tokenGroups || {};
      for (const tg of specimen.focusTokenGroups) {
        if (!allGroups[tg]) {
          warnings.push(`[${component}] Specimen "${specimen.id}" focusTokenGroups referenziert "${tg}" — nicht in styling.tokenGroups definiert`);
        }
      }
    }

    const matrixStates = specimen.matrix?.states;
    if (matrixStates && Array.isArray(matrixStates)) {
      const supported = new Set(recipe.states?.supported || []);
      for (const entry of matrixStates) {
        // Multi-State-Kombination: ["disabled","loading"] oder einfach "loading"
        const states = Array.isArray(entry) ? entry : [entry];
        for (const s of states) {
          if (!supported.has(s)) {
            warnings.push(`[${component}] Specimen "${specimen.id}" referenziert State "${s}" — nicht in states.supported`);
          }
        }
      }
    }
  }
}

/**
 * Validate token group references.
 */
function validateTokenGroupRefs(recipe, errors, warnings, component) {
  const groups = recipe.styling?.tokenGroups || {};
  const groupIds = new Set(Object.keys(groups));
  const baseGroups = recipe.styling?.baseTokenGroups || [];

  for (const bg of baseGroups) {
    if (!groupIds.has(bg)) {
      errors.push(`[${component}] styling.baseTokenGroups referenziert "${bg}" — nicht in styling.tokenGroups definiert`);
    }
  }

  const axes = recipe.axes || {};
  for (const [axisId, axis] of Object.entries(axes)) {
    for (const [valueId, valueDef] of Object.entries(axis.values || {})) {
      for (const tg of (valueDef.tokenGroups || [])) {
        if (!groupIds.has(tg)) {
          errors.push(`[${component}] axes.${axisId}.values.${valueId}.tokenGroups referenziert "${tg}" — nicht in styling.tokenGroups definiert`);
        }
      }
    }
  }

  for (const rule of (recipe.states?.rules || [])) {
    for (const tg of (rule.tokenGroups || [])) {
      if (!groupIds.has(tg)) {
        errors.push(`[${component}] states.rules (state="${rule.state}") referenziert tokenGroup "${tg}" — nicht in styling.tokenGroups definiert`);
      }
    }
  }

  for (const [groupId, group] of Object.entries(groups)) {
    if (!group.tokens || group.tokens.length === 0) {
      if (!groupId.includes('soft')) {
        warnings.push(`[${component}] styling.tokenGroups.${groupId} hat keine Tokens`);
      }
    }
  }
}

/**
 * Validate states: precedence covers all supported, rules reference valid states.
 */
function validateStates(recipe, errors, warnings, component) {
  const states = recipe.states;
  if (!states) return;

  const supported = new Set(states.supported || []);
  const precedence = new Set(states.precedence || []);

  for (const s of supported) {
    if (!precedence.has(s)) {
      errors.push(`[${component}] State "${s}" ist in states.supported aber nicht in states.precedence`);
    }
  }

  for (const rule of (states.rules || [])) {
    if (rule.state && !supported.has(rule.state)) {
      errors.push(`[${component}] states.rules referenziert State "${rule.state}" — nicht in states.supported`);
    }
    if (rule.onlyWhen) {
      validateConditionRefs(rule.onlyWhen, recipe, errors, component, `states.rules[state="${rule.state}"].onlyWhen`);
    }
  }

  for (const override of (recipe.a11y?.overrides || [])) {
    if (override.when) {
      validateConditionRefs(override.when, recipe, errors, component, 'a11y.overrides[].when');
    }
  }

  for (const rule of (recipe.constraints?.rules || [])) {
    if (rule.when) {
      validateConditionRefs(rule.when, recipe, errors, component, 'constraints.rules[].when');
    }
  }
}

/**
 * Validate that a condition references valid axes and states.
 */
function validateConditionRefs(condition, recipe, errors, component, location) {
  const axes = recipe.axes || {};
  const supported = new Set(recipe.states?.supported || []);

  if (condition.axes) {
    for (const [axisId, values] of Object.entries(condition.axes)) {
      if (!axes[axisId]) {
        errors.push(`[${component}] ${location} referenziert unbekannte Achse "${axisId}"`);
        continue;
      }
      if (Array.isArray(values)) {
        for (const v of values) {
          if (!axes[axisId].values[v]) {
            errors.push(`[${component}] ${location} referenziert unbekannten Wert "${v}" in Achse "${axisId}"`);
          }
        }
      }
    }
  }

  if (condition.states) {
    for (const s of condition.states) {
      if (!supported.has(s)) {
        errors.push(`[${component}] ${location} referenziert unbekannten State "${s}"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Token Coverage Validation
// ---------------------------------------------------------------------------

/**
 * Check that all tokens in styling.tokenGroups exist in the token registry.
 *
 * @param {Object} recipe - Normalized recipe
 * @param {Object[]} tokenRegistry - design-tokens.json components array
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateTokenCoverage(recipe, tokenRegistry) {
  const errors = [];
  const warnings = [];
  const component = recipe.meta?.component || 'unknown';
  const groups = recipe.styling?.tokenGroups || {};

  const registryComponent = tokenRegistry.find(c => c.id === component);
  if (!registryComponent) {
    warnings.push(`[${component}] Komponente nicht in design-tokens.json gefunden`);
    return { errors, warnings };
  }

  const registryTokenIds = new Set(registryComponent.tokens.map(t => t.id));

  for (const [groupId, group] of Object.entries(groups)) {
    for (const tokenId of (group.tokens || [])) {
      if (!registryTokenIds.has(tokenId)) {
        errors.push(`[${component}] Token "${tokenId}" in styling.tokenGroups.${groupId} existiert nicht in design-tokens.json`);
      }
    }
  }

  if (registryComponent.subgroups) {
    const recipeGroupIds = new Set(Object.keys(groups));
    for (const subgroup of registryComponent.subgroups) {
      if (!recipeGroupIds.has(subgroup.id)) {
        warnings.push(`[${component}] Subgroup "${subgroup.id}" existiert in design-tokens.json aber nicht in Recipe styling.tokenGroups`);
      }
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 5. SCSS Parity Check
// ---------------------------------------------------------------------------

/**
 * Check SCSS component token declarations against design-tokens.json.
 *
 * @param {string} scssContent - Content of _component-tokens.scss
 * @param {Object} registryComponent - Component entry from design-tokens.json
 * @param {string} componentId - Component ID
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateScssParity(scssContent, registryComponent, componentId, alleKomponenten = []) {
  const errors = [];
  const warnings = [];
  const prefix = `--nc-${componentId}-`;

  // Strip SCSS comment lines before extraction to avoid false positives
  const nonCommentLines = scssContent.split('\n')
    .filter(l => !l.trim().startsWith('//'))
    .join('\n');

  // Extract SCSS declarations matching the component prefix
  const scssTokens = new Set();
  const regex = new RegExp(`(${prefix.replace(/-/g, '-')}[a-z0-9-]+)\\s*:`, 'g');
  let match;
  while ((match = regex.exec(nonCommentLines)) !== null) {
    scssTokens.add(match[1].replace(/^--/, ''));
  }

  // Also extract all --nc-* declarations for registry→SCSS check (sub-component prefixes)
  const allScssTokens = new Set();
  const allRegex = /(--(nc-[a-z0-9-]+))\s*:/g;
  while ((match = allRegex.exec(nonCommentLines)) !== null) {
    allScssTokens.add(match[2]);
  }

  const registryTokens = new Set(registryComponent.tokens.map(t => t.id));

  // Praefixe anderer Komponenten, die LAENGER sind als der eigene.
  //
  // Das Praefix --nc-badge- faengt auch --nc-badge-row-* mit ab, --nc-hero-
  // auch --nc-hero-tom-* und --nc-hero-tmob-*. Diese Token sind ordentlich
  // registriert — nur eben bei badge-row, hero-tom und hero-tmob, nicht bei
  // badge und hero. Sie hier zu melden heisst, der Elternkomponente etwas
  // vorzuwerfen, das ihr nicht gehoert.
  //
  // Am 19.08.2026 waren das 28 von 286 Fehlern: 22 bei hero (tom/tmob), 6 bei
  // badge (badge-row). Alle 28 nachgeprueft — jedes Token liegt in der Gruppe
  // seiner eigenen Komponente.
  const fremdePraefixe = alleKomponenten
    .map((k) => `nc-${k.id}-`)
    .filter((p) => p.length > `nc-${componentId}-`.length && p.startsWith(`nc-${componentId}-`));

  // SCSS→registry: only check tokens matching the component prefix
  for (const tok of scssTokens) {
    if (!registryTokens.has(tok)) {
      const hasVariant = [...registryTokens].some(rt => rt.startsWith(tok + '-'));
      if (hasVariant) continue;
      // Gehoert das Token einer spezielleren Komponente? Dann ist es dort zu
      // pruefen, nicht hier.
      if (fremdePraefixe.some((p) => tok.startsWith(p))) continue;
      errors.push(`[${componentId}] SCSS deklariert "${tok}" — fehlt in design-tokens.json`);
    }
  }

  // registry→SCSS: check against ALL --nc-* declarations (handles sub-component prefixes)
  for (const tok of registryTokens) {
    if (!allScssTokens.has(tok)) {
      errors.push(`[${componentId}] design-tokens.json hat "${tok}" — fehlt in SCSS`);
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 6. Matrix Expansion
// ---------------------------------------------------------------------------

/**
 * Extract the axis matrix from a specimen.
 */
export function getMatrixAxes(specimen) {
  return specimen.matrix?.axes || specimen.matrix || {};
}

/**
 * Expand a specimen's matrix into cell objects.
 * Low-level 3-arg version — prefer expandSpecimenMatrix() for new code.
 *
 * @param {Object} specimen - Specimen definition
 * @param {Object} axes - Axes definition
 * @param {string[]} baseClasses - Base CSS classes
 * @returns {Object[]} Array of cell objects
 */
export function expandMatrix(specimen, axes, baseClasses) {
  const axisIds = Object.keys(axes);
  const matrixDef = getMatrixAxes(specimen);
  const matrixAxes = [];

  for (const axisId of axisIds) {
    const entry = matrixDef[axisId];
    if (!entry) continue;
    const values = entry === '*' ? Object.keys(axes[axisId].values) : entry;
    matrixAxes.push({ axisId, values });
  }

  let cells = [{ axisValues: {} }];

  for (const { axisId, values } of matrixAxes) {
    const next = [];
    for (const cell of cells) {
      for (const value of values) {
        const excluded = Object.entries(cell.axisValues).some(([aid, aval]) => {
          const def = axes[aid]?.values?.[aval];
          return def?.excludeAxes?.includes(axisId);
        });
        if (excluded) continue;
        next.push({ axisValues: { ...cell.axisValues, [axisId]: value } });
      }
    }
    cells = next;
  }

  return cells.map(cell => {
    const classes = [...baseClasses];
    let slotConfig = {};
    let renderHint = null;

    for (const [axisId, value] of Object.entries(cell.axisValues)) {
      const valueDef = axes[axisId].values[value];
      if (valueDef.modifier) classes.push(valueDef.modifier);
      if (valueDef.slotConfig) slotConfig = { ...slotConfig, ...valueDef.slotConfig };
      if (valueDef.renderHint) renderHint = valueDef.renderHint;
    }

    const id = Object.values(cell.axisValues).join('-');
    return { id, axisValues: cell.axisValues, classes, slotConfig, renderHint };
  });
}

/**
 * Expand a specimen's matrix — simplified 2-arg API.
 * Includes states as an additional cross-product dimension.
 * Each cell carries resolvedState with appliedRules for debugging.
 *
 * State handling:
 *   - matrix.states missing → ["default"]
 *   - Each state entry creates cells for that state
 *   - Multi-state combos via nested array: [["loading","disabled"]]
 *   - applyStateRules merges attributes/slotConfig/tokenGroups/effects
 *
 * @param {Object} specimen - Specimen definition
 * @param {Object} recipe - Canonical v3.1 recipe (from loadRecipe)
 * @returns {Object[]} Array of cell objects with { id, axisValues, states, classes, slotConfig, renderHint, resolvedState }
 */
export function expandSpecimenMatrix(specimen, recipe) {
  const axes = recipe.axes || {};
  const baseClasses = recipe.styling?.baseClasses || [];

  // Step 1: Expand axes (existing logic)
  const axisCells = expandMatrix(specimen, axes, baseClasses);

  // Step 2: Determine states from specimen matrix
  const matrixStates = specimen.matrix?.states || ['default'];

  // Step 3: Cross-product with states + apply state rules
  const result = [];
  for (const cell of axisCells) {
    for (const stateEntry of matrixStates) {
      // Support multi-state combos: ["loading"] or [["loading","disabled"]]
      const states = Array.isArray(stateEntry) ? stateEntry : [stateEntry];
      const isDefault = states.length === 1 && states[0] === 'default';

      const stateCell = {
        ...cell,
        id: isDefault ? cell.id : `${cell.id}--${states.join('+')}`,
        states
      };

      // Apply state rules (merges attributes, slotConfig, tokenGroups, effects)
      const resolved = applyStateRules(stateCell, recipe);
      stateCell.resolvedState = resolved;

      // Merge state-level slotConfig into cell slotConfig
      if (Object.keys(resolved.slotConfig).length > 0) {
        stateCell.slotConfig = { ...stateCell.slotConfig, ...resolved.slotConfig };
      }

      result.push(stateCell);
    }
  }

  return result;
}

/**
 * Compute token groups relevant to a specimen.
 * Low-level 3-arg version.
 *
 * @param {Object} specimen - Specimen with matrix (and optional focusTokenGroups)
 * @param {Object} axes - Axes definition
 * @param {string[]} baseTokenGroups - Base token groups
 * @returns {string[]} Deduplicated token group IDs
 */
export function specimenTokenGroups(specimen, axes, baseTokenGroups, stateRules) {
  if (specimen.focusTokenGroups) return [...specimen.focusTokenGroups];

  const groups = new Set(baseTokenGroups);
  const matrixDef = getMatrixAxes(specimen);

  for (const [axisId, entry] of Object.entries(matrixDef)) {
    const axis = axes[axisId];
    if (!axis) continue;
    const values = entry === '*' ? Object.keys(axis.values) : entry;
    for (const value of values) {
      const valueDef = axis.values[value];
      if (valueDef?.tokenGroups) {
        for (const tg of valueDef.tokenGroups) groups.add(tg);
      }
    }
  }

  // Include tokenGroups from state rules matching this specimen's states
  if (stateRules) {
    const matrixStates = specimen.matrix?.states || ['default'];
    for (const stateEntry of matrixStates) {
      const states = Array.isArray(stateEntry) ? stateEntry : [stateEntry];
      for (const rule of stateRules) {
        if (states.includes(rule.state) && rule.tokenGroups) {
          for (const tg of rule.tokenGroups) groups.add(tg);
        }
      }
    }
  }

  return [...groups];
}

/**
 * Derive a single recipe from axis values.
 * Low-level 4-arg version.
 */
export function deriveRecipe(axes, baseClasses, baseTokenGroups, axisValues) {
  const classes = [...baseClasses];
  const tokenGroups = new Set(baseTokenGroups);

  for (const [axisId, value] of Object.entries(axisValues)) {
    const valueDef = axes[axisId]?.values?.[value];
    if (!valueDef) continue;
    if (valueDef.modifier) classes.push(valueDef.modifier);
    for (const tg of (valueDef.tokenGroups || [])) tokenGroups.add(tg);
  }

  return {
    id: Object.values(axisValues).join('-'),
    label: capitalize(axisValues.tone || axisValues.variant || axisValues.emphasis || Object.values(axisValues)[0]),
    classes,
    tokenGroups: [...tokenGroups],
    params: { ...axisValues }
  };
}

/**
 * Group expanded cells by a specific axis (for grid layouts).
 *
 * @param {Object[]} cells - Expanded cell array
 * @param {string} rowAxis - Axis ID to group by
 * @returns {Object[]} Array of { key, label, cells }
 */
export function groupCellsByAxis(cells, rowAxis) {
  const map = new Map();
  for (const cell of cells) {
    const key = cell.axisValues[rowAxis] || '_';
    if (!map.has(key)) {
      map.set(key, { key, label: capitalize(key), cells: [] });
    }
    map.get(key).cells.push(cell);
  }
  return [...map.values()];
}

// ---------------------------------------------------------------------------
// 7. Cell Resolution (NEW)
// ---------------------------------------------------------------------------

/**
 * Resolve CSS classes for a single cell.
 *
 * @param {Object} cell - Cell from expandMatrix/expandSpecimenMatrix
 * @param {Object} recipe - Canonical v3.1 recipe
 * @returns {string[]} CSS classes
 */
export function resolveClassList(cell, recipe) {
  const classes = [...(recipe.styling?.baseClasses || [])];
  for (const [axisId, value] of Object.entries(cell.axisValues || {})) {
    const valueDef = recipe.axes?.[axisId]?.values?.[value];
    if (valueDef?.modifier) classes.push(valueDef.modifier);
  }
  return classes;
}

/**
 * Resolve token groups for a single cell.
 *
 * @param {Object} cell - Cell from expandMatrix/expandSpecimenMatrix
 * @param {Object} recipe - Canonical v3.1 recipe
 * @returns {string[]} Token group IDs
 */
export function resolveTokenGroups(cell, recipe) {
  const groups = new Set(recipe.styling?.baseTokenGroups || []);
  for (const [axisId, value] of Object.entries(cell.axisValues || {})) {
    const valueDef = recipe.axes?.[axisId]?.values?.[value];
    for (const tg of (valueDef?.tokenGroups || [])) groups.add(tg);
  }
  return [...groups];
}

/**
 * Resolve a11y rules for a single cell.
 * Returns base a11y + only the overrides whose conditions match the cell.
 *
 * @param {Object} cell - Cell from expandMatrix/expandSpecimenMatrix
 * @param {Object} recipe - Canonical v3.1 recipe
 * @returns {{ base: Object, overrides: Object[] }}
 */
export function resolveA11y(cell, recipe) {
  const a11y = normalizeA11y(recipe.a11y);
  const matching = (a11y.overrides || []).filter(override => {
    if (!override.when) return true;
    return matchesCondition(override.when, cell.axisValues || {}, cell.states);
  });
  return { base: a11y.base || {}, overrides: matching };
}

/**
 * Check if a condition matches a set of axis values and states.
 */
function matchesCondition(when, axisValues, states) {
  if (when.axes) {
    for (const [axisId, allowedValues] of Object.entries(when.axes)) {
      const cellValue = axisValues[axisId];
      if (!cellValue) return false;
      if (Array.isArray(allowedValues) && !allowedValues.includes(cellValue)) return false;
    }
  }
  if (when.states && states) {
    for (const s of when.states) {
      if (!states.includes(s)) return false;
    }
  }
  return true;
}

/**
 * Resolve render model for a single cell.
 * Collects slotConfig, renderHint, elementHint, templateId, wrapper from axis values.
 * Last-write-wins for scalar fields; slotConfig is merged.
 *
 * @param {Object} cell - Cell from expandMatrix/expandSpecimenMatrix
 * @param {Object} recipe - Canonical v3.1 recipe
 * @returns {{ slotConfig: Object, renderHint: string|null, elementHint: string|null, templateId: string|null, wrapper: Object|null }}
 */
export function renderModel(cell, recipe) {
  let slotConfig = {};
  let renderHint = null;
  let elementHint = null;
  let templateId = null;
  let wrapper = null;

  for (const [axisId, value] of Object.entries(cell.axisValues || {})) {
    const valueDef = recipe.axes?.[axisId]?.values?.[value];
    if (!valueDef) continue;
    if (valueDef.slotConfig) slotConfig = { ...slotConfig, ...valueDef.slotConfig };
    if (valueDef.renderHint) renderHint = valueDef.renderHint;
    if (valueDef.elementHint) elementHint = valueDef.elementHint;
    if (valueDef.templateId) templateId = valueDef.templateId;
    if (valueDef.wrapper) wrapper = valueDef.wrapper;
  }

  return { slotConfig, renderHint, elementHint, templateId, wrapper };
}

// ---------------------------------------------------------------------------
// 8. State Resolution
// ---------------------------------------------------------------------------

/**
 * Apply state rules to a cell.
 * Resolves matching rules based on the cell's active states + axisValues,
 * merges attributes/slotConfig/tokenGroups/effects with precedence ordering.
 *
 * Multi-State: When a cell has multiple active states (e.g. ["loading","disabled"]),
 * rules are applied in reverse-precedence order so higher-priority states overwrite.
 *
 * @param {Object} cell - Cell with { axisValues, states }
 * @param {Object} recipe - Canonical v3.1 recipe
 * @returns {{ active: string[], appliedRules: Object[], attributes: Object, slotConfig: Object, tokenGroups: string[], effects: string[] }}
 */
export function applyStateRules(cell, recipe) {
  const states = cell.states || ['default'];
  const rules = recipe.states?.rules || [];
  const precedence = recipe.states?.precedence || [];

  // Sort active states by precedence (lower index = higher priority)
  const sorted = [...states].sort((a, b) => {
    const ai = precedence.indexOf(a);
    const bi = precedence.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Apply in reverse-precedence order (lowest priority first → highest overwrites)
  const mergeOrder = [...sorted].reverse();

  const appliedRules = [];
  let mergedAttributes = {};
  let mergedSlotConfig = {};
  const mergedTokenGroups = [];
  const mergedEffects = [];

  for (const state of mergeOrder) {
    for (const rule of rules) {
      if (rule.state !== state) continue;

      // Check onlyWhen condition against cell's axisValues + states
      if (rule.onlyWhen && !matchesCondition(rule.onlyWhen, cell.axisValues || {}, states)) {
        continue;
      }

      appliedRules.push(rule);

      if (rule.attributes) {
        mergedAttributes = { ...mergedAttributes, ...rule.attributes };
      }
      if (rule.slotConfig) {
        mergedSlotConfig = { ...mergedSlotConfig, ...rule.slotConfig };
      }
      if (rule.tokenGroups) {
        mergedTokenGroups.push(...rule.tokenGroups);
      }
      if (rule.effects) {
        mergedEffects.push(...rule.effects);
      }
    }
  }

  return {
    active: sorted,
    appliedRules,
    attributes: mergedAttributes,
    slotConfig: mergedSlotConfig,
    tokenGroups: [...new Set(mergedTokenGroups)],
    effects: [...new Set(mergedEffects)]
  };
}

// ---------------------------------------------------------------------------
// 9. Specimen Contract Validation (Negative Specimens)
// ---------------------------------------------------------------------------

/**
 * Cell-level validation rules.
 * Each rule returns a message string on violation, or null if OK.
 */
const CELL_RULES = [
  {
    id: 'A11Y_ICON_ONLY_REQUIRES_LABEL',
    severity: 'warn',
    check(cell, _specimen, recipe) {
      const model = renderModel(cell, recipe);
      if (model.renderHint !== 'icon-only') return null;
      const a11y = resolveA11y(cell, recipe);
      const hasReq = a11y.overrides.some(o => (o.require || []).includes('aria-label'));
      if (!hasReq) {
        return `Zelle "${cell.id}" ist icon-only aber hat keine a11y-Anforderung fuer aria-label`;
      }
      return null;
    }
  },
  {
    id: 'STATE_PRECEDENCE_CONFLICT',
    severity: 'warn',
    check(cell, _specimen, recipe) {
      if (!cell.states || cell.states.length < 2) return null;
      const resolved = cell.resolvedState || applyStateRules(cell, recipe);
      // Pruefen ob derselbe Effekt in mehreren State-Rules auftritt
      const effectSources = {};
      for (const rule of resolved.appliedRules) {
        for (const effect of (rule.effects || [])) {
          if (!effectSources[effect]) effectSources[effect] = [];
          effectSources[effect].push(rule.state);
        }
      }
      for (const [effect, sources] of Object.entries(effectSources)) {
        if (sources.length > 1) {
          return `Zelle "${cell.id}" hat Effekt "${effect}" aus mehreren States: ${sources.join(', ')} — Precedence-Konflikt`;
        }
      }
      return null;
    }
  },
  {
    id: 'STATE_NO_MATCHING_RULE',
    severity: 'warn',
    check(cell, _specimen, recipe) {
      if (!cell.states) return null;
      const resolved = cell.resolvedState || applyStateRules(cell, recipe);
      const rules = recipe.states?.rules || [];
      for (const state of cell.states) {
        if (state === 'default') continue;
        // Gibt es ueberhaupt eine Regel fuer diesen State?
        const hasRule = rules.some(r => r.state === state);
        if (!hasRule) continue;
        // Hat irgendeine Regel fuer diesen State gematcht?
        const matched = resolved.appliedRules.some(r => r.state === state);
        if (!matched) {
          return `Zelle "${cell.id}" hat State "${state}" aktiv, aber keine State-Rule hat gematcht (onlyWhen nicht erfuellt)`;
        }
      }
      return null;
    }
  }
];

/**
 * Validate specimen contract: run cell-level rules, verify negative specimen expectations.
 *
 * Specimen types:
 *   - "positive" (default): all cell-rule violations are real errors/warnings
 *   - "negative": must trigger expected violations (QA regression contract)
 *
 * @param {Object} recipe - Normalized v3.1 recipe
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateSpecimenContract(recipe) {
  const errors = [];
  const warnings = [];
  const component = recipe.meta?.component || 'unknown';

  for (const specimen of (recipe.specimens || [])) {
    const type = specimen.type || 'positive';

    let cells;
    try {
      cells = expandSpecimenMatrix(specimen, recipe);
    } catch (e) {
      errors.push(`[${component}] Specimen "${specimen.id}" expandSpecimenMatrix() wirft Fehler: ${e.message}`);
      continue;
    }

    // Run all cell rules
    const violations = [];
    for (const cell of cells) {
      for (const rule of CELL_RULES) {
        const msg = rule.check(cell, specimen, recipe);
        if (msg) {
          violations.push({ ruleId: rule.id, severity: rule.severity, message: msg });
        }
      }
    }

    if (type === 'positive') {
      // Positive specimens: violations are real problems
      for (const v of violations) {
        const target = v.severity === 'error' ? errors : warnings;
        target.push(`[${component}] Specimen "${specimen.id}" — ${v.ruleId}: ${v.message}`);
      }
    } else {
      // Negative specimens: verify expected violations were triggered
      const expected = specimen.expected || [];
      for (const exp of expected) {
        const found = violations.some(v =>
          v.ruleId === exp.ruleId &&
          (!exp.severity || v.severity === exp.severity) &&
          (!exp.messageContains || v.message.includes(exp.messageContains))
        );
        if (!found) {
          errors.push(`[${component}] Negative Specimen "${specimen.id}" — erwartete Verletzung "${exp.ruleId}" wurde NICHT ausgeloest`);
        }
      }
      // Unerwartete Verletzungen in Negativ-Specimens → Warnung
      for (const v of violations) {
        const isExpected = expected.some(e => e.ruleId === v.ruleId);
        if (!isExpected) {
          warnings.push(`[${component}] Negative Specimen "${specimen.id}" — unerwartete Verletzung: ${v.ruleId}: ${v.message}`);
        }
      }
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 10. Specimen Sanity
// ---------------------------------------------------------------------------

/**
 * Verify specimen expansion produces reasonable results.
 * Skips negative specimens (QA-only, may have intentionally unusual configs).
 *
 * @param {Object} recipe - Normalized recipe
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateSpecimenSanity(recipe) {
  const errors = [];
  const warnings = [];
  const component = recipe.meta?.component || 'unknown';
  const axes = recipe.axes || {};
  const baseClasses = recipe.styling?.baseClasses || [];

  for (const specimen of (recipe.specimens || [])) {
    if (specimen.type === 'negative') continue;

    try {
      const cells = expandMatrix(specimen, axes, baseClasses);

      if (cells.length === 0) {
        errors.push(`[${component}] Specimen "${specimen.id}" erzeugt 0 Zellen — Matrix ist leer oder vollstaendig ausgeschlossen`);
      }

      if (cells.length > 200) {
        warnings.push(`[${component}] Specimen "${specimen.id}" erzeugt ${cells.length} Zellen — moeglicherweise zu viele fuer Rendering`);
      }

      const ids = new Set();
      for (const cell of cells) {
        if (ids.has(cell.id)) {
          warnings.push(`[${component}] Specimen "${specimen.id}" hat doppelte Zell-ID: "${cell.id}"`);
        }
        ids.add(cell.id);
      }

      for (const cell of cells) {
        if (cell.classes.length === 0) {
          errors.push(`[${component}] Specimen "${specimen.id}" Zelle "${cell.id}" hat keine CSS-Klassen`);
        }
      }
    } catch (e) {
      errors.push(`[${component}] Specimen "${specimen.id}" expandMatrix() wirft Fehler: ${e.message}`);
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 11. Layout Composition System
// ---------------------------------------------------------------------------

/**
 * Preset-Registry fuer Layout-Primitive.
 * Maps primitive.preset IDs auf CSS Custom Properties.
 */
export const LAYOUT_PRESETS = {
  // Container Presets
  'container.standard': {
    '--nc-container-max-width': '1200px',
    '--nc-container-padding-inline': 'clamp(16px, 3.5vw, 48px)',
    '--nc-container-padding-inline-xxl': '0px',
    'classList': ['nc-container']
  },
  'container.wide': {
    '--nc-container-max-width': '1440px',
    '--nc-container-max-width-wide': '1440px',
    '--nc-container-padding-inline': 'clamp(16px, 3.5vw, 48px)',
    '--nc-container-padding-inline-xxl': '0px',
    'classList': ['nc-container', 'nc-container--wide']
  },
  'container.narrow': {
    '--nc-container-max-width': '768px',
    '--nc-container-padding-inline': 'clamp(16px, 3.5vw, 48px)',
    '--nc-container-padding-inline-xxl': '0px',
    'classList': ['nc-container', 'nc-container--narrow']
  },
  'container.full': {
    '--nc-container-max-width': '100%',
    '--nc-container-padding-inline': 'clamp(16px, 3.5vw, 48px)',
    '--nc-container-padding-inline-xxl': '0px',
    'classList': ['nc-container', 'nc-container--full']
  },

  // Grid Presets
  'grid.default': {
    '--nc-grid-columns': '12',
    '--nc-grid-gap': 'clamp(12px, 1.5vw, 24px)',
    'classList': ['o-grid']
  },
  'grid.sm-gap': {
    '--nc-grid-columns': '12',
    '--nc-grid-gap': 'var(--nc-grid-gap-sm)',
    'classList': ['o-grid', 'o-grid--gap-sm']
  },
  'grid.lg-gap': {
    '--nc-grid-columns': '12',
    '--nc-grid-gap': 'var(--nc-grid-gap-lg)',
    'classList': ['o-grid', 'o-grid--gap-lg']
  },
  'grid.auto-fit': {
    '--nc-grid-columns': '12',
    '--nc-grid-gap': 'clamp(12px, 1.5vw, 24px)',
    'classList': ['o-grid', 'o-grid--auto-fit']
  },

  // Spacing Presets (semantische Rollen)
  'spacing.section': { 'role': '--fnd-spacing-section' },
  'spacing.component': { 'role': '--fnd-spacing-component' },
  'spacing.element': { 'role': '--fnd-spacing-element' },
  'spacing.gutter': { 'role': '--fnd-spacing-gutter' },

  // Section Presets
  'section.default': {
    '--nc-section-padding-block': 'clamp(2rem, 4vw, 6rem)',
    '--nc-section-bg': 'var(--fnd-color-background-base)',
    '--nc-section-color': 'var(--fnd-color-text-primary)',
    'classList': ['section']
  },
  'section.compact': {
    '--nc-section-padding-block': 'var(--nc-section-padding-block-sm)',
    '--nc-section-bg': 'var(--fnd-color-background-base)',
    '--nc-section-color': 'var(--fnd-color-text-primary)',
    'classList': ['section', 'section--compact']
  },
  'section.spacious': {
    '--nc-section-padding-block': 'var(--nc-section-padding-block-lg)',
    '--nc-section-bg': 'var(--fnd-color-background-base)',
    '--nc-section-color': 'var(--fnd-color-text-primary)',
    'classList': ['section', 'section--spacious']
  }
};

/**
 * Load and resolve a LayoutSpec.
 * Resolves ref → preset, applies overrides, returns flat token map + classList.
 *
 * @param {Object} spec - LayoutSpec JSON
 * @param {Object} [presets] - Custom preset registry (defaults to LAYOUT_PRESETS)
 * @returns {{ tokens: Object, classList: string[], meta: Object }}
 */
export function loadLayoutSpec(spec, presets = LAYOUT_PRESETS) {
  const tokens = {};
  const classList = [];

  for (const primitive of ['container', 'grid', 'spacing', 'section']) {
    const entry = spec[primitive];
    if (!entry || !entry.ref) continue;

    const preset = presets[entry.ref];
    if (!preset) continue;

    // Merge preset tokens (skip classList key)
    for (const [key, value] of Object.entries(preset)) {
      if (key === 'classList' || key === 'role') continue;
      tokens[key] = value;
    }

    // Merge preset classList
    if (preset.classList) {
      classList.push(...preset.classList);
    }

    // Apply overrides
    if (entry.overrides) {
      for (const [key, value] of Object.entries(entry.overrides)) {
        tokens[key] = value;
      }
    }
  }

  // Add template class
  if (spec.meta?.templateClass) {
    classList.push(spec.meta.templateClass.replace(/^\./, ''));
  }

  return {
    tokens,
    classList: [...new Set(classList)],
    meta: spec.meta || {}
  };
}

/**
 * Resolve extends chain for a LayoutSpec.
 * Deep-merges parent specs, then applies the derived spec on top.
 * Detects circular references.
 *
 * @param {string} specId - LayoutSpec ID to resolve
 * @param {Object} specRegistry - Map of specId → LayoutSpec JSON
 * @param {Set} [visited] - Internal cycle detection
 * @returns {Object} Resolved LayoutSpec JSON (fully merged)
 */
export function resolveLayoutExtends(specId, specRegistry, visited = new Set()) {
  const spec = specRegistry[specId];
  if (!spec) throw new Error(`LayoutSpec "${specId}" nicht gefunden.`);

  if (visited.has(specId)) {
    throw new Error(`Zirkulaere Referenz in extends-Kette: ${[...visited, specId].join(' → ')}`);
  }
  visited.add(specId);

  const parentId = spec.meta?.extends;
  if (!parentId) return spec;

  const parent = resolveLayoutExtends(parentId, specRegistry, visited);

  // Deep-merge: parent primitives + child overrides
  const merged = { ...spec };
  for (const primitive of ['container', 'grid', 'spacing', 'section']) {
    const parentEntry = parent[primitive] || {};
    const childEntry = spec[primitive] || {};

    merged[primitive] = {
      ref: childEntry.ref || parentEntry.ref,
      overrides: {
        ...(parentEntry.overrides || {}),
        ...(childEntry.overrides || {})
      }
    };
  }

  // Meta: child overrides parent, but keep parent fields as fallback
  merged.meta = { ...parent.meta, ...spec.meta };

  return merged;
}

/**
 * Generate CSS class list from a resolved LayoutSpec.
 *
 * @param {Object} resolved - Output from loadLayoutSpec()
 * @returns {string[]} CSS classes
 */
export function layoutSpecToClassList(resolved) {
  return resolved.classList || [];
}

/**
 * Generate CSS custom property declarations from a resolved LayoutSpec.
 *
 * @param {Object} resolved - Output from loadLayoutSpec()
 * @returns {string} CSS text for style attribute or <style> block
 */
export function layoutSpecToTokens(resolved) {
  const tokens = resolved.tokens || {};
  return Object.entries(tokens)
    .filter(([key]) => key.startsWith('--'))
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}
