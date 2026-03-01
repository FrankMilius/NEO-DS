import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Sync-Plugin: Nach dem Build werden die Asset-Hashes aus dem generierten
 * index.html in config/theme-config.html übertragen, damit der Docs-Server
 * immer die aktuellen Bundles referenziert.
 */
function syncThemeConfigHtml() {
  return {
    name: 'sync-theme-config-html',
    closeBundle() {
      const outDir = resolve(__dirname, '../../config/theme-configurator')
      const wrapperPath = resolve(__dirname, '../../config/theme-config.html')

      // Asset-Dateinamen aus dem Build-Output lesen
      const indexHtml = readFileSync(resolve(outDir, 'index.html'), 'utf-8')
      const cssMatch = indexHtml.match(/href="[^"]*\/(assets\/index-[^"]+\.css)"/)
      const jsMatch = indexHtml.match(/src="[^"]*\/(assets\/index-[^"]+\.js)"/)

      if (!cssMatch || !jsMatch) {
        console.warn('[sync] Konnte Asset-Hashes nicht aus index.html extrahieren')
        return
      }

      const basePath = '/config/theme-configurator'
      const cssRef = `${basePath}/${cssMatch[1]}`
      const jsRef = `${basePath}/${jsMatch[1]}`

      let wrapper = readFileSync(wrapperPath, 'utf-8')
      wrapper = wrapper.replace(
        /href="\/config\/theme-configurator\/assets\/index-[^"]+\.css"/,
        `href="${cssRef}"`
      )
      wrapper = wrapper.replace(
        /src="\/config\/theme-configurator\/assets\/index-[^"]+\.js"/,
        `src="${jsRef}"`
      )
      writeFileSync(wrapperPath, wrapper)
      console.log(`[sync] theme-config.html aktualisiert → ${cssMatch[1]}, ${jsMatch[1]}`)
    }
  }
}

export default defineConfig({
  plugins: [vue(), syncThemeConfigHtml()],
  base: '/config/theme-configurator/',
  resolve: {
    alias: {
      'recipe-sdk': resolve(__dirname, '../../packages/recipe-sdk/index.js')
    }
  },
  build: {
    outDir: '../../config/theme-configurator',
    emptyOutDir: true
  }
})
