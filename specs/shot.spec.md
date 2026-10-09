# shot Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `molecules`, `media`, `image`, `interactive`, `website`

## Anatomy
Root element: `.nc-shot`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| img | `.nc-shot__img` | Yes | Master-Bild im Fokus-Crop: object-fit cover, object-position und transform-origin = Fokuspunkt, transform scale = Zoom (inline, setzt shotBauen). |
| frame | `.nc-shot__frame` | No | Browser-Rahmen (Darstellung frame). Mit .nc-shot--shadow traegt er den Schatten. |
| chrome-bar | `.nc-shot__chrome-bar` | No | Leiste des Browser-Rahmens (nur Rahmen „Browser“): drei Punkte und Adresse. |
| chrome-dot | `.nc-shot__chrome-dot` | No | Punkt der Leiste (dreimal). |
| chrome-url | `.nc-shot__chrome-url` | No | Adresse in der Leiste (Text, Vorgabe workplace.neocosmo.de). |
| viewport | `.nc-shot__viewport` | No | Bildbereich im Rahmen. |
| lens | `.nc-shot__lens` | No | Lupe (Darstellung lens). Legt das Verhalten beim Binden an; zeigt das Bild vergroessert unter dem Zeiger. |
| hotspot | `.nc-shot__hotspot` | No | Marker (button, Darstellung hotspots), Lage per left/top in Prozent. Pulsierender Ring per ::after (aus bei reduced motion). |
| tip | `.nc-shot__tip` | No | Erklaerung am offenen Marker (setzt das Verhalten in den Knopf): Detail-Zoom als verschachtelter .nc-shot, optional Titel, Text. |
| tip-title | `.nc-shot__tip-title` | No | Titel der Erklaerung (nur, wenn der Marker einen Titel hat). |
| compare | `.nc-shot__compare` | No | Huelle des Vorher/Nachher-Vergleichs: zwei verschachtelte .nc-shot, Linie, unsichtbarer Regler (input type=range) ueber der ganzen Flaeche. |
| divider | `.nc-shot__divider` | No | Vergleichslinie; zeigt den Tastaturfokus des Reglers. |

### DOM Notes
- Wurzel .nc-shot[data-nc-shot="none|frame|kenburns|lens|hotspots|compare"]. Die Groesse gibt der Konsument (Story-Gallery-Medium, Feature-Listen-Medium); mit Format (ratio) setzt shotBauen .nc-shot--ratio und aspect-ratio inline.
- Verschachtelte .nc-shot (Vergleich, Erklaerung) tragen kein data-nc-shot — das Behavior bindet nur Wurzeln.
- Markup baut NeoBehaviors.shotAufbauen(container, opts) aus den Karten-Daten (field_sg_cards): { src, srcset?, sizes?, alt?, ratio?, focal: { x, y }, zoom?, preset?, params?, loading? } — dieselben Optionen wie bisher window.NeoShot.render; Rueckgabe: Aufraeumen (Verhalten loesen, Container leeren).
- Daten fuer das Verhalten im Markup: Ken-Burns data-nc-shot-fokus / -ziel ("x y zoom") und data-nc-shot-dauer (s, dazu --nc-shot-dur inline); Lupe data-nc-shot-lupe-groesse (px) / -zoom; Marker data-nc-shot-titel (optional), data-nc-shot-text, data-nc-shot-fokus.
- Ken-Burns: Fahrt zwischen Start- und Ziel-Fokus im Takt Dauer + 0,8 s (Transition object-position/transform ueber --nc-shot-dur); pausiert ausserhalb des Sichtbereichs (IntersectionObserver, Schwelle 0,2); bei prefers-reduced-motion keine Fahrt und keine Transition.
- Marker: Disclosure — aria-expanded, die Erklaerung haengt im Knopf (Lage relativ zum Marker wie bisher), Text als aria-description. Klick in die Erklaerung laesst sie offen, Klick ins Bild schliesst; der Klick auf einen Marker steigt nicht weiter auf (wie neo-shot.js).
- Vergleich: der Regler liegt unsichtbar ueber der Flaeche (Ziehen ueberall); das zweite Bild wird per clip-path inset beschnitten, die Linie folgt. Tastaturfokus: Fokusring an der Linie (:has(input:focus-visible)).
- Dunkle Fassung allein ueber Tokens (.neo-dark-theme, .customer-dark-theme, prefers-color-scheme ohne data-theme).

