<template>
  <KonfigDialog
    :offen="!!anfrage"
    :titel="anfrage?.titel || ''"
    :beschreibung="anfrage?.text || ''"
    rolle="alertdialog"
    groesse="sm"
    start-fokus="[data-start-fokus]"
    @schliessen="abbrechen"
  >
    <template #fuss>
      <button
        v-if="anfrage?.art !== 'hinweis'"
        type="button"
        class="kb-knopf kb-knopf--sekundaer"
        data-test="bestaetigung-abbrechen"
        :data-start-fokus="anfrage?.gefaehrlich ? '' : undefined"
        @click="abbrechen"
      >{{ anfrage?.abbrechenText }}</button>
      <button
        type="button"
        :class="['kb-knopf', anfrage?.gefaehrlich ? 'kb-knopf--gefahr' : 'kb-knopf--primaer']"
        data-test="bestaetigung-ok"
        :data-start-fokus="anfrage?.gefaehrlich ? undefined : ''"
        @click="bestaetigt"
      >{{ anfrage?.bestaetigenText }}</button>
    </template>
  </KonfigDialog>
</template>

<script setup>
/**
 * KonfigBestaetigung — zeigt Anfragen aus useBestaetigung (ersetzt confirm/alert).
 * Einmal in App.vue eingebunden. Bei gefaehrlichen Aktionen liegt der
 * Startfokus auf „Abbrechen“.
 */
import { computed } from 'vue'
import KonfigDialog from './KonfigDialog.vue'
import { useBestaetigung } from '../../composables/useBestaetigung.js'

const { aktuelleAnfrage } = useBestaetigung()
const anfrage = computed(() => aktuelleAnfrage.value)

function abbrechen () { anfrage.value?.erledigen(false) }
function bestaetigt () { anfrage.value?.erledigen(true) }
</script>

<style scoped>
.kb-knopf {
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
}
.kb-knopf--sekundaer { background: var(--cfg-surface); color: var(--cfg-text-secondary); }
.kb-knopf--sekundaer:hover { background: var(--cfg-surface-elevated); }
.kb-knopf--primaer { background: var(--cfg-accent); color: var(--cfg-surface); border-color: var(--cfg-accent); }
.kb-knopf--primaer:hover { opacity: 0.9; }
.kb-knopf--gefahr { background: var(--cfg-danger); color: var(--cfg-surface); border-color: var(--cfg-danger); }
.kb-knopf--gefahr:hover { opacity: 0.9; }
</style>
