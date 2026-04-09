<template>
  <div class="recipe-arena" v-if="recipe">

    <!-- Pro Specimen ein Preview-Block -->
    <template v-for="specimen in recipe.specimens" :key="specimen.id">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ specimen.label }}</span>
      </div>

      <div
        class="arena-specimen ra-specimen"
        :data-specimen-id="specimen.id"
        :data-token-groups="(specimen.focusTokenGroups || []).join(',')"
      >
        <!-- Description -->
        <p v-if="specimen.description" class="ra-desc">{{ specimen.description }}</p>

        <!-- Live Component Preview -->
        <div class="ra-preview" :class="previewThemeClass">

          <!-- Matrix Layout: Grid mit Achsen-Variationen -->
          <template v-if="specimen.layout === 'grid' && specimen.layoutConfig?.rowAxis">
            <div class="ra-matrix">
              <div
                v-for="axisValue in getAxisValues(specimen.layoutConfig.rowAxis, specimen)"
                :key="axisValue"
                class="ra-matrix-row"
              >
                <span class="ra-axis-label">{{ axisValue }}</span>
                <div class="ra-live-component" v-html="renderComponent(specimen, { [specimen.layoutConfig.rowAxis]: axisValue })"></div>
              </div>
            </div>
          </template>

          <!-- Row Layout: Alle Werte nebeneinander -->
          <template v-else-if="specimen.layout === 'row' && specimen.layoutConfig?.rowAxis">
            <div class="ra-row">
              <div
                v-for="axisValue in getAxisValues(specimen.layoutConfig.rowAxis, specimen)"
                :key="axisValue"
                class="ra-live-component"
                v-html="renderComponent(specimen, { [specimen.layoutConfig.rowAxis]: axisValue })"
              ></div>
            </div>
          </template>

          <!-- Single/Default Layout -->
          <template v-else>
            <div class="ra-single">
              <div class="ra-live-component" v-html="renderComponent(specimen)"></div>
            </div>
          </template>

        </div>

        <!-- Active Axes -->
        <div class="ra-axes" v-if="getActiveAxes(specimen).length">
          <span
            v-for="axis in getActiveAxes(specimen)"
            :key="axis.name"
            class="ra-axis-pill"
          >{{ axis.name }}: {{ axis.values }}</span>
        </div>

        <!-- Focus Token Groups -->
        <div class="ra-tokens" v-if="specimen.focusTokenGroups?.length">
          <span
            v-for="tg in specimen.focusTokenGroups"
            :key="tg"
            class="ra-token-pill"
          >{{ tg }}</span>
        </div>

      </div>
    </template>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const { recipe } = useRecipeLoader(computed(() => props.componentId))

const previewThemeClass = computed(() => {
  const mode = store.state.previewMode === 'split' ? 'light' : store.state.previewMode
  return mode === 'dark' ? 'neo-dark-theme' : 'neo-light-theme'
})

