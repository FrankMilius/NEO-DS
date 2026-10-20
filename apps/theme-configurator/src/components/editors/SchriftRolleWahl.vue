<template>
  <div class="rolle-wahl" data-test="schrift-rolle-wahl">
    <select
      :id="feldId"
      class="rolle-wahl__select"
      :class="{ modified: isOverridden }"
      :aria-label="`${label}: Schriftrolle`"
      :value="auswahl"
      @change="waehle($event.target.value)"
    >
      <option v-for="r in optionen" :key="r.id" :value="r.wert">
        {{ r.name }} – {{ r.familie }}{{ r.wert === standard ? ' (NEO-Standard)' : '' }}
      </option>
      <option v-if="auswahl === EIGENE" :value="EIGENE">Eigene Angabe: {{ kurz(modelValue) }}</option>
    </select>
    <details v-if="eigeneErlaubt" class="rolle-wahl__eigene" :open="auswahl === EIGENE">
      <summary>Eigene Angabe (Font-Stack)</summary>
      <input
        type="text"
        class="rolle-wahl__input"
        :aria-label="`${label}: Font-Stack`"
        :value="auswahl === EIGENE ? modelValue : ''"
        placeholder="z. B. Inter, Helvetica Neue, sans-serif"
        :aria-invalid="fehler ? 'true' : undefined"
        :aria-describedby="fehler ? `${feldId}-fehler` : undefined"
        @change="eigene($event.target.value)"
      />
      <p v-if="fehler" :id="`${feldId}-fehler`" class="rolle-wahl__fehler" role="alert">{{ fehler }}</p>
    </details>
  </div>
</template>

<script setup>
/**
 * Schriftrolle wählen (20.10.2026): Komponenten und die Rolle „Bedienelemente“
 * verweisen auf eine der Schriften unter Typografie, statt eine eigene
 * Schriftfamilie zu tippen. Gespeichert wird `var(--font-…)`.
 */
import { computed, ref, useId } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'
import { ersteFamilie } from '../../utils/google-schrift.js'
import { pruefeFontStack } from '../../utils/css-wert.js'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  /** wählbare Rollen in dieser Reihenfolge */
  rollen: { type: Array, default: () => ['ui', 'body', 'heading', 'mono'] },
  /** Wert des NEO-Standards (wird in der Liste gekennzeichnet) */
  standard: { type: String, default: '' },
  isOverridden: { type: Boolean, default: false },
  /** eigener Font-Stack zulässig (Komponenten ja, Rolle Bedienelemente nein) */
  eigeneErlaubt: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const EIGENE = '__eigene__'
const NAMEN = { ui: 'Bedienelemente', body: 'Body', heading: 'Heading', mono: 'Mono' }
const ROLLE = /^var\(--font-(ui|body|heading|mono)\)$/

const store = useThemeStore()
const typoTokens = foundationTokens.typography.tokens
const feldId = `rolle-${useId()}`
const fehler = ref('')

/** aktueller Wert einer Rolle im Theme (Bedienelemente: über ihren Verweis) */
function rollenWert (id, tiefe = 0) {
  const typo = store.currentFoundation?.typography || {}
  const wert = typo[`font-${id}`] || typoTokens[`font-${id}`]?.value || ''
  const m = String(wert).trim().match(ROLLE)
  return m && tiefe < 3 ? rollenWert(m[1], tiefe + 1) : wert
}

const optionen = computed(() => props.rollen.map((id) => ({
  id,
  wert: `var(--font-${id})`,
  name: NAMEN[id],
  familie: ersteFamilie(rollenWert(id)) || '–',
})))

const auswahl = computed(() => {
  const v = String(props.modelValue || '').trim()
  return optionen.value.some((o) => o.wert === v) ? v : EIGENE
})

function kurz (wert) {
  const s = ersteFamilie(String(wert || '')) || String(wert || '')
  return s.length > 28 ? s.slice(0, 27) + '…' : s
}

function waehle (wert) {
  if (wert === EIGENE) return
  fehler.value = ''
  emit('update:modelValue', wert)
}

function eigene (wert) {
  const f = pruefeFontStack(wert)
  fehler.value = f || ''
  if (!f) emit('update:modelValue', wert.trim())
}
</script>

<style scoped>
.rolle-wahl {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.rolle-wahl__select,
.rolle-wahl__input {
  width: 100%;
  min-height: 28px;
  padding: 3px 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
}

.rolle-wahl__select.modified {
  border-color: var(--cfg-accent);
}

.rolle-wahl__select:focus-visible,
.rolle-wahl__input:focus-visible,
.rolle-wahl__eigene summary:focus-visible {
  outline: var(--cfg-focus-ring-width) solid var(--cfg-focus-ring);
  outline-offset: var(--cfg-focus-ring-offset);
}

.rolle-wahl__eigene summary {
  font-size: 11px;
  color: var(--cfg-text-secondary);
  cursor: pointer;
}

.rolle-wahl__eigene[open] summary {
  margin-bottom: 4px;
}

.rolle-wahl__fehler {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--cfg-danger);
}
</style>
