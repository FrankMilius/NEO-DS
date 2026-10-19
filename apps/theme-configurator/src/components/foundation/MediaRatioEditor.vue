<template>
  <div class="media-editor">

    <!-- ── Ratio Tokens ── -->
    <section class="me-section">
      <h3 class="me-heading">
        Seitenverhältnisse
        <span class="me-heading__count">{{ totalCount }}</span>
      </h3>

      <!-- Default ratio tokens -->
      <div class="me-token-list">
        <div
          v-for="(token, key) in ratioTokens"
          :key="key"
          class="me-token-row"
        >
          <div class="me-token-info">
            <span class="me-token-label">{{ token.label }}</span>
            <code class="me-token-name">--fnd-media-ratio-{{ key }}</code>
          </div>
          <input :aria-label="token.label"
            type="text"
            class="me-value-input"
            :value="currentValue(key)"
            @change="store.updateFoundationToken('media', key, $event.target.value)"
          />
        </div>

        <!-- Custom ratio tokens -->
        <div
          v-for="(token, key) in customRatioTokens"
          :key="'custom-' + key"
          class="me-token-row me-token-row--custom"
        >
          <div class="me-token-info">
            <span class="me-token-label">{{ token.label }}</span>
            <code class="me-token-name">--fnd-media-ratio-{{ key }}</code>
          </div>
          <input :aria-label="token.label"
            type="text"
            class="me-value-input"
            :value="token.value"
            @change="store.addCustomMediaRatioToken(key, $event.target.value, token.label)"
          />
          <button class="me-remove-btn" @click="store.removeCustomMediaRatioToken(key)" title="Token entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- UX-52: gemeinsames Formular -->
      <HinzufuegenFormular knopf-text="Seitenverhältnis hinzufügen" :felder="MEDIEN_FELDER" :pruefe="pruefeMedium" test-id="medien-hinzufuegen" @hinzufuegen="mediumHinzufuegen">
        <template #vorschau="{ werte }">
          <div v-if="String(werte.wert || '').trim()" class="me-add-preview">
            <div class="me-add-preview-box" :style="{ aspectRatio: werte.wert }"></div>
          </div>
        </template>
      </HinzufuegenFormular>
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

const allTokens = foundationTokens.media?.tokens || {}

const ratioTokens = computed(() => allTokens)

const customRatioTokens = computed(() => store.currentCustomMediaRatioTokens || {})
const totalCount = computed(() => Object.keys(ratioTokens.value).length + Object.keys(customRatioTokens.value).length)

function currentValue(key) {
  return store.currentFoundation.media?.[key] ?? allTokens[key]?.value ?? ''
}

// ── Eigenes Seitenverhältnis (UX-52: gemeinsames Formular) ──
// Der Name im CSS entsteht aus der Bezeichnung: „21:9 Ultrawide“ → 21-9-ultrawide
const schluesselAus = (text) => String(text || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
const MEDIEN_FELDER = [
  { name: 'bezeichnung', label: 'Bezeichnung', platzhalter: 'z. B. 21:9 Ultrawide', hilfe: (w) => (schluesselAus(w.bezeichnung) ? `Name: ${schluesselAus(w.bezeichnung)}` : '') },
  { name: 'wert', label: 'Verhältnis', platzhalter: 'z. B. 21 / 9' },
]
function pruefeMedium (w) {
  const name = pruefeNeuenNamen(schluesselAus(w.bezeichnung), [...Object.keys(ratioTokens.value), ...Object.keys(customRatioTokens.value)])
  if (name) return { feld: 'bezeichnung', text: w.bezeichnung?.trim() ? name : 'Bitte eine Bezeichnung eingeben.' }
  const wert = pruefeNeuenWert('verhaeltnis', w.wert)
  return wert ? { feld: 'wert', text: wert } : null
}
function mediumHinzufuegen (w) {
  store.addCustomMediaRatioToken(schluesselAus(w.bezeichnung), String(w.wert).trim(), w.bezeichnung.trim())
}
</script>

<style scoped>
.media-editor { display: flex; flex-direction: column; gap: 24px; }

.me-section { display: flex; flex-direction: column; gap: 12px; }

.me-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}

.me-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted); font-family: monospace;
}

.me-token-list { display: flex; flex-direction: column; gap: 2px; }

.me-token-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 10px; border-radius: 6px;
  transition: background 0.1s;
}

.me-token-row:hover { background: var(--cfg-surface-elevated); }

.me-token-row--custom {
  background: color-mix(in srgb, var(--cfg-accent) 4%, transparent);
}

.me-token-info {
  display: flex; flex-direction: column; gap: 1px;
  width: 160px; flex-shrink: 0;
}

.me-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.me-token-name { font-size: 10px; color: var(--cfg-text-muted); }

.me-value-input {
  width: 80px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none;
  text-align: right; flex-shrink: 0; margin-left: auto;
  transition: border-color 0.15s;
}

.me-value-input:focus { border-color: var(--cfg-accent); }

.me-remove-btn {
  width: 24px; height: 24px; padding: 0; border: none;
  background: none; color: var(--cfg-text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px; flex-shrink: 0;
  transition: color 0.1s, background 0.1s;
}

.me-remove-btn:hover { color: var(--cfg-indicator-fail); background: var(--cfg-surface-elevated); }

/* ── Add Token Form ── */
.me-add-row { margin-top: 4px; }

.me-add-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px dashed var(--cfg-border);
  border-radius: 6px; background: none;
  color: var(--cfg-text-muted); font-size: 12px; font-weight: 500;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
  width: 100%;
}

.me-add-btn:hover { border-color: var(--cfg-accent); color: var(--cfg-accent); }

.me-add-form {
  display: flex; flex-direction: column; gap: 10px;
  padding: 12px; border: 1px solid var(--cfg-border);
  border-radius: 8px; background: var(--cfg-surface-elevated);
}

.me-add-fields { display: flex; gap: 8px; }

.me-input {
  flex: 1; height: 30px; padding: 0 8px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text);
  font-size: 12px; outline: none;
}

.me-input:focus { border-color: var(--cfg-accent); }

.me-add-preview {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; background: var(--cfg-surface); border-radius: 6px;
}

.me-add-preview-box {
  height: 32px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
}

.me-add-preview-label {
  font-size: 10px; color: var(--cfg-text-muted); font-family: monospace;
}

.me-add-actions { display: flex; gap: 8px; }

.me-btn {
  padding: 6px 14px; border-radius: 6px; font-size: 12px;
  font-weight: 600; cursor: pointer; border: none;
  transition: background 0.1s, opacity 0.1s;
}

.me-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.me-btn--primary { background: var(--cfg-accent); color: #fff; }
.me-btn--primary:hover:not(:disabled) { opacity: 0.9; }
.me-btn--ghost { background: none; color: var(--cfg-text-muted); }
.me-btn--ghost:hover { color: var(--cfg-text); }
</style>
