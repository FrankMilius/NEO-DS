<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <div class="error-boundary__icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 9v4" /><path d="M12 17h.01" />
        <path d="M3.262 17.02a2.108 2.108 0 0 1 -.024 -2.106l7.16 -12.62a2.35 2.35 0 0 1 4.2 0l7.16 12.62a2.108 2.108 0 0 1 -1.856 3.106h-14.784a2.108 2.108 0 0 1 -1.856 -1z" />
      </svg>
    </div>
    <p class="error-boundary__title">{{ panelLabel }} konnte nicht geladen werden</p>
    <p class="error-boundary__detail">{{ error.message }}</p>
    <button class="error-boundary__retry" @click="reset">Erneut versuchen</button>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

defineProps({
  panelLabel: { type: String, default: 'Dieses Panel' }
})

const error = ref(null)

function reset() {
  error.value = null
}

onErrorCaptured((err) => {
  error.value = err
  console.error('[ErrorBoundary]', err)
  return false // prevent propagation
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  flex: 1;
  min-height: 200px;
  color: var(--cfg-text-secondary, #666);
  text-align: center;
}

.error-boundary__icon {
  color: var(--cfg-danger);
}

.error-boundary__title {
  font-weight: 600;
  color: var(--cfg-text-primary, #222);
  margin: 0;
}

.error-boundary__detail {
  font-size: 0.85rem;
  max-width: 400px;
  margin: 0;
  opacity: 0.7;
}

.error-boundary__retry {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-accent);
  cursor: pointer;
  font-size: 0.85rem;
  transition: background var(--fnd-motion-duration-150, 0.15s) ease;
}

.error-boundary__retry:hover {
  background: var(--cfg-accent-subtle, color-mix(in srgb, var(--cfg-accent) 8%, transparent));
}
</style>
