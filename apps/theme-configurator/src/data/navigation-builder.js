// ==========================================================================
// Navigation Builder — Generiert Navigationsbaum aus Component Registry
// ==========================================================================
// Ersetzt den statischen navigationTree aus tokens.generated.js.
// Quelle: data/component-registry.json (auto-generiert via npm run registry)
//
// Struktur: ITCSS-Layers als Top-Level-Gruppen
//   Foundations → Objects → Atoms → Molecules → Organisms → Templates → Utilities
// ==========================================================================

import registry from '../../../../data/component-registry.json'
import { componentTokenGroups } from './tokens.generated.js'
import { istEntwurf } from './recipe-entwuerfe.js'

// ---------------------------------------------------------------------------
// Icon-Mapping pro Komponente (bekannte Zuordnungen aus dem alten Tree)
// ---------------------------------------------------------------------------

const COMPONENT_ICONS = {
  // Foundation
  'color-primitives': 'palette', 'color-semantic': 'paint', colors: 'palette',
  typography: 'typography', spacing: 'spacing-horizontal', radii: 'border-radius',
  border: 'border-style-2', shadow: 'shadow', elevation: 'shadow',
  opacity: 'eye', layout: 'layout-grid', breakpoints: 'device-desktop',
  motion: 'ripple', icons: 'icons', a11y: 'accessible',
  // Objects
  container: 'box', grid: 'layout-grid', section: 'section',
  'aspect-ratio': 'aspect-ratio', video: 'video',
  // Atoms
  button: 'click', input: 'forms', textarea: 'text-wrap',
  select: 'list', checkbox: 'checkbox', radio: 'circle-dot',
  switch: 'toggle-left', slider: 'adjustments-horizontal',
  rating: 'star', badge: 'badge', tag: 'tag', chip: 'circle',
  avatar: 'user-circle', icon: 'icons', label: 'tag',
  alert: 'alert-triangle', divider: 'separator',
  spinner: 'loader-2', skeleton: 'layout', progress: 'progress',
  'code-snippet': 'code', kbd: 'keyboard', status: 'point',
  'link-with-arrow': 'arrow-narrow-right', square: 'square',
  'text-blocks': 'text-wrap', 'toggle-group': 'toggle-left',
  'segmented-control': 'columns', table: 'table',
  'nav-atoms': 'navigation', card: 'id',
  // Molecules
  accordion: 'layout-navbar-expand', breadcrumb: 'arrows-right',
  tabs: 'layout-navbar-collapse', 'form-field': 'forms',
  'form-label': 'tag', 'form-error': 'alert-circle',
  'form-hint': 'info-circle', 'input-group': 'layout-columns',
  'dropdown-menu': 'menu-2', popover: 'message-circle',
  tooltip: 'info-square', toast: 'bell', search: 'search',
  'logo-wall': 'brand-abstract', item: 'list',
  pagination: 'dots', stepper: 'list-numbers',
  metric: 'chart-bar', 'empty-state': 'mood-empty',
  treeview: 'sitemap', 'file-upload': 'upload',
  timeline: 'timeline', 'otp-input': 'password',
  'checkbox-group': 'list-check', 'radio-group': 'circles',
  'square-value': 'square', 'nav-molecules': 'navigation',
  testimonial: 'quote', 'text-only': 'align-left',
  facts: 'chart-pie', faq: 'help', marquee: 'marquee-2',
  pricing: 'currency-euro', 'security-list': 'shield-check',
  // Organisms
  hero: 'photo', header: 'layout-navbar', footer: 'layout-bottombar',
  navigation: 'navigation', 'navigation-menu': 'menu-2',
  modal: 'app-window', drawer: 'layout-sidebar-right',
  'alert-dialog': 'alert-triangle', notification: 'bell',
  banner: 'flag', sidebar: 'layout-sidebar',
  'data-table': 'table', fieldset: 'rectangle',
  form: 'forms', 'form-section': 'section',
  'form-actions': 'click', 'form-block': 'layout-columns',
  toolbar: 'tools', carousel: 'slideshow',
  cta: 'speakerphone', 'video-section': 'video',
  gallery: 'photo', question: 'help-circle',
  solutions: 'bulb', 'product-showcase': 'package',
  'text-media': 'photo', 'validation-summary': 'list-check',
  'feature-accordion': 'layout-navbar-expand',
  shell: 'layout', 'card-grid': 'grid-dots',
  'card-grid-cta': 'grid-dots', 'hero-tom': 'photo',
  'hero-tmob': 'photo', 'story-gallery': 'book',
  'fade-gallery': 'slideshow',
  'navigation-orchestration': 'navigation',
  'navigation-tab-mega': 'layout-navbar',
  'scroll-expand': 'arrows-maximize', 'scroll-reveal': 'eye',
  'psychedelic-bg': 'palette', 'parallax-bg': 'layers-intersect',
  // Templates
  // (dashboard, error-page, home-basic, home-hero, settings-page am
  // 08.10.2026 stillgelegt — Ersatz sind die Shell-Presets)
  'content-templates': 'article',
}

