<template>
  <div v-if="!kannBearbeiten" class="drh" role="status" data-test="nur-ansicht">
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
    <p class="drh-text">
      <strong>Nur Ansicht</strong> – dir fehlt das Recht ‚bearbeiten‘. Du kannst Themes öffnen und ansehen;
      die Editoren sind gesperrt, und nichts wird in Drupal gespeichert.
    </p>
  </div>
</template>

<script setup>
/** Banner im Drupal-Betrieb ohne Recht „bearbeiten“ (Plan v2, 2.6, Teil 2). */
import { darf } from '../../speicher/index.js'
const kannBearbeiten = darf('bearbeiten')
</script>

<style scoped>
.drh {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--cfg-warning-subtle);
  border-bottom: 1px solid var(--cfg-warning);
  color: var(--cfg-text);
  font-family: var(--cfg-font-body);
}
.drh-text { margin: 0; font-size: 12px; line-height: 1.4; }
</style>
