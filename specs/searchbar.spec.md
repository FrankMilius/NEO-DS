# searchbar Component Spec
> Version 1.4.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-searchbar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| inner | `.nc-searchbar__inner` | Yes | Zeile (flex, padding-block spacing-03); traegt zusaetzlich .nc-container (Breite und Polster). |
| field | `.nc-searchbar__field` | Yes | Bezugsrahmen (relative, volle Breite) fuer Lupe, Feld und Schliessen-Knopf. |
| icon | `.nc-searchbar__icon` | Yes | Lupe (svg aria-hidden) links im Feld, absolut, text-tertiary, ohne Zeiger-Ereignisse. |
| input | `.nc-searchbar__input` | Yes | Suchfeld (input type=search, 44 px hoch, body-m) mit aria-label; Radius, Rahmen, Hintergrund, Text-, Platzhalter- und Fokusfarbe aus der Token-Kette des Inputs; Abbrechen-Kreuz des Browsers ausgeblendet. |
| close | `.nc-searchbar__close` | Yes | Schliessen-Knopf rechts im Feld (28 x 28 px, aria-label); Hover background-hover/text-primary, :focus-visible Ring interactive-focus. |

### DOM Notes
- Leiste unter der Navigation: div.nc-searchbar[data-state][role=search] > .nc-searchbar__inner.nc-container > .nc-searchbar__field > svg.__icon + input.__input + button.__close (Struktur aus COMPONENTS-CSS.md des Drupal-Themes, Abschnitt 3.2, und dem SCSS). Einen Shortcut-Hinweis hat die Leiste nicht (Entscheidung 06.10.2026).
- Sichtbar nur mit data-state="open" (display block), sonst display none; volle Breite, background-secondary mit Trennlinie border-secondary, z-index --fnd-z-drawer. Die Arena zeigt jede Zelle geoeffnet.
- Fokus im Feld wie beim Input: :focus-visible mit dem Fokusring (focus-ring, in den NEO-Themes zweischichtig: Ring neutral-950 + Halo neutral-50) und Rahmen --nc-searchbar-input-border-focus; :focus ohne :focus-visible ohne outline (Entscheidung Abschluss 2, 08.10.2026).
- Verhalten (neo-theme.js, Drupal.behaviors.neoSearch — nicht migriert, auf der Website ohne Markup): Ausloeser [data-search-toggle] (aria-expanded) schaltet data-state, Fokus nach 100 ms ins Feld [data-searchbar-input]; Strg/⌘+K oeffnet bzw. fokussiert; Escape im Feld, [data-searchbar-close] und Klick ausserhalb von Leiste und Ausloeser schliessen — das Feld wird geleert, der Fokus geht an den Ausloeser. Keine Ereignisse.
- Ein Behavior in neo-behaviors gibt es nicht (kein „Ausprobieren"); keyboard/events bleiben leer, bis das Verhalten migriert wird. Die Suchfunktion selbst (Ergebnisse, Absenden) gehoert nicht zum Bauteil.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-searchbar`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-searchbar-close-background` | — | `--mod-searchbar-close-background` |
| `--nc-searchbar-input-padding-left` | — | `--mod-searchbar-input-padding-left` |
| `--nc-searchbar-input-padding-right` | — | `--mod-searchbar-input-padding-right` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 1.3.1/2.4.1: Leiste mit role=search (Landmarke); Feld input type=search mit Namen (aria-label oder sichtbares Label).
- 4.1.2: Schliessen-Knopf mit aria-label, Lupe dekorativ (aria-hidden); der Ausloeser in der Kopfzeile traegt aria-expanded (neoSearch).
- 2.1.1: Escape im Feld schliesst und gibt den Fokus an den Ausloeser zurueck; Strg/⌘+K oeffnet bzw. fokussiert (neoSearch; Tastenkombination mit Modifier, kein Einzeltasten-Kuerzel nach 2.1.4).
- 2.4.7/1.4.11: Fokus im Feld mit dem Fokusring der Eingabefelder (seit 1.4.0) — Ring gegen Leiste hell 14,23:1, heller Halo gegen Leiste dunkel 13,72:1, Ring gegen Halo 17,17:1; Rahmen zusaetzlich in der Fokusfarbe.
- 2.5.8: Schliessen-Knopf 28 x 28 px; Feld 44 px hoch.
- 1.4.3/1.4.11: Kontrast AA hell und dunkel gemessen — Eingabe ab 12,79:1, Platzhalter ab 4,59:1, Lupe und Kreuz text-tertiary ab 4,59:1, Feldrahmen ab 3,06:1.

## Web Components Mapping
Derived from anatomy for potential `<nc-searchbar>` custom element:

```js
class NcSearchbar extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="inner">, <slot name="field">, <slot name="icon">, <slot name="input">, <slot name="close">
}
```

---

*Generated from `data/searchbar-recipe.json` by `scripts/generate-component-specs.js`*