const LAYER_CONFIG = {
  foundation: { id: 'foundation', label: 'Foundation', icon: 'building-arch', order: 0 },
  object:     { id: 'objects',    label: 'Objects',     icon: 'box',            order: 1 },
  atom:       { id: 'atoms',      label: 'Atoms',       icon: 'atom',           order: 2 },
  molecule:   { id: 'molecules',  label: 'Molecules',   icon: 'hexagons',       order: 3 },
  organism:   { id: 'organisms',  label: 'Organisms',   icon: 'building',       order: 4 },
  pattern:    { id: 'patterns',   label: 'Muster',      icon: 'layout-grid',    order: 4.5 },
  template:   { id: 'templates',  label: 'Templates',   icon: 'template',       order: 5 },
  utility:    { id: 'utilities',  label: 'Utilities',   icon: 'tool',           order: 6 },
}

// Subgroup-Zuordnung fuer Komponenten (semantische Gruppierung)
const SUBGROUP_MAP = {
  // Atoms Subgroups
  button: 'Actions', input: 'Form Inputs', textarea: 'Form Inputs',
  select: 'Form Inputs', checkbox: 'Form Inputs', radio: 'Form Inputs',
  switch: 'Form Inputs', slider: 'Form Inputs', rating: 'Form Inputs',
  badge: 'Data Display', tag: 'Data Display', chip: 'Data Display',
  avatar: 'Data Display', status: 'Data Display', card: 'Data Display',
  icon: 'Data Display', label: 'Data Display', table: 'Data Display',
  'code-snippet': 'Data Display', kbd: 'Data Display',
  spinner: 'Loading & Progress', skeleton: 'Loading & Progress', progress: 'Loading & Progress',
  divider: 'Typography & Layout', 'text-blocks': 'Typography & Layout',
  'link-with-arrow': 'Typography & Layout', square: 'Typography & Layout',
  alert: 'Feedback', 'toggle-group': 'Controls', 'segmented-control': 'Controls',
  'nav-atoms': 'Navigation',
  // Molecules Subgroups
  accordion: 'Controls', tabs: 'Navigation',
  'form-field': 'Form Structure', 'form-label': 'Form Structure',
  'form-error': 'Form Structure', 'form-hint': 'Form Structure',
  'input-group': 'Form Structure',
  'dropdown-menu': 'Feedback', popover: 'Feedback', tooltip: 'Feedback',
  toast: 'Feedback', search: 'Search & Toolbar',
  breadcrumb: 'Navigation', pagination: 'Navigation', treeview: 'Navigation',
  'nav-molecules': 'Navigation',
  item: 'Data Display', metric: 'Data Display', 'empty-state': 'Data Display',
  stepper: 'Data Display', timeline: 'Data Display',
  'logo-wall': 'Content', testimonial: 'Content', 'text-only': 'Content',
  facts: 'Content', faq: 'Content', marquee: 'Content',
  pricing: 'Content', 'security-list': 'Content', 'square-value': 'Content',
  'file-upload': 'Form Inputs', 'otp-input': 'Form Inputs',
  'checkbox-group': 'Form Inputs', 'radio-group': 'Form Inputs',
  // Organisms Subgroups
  hero: 'Content', header: 'Layout', footer: 'Layout',
  navigation: 'Navigation', 'navigation-menu': 'Navigation',
  'navigation-orchestration': 'Navigation',
  'navigation-tab-mega': 'Navigation',
  modal: 'Feedback', drawer: 'Feedback', 'alert-dialog': 'Feedback',
  notification: 'Feedback', banner: 'Feedback',
  sidebar: 'Layout', shell: 'Layout',
  'data-table': 'Data Display', fieldset: 'Form Structure',
  form: 'Form Structure', 'form-section': 'Form Structure',
  'form-actions': 'Form Structure', 'form-block': 'Form Structure',
  'validation-summary': 'Form Structure',
  toolbar: 'Search & Toolbar',
  carousel: 'Content', cta: 'Content', 'video-section': 'Content',
  gallery: 'Content', question: 'Content', solutions: 'Content',
  'product-showcase': 'Content', 'text-media': 'Content',
  'feature-accordion': 'Content', 'card-grid': 'Content',
  'card-grid-cta': 'Content', 'hero-tom': 'Content', 'hero-tmob': 'Content',
  'story-gallery': 'Content', 'fade-gallery': 'Content',
  'scroll-expand': 'Content', 'scroll-reveal': 'Content',
  'psychedelic-bg': 'Content', 'parallax-bg': 'Content',
}

