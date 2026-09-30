<template>
  <Transition name="konfig-dialog">
    <div
      v-if="offen"
      class="konfig-dialog__hintergrund"
      data-test="konfig-dialog-hintergrund"
      @click.self="hintergrundGeklickt"
    >
      <div
        ref="dialogRef"
        :class="['konfig-dialog', `konfig-dialog--${groesse}`]"
        :role="rolle"
        aria-modal="true"
        :aria-labelledby="titelId"
        :aria-describedby="beschreibung ? textId : undefined"
        tabindex="-1"
      >
        <div class="konfig-dialog__kopf">
          <h2 :id="titelId" class="konfig-dialog__titel"><slot name="titel">{{ titel }}</slot></h2>
          <button
            v-if="schliessenKnopf"
            type="button"
            class="konfig-dialog__schliessen"
            aria-label="Dialog schließen"
            @click="schliessen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="konfig-dialog__inhalt">
          <p v-if="beschreibung" :id="textId" class="konfig-dialog__text">{{ beschreibung }}</p>
          <slot />
        </div>
        <div v-if="$slots.fuss" class="konfig-dialog__fuss">
          <slot name="fuss" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
/**
 * KonfigDialog — gemeinsame Grundlage fuer modale Dialoge im App-Chrome (Plan v2, 4.4)
 * role="dialog"/"alertdialog", aria-modal, aria-labelledby/-describedby,
 * Fokus-Falle mit Escape und Fokus-Rueckgabe (useFokusFalle).
 */
import { ref, useId } from 'vue'
import { useFokusFalle } from '../../composables/useFokusFalle.js'

const props = defineProps({
  offen: { type: Boolean, default: false },
  titel: { type: String, default: '' },
  beschreibung: { type: String, default: '' },
  groesse: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  rolle: { type: String, default: 'dialog', validator: (v) => ['dialog', 'alertdialog'].includes(v) },
  /** CSS-Selektor des Elements, das beim Oeffnen den Fokus bekommt */
  startFokus: { type: String, default: '' },
  schliessenKnopf: { type: Boolean, default: true },
  hintergrundSchliesst: { type: Boolean, default: true }
})
const emit = defineEmits(['schliessen'])

const dialogRef = ref(null)
const basisId = useId()
const titelId = `${basisId}-titel`
const textId = `${basisId}-text`

function schliessen () { emit('schliessen') }
function hintergrundGeklickt () { if (props.hintergrundSchliesst) schliessen() }

useFokusFalle(dialogRef, () => props.offen, {
  beiEscape: schliessen,
  startFokus: props.startFokus || undefined
})

defineExpose({ dialogRef })
</script>

<style scoped>
.konfig-dialog__hintergrund {
  position: fixed;
  inset: 0;
  background: var(--cfg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--cfg-z-modal);
}
.konfig-dialog {
  width: min(420px, calc(100vw - 32px));
  max-height: 84vh;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  box-shadow: var(--cfg-shadow-modal);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--cfg-font-body);
  color: var(--cfg-text);
}
.konfig-dialog:focus { outline: none; }
.konfig-dialog--sm { width: min(360px, calc(100vw - 32px)); }
.konfig-dialog--lg { width: min(560px, calc(100vw - 32px)); }
.konfig-dialog__kopf {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--cfg-border);
  flex-shrink: 0;
}
.konfig-dialog__titel {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--cfg-font-heading);
  color: var(--cfg-text);
}
.konfig-dialog__schliessen {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
.konfig-dialog__schliessen:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }
.konfig-dialog__inhalt {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.konfig-dialog__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--cfg-text-secondary);
  white-space: pre-line;
}
.konfig-dialog__fuss {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--cfg-border);
  flex-shrink: 0;
}
.konfig-dialog-enter-active,
.konfig-dialog-leave-active { transition: opacity 0.15s ease; }
.konfig-dialog-enter-from,
.konfig-dialog-leave-to { opacity: 0; }
</style>
