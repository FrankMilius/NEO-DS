import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  // Gleicher Alias wie in vite.config.js — sonst lassen sich Komponenten,
  // die Recipes laden (RecipeArena, useRecipeLoader), nicht testen.
  resolve: {
    alias: {
      'recipe-sdk': resolve(__dirname, '../../packages/recipe-sdk/index.js'),
      'dtcg-export': resolve(__dirname, '../../packages/dtcg-export/index.js')
    }
  },
  // Der DTCG-Export (Plan v2, 2.2) laedt data/design-tokens.json und
  // styles.css aus dem Wurzelverzeichnis — wie server.fs in vite.config.js.
  server: {
    fs: { allow: [resolve(__dirname, '../..')] }
  },
  test: {
    environment: 'happy-dom',
    // styles.css?raw muss als Text ankommen (sonst liefert Vitest fuer CSS '').
    css: { include: [/styles\.css/] },
    globals: true,
    // 130 Recipes × alle Specimens rendern: unter Last (CI, parallele Dateien)
    // reichen die 5 s Standard nicht immer — einmal lokal beobachtet.
    testTimeout: 15000,
    setupFiles: ['./tests/setup.js'],
    // e2e/ gehoert Playwright (npm run e2e) — *.spec.js dort nicht in Vitest
    exclude: [...configDefaults.exclude, 'e2e/**', 'playwright-report/**', 'test-results/**']
  }
})
