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
            <!-- E12 (Testlauf 16.10.2026): sichtbar beschriftet statt winzigem × -->
            <button
              v-if="kannVeroeffentlichen && f.quelle === 'hochgeladen'"
              type="button"
              class="ds-loeschen"
              :aria-label="`Schnitt ${s.gewicht}${s.stil === 'italic' ? ' kursiv' : ''} von ${f.familie} löschen`"
              :data-test="`schnitt-loeschen-${s.id}`"
              @click="loesche(f, s)"
            ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/></svg>Löschen</button>
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

    <p v-if="erfolg" class="ds-erfolg" role="status" data-test="drupal-schrift-erfolg">{{ erfolg }}</p>

    <!-- E9 (Testlauf 16.10.2026): wie „Google-Schrift hinzufügen“ — eine Karte
         mit Plus; erst der Klick öffnet das Formular, danach ist es wieder leer -->
    <div v-if="kannVeroeffentlichen && !formOffen" class="ds-neu">
      <button type="button" class="ds-neu__knopf" data-test="drupal-schrift-neu" @click="oeffneForm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Schriftdatei hochladen</span>
      </button>
    </div>
    <form v-if="kannVeroeffentlichen && formOffen" class="ds-hochladen" data-test="drupal-schrift-hochladen" @submit.prevent="hochladen" @keydown.escape="schliesseForm">
      <h4 class="ds-untertitel">Schriftdatei hochladen</h4>
      <label class="ds-feld">
        <span>Datei (woff2, woff, ttf, otf · höchstens 5 MB) <abbr title="Pflichtfeld">*</abbr></span>
        <input ref="dateiRef" type="file" accept=".woff2,.woff,.ttf,.otf" required @change="dateiGewaehlt" />
      </label>
      <p class="ds-hinweis">Name, Gewicht und Stil werden aus dem Dateinamen vorgeschlagen (z. B. „Kundenschrift-BoldItalic.woff2“ → Kundenschrift, 700, kursiv).</p>
      <label class="ds-feld">
        <span>Schriftfamilie <abbr title="Pflichtfeld">*</abbr></span>
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
      <p v-if="fehler" id="ds-upload-fehler" class="ds-fehlermeldung" role="alert" data-test="drupal-schrift-fehler">{{ fehler }}</p>
      <div class="ds-aktionen">
        <button type="button" class="dk-knopf" @click="schliesseForm">Abbrechen</button>
        <button type="submit" class="dk-knopf dk-knopf--primaer" :disabled="laedt || !neu.datei || !neu.familie.trim()" :aria-describedby="fehler ? 'ds-upload-fehler' : undefined">{{ laedt ? 'Lädt hoch …' : 'Hochladen' }}</button>
      </div>
      <p v-if="!neu.datei" class="ds-hinweis">„Hochladen“ wird aktiv, sobald eine Datei gewählt ist.</p>
    </form>
    <p v-if="loeschFehler" class="ds-fehlermeldung" role="alert">{{ loeschFehler }}</p>
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
import { vorschlagAusDateiname } from '../../utils/schrift-datei.js'

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
const erfolg = ref('')
const fehler = ref('')
const loeschFehler = ref('')
const formOffen = ref(false)
const dateiRef = ref(null)
const neu = reactive({ datei: null, familie: '', gewicht: 400, stil: 'normal' })

function leereForm () {
  Object.assign(neu, { datei: null, familie: '', gewicht: 400, stil: 'normal' })
  fehler.value = ''
  if (dateiRef.value) dateiRef.value.value = ''
}
function oeffneForm () { leereForm(); erfolg.value = ''; formOffen.value = true }
function schliesseForm () { leereForm(); formOffen.value = false }

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
  fehler.value = ''
  if (datei) Object.assign(neu, vorschlagAusDateiname(datei.name))
}

/** UX-50: Klartext statt „Daten abgelehnt — datei: …“ */
function uploadFehlerText (e) {
  const roh = `${e?.message || ''} ${(e?.fehler || []).join(' ')}`.toLowerCase()
  if (/woff2|schrift|font|format|inhalt|magic|typ/.test(roh)) return 'Die Datei ist keine gültige Schriftdatei (woff2, woff, ttf oder otf). Bitte eine andere Datei wählen.'
  if (/gro(ss|ß)|size|5 ?mb|zu lang/.test(roh)) return 'Die Datei ist größer als 5 MB.'
  if (/existiert|vorhanden|doppel|conflict|409/.test(roh)) return 'Diesen Schnitt (Familie, Gewicht, Stil) gibt es schon. Erst den vorhandenen löschen.'
  return `Hochladen fehlgeschlagen: ${meldungFuer(e, 'Hochladen').titel}.`
}

