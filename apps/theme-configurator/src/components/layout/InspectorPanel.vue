<template>
  <div class="inspector-panel">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="section-title">{{ sectionTitle }}</h2>
      <p class="section-desc">{{ sectionDesc }}</p>
    </div>

    <!-- Foundation: Colors -->
    <template v-if="activeSection === 'foundation-colors'">
      <FoundationColors />
    </template>

    <!-- Foundation: Surfaces -->
    <template v-else-if="activeSection === 'foundation-surfaces'">
      <SurfaceEditor />
    </template>

    <!-- Foundation: Radius -->
    <template v-else-if="activeSection === 'foundation-radius'">
      <FoundationGeneric category="radius" />
    </template>

    <!-- Foundation: Shadows -->
    <template v-else-if="activeSection === 'foundation-shadows'">
      <ShadowEditor />
    </template>

    <!-- Foundation: Spacing -->
    <template v-else-if="activeSection === 'foundation-spacing'">
      <FoundationGeneric category="spacing" />
    </template>

    <!-- Foundation: Typography -->
    <template v-else-if="activeSection === 'foundation-typography'">
      <TypographyEditor />
    </template>

    <!-- Foundation: Border -->
    <template v-else-if="activeSection === 'foundation-border'">
      <BorderEditor />
    </template>

    <!-- Foundation: Focus Ring -->
    <template v-else-if="activeSection === 'foundation-focus'">
      <FoundationGeneric category="focus" />
    </template>

    <!-- Foundation: Elements -->
    <template v-else-if="activeSection === 'foundation-elements'">
      <ElementsOverview />
    </template>

    <!-- Foundation: Themes -->
    <template v-else-if="activeSection === 'foundation-themes'">
      <ThemesOverview />
    </template>

    <!-- Foundation: Opacity, Z-Index & Motion -->
    <template v-else-if="activeSection === 'foundation-opacity'">
      <FoundationGeneric category="opacity" sectionLabel="Opacity" />
      <FoundationGeneric category="zindex" sectionLabel="Z-Index" />
      <FoundationGeneric category="motion" sectionLabel="Motion" />
    </template>

    <!-- Foundation: Motion (fallback) -->
    <template v-else-if="activeSection === 'foundation-motion'">
      <FoundationGeneric category="motion" />
    </template>

    <!-- Component sections -->
    <template v-else-if="activeSection.startsWith('component-')">
      <ComponentEditor :componentId="activeSection.replace('component-', '')" />
    </template>

    <!-- Module sections -->
    <template v-else-if="activeSection.startsWith('module-')">
      <ModulePlaceholder :moduleId="activeSection.replace('module-', '')" />
    </template>

    <!-- Template sections -->
    <template v-else-if="activeSection.startsWith('template-')">
      <TemplatePlaceholder :templateId="activeSection.replace('template-', '')" />
    </template>

    <template v-else>
      <div class="empty-state">
        <p>Select a section from the sidebar to begin editing.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import FoundationColors from '../foundation/FoundationColors.vue'
import SurfaceEditor from '../foundation/SurfaceEditor.vue'
import ShadowEditor from '../foundation/ShadowEditor.vue'
import TypographyEditor from '../foundation/TypographyEditor.vue'
import FoundationGeneric from '../foundation/FoundationGeneric.vue'
import BorderEditor from '../foundation/BorderEditor.vue'
import ElementsOverview from '../foundation/ElementsOverview.vue'
import ThemesOverview from '../foundation/ThemesOverview.vue'
import ComponentEditor from '../components/ComponentEditor.vue'
import ModulePlaceholder from '../templates/ModulePlaceholder.vue'
import TemplatePlaceholder from '../templates/TemplatePlaceholder.vue'

const store = useThemeStore()
const activeSection = computed(() => store.state.activeSection)

const sectionMeta = {
  'foundation-colors': { title: 'Colors', desc: 'Define primitive color palettes, then map them to semantic tokens across all themes.' },
  'foundation-surfaces': { title: 'Surfaces', desc: 'Define Surface 01 through Surface 03 for light and dark modes (Carbon layer model).' },
  'foundation-radius': { title: 'Border Radius', desc: 'Corner radius scale from sharp to pill.' },
  'foundation-shadows': { title: 'Shadows & Elevation', desc: 'Box shadow levels and semantic elevation mapping.' },
  'foundation-spacing': { title: 'Spacing', desc: 'Spacing scale based on 4px base unit. Steps 06+ are fluid.' },
  'foundation-typography': { title: 'Typography', desc: 'Font families, weight scale, and size system.' },
  'foundation-border': { title: 'Border', desc: 'Border-Width-Skala und Border-Styles.' },
  'foundation-focus': { title: 'Focus Ring', desc: 'Focus-Ring-Tokens: Farbe, Breite, Offset und Style.' },
  'foundation-elements': { title: 'Elements', desc: 'HTML-Element-Defaults: Body, Headings, Links, Buttons, Forms.' },
  'foundation-themes': { title: 'Themes', desc: '4-Theme-System: Neo Light/Dark + Customer Light/Dark.' },
  'foundation-opacity': { title: 'Opacity, Z-Index & Motion', desc: 'Opacity-Werte, Z-Index-Schichten und Motion-Tokens.' },
  'foundation-motion': { title: 'Motion', desc: 'Easing curves and duration tokens.' },
  'component-button': { title: 'Buttons', desc: 'Button geometry, colors, and variant tokens.' },
  'component-input': { title: 'Inputs', desc: 'Input field geometry, colors, and state tokens.' },
  'component-badge': { title: 'Badges', desc: 'Badge size, color, and variant tokens.' },
  'component-card': { title: 'Cards', desc: 'Card container tokens and states.' },
  'component-switch': { title: 'Switch', desc: 'Toggle switch geometry and color tokens.' },
  'component-avatar': { title: 'Avatar', desc: 'Avatar size scale and color tokens.' },
  'component-code-snippet': { title: 'Code Snippet', desc: 'Inline and block code display with syntax highlighting tokens.' },
  'component-shell': { title: 'Shell', desc: 'Shell-Layout: Linkbar, Sidebars, Footerbar und Content-Bereich.' },
  'component-dialog': { title: 'Dialog', desc: 'Modal dialog tokens.' },
  'component-tooltip': { title: 'Tooltip', desc: 'Tooltip appearance tokens.' },
  'module-header': { title: 'Header Module', desc: 'Navigation header layout and tokens.' },
  'module-sidebar': { title: 'Sidebar Module', desc: 'Sidebar navigation tokens.' },
  'module-card-group': { title: 'Card Groups', desc: 'Card group layout and grid tokens.' },
  'template-hero': { title: 'Hero Template', desc: 'Full-width hero landing page template.' },
  'template-dashboard': { title: 'Dashboard Template', desc: 'Multi-panel dashboard layout template.' },
  'template-content': { title: 'Content Page Template', desc: 'Article/content layout with sidebar.' },
  'template-form': { title: 'Form Page Template', desc: 'Multi-section form layout template.' },
  'template-settings': { title: 'Settings Page Template', desc: 'Settings page with navigation template.' },
  'template-error': { title: 'Error Page Template', desc: 'Error state page template.' }
}

const sectionTitle = computed(() => sectionMeta[activeSection.value]?.title || 'Inspector')
const sectionDesc = computed(() => sectionMeta[activeSection.value]?.desc || '')
</script>

<style scoped>
.inspector-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--cfg-bg);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--cfg-border);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0 0 4px;
}

.section-desc {
  font-size: 13px;
  color: var(--cfg-text-muted);
  margin: 0;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--cfg-text-muted);
  font-size: 14px;
}
</style>
