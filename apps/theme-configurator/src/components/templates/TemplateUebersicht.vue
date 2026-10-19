<template>
  <!--
    Roadmap V05 (19.10.2026): ein Bereich für alle Seitenvorlagen statt
    einer weiteren Magazin-Seite. Die Skizzen folgen den Farben des Themes.
  -->
  <div class="tu" data-test="template-uebersicht">
    <p class="tu-hinweis">Seitenvorlagen setzen sich aus Foundation und Komponenten zusammen. Ihre Skizzen folgen den aktuellen Farben; eigene Werte haben sie nicht.</p>
    <div class="tu-raster">
      <TemplatePlaceholder v-for="id in VORLAGEN" :key="id" :templateId="id" />
    </div>
  </div>
</template>

<script setup>
import TemplatePlaceholder from './TemplatePlaceholder.vue'

const VORLAGEN = ['hero', 'content', 'dashboard', 'form', 'settings', 'error']
</script>

<style scoped>
.tu { display: grid; gap: 16px; }
.tu-hinweis { margin: 0; font-size: 12px; line-height: 1.45; color: var(--cfg-text-secondary); }
.tu-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
</style>