async function hochladen () {
  if (!neu.datei || !neu.familie.trim()) return
  laedt.value = true
  fehler.value = ''
  const name = `${neu.familie.trim()} ${neu.gewicht}${neu.stil === 'italic' ? ' kursiv' : ''}`
  try {
    uebernehmen(await speicher().ladeSchriftHoch(neu.datei, { familie: neu.familie.trim(), gewicht: neu.gewicht, stil: neu.stil }))
    erfolg.value = `${name} hochgeladen.`
    schliesseForm()
  } catch (e) {
    fehler.value = uploadFehlerText(e)
  } finally {
    laedt.value = false
  }
}

async function loesche (f, s) {
  // UX-49: letzter Schnitt einer zugewiesenen Familie → Rolle zurücksetzen
  const letzter = f.schnitte.length === 1
  const rollen = letzter ? ROLLEN.filter(r => istZugewiesen(f.familie, r.token)) : []
  const zusatz = rollen.length
    ? ` Im geöffneten Theme ist ${f.familie} als ${rollen.map(r => r.label).join(' und ')} zugewiesen — diese Rolle${rollen.length > 1 ? 'n bekommen' : ' bekommt'} wieder die NEO-Schrift.`
    : ''
  const ok = await bestaetigen({
    titel: 'Schriftschnitt löschen?',
    text: `${f.familie} ${s.gewicht}${s.stil === 'italic' ? ' kursiv' : ''} wird vom Server gelöscht. Themes, die diese Schrift nutzen, fallen auf die Ersatzschrift zurück.${zusatz}`,
    bestaetigenText: 'Löschen',
    gefaehrlich: true,
  })
  if (!ok) return
  loeschFehler.value = ''
  try {
    uebernehmen(await speicher().loescheSchrift(s.id))
    for (const r of rollen) store.updateFoundationToken('typography', r.token, typo[r.token]?.value)
    erfolg.value = `${f.familie} ${s.gewicht}${s.stil === 'italic' ? ' kursiv' : ''} gelöscht.`
  } catch (e) {
    loeschFehler.value = `Löschen fehlgeschlagen: ${meldungFuer(e, 'Löschen').titel}.`
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
.ds-loeschen { display: inline-flex; align-items: center; gap: 3px; min-height: 24px; margin-left: 4px; padding: 0 6px; border: 1px solid transparent; border-radius: 4px; background: none; color: var(--cfg-text-secondary); cursor: pointer; font-size: 11px; }
.ds-loeschen:hover { color: var(--cfg-danger); border-color: var(--cfg-danger); }
.ds-neu__knopf { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; padding: 16px; border: 1px dashed var(--cfg-border); border-radius: 8px; background: var(--cfg-surface); color: var(--cfg-text-muted); cursor: pointer; font-size: 12px; font-weight: 600; }
.ds-neu__knopf:hover { color: var(--cfg-accent); background: var(--cfg-accent-subtle); }
.ds-hinweis { margin: 0; font-size: 11px; color: var(--cfg-text-secondary); }
.ds-aktionen { display: flex; justify-content: flex-end; gap: 8px; }
.ds-erfolg { margin: 0; font-size: 12px; color: var(--cfg-text); }
.ds-fehlermeldung { margin: 0; padding: 6px 8px; border-radius: 5px; background: var(--cfg-danger-subtle); color: var(--cfg-text); font-size: 12px; border-left: 3px solid var(--cfg-danger); }
.ds-rollen { display: flex; flex-wrap: wrap; gap: 4px; }
.ds-rollen [aria-pressed='true'] { background: var(--cfg-accent-subtle); border-color: var(--cfg-accent); }
.ds-hochladen { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 1px solid var(--cfg-border); }
.ds-untertitel { margin: 0; font-size: 13px; font-weight: 700; color: var(--cfg-text); }
.ds-feld { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--cfg-text-secondary); }
.ds-feld input, .ds-feld select { font: inherit; font-size: 13px; padding: 6px 8px; border: 1px solid var(--cfg-border); border-radius: 5px; background: var(--cfg-surface); color: var(--cfg-text); }
.ds-zeile { display: flex; gap: 8px; }
.ds-zeile .ds-feld { flex: 1; }

</style>
