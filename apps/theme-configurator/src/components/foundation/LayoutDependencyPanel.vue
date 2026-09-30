<template>
  <div class="ldp" v-if="relation">

    <!-- ═══════════════════════════════════════════════════════════════
         CASCADE VISUALIZATION
         ═══════════════════════════════════════════════════════════════ -->
    <div class="ldp-cascade">
      <div class="ldp-cascade-label">Layout Cascade</div>
      <div class="ldp-cascade-chain">
        <template v-for="(node, idx) in cascadeChain" :key="node.id">
          <button
            class="ldp-cascade-node"
            :class="{ 'ldp-cascade-node--active': node.isActive, 'ldp-cascade-node--linked': !node.isActive }"
            @click="!node.isActive && navigateTo(`component-${node.id}`)"
            :title="node.isActive ? 'Aktuelle Komponente' : `Zu ${node.label} wechseln`"
          >
            <span class="ldp-cascade-icon">
              <svg v-if="node.id === 'section'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
              <svg v-else-if="node.id === 'container'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </span>
            <span class="ldp-cascade-name">{{ node.label }}</span>
            <span class="ldp-cascade-count">{{ node.tokenCount }}</span>
          </button>
          <svg v-if="idx < cascadeChain.length - 1" class="ldp-cascade-arrow" width="16" height="12" viewBox="0 0 16 12">
            <path d="M2 6h10M9 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
          </svg>
        </template>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         CONFLICT WARNINGS
         ═══════════════════════════════════════════════════════════════ -->
    <div v-if="relevantConflicts.length" class="ldp-conflicts">
      <div
        v-for="conflict in relevantConflicts"
        :key="conflict.id"
        class="ldp-conflict"
        :class="`ldp-conflict--${conflict.severity}`"
      >
        <div class="ldp-conflict-header">
          <svg v-if="conflict.severity === 'warning'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <span class="ldp-conflict-label">{{ conflict.label }}</span>
        </div>
        <p class="ldp-conflict-msg">{{ conflict.message }}</p>
        <div v-if="conflict.suggestion" class="ldp-conflict-suggestion">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          {{ conflict.suggestion }}
        </div>
        <div class="ldp-conflict-tokens">
          <code v-for="tok in conflict.affected" :key="tok" class="ldp-conflict-token">--{{ tok }}</code>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SMART LINKS
         ═══════════════════════════════════════════════════════════════ -->
    <div v-if="smartLinks.length" class="ldp-links">
      <div class="ldp-links-label">Verknuepfte Tokens</div>
      <button
        v-for="link in smartLinks"
        :key="link.targetToken"
        type="button"
        class="ldp-link cfg-knopf-reset"
        @click="navigateTo(link.section)"
      >
        <span class="ldp-link-header">
          <span class="ldp-link-target">{{ link.targetLabel }}</span>
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <code class="ldp-link-token">--{{ link.targetToken }}</code>
          <span v-if="link.isOverridden" class="ldp-link-modified">modified</span>
        </span>
        <span class="ldp-link-value">
          <span class="ldp-link-current">{{ link.currentValue }}</span>
        </span>
        <span class="ldp-link-reason">{{ link.reason }}</span>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         CONTEXTUAL NOTES
         ═══════════════════════════════════════════════════════════════ -->
    <div v-if="contextualNotes.length" class="ldp-notes">
      <div
        v-for="(note, idx) in contextualNotes"
        :key="idx"
        class="ldp-note"
        :class="`ldp-note--${note.type}`"
      >
        <svg v-if="note.type === 'warning'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span>{{ note.text }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useLayoutDependencies } from '../../composables/useLayoutDependencies.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const {
  relation,
  relevantConflicts,
  smartLinks,
  cascadeChain,
  contextualNotes,
  navigateTo
} = useLayoutDependencies(props.componentId)
</script>

<style scoped>
.ldp {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-03);
}

/* ═══════════════════════════════════════════════════════
   Cascade Chain
   ═══════════════════════════════════════════════════════ */
.ldp-cascade {
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-m);
  padding: var(--fnd-spacing-03);
}

.ldp-cascade-label {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
  margin-bottom: var(--fnd-spacing-02);
}

.ldp-cascade-chain {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-01);
}

.ldp-cascade-node {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-01);
  padding: var(--fnd-spacing-01) var(--fnd-spacing-02);
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-s);
  background: transparent;
  cursor: default;
  font-size: var(--fnd-typography-paragraph-s-font-size);
  transition: all 0.15s;
}

