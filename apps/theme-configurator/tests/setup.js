/**
 * Vitest Global Setup
 * Stubs für Browser-APIs die in jsdom nicht verfügbar sind.
 */

// localStorage mock (jsdom hat bereits eine grundlegende Implementierung,
// aber wir stellen sicher dass sie für jeden Test frisch ist)
beforeEach(() => {
  localStorage.clear()
})

// Stub für CSS custom properties (getComputedStyle)
// In jsdom sind CSS custom properties nicht verfügbar
if (!window.CSS) {
  window.CSS = { supports: () => false }
}