## Variants
### Darstellung (`darstellung`)
Praesentations-Preset (data-nc-shot, Karten-Feld preset).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| frame | — |  |
| kenburns | — |  |
| lens | — |  |
| hotspots | — |  |
| compare | — |  |

### Rahmen (`rahmen`)
Nur Darstellung frame (Karten-Feld frame). Browser zeigt die Leiste; Minimal und Ohne nur Radius (und Schatten).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| browser | — |  |
| minimal | — |  |

### Schatten (`schatten`)
Nur Darstellung frame (Karten-Feld shadow, Vorgabe an): .nc-shot--shadow am Rahmen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| mit | — |  |
| ohne | — |  |

### Format (`format`)
Frei: Groesse vom Konsumenten (Story-Gallery). Ratio: Karten-Feld ratio → .nc-shot--ratio + aspect-ratio, volle Breite (Feature-Liste, Autoren-Vorschau).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| frei | — |  |
| ratio | `.nc-shot--ratio` |  |

## States
Supported: `default`, `hover`, `open`, `focus`

- **open**: 
- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `nc-shot`

### Akzent
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shot-accent` | — | — |

### Browser-Rahmen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shot-frame-radius` | — | — |
| `--nc-shot-frame-shadow` | — | — |
| `--nc-shot-chrome-gap` | — | — |
| `--nc-shot-chrome-padding` | — | — |
| `--nc-shot-chrome-bg` | — | — |
| `--nc-shot-chrome-border` | — | — |
| `--nc-shot-chrome-dot-bg` | — | — |
| `--nc-shot-chrome-url-font-size` | — | — |
| `--nc-shot-chrome-url-font-family` | — | — |
| `--nc-shot-chrome-url-color` | — | — |
| `--nc-shot-chrome-url-bg` | — | — |
| `--nc-shot-chrome-url-radius` | — | — |
| `--nc-shot-chrome-url-padding` | — | — |

### Lupe
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shot-lens-border-width` | — | — |
| `--nc-shot-lens-shadow` | — | — |
| `--nc-shot-lens-bg` | — | — |

### Marker und Erklärung
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shot-hotspot-size` | — | — |
| `--nc-shot-hotspot-bg` | — | — |
| `--nc-shot-hotspot-border-width` | — | — |
| `--nc-shot-hotspot-ping-color` | — | — |
| `--nc-shot-tip-width` | — | — |
| `--nc-shot-tip-bg` | — | — |
| `--nc-shot-tip-color` | — | — |
| `--nc-shot-tip-border-width` | — | — |
| `--nc-shot-tip-radius` | — | — |
| `--nc-shot-tip-padding` | — | — |
| `--nc-shot-tip-text-size` | — | — |
| `--nc-shot-tip-text-gap` | — | — |
| `--nc-shot-tip-title-gap` | — | — |
| `--nc-shot-tip-title-weight` | — | — |
| `--nc-shot-tip-media-radius` | — | — |

### Vergleich
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shot-divider-width` | — | — |
| `--nc-shot-divider-shadow` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle | Auf einem Marker (nativer Knopf-Klick): oeffnet seine Erklaerung bzw. schliesst sie; eine andere offene schliesst. |
| `Space` | toggle | Wie Enter. |
| `Escape` | close | Schliesst die offene Erklaerung, der Fokus bleibt bzw. kommt an ihren Marker. |
| `ArrowRight` | increment | Vergleichsregler: +1. |
| `ArrowUp` | increment | Vergleichsregler: +1. |
| `ArrowLeft` | decrement | Vergleichsregler: -1. |
| `ArrowDown` | decrement | Vergleichsregler: -1. |
| `PageUp` | increment-large | Vergleichsregler: +10. |
| `PageDown` | decrement-large | Vergleichsregler: -10. |
| `Home` | first | Vergleichsregler: 0 (nur das erste Bild). |
| `End` | last | Vergleichsregler: 100 (nur das zweite Bild). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `shot-hotspot-toggle` | Yes | `{"index":"number","open":"boolean"}` |
| `shot-compare-change` | Yes | `{"value":"number"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-shot>` custom element:

```js
class NcShot extends HTMLElement {
  static observedAttributes = ['darstellung', 'rahmen', 'schatten', 'format'];
  // Slots: <slot name="img">
}
```

---

*Generated from `data/shot-recipe.json` by `scripts/generate-component-specs.js`*
