<template>
  <section class="ds" aria-labelledby="ds-titel" data-test="drupal-schriften">
    <h3 id="ds-titel" class="ds-titel">
      Schriften auf dem Server
      <span class="ds-zahl">{{ familien.length }}</span>
    </h3>
    <p class="ds-text">
      Liegen in Drupal und werden von dort ausgeliefert — ohne Verbindung zu Google oder anderen Diensten.
      Quelle „hochgeladen“: hier im Konfigurator; Quelle „Server-Ordner“: vom Betrieb per Deployment abgelegt.
    </p>

    <p v-if="ladeFehler" class="ds-fehler" role="alert">{{ ladeFehler }}</p>
    <p v-else-if="!familien.length" class="ds-leer">Noch keine Schriften auf dem Server.</p>

    <ul v-else class="ds-liste">
      <li v-for="f in familien" :key="f.familie" class="ds-familie" :data-test="`drupal-schrift-${f.familie}`">
        <div class="ds-kopf">
          <span class="ds-name" :style="{ fontFamily: `'${f.familie}'` }">{{ f.familie }}</span>
          <span class="ds-quelle" :class="`ds-quelle--${f.quelle}`">{{ f.quelle === 'server' ? 'Server-Ordner' : 'hochgeladen' }}</span>
        </div>
        <p class="ds-probe" :style="{ fontFamily: `'${f.familie}'` }">Aa Bb Cc Ää Öö Üü ß 0123</p>
        <ul class="ds-schnitte" :aria-label="`Schnitte von ${f.familie}`">
          <li v-for="s in f.schnitte" :key="s.id" class="ds-schnitt">
            <span :style="{ fontFamily: `'${f.familie}'`, fontWeight: s.gewicht, fontStyle: s.stil }">{{ s.gewicht }}{{ s.stil === 'italic' ? ' kursiv' : '' }}</span>
            <button
              v-if="kannVeroeffentlichen && f.quelle === 'hochgeladen'"
              type="button"
              class="ds-x"
              :aria-label="`Schnitt ${s.gewicht}${s.stil === 'italic' ? ' kursiv' : ''} von ${f.familie} löschen`"
              @click="loesche(f, s)"
            >×</button>
          </li>
        </ul>
        <div v-if="kannBearbeiten && !gesperrt" class="ds-rollen" role="group" :aria-label="`${f.familie} verwenden als`">
          <button
            v-for="r in ROLLEN"
            :key="r.token"
            type="button"
            class="dk-knopf dk-knopf--klein"
            :aria-pressed="istZugewiesen(f.familie, r.token) ? 'true' : 'false'"
            :data-test="`drupal-schrift-rolle-${r.id}`"
            @click="zuweisen(f.familie, r.token)"
          >Als {{ r.label }}</button>
        </div>
      </li>
    </ul>

    <form v-if="kannVeroeffentlichen" class="ds-hochladen" data-test="drupal-schrift-hochladen" @submit.prevent="hochladen">
      <h4 class="ds-untertitel">Schriftdatei hochladen</h4>
      <label class="ds-feld">
        <span>Datei (woff2, woff, ttf, otf · höchstens 5 MB)</span>
        <input ref="dateiRef" type="file" accept=".woff2,.woff,.ttf,.otf" required @change="dateiGewaehlt" />
      </label>
      <label class="ds-feld">
        <span>Schriftfamilie</span>
        <input v-model="neu.familie" type="text" required maxlength="60" pattern="[A-Za-z0-9 _\-]+" placeholder="z. B. Kundenschrift" />
      </label>
      <div class="ds-zeile">
        <label class="ds-feld">
          <span>Gewicht</span>
          <select v-model="neu.gewicht">
            <option v-for="g in GEWICHTE" :key="g" :value="g">{{ g }}</option>
          </select>
        </label>
        <label class="ds-feld">
          <span>Stil</span>
          <select v-model="neu.stil">
            <option value="normal">normal</option>
            <option value="italic">kursiv</option>
          </select>
        </label>
      </div>
      <button type="submit" class="dk-knopf dk-knopf--primaer" :disabled="laedt">{{ laedt ? 'Lädt hoch …' : 'Hochladen' }}</button>
      <p v-if="meldung" class="ds-meldung" role="status">{{ meldung }}</p>
    </form>
  </section>
</template>

<script setup>
/**
 * DrupalSchriften — lokale Schriften im Drupal-Betrieb (Vertrag 1.1.0,
 * Entscheidung Frank 14.10.2026). Zwei Quellen: hochgeladen (hier, Recht
 * „veröffentlichen“) und Server-Ordner (Deployment des Betriebs). Drupal
 * erzeugt daraus eine @font-face-Datei für Website und App; dieser Baustein
 * hängt sie in die App ein, damit die Vorschau die Schrift zeigt.
 * Zuweisen setzt --font-body / --font-heading / --font-mono des Themes.
 */
import { computed, onMounted, reactive, ref } from 'vue'
import { ladeServerSchriften, serverSchriften, serverSchriftenFehler, uebernehmeSchriften } from '../../composables/useServerSchriften.js'
import { useThemeStore } from '../../stores/theme.js'
import { darf, meldungFuer, speicher } from '../../speicher/index.js'
import { bestaetigen } from '../../composables/useBestaetigung.js'
import { foundationTokens } from '../../data/tokens.js'

const props = defineProps({
  /** NEO-Standard ohne geöffnetes Theme: nicht zuweisbar */
  gesperrt: { type: Boolean, default: false },
})

const store = useThemeStore()
const kannBearbeiten = darf('bearbeiten')
const kannVeroeffentlichen = darf('veroeffentlichen')
const typo = foundationTokens.typography.tokens

