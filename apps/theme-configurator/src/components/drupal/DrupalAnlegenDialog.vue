<template>
  <KonfigDialog
    :offen="!!anfrage"
    :titel="anfrage?.vomStandard ? 'Neues Theme anlegen' : 'Als neues Theme speichern'"
    :beschreibung="beschreibung"
    start-fokus="#cfg-drupal-neu-name"
    @schliessen="abbrechen"
  >
    <form id="cfg-drupal-neu-form" class="dn-form" @submit.prevent="anlegen">
      <div class="dk-feld">
        <label for="cfg-drupal-neu-name">Name</label>
        <input id="cfg-drupal-neu-name" v-model="name" type="text" autocomplete="off" placeholder="z. B. Stadtwerke Musterstadt" required
          :aria-invalid="nameFehler ? 'true' : undefined" :aria-describedby="nameFehler ? 'cfg-drupal-neu-name-fehler' : undefined" />
        <p v-if="nameFehler" id="cfg-drupal-neu-name-fehler" class="dk-feldfehler" role="alert" data-test="drupal-neu-name-fehler">{{ nameFehler }}</p>
      </div>
      <div class="dk-feld">
        <label for="cfg-drupal-neu-version">Version</label>
        <input id="cfg-drupal-neu-version" v-model="version" type="text" autocomplete="off" placeholder="1.0.0"
          :aria-invalid="versionFehler ? 'true' : undefined" :aria-describedby="versionFehler ? 'cfg-drupal-neu-version-fehler' : undefined" />
        <p v-if="versionFehler" id="cfg-drupal-neu-version-fehler" class="dk-feldfehler" role="alert" data-test="drupal-neu-version-fehler">{{ versionFehler }}</p>
      </div>
    </form>
    <template #fuss>
      <button type="button" class="dk-knopf" @click="abbrechen">Abbrechen</button>
      <button
        type="submit"
        form="cfg-drupal-neu-form"
        class="dk-knopf dk-knopf--primaer"
        data-test="drupal-neu-anlegen"
        :disabled="!name.trim() || !!nameFehler || !!versionFehler || laeuft"
      >{{ laeuft ? 'Wird angelegt …' : 'Anlegen' }}</button>
    </template>
  </KonfigDialog>
</template>

<script setup>
/**
 * DrupalAnlegenDialog — neues Theme in Drupal (Plan v2, 2.6, Teil 2)
 * vomStandard: true  → „Neu anlegen“ in der Theme-Auswahl: Start vom NEO-Standard
 * vomStandard: false → Speichern (Strg+S) ohne Drupal-Theme: aktueller Stand
 */
import { computed, ref, watch } from 'vue'
import KonfigDialog from '../ui/KonfigDialog.vue'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'

import { useThemeStore } from '../../stores/theme.js'
const betrieb = useDrupalBetrieb()
const store = useThemeStore()
const anfrage = computed(() => betrieb.zustand.anlegen)
const name = ref('')
const version = ref('1.0.0')
const laeuft = ref(false)

const beschreibung = computed(() => anfrage.value?.vomStandard
  ? 'Das neue Theme startet als Kopie des aktuellen NEO-Standards. Gespeichert werden nur deine Abweichungen — ein neuer NEO-Standard wirkt automatisch überall dort, wo du nichts geändert hast.'
  : 'Der aktuelle Stand ist noch nicht in Drupal gespeichert. Gib dem Theme einen Namen, um es anzulegen.')

watch(anfrage, (a) => {
  if (a) { name.value = ''; version.value = '1.0.0'; laeuft.value = false }
})

// UX-24: eindeutige Namen, Version im Format 1.0.0
const nameFehler = computed(() => {
  const n = name.value.trim().toLowerCase()
  if (!n) return ''
  return (store.state.savedThemes || []).some(t => String(t.name || '').trim().toLowerCase() === n)
    ? 'Ein Theme mit diesem Namen gibt es schon. Bitte einen anderen Namen wählen.'
    : ''
})
const versionFehler = computed(() => {
  const v = version.value.trim()
  return !v || /^\d+\.\d+\.\d+$/.test(v) ? '' : 'Version bitte im Format 1.0.0 (drei Zahlen mit Punkt).'
})
function abbrechen () { betrieb.zustand.anlegen = null }

async function anlegen () {
  const n = name.value.trim()
  if (!n || laeuft.value || nameFehler.value || versionFehler.value) return
  laeuft.value = true
  try {
    await betrieb.anlegen({ name: n, version: version.value.trim() || '1.0.0', vomStandard: !!anfrage.value?.vomStandard })
  } finally {
    laeuft.value = false
  }
}
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dn-form { display: flex; flex-direction: column; gap: 12px; }
</style>
