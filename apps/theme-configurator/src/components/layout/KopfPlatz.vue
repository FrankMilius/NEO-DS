<template>
  <!--
    Platz einer Aktion in der Kopfleiste (R05): in der Leiste oder — wenn sie
    nicht mehr passt — im Menü „Mehr …“ (Ziel #kopf-mehr-<name> in
    AppHeader.vue). Teleport verschiebt dieselbe Komponente samt Zustand.
  -->
  <Teleport :to="`#kopf-mehr-${name}`" :disabled="!imMenue.includes(name)" defer>
    <div class="kopf-platz" :data-kopf-platz="name" data-kopf-mass><slot /></div>
  </Teleport>
</template>

<script setup>
import { useKopfMehr } from '../../composables/useKopfMehr.js'

defineProps({
  /** Name der Aktion, z. B. „exportieren“ (Reihenfolge in AppHeader.vue) */
  name: { type: String, required: true },
})

const { imMenue } = useKopfMehr()
</script>
