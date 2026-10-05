// Vorlage: toast — Markup nach den BEM-KLASSEN in
// scss/scss/06-molecules/_toast.scss und dem Code-Beispiel der Doku
// (docs/content/toast.html, docs/toast-docs.js):
//   div.nc-toaster.nc-toaster--<position>  role="region" aria-label
//     aria-live="polite"
//     div.nc-toast.nc-toast--<severity>  role="status" (error/warning:
//       role="alert", Recipe a11y)
//       span.nc-toast__icon (aria-hidden, Symbol je Severity)
//       div.nc-toast__content > p.nc-toast__title + p.nc-toast__description
//       button.nc-toast__action (with-action, with-undo: data-undo)
//       button.nc-toast__close  aria-label="Schließen"
//       div.nc-toast__progress (with-progress, aria-hidden)
// Das Verhalten (Schliessen, Escape, Auto-Ausblenden mit data-duration und
// Pause bei Hover/Fokus, Wischen, Warteschlange) kommt aus neo-behaviors
// (toast.js).
//
// Achsen:
//   severity  Modifier am Toast (Recipe), Rolle status/alert
//   position  Modifier am TOASTER (nc-toaster--<position>); das Recipe fuehrt
//             ihn ohne Klasse, weil er nicht am Toast haengt
//   content   basic (nur Titel), with-description, with-action, with-undo
//             (Rueckgaengig mit data-undo), with-progress (Balken)
// Zustaende:
//   default   fest im Toaster, Toaster im Arena-Rahmen ra-bildschirm
//   swiping   die DS-Klasse .is-swiping mit den Instanzwerten, die das JS
//             waehrend der Geste setzt (--_toast-swipe-x/-opacity)
// Der Balken hat ohne JS keine Breite (das DS laesst ihn per JS ablaufen):
// in „Zustände" steht er als Standbild bei 60 % Restzeit (Breite, wie sie die
// Animation nc-toast-progress dann hat).
// Ausprobieren: with-progress laeuft 6 s, with-undo 10 s (Recipe:
// extended-timeout), die anderen bleiben bis zum Schliessen (WCAG 2.2.1).
// Specimens: severity-variants, content-variants, with-action, undo-action,
//   with-progress, stacked (drei Toasts), queue-limit (vier — einer mehr als
//   --nc-toast-max-visible; in „Zustände" geht der aelteste gerade:
//   .is-leaving als Standbild (ra-standbild), in „Ausprobieren" schliesst das
//   Behavior ihn), swipe-dismiss, error-alert (top-center, role="alert").
import { esc } from './_helfer.js'
import { SYMBOLE, schliessKnopf, erneutHuelle, einrichtenErneut } from './_rueckmeldung.js'

const INHALT = {
  default: ['Entwurf gespeichert', 'Ihre Änderungen sind sicher abgelegt.', SYMBOLE.neutral],
  success: ['Beitrag veröffentlicht', 'Er ist jetzt für alle Mitglieder sichtbar.', SYMBOLE.erfolg],
  warning: ['Speicherplatz fast voll', 'Weniger als 10 % sind noch frei.', SYMBOLE.warnung],
  error: ['Hochladen fehlgeschlagen', 'Der Server ist nicht erreichbar.', SYMBOLE.fehler],
  info: ['Neue Version verfügbar', 'Laden Sie die Seite neu, um sie zu nutzen.', SYMBOLE.info]
}

const AKTION = { success: 'Ansehen', error: 'Erneut versuchen', default: 'Details' }

/**
 * Ein Toast.
 * @param {any} m
 * @param {{ severity: string, content: string, wischen?: boolean, lebendig?: boolean, geht?: boolean }} o
 */
