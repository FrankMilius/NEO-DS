// Store-Optionen der eigenen Pinia-Plugins (stores/plugins/*.js)
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    /** Aktionen, die einen Undo-Schritt bilden (plugins/verlauf.js) */
    verlauf?: readonly string[]
    /** Aktionen, die der Schreibschutz sperrt (plugins/schreibschutz.js) */
    schreibschutz?: readonly string[]
  }
}
