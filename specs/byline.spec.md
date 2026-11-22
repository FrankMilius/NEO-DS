# byline Component Spec
> Version 1.0.1 | Status: stable | Layer: molecule

Tags: `molecules`, `content`, `blog`, `website`

## Anatomy
Root element: `.nc-byline`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| photo | `.nc-byline__photo` | Yes | <span class="nc-avatar nc-byline__photo"> mit <img class="nc-avatar__image" alt=""> und <span class="nc-avatar__fallback" aria-hidden="true">Initialen</span>. Ohne Foto bleiben die Initialen sichtbar. |
| name | `.nc-byline__name` | Yes | Name der Person; spaeter ein Link auf die Autorenseite (Entwurf E). |
| meta | `.nc-byline__meta` | No | Lesezeit und <time datetime> mit Datum; zwischen den Teilen ein Punkt aus CSS (content: "·" / ""). |

### DOM Notes
- Das Foto ist dekorativ (alt=""), der Name steht als Text daneben. Die Initialen tragen aria-hidden="true", damit der Name nicht doppelt vorgelesen wird.
- Mehrere Autorinnen und Autoren: erste Person gross, weitere Namen im selben __name mit „und“ (Drupal: Feld field_author, Phase 5).

## Variants
### Groesse (`size`)
Artikelkopf (Standard) oder Karte (kleiner; ab 384px Breite in einer Zeile).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| md | — |  |
| sm | `.nc-byline--sm` |  |

### Foto (`photo`)
Mit Foto oder nur Initialen (Person ohne Bild).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| image | — |  |
| initials | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-byline`

### Foto
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-byline-gap` | — | — |
| `--nc-byline-photo-size` | — | — |
| `--nc-byline-photo-size-sm` | — | — |
| `--nc-byline-initials-size` | — | — |
| `--nc-byline-initials-size-sm` | — | — |

### Name und Angaben
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-byline-font-size` | — | — |
| `--nc-byline-font-size-sm` | — | — |
| `--nc-byline-name-color` | — | — |
| `--nc-byline-name-weight` | — | — |
| `--nc-byline-meta-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Foto alt="" und Initialen aria-hidden, der Name ist Text
- Datum als <time datetime>
- Trennpunkt aus CSS mit leerem Alternativtext (content: "·" / "")

## Web Components Mapping
Derived from anatomy for potential `<nc-byline>` custom element:

```js
class NcByline extends HTMLElement {
  static observedAttributes = ['size', 'photo'];
  // Slots: <slot name="photo">, <slot name="name">
}
```

---

*Generated from `data/byline-recipe.json` by `scripts/generate-component-specs.js`*
