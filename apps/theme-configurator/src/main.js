import { createApp } from 'vue'
import { erzeugePinia } from './stores/pinia.js'
import '../../../styles.css'   // NEO Design System — alle --fnd-* und --font-* tokens
import './style.css'         // App-Chrome — --cfg-* tokens (überschreibt DS-Resets wo nötig)
import './app-darstellung.scss' // App-Darstellung Dunkel: Werte des dunklen NEO-Themes (R03)
import App from './App.vue'
// App-Darstellung vor dem ersten Zeichnen setzen (kein helles Aufblitzen, R03)
import './composables/useAppDarstellung.js'

const app = createApp(App)
app.use(erzeugePinia())

app.config.errorHandler = (err, instance, info) => {
  console.error(`[Theme Configurator] Unhandled error in ${info}:`, err)
}

app.mount('#app')
