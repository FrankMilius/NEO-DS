// Direktive v-fokus (Befund UX-17, 16.10.2026): Ein Hinzufügen-Formular, das
// erst nach einem Klick erscheint, bekommt den Fokus in sein erstes Feld —
// vorher fiel der Tastaturfokus mit dem verschwindenden Knopf auf <body>.
// In <script setup> genügt der Import: `import { vFokus } from …`.
export const vFokus = {
  mounted (el) {
    el.focus?.()
  },
}
