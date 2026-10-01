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
        <input id="cfg-drupal-neu-name" v-model="name" type="text" autocomplete="off" placeholder="z. B. Stadtwerke Musterstadt" required />
      </div>
      <div class="dk-feld">
        <label for="cfg-drupal-neu-version">Version</label>
        <input id="cfg-drupal-neu-version" v-model="version" type="text" autocomplete="off" placeholder="1.0.0" />
      </div>
    </form>
    <template #fuss>
      <button type="button" class="dk-knopf" @click="abbrechen">Abbrechen</button>
      <button
        type="submit"
        form="cfg-drupal-neu-form"
        class="dk-knopf dk-knopf--primaer"
        data-test="drupal-neu-anlegen"
        :disabled="!name.trim() || laeuft"
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

const betrieb = useDrupalBetrieb()
const anfrage = computed(() => betrieb.zustand.anlegen)
const name = ref('')
const version = ref('1.0.0')
const laeuft = ref(false)

const beschreibung = computed(() => anfrage.value?.vomStandard
  ? 'Das neue Theme startet vom aktuellen NEO-Standard (Set „Customer“). Gespeichert werden nur deine Abweichungen — ein neuer NEO-Standard wirkt automatisch überall dort, wo du nichts geändert hast.'
  : 'Der aktuelle Stand ist noch nicht in Drupal gespeichert. Gib dem Theme einen Namen, um es anzulegen.')

watch(anfrage, (a) => {
  if (a) { name.value = ''; version.value = '1.0.0'; laeuft.value = false }
})

function abbrechen () { betrieb.zustand.anlegen = null }

async function anlegen () {
  const n = name.value.trim()
  if (!n || laeuft.value) return
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
