/**
 * Recipe Utilities — Pure functions for dimension-based recipe model.
 *
 * Expands variantAxes × matrix definitions into concrete cell objects
 * that BadgeArena (and future arenas) can render generically.
 */

/**
 * Resolve axis values from a matrix entry.
 * "*" expands to all values defined on the axis.
 */
function resolveAxisValues(matrixEntry, axisId, variantAxes) {
  const entry = matrixEntry[axisId]
  if (!entry) return null // axis not in matrix
  if (entry === '*') return Object.keys(variantAxes[axisId].values)
  return entry
}

/**
 * Expand a specimen's matrix into an array of cell objects.
 *
 * Each cell contains:
 *   { id, axisValues, classes, slotConfig, renderHint }
 *
 * @param {Object} specimen   - Specimen definition with matrix, render
 * @param {Object} variantAxes - The variantAxes definition
 * @param {string[]} baseClasses - Base CSS classes for every instance
 * @returns {Object[]} Array of cell objects
 */
export function expandMatrix(specimen, variantAxes, baseClasses) {
  const axisIds = Object.keys(variantAxes)
  const matrixAxes = []

  // Determine which axes participate and their values
  for (const axisId of axisIds) {
    const values = resolveAxisValues(specimen.matrix, axisId, variantAxes)
    if (values) {
      matrixAxes.push({ axisId, values })
    }
  }

  // Build Cartesian product
  let cells = [{ axisValues: {} }]

  for (const { axisId, values } of matrixAxes) {
    const next = []
    for (const cell of cells) {
      for (const value of values) {
        // Check excludeAxes: skip if any already-set axis value excludes this axis
        const excluded = Object.entries(cell.axisValues).some(([aid, aval]) => {
          const def = variantAxes[aid]?.values?.[aval]
          return def?.excludeAxes?.includes(axisId)
        })
        // Also check if this value excludes any already-set axes (shouldn't normally happen
        // with ordered iteration, but defensive)
        if (excluded) continue

        next.push({
          axisValues: { ...cell.axisValues, [axisId]: value }
        })
      }
    }
    cells = next
  }

  // Enrich each cell with classes, slotConfig, renderHint
  return cells.map(cell => {
    const classes = [...baseClasses]
    let slotConfig = {}
    let renderHint = null

    for (const [axisId, value] of Object.entries(cell.axisValues)) {
      const valueDef = variantAxes[axisId].values[value]
      if (valueDef.modifier) classes.push(valueDef.modifier)
      if (valueDef.slotConfig) slotConfig = { ...slotConfig, ...valueDef.slotConfig }
      if (valueDef.renderHint) renderHint = valueDef.renderHint
    }

    const id = Object.values(cell.axisValues).join('-')

    return { id, axisValues: cell.axisValues, classes, slotConfig, renderHint }
  })
}

/**
 * Compute the token groups relevant to a specimen for inspector filtering.
 *
 * If the specimen has an explicit `focusTokenGroups` array, use that
 * (curated focus — e.g. "sizes" only cares about geometry + typography).
 * Otherwise compute the full union from all matrix axis values.
 *
 * @param {Object} specimen   - Specimen with matrix (and optional focusTokenGroups)
 * @param {Object} variantAxes - The variantAxes definition
 * @param {string[]} baseTokenGroups - Base token groups
 * @returns {string[]} Deduplicated token group IDs
 */
export function specimenTokenGroups(specimen, variantAxes, baseTokenGroups) {
  // Curated focus override — use when the specimen demonstrates
  // a specific subset of tokens (e.g. sizes → only geometry + typography)
  if (specimen.focusTokenGroups) {
    return [...specimen.focusTokenGroups]
  }

  const groups = new Set(baseTokenGroups)

  for (const [axisId, entry] of Object.entries(specimen.matrix)) {
    const axis = variantAxes[axisId]
    if (!axis) continue
    const values = entry === '*' ? Object.keys(axis.values) : entry
    for (const value of values) {
      const valueDef = axis.values[value]
      if (valueDef?.tokenGroups) {
        for (const tg of valueDef.tokenGroups) groups.add(tg)
      }
    }
  }

  return [...groups]
}

/**
 * Derive a single recipe object from a specific axis-value combination.
 *
 * @param {Object} variantAxes - The variantAxes definition
 * @param {string[]} baseClasses - Base CSS classes
 * @param {string[]} baseTokenGroups - Base token groups
 * @param {Object} axisValues  - e.g. { tone: "success", emphasis: "solid", size: "md" }
 * @returns {Object} Recipe-like object { id, classes, tokenGroups, params }
 */
export function deriveRecipe(variantAxes, baseClasses, baseTokenGroups, axisValues) {
  const classes = [...baseClasses]
  const tokenGroups = new Set(baseTokenGroups)

  for (const [axisId, value] of Object.entries(axisValues)) {
    const valueDef = variantAxes[axisId]?.values?.[value]
    if (!valueDef) continue
    if (valueDef.modifier) classes.push(valueDef.modifier)
    for (const tg of (valueDef.tokenGroups || [])) tokenGroups.add(tg)
  }

  return {
    id: Object.values(axisValues).join('-'),
    label: capitalize(axisValues.tone || axisValues.emphasis || Object.values(axisValues)[0]),
    classes,
    tokenGroups: [...tokenGroups],
    params: { ...axisValues }
  }
}

/**
 * Group expanded cells by a specific axis (for grid layouts).
 *
 * @param {Object[]} cells - Expanded cell array
 * @param {string} rowAxis - Axis ID to group by
 * @returns {Object[]} Array of { key, label, cells }
 */
export function groupCellsByAxis(cells, rowAxis) {
  const map = new Map()
  for (const cell of cells) {
    const key = cell.axisValues[rowAxis] || '_'
    if (!map.has(key)) {
      map.set(key, { key, label: capitalize(key), cells: [] })
    }
    map.get(key).cells.push(cell)
  }
  return [...map.values()]
}

function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
