# Architecture Rules

## SCSS Layers (Atomic Design + ITCSS)

Entry point: `scss/scss/main.scss` — uses `@use/@forward` (modern Sass modules, no `@import`).

| Layer | Path | Purpose |
|-------|------|---------|
| 00-settings | Design tokens, color maps, component tokens | Configuration only, no CSS output |
| 01-tools | Functions (`rem()`, `em()`) and mixins | No CSS output |
| 02-generic | Reset, fonts, keyframe animations | Base CSS |
| 03-elements | HTML element defaults (body, headings, links, forms) | |
| 04-objects | Layout patterns (container, grid, video) | |
| 05-atoms | Smallest components (button, icon, input, badge, chip) | |
| 06-molecules | Component combinations (card, accordion, breadcrumb) | |
| 07-organisms | Complex sections (header, footer, modal, data-table) | |
| 08-templates | Page layouts (`.t-dashboard`, `.t-content-page`, etc.) | |
| 09-pages | Page-specific styles | |
| 10-utilities | Helper classes (`.u-sr-only`, visibility, spacing) | |

## Three-Layer Token System

1. **Primitives** (`--fnd-color-{palette}-{shade}`): Raw color palettes, shade scale 100–950
2. **Semantic** (`--fnd-color-{role}`): Theme-aware mappings like `text-primary`, `interactive-default`, `feedback-success`
3. **Component** (`--nc-{component}-{property}`): Per-component tokens registered in `:root` in `_component-tokens.scss`

Components always reference component tokens (`var(--nc-button-bg)`), which reference semantic tokens, which reference primitives. This enables per-scope overrides and theming.

## Theme System

Four themes: `neo-light-theme` (default), `neo-dark-theme`, `customer-light-theme`, `customer-dark-theme`.

- Semantic maps in `_color-semantic.scss` (4 maps: light-base, dark-base, light-secondary, dark-secondary)
- Theme classes + `prefers-color-scheme` auto-switch in `_color-themes.scss`
- `data-theme` attribute on `<html>` overrides auto-switch
- Dark mode component overrides in the dark block of `_component-tokens.scss`
- Dark hover/active states mix toward `always-light` (not `always-dark`)
- Dark interactive colors use `secondary-500` (#009ee3) for WCAG contrast on black backgrounds

## Icon System

Source: Tabler Icons (`@tabler/icons` npm). 53 categories, 5266 icons. Standard: 24px, stroke-width 1.5, currentColor.

Update flow: `npm update @tabler/icons && npm run icons:sync && npm run icons`