const ROLLEN = [
  { id: 'body', label: 'Body', token: 'font-body' },
  { id: 'heading', label: 'Heading', token: 'font-heading' },
  { id: 'mono', label: 'Mono', token: 'font-mono' },
]
const GEWICHTE = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const familien = serverSchriften
const ladeFehler = serverSchriftenFehler
const laedt = ref(false)
const meldung = ref('')
const dateiRef = ref(null)
const neu = reactive({ datei: null, familie: '', gewicht: 400, stil: 'normal' })

/** Ersatzschriften des Standard-Stacks (alles nach der ersten Schrift). */
function rest (token) {
  return String(typo[token]?.value || 'sans-serif').split(',').slice(1).map(s => s.trim()).filter(Boolean).join(', ')
}
const wert = (familie, token) => `'${familie}', ${rest(token)}`
const aktuell = (token) => store.currentFoundation?.typography?.[token] || ''
const istZugewiesen = (familie, token) => aktuell(token).replace(/["']/g, '').split(',')[0].trim() === familie

function zuweisen (familie, token) {
  if (props.gesperrt) return
  store.updateFoundationToken('typography', token, wert(familie, token))
}

const uebernehmen = uebernehmeSchriften
const laden = () => ladeServerSchriften(true)

function dateiGewaehlt (ev) {
  const datei = ev.target.files?.[0] || null
  neu.datei = datei
  meldung.value = ''
  if (datei && !neu.familie) {
    // „Kundenschrift-Bold.woff2“ → „Kundenschrift“
    neu.familie = datei.name.replace(/\.[^.]+$/, '').split(/[-_](?=[^-_]*$)/)[0].replace(/[^A-Za-z0-9 _-]/g, '').slice(0, 60)
  }
}

async function hochladen () {
  if (!neu.datei || !neu.familie.trim()) return
  laedt.value = true
  meldung.value = ''
  try {
    uebernehmen(await speicher().ladeSchriftHoch(neu.datei, { familie: neu.familie.trim(), gewicht: neu.gewicht, stil: neu.stil }))
    meldung.value = `${neu.familie.trim()} ${neu.gewicht}${neu.stil === 'italic' ? ' kursiv' : ''} hochgeladen.`
    neu.datei = null
    if (dateiRef.value) dateiRef.value.value = ''
  } catch (e) {
    meldung.value = meldungFuer(e, 'Hochladen').titel + (e?.message ? ` — ${e.message}` : '')
  } finally {
    laedt.value = false
  }
}

async function loesche (f, s) {
  const ok = await bestaetigen({
    titel: 'Schriftschnitt löschen?',
    text: `${f.familie} ${s.gewicht}${s.stil === 'italic' ? ' kursiv' : ''} wird vom Server gelöscht. Themes, die diese Schrift nutzen, fallen auf die Ersatzschrift zurück.`,
    bestaetigenText: 'Löschen',
    gefaehrlich: true,
  })
  if (!ok) return
  try {
    uebernehmen(await speicher().loescheSchrift(s.id))
  } catch (e) {
    meldung.value = meldungFuer(e, 'Löschen').titel
  }
}

const anzahl = computed(() => familien.value.length)
defineExpose({ laden, anzahl })
onMounted(laden)
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.ds { display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid var(--cfg-border); border-radius: 8px; }
.ds-titel { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 15px; font-weight: 700; color: var(--cfg-text); }
.ds-zahl { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
.ds-text, .ds-leer { margin: 0; font-size: 12px; color: var(--cfg-text-secondary); }
.ds-fehler { margin: 0; font-size: 12px; color: var(--cfg-danger); }
.ds-liste { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.ds-familie { display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: 6px; background: var(--cfg-surface-elevated); }
.ds-kopf { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ds-name { font-size: 16px; font-weight: 600; color: var(--cfg-text); }
.ds-quelle { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 6px; border-radius: 4px; background: var(--cfg-accent-subtle); color: var(--cfg-text); }
.ds-quelle--server { background: var(--cfg-surface); border: 1px solid var(--cfg-border); }
.ds-probe { margin: 0; font-size: 20px; color: var(--cfg-text); }
.ds-schnitte { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px; }
.ds-schnitt { display: inline-flex; align-items: center; gap: 2px; font-size: 12px; padding: 2px 6px; border: 1px solid var(--cfg-border); border-radius: 4px; color: var(--cfg-text); }
.ds-x { min-width: 24px; min-height: 24px; border: none; background: none; color: var(--cfg-text-secondary); cursor: pointer; font-size: 14px; line-height: 1; border-radius: 4px; }
.ds-x:hover { color: var(--cfg-danger); }
.ds-x:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 1px; }
.ds-rollen { display: flex; flex-wrap: wrap; gap: 4px; }
.ds-rollen [aria-pressed='true'] { background: var(--cfg-accent-subtle); border-color: var(--cfg-accent); }
.ds-hochladen { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 1px solid var(--cfg-border); }
.ds-untertitel { margin: 0; font-size: 13px; font-weight: 700; color: var(--cfg-text); }
.ds-feld { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--cfg-text-secondary); }
.ds-feld input, .ds-feld select { font: inherit; font-size: 13px; padding: 6px 8px; border: 1px solid var(--cfg-border); border-radius: 5px; background: var(--cfg-surface); color: var(--cfg-text); }
.ds-zeile { display: flex; gap: 8px; }
.ds-zeile .ds-feld { flex: 1; }
.ds-meldung { margin: 0; font-size: 12px; color: var(--cfg-text); }
</style>
