    # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is primarily HTML, JavaScript, and JSON with SCSS styling. The design system uses Foundation tokens (`--fnd-*`) and semantic tokens. When editing SCSS files, preserve the token architecture.

## Core Rules

- When I interrupt you or stop a tool use, immediately ask what I want instead. Do NOT restart the same approach — assume I want a different direction.

## Code Editing Rules

- Always read files before editing them. Never batch-edit multiple files without reading each one first.

## Workflow Preferences

- When I give a numbered plan or say "implement phase X", go straight to implementation. Do NOT re-analyze, re-plan, or verify previous phases unless I explicitly ask.

## Git Operations

- Before committing to git, run `git status` and only stage files relevant to the current task. Exclude unrelated files like manifests, screenshots, or config files unless explicitly asked.
- When a session is getting long or complex, proactively commit working changes before starting the next task. Don't let multiple uncommitted features pile up.

## Dev Server

- Before starting a dev server, check if the port is already in use with `lsof -i :3000` (or the relevant port) and handle it automatically.

## Build & Development Commands

```bash
npm run dev              # Start all watchers + docs server (localhost:3000)
npm run build            # Full production build: tokens + icons + CSS
npm run build:css        # Compile SCSS → styles.css (compressed)
npm run watch            # SCSS watcher only (Dart Sass, poll mode)
npm test                 # Build + lint tokens + lint docs (CI gate)
npm run tokens:pipeline  # Full token pipeline: validate → generate → build → test
npm run docs             # Docs server only (port 3000)
npm run docs:watch       # Docs content watcher only
npm run icons:sync       # Sync Tabler Icons from node_modules → assets/icons
npm run icons            # Regenerate data/icons-manifest.json
```

**Build output:** `scss/scss/main.scss` → `styles.css` via Dart Sass.

**Token pipeline:** `data/design-tokens.json` → `scripts/generate-tokens.js` → auto-generated `_tokens-*.generated.scss` files + CSS + JS. Never edit `*.generated.scss` files directly.

## Architecture

### SCSS Layers (Atomic Design + ITCSS)

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

### Three-Layer Token System

1. **Primitives** (`--fnd-color-{palette}-{shade}`): Raw color palettes, shade scale 100–950
2. **Semantic** (`--fnd-color-{role}`): Theme-aware mappings like `text-primary`, `interactive-default`, `feedback-success`
3. **Component** (`--nc-{component}-{property}`): Per-component tokens registered in `:root` in `_component-tokens.scss`

Components always reference component tokens (`var(--nc-button-bg)`), which reference semantic tokens, which reference primitives. This enables per-scope overrides and theming.

### Theme System

Four themes: `neo-light-theme` (default), `neo-dark-theme`, `customer-light-theme`, `customer-dark-theme`.

- Semantic maps in `_color-semantic.scss` (4 maps: light-base, dark-base, light-secondary, dark-secondary)
- Theme classes + `prefers-color-scheme` auto-switch in `_color-themes.scss`
- `data-theme` attribute on `<html>` overrides auto-switch
- Dark mode component overrides in the dark block of `_component-tokens.scss`
- Dark hover/active states mix toward `always-light` (not `always-dark`)
- Dark interactive colors use `secondary-500` (#009fe3) for WCAG contrast on black backgrounds

### Icon System

Source: Tabler Icons (`@tabler/icons` npm). 53 categories, 5266 icons. Standard: 24px, stroke-width 1.5, currentColor.

Update flow: `npm update @tabler/icons && npm run icons:sync && npm run icons`

## Key Conventions

- **Comments in German** throughout SCSS files
- **BEM naming**: `.nc-{component}`, `.nc-{component}__element`, `.nc-{component}--modifier`
- **Token prefixes**: Foundation `--fnd-*`, Component `--nc-*`, Legacy `--ds-*`
- **Template classes**: `.t-{name}` (e.g., `.t-dashboard`)
- **Utility classes**: `.u-{name}` (e.g., `.u-sr-only`)
- **Generated files** are marked `DO NOT EDIT DIRECTLY`
- **No hardcoded values** in components — use foundation tokens. `npm run lint:tokens` enforces this for shadows, font-weight, opacity, z-index, colors
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

## Dependencies

Only two dev dependencies: `sass` (Dart Sass) and `@tabler/icons`. All build scripts are plain Node.js with no additional packages.
