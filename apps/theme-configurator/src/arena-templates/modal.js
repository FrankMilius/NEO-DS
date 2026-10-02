// Vorlage: modal — Markup nach den BEM-KLASSEN in
// scss/scss/07-organisms/_modal.scss (Abschnitt „Modal (BEM / Token-basiert)")
// und den Recipe-domNotes (ein geerntetes data/markup/modal.html gibt es nicht):
//   dialog.nc-modal  aria-labelledby (Titel) bzw. aria-label
//     div.nc-modal__header > span.nc-modal__header-icon (danger) +
//       h2.nc-modal__title + button.nc-modal__close
//     div.nc-modal__body
//     div.nc-modal__footer > Abbrechen (data-action="cancel") + Bestaetigen
//       (nc-button--primary, data-action="confirm")
// Das Verhalten (showModal ueber aria-controls, Escape, Fokus-Falle, Fokus
// zurueck, Hintergrund-Klick nur mit data-backdrop-close="true",
// Scroll-Klassen) kommt aus neo-behaviors (modal.js, _dialog.js).
//
// Achsen: size (sm/lg/full), content (scrollable = nc-modal--scrollable),
//   intent (danger = nc-modal--danger), layout (sheet = nc-modal--sheet:
//   Bottom-Sheet auf jeder Fensterbreite, Entscheidung 02.10.2026) per
//   Modifier an der Wurzel;
//   content waehlt die Slots: simple (nur Body), with-header, with-footer,
//   full, scrollable (langer Body, Kopf und Fuss bleiben stehen).
// Zustaende: default/open — „Zustände" zeigt den Dialog offen ([open]) im
//   Arena-Rahmen ra-buehne (der Rahmen ist sein Bezugsrahmen statt des
//   Fensters, siehe RecipeArena.vue); scrollable mit .is-scrolled-bottom wie
//   vom Behavior beim Oeffnen gesetzt (Inhalt unter dem Rand).
//   „Ausprobieren": Ausloeser + geschlossener <dialog>, showModal() oeffnet.
// Specimens: default, size-variants, content-variants, scrollable,
//   danger-confirmation, with-form (composes form, form-field),
//   mobile-bottom-sheet (das SCSS schaltet erst unter dem sm-Breakpoint des
//   FENSTERS um — im Rahmen erscheint das Modal wie default), sheet
//   (nc-modal--sheet: im Rahmen unten angedockt, in „Ausprobieren" am
//   unteren Fensterrand),
//   backdrop-close (data-backdrop-close="true"), overlay-hierarchy.
import { esc } from './_helfer.js'
import { offen, wurzelKlassen, schliessen, dialogHuelle, WARNUNG, absaetze } from './_overlay.js'

const TEXT = {
  'modal-default': 'Die Änderungen werden für alle Mitglieder des Bereichs sichtbar. Sie können sie später jederzeit zurücknehmen.',
  'modal-danger': 'Der Bereich „Marketing" und alle 128 Beiträge darin werden endgültig gelöscht. Dieser Schritt lässt sich nicht rückgängig machen.',
  'modal-bottom-sheet': 'Unter dem sm-Breakpoint des Fensters gleitet das Modal als Bottom-Sheet von unten herein (volle Breite, obere Ecken gerundet).',
  'modal-sheet': 'Mit nc-modal--sheet ist das Modal auf jeder Fensterbreite ein Bottom-Sheet: volle Breite, unten angedockt, obere Ecken gerundet.',
  'modal-backdrop-close': 'Ein Klick auf den abgedunkelten Hintergrund schließt dieses Modal (data-backdrop-close="true"). Bei Formularen nicht verwenden.',
  'modal-overlay-hierarchy': 'Ebene 3 der Overlays: über Dropdown-Menü (Ebene 1) und Popover (Ebene 2) — Schatten elevation-modal.'
}
const STANDARD = 'Der Body-Bereich nimmt beliebige Inhalte auf und scrollt, wenn er höher als der Dialog wird.'

function formular (m) {
  const feld = (name, typ, label, wert = '') => `<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-${name}"><span class="nc-form-label__text">${esc(label)}</span></label>
<input class="nc-input" type="${typ}" id="${m.uid}-${name}" name="${name}"${wert ? ` value="${esc(wert)}"` : ''}>
</div>`
  return `<form class="nc-form" id="${m.uid}-form">
${feld('name', 'text', 'Name des Bereichs', 'Marketing')}
${feld('kuerzel', 'text', 'Kürzel', 'MKT')}
</form>`
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const content = m.wert('content') || 'simple'
  const gefahr = m.wert('intent') === 'danger'
  const kopf = content !== 'simple' && content !== 'with-footer'
  const fuss = content === 'with-footer' || content === 'full' || content === 'scrollable'
  const scroll = content === 'scrollable'
  const formularArt = art === 'modal-form'
  const titel = gefahr ? 'Bereich löschen?' : formularArt ? 'Bereich bearbeiten' : 'Änderungen übernehmen'
  const titelId = `${m.uid}-titel`
  const zustand = offen(m) && scroll ? ['is-scrolled-bottom'] : []

  const teile = []
  if (kopf) {
    const symbol = gefahr ? `<span class="nc-modal__header-icon">${WARNUNG}</span>` : ''
    teile.push(`<div class="nc-modal__header">${symbol}<h2 class="nc-modal__title" id="${titelId}">${titel}</h2>${schliessen('nc-modal__close')}</div>`)
  }
  const inhalt = formularArt
    ? formular(m)
    : scroll ? absaetze(12, 'Absatz im scrollenden Body — Kopf und Fuß bleiben stehen, ihre Trennlinie erscheint, sobald Inhalt darunter liegt.')
      : `<p>${esc(TEXT[art] || STANDARD)}</p>`
  teile.push(`<div class="nc-modal__body">${inhalt}</div>`)
  if (fuss) {
    const bestaetigen = gefahr ? 'Endgültig löschen' : formularArt ? 'Speichern' : 'Übernehmen'
    // Bei Gefahr startet der Fokus auf Abbrechen (Recipe a11y: Anti-Slipping).
    // autofocus nur am geschlossenen Dialog (Ausprobieren): in „Zustände"
    // wuerde ein offen eingefuegter Dialog der App den Fokus nehmen.
    const fokus = gefahr && m.ausprobieren ? ' autofocus' : ''
    teile.push(`<div class="nc-modal__footer"><button type="button" class="nc-button nc-button--outline" data-action="cancel"${fokus}>Abbrechen</button><button type="button" class="nc-button nc-button--primary" data-action="confirm">${bestaetigen}</button></div>`)
  }

  const name = kopf ? ` aria-labelledby="${titelId}"` : ` aria-label="${titel}"`
  const hintergrund = art === 'modal-backdrop-close' ? ' data-backdrop-close="true"' : ''
  const dialog = `<dialog class="${wurzelKlassen(m, zustand)}" id="${m.uid}-dialog"${name}${hintergrund}${offen(m) ? ' open' : ''}>
${teile.join('\n')}
</dialog>`

  const buehne = [scroll ? 'ra-buehne--begrenzt' : '', content === 'simple' ? 'ra-buehne--niedrig' : ''].filter(Boolean).join(' ')
  return dialogHuelle(m, { dialog, buehne, ausloeser: gefahr ? 'Bereich löschen' : formularArt ? 'Bereich bearbeiten' : 'Dialog öffnen' })
}
