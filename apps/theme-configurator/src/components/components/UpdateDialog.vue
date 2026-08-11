<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div v-if="sync.state.showDialog" class="dialog-overlay" @click.self="sync.dismissDialog" @keydown.escape="sync.dismissDialog">
        <div class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="update-dialog-title" @keydown="trapFocus">

          <!-- Header with Pipeline Stage Indicator -->
          <div class="dialog-header">
            <div class="dialog-icon" :class="iconClass">
              <!-- Stage-specific icons -->
              <svg v-if="sync.state.stage === 'forging' || sync.state.stage === 'detecting'" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <svg v-else-if="sync.state.stage === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <svg v-else-if="sync.state.stage === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </div>
            <div class="dialog-title-group">
              <h3 class="dialog-title" id="update-dialog-title">{{ dialogTitle }}</h3>
              <p class="dialog-subtitle">{{ dialogSubtitle }}</p>
            </div>
            <button class="dialog-close" @click="sync.dismissDialog" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Pipeline Progress Bar -->
          <div class="pipeline-bar">
            <div class="pipeline-stage" :class="{ active: stageIndex >= 0, done: stageIndex > 0 }">
              <span class="pipeline-dot"></span>
              <span class="pipeline-label">Detect</span>
            </div>
            <div class="pipeline-connector" :class="{ done: stageIndex > 0 }"></div>
            <div class="pipeline-stage" :class="{ active: stageIndex >= 1, done: stageIndex > 1 }">
              <span class="pipeline-dot"></span>
              <span class="pipeline-label">Forge</span>
            </div>
            <div class="pipeline-connector" :class="{ done: stageIndex > 1 }"></div>
            <div class="pipeline-stage" :class="{ active: stageIndex >= 2, done: stageIndex > 2 }">
              <span class="pipeline-dot"></span>
              <span class="pipeline-label">Review</span>
            </div>
            <div class="pipeline-connector" :class="{ done: stageIndex > 2 }"></div>
            <div class="pipeline-stage" :class="{ active: stageIndex >= 3, done: stageIndex > 3 }">
              <span class="pipeline-dot"></span>
              <span class="pipeline-label">Merge</span>
            </div>
            <div class="pipeline-connector" :class="{ done: stageIndex > 3 }"></div>
            <div class="pipeline-stage" :class="{ active: stageIndex >= 4, done: stageIndex > 4 }">
              <span class="pipeline-dot"></span>
              <span class="pipeline-label">Verify</span>
            </div>
          </div>

          <!-- Content Area -->
          <div class="dialog-content">

            <!-- Processing state -->
            <div v-if="sync.state.stage === 'detecting' || sync.state.stage === 'forging'" class="processing-state">
              <div class="processing-spinner"></div>
              <p class="processing-text">{{ sync.state.stageMessage }}</p>
            </div>

            <!-- Review State: Pending palettes -->
            <template v-if="sync.state.stage === 'review' && sync.state.mergeRequest">
              <div class="mr-section">
                <div class="mr-section-header">
                  <h4 class="mr-section-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
                    </svg>
                    Merge Request
                  </h4>
                  <span class="mr-count">{{ sync.state.mergeRequest.palettes.length }} change{{ sync.state.mergeRequest.palettes.length !== 1 ? 's' : '' }}</span>
                </div>
                <p class="mr-summary" v-if="sync.state.mergeRequest.summary">{{ sync.state.mergeRequest.summary }}</p>
              </div>

              <!-- Palette changes -->
              <div class="mr-section">
                <h4 class="mr-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                  </svg>
                  Palettes to Add
                </h4>
                <div class="palette-list">
                  <div v-for="pal in sync.state.mergeRequest.palettes" :key="pal.id" class="palette-item">
                    <div class="palette-swatch" :style="{ background: pal.base }"></div>
                    <div class="palette-info">
                      <span class="palette-name">{{ pal.label }}</span>
                      <span class="palette-token">--fnd-primitive-{{ pal.id }}-*</span>
                    </div>
                    <code class="palette-hex">{{ pal.base }}</code>
                  </div>
                </div>
              </div>

              <!-- Diff Preview -->
              <div class="mr-section">
                <h4 class="mr-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Files Changed ({{ sync.state.mergeRequest.files.length }})
                </h4>
                <div class="diff-files">
                  <div v-for="file in sync.state.mergeRequest.files" :key="file.path" class="diff-file">
                    <div class="diff-file-header">
                      <span class="diff-file-action" :class="'action-' + file.action">{{ file.action }}</span>
                      <code class="diff-file-path">{{ file.path }}</code>
                    </div>
                  </div>
                </div>

                <!-- Inline diff preview -->
                <div v-if="sync.state.mergeRequest.diffs && sync.state.mergeRequest.diffs.length" class="diff-preview">
                  <div v-for="diff in sync.state.mergeRequest.diffs" :key="diff.palette" class="diff-block">
                    <div class="diff-block-header">{{ diff.palette }}</div>
                    <div v-for="(change, ci) in diff.changes" :key="ci" class="diff-change">
                      <span class="diff-filename">{{ change.file }}</span>
                      <div class="diff-lines">
                        <div v-for="(line, li) in change.lines" :key="li" class="diff-line" :class="{ 'diff-add': line.startsWith('+'), 'diff-remove': line.startsWith('-') }">
                          <code>{{ line }}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Merging state -->
            <div v-if="sync.state.stage === 'merging'" class="processing-state">
              <div class="processing-spinner"></div>
              <p class="processing-text">{{ sync.state.stageMessage }}</p>
            </div>

            <!-- Success state -->
            <div v-if="sync.state.stage === 'success'" class="result-state result-success">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h4 class="result-title">Merge Successful</h4>
              <p class="result-message">{{ sync.state.stageMessage }}</p>
              <div v-if="sync.state.lastSync" class="result-details">
                <div v-for="file in (sync.state.lastSync.files || [])" :key="file" class="result-file">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <code>{{ file }}</code>
                </div>
              </div>
            </div>

            <!-- Error state -->
            <div v-if="sync.state.stage === 'error'" class="result-state result-error">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <h4 class="result-title">Merge Failed</h4>
              <p class="result-message">{{ sync.state.stageMessage }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="dialog-actions">
            <!-- Review stage: Merge & Skip buttons -->
            <template v-if="sync.state.stage === 'review'">
              <button class="btn-merge" @click="handleMerge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
                </svg>
                Merge to Styleguide
              </button>
              <button class="btn-skip" @click="sync.dismissDialog">
                Skip for now
              </button>
            </template>

            <!-- Error stage: Retry & Cancel -->
            <template v-if="sync.state.stage === 'error'">
              <button class="btn-merge" @click="sync.retryMerge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Retry Merge
              </button>
              <button class="btn-skip" @click="sync.dismissDialog">
                Cancel
              </button>
            </template>

            <!-- Processing / Success: just a close button -->
            <template v-if="sync.state.stage === 'success'">
              <button class="btn-skip" @click="sync.dismissDialog" style="flex: 1;">
                Close (auto-closing in 4s)
              </button>
            </template>

            <template v-if="sync.state.stage === 'detecting' || sync.state.stage === 'forging' || sync.state.stage === 'merging'">
              <button class="btn-skip" @click="sync.dismissDialog" style="flex: 1;">
                Cancel
              </button>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useStyleguideSync } from '../../stores/styleguide-sync.js'
