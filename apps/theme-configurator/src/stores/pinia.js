// Pinia-Instanz der App mit allen Plugins — von main.js und den Tests genutzt,
// damit beide dasselbe Verhalten haben (Plan v2, 3.3c).
import { createPinia } from 'pinia'
import { verlaufPlugin } from './plugins/verlauf.js'

export function erzeugePinia() {
  const pinia = createPinia()
  pinia.use(verlaufPlugin)
  return pinia
}
