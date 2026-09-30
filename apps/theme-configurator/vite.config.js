import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Sync-Plugin: Nach dem Build werden die Asset-Hashes aus dem generierten
 * index.html in config/theme-config.html übertragen, damit der Docs-Server
 * immer die aktuellen Bundles referenziert.
 */
function syncThemeConfigHtml() {
  return {
    name: 'sync-theme-config-html',
    apply: 'build',
    // writeBundle statt closeBundle: unter Vite 7 (Environment-API) feuert
    // closeBundle, BEVOR index.html im outDir liegt — der Build brach dort mit
    // ENOENT ab, nachdem emptyOutDir das Zielverzeichnis bereits geleert
    // hatte. Ergebnis war ein leeres config/theme-configurator/.
    // writeBundle laeuft, wenn die Dateien geschrieben sind.
    writeBundle() {
      const outDir = resolve(__dirname, '../../config/theme-configurator')
      const wrapperPath = resolve(__dirname, '../../config/theme-config.html')

      // Zweite Absicherung: lieber warnen als den Build abbrechen. Der Sync
      // der Hashes ist Komfort, kein Grund, ein geleertes Zielverzeichnis
      // zurueckzulassen.
      if (!existsSync(outDir + '/index.html')) {
        console.warn('[sync] index.html noch nicht im outDir — Hash-Sync uebersprungen')
        return
      }
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

      if (!existsSync(wrapperPath)) {
        console.warn('[sync] config/theme-config.html fehlt — Hash-Sync uebersprungen')
        return
      }
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
      'recipe-sdk': resolve(__dirname, '../../packages/recipe-sdk/index.js'),
      'dtcg-export': resolve(__dirname, '../../packages/dtcg-export/index.js')
    }
  },
  server: {
    // main.js importiert ../../../styles.css — das gebaute Stylesheet des
    // Design Systems im Wurzelverzeichnis. Darin stehen @font-face-Regeln, die
    // auf ../fonts/*.woff2 zeigen, also ebenfalls ausserhalb dieser App.
    //
    // Vite laesst Dateien ausserhalb des Projektordners nur ueber @fs zu und
    // verweigert sie ohne diese Freigabe mit 403. Gemessen: zwei 403 auf
    // manrope-var-latin.woff2 und spacegrotesk-var-latin.woff2 — der
    // Konfigurator lief damit in der Ersatzschrift und sah nicht aus wie das
    // System, das er einstellen soll.
    fs: {
      allow: [resolve(__dirname, '../..')],
    },
    proxy: {
      '/api': {
        // 127.0.0.1 statt localhost: der Docs-Server lauscht nur auf IPv4-
        // Loopback; localhost loest unter macOS zuerst zu ::1 auf.
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../../config/theme-configurator',
    emptyOutDir: true
  }
})
