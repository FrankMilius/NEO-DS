// Vorlage: drawer — Markup aus den Code-Beispielen in docs/drawer-docs.html
// und den BEM-KLASSEN in scss/scss/07-organisms/_drawer.scss (ein
// geerntetes data/markup/drawer.html gibt es nicht):
//   dialog.nc-drawer[.nc-drawer--<direction>]  aria-labelledby aria-describedby
//     div.nc-drawer__handle (aria-hidden, nur bottom/top)
//     div.nc-drawer__header > h2.nc-drawer__title + p.nc-drawer__description
//     div.nc-drawer__content
//     div.nc-drawer__footer > Knoepfe
//     button.nc-drawer__close
// Das Verhalten (showModal ueber aria-controls, Escape, Fokus-Falle, Fokus
// zurueck, Klick auf den Hintergrund schliesst immer, .is-scrolled beim
// Scrollen des Inhalts) kommt aus neo-behaviors (drawer.js, _dialog.js).
//
// Achsen: direction per Modifier an der Wurzel (bottom = Standard).
// Zustaende: open — „Zustände" zeigt den Drawer offen ([open]) im
//   Arena-Rahmen ra-buehne (Bezugsrahmen statt Fenster, RecipeArena.vue);
//   scrolled = .is-scrolled (Trennlinien an Kopf und Fuss), mit langem,
//   gescrolltem Inhalt. „Ausprobieren": Ausloeser + geschlossener <dialog>.
// Specimens: bottom-sheet, direction-comparison, side-panel-right,
//   scrolled-content, with-form, light-dismiss (Inhalt erklaert den Fall).
import { esc } from './_helfer.js'
import { offen, wurzelKlassen, schliessen, dialogHuelle } from './_overlay.js'

const TITEL = {
  'drawer-side-panel': ['Details', 'Eigenschaften des ausgewählten Beitrags.'],
  'drawer-scrolled': ['Benachrichtigungen', '24 neue Meldungen in Ihren Bereichen.'],
  'drawer-form': ['Filter', 'Ergebnisse eingrenzen.'],
  'drawer-light-dismiss': ['Teilen', 'Ein Klick auf den abgedunkelten Hintergrund schließt den Drawer.']
}

function inhalt (m, art) {
  if (art === 'drawer-scrolled') {
    return Array.from({ length: 14 }, (_, i) => `<p>Meldung ${i + 1}: Neuer Kommentar im Bereich „Projekt ${String.fromCharCode(65 + (i % 6))}".</p>`).join('\n')
  }
  if (art === 'drawer-form') {
    const feld = (name, label, typ = 'text') => `<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-${name}"><span class="nc-form-label__text">${esc(label)}</span></label>
<input class="nc-input" type="${typ}" id="${m.uid}-${name}" name="${name}">
</div>`
    return `<div class="ra-stapel">${feld('suche', 'Stichwort', 'search')}${feld('autor', 'Autorin oder Autor')}${feld('datum', 'Erschienen ab', 'date')}</div>`
  }
  return '<p>Inhalt des Drawers: Listen, Formulare oder Details. Bei langen Inhalten scrollt dieser Bereich, Kopf und Fuß bleiben stehen.</p>'
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const richtung = m.wert('direction') || 'bottom'
  const seitlich = richtung === 'left' || richtung === 'right'
  const gescrollt = m.hat('scrolled') && !m.ausprobieren
  const [titel, beschreibung] = TITEL[art] || ['Einstellungen', 'Passen Sie Ihre Präferenzen an.']
  const formular = art === 'drawer-form'

  const dialog = `<dialog class="${wurzelKlassen(m, gescrollt ? ['is-scrolled'] : [])}" id="${m.uid}-dialog" aria-labelledby="${m.uid}-titel" aria-describedby="${m.uid}-beschreibung"${offen(m) ? ' open' : ''}>
${seitlich ? '' : '<div class="nc-drawer__handle" aria-hidden="true"></div>\n'}<div class="nc-drawer__header"><h2 class="nc-drawer__title" id="${m.uid}-titel">${esc(titel)}</h2><p class="nc-drawer__description" id="${m.uid}-beschreibung">${esc(beschreibung)}</p></div>
<div class="nc-drawer__content">${inhalt(m, art)}</div>
<div class="nc-drawer__footer"><button type="button" class="nc-button">${formular ? 'Anwenden' : 'Speichern'}</button><button type="button" class="nc-button nc-button--outline" data-action="cancel">Abbrechen</button></div>
${schliessen('nc-drawer__close')}
</dialog>`

  return dialogHuelle(m, { dialog, buehne: 'ra-buehne--drawer', ausloeser: `${esc(titel)} öffnen` })
}

/**
 * „Zustände", scrolled: den Inhalt wirklich ein Stueck scrollen — die
 * Klasse is-scrolled setzt im DS das JS genau dann (scrollTop > 0).
 */
export function einrichten (element) {
  for (const d of element.querySelectorAll('dialog.nc-drawer.is-scrolled[open] .nc-drawer__content')) d.scrollTop = 120
}
