# scroll-reveal Component Spec
> Version 1.0.2 | Status: draft | Layer: organism

Tags: `animation`, `scroll`, `fade-in`

## Anatomy
Root element: `.nc-scroll-reveal`

### DOM Notes
- Staggered Fade-In via Intersection Observer.
- Stand 25.08.2026: BESCHRIEBEN, NICHT GEBAUT. Es gibt weder eine SCSS-Datei noch eine Zeile CSS fuer .nc-scroll-reveal — die Wurzelklasse kommt im Stylesheet null Mal vor. Der Status lautete bis heute `stable`; das war eine Zusage, hinter der nichts stand. Bewusst behalten (Entscheidung 25.08.), weil das Recipe die Spezifikation fuer den spaeteren Bau ist — aber als `draft`, damit niemand es fuer einsatzbereit haelt.
- Pruefung 08.10.2026: weiterhin nicht gebaut, auf der Website ohne Verwendung. Gestaffeltes Einblenden gibt es auf der Website nur bauteilgebunden: .nc-card-grid[data-animation="reverse-domino"] und .nc-bento-grid[data-animation="reveal"] (IntersectionObserver in neo-theme.js setzt is-revealed, mit prefers-reduced-motion sofort) — beide in den Recipes card-grid und bento-grid.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-scroll-reveal`

### Timing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-anim-fade-duration` | — | `--mod-anim-fade-duration` |
| `--nc-anim-fade-easing` | — | `--mod-anim-fade-easing` |
| `--nc-anim-stagger-delay` | — | `--mod-anim-stagger-delay` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-scroll-reveal>` custom element:

```js
class NcScrollReveal extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/scroll-reveal-recipe.json` by `scripts/generate-component-specs.js`*
