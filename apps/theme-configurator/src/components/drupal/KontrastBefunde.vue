<template>
  <table class="kb-tabelle" :data-test="dataTest">
    <caption class="kb-titel">{{ titel }}</caption>
    <thead>
      <tr>
        <th scope="col">Modus</th>
        <th scope="col">Vordergrund</th>
        <th scope="col">Hintergrund</th>
        <th scope="col">Kontrast</th>
        <th scope="col">Mindestens</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(b, i) in befunde" :key="i">
        <td>{{ MODUS[b.modus] || b.modus }}</td>
        <td class="dk-mono">{{ b.vordergrund }}</td>
        <td class="dk-mono">{{ b.hintergrund }}</td>
        <td>{{ b.verhaeltnis === null || b.verhaeltnis === undefined ? 'nicht bewertbar' : zahl(b.verhaeltnis) + ':1' }}</td>
        <td>{{ zahl(b.mindestens) }}:1</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
/** Befundliste der Kontrastprüfung (Paare, Werte) — App- und Server-Ergebnis. */
defineProps({
  befunde: { type: Array, required: true },
  titel: { type: String, default: 'Befunde' },
  dataTest: { type: String, default: 'kontrast-befunde' }
})
const MODUS = { light: 'hell', dark: 'dunkel' }
const zahl = (n) => (n === null || n === undefined ? '–' : String(n).replace('.', ','))
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.kb-tabelle { width: 100%; border-collapse: collapse; font-size: 12px; color: var(--cfg-text); }
.kb-titel { text-align: left; font-size: 12px; font-weight: 700; padding-bottom: 6px; }
.kb-tabelle th, .kb-tabelle td { text-align: left; padding: 4px 6px; border-bottom: 1px solid var(--cfg-border); }
.kb-tabelle th { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
</style>
