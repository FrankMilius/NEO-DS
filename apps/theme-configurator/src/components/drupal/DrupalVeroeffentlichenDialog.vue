<template>
  <KonfigDialog
    :offen="offen"
    titel="Theme veröffentlichen"
    groesse="lg"
    start-fokus="[data-start-fokus]"
    @schliessen="schliessen"
  >
    <p class="dk-text">
      <strong>{{ meta?.name || 'Kein Theme geöffnet' }}</strong>
      <template v-if="meta"> · v{{ meta.version }} · Set „{{ setName }}“</template>
    </p>

    <!-- Erfolg -->
    <div v-if="phase === 'erfolg'" class="dk-kasten dk-kasten--ok" role="status" data-test="veroeffentlichen-erfolg">
      <p class="dk-kasten-titel">Veröffentlicht (CSS-Version {{ ergebnis?.css?.version }})</p>
      <p v-if="ergebnis?.css?.ausgeliefert" class="dk-text">
        Das Theme ist aktiv: Drupal liefert die neue CSS-Datei über den Override in der Theme-Library des
        Frontend-Themes aus (<span class="dk-mono">{{ ergebnis.css.pfad }}</span>) und leert die betroffenen Caches.
        Bis die Änderung überall sichtbar ist, können Browser- oder Seiten-Caches kurz noch den alten Stand zeigen.
      </p>
      <p v-else class="dk-text">
        Ausgeliefert wird erst das <strong>aktive</strong> Theme: Beim Aktivieren legt Drupal die CSS-Datei an den Pfad,
        den der Override in der Theme-Library des Frontend-Themes referenziert, und leert die Caches.
      </p>
      <div v-if="!aktiv && kannVeroeffentlichen">
        <button type="button" class="dk-knopf dk-knopf--primaer" data-test="veroeffentlichen-aktivieren" :disabled="aktiviert" @click="jetztAktivieren">
          {{ aktiviert ? 'Aktiviert' : 'Jetzt aktivieren' }}
        </button>
      </div>
      <p v-if="aktiviert" class="dk-text" data-test="aktiviert-hinweis">„{{ meta?.name }}“ ist jetzt das aktive Theme.</p>
    </div>

    <template v-else>
      <!-- Kontrastprüfung der App -->
      <div
        class="dk-kasten"
        :class="kontrast?.bestanden ? 'dk-kasten--ok' : 'dk-kasten--fehler'"
        data-test="kontrast-ergebnis"
      >
        <p class="dk-kasten-titel">
          Kontrastprüfung {{ kontrast?.bestanden ? 'bestanden' : 'nicht bestanden' }}
        </p>
        <p class="dk-text">
          <template v-if="kontrast?.bestanden">Alle {{ kontrast.ergebnisse.length }} Farbpaare (hell und dunkel) erreichen den Mindestkontrast.</template>
          <template v-else>{{ appBefunde.length }} {{ appBefunde.length === 1 ? 'Paar erreicht' : 'Paare erreichen' }} den Mindestkontrast nicht. Veröffentlichen ist gesperrt, bis die Farben korrigiert sind — ein Übergehen gibt es nicht.</template>
        </p>
        <KontrastBefunde v-if="appBefunde.length" :befunde="appBefunde" titel="Befunde der App" />
        <p class="dk-text dvd-klein">{{ kontrast?.verfahren }}</p>
      </div>

      <!-- Server lehnt ab (422) -->
      <div v-if="phase === 'abgelehnt'" class="dk-kasten dk-kasten--fehler" role="alert" data-test="server-befunde">
        <p class="dk-kasten-titel">Drupal hat das Veröffentlichen abgelehnt</p>
        <p class="dk-text">{{ serverText }}</p>
        <KontrastBefunde v-if="serverBefunde.length" :befunde="serverBefunde" titel="Befunde des Servers" data-test="server-kontrast-befunde" />
      </div>

      <div v-if="phase === 'fehler'" class="dk-kasten dk-kasten--fehler" role="alert" data-test="veroeffentlichen-fehler">
        <p class="dk-kasten-titel">{{ fehler.titel }}</p>
        <p class="dk-text">{{ fehler.text }}</p>
      </div>

      <div v-if="sperre" class="dk-kasten dk-kasten--warnung" data-test="veroeffentlichen-sperre">
        <p class="dk-text">{{ sperre }}</p>
      </div>
    </template>

    <template #fuss>
      <button type="button" class="dk-knopf" data-start-fokus @click="schliessen">{{ phase === 'erfolg' ? 'Schließen' : 'Abbrechen' }}</button>
      <button
        v-if="phase !== 'erfolg'"
        type="button"
        class="dk-knopf dk-knopf--primaer"
        data-test="veroeffentlichen-los"
        :disabled="!!sperre || !kontrast?.bestanden || phase === 'laeuft'"
        @click="veroeffentlichen"
      >{{ phase === 'laeuft' ? 'Wird veröffentlicht …' : 'Veröffentlichen' }}</button>
    </template>
  </KonfigDialog>
