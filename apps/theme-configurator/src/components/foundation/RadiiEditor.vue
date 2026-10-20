<template>
  <div class="radii-editor">

    <!-- ── Scale Tokens ── -->
    <section class="re-section">
      <h3 class="re-heading">
        Skala der Eckenradien
        <span class="re-heading__count">{{ totalTokenCount }} Tokens</span>
      </h3>
      <p class="re-desc">
        Die Skala der Eckenradien bestimmt die Rundung aller Komponenten. Werte lassen sich direkt überschreiben.
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
          <input :aria-label="`Radius ${token.label || key}`"
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
        Zusätzliche Radius-Tokens für spezielle Anforderungen.
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
          <input :aria-label="`Radius ${token.label || key}`"
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

      <!-- UX-52: gemeinsames Formular -->
      <HinzufuegenFormular knopf-text="Eckenradius hinzufügen" :felder="RADIUS_FELDER" :pruefe="pruefeRadius" test-id="radius-hinzufuegen" @hinzufuegen="radiusHinzufuegen">
        <template #vorschau="{ werte }">
          <div v-if="String(werte.wert || '').trim()" class="re-add-preview">
            <div class="re-radius-box re-radius-box--lg" :style="{ borderRadius: werte.wert }"></div>
          </div>
        </template>
      </HinzufuegenFormular>
    </section>

    <!-- ── Default Alias ── -->
    <section class="re-section">
      <h3 class="re-heading">Standardradius</h3>
      <p class="re-desc">
        <code>--fnd-radius-default</code> verweist auf <strong>SM ({{ currentValue('sm') }})</strong> und wird als
        Fallback für Komponenten ohne expliziten Radius verwendet.
      </p>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import HinzufuegenFormular from '../ui/HinzufuegenFormular.vue'
import { pruefeNeuenNamen, pruefeNeuenWert } from '../../utils/token-pruefung.js'
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

// ── Eigener Eckenradius (UX-52: gemeinsames Formular) ──
const RADIUS_FELDER = [
  { name: 'name', label: 'Name', platzhalter: 'z. B. panel' },
  { name: 'wert', label: 'Wert', platzhalter: 'z. B. 20px' },
]
function pruefeRadius (w) {
  const name = pruefeNeuenNamen(w.name, [...Object.keys(scaleTokens.value), ...Object.keys(customTokens.value)])
  if (name) return { feld: 'name', text: name }
  const wert = pruefeNeuenWert('laenge', w.wert)
  return wert ? { feld: 'wert', text: wert } : null
}
function radiusHinzufuegen (w) {
  store.addCustomRadiiToken(w.name.trim(), String(w.wert).trim())
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

.re-btn--primary { background: var(--cfg-accent); color: var(--cfg-on-accent); }
.re-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.re-btn--ghost { background: var(--cfg-surface); color: var(--cfg-text-muted); border: 1px solid var(--cfg-border); }
</style>