// ---------------------------------------------------------------------------
// Foundation Nav Items (statisch — Foundations haben keine Recipes/Arenas)
// ---------------------------------------------------------------------------

const FOUNDATION_ITEMS = [
  { id: 'grid', label: 'Grid', icon: 'layout-grid', section: 'foundation-grid' },
  { id: 'colors', label: 'Color', icon: 'palette', section: 'foundation-colors' },
  { id: 'surfaces', label: 'Surfaces', icon: 'layers-intersect', section: 'foundation-surfaces' },
  { id: 'spacing', label: 'Spacing', icon: 'spacing-horizontal', section: 'foundation-spacing' },
  { id: 'sizes', label: 'Sizes', icon: 'ruler-measure', section: 'foundation-size' },
  { id: 'typography', label: 'Typography', icon: 'typography', section: 'foundation-typography' },
  { id: 'radius', label: 'Radii', icon: 'border-radius', section: 'foundation-radius' },
  { id: 'border', label: 'Border', icon: 'border-style-2', section: 'foundation-border' },
  { id: 'focus', label: 'Focus Ring', icon: 'focus-2', section: 'foundation-focus' },
  { id: 'media', label: 'Media Ratios', icon: 'aspect-ratio', section: 'foundation-media' },
  { id: 'elements', label: 'Elements', icon: 'components', section: 'foundation-elements' },
  { id: 'icons', label: 'Icons', icon: 'icons', section: 'foundation-icons' },
  { id: 'themes', label: 'Themes', icon: 'color-swatch', section: 'foundation-themes' },
  { id: 'shadows', label: 'Shadow & Elevation', icon: 'shadow', section: 'foundation-shadows' },
  { id: 'opacity-zindex-motion', label: 'Opacity, Z-Index & Motion', icon: 'eye', section: 'foundation-opacity' },
  { id: 'praesentation', label: 'Präsentation', icon: 'presentation', section: 'foundation-praesentation' },
]

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

