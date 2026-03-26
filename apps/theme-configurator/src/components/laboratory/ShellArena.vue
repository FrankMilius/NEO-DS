<template>
  <div class="shell-arena">

    <!-- Preset Tabs -->
    <div class="sa-tabs">
      <button
        v-for="p in presets"
        :key="p.id"
        :class="['sa-tab', { active: activePreset === p.id }]"
        @click="activePreset = p.id"
      >{{ p.label }}</button>
    </div>

    <!-- Active Preset Template -->
    <div
      v-for="p in presets"
      :key="p.id"
      v-show="activePreset === p.id"
      class="arena-specimen sa-template"
      :data-specimen-id="p.id"
      :data-token-groups="p.tokenGroups.join(',')"
      :style="{ borderColor: t['border-secondary'] }"
    >
      <span class="arena-specimen__label">data-layout="{{ p.id }}"</span>

      <!-- Schematic Miniature -->
      <div class="sa-preview" :style="{ background: t['background-base'], borderColor: t['border-secondary'] }">

        <!-- Linkbar -->
        <div v-if="p.zones.linkbar" class="sa-row sa-row--linkbar"
          :style="{ height: resolveToken('nc-shell-linkbar-height', '32px'), background: resolveSemantic('nc-shell-linkbar-bg', 'layer-01'), color: resolveSemantic('nc-shell-linkbar-color', 'text-secondary'), borderColor: resolveSemantic('nc-shell-linkbar-border', 'border-secondary') }">
          <span class="sa-token-tag" :style="tagStyle">linkbar {{ resolveToken('nc-shell-linkbar-height', '32px') }}</span>
        </div>

        <!-- Navbar -->
        <div class="sa-row sa-row--navbar"
          :style="{ height: resolveToken('nc-nav-height', '64px'), background: resolveSemantic('nc-nav-bg', 'background-base'), borderColor: t['border-secondary'] }">
          <div class="sa-navbar-inner">
            <span class="sa-zone-label" :style="{ color: t['text-primary'] }">Navbar</span>
            <span class="sa-token-tag" :style="tagStyle">--nc-nav-height: {{ resolveToken('nc-nav-height', '64px') }}</span>
          </div>
        </div>

        <!-- Stage -->
        <div class="sa-row sa-row--stage">

          <!-- Sidebar Left -->
          <div v-if="p.zones.sidebarLeft" class="sa-col sa-col--sidebar"
            :style="{ width: resolveToken('nc-shell-sidebar-left-width', '260px'), background: resolveSemantic('nc-shell-sidebar-bg', 'layer-01'), borderColor: resolveSemantic('nc-shell-sidebar-border', 'border-secondary') }">
            <span class="sa-zone-label" :style="{ color: t['text-tertiary'] }">Sidebar L</span>
            <span class="sa-token-tag" :style="tagStyle">{{ resolveToken('nc-shell-sidebar-left-width', '260px') }}</span>
          </div>

          <!-- Main / Content -->
          <div class="sa-col sa-col--main">
            <div v-if="p.contentMaxWidth" class="sa-content-box"
              :style="{ maxWidth: resolveToken(p.contentToken, p.contentMaxWidth), borderColor: `color-mix(in srgb, ${t['interactive-default']} 25%, transparent)`, background: `color-mix(in srgb, ${t['interactive-default']} 4%, transparent)`, margin: p.contentCentered ? '0 auto' : '0' }">
              <span class="sa-zone-label" :style="{ color: t['interactive-default'] }">Content</span>
              <span class="sa-token-tag" :style="tagStyle">{{ p.contentToken }}: {{ resolveToken(p.contentToken, p.contentMaxWidth) }}</span>
            </div>
            <div v-else class="sa-content-fill">
              <span class="sa-zone-label" :style="{ color: t['text-tertiary'] }">Content (volle Breite)</span>
            </div>
          </div>

          <!-- Sidebar Right -->
          <div v-if="p.zones.sidebarRight" class="sa-col sa-col--sidebar sa-col--sidebar-right"
            :style="{ width: resolveToken('nc-shell-sidebar-right-width', '260px'), background: resolveSemantic('nc-shell-sidebar-bg', 'layer-01'), borderColor: resolveSemantic('nc-shell-sidebar-border', 'border-secondary') }">
            <span class="sa-zone-label" :style="{ color: t['text-tertiary'] }">Sidebar R</span>
            <span class="sa-token-tag" :style="tagStyle">{{ resolveToken('nc-shell-sidebar-right-width', '260px') }}</span>
          </div>

        </div>

        <!-- Footerbar -->
        <div v-if="p.zones.footerbar" class="sa-row sa-row--footerbar"
          :style="{ height: resolveToken('nc-shell-footerbar-height', '36px'), background: resolveSemantic('nc-shell-footerbar-bg', 'layer-01'), color: resolveSemantic('nc-shell-footerbar-color', 'text-secondary'), borderColor: resolveSemantic('nc-shell-footerbar-border', 'border-secondary') }">
          <span class="sa-token-tag" :style="tagStyle">footerbar {{ resolveToken('nc-shell-footerbar-height', '36px') }}</span>
        </div>

      </div>

      <!-- Preset Description -->
      <p class="sa-desc" :style="{ color: t['text-secondary'] }">{{ p.description }}</p>

      <!-- Zone Token Overview -->
      <div class="sa-zone-tokens">
        <div v-for="zone in p.zoneTokens" :key="zone.label" class="sa-zone-token-group">
          <span class="sa-zone-token-label" :style="{ color: t['text-tertiary'] }">{{ zone.label }}</span>
          <div class="sa-zone-token-list">
            <code v-for="tok in zone.tokens" :key="tok" class="sa-zone-token-value" :style="{ color: t['interactive-default'], background: `color-mix(in srgb, ${t['interactive-default']} 6%, transparent)` }">
              --{{ tok }}: {{ resolveToken(tok, '–') }}
            </code>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'

