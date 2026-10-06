// Vorlage: scroll-expand — „beschrieben, nicht gebaut" (Recipe domNotes,
// Entscheidung 25.08.2026): fuer .nc-scroll-expand gibt es weder SCSS noch
// Verhalten. Die Arena setzt keine wirkungslose Klasse, sondern zeigt die
// Zelle als „nicht gebaut" (arena-templates/_layout.js); „Abspielen" bleibt
// mit Grund gesperrt. Das Recipe bleibt die Spezifikation fuer den Bau
// (Status draft).
import { nichtGebaut } from './_layout.js'

export default (zelle, m) => nichtGebaut(m, [m.root])

export const abspielen = {
  hinweis: '',
  gesperrt: 'Nicht gebaut: .nc-scroll-expand hat weder SCSS noch Verhalten (Recipe-Status draft, Entscheidung 25.08.2026) — nichts zum Abspielen.'
}
