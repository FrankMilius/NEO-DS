<template>
  <div class="recipe-arena" v-if="recipe">

    <!-- Pro Specimen eine Card -->
    <template v-for="specimen in recipe.specimens" :key="specimen.id">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ specimen.label }}</span>
      </div>

      <div
        class="arena-specimen ra-specimen"
        :data-specimen-id="specimen.id"
        :data-token-groups="(specimen.focusTokenGroups || []).join(',')"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <!-- Description -->
        <p class="ra-desc" :style="{ color: t['text-secondary'] }">{{ specimen.description }}</p>

        <!-- Specimen Preview -->
        <div class="ra-preview" :style="{ background: t['background-secondary'], borderColor: t['border-secondary'] }">

          <!-- Matrix Layout: Grid wenn rowAxis definiert -->
          <template v-if="specimen.layout === 'grid' && specimen.layoutConfig?.rowAxis">
            <div class="ra-matrix">
              <div
                v-for="axisValue in getAxisValues(specimen.layoutConfig.rowAxis, specimen)"
                :key="axisValue"
                class="ra-matrix-row"
              >
                <span class="ra-axis-label" :style="{ color: t['text-tertiary'] }">{{ axisValue }}</span>
                <div class="ra-component-placeholder" :style="componentPlaceholderStyle(specimen, axisValue)">
                  <span class="ra-component-name" :style="{ color: t['interactive-default'] }">{{ componentLabel }}</span>
                  <span class="ra-variant-tag" :style="tagStyle">{{ specimen.layoutConfig.rowAxis }}={{ axisValue }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Single/Row Layout -->
          <template v-else>
            <div class="ra-single">
              <div class="ra-component-placeholder ra-component-placeholder--large" :style="componentPlaceholderStyle(specimen)">
                <span class="ra-component-name" :style="{ color: t['interactive-default'] }">{{ componentLabel }}</span>
                <span class="ra-variant-tag" :style="tagStyle">{{ specimen.id }}</span>
              </div>
            </div>
          </template>

        </div>

        <!-- Active Axes -->
        <div class="ra-axes" v-if="getActiveAxes(specimen).length">
          <span
            v-for="axis in getActiveAxes(specimen)"
            :key="axis.name"
            class="ra-axis-pill"
            :style="{ background: `color-mix(in srgb, ${t['interactive-default']} 8%, transparent)`, color: t['interactive-default'] }"
          >{{ axis.name }}: {{ axis.values }}</span>
        </div>

        <!-- Focus Token Groups -->
        <div class="ra-tokens" v-if="specimen.focusTokenGroups?.length">
          <span
            v-for="tg in specimen.focusTokenGroups"
            :key="tg"
            class="ra-token-pill"
            :style="{ background: `color-mix(in srgb, ${t['feedback-success']} 8%, transparent)`, color: t['feedback-success'] }"
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

const t = computed(() => store.state.themes[store.state.activeThemeSet].light)

const componentLabel = computed(() => {
  if (!recipe.value?.meta?.component) return props.componentId
  return recipe.value.meta.component.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

const tagStyle = computed(() => ({
  background: `color-mix(in srgb, ${t.value['text-tertiary']} 10%, transparent)`,
  color: t.value['text-tertiary']
}))

function getAxisValues(axisName, specimen) {
  const matrixAxes = specimen.matrix?.axes || {}
  const axisValue = matrixAxes[axisName]
  if (axisValue === '*' && recipe.value?.axes?.[axisName]?.values) {
    return Object.keys(recipe.value.axes[axisName].values)
  }
  if (Array.isArray(axisValue)) return axisValue
  return [axisValue || 'default']
}

function getActiveAxes(specimen) {
  const matrixAxes = specimen.matrix?.axes || {}
  return Object.entries(matrixAxes).map(([name, value]) => {
    let display
    if (value === '*') display = 'all'
    else if (Array.isArray(value)) display = value.join(', ')
    else display = String(value)
    return { name, values: display }
  })
}

function componentPlaceholderStyle(specimen, variant) {
  return {
    background: t.value['background-base'],
    borderColor: `color-mix(in srgb, ${t.value['interactive-default']} 20%, transparent)`,
    color: t.value['text-primary']
  }
}
</script>

<style>
.recipe-arena { padding: 12px; }

.ra-specimen {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1.5px solid transparent;
  border-radius: 10px;
}

.ra-desc {
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.ra-preview {
  border: 1px solid;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
}

.ra-matrix {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ra-matrix-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ra-axis-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 80px;
  flex-shrink: 0;
}

.ra-component-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1.5px dashed;
  border-radius: 6px;
  min-height: 40px;
}

.ra-component-placeholder--large {
  min-height: 80px;
  flex-direction: column;
}

.ra-single {
  display: flex;
  justify-content: center;
}

.ra-component-name {
  font-size: 13px;
  font-weight: 600;
}

.ra-variant-tag {
  font-size: 9px;
  font-family: monospace;
  padding: 1px 6px;
  border-radius: 3px;
}

.ra-axes, .ra-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ra-axis-pill, .ra-token-pill {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 3px;
  white-space: nowrap;
}
</style>