const store = useThemeStore()
const activePreset = ref('landing')

const t = computed(() => store.state.themes[store.state.activeThemeSet].light)

// Shell-Token-Daten aus Registry
const shellData = computed(() => componentTokenGroups.find(c => c.id === 'shell') || null)
const tokenMap = computed(() => {
  if (!shellData.value) return new Map()
  return new Map(shellData.value.tokens.map(t => [t.id, t]))
})

// Navigation-Token-Daten (fuer nc-nav-height etc.)
const navData = computed(() => componentTokenGroups.find(c => c.id === 'navigation') || null)
const navTokenMap = computed(() => {
  if (!navData.value) return new Map()
  return new Map(navData.value.tokens.map(t => [t.id, t]))
})

function resolveToken(tokenId, fallback) {
  const override = store.currentComponentOverrides.value[tokenId]
  if (override !== undefined) return override
  const token = tokenMap.value.get(tokenId) || navTokenMap.value.get(tokenId)
  if (!token) return fallback
  if (token.ref) return store.currentSemanticTokens.value[token.ref] || token.default || fallback
  return token.default || fallback
}

function resolveSemantic(tokenId, semanticKey) {
  const override = store.currentComponentOverrides.value[tokenId]
  if (override !== undefined) return override
  return store.currentSemanticTokens.value[semanticKey] || t.value[semanticKey] || ''
}

const tagStyle = computed(() => ({
  color: t.value['text-tertiary'],
  background: `color-mix(in srgb, ${t.value['text-tertiary']} 8%, transparent)`
}))

