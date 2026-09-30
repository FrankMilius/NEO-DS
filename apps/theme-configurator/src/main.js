import { createApp } from 'vue'
import { erzeugePinia } from './stores/pinia.js'
import '../../../styles.css'   // NEO Design System — alle --fnd-* und --font-* tokens
import './style.css'         // App-Chrome — --cfg-* tokens (überschreibt DS-Resets wo nötig)
import App from './App.vue'

const app = createApp(App)
app.use(erzeugePinia())

app.config.errorHandler = (err, instance, info) => {
  console.error(`[Theme Configurator] Unhandled error in ${info}:`, err)
}

app.mount('#app')
