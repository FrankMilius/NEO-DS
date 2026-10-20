<template>
  <!--
    Erlaubter Bereich eines Felds, dauerhaft sichtbar (Roadmap R06,
    20.10.2026). Das Feld verweist per aria-describedby auf die id, damit
    Screenreader den Bereich schon vor der Eingabe vorlesen. Text aus
    utils/token-pruefung.js (erlaubterBereich) — derselben Quelle wie die
    Fehlermeldung.
  -->
  <span :id="id" class="feld-bereich" data-test="feld-bereich">Erlaubt: {{ text }}</span>
</template>

<script setup>
defineProps({
  /** id für aria-describedby am Feld */
  id: { type: String, required: true },
  /** Bereich, z. B. „0 bis 1, z. B. 0.5“ */
  text: { type: String, required: true },
})
</script>

<style scoped>
.feld-bereich { display: block; font-size: 11px; line-height: 1.4; color: var(--cfg-text-muted); }
</style>
