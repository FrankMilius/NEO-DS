// Beispieldaten der Magazin-Vorschau (Theme Preview Mag).
// Ausgelagert aus LaboratoryPanel.vue (Plan v2, 3.4) — Inhalte unveraendert.

export const magTabs = [
  { id: 'feature', label: 'Feature Story' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'longform', label: 'Longform' }
]

export const feedItems = [
  {
    id: 1, kicker: 'UX', img: 'https://picsum.photos/640/420?random=211',
    imgAlt: 'Symbolbild: Hände tippen auf Laptop, Detailaufnahme.',
    title: 'Microinteractions, die sich nicht nach „UI" anfühlen',
    desc: 'Kurze Animationen, klare Zustände, weniger Lärm: kleine Details, große Wirkung.',
    date: '2026-02-18', dateLabel: '18. Feb 2026', series: 'Serie: Interface Notes',
    tags: ['#Delight']
  },
  {
    id: 2, kicker: 'Design Systems', img: 'https://picsum.photos/640/420?random=212',
    imgAlt: 'Symbolbild: Nachtstadt mit Lichtern, weiche Unschärfe.',
    title: 'Dark Mode ohne Grauschleier',
    desc: 'Kontrast ist nicht nur Helligkeit: Es geht um Ebenen, Textfarben und Fokus.',
    date: '2026-02-16', dateLabel: '16. Feb 2026', series: null,
    tags: ['#Tokens', '#Contrast']
  },
  {
    id: 3, kicker: 'Editorial', img: 'https://picsum.photos/640/420?random=213',
    imgAlt: 'Symbolbild: Magazinlayout auf Papier, Ansicht von oben.',
    title: 'Cards sind keine Kacheln',
    desc: 'Mit Typo, Spacing und Hierarchie werden Cards zu echten Mini-Geschichten.',
    date: '2026-02-14', dateLabel: '14. Feb 2026', series: null,
    tags: ['#Layout']
  }
]

export const perfData = [
  { cat: 'Unique Reader', val: '128.400', trend: '▲ 12%', note: 'Mehr Reichweite durch bessere Lesbarkeit' },
  { cat: 'Ø Lesezeit', val: '6:48', trend: '▲ 9%', note: 'Longform-Layout & klare Typohierarchie' },
  { cat: 'Newsletter Opt-In', val: '3.240', trend: '▲ 5%', note: 'Form-Usability optimiert' }
]

export const comments = [
  { user: 'm.hoffmann', avatar: 'https://i.pravatar.cc/64?img=25', time: 'vor 2 Stunden',
    text: 'Das Layout wirkt ruhig. Besonders die Zeilenlänge fühlt sich „magazinartig" an.', showBookmark: true },
  { user: 'studio.reader', avatar: 'https://i.pravatar.cc/64?img=9', time: 'gestern',
    text: 'Bitte prüfe noch den Fokus-Kontrast in der Pagination – da geht oft etwas verloren.', showBookmark: false }
]
