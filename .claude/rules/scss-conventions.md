# SCSS Conventions & Token Rules

## Naming Conventions

- **Comments in German** throughout SCSS files
- **BEM naming**: `.nc-{component}`, `.nc-{component}__element`, `.nc-{component}--modifier`
- **Token prefixes**: Foundation `--fnd-*`, Component `--nc-*`
- **Template classes**: `.t-{name}` (e.g., `.t-article`); page layouts via `data-layout` presets on `<body>` (Shell)
- **Utility classes**: `.u-{name}` (e.g., `.u-sr-only`)
- **Generated files** are marked `DO NOT EDIT DIRECTLY`

## Token Usage Rules

- **No hardcoded values** in components — always use foundation tokens
- `npm run lint:tokens` enforces this for shadows, font-weight, opacity, z-index, colors
- **`color-mix()` over `rgba()`** for transparent overlays
- **Focus indicators**: All interactive elements need `:focus-visible` with `@include focus-ring`
- **`transition-quick()` mixin** takes a single Sass list arg: `transition-quick((prop1, prop2))` not `transition-quick(prop1, prop2)`

## Key Mixins (in `01-tools/`)

- `button-base()` — Shared button foundation
- `static-surface-base()` / `interactive-surface-base()` — Surface patterns for badges, chips, toggles
- `surface-size($size)` — Map standard heights (xs/sm/md/lg) to any surface
- `focus-ring()` — Accessible focus indicator
- `transition-quick($props)` — Quick motion transitions
- `respond-to($breakpoint)` — Responsive media queries

## Anti-Generic Design Guardrails

These rules prevent regressions and enforce the token architecture:

- **Colors:** NEVER use hardcoded hex/rgb values in component SCSS. Always use `var(--fnd-*)` or `var(--nc-*)`. The only exception is `_color-primitives.scss` where tokens are defined.
- **Shadows:** NEVER use hardcoded `box-shadow`. Always use `var(--fnd-shadow-*)` or `var(--fnd-elevation-*)`.
- **Font-Weight:** NEVER use numeric font-weight (300, 400, 700). Always use `var(--fnd-font-weight-*)`.
- **Z-Index:** NEVER use hardcoded z-index numbers. Always use `var(--fnd-z-*)`.
- **Opacity:** NEVER use hardcoded opacity for disabled/hover states. Always use `var(--fnd-opacity-*)`.
- **Spacing:** Prefer `var(--fnd-spacing-*)` tokens for padding/margin/gap. Raw `px` values only for optical adjustments ≤4px.
- **Typography:** Use fluid type scale `var(--fs-*)` for font-size. Never hardcode `px` font sizes.
- **Transitions:** NEVER use `transition: all`. Use `@include transition-quick((specific-prop1, specific-prop2))`.
- **!important:** NEVER use `!important` outside of `10-utilities/`. Current budget: max 60 occurrences in compiled CSS.
- **@import:** NEVER use `@import`. Only `@use` and `@forward` (modern Sass modules).
- **Legacy tokens:** NEVER introduce `--ds-*` prefix. All tokens use `--fnd-*` (foundation) or `--nc-*` (component).
