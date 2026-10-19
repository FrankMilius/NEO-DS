<template>
  <!-- Roadmap V02 (19.10.2026): Wo wirkt eine Änderung auf der Website? -->
  <section class="we" aria-labelledby="we-titel" data-test="website-einsatz">
    <h3 id="we-titel" class="we-titel">Wirkt auf der Website</h3>
    <template v-if="orte.length">
      <p v-if="bloecke.length" class="we-text" data-test="website-einsatz-bloecke">
        <strong>{{ bloecke.length === 1 ? 'Block' : 'Blöcke' }}:</strong> {{ bloecke.join(', ') }}
      </p>
      <p v-if="weitere.length" class="we-text">
        <strong>{{ bloecke.length ? 'Außerdem' : 'Bereiche' }}:</strong> {{ weitere.join(', ') }}
      </p>
      <p class="we-hinweis">Änderungen zeigen sich dort, sobald das Theme veröffentlicht ist.</p>
      <details v-if="technik" class="we-technik" data-test="website-einsatz-dateien">
        <summary>Templates in neo_fe ({{ dateien.length }})</summary>
        <ul class="we-liste">
          <li v-for="d in dateien" :key="d"><code>{{ d }}</code></li>
        </ul>
        <p v-if="stand" class="we-stand">Stand der Auswertung: neo_fe {{ stand }}</p>
      </details>
    </template>
    <p v-else class="we-text" data-test="website-einsatz-keiner">
      Kein Template der Website nutzt {{ label }} direkt. Änderungen wirken in der Vorschau und überall dort, wo andere Bauteile es einbinden.
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { WEBSITE_EINSATZ, WEBSITE_EINSATZ_STAND } from '../../data/website-einsatz.generated.js'

const props = defineProps({
  componentId: { type: String, required: true },
  label: { type: String, default: '' },
  /** Technische Angaben (Template-Dateien, Stand) zeigen */
  technik: { type: Boolean, default: true },
})

const stand = WEBSITE_EINSATZ_STAND
const orte = computed(() => WEBSITE_EINSATZ[props.componentId] || [])
// „Block „Hero““ → „Hero“; alles andere (Seitenrahmen, Inhaltstypen …) gesondert
const bloecke = computed(() => orte.value.map((o) => o.ort.match(/^Block „(.+)“$/)?.[1]).filter(Boolean))
const weitere = computed(() => orte.value.filter((o) => !/^Block „/.test(o.ort)).map((o) => o.ort))
const dateien = computed(() => [...new Set(orte.value.flatMap((o) => o.dateien))].sort())
</script>

<style scoped>
.we { display: grid; gap: 4px; padding: 10px 12px; border-radius: 8px; background: var(--cfg-surface-elevated); }
.we-titel { margin: 0 0 2px; font-size: 12px; font-weight: 700; color: var(--cfg-text); }
.we-text { margin: 0; font-size: 12px; line-height: 1.45; color: var(--cfg-text); }
.we-text strong { font-weight: 600; }
.we-hinweis { margin: 2px 0 0; font-size: 11px; color: var(--cfg-text-secondary); }
.we-technik { font-size: 11px; color: var(--cfg-text-secondary); }
.we-technik summary { cursor: pointer; }
.we-technik summary:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 2px; }
.we-liste { margin: 4px 0; padding-left: 16px; display: grid; gap: 2px; }
.we-liste code { font-size: 10px; word-break: break-all; }
.we-stand { margin: 0; font-size: 10px; }
</style>