function einToast (m, { severity, content, wischen = false, lebendig = false, geht = false }) {
  const [titel, beschreibung, symbol] = INHALT[severity] || INHALT.default
  const rolle = severity === 'error' || severity === 'warning' ? 'alert' : 'status'
  const mitText = content !== 'basic' && content !== 'with-progress'
  const teile = [
    `<span class="nc-toast__icon" aria-hidden="true">${symbol}</span>`,
    `<div class="nc-toast__content"><p class="nc-toast__title">${esc(content === 'with-undo' ? '3 Beiträge archiviert' : titel)}</p>${mitText ? `<p class="nc-toast__description">${esc(content === 'with-undo' ? 'Sie finden sie im Archiv.' : beschreibung)}</p>` : ''}</div>`
  ]
  if (content === 'with-action') teile.push(`<button type="button" class="nc-toast__action">${AKTION[severity] || AKTION.default}</button>`)
  if (content === 'with-undo') teile.push('<button type="button" class="nc-toast__action" data-undo>Rückgängig</button>')
  teile.push(schliessKnopf('nc-toast__close'))

  let stil = ''
  if (content === 'with-progress') {
    // Standbild: Restzeit 60 % (die Breite, die die Animation des DS nach
    // 40 % der Dauer hat)
    teile.push(lebendig
      ? '<div class="nc-toast__progress" aria-hidden="true"></div>'
      : '<div class="nc-toast__progress" aria-hidden="true" style="width: 60%"></div>')
  }
  if (wischen) stil = ' style="--_toast-swipe-x: 72px; --_toast-swipe-opacity: 0.64"'

  const klassen = [`nc-toast nc-toast--${severity}`, wischen ? 'is-swiping' : '', geht ? 'is-leaving' : ''].filter(Boolean).join(' ')
  const dauer = lebendig && content === 'with-progress' ? ' data-duration="6000"'
    : lebendig && content === 'with-undo' ? ' data-duration="10000"' : ''
  return `<div class="${klassen}" role="${rolle}"${dauer}${stil}>
${teile.join('\n')}
</div>`
}

/** Severities der Zelle: Stapel-Specimens zeigen alle Werte des Specimens zusammen. */
function severities (m) {
  const art = m.specimen.render?.compositionType
  if (art === 'toast-stacked' || art === 'toast-queue') return m.specimen.matrix.axes.severity
  return [m.wert('severity') || 'default']
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  // Stapel-Specimens: eine Zelle mit allen Toasts (die Matrix ergaebe je
  // Severity eine eigene Zelle) — nur die erste Zelle zeigt den Stapel
  const stapel = art === 'toast-stacked' || art === 'toast-queue'
  if (stapel && m.specimen.matrix.axes.severity[0] !== m.wert('severity')) return ''
  const position = m.wert('position') || 'top-right'
  const content = m.wert('content') || 'basic'
  const wischen = m.hat('swiping') && !m.ausprobieren
  // Warteschlange: einer mehr als --nc-toast-max-visible (3) — in „Zustände"
  // geht der aelteste gerade (is-leaving, Standbild)
  const verdraengt = art === 'toast-queue' && !m.ausprobieren
  const toasts = (lebendig) => severities(m).map((severity, i) => einToast(m, { severity, content, wischen: wischen && !lebendig, lebendig, geht: verdraengt && !lebendig && i === 0 })).join('\n')

  const toaster = (inhalt) => `<div class="nc-toaster nc-toaster--${position}" role="region" aria-label="Benachrichtigungen" aria-live="polite"${m.ausprobieren ? ' data-ra-ziel' : ''}>
${inhalt}
</div>`
  const rahmen = ['ra-bildschirm', verdraengt ? 'ra-standbild' : '',
    position.endsWith('center') ? 'ra-bildschirm--breit' : '',
    stapel ? 'ra-bildschirm--hoch' : content === 'with-action' || content === 'with-undo' ? 'ra-bildschirm--mittel' : ''
  ].filter(Boolean).join(' ')

  if (!m.ausprobieren) return `<div class="${rahmen}">${toaster(toasts(false))}</div>`
  return erneutHuelle('toast', `<div class="${rahmen}">${toaster(toasts(true))}</div>`, toasts(true))
}

export const einrichten = einrichtenErneut
