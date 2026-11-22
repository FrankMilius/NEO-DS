// Vorlage: blog-article — ganzer Artikel nach Entwurf A aus _blog.js (wie
// data/markup/blog-article.html, I15 Phase 1, 22.11.2026): Kategorie, Titel,
// Untertitel, Byline, Teilen-Leiste, Hauptbild mit Bildunterschrift, Prosa
// mit Zitat und Zwischentitel, Tags. Titel als h2, weil die Arena-Seite
// ihre eigene Ueberschrift hat. figure=without laesst das Hauptbild weg.
import { artikel } from './_blog.js'

export default (zelle, m) => artikel({
  klasse: m.klasse,
  titelEbene: 2,
  mitBild: (m.wert('figure') || 'with') === 'with',
  attrs: ` style="inline-size: 100%;"${m.attrs}`
})
