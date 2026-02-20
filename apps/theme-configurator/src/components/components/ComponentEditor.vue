<template>
  <div class="component-editor">
    <section class="token-section">
      <h3 class="sub-heading">
        <span class="tier-badge tier-3">L3</span>
        {{ componentData?.label || componentId }} Tokens
      </h3>
      <p class="sub-desc">Component-level tokens reference semantic (L2) tokens. Override here for theme-specific customization.</p>

      <div class="token-list">
        <div
          v-for="token in tokens"
          :key="token.id"
          :class="['token-row', { selected: selectedId === token.id }]"
          @click="selectToken(token)"
        >
          <div class="token-left">
            <!-- Color swatch for color tokens -->
            <div
              v-if="token.type === 'color'"
              class="token-swatch"
              :style="{ background: getTokenValue(token) }"
            ></div>
            <!-- Size indicator -->
            <div v-else-if="token.type === 'size'" class="token-size-indicator">
              <div class="size-bar" :style="{ width: Math.min(parseFloat(getTokenValue(token)), 60) + 'px' }"></div>
            </div>
            <!-- Shadow indicator -->
            <div v-else class="token-generic-indicator">
              <span class="indicator-text">{{ token.type }}</span>
            </div>
          </div>

          <div class="token-info">
            <span class="token-label">{{ token.label }}</span>
            <code class="token-name">--{{ token.id }}</code>
          </div>

          <div class="token-value-wrap">
            <code class="token-value">{{ getTokenValue(token) }}</code>
            <span v-if="token.ref" class="ref-badge" :title="`References --fnd-color-${token.ref}`">
              ref: {{ token.ref }}
            </span>
            <span v-if="isOverridden(token)" class="override-badge">modified</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Inline Editor -->
    <transition name="slide">
      <div v-if="selectedToken" class="inline-editor">
        <template v-if="selectedToken.type === 'color'">
          <ColorEditor
            :modelValue="getTokenValue(selectedToken)"
            @update:modelValue="updateToken(selectedToken, $event)"
            :title="selectedToken.label"
            :tokenId="selectedToken.id"
          />
        </template>
        <template v-else-if="selectedToken.type === 'size'">
          <SizeEditor
            :modelValue="getTokenValue(selectedToken)"
            @update:modelValue="updateToken(selectedToken, $event)"
            :title="selectedToken.label"
            :tokenId="selectedToken.id"
            :max="200"
          />
        </template>
        <template v-else>
          <div class="generic-editor">
            <h3 class="editor-title">{{ selectedToken.label }}</h3>
            <input
              type="text"
              class="generic-input"
              :value="getTokenValue(selectedToken)"
              @change="updateToken(selectedToken, $event.target.value)"
            />
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'
import ColorEditor from '../editors/ColorEditor.vue'
import SizeEditor from '../editors/SizeEditor.vue'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const selectedToken = ref(null)
const selectedId = computed(() => selectedToken.value?.id || null)

const componentData = computed(() => {
  return componentTokenGroups.find(c => c.id === props.componentId) || null
})

const tokens = computed(() => {
  return componentData.value?.tokens || []
})

function getTokenValue(token) {
  // Check for override first
  const override = store.currentComponentOverrides.value[token.id]
  if (override !== undefined) return override

  // If it references a semantic token, resolve it
  if (token.ref) {
    return store.currentSemanticTokens.value[token.ref] || token.default || ''
  }

  return token.default || ''
}

function isOverridden(token) {
  return store.currentComponentOverrides.value[token.id] !== undefined
}

function selectToken(token) {
  selectedToken.value = selectedToken.value?.id === token.id ? null : token
}

function updateToken(token, value) {
  store.updateComponentToken(token.id, value)
}
</script>

<style scoped>
.component-editor { display: flex; flex-direction: column; gap: 24px; }
.token-section { display: flex; flex-direction: column; gap: 16px; }

.sub-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; }

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.tier-3 { background: #fef3c7; color: #d97706; }

.token-list { display: flex; flex-direction: column; gap: 2px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
  border: 1px solid transparent;
}

.token-row:hover { background: var(--cfg-surface-elevated); }

.token-row.selected {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.token-left { flex-shrink: 0; width: 36px; }

.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
}

.token-size-indicator {
  height: 28px;
  display: flex;
  align-items: center;
}

.size-bar {
  height: 8px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 4px;
}

.token-generic-indicator {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-text { font-size: 8px; color: var(--cfg-text-muted); text-transform: uppercase; }

.token-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.token-name { font-size: 10px; color: var(--cfg-text-muted); }

.token-value-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.token-value {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}

.ref-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #dbeafe;
  color: #1d4ed8;
}

.override-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #fef3c7;
  color: #d97706;
  font-weight: 600;
}

.inline-editor {
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
}

.generic-editor { display: flex; flex-direction: column; gap: 8px; }
.editor-title { font-size: 14px; font-weight: 600; color: var(--cfg-text); margin: 0; }

.generic-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
}

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