// ── Presets ──
const presets = [
  {
    id: 'landing', label: 'Landing',
    description: 'Linkbar sichtbar + sticky, keine Sidebars, volle Content-Breite, Footerbar.',
    zones: { linkbar: true, sidebarLeft: false, sidebarRight: false, footerbar: true },
    contentMaxWidth: null, contentToken: null, contentCentered: false,
    tokenGroups: ['linkbar', 'footerbar', 'content', 'z-index'],
    zoneTokens: [
      { label: 'Linkbar', tokens: ['nc-shell-linkbar-height', 'nc-shell-linkbar-bg', 'nc-shell-linkbar-color'] },
      { label: 'Footerbar', tokens: ['nc-shell-footerbar-height', 'nc-shell-footerbar-bg'] },
      { label: 'Content', tokens: ['nc-shell-content-padding'] }
    ]
  },
  {
    id: 'content-page', label: 'Content Page',
    description: 'Keine Sidebars, Content zentriert (max-width 1200px), Footerbar.',
    zones: { linkbar: false, sidebarLeft: false, sidebarRight: false, footerbar: true },
    contentMaxWidth: '1200px', contentToken: 'nc-shell-content-max-width', contentCentered: true,
    tokenGroups: ['footerbar', 'content', 'z-index'],
    zoneTokens: [
      { label: 'Content', tokens: ['nc-shell-content-max-width', 'nc-shell-content-padding'] },
      { label: 'Footerbar', tokens: ['nc-shell-footerbar-height', 'nc-shell-footerbar-bg'] }
    ]
  },
  {
    id: 'docs', label: 'Docs',
    description: 'Linke Sidebar (240px) + Rechte Sidebar (200px), Footerbar.',
    zones: { linkbar: false, sidebarLeft: true, sidebarRight: true, footerbar: true },
    contentMaxWidth: null, contentToken: null, contentCentered: false,
    tokenGroups: ['sidebars', 'sidebar-density', 'footerbar', 'content', 'z-index'],
    zoneTokens: [
      { label: 'Sidebars', tokens: ['nc-shell-sidebar-left-width', 'nc-shell-sidebar-right-width', 'nc-shell-sidebar-bg'] },
      { label: 'Footerbar', tokens: ['nc-shell-footerbar-height'] },
      { label: 'Content', tokens: ['nc-shell-content-padding'] }
    ]
  },
  {
    id: 'dashboard', label: 'Dashboard',
    description: 'Linke Sidebar (260px), kein Linkbar, volle Content-Breite, Footerbar.',
    zones: { linkbar: false, sidebarLeft: true, sidebarRight: false, footerbar: true },
    contentMaxWidth: null, contentToken: null, contentCentered: false,
    tokenGroups: ['sidebars', 'sidebar-density', 'footerbar', 'content', 'z-index'],
    zoneTokens: [
      { label: 'Sidebar', tokens: ['nc-shell-sidebar-left-width', 'nc-shell-sidebar-bg'] },
      { label: 'Footerbar', tokens: ['nc-shell-footerbar-height'] },
      { label: 'Content', tokens: ['nc-shell-content-padding'] }
    ]
  },
  {
    id: 'focused', label: 'Focused',
    description: 'Minimal: kein Linkbar, keine Sidebars, kein Footerbar. Content schmal (720px), zentriert.',
    zones: { linkbar: false, sidebarLeft: false, sidebarRight: false, footerbar: false },
    contentMaxWidth: '720px', contentToken: 'nc-shell-content-narrow', contentCentered: true,
    tokenGroups: ['content'],
    zoneTokens: [
      { label: 'Content', tokens: ['nc-shell-content-narrow', 'nc-shell-content-padding'] }
    ]
  },
  {
    id: 'settings', label: 'Settings',
    description: 'Linke Sidebar (220px), Content max 960px, Footerbar.',
    zones: { linkbar: false, sidebarLeft: true, sidebarRight: false, footerbar: true },
    contentMaxWidth: '960px', contentToken: 'nc-shell-content-max-width', contentCentered: false,
    tokenGroups: ['sidebars', 'sidebar-density', 'footerbar', 'content', 'z-index'],
    zoneTokens: [
      { label: 'Sidebar', tokens: ['nc-shell-sidebar-left-width', 'nc-shell-sidebar-bg'] },
      { label: 'Content', tokens: ['nc-shell-content-max-width', 'nc-shell-content-padding'] },
      { label: 'Footerbar', tokens: ['nc-shell-footerbar-height'] }
    ]
  }
]
</script>

<style>
.shell-arena { padding: 12px; }

/* ── Tabs ── */
.sa-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  background: var(--cfg-surface);
  border-radius: 8px;
  padding: 3px;
  border: 1px solid var(--cfg-border);
}
.sa-tab {
  flex: 1;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--cfg-text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.sa-tab:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }
.sa-tab.active {
  background: var(--cfg-text);
  color: var(--cfg-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

/* ── Template Card ── */
.sa-template {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1.5px solid transparent;
  border-radius: 10px;
}

/* ── Schematic Preview ── */
.sa-preview {
  border: 1px solid;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.sa-row { display: flex; align-items: center; justify-content: center; position: relative; }
.sa-row--linkbar { border-bottom: 1px solid; font-size: 9px; }
.sa-row--navbar { border-bottom: 1px solid; }
.sa-row--stage { flex: 1; display: flex; min-height: 120px; }
.sa-row--footerbar { border-top: 1px solid; font-size: 9px; }

.sa-navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 12px;
}

.sa-col { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 8px; }
.sa-col--sidebar { border-right: 1px solid; flex-shrink: 0; min-width: 60px; max-width: 120px; }
.sa-col--sidebar-right { border-right: none; border-left: 1px solid; }
.sa-col--main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 16px; }

.sa-content-box {
  border: 1.5px dashed;
  border-radius: 6px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 80px;
}

.sa-content-fill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.sa-zone-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }

.sa-token-tag {
  font-size: 9px;
  font-family: var(--cfg-font-mono, monospace);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
}

.sa-desc { font-size: 11px; line-height: 1.5; margin: 0; }

/* ── Zone Token Overview ── */
.sa-zone-tokens {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--cfg-border);
}
.sa-zone-token-group { display: flex; flex-direction: column; gap: 3px; }
.sa-zone-token-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.sa-zone-token-list { display: flex; flex-wrap: wrap; gap: 4px; }
.sa-zone-token-value {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}
</style>