</template>

<script setup>
/**
 * DrupalVeroeffentlichenDialog (Plan v2, 2.6, Teil 2)
 * - zeigt die Kontrastprüfung der App sofort (bestanden / Befundliste)
 * - Veröffentlichen nur bei bestanden, gespeichertem Stand und Recht
 *   „veröffentlichen“ (kein Übergehen, ADR-002 Frage 2)
 * - Server-422 → Befunde des Servers; 412 → Konfliktdialog
 * - Erfolg → Hinweis zur Auslieferung über die Theme-Library (ADR-002, Folge 2)
 */
import { computed, ref, watch } from 'vue'
import KonfigDialog from '../ui/KonfigDialog.vue'
import KontrastBefunde from './KontrastBefunde.vue'
import { useThemeStore } from '../../stores/theme.js'
import { darf, meldungFuer } from '../../speicher/index.js'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'

const store = useThemeStore()
const betrieb = useDrupalBetrieb()
const kannVeroeffentlichen = darf('veroeffentlichen')

const offen = computed(() => betrieb.zustand.veroeffentlichenOffen)
const meta = computed(() => store.state.currentThemeMeta)
const setName = computed(() => (store.state.activeThemeSet === 'neo' ? 'Neo' : 'Customer'))
const aktiv = computed(() => !!store.state.savedThemes.find(t => t.id === meta.value?.id)?.aktiv)

const kontrast = ref(null)
const phase = ref('pruefen') // pruefen | laeuft | abgelehnt | fehler | erfolg
const ergebnis = ref(null)
const serverKontrast = ref(null)
const serverText = ref('')
const fehler = ref({ titel: '', text: '' })
const aktiviert = ref(false)

const nichtBestanden = (k) => (k?.ergebnisse || []).filter(e => e.bestanden !== true)
const appBefunde = computed(() => nichtBestanden(kontrast.value))
const serverBefunde = computed(() => nichtBestanden(serverKontrast.value))

const sperre = computed(() => {
  if (!kannVeroeffentlichen) return 'Dir fehlt das Recht „veröffentlichen“.'
  if (!meta.value?.id) return 'Das Theme ist noch nicht in Drupal gespeichert. Bitte zuerst speichern (Strg+S).'
  const s = betrieb.zustand.status
  if (s === 'ungespeichert' || s === 'fehler' || s === 'speichert') return 'Es gibt ungespeicherte Änderungen. Veröffentlicht wird der in Drupal gespeicherte Stand — bitte zuerst speichern (Strg+S).'
  return ''
})

watch(offen, (o) => {
  if (!o) return
  kontrast.value = store.pruefeThemeKontrast()
  phase.value = 'pruefen'
  ergebnis.value = null
  serverKontrast.value = null
  serverText.value = ''
  aktiviert.value = false
}, { immediate: true })

function schliessen () { betrieb.zustand.veroeffentlichenOffen = false }

async function veroeffentlichen () {
  if (sperre.value || !kontrast.value?.bestanden) return
  phase.value = 'laeuft'
  try {
    ergebnis.value = await store.veroeffentlicheTheme()
    phase.value = 'erfolg'
    betrieb.merkeStand()
    await betrieb.ladeKatalog()
  } catch (e) {
    if (e?.art === 'veraltet') {
      schliessen()
      betrieb.zustand.konflikt = e
      return
    }
    if (e?.art === 'ungueltig' && e.details?.kontrast) {
      // App-seitig nicht bestanden (details = Ergebnis) oder Server-422 (details.kontrast)
      serverKontrast.value = e.details.kontrast
      serverText.value = e.message
      phase.value = 'abgelehnt'
      return
    }
    fehler.value = meldungFuer(e, 'Veröffentlichen')
    phase.value = 'fehler'
  }
}

async function jetztAktivieren () {
  if (await betrieb.aktivieren(meta.value.id)) aktiviert.value = true
}
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dvd-klein { font-size: 11px; color: var(--cfg-text-secondary); }
</style>
