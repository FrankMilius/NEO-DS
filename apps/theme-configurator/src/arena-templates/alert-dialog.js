// Vorlage: alert-dialog — Markup aus den Code-Beispielen in
// docs/alert-dialog-docs.html und den BEM-KLASSEN in
// scss/scss/07-organisms/_alert-dialog.scss (ein geerntetes
// data/markup/alert-dialog.html gibt es nicht):
//   dialog.nc-alert-dialog  role="alertdialog" aria-labelledby aria-describedby
//     span.nc-alert-dialog__icon (dekorativ, aria-hidden)
//     div.nc-alert-dialog__header > h2.__title + p.__description
//     div.nc-alert-dialog__footer > Abbrechen (nc-button--outline,
//       data-action="cancel") + Aktion (nc-button--primary,
//       data-action="confirm")
// Das Verhalten (showModal ueber aria-controls, Fokus auf die markierte
// sichere Aktion bzw. Abbrechen,
// Fokus-Falle, Escape = Abbrechen, Hintergrund schliesst nicht, Fokus
// zurueck) kommt aus neo-behaviors (alert-dialog.js, _dialog.js).
//
// Achsen: intent (destructive = nc-alert-dialog--destructive: Symbol und
//   Aktion in Gefahrenfarbe) per Modifier; content waehlt die Slots:
//   with-description, title-only, with-icon (Symbol + Beschreibung).
// Fokus beim Oeffnen (Entscheidung 03.10.2026, „sichere Aktion per
//   Markierung“): das Behavior fokussiert das Element mit autofocus, ohne
//   Markierung Abbrechen. Die sichere Aktion steht in SICHER: meist
//   Abbrechen, bei „Sitzung laeuft ab“ „Angemeldet bleiben“ (confirm).
//   autofocus nur am geschlossenen Dialog (m.ausprobieren), offen
//   eingefuegt nimmt autofocus sonst der App den Fokus.
// unsaved-changes: drei Knoepfe laut Recipe — Speichern (data-action=
//   "save", sekundaer), Abbrechen (cancel), Verwerfen (confirm; die Frage
//   im Titel, bei destructive in Gefahrenfarbe).
// Zustaende: default/open — „Zustände" zeigt den Dialog offen ([open]) im
//   Arena-Rahmen ra-buehne (Bezugsrahmen statt Fenster, RecipeArena.vue).
//   „Ausprobieren": Ausloeser + geschlossener <dialog>, showModal() oeffnet.
// Specimens: default, destructive (composes button), intent-comparison,
//   content-variants, destructive-with-icon, session-timeout,
//   unsaved-changes.
import { esc } from './_helfer.js'
import { offen, wurzelKlassen, dialogHuelle, WARNUNG, INFO } from './_overlay.js'

// [Titel, Beschreibung, Aktion]
const FAELLE = {
  'alert-dialog-session': ['Sitzung läuft ab', 'Sie werden in 2 Minuten aus Sicherheitsgründen abgemeldet. Nicht gespeicherte Änderungen gehen verloren.', 'Angemeldet bleiben'],
  'alert-dialog-unsaved': ['Änderungen verwerfen?', 'Sie haben ungespeicherte Änderungen. Wenn Sie die Seite verlassen, gehen sie verloren.', 'Verwerfen'],
  destructive: ['Konto löschen?', 'Ihr Konto und alle Inhalte werden endgültig gelöscht. Dieser Schritt lässt sich nicht rückgängig machen.', 'Endgültig löschen'],
  standard: ['Beitrag veröffentlichen?', 'Der Beitrag ist danach für alle Mitglieder des Bereichs sichtbar.', 'Veröffentlichen']
}
// Sichere Aktion (bekommt autofocus), wenn sie nicht Abbrechen ist
const SICHER = { 'alert-dialog-session': 'confirm' }

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const gefahr = m.wert('intent') === 'destructive'
  const content = m.wert('content') || 'with-description'
  const [titel, beschreibung, aktion] = FAELLE[art] || (gefahr ? FAELLE.destructive : FAELLE.standard)
  const mitText = content !== 'title-only'
  const mitSymbol = content === 'with-icon'

  const teile = []
  if (mitSymbol) teile.push(`<span class="nc-alert-dialog__icon" aria-hidden="true">${gefahr ? WARNUNG : INFO}</span>`)
  teile.push(`<div class="nc-alert-dialog__header"><h2 class="nc-alert-dialog__title" id="${m.uid}-titel">${esc(titel)}</h2>${mitText ? `<p class="nc-alert-dialog__description" id="${m.uid}-beschreibung">${esc(beschreibung)}</p>` : ''}</div>`)
  // autofocus nur am geschlossenen Dialog (Ausprobieren): ein offen
  // eingefuegter Dialog nimmt sonst der App den Fokus.
  const sicher = SICHER[art] || 'cancel'
  const fokus = (wert) => m.ausprobieren && wert === sicher ? ' autofocus' : ''
  const speichern = art === 'alert-dialog-unsaved' ? `<button type="button" class="nc-button nc-button--secondary" data-action="save"${fokus('save')}>Speichern</button>` : ''
  teile.push(`<div class="nc-alert-dialog__footer">${speichern}<button type="button" class="nc-button nc-button--outline" data-action="cancel"${fokus('cancel')}>Abbrechen</button><button type="button" class="nc-button nc-button--primary" data-action="confirm"${fokus('confirm')}>${esc(aktion)}</button></div>`)

  const beschrieben = mitText ? ` aria-describedby="${m.uid}-beschreibung"` : ''
  const dialog = `<dialog class="${wurzelKlassen(m)}" id="${m.uid}-dialog" role="alertdialog" aria-labelledby="${m.uid}-titel"${beschrieben}${offen(m) ? ' open' : ''}>
${teile.join('\n')}
</dialog>`
  return dialogHuelle(m, { dialog, buehne: 'ra-buehne--niedrig', ausloeser: esc(aktion) })
}
