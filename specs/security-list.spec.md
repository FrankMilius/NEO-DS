# security-list Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `trust`

## Anatomy
Root element: `.nc-security-list`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-security-list__item` | Yes | — |
| icon | `.nc-security-list__icon` | No | — |
| text | `.nc-security-list__text` | No | — |

### DOM Notes
- Liste: ul.nc-security-list ohne Aufzaehlungszeichen, Grid mit gap spacing-03.
- Item: li.nc-security-list__item als Kachel — Schrift body-m, background-base, Rahmen border-secondary, radius-4xl, Polsterung spacing-04/05; der Text steht direkt im Item.
- Mit Symbol (Entscheidung 06.10.2026): svg.nc-security-list__icon (24px, text-accent) + .nc-security-list__text; das Item wird dann ein Raster Symbol | Text. Im Text: eine Zeile oder Titel (z. B. <strong>) mit Beschreibung — jedes weitere Kind in body-s, text-secondary.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-security-list`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-security-list>` custom element:

```js
class NcSecurityList extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="item">
}
```

---

*Generated from `data/security-list-recipe.json` by `scripts/generate-component-specs.js`*