.ldp-cascade-node--active {
  background: color-mix(in srgb, var(--cfg-accent) 12%, transparent);
  border-color: var(--cfg-accent);
  color: var(--cfg-accent);
}

.ldp-cascade-node--linked {
  cursor: pointer;
  color: var(--cfg-text-muted);
}

.ldp-cascade-node--linked:hover {
  background: var(--cfg-surface-elevated);
  border-color: color-mix(in srgb, var(--cfg-accent) 40%, transparent);
  color: var(--cfg-text);
}

.ldp-cascade-icon { display: flex; align-items: center; flex-shrink: 0; }

.ldp-cascade-name {
  font-weight: var(--fnd-font-weight-semibold);
  color: inherit;
}

.ldp-cascade-count {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-variant-numeric: tabular-nums;
  padding: 0 4px;
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
}

.ldp-cascade-arrow {
  color: var(--cfg-text-muted);
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════
   Conflicts
   ═══════════════════════════════════════════════════════ */
.ldp-conflicts {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-02);
}

.ldp-conflict {
  border: 1px solid;
  border-radius: var(--fnd-radius-m);
  padding: var(--fnd-spacing-03);
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-01);
}

.ldp-conflict--warning {
  border-color: color-mix(in srgb, #f59e0b 40%, transparent);
  background: color-mix(in srgb, #f59e0b 6%, transparent);
}

.ldp-conflict--info {
  border-color: color-mix(in srgb, #3b82f6 30%, transparent);
  background: color-mix(in srgb, #3b82f6 5%, transparent);
}

.ldp-conflict-header {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-01);
}

.ldp-conflict--warning .ldp-conflict-header { color: #f59e0b; }
.ldp-conflict--info .ldp-conflict-header { color: #3b82f6; }

.ldp-conflict-label {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-bold);
}

.ldp-conflict-msg {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
  color: var(--cfg-text-muted);
  margin: 0;
}

.ldp-conflict-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: var(--fnd-typography-paragraph-s-font-size);
  color: var(--cfg-text);
  font-weight: var(--fnd-font-weight-semibold);
  padding: var(--fnd-spacing-01) 0;
}

.ldp-conflict-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ldp-conflict-token {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  background: color-mix(in srgb, currentColor 10%, transparent);
  color: var(--cfg-text-muted);
}

/* ═══════════════════════════════════════════════════════
   Smart Links
   ═══════════════════════════════════════════════════════ */
.ldp-links {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-02);
}

.ldp-links-label {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
}

.ldp-link {
  width: 100%;
  text-align: left;
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-m);
  padding: var(--fnd-spacing-02) var(--fnd-spacing-03);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ldp-link:hover {
  border-color: color-mix(in srgb, var(--cfg-accent) 40%, transparent);
  background: var(--cfg-surface-elevated);
}

.ldp-link-header {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.ldp-link-target {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  color: var(--cfg-accent);
}

.ldp-link-token {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  color: var(--cfg-text);
}

.ldp-link-modified {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  padding: 0 4px;
  border-radius: var(--fnd-radius-s);
  background: color-mix(in srgb, var(--cfg-accent) 15%, transparent);
  color: var(--cfg-accent);
}

.ldp-link-value {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-01);
}

.ldp-link-current {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  color: var(--cfg-text-muted);
}

.ldp-link-reason {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
  color: var(--cfg-text-muted);
  margin: 0;
  opacity: 0.8;
}

/* ═══════════════════════════════════════════════════════
   Contextual Notes
   ═══════════════════════════════════════════════════════ */
.ldp-notes {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-01);
}

.ldp-note {
  display: flex;
  align-items: flex-start;
  gap: var(--fnd-spacing-01);
  padding: var(--fnd-spacing-02);
  border-radius: var(--fnd-radius-s);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
}

.ldp-note svg { flex-shrink: 0; margin-top: 1px; }

.ldp-note--info {
  background: color-mix(in srgb, #3b82f6 6%, transparent);
  color: var(--cfg-text-muted);
}

.ldp-note--info svg { color: #3b82f6; }

.ldp-note--warning {
  background: color-mix(in srgb, #f59e0b 6%, transparent);
  color: var(--cfg-text-muted);
}

.ldp-note--warning svg { color: #f59e0b; }
</style>
