<template>
  <div class="radii-editor">

    <!-- ── Scale Tokens ── -->
    <section class="re-section">
      <h3 class="re-heading">
        Radius Scale
        <span class="re-heading__count">{{ totalTokenCount }} Tokens</span>
      </h3>
      <p class="re-desc">
        Die Border-Radius-Skala definiert die Eckenabrundungen fuer alle Komponenten.
        Werte koennen direkt ueberschrieben werden.
      </p>

      <div class="re-token-list">
        <div
          v-for="(token, key) in scaleTokens"
          :key="key"
          class="re-token-row"
        >
          <div class="re-token-info">
            <span class="re-token-label">{{ token.label }}</span>
            <code class="re-token-name">--fnd-radius-{{ key }}</code>
          </div>
          <div class="re-token-preview">
            <div class="re-radius-box" :style="{ borderRadius: currentValue(key) }"></div>
          </div>
          <input
            type="text"
            class="re-value-input"
            :value="currentValue(key)"
            @change="store.updateFoundationToken('radius', key, $event.target.value)"
          />
        </div>
      </div>
    </section>

    <!-- ── Custom Tokens ── -->
    <section class="re-section">
      <h3 class="re-heading">
        Eigene Tokens
        <span class="re-heading__count">{{ customTokenCount }}</span>
      </h3>
      <p class="re-desc">
        Zusaetzliche Radius-Tokens fuer spezielle Anforderungen.
      </p>

      <div v-if="customTokenCount > 0" class="re-token-list">
        <div
          v-for="(token, key) in customTokens"
          :key="key"
          class="re-token-row"
        >
          <div class="re-token-info">
            <span class="re-token-label">{{ token.label }}</span>
            <code class="re-token-name">--fnd-radius-{{ key }}</code>
          </div>
          <div class="re-token-preview">
            <div class="re-radius-box" :style="{ borderRadius: token.value }"></div>
          </div>
          <input
            type="text"
            class="re-value-input"
            :value="token.value"
            @change="store.addCustomRadiiToken(key, $event.target.value)"
          />
          <button class="re-remove-btn" @click="store.removeCustomRadiiToken(key)" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Add Token -->
      <div v-if="!showAddForm" class="re-add-row">
        <button class="re-add-btn" @click="showAddForm = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Token hinzufuegen
        </button>
      </div>
      <div v-else class="re-add-form">
        <div class="re-add-fields">
          <input
            ref="addKeyInput"
            type="text"
            class="re-input"
            v-model="newKey"
            placeholder="Token-Name (z.B. panel)"
            @keyup.enter="addToken"
            @keyup.escape="cancelAdd"
          />
          <input
            type="text"
            class="re-input"
            v-model="newValue"
            placeholder="Wert (z.B. 20px)"
            @keyup.enter="addToken"
            @keyup.escape="cancelAdd"
          />
        </div>
        <div v-if="newValue.trim()" class="re-add-preview">
          <div class="re-radius-box re-radius-box--lg" :style="{ borderRadius: newValue }"></div>
          <span class="re-add-preview-label">{{ newValue }}</span>
        </div>
        <div class="re-add-actions">
          <button class="re-btn re-btn--primary" @click="addToken" :disabled="!newKey.trim() || !newValue.trim()">Hinzufuegen</button>
          <button class="re-btn re-btn--ghost" @click="cancelAdd">Abbrechen</button>
        </div>
      </div>
    </section>

    <!-- ── Default Alias ── -->
    <section class="re-section">
      <h3 class="re-heading">Default Radius</h3>
      <p class="re-desc">
        <code>--fnd-radius-default</code> verweist auf <strong>SM ({{ currentValue('sm') }})</strong> und wird als
        Fallback fuer Komponenten ohne expliziten Radius verwendet.
      </p>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()

const scaleTokens = computed(() => foundationTokens.radius?.tokens || {})

const customTokens = computed(() => store.currentCustomRadiiTokens || {})
const customTokenCount = computed(() => Object.keys(customTokens.value).length)
const totalTokenCount = computed(() => Object.keys(scaleTokens.value).length + customTokenCount.value)

function currentValue(key) {
  return store.currentFoundation.radius?.[key] ?? scaleTokens.value[key]?.value ?? ''
}

// ── Add Custom Token ──
const showAddForm = ref(false)
const newKey = ref('')
const newValue = ref('')
const addKeyInput = ref(null)

watch(showAddForm, (v) => { if (v) nextTick(() => addKeyInput.value?.focus()) })

function addToken() {
  const key = newKey.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const value = newValue.value.trim()
  if (!key || !value) return
  store.addCustomRadiiToken(key, value)
  cancelAdd()
}

function cancelAdd() {
  showAddForm.value = false
  newKey.value = ''
  newValue.value = ''
}
</script>

<style scoped>
.radii-editor { display: flex; flex-direction: column; gap: 24px; }

.re-section { display: flex; flex-direction: column; gap: 12px; }

.re-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}

.re-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted); background: var(--cfg-surface-elevated);
  padding: 2px 6px; border-radius: 4px;
}

.re-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }

/* ── Token List ── */
.re-token-list { display: flex; flex-direction: column; gap: 2px; }

.re-token-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 10px; border-radius: 6px;
}

.re-token-row:hover { background: var(--cfg-surface-elevated); }

.re-token-info {
  display: flex; flex-direction: column; gap: 1px;
  width: 130px; flex-shrink: 0;
}

.re-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.re-token-name { font-size: 10px; color: var(--cfg-text-muted); }

.re-token-preview { flex: 1; display: flex; align-items: center; }

.re-radius-box {
  width: 48px; height: 48px;
  background: var(--cfg-accent); opacity: 0.5;
  transition: border-radius 0.2s;
}

.re-radius-box--lg { width: 64px; height: 64px; }

.re-value-input {
  width: 80px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none;
  text-align: right; flex-shrink: 0;
  transition: border-color 0.15s;
}

.re-value-input:focus { border-color: var(--cfg-accent); }

/* ── Remove Button ── */
.re-remove-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; border-radius: 4px;
  background: transparent; color: var(--cfg-text-muted); cursor: pointer;
  flex-shrink: 0;
}

.re-remove-btn:hover { color: var(--cfg-danger); background: var(--cfg-danger-subtle); }

/* ── Add Token ── */
.re-add-row { display: flex; }

.re-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border: 1px dashed var(--cfg-border);
  border-radius: 6px; background: transparent;
  color: var(--cfg-text-muted); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
}

.re-add-btn:hover { border-color: var(--cfg-accent); color: var(--cfg-accent); }

.re-add-form {
  display: flex; flex-direction: column; gap: 8px;
  padding: 12px; border: 1px solid var(--cfg-border);
  border-radius: 8px; background: var(--cfg-surface);
}

.re-add-fields { display: flex; gap: 6px; }

.re-input {
  flex: 1; height: 28px; padding: 0 8px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 12px; outline: none;
  transition: border-color 0.15s;
}

.re-input:focus { border-color: var(--cfg-accent); }

.re-add-preview {
  display: flex; align-items: center; gap: 12px;
  padding: 8px; background: var(--cfg-surface-elevated);
  border-radius: 4px;
}

.re-add-preview-label { font-size: 11px; font-family: monospace; color: var(--cfg-text-muted); }

.re-add-actions { display: flex; gap: 6px; }

.re-btn {
  flex: 1; height: 28px; border: none; border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
}

.re-btn--primary { background: var(--cfg-accent); color: #fff; }
.re-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.re-btn--ghost { background: var(--cfg-surface); color: var(--cfg-text-muted); border: 1px solid var(--cfg-border); }
</style>