import { useThemeStore } from '../../stores/theme.js'

const sync = useStyleguideSync()
const store = useThemeStore()

// Wrapper that passes the theme store for the merge-time security check
function handleMerge() {
  sync.mergeToStyleguide(store)
}

const stageIndex = computed(() => {
  const stages = ['detecting', 'forging', 'review', 'merging', 'success']
  const idx = stages.indexOf(sync.state.stage)
  if (sync.state.stage === 'error') return 3 // Stay at merge step
  return idx >= 0 ? idx : -1
})

const iconClass = computed(() => {
  const map = {
    detecting: 'icon-processing',
    forging: 'icon-processing',
    review: 'icon-review',
    merging: 'icon-processing',
    success: 'icon-success',
    error: 'icon-error'
  }
  return map[sync.state.stage] || 'icon-review'
})

const dialogTitle = computed(() => {
  const map = {
    detecting: 'Analyzing Changes...',
    forging: 'Forging Merge Request...',
    review: 'Merge Request Ready',
    merging: 'Merging Changes...',
    success: 'Merge Complete',
    error: 'Merge Failed'
  }
  return map[sync.state.stage] || 'Update Style Guide'
})

const dialogSubtitle = computed(() => {
  const map = {
    detecting: 'Comparing local changes against the Design System source',
    forging: 'Generating diff preview for review',
    review: 'Review the changes below before merging into the styleguide',
    merging: 'Writing changes to source files...',
    success: 'All changes have been applied to the Design System documentation',
    error: 'Something went wrong — you can retry the merge'
  }
  return map[sync.state.stage] || ''
})

// Focus trap for dialog
function trapFocus(e) {
  if (e.key !== 'Tab') return
  const dialog = e.currentTarget
  const focusable = dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--cfg-z-tooltip);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cfg-overlay);
  backdrop-filter: blur(4px);
}

.dialog-panel {
  background: var(--cfg-surface, #fff);
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-radius: 16px;
  width: 560px;
  max-width: 92vw;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: var(--cfg-shadow-modal);
  display: flex;
  flex-direction: column;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 12px;
}

.dialog-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--fnd-motion-duration-200);
}

.icon-review { background: var(--cfg-accent-subtle); color: var(--cfg-accent); }
.icon-processing { background: var(--cfg-processing-subtle); color: var(--cfg-processing); }
.icon-success { background: var(--cfg-success-subtle); color: var(--cfg-success); }
.icon-error { background: var(--cfg-danger-subtle); color: var(--cfg-danger); }

.dialog-title-group { flex: 1; min-width: 0; }

.dialog-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--cfg-text, #000);
  margin: 0;
  line-height: 1.3;
}

