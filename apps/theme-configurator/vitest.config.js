import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { buildDefine } from './build-info.js'

export default defineConfig({
  plugins: [vue()],
  // Wie vite.config.js: Versionsanzeige im Header (Plan v2, 4.5)
  define: buildDefine(),
  // Gleicher Alias wie in vite.config.js — sonst lassen sich Komponenten,
  // die Recipes laden (RecipeArena, useRecipeLoader), nicht testen.
  resolve: {
    alias: {
      'recipe-sdk': resolve(import.meta.dirname, '../../packages/recipe-sdk/index.js'),
      'dtcg-export': resolve(import.meta.dirname, '../../packages/dtcg-export/index.js'),
      'neo-behaviors': resolve(import.meta.dirname, '../../packages/neo-behaviors/index.js')
    }
  },
  // Der DTCG-Export (Plan v2, 2.2) laedt data/design-tokens.json und
  // styles.css aus dem Wurzelverzeichnis — wie server.fs in vite.config.js.
  server: {
    fs: { allow: [resolve(import.meta.dirname, '../..')] }
  },
  test: {
    environment: 'happy-dom',
    // styles.css?raw muss als Text ankommen (sonst liefert Vitest fuer CSS '').
    css: { include: [/styles\.css/] },
    globals: true,
    // 130 Recipes × alle Specimens rendern: unter Last (CI, parallele Dateien)
    // reichen die 5 s Standard nicht immer — einmal lokal beobachtet.
    testTimeout: 15000,
    // Vitest 5 (R07, 20.10.2026): mit dem Standard-Pool „forks“ brauchte der
    // Lauf 58–66 s (Vitest 4: 52 s) und lief im CI-Gesamtlauf unter Last in
    // Zeitüberschreitungen. „threads“: 41 s, alle Tests grün.
    pool: 'threads',
    setupFiles: ['./tests/setup.js'],
    // e2e/ gehoert Playwright (npm run e2e) — *.spec.js dort nicht in Vitest
    exclude: [...configDefaults.exclude, 'e2e/**', 'playwright-report/**', 'test-results/**']
  }
})
