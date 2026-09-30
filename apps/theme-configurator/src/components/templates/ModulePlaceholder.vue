<template>
  <div class="module-placeholder">
    <div class="placeholder-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/>
      </svg>
    </div>
    <h3 class="placeholder-title">{{ titleMap[moduleId] || moduleId }}</h3>
    <p class="placeholder-desc">
      Module-level tokens inherit from foundation and component tokens.
      Customize the underlying components to affect this module's appearance.
    </p>
    <div class="module-preview" :style="previewStyle">
      <div v-if="moduleId === 'header'" class="preview-header-module">
        <div class="ph-bar" :style="{ background: tokens['background-secondary'] }">
          <div class="ph-logo" :style="{ background: tokens['interactive-default'] }"></div>
          <div class="ph-nav-items">
            <div class="ph-nav-item" :style="{ background: tokens['text-primary'] }"></div>
            <div class="ph-nav-item" :style="{ background: tokens['text-secondary'] }"></div>
            <div class="ph-nav-item" :style="{ background: tokens['text-secondary'] }"></div>
          </div>
        </div>
      </div>
      <div v-else-if="moduleId === 'sidebar'" class="preview-sidebar-module">
        <div class="ph-sidebar" :style="{ background: tokens['background-secondary'], borderColor: tokens['border-secondary'] }">
          <div class="ph-sidebar-item active" :style="{ background: tokens['interactive-default'], color: tokens['text-on-interactive'] }"></div>
          <div class="ph-sidebar-item" :style="{ background: 'transparent' }"></div>
          <div class="ph-sidebar-item" :style="{ background: 'transparent' }"></div>
          <div class="ph-sidebar-item" :style="{ background: 'transparent' }"></div>
        </div>
      </div>
      <div v-else class="preview-card-group-module">
        <div class="ph-card" :style="{ background: tokens['layer-01'], borderColor: tokens['border-secondary'] }"></div>
        <div class="ph-card" :style="{ background: tokens['layer-01'], borderColor: tokens['border-secondary'] }"></div>
        <div class="ph-card" :style="{ background: tokens['layer-01'], borderColor: tokens['border-secondary'] }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const props = defineProps({
  moduleId: { type: String, required: true }
})

const store = useThemeStore()
const tokens = computed(() => store.currentSemanticTokens)

const titleMap = {
  'header': 'Header Module',
  'sidebar': 'Sidebar Module',
  'card-group': 'Card Groups'
}

const previewStyle = computed(() => ({
  background: tokens.value['background-base'],
  color: tokens.value['text-primary']
}))
</script>

<style scoped>
.module-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.placeholder-icon { color: var(--cfg-text-muted); opacity: 0.4; }
.placeholder-title { font-size: 16px; font-weight: 600; color: var(--cfg-text); margin: 0; }
.placeholder-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; max-width: 400px; line-height: 1.5; }

.module-preview {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  border: 1px solid var(--cfg-border);
  padding: 16px;
  margin-top: 12px;
}

.ph-bar {
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 16px;
}

.ph-logo { width: 24px; height: 24px; border-radius: 4px; }
.ph-nav-items { display: flex; gap: 8px; margin-left: auto; }
.ph-nav-item { width: 40px; height: 8px; border-radius: 4px; opacity: 0.6; }

.ph-sidebar {
  width: 140px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ph-sidebar-item { height: 28px; border-radius: 6px; }

.preview-card-group-module { display: flex; gap: 12px; }
.ph-card {
  flex: 1;
  height: 80px;
  border-radius: 8px;
  border: 1px solid;
}
</style>
