<template>
  <!--
    Bühne „Themes“ (19.10.2026). Vorher: Steckbriefe der vier Theme-Klassen
    (ThemesOverview). Jetzt: derselbe Ausschnitt der Website für das
    geöffnete Theme — Hell und Dunkel, lokal auch in der Variante „Kunde“
    (useVorschauKombinationen). Die technischen Klassen stehen nur bei
    „Technische Namen zeigen“.
  -->
  <div class="tb" data-test="themes-buehne">
    <p class="tb-hinweis">{{ hinweis }}</p>
    <div class="tb-raster">
      <div v-for="k in alle" :key="k.klasse" class="tb-feld">
        <span class="tb-titel">{{ k.label }} <code class="we-technik">.{{ k.klasse }}</code></span>
        <WebsiteAusschnitt :set="k.set" :modus="k.modus" :label="k.label" :komponenten="['card', 'button', 'badge', 'input', 'form-field', 'form-label']">
          <WebsiteBeispiel :id-praefix="`tb-${k.klasse}`" />
        </WebsiteAusschnitt>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import WebsiteAusschnitt from './WebsiteAusschnitt.vue'
import WebsiteBeispiel from './WebsiteBeispiel.vue'
import { useVorschauKombinationen } from '../../../composables/useVorschauKombinationen.js'

// Immer nur das geöffnete Theme (Frank, 19.10.2026): in Drupal Hell und
// Dunkel, lokal zusätzlich seine Variante „Kunde“
const { alle, variantenSichtbar, themaName } = useVorschauKombinationen()
const hinweis = computed(() => {
  const wer = themaName.value ? `„${themaName.value}“` : 'Der NEO-Standard'
  return variantenSichtbar
    ? `${wer} in beiden Varianten (NEO · Kunde) und Modi — derselbe Ausschnitt der Website.`
    : `${wer} in Hell und Dunkel — derselbe Ausschnitt der Website. Welches Theme die Website zeigt, legen Sie mit „Auf der Website aktivieren“ fest.`
})
</script>

<style scoped>
.tb { display: grid; gap: 12px; padding: 16px; }
.tb-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-muted); }
.tb-raster { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
.tb-feld { display: grid; gap: 6px; align-content: start; min-width: 0; }
.tb-titel { font-size: 12px; font-weight: 600; color: var(--cfg-text); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.tb-titel code { font-size: 10px; color: var(--cfg-text-muted); }
</style>
