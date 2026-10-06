# scroll-expand Component Spec
> Version 1.0.1 | Status: draft | Layer: organism

Tags: `animation`, `scroll`, `parallax`

## Anatomy
Root element: `.nc-scroll-expand`

### DOM Notes
- Element expandiert von Content-Breite zum Viewport beim Scrollen.
- Stand 25.08.2026: BESCHRIEBEN, NICHT GEBAUT. Es gibt weder eine SCSS-Datei noch eine Zeile CSS fuer .nc-scroll-expand — die Wurzelklasse kommt im Stylesheet null Mal vor. Der Status lautete bis heute `stable`; das war eine Zusage, hinter der nichts stand. Bewusst behalten (Entscheidung 25.08.), weil das Recipe die Spezifikation fuer den spaeteren Bau ist — aber als `draft`, damit niemand es fuer einsatzbereit haelt.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-scroll-expand`

### Timing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-anim-expand-duration` | — | `--mod-anim-expand-duration` |
| `--nc-anim-scroll-easing` | — | `--mod-anim-scroll-easing` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-scroll-expand>` custom element:

```js
class NcScrollExpand extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/scroll-expand-recipe.json` by `scripts/generate-component-specs.js`*
