<template>
  <div class="pf">
    <span class="pf-feld" :style="{ background: hex || 'transparent' }" :class="{ 'pf-feld--leer': !hex }" :title="hex || 'nicht auflösbar'"></span>
    <span v-if="label" class="pf-label">{{ label }}</span>
    <select class="pf-select" :value="palette" :aria-label="`${label || 'Farbe'}: Palette`" @change="waehlePalette($event.target.value)">
      <option v-if="!palette" value="" disabled>{{ modelValue }}</option>
      <option v-for="p in paletten" :key="p.name" :value="p.name">{{ p.label }}</option>
    </select>
    <select class="pf-select pf-select--stufe" :value="stufe" :aria-label="`${label || 'Farbe'}: Stufe`" :disabled="!palette" @change="waehleStufe($event.target.value)">
      <option v-for="s in stufenDerPalette" :key="s.stufe" :value="s.stufe">{{ s.stufe }}</option>
    </select>
    <span v-if="$slots.default" class="pf-extra"><slot /></span>
  </div>
</template>

<script setup>
// Farbwahl fuer den Bereich Praesentation (Plan v2, 2.5): Palette + Stufe
// aus den vorhandenen Primitives, Ergebnis ist ein Verweis "palette.stufe".
import { computed } from 'vue'
import { loeseAuf, palettenAuswahl } from '../../utils/praes-ref.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const paletten = palettenAuswahl()
const teile = computed(() => String(props.modelValue).match(/^([a-z][a-z-]*)\.(\d{2,3})$/))
const palette = computed(() => (teile.value && paletten.some((p) => p.name === teile.value[1]) ? teile.value[1] : ''))
const stufe = computed(() => (teile.value ? teile.value[2] : ''))
const hex = computed(() => loeseAuf(props.modelValue, { still: true }))
const stufenDerPalette = computed(() => paletten.find((p) => p.name === palette.value)?.stufen || [])

function waehlePalette(name) {
  const stufen = paletten.find((p) => p.name === name)?.stufen || []
  // Gleiche Stufe behalten, wenn es sie in der neuen Palette gibt
  const naechste = stufen.find((s) => s.stufe === stufe.value) || stufen.find((s) => s.stufe === '500') || stufen[0]
  if (naechste) emit('update:modelValue', `${name}.${naechste.stufe}`)
}
function waehleStufe(s) {
  if (palette.value) emit('update:modelValue', `${palette.value}.${s}`)
}
</script>

<style scoped>
.pf { display: flex; align-items: center; gap: 6px; min-width: 0; }
.pf-feld {
  width: 22px; height: 22px; flex-shrink: 0; border-radius: 4px;
  border: 1px solid var(--cfg-border);
}
.pf-feld--leer { background: repeating-linear-gradient(45deg, var(--cfg-border) 0 3px, transparent 3px 6px) !important; }
.pf-label { font-size: 11px; color: var(--cfg-text-secondary); min-width: 44px; }
.pf-select {
  height: 24px; min-width: 0; flex: 1 1 auto; max-width: 130px; padding: 0 4px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: var(--cfg-font-body);
}
.pf-select--stufe { flex: 0 0 56px; font-family: var(--cfg-font-mono); }
.pf-select:focus { outline: none; border-color: var(--cfg-accent); }
.pf-extra { display: inline-flex; align-items: center; gap: 4px; margin-left: auto; }
</style>
