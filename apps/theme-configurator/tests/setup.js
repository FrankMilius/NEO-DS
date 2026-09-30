/**
 * Vitest Global Setup
 * Stubs für Browser-APIs die in jsdom nicht verfügbar sind.
 */

// localStorage mock (jsdom hat bereits eine grundlegende Implementierung,
// aber wir stellen sicher dass sie für jeden Test frisch ist)
import { setActivePinia } from 'pinia'
import { createApp } from 'vue'
import { erzeugePinia } from '../src/stores/pinia.js'

// Pinia wendet Plugins (Verlauf) erst an, wenn die Instanz an einer App haengt.
function testPinia() {
  const pinia = erzeugePinia()
  createApp({}).use(pinia)
  return pinia
}

// Pinia: jeder Test bekommt eine frische Instanz (Stores teilen weiter den
// Modul-State, wie vor der Umstellung).
setActivePinia(testPinia())

beforeEach(() => {
  localStorage.clear()
  setActivePinia(testPinia())
})

// Stub für CSS custom properties (getComputedStyle)
// In jsdom sind CSS custom properties nicht verfügbar
if (!window.CSS) {
  window.CSS = { supports: () => false }
}
