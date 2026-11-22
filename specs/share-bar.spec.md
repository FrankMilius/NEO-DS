# share-bar Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `molecules`, `actions`, `blog`, `website`

## Anatomy
Root element: `.nc-share-bar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-share-bar__label` | No | Sichtbares Wort „Teilen“ am Anfang (aria-hidden, die Gruppe traegt aria-label). |
| actions | `.nc-share-bar__actions` | Yes | Icon-Buttons: <button> Teilen (Web Share), <a target="_blank" rel="noopener noreferrer"> LinkedIn, <a href="mailto:"> E-Mail, <button> Link kopieren. Jeder Knopf mit aria-label. |
| popover | `.nc-share-bar__popover` | No | Blase ueber einer markierten Textstelle mit zwei Knoepfen „Zitat teilen“ und „Link kopieren“ (role="group", aria-label="Textstelle teilen"). Baut das Behavior share-bar bei der ersten Auswahl und setzt sie direkt nach den Artikeltext [data-teilen-text]; Lage (position: absolute, left/top) und Oeffnen ([hidden]) kommen vom Behavior. |

### DOM Notes
- Wurzel <div role="group" aria-label="Artikel teilen">. LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url=<Adresse>; E-Mail: mailto:?subject=<Titel>&body=<Adresse>. Beide funktionieren ohne JavaScript.
- Teilen traegt data-teilen, Link kopieren data-teilen-kopieren. Beide brauchen JavaScript: das Behavior share-bar blendet Teilen ohne Web Share aus ([hidden]) und verdrahtet Link kopieren. Auf der Website den Teilen-Knopf mit hidden ausliefern — das Behavior zeigt ihn, wenn navigator.share da ist.
- Optional an der Wurzel: data-teilen-titel (Titel fuer Web Share) und data-teilen-url (kanonische Adresse); sonst document.title und location ohne #.
- Textstelle teilen: Artikeltext mit data-teilen-text im selben <article> (oder einem Element mit data-teilen-bereich) wie die Leiste. Die Blase baut das Behavior selbst und setzt sie direkt nach den Artikeltext; im Markup steht sie nicht. Die Statuszeile (span.u-sr-only role="status") legt das Behavior in der Leiste an, wenn keine da ist.

## Variants
### Beschriftung (`label`)
Nur Symbole oder mit dem Wort „Teilen“ am Anfang.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| text | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-share-bar`

### Leiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-share-bar-gap` | — | — |
| `--nc-share-bar-padding-block` | — | — |
| `--nc-share-bar-border-width` | — | — |
| `--nc-share-bar-border-color` | — | — |
| `--nc-share-bar-label-color` | — | — |
| `--nc-share-bar-icon-color` | — | — |

### Blase an der Textstelle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-share-bar-popover-bg` | — | — |
| `--nc-share-bar-popover-color` | — | — |
| `--nc-share-bar-popover-radius` | — | — |
| `--nc-share-bar-popover-padding` | — | — |
| `--nc-share-bar-popover-shadow` | — | — |
| `--nc-share-bar-popover-arrow` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | In der Leiste: Teilen, LinkedIn, E-Mail, Link kopieren in Dokumentreihenfolge. Ist die Blase offen und der Fokus ausserhalb, fuehrt Tab auf ihren ersten Knopf; Tab aus der Blase heraus schliesst sie. |
| `Enter` | activate | Oeffnet den Link bzw. loest den Knopf aus (Teilen, Link kopieren, Zitat teilen). Leertaste wie Enter (native Buttons). |
| `Escape` | close | Nur bei offener Blase: schliesst sie; der Fokus geht an das Element vor der Blase zurueck, sonst bleibt die Auswahl stehen. Fuer dieselbe Auswahl oeffnet die Blase nicht erneut. |
| `Shift+ArrowRight` | select | Auswahl per Tastatur (Umschalt+Pfeil, mit Caret-Browsing): nach 300 ms ohne weitere Aenderung oeffnet die Blase, wie nach dem Loslassen der Maus. Gilt fuer alle Umschalt+Pfeil-Tasten. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `share-bar-share` | Yes | `{"quelle":"string","ok":"boolean"}` |
| `share-bar-copy` | Yes | `{"quelle":"string","ok":"boolean"}` |
| `share-bar-popover` | Yes | `{"open":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Leiste und Blase als role="group" mit aria-label („Artikel teilen“, „Textstelle teilen“)
- Jeder Icon-Button mit aria-label; LinkedIn nennt „öffnet in neuem Tab“
- Fokusring der Buttons (focus-ring), Trefferflaeche mindestens 44 px (button-touch-target)
- Ohne Web Share ist Teilen [hidden] statt wirkungslos; LinkedIn und E-Mail bleiben als Links
- Kopieren meldet Erfolg und Fehler in einer Live-Region (role="status", aria-live="polite"); der Knopf heisst 2 s „Link kopiert“
- Blase per Tastatur erreichbar: Auswahl mit Umschalt+Pfeil (Caret-Browsing), nach der Ruhe fuehrt Tab in die Blase; Escape schliesst und gibt den Fokus zurueck (WCAG 2.1.1, 2.4.3)
- Die Blase oeffnet nicht von selbst den Fokus (kein Fokusraub beim Markieren mit der Maus)

## Web Components Mapping
Derived from anatomy for potential `<nc-share-bar>` custom element:

```js
class NcShareBar extends HTMLElement {
  static observedAttributes = ['label'];
  // Slots: <slot name="actions">
}
```

---

*Generated from `data/share-bar-recipe.json` by `scripts/generate-component-specs.js`*
