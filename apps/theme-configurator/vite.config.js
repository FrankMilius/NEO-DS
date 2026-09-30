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

            // Seit Plan v2, 4.3 ist der Einstieg ein Build-Ergebnis: er entsteht
      // bei jedem Build aus der versionierten Vorlage.
      const vorlagePfad = resolve(__dirname, '../../config/theme-config.vorlage.html')
      if (!existsSync(vorlagePfad)) {
        console.warn('[sync] config/theme-config.vorlage.html fehlt — Einstieg nicht erzeugt')
        return
      }
      const wrapper = readFileSync(vorlagePfad, 'utf-8')
        .replace('__KONFIG_CSS__', cssMatch[1])
        .replace('__KONFIG_JS__', jsMatch[1])
      writeFileSync(wrapperPath, wrapper)
      console.log(`[sync] theme-config.html erzeugt → ${cssMatch[1]}, ${jsMatch[1]}`)
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