const componentLabel = computed(() => {
  if (!recipe.value?.meta?.component) return props.componentId
  return recipe.value.meta.component.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

// ---------------------------------------------------------------------------
// HTML Rendering aus Recipe Anatomy
// ---------------------------------------------------------------------------

function renderComponent (specimen, axisOverrides = {}) {
  if (!recipe.value) return ''

  const anatomy = recipe.value.anatomy
  if (!anatomy?.root?.element) return `<div class="ra-fallback">${componentLabel.value}</div>`

  const rootClass = anatomy.root.element.replace('.', '')
  const axes = recipe.value.axes || {}

  // Modifier-Klassen aus Specimen-Matrix + Overrides sammeln
  const modifiers = []
  const matrixAxes = specimen.matrix?.axes || {}

  for (const [axisName, axisFilter] of Object.entries(matrixAxes)) {
    const override = axisOverrides[axisName]
    const axisObj = axes[axisName]
    if (!axisObj) continue

    // Bestimme den aktiven Wert
    let activeValues = []
    if (override) {
      activeValues = [override]
    } else if (axisFilter === '*') {
      // Bei '*' den Default nehmen
      const vals = Array.isArray(axisObj.values) ? axisObj.values : Object.values(axisObj.values || {})
      const defaultVal = vals.find(v => v.default)
      if (defaultVal?.modifier) modifiers.push(defaultVal.modifier)
      continue
    } else if (Array.isArray(axisFilter)) {
      activeValues = axisFilter.slice(0, 1) // Nur den ersten Wert
    }

    for (const val of activeValues) {
      const vals = Array.isArray(axisObj.values) ? axisObj.values : Object.entries(axisObj.values || {}).map(([k, v]) => ({ value: k, ...v }))
      const match = vals.find(v => v.value === val)
      if (match?.modifier) modifiers.push(match.modifier)
    }
  }

  const allClasses = [rootClass, ...modifiers].join(' ')

  // Slots rendern
  const slots = anatomy.slots || []
  const requiredSlots = slots.filter(s => !s.optional)
  const optionalSlots = slots.filter(s => s.optional)

  let innerHTML = ''
  const componentName = recipe.value.meta.component

  // Spezifische Rendering-Logik fuer bekannte Slot-Patterns
  for (const slot of requiredSlots) {
    const slotClass = (slot.element || '').replace('.', '')
    if (!slotClass) continue

    if (slot.name === 'label' || slot.name === 'text' || slot.name === 'title') {
      innerHTML += `<span class="${slotClass}">${componentLabel.value}</span>`
    } else if (slot.name === 'content' || slot.name === 'body') {
      innerHTML += `<div class="${slotClass}">
        <p style="margin:0">Beispielinhalt fuer ${componentLabel.value}</p>
      </div>`
    } else if (slot.name === 'trigger') {
      innerHTML += `<button class="${slotClass}" type="button">${componentLabel.value}</button>`
    } else if (slot.name === 'list') {
      innerHTML += `<div class="${slotClass}" role="tablist">
        <button class="${slotClass.replace('list', 'trigger')}" role="tab">Tab 1</button>
        <button class="${slotClass.replace('list', 'trigger')}" role="tab">Tab 2</button>
        <button class="${slotClass.replace('list', 'trigger')}" role="tab">Tab 3</button>
      </div>`
    } else if (slot.name === 'panel') {
      innerHTML += `<div class="${slotClass}" role="tabpanel">Panel-Inhalt</div>`
    } else if (slot.name === 'icon') {
      innerHTML += `<span class="${slotClass}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></span>`
    } else {
      innerHTML += `<div class="${slotClass}">${slot.name}</div>`
    }
  }

  // Fallback wenn keine Slots definiert
  if (!innerHTML) {
    innerHTML = componentLabel.value
  }

  // HTML-Element bestimmen (aus api.elements oder Standard)
  let tag = 'div'
  if (recipe.value.api?.elements?.default?.element) {
    tag = recipe.value.api.elements.default.element
  }

  // Attribute
  const attrs = []
  if (tag === 'button') attrs.push('type="button"')
  if (tag === 'a') attrs.push('href="#" onclick="event.preventDefault()"')

  return `<${tag} class="${allClasses}" ${attrs.join(' ')}>${innerHTML}</${tag}>`
}

// ---------------------------------------------------------------------------
// Axis Helpers
// ---------------------------------------------------------------------------

function getAxisValues (axisName, specimen) {
  const matrixAxes = specimen.matrix?.axes || {}
  const axisValue = matrixAxes[axisName]
  if (axisValue === '*' && recipe.value?.axes?.[axisName]?.values) {
    const vals = recipe.value.axes[axisName].values
    return Array.isArray(vals) ? vals.map(v => v.value) : Object.keys(vals)
  }
  if (Array.isArray(axisValue)) return axisValue
  return [axisValue || 'default']
}

function getActiveAxes (specimen) {
  const matrixAxes = specimen.matrix?.axes || {}
  return Object.entries(matrixAxes).map(([name, value]) => {
    let display
    if (value === '*') display = 'all'
    else if (Array.isArray(value)) display = value.join(', ')
    else display = String(value)
    return { name, values: display }
  })
}
</script>

<style>
.recipe-arena { padding: 12px; }

.ra-specimen {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1.5px solid var(--cfg-border, #e2e8f0);
  border-radius: 10px;
}

.ra-desc {
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  color: var(--cfg-text-muted, #64748b);
}

.ra-preview {
  border: 1px solid var(--cfg-border, #e2e8f0);
  border-radius: 8px;
  padding: 24px;
  overflow: hidden;
  /* Die Preview-Zone nutzt das DS Stylesheet (styles.css) */
  background: var(--fnd-color-background-base, #fff);
}

.ra-matrix {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ra-matrix-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ra-axis-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 80px;
  flex-shrink: 0;
  color: var(--fnd-color-text-tertiary, #94a3b8);
}

.ra-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.ra-single {
  display: flex;
  justify-content: center;
}

.ra-live-component {
  /* Die echte Komponente rendert hier mit DS-Styles */
}

.ra-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 16px;
  border: 1.5px dashed var(--fnd-color-border-secondary, #cbd5e1);
  border-radius: 6px;
  color: var(--fnd-color-text-secondary, #64748b);
  font-weight: 600;
  font-size: 13px;
}

.ra-axes, .ra-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ra-axis-pill {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 3px;
  white-space: nowrap;
  background: color-mix(in srgb, var(--fnd-color-interactive-default, #002049) 8%, transparent);
  color: var(--fnd-color-interactive-default, #002049);
}

.ra-token-pill {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 3px;
  white-space: nowrap;
  background: color-mix(in srgb, var(--fnd-color-feedback-success, #22c55e) 8%, transparent);
  color: var(--fnd-color-feedback-success, #22c55e);
}
</style>
