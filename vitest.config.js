import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,mjs}'],
    exclude: ['apps/**', 'node_modules/**'],
    reporters: ['verbose'],
    passWithNoTests: false,
    // Full Sass build of main.scss once per run; tests read it via
    // tests/_hilfen/voll-css.mjs (02.11.2026 — before: ~15 builds per run).
    globalSetup: ['./tests/_setup/voll-css.mjs'],
    // Same margin as apps/theme-configurator: the workstation carries other
    // load (browsers, file watchers) the suite cannot control.
    testTimeout: 15000,
    hookTimeout: 30000,
  },
});