function buildNavigationTree () {
  const groups = new Map()

  // 1. Foundation-Gruppe (statisch, hat eigene Editoren)
  groups.set('foundation', {
    ...LAYER_CONFIG.foundation,
    children: [...FOUNDATION_ITEMS],
  })

  // 2. Komponenten aus Registry (Layer 04-07)
  for (const [name, entry] of Object.entries(registry.components)) {
    const layer = entry.layer
    if (!layer || layer === 'unknown') continue

    // Nur Items die eine Arena ODER ein Recipe haben
    if (!entry.coverage.arena && !entry.coverage.recipe) continue

    // Pruefen ob Tokens existieren
    const hasTokens = !!(componentTokenGroups && componentTokenGroups[name])

    const layerCfg = LAYER_CONFIG[layer]
    if (!layerCfg) continue

    if (!groups.has(layerCfg.id)) {
      groups.set(layerCfg.id, { ...layerCfg, children: [] })
    }

    const navItem = {
      id: name,
      label: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      icon: COMPONENT_ICONS[name] || 'component',
      section: `component-${name}`,
      _hasTokens: hasTokens,
      _coverage: entry.coverageScore,
      _layer: layer,
    }
    // Recipe-Status draft: Kennzeichen „Entwurf" in der Navigation (Plan v3, Phase 4)
    if (istEntwurf(name)) navItem.entwurf = true

    // Subgroup-Zuordnung
    const subgroupLabel = SUBGROUP_MAP[name]
    if (subgroupLabel) {
      navItem._subgroup = subgroupLabel
    }

    groups.get(layerCfg.id).children.push(navItem)
  }

  // 3. Objects aus Registry (Layer 04)
  for (const [name] of Object.entries(registry.objects || {})) {
    if (!groups.has('objects')) {
      groups.set('objects', { ...LAYER_CONFIG.object, children: [] })
    }
    const hasTokens = !!(componentTokenGroups && componentTokenGroups[name])
    const objektItem = {
      id: name,
      label: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      icon: COMPONENT_ICONS[name] || 'box',
      section: `component-${name}`,
      _hasTokens: hasTokens,
    }
    // Recipe-Status draft (Plan v3, Phase 5: Objects mit neuem Recipe)
    if (istEntwurf(name)) objektItem.entwurf = true
    groups.get('objects').children.push(objektItem)
  }

  // 4. Templates aus Registry (Layer 08)
  if (Object.keys(registry.templates || {}).length > 0) {
    const templateGroup = { ...LAYER_CONFIG.template, children: [] }
    for (const [name, entry] of Object.entries(registry.templates)) {
      // Templates mit Recipe (Plan v3, Phase 5) bekommen die Sektion einer
      // Komponente: RecipeArena aus dem Recipe, ComponentEditor, Kennzeichen
      // „Entwurf" — alles, was an `component-` haengt (Arena-Resolver,
      // Inspector, SidebarNav). Ohne Recipe bleibt der Wireframe-Platzhalter.
      const mitRecipe = !!entry?.paths?.recipe
      const templateItem = {
        id: name,
        label: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        icon: COMPONENT_ICONS[name] || 'template',
        section: mitRecipe ? `component-${name}` : `template-${name}`,
      }
      if (mitRecipe && istEntwurf(name)) templateItem.entwurf = true
      templateGroup.children.push(templateItem)
    }
    groups.set('templates', templateGroup)
  }

  // 5. Utilities aus Registry (Layer 10)
  if (Object.keys(registry.utilities || {}).length > 0) {
    const utilGroup = { ...LAYER_CONFIG.utility, children: [] }
    for (const [name] of Object.entries(registry.utilities)) {
      utilGroup.children.push({
        id: name,
        label: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        icon: COMPONENT_ICONS[name] || 'tool',
        section: `utility-${name}`,
      })
    }
    groups.set('utilities', utilGroup)
  }

  // 6. Sortiere Gruppen nach ITCSS-Order, sortiere Kinder alphabetisch
  const sortedGroups = [...groups.values()]
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  // 7. Innerhalb jeder Gruppe: Subgroups aufbauen
  for (const group of sortedGroups) {
    if (group.id === 'foundation') continue // Foundation ist bereits statisch

    const subgroupMap = new Map()
    const flatItems = []

    for (const item of group.children) {
      const sg = item._subgroup
      if (sg) {
        if (!subgroupMap.has(sg)) {
          subgroupMap.set(sg, {
            id: sg.toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''),
            label: sg,
            isSubgroup: true,
            children: [],
          })
        }
        // Cleanup private fields
        const cleanItem = { ...item }
        delete cleanItem._subgroup
        delete cleanItem._hasTokens
        delete cleanItem._coverage
        delete cleanItem._layer
        subgroupMap.get(sg).children.push(cleanItem)
      } else {
        const cleanItem = { ...item }
        delete cleanItem._subgroup
        delete cleanItem._hasTokens
        delete cleanItem._coverage
        delete cleanItem._layer
        flatItems.push(cleanItem)
      }
    }

    // Subgroups alphabetisch sortieren, Items innerhalb jeder Subgroup ebenfalls
    const subgroups = [...subgroupMap.values()]
      .sort((a, b) => a.label.localeCompare(b.label))
    for (const sg of subgroups) {
      sg.children.sort((a, b) => a.label.localeCompare(b.label))
    }
    flatItems.sort((a, b) => a.label.localeCompare(b.label))

    group.children = [...subgroups, ...flatItems]

    // Cleanup private fields on group
    delete group.order
  }

  return sortedGroups
}

// Exportiere den generierten Tree
export const navigationTree = buildNavigationTree()
