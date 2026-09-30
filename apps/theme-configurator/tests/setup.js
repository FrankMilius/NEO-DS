/**
 * Vitest Global Setup
 * Stubs für Browser-APIs die in jsdom nicht verfügbar sind.
 */

// localStorage mock (jsdom hat bereits eine grundlegende Implementierung,
// aber wir stellen sicher dass sie für jeden Test frisch ist)
import { setActivePinia, createPinia } from 'pinia'

// Pinia: jeder Test bekommt eine frische Instanz (Stores teilen weiter den
// Modul-State, wie vor der Umstellung).
setActivePinia(createPinia())

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

// Stub für CSS custom properties (getComputedStyle)
// In jsdom sind CSS custom properties nicht verfügbar
if (!window.CSS) {
  window.CSS = { supports: () => false }
}
