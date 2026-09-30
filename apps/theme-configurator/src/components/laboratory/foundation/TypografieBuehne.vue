<template>
  <!-- Typografie: Editor oben, darunter die Magazin-Vorschau mit den
       bearbeiteten Schriften (so wie bisher im LaboratoryPanel). -->
  <TypographyEditor />
  <MagazinVorschau />
</template>

<script setup>
import TypographyEditor from '../../foundation/TypographyEditor.vue'
import MagazinVorschau from '../vorschau/MagazinVorschau.vue'
</script>
