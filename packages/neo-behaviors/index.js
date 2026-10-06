// @ts-check
// ==========================================================================
// neo-behaviors — Verhalten der NEO-Bauteile (Plan v3, Phase 2)
// ==========================================================================
// Eine Quelle fuer Drupal, Doku und Theme-Konfigurator (Entscheidung
// 01.10.2026). Das Soll steht im Recipe (`keyboard`, `events`, State-Regeln);
// die Tests in tests/behaviors/ pruefen es dagegen.
//
//   import { anbinden, abbinden } from 'neo-behaviors'
//   const aufraeumen = anbinden(document)        // oder ein Teilbereich
//
// Drupal (Library mit dieser Datei als Modul):
//   Drupal.behaviors.neoBehaviors = {
//     attach: (context) => NeoBehaviors.anbinden(context),
//     detach: (context, settings, trigger) => { if (trigger === 'unload') NeoBehaviors.abbinden(context) }
//   }
// ==========================================================================
import { bindeAlle, loeseAlle } from './kern.js'
import { tabs } from './tabs.js'
import { akkordeon } from './accordion.js'
import { select } from './select.js'
import { suche } from './suche.js'
import { segmentedControl } from './segmented-control.js'
import { toggleGroup } from './toggle-group.js'
import { schalter } from './switch.js'
import { rating } from './rating.js'
import { eingabe } from './input.js'
import { dropdownMenu } from './dropdown-menu.js'
import { popover } from './popover.js'
import { tooltip } from './tooltip.js'
import { modal } from './modal.js'
import { drawer } from './drawer.js'
import { alertDialog } from './alert-dialog.js'
import { breadcrumb } from './breadcrumb.js'
import { treeview } from './treeview.js'
import { navigationMenu } from './navigation-menu.js'
import { toolbar } from './toolbar.js'
import { sidebar } from './sidebar.js'
import { navigationTabMega } from './navigation-tab-mega.js'
import { toast } from './toast.js'
import { notification } from './notification.js'
import { alert } from './alert.js'
import { banner } from './banner.js'
import { codeSnippet } from './code-snippet.js'
import { button } from './button.js'
import { shell } from './shell.js'
import { mobileDrawer } from './mobile-drawer.js'
import { tableInfoModal } from './table-info-modal.js'
import { multiselect } from './multiselect.js'
import { chapterNav } from './chapter-nav.js'
import { expandingPanels } from './expanding-panels.js'

export { setzeIndikator } from './segmented-control.js'

/** Alle Behaviors, Schluessel = Recipe-ID. */
export const BEHAVIORS = Object.freeze({
  tabs,
  accordion: akkordeon,
  select,
  search: suche,
  'segmented-control': segmentedControl,
  'toggle-group': toggleGroup,
  switch: schalter,
  // vor Toolbar/Gruppen: Umschaltknoepfe sind innere Bauteile
  button,
  rating,
  input: eingabe,
  // Website-Bauteil (Entscheidung 06.10.2026): in Drupal nur per nur
  multiselect,
  'dropdown-menu': dropdownMenu,
  popover,
  tooltip,
  modal,
  drawer,
  'alert-dialog': alertDialog,
  // Website-Bauteile aus dem Drupal-Theme (Entscheidung 06.10.2026): binden
  // in Drupal nur, wenn drupalSettings.neoBehaviors.nur sie nennt
  'mobile-drawer': mobileDrawer,
  'table-info-modal': tableInfoModal,
  breadcrumb,
  treeview,
  'navigation-menu': navigationMenu,
  toolbar,
  sidebar,
  'navigation-tab-mega': navigationTabMega,
  // Website-Bauteil (Entscheidung 06.10.2026): in Drupal nur per nur
  'chapter-nav': chapterNav,
  'expanding-panels': expandingPanels,
  toast,
  notification,
  alert,
  banner,
  'code-snippet': codeSnippet,
  // zuletzt: die Shell ist das aeusserste Bauteil (Drawer der Mobil-Lage)
  shell
})

/** Recipe-IDs mit Verhalten — die Arena bietet fuer sie „Ausprobieren" an. */
export const MIT_VERHALTEN = Object.freeze(Object.keys(BEHAVIORS))

/**
 * Recipe-IDs, die Drupal nur bindet, wenn `drupalSettings.neoBehaviors.nur`
 * sie ausdruecklich nennt (Behavior mit `nurAusdruecklich: true`). Das sind
 * die Website-Bauteile, deren Verhalten heute noch neo-theme.js liefert —
 * ein Aufruf ohne `nur` soll es nicht doppelt binden (Entscheidung
 * 06.10.2026). anbinden()/abbinden() ohne `nur` binden weiter alle.
 */
export const NUR_AUSDRUECKLICH = Object.freeze(Object.keys(BEHAVIORS).filter((id) => /** @type {any} */ (BEHAVIORS[id]).nurAusdruecklich === true))

/**
 * Bindet alle (oder die genannten) Behaviors im Bereich. Mehrfaches Aufrufen
 * ist harmlos: jede Wurzel wird nur einmal gebunden.
 * @param {ParentNode & Node} bereich
 * @param {string[]} [nur] Recipe-IDs
 * @returns {() => void} Aufraeumen
 */
export function anbinden (bereich, nur) {
  return bindeAlle(bereich, waehle(nur))
}

/** @param {ParentNode & Node} bereich @param {string[]} [nur] */
export function abbinden (bereich, nur) {
  loeseAlle(bereich, waehle(nur))
}

// Immer in der Reihenfolge von BEHAVIORS: aeussere Bauteile (z. B. die
// Toolbar um eine Toggle-Group) binden nach den inneren und setzen ihren
// roving tabindex zuletzt.
function waehle (nur) {
  return Object.keys(BEHAVIORS).filter((id) => !nur || nur.includes(id)).map((id) => BEHAVIORS[id])
}