.dialog-subtitle {
  font-size: 12px;
  color: var(--cfg-text-muted, #888);
  margin: 2px 0 0;
}

.dialog-close {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted, #888);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--fnd-motion-duration-150);
  flex-shrink: 0;
}

.dialog-close:hover {
  background: var(--cfg-surface-elevated, #f0f0f0);
  color: var(--cfg-text, #000);
}

/* Pipeline Progress Bar */
.pipeline-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 8px 24px 12px;
  border-bottom: 1px solid var(--cfg-border, #e0e0e0);
}

.pipeline-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pipeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--cfg-border, #d0d0d0);
  background: var(--cfg-surface, #fff);
  transition: all var(--fnd-motion-duration-200);
}

.pipeline-stage.active .pipeline-dot {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent);
}

.pipeline-stage.done .pipeline-dot {
  border-color: var(--cfg-success);
  background: var(--cfg-success);
}

.pipeline-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--cfg-text-muted, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pipeline-stage.active .pipeline-label {
  color: var(--cfg-accent);
}

.pipeline-stage.done .pipeline-label {
  color: var(--cfg-success);
}

.pipeline-connector {
  width: 28px;
  height: 2px;
  background: var(--cfg-border, #d0d0d0);
  margin-bottom: 16px;
  transition: background var(--fnd-motion-duration-200);
}

.pipeline-connector.done {
  background: var(--cfg-success);
}

/* Content */
.dialog-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Processing state */
.processing-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 0;
}

.processing-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--cfg-border, #e0e0e0);
  border-top-color: var(--cfg-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.processing-text {
  font-size: 13px;
  color: var(--cfg-text-muted, #888);
  text-align: center;
}

/* Merge Request sections */
.mr-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mr-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mr-section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--cfg-text, #000);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mr-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
}

.mr-summary {
  font-size: 12px;
  color: var(--cfg-text-muted, #888);
  margin: 0;
  font-style: italic;
}

/* Palette list */
.palette-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-left: 3px solid var(--cfg-success);
  border-radius: 8px;
  background: var(--cfg-surface-elevated, #fafafa);
}

.palette-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  flex-shrink: 0;
}

.palette-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.palette-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--cfg-text, #000);
}

.palette-token {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted, #888);
}

.palette-hex {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted, #888);
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--cfg-surface, #f5f5f5);
}

/* Diff preview */
.diff-files {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diff-file {
  padding: 6px 8px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-radius: 6px;
  background: var(--cfg-surface-elevated, #fafafa);
}

.diff-file-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.diff-file-action {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  border-radius: 3px;
}

.action-modify { background: var(--cfg-warning-subtle); color: var(--cfg-warning); }
.action-create { background: var(--cfg-success-subtle); color: var(--cfg-success); }
.action-delete { background: var(--cfg-danger-subtle); color: var(--cfg-danger); }

.diff-file-path {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text, #000);
}

.diff-preview {
  margin-top: 8px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}

.diff-block {
  border-bottom: 1px solid var(--cfg-border, #e0e0e0);
}

.diff-block:last-child {
  border-bottom: none;
}

.diff-block-header {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 10px;
  background: var(--cfg-surface-elevated, #f5f5f5);
  color: var(--cfg-text, #000);
  border-bottom: 1px solid var(--cfg-border, #e0e0e0);
}

.diff-change {
  padding: 4px 0;
}

.diff-filename {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted, #888);
  padding: 2px 10px;
  display: block;
}

.diff-lines {
  padding: 0;
}

.diff-line {
  padding: 1px 10px 1px 16px;
  font-size: 11px;
}

.diff-line code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--cfg-text, #000);
}

.diff-add {
  background: var(--cfg-success-subtle);
}

.diff-add code {
  color: var(--cfg-success);
}

.diff-remove {
  background: var(--cfg-danger-subtle);
}

.diff-remove code {
  color: var(--cfg-danger);
}

/* Result states */
.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  text-align: center;
}

.result-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.result-message {
  font-size: 13px;
  color: var(--cfg-text-muted, #888);
  margin: 0;
  max-width: 320px;
}

.result-success { color: var(--cfg-success); }
.result-success .result-title { color: var(--cfg-success); }

.result-error { color: var(--cfg-danger); }
.result-error .result-title { color: var(--cfg-danger); }

.result-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.result-file {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--cfg-success);
}

.result-file code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--cfg-text, #000);
}

/* Actions */
.dialog-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--cfg-border, #e0e0e0);
}

.btn-merge {
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--cfg-success);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity var(--fnd-motion-duration-150);
}

.btn-merge:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-merge:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-skip {
  flex: 1;
  height: 36px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-radius: 8px;
  background: var(--cfg-surface, #fff);
  color: var(--cfg-text-muted, #888);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150);
}

.btn-skip:hover {
  border-color: var(--cfg-text-muted, #888);
  color: var(--cfg-text, #000);
}

/* Spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

/* Transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all var(--fnd-motion-duration-200) ease;
}

.dialog-fade-enter-active .dialog-panel,
.dialog-fade-leave-active .dialog-panel {
  transition: all var(--fnd-motion-duration-200) ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog-panel,
.dialog-fade-leave-to .dialog-panel {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
