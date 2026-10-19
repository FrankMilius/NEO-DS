<template>
  <div class="icons-inspector" data-test="icons-inspector">
    <!--
      Befund UX-37 (19.10.2026): Vorher stand hier „Select a section from the
      sidebar to begin editing.“, obwohl die Icon-Seite offen war. Bearbeitet
      wird in der Bühne; der Inspector sagt, was davon die Website erreicht.
    -->
    <h3 class="ii-titel">Icons</h3>
    <p class="ii-text">
      Die Einstellungen bearbeiten Sie in der Bühne links. Hier steht, welche davon auf der Website ankommen.
    </p>

    <section class="ii-gruppe" aria-labelledby="ii-wirkt">
      <h4 id="ii-wirkt" class="ii-untertitel">Wirkt auf der Website</h4>
      <ul class="ii-liste">
        <li>
          <span class="ii-name">Mindestgröße Touch-Ziel</span>
          <code>--nc-icon-touch-target</code>
          <span class="ii-wert" data-test="icons-touch-ziel">{{ touchZiel }}</span>
        </li>
      </ul>
    </section>

    <section class="ii-gruppe" aria-labelledby="ii-vorschau">
      <h4 id="ii-vorschau" class="ii-untertitel">Nur Vorschau im Konfigurator</h4>
      <p class="ii-text">
        Diese Werte werden gespeichert, aber nicht exportiert. Die Komponenten des Design Systems setzen
        Strichstärke und Größe ihrer Icons selbst; es gibt dafür noch keine gemeinsame Variable.
      </p>
      <ul class="ii-liste" data-test="icons-nur-vorschau">
        <li><span class="ii-name">Strichstärke je Größe</span></li>
        <li><span class="ii-name">Strichfarbe hell und dunkel</span></li>
        <li><span class="ii-name">Standardgröße</span></li>
        <li><span class="ii-name">Eigene Icon-Bibliotheken</span></li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const store = useThemeStore()
const touchZiel = computed(() => store.currentFoundation.elements?.['icon-touch-target'] ?? '44px')
</script>

<style scoped>
.icons-inspector { display: flex; flex-direction: column; gap: 12px; }
.ii-titel { margin: 0; font-size: 14px; font-weight: 700; color: var(--cfg-text); }
.ii-untertitel { margin: 0 0 6px; font-size: 12px; font-weight: 700; color: var(--cfg-text); }
.ii-text {
  margin: 0;
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
  color: var(--cfg-text-secondary, var(--cfg-text));
}
.ii-gruppe {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
}
.ii-liste { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.ii-liste li { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; font-size: 12px; color: var(--cfg-text); }
.ii-liste code { font-size: 11px; color: var(--cfg-text-secondary); }
.ii-wert { margin-left: auto; font-family: monospace; font-size: 11px; }
</style>
