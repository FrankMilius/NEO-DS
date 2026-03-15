# Changelog

All notable changes to the NEO Design System are documented in this file.

---

## v1.0.0 — 2026-03-15

Initial stable release of the NEO Design System.

### Added

**Token Architecture**
- 3-Layer token system: Primitives (`--fnd-primitive-*`) → Semantic (`--fnd-color-*`) → Component (`--nc-*`)
- Full token pipeline: `data/design-tokens.json` → SCSS partials → CSS custom properties → JS data
- 4 themes: `neo-light-theme`, `neo-dark-theme`, `customer-light-theme`, `customer-dark-theme`
- Foundation tokens: Color, Typography, Spacing, Radii, Shadows, Motion, Opacity, Z-Index, Border, Focus

**Component Library (70+ components)**
- Atoms: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Rating, Badge, Avatar, Chip, Tag, Label, Code Snippet, Nav Atoms, Segmented Control, Toggle Group, Table
- Molecules: Card, Accordion, Breadcrumb, Pagination, Dropdown Menu, Form Field, Form Hint, Form Label, Fieldset, Input Group, Item, Metric, Popover, Search, Toast, Tooltip, Treeview, Checkbox Group, Radio Group
- Organisms: Alert, Alert Dialog, Banner, Drawer, Modal, Navigation, Navigation Menu, Notification, Toolbar, Data Table, Hero
- Templates: Shell, Dashboard, Content Page, Form Page, Settings Page, Home Hero, Home Basic, Error Page
- Utilities: `.u-sr-only`, `.u-live-region`, responsive helpers, focus ring

**Icon System**
- Tabler Icons integration (5266 icons, 53 categories)
- Heroicons integration (outline set)
- Icon manifest with category tree and search index

**Theme Configurator App**
- Interactive Vue 3 app for token editing
- Foundation editors: Colors, Typography, Spacing, Radii, Shadows, Focus Ring, Media, Opacity/Z-Index/Motion, Surfaces, Icons, Elements, Themes
- Component arena (lab viewport) with live token editing for all 70+ components
- Arena filter bar, split light/dark preview, grid inspector
- Drupal export adapter: generates `theme-override.css` + `theme-settings.json`
- Recipe-driven component token groups

**Documentation**
- 98 docs pages covering all components and foundation sections
- Auto-generated Style/API/A11y tabs from recipe JSON
- Docs sidebar generator, search index, docs server (port 3000)

**Build & Tooling**
- `npm run build:css` — Dart Sass compilation
- `npm run tokens:pipeline` — full token validation + generation + build + test
- `npm test` — CI gate: build + lint tokens + lint docs + lint recipes + lint fragments
- `npm run icons:sync` — sync icon libraries from npm
