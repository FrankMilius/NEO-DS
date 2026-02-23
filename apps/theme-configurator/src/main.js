import { createApp } from 'vue'
import '../../../styles.css'   // NEO Design System — alle --fnd-* und --font-* tokens
import './style.css'         // App-Chrome — --cfg-* tokens (überschreibt DS-Resets wo nötig)
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error(`[Theme Configurator] Unhandled error in ${info}:`, err)
}

app.mount('#app')
