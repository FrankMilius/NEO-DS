# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is primarily HTML, JavaScript, and JSON with SCSS styling. The design system uses Foundation tokens (`--fnd-*`) and semantic tokens. When editing SCSS files, preserve the token architecture.

## Core Rules

- When I interrupt you or stop a tool use, immediately ask what I want instead. Do NOT restart the same approach — assume I want a different direction.
- Always read files before editing them. Never batch-edit multiple files without reading each one first.

## Workflow Preferences

- When I give a numbered plan or say "implement phase X", go straight to implementation. Do NOT re-analyze, re-plan, or verify previous phases unless I explicitly ask.
- I sometimes give instructions in German. `umsetzen` = implement now. `Phase X umsetzen` = implement phase X immediately without re-analysis. Understand these as direct action commands.

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
npm test                 # Build + unit tests + lint (CI gate)
npm run test:unit        # Vitest unit tests only (28 tests)
npm run storybook        # Storybook dev server (localhost:6006, 107 stories)
npm run agents           # Agent network: auto-detect changed files
npm run agents:full      # Full pipeline: Builder → Tester → Documenter (~30s)
npm run dashboard        # Quality dashboard: 10 KPIs (current: 97/100)
```

**Build output:** `scss/scss/main.scss` → `styles.css` via Dart Sass.

**Token pipeline:** `data/design-tokens.json` → `scripts/generate-tokens.js` → auto-generated `_tokens-*.generated.scss` files + CSS + JS. Never edit `*.generated.scss` files directly.

## Detailed Rules (modular)

For architecture, SCSS conventions, and Drupal rules, check the linked files:

- For SCSS layers, token system, and theme architecture check @.claude/rules/architecture.md
- For SCSS naming, token usage, mixins, and guardrails check @.claude/rules/scss-conventions.md
- For Drupal block creation, templates, and integration check @.claude/rules/drupal.md

## Dependencies

Core: `sass` (Dart Sass), `@tabler/icons`. Testing: `vitest`. Docs: `storybook`, `pptxgenjs`. All build scripts are plain Node.js.
