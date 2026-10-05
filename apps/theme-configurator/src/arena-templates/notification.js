// Vorlage: notification — Markup nach den BEM-KLASSEN in
// scss/scss/07-organisms/_notification.scss und den Recipe-domNotes (ein
// geerntetes data/markup/notification.html gibt es nicht):
//   article.nc-notification.nc-notification--<type>
//     [.nc-notification--priority-high][.nc-notification--permanent]
//     [.nc-notification--unread]  aria-label="[Ungelesen: ]Titel, Zeit"
//     div.nc-notification__media > img (alt="")              with-media
//     div.nc-notification__content
//       div.nc-notification__header > span.__title + span.__meta
//         (+ span.__unread aria-hidden, nur ungelesen)
//       p.nc-notification__body
//       div.nc-notification__footer > a/button.nc-notification__action
//     button.nc-notification__close  aria-label="Benachrichtigung schließen"
//       (dismissible; permanent ohne Knopf)
// role="article" kommt vom <article>. Die Tab-Reihenfolge Aktionen →
// Schliessen folgt aus der DOM-Reihenfolge (Recipe constraints).
// Das Verhalten (Schliessen mit Einklapp-Animation, Gelesen beim Klick) kommt
// aus neo-behaviors (notification.js).
//
// Achsen: type (Akzentfarbe von Punkt und Prioritaets-Rand), priority
//   (high = Rand links), interaction (permanent = ohne Schliessen-Knopf) —
//   Modifier an der Wurzel. Die Kategorie steht als Text in der Meta-Zeile
//   (Farbe nie alleiniges Signal).
// Zustaende:
//   default
//   unread      Modifier --unread (Recipe-Regel), Punkt __unread, Praefix
//               „Ungelesen:" im aria-label
//   dismissing  .is-dismissing als Standbild (ra-standbild)
// Specimens: basic, with-media, unread-state, priority-high, type-variants,
//   with-actions, permanent, dismiss-animation.
import { esc, BILD_SRC } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'
import { schliessKnopf, erneutHuelle, einrichtenErneut } from './_rueckmeldung.js'

const INHALT = {
  feature: ['Neue Funktion', 'Gruppenrechte sind da', 'Legen Sie fest, wer in einem Bereich schreiben darf.', 'vor 2 Min.'],
  system: ['System', 'Wartung am Sonntag', 'Die Plattform ist von 2 bis 4 Uhr nicht erreichbar.', 'vor 1 Std.'],
  promo: ['Angebot', 'Workshop im März', 'Noch zehn Plätze frei für den Einsteiger-Workshop.', 'gestern']
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const type = m.wert('type') || 'feature'
  const permanent = m.wert('interaction') === 'permanent'
  const ungelesen = m.hat('unread')
  const schliesst = m.hat('dismissing') && !m.ausprobieren
  const [kategorie, titel0, text0, zeit] = INHALT[type] || INHALT.feature
  const mitMedien = art === 'notification-media'
  const titel = mitMedien ? 'Stefan Müller hat Ihnen geschrieben' : titel0
  const text = mitMedien ? '„Können wir die Freigabe auf Donnerstag legen?"' : text0

  const teile = []
  if (mitMedien) teile.push(`<div class="nc-notification__media"><img src="${BILD_SRC}" alt=""></div>`)
  const kopf = `<div class="nc-notification__header"><span class="nc-notification__title">${esc(titel)}</span><span class="nc-notification__meta">${esc(kategorie)} · ${esc(zeit)}</span>${ungelesen ? '<span class="nc-notification__unread" aria-hidden="true"></span>' : ''}</div>`
  const fuss = art === 'notification-actions'
    ? '<div class="nc-notification__footer"><a class="nc-notification__action" href="#" onclick="return false">Ansehen</a><button type="button" class="nc-notification__action">Später erinnern</button></div>'
    : ''
  teile.push(`<div class="nc-notification__content">${kopf}<p class="nc-notification__body">${esc(text)}</p>${fuss}</div>`)
  if (!permanent) teile.push(schliessKnopf('nc-notification__close', 'Benachrichtigung schließen'))

  const extra = [ungelesen ? 'nc-notification--unread' : '', schliesst ? 'is-dismissing' : ''].filter(Boolean)
  const name = `${ungelesen ? 'Ungelesen: ' : ''}${titel}, ${zeit}`
  const karte = `<article class="${wurzelKlassen(m, extra)}" aria-label="${esc(name)}">
${teile.join('\n')}
</article>`

  const huelle = (html, ziel = false) => `<div class="${schliesst ? 'ra-standbild' : 'ra-feld ra-feld--breit'}"${ziel ? ' data-ra-ziel' : ''}>${html}</div>`
  if (!m.ausprobieren || permanent) return huelle(karte)
  return erneutHuelle('notification', huelle(karte, true), karte)
}

export const einrichten = einrichtenErneut
