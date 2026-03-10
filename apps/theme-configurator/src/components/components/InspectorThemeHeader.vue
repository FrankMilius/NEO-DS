<template>
  <div class="inspector-theme-header">

    <!-- Segmented Control: Light / Dark / Split View -->
    <div class="theme-segmented" role="radiogroup" aria-label="Theme mode">
      <button
        :class="['seg-btn', { active: store.state.previewMode === 'light' }]"
        @click="store.setPreviewMode('light')"
        aria-label="Light mode"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
        </svg>
      </button>
      <button
        :class="['seg-btn', { active: store.state.previewMode === 'dark' }]"
        @click="store.setPreviewMode('dark')"
        aria-label="Dark mode"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      </button>
      <button
        :class="['seg-btn', { active: store.state.previewMode === 'split' }]"
        @click="store.setPreviewMode('split')"
        aria-label="Split view"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>
        </svg>
      </button>
    </div>

    <!-- Sync Geometry Toggle -->
    <label class="sync-toggle">
      <!-- Link/Unlink Icon -->
      <svg v-if="store.state.syncGeometry" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 15l6-6"/><path d="M11 6l.463-.536a5 5 0 017.071 7.072L18 13"/><path d="M13 18l-.397.534a5.068 5.068 0 01-7.127 0 4.972 4.972 0 010-7.071L6 11"/>
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 15l3-3m2-2 1-1"/><path d="M11 6l.463-.536a5 5 0 017.071 7.072"/><path d="M3 3l18 18"/><path d="M13 18l-.397.534a5.068 5.068 0 01-7.127 0 4.972 4.972 0 010-7.071"/>
      </svg>
      <span class="sync-label">Sync Geometry</span>
      <button
        :class="['sync-switch', { on: store.state.syncGeometry }]"
        role="switch"
        :aria-checked="store.state.syncGeometry"
        @click="store.setSyncGeometry(!store.state.syncGeometry)"
      >
        <span class="sync-switch__thumb"></span>
      </button>
    </label>
  </div>
</template>

<script setup>
import { useThemeStore } from '../../stores/theme.js'
const store = useThemeStore()
</script>

<style scoped>
.inspector-theme-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--cfg-border);
}

/* Segmented Control */
.theme-segmented {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--cfg-surface-elevated);
  border-radius: 10px;
  border: 1px solid var(--cfg-border);
}

.seg-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

.seg-btn:hover {
  color: var(--cfg-text);
}

.seg-btn.active {
  background: var(--cfg-surface);
  color: var(--cfg-text);
  box-shadow: var(--cfg-shadow-sm);
}

/* Sync Geometry */
.sync-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--cfg-text-secondary);
  user-select: none;
}

.sync-label {
  flex: 1;
}

.sync-switch {
  position: relative;
  width: 34px;
  height: 20px;
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  background: var(--cfg-surface-elevated);
  cursor: pointer;
  transition: all 150ms ease;
  padding: 0;
}

.sync-switch.on {
  background: var(--cfg-accent);
  border-color: var(--cfg-accent);
}

.sync-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: transform 150ms ease;
}

.sync-switch.on .sync-switch__thumb {
  transform: translateX(14px);
}
</style>
