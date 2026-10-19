<template>
  <!--
    Roadmap V04 (19.10.2026): Bereiche ohne Eingaben zeigen ihren Inhalt nur
    in der Bühne. Vorher stand im Inspector dieselbe Ansicht noch einmal,
    ohne Hinweis, dass hier nichts einzustellen ist.
  -->
  <div class="na" role="note" data-test="nur-ansicht-bereich">
    <p class="na-titel">Nur Ansicht</p>
    <p class="na-text">{{ text }}</p>
    <ul v-if="links.length" class="na-links">
      <li v-for="l in links" :key="l.hash"><a :href="l.hash">{{ l.label }}</a></li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  /** Verweise auf Bereiche, in denen sich die Werte einstellen lassen */
  links: { type: Array, default: () => [] },
})
</script>

<style scoped>
.na { display: grid; gap: 6px; padding: 12px; border-radius: 8px; border: 1px dashed var(--cfg-border); }
.na-titel { margin: 0; font-size: 12px; font-weight: 700; color: var(--cfg-text); }
.na-text { margin: 0; font-size: 12px; line-height: 1.45; color: var(--cfg-text-secondary); }
.na-links { margin: 0; padding-left: 18px; font-size: 12px; }
.na-links a { color: var(--cfg-accent); text-decoration: underline; }
</style>
