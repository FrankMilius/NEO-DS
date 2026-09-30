<template>
  <div class="template-placeholder">
    <div class="template-info">
      <h3 class="template-name">{{ templates[templateId]?.name || templateId }}</h3>
      <p class="template-desc">{{ templates[templateId]?.desc || '' }}</p>
    </div>

    <div class="template-wireframe" :style="wireframeStyle">
      <!-- Hero template -->
      <template v-if="templateId === 'hero'">
        <div class="wf-header" :style="{ background: t['background-secondary'] }">
          <div class="wf-logo" :style="{ background: t['interactive-default'] }"></div>
          <div class="wf-nav"><div class="wf-line sm" :style="lineBg"></div><div class="wf-line sm" :style="lineBg"></div></div>
        </div>
        <div class="wf-hero" :style="{ background: t['interactive-default'] }">
          <div class="wf-line lg" :style="{ background: t['text-on-interactive'] }"></div>
          <div class="wf-line md" :style="{ background: t['text-on-interactive'], opacity: 0.6 }"></div>
          <div class="wf-btn" :style="{ background: t['background-accent'] }"></div>
        </div>
      </template>

      <!-- Dashboard template -->
      <template v-else-if="templateId === 'dashboard'">
        <div class="wf-header" :style="{ background: t['background-secondary'] }">
          <div class="wf-logo" :style="{ background: t['interactive-default'] }"></div>
        </div>
        <div class="wf-dashboard-body">
          <div class="wf-sidebar" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
            <div class="wf-line sm" :style="lineBg"></div>
            <div class="wf-line sm" :style="lineBg"></div>
            <div class="wf-line sm" :style="lineBg"></div>
          </div>
          <div class="wf-main">
            <div class="wf-cards">
              <div class="wf-card" :style="cardStyle"></div>
              <div class="wf-card" :style="cardStyle"></div>
              <div class="wf-card" :style="cardStyle"></div>
            </div>
            <div class="wf-table" :style="cardStyle">
              <div class="wf-line md" :style="lineBg"></div>
              <div class="wf-line full" :style="{ ...lineBg, opacity: 0.3 }"></div>
              <div class="wf-line full" :style="{ ...lineBg, opacity: 0.3 }"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Content page -->
      <template v-else-if="templateId === 'content'">
        <div class="wf-header" :style="{ background: t['background-secondary'] }">
          <div class="wf-logo" :style="{ background: t['interactive-default'] }"></div>
        </div>
        <div class="wf-content-body">
          <div class="wf-article">
            <div class="wf-line lg" :style="lineBg"></div>
            <div class="wf-line full" :style="{ ...lineBg, opacity: 0.4 }"></div>
            <div class="wf-line full" :style="{ ...lineBg, opacity: 0.4 }"></div>
            <div class="wf-line md" :style="{ ...lineBg, opacity: 0.4 }"></div>
          </div>
          <div class="wf-aside" :style="{ background: t['layer-01'] }">
            <div class="wf-line sm" :style="lineBg"></div>
          </div>
        </div>
      </template>

      <!-- Form page -->
      <template v-else-if="templateId === 'form'">
        <div class="wf-header" :style="{ background: t['background-secondary'] }">
          <div class="wf-logo" :style="{ background: t['interactive-default'] }"></div>
        </div>
        <div class="wf-form-body">
          <div class="wf-form-card" :style="cardStyle">
            <div class="wf-line md" :style="lineBg"></div>
            <div class="wf-input" :style="{ borderColor: t['border-primary'] }"></div>
            <div class="wf-input" :style="{ borderColor: t['border-primary'] }"></div>
            <div class="wf-btn" :style="{ background: t['interactive-default'] }"></div>
          </div>
        </div>
      </template>

      <!-- Settings / Error page -->
      <template v-else>
        <div class="wf-header" :style="{ background: t['background-secondary'] }">
          <div class="wf-logo" :style="{ background: t['interactive-default'] }"></div>
        </div>
        <div class="wf-center-block">
          <div class="wf-card-big" :style="cardStyle">
            <div class="wf-line md" :style="lineBg"></div>
            <div class="wf-line sm" :style="{ ...lineBg, opacity: 0.5 }"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const props = defineProps({
  templateId: { type: String, required: true }
})

const store = useThemeStore()
const t = computed(() => store.currentSemanticTokens)

const wireframeStyle = computed(() => ({
  background: t.value['background-base'],
  color: t.value['text-primary']
}))

const lineBg = computed(() => ({
  background: t.value['text-primary']
}))

const cardStyle = computed(() => ({
  background: t.value['layer-01'],
  borderColor: t.value['border-secondary']
}))

const templates = {
  hero: { name: 'Hero Template', desc: 'Full-width hero landing page with navigation and call-to-action.' },
  dashboard: { name: 'Dashboard Template', desc: 'Multi-panel dashboard with sidebar navigation and data cards.' },
  content: { name: 'Content Page', desc: 'Article layout with main content area and aside sidebar.' },
  form: { name: 'Form Page', desc: 'Centered form layout with input fields and submit actions.' },
  settings: { name: 'Settings Page', desc: 'Settings layout with navigation tabs and configuration panels.' },
  error: { name: 'Error Page', desc: 'Error state page with centered message block.' }
}
</script>

<style scoped>
.template-placeholder { display: flex; flex-direction: column; gap: 16px; }
.template-info { display: flex; flex-direction: column; gap: 4px; }
.template-name { font-size: 16px; font-weight: 600; color: var(--cfg-text); margin: 0; }
.template-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; }

.template-wireframe {
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.wf-header {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
}

.wf-logo { width: 16px; height: 16px; border-radius: 3px; }
.wf-nav { display: flex; gap: 8px; margin-left: auto; }

.wf-line {
  height: 8px;
  border-radius: 4px;
  opacity: 0.7;
}
.wf-line.sm { width: 40px; }
.wf-line.md { width: 100px; }
.wf-line.lg { width: 160px; }
.wf-line.full { width: 100%; }

.wf-hero {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.wf-btn { width: 64px; height: 24px; border-radius: 6px; margin-top: 4px; }

.wf-dashboard-body { display: flex; flex: 1; }
.wf-sidebar { width: 100px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border-right: 1px solid; }
.wf-main { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.wf-cards { display: flex; gap: 8px; }
.wf-card { flex: 1; height: 48px; border-radius: 8px; border: 1px solid; }
.wf-table { padding: 10px; border-radius: 8px; border: 1px solid; display: flex; flex-direction: column; gap: 6px; }

.wf-content-body { display: flex; flex: 1; }
.wf-article { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.wf-aside { width: 120px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }

.wf-form-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
.wf-form-card { width: 220px; padding: 16px; border-radius: 10px; border: 1px solid; display: flex; flex-direction: column; gap: 10px; }
.wf-input { height: 24px; border: 1px solid; border-radius: 4px; }

.wf-center-block { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
.wf-card-big { width: 240px; padding: 24px; border-radius: 10px; border: 1px solid; display: flex; flex-direction: column; gap: 8px; align-items: center; }
</style>
