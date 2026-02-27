<template>
  <div class="component-arena">

    <!-- Header -->
    <div class="arena-header">
      <h4 class="arena-title">Badge Arena</h4>
      <span class="arena-mode-labels">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>
        Light
        <span style="margin: 0 4px; opacity: .35">|</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9z"/></svg>
        Dark
      </span>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 1: Alle Varianten (MD)                                 -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All Variants — MD</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">7 Farbvarianten in Standardgröße</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-badge-row">
            <span v-for="v in variants" :key="v.id" class="arena-badge" :style="badgeStyle(tokensLight, v.id, 'md')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-badge-row">
            <span v-for="v in variants" :key="v.id" class="arena-badge" :style="badgeStyle(tokensDark, v.id, 'md')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 2: Size Scale                                          -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — SM / MD</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Jede Variante in SM und MD</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div v-for="v in variants" :key="v.id" class="arena-badge-size-row">
            <span class="arena-badge" :style="badgeStyle(tokensLight, v.id, 'sm')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
            <span class="arena-badge" :style="badgeStyle(tokensLight, v.id, 'md')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div v-for="v in variants" :key="v.id" class="arena-badge-size-row">
            <span class="arena-badge" :style="badgeStyle(tokensDark, v.id, 'sm')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
            <span class="arena-badge" :style="badgeStyle(tokensDark, v.id, 'md')">
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 3: With Icon                                           -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Icon</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Leading-Icon je nach Variante</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-badge-row">
            <span v-for="v in variants" :key="v.id" class="arena-badge" :style="badgeStyle(tokensLight, v.id, 'md')">
              <span class="arena-badge__icon" :style="iconStyle(tokensLight)" v-html="variantIcon(v.id)"></span>
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-badge-row">
            <span v-for="v in variants" :key="v.id" class="arena-badge" :style="badgeStyle(tokensDark, v.id, 'md')">
              <span class="arena-badge__icon" :style="iconStyle(tokensDark)" v-html="variantIcon(v.id)"></span>
              <span class="arena-badge__label">{{ v.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 4: Dot Mode                                            -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Dot Mode</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">8px Status-Kreise pro Variante</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-badge-row">
            <div v-for="v in variants" :key="v.id" class="arena-badge-labeled">
              <span class="arena-badge-dot" :style="dotStyle(tokensLight, v.id)"></span>
              <span class="arena-badge-dot-label">{{ v.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-badge-row">
            <div v-for="v in variants" :key="v.id" class="arena-badge-labeled">
              <span class="arena-badge-dot" :style="dotStyle(tokensDark, v.id)"></span>
              <span class="arena-badge-dot-label" :style="{ color: tDark['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 5: Counter Badges                                      -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Counter Badges</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Notification Counts — Default und Error</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-badge-counter-group">
            <div class="arena-badge-counter-row">
              <span class="arena-badge-counter-label">Default</span>
              <span v-for="n in counters" :key="n" class="arena-badge" :style="badgeStyle(tokensLight, 'default', 'sm')">
                <span class="arena-badge__label">{{ n }}</span>
              </span>
            </div>
            <div class="arena-badge-counter-row">
              <span class="arena-badge-counter-label">Error</span>
              <span v-for="n in counters" :key="n" class="arena-badge" :style="badgeStyle(tokensLight, 'error', 'sm')">
                <span class="arena-badge__label">{{ n }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-badge-counter-group">
            <div class="arena-badge-counter-row">
              <span class="arena-badge-counter-label" :style="{ color: tDark['text-secondary'] }">Default</span>
              <span v-for="n in counters" :key="n" class="arena-badge" :style="badgeStyle(tokensDark, 'default', 'sm')">
                <span class="arena-badge__label">{{ n }}</span>
              </span>
            </div>
            <div class="arena-badge-counter-row">
              <span class="arena-badge-counter-label" :style="{ color: tDark['text-secondary'] }">Error</span>
              <span v-for="n in counters" :key="n" class="arena-badge" :style="badgeStyle(tokensDark, 'error', 'sm')">
                <span class="arena-badge__label">{{ n }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 6: Badge on Avatar                                     -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Badge on Avatar</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Integration mit Avatar-Komponente</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-badge-row">
            <div v-for="(cfg, i) in avatarBadges" :key="i" class="arena-avatar-with-badge">
              <div class="arena-avatar" :style="avatarBaseStyle(tokensLight)">
                <img class="arena-avatar__image" :src="photos[i]" alt="" :style="{ borderRadius: '9999px' }" />
                <span class="arena-avatar__badge-slot" :style="avatarBadgeSlotStyle()">
                  <span class="arena-badge" :style="badgeStyle(tokensLight, cfg.variant, 'sm')">
                    <span class="arena-badge__label">{{ cfg.text }}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-badge-row">
            <div v-for="(cfg, i) in avatarBadges" :key="i" class="arena-avatar-with-badge">
              <div class="arena-avatar" :style="avatarBaseStyle(tokensDark)">
                <img class="arena-avatar__image" :src="photos[i]" alt="" :style="{ borderRadius: '9999px' }" />
                <span class="arena-avatar__badge-slot" :style="avatarBadgeSlotStyle()">
                  <span class="arena-badge" :style="badgeStyle(tokensDark, cfg.variant, 'sm')">
                    <span class="arena-badge__label">{{ cfg.text }}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'

const store = useThemeStore()

// ---------------------------------------------------------------------------
// Token Data
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'badge') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  'nc-badge-padding-x':        '8px',
  'nc-badge-padding-y':        '2px',
  'nc-badge-radius':           '9999px',
  'nc-badge-font-size':        '0.75rem',
  'nc-badge-font-size-sm':     '0.6875rem',
  'nc-badge-font-weight':      '600',
  'nc-badge-height-sm':        '20px',
  'nc-badge-height-md':        '24px',
  'nc-badge-default-bg':       '#e8e8e8',
  'nc-badge-default-color':    '#1a1a1a',
  'nc-badge-default-border':   'transparent',
  'nc-badge-secondary-bg':     '#f0f0f0',
  'nc-badge-secondary-color':  '#666',
  'nc-badge-secondary-border': 'transparent',
  'nc-badge-outline-bg':       'transparent',
  'nc-badge-outline-color':    '#1a1a1a',
  'nc-badge-outline-border':   '#ccc',
  'nc-badge-success-bg':       '#e6f4ea',
  'nc-badge-success-color':    '#1a7431',
  'nc-badge-success-border':   'transparent',
  'nc-badge-warning-bg':       '#fef3e0',
  'nc-badge-warning-color':    '#8a6d3b',
  'nc-badge-warning-border':   'transparent',
  'nc-badge-error-bg':         '#fde8e8',
  'nc-badge-error-color':      '#c62828',
  'nc-badge-error-border':     'transparent',
  'nc-badge-info-bg':          '#e3f2fd',
  'nc-badge-info-color':       '#1565c0',
  'nc-badge-info-border':      'transparent',
  'nc-badge-icon-size':        '12px',
  'nc-badge-icon-gap':         '4px',
  'nc-badge-dot-size':         '8px'
}

const TOKEN_REFS = {
  'nc-badge-default-bg':       'background-secondary',
  'nc-badge-default-color':    'text-primary',
  'nc-badge-secondary-bg':     'background-tertiary',
  'nc-badge-secondary-color':  'text-secondary',
  'nc-badge-outline-bg':       '',
  'nc-badge-outline-color':    'text-primary',
  'nc-badge-outline-border':   'border-primary',
  'nc-badge-success-bg':       'background-success',
  'nc-badge-success-color':    'text-success',
  'nc-badge-warning-bg':       'background-warning',
  'nc-badge-warning-color':    'text-warning',
  'nc-badge-error-bg':         'background-danger',
  'nc-badge-error-color':      'text-danger',
  'nc-badge-info-bg':          'background-info',
  'nc-badge-info-color':       'text-info'
}

function resolveToken(semanticMap, tokenId) {
  const override = store.currentComponentOverrides.value?.[tokenId]
  if (override !== undefined) return override
  if (componentData.value) {
    const tok = componentData.value.tokens.find(t => t.id === tokenId)
    if (tok) {
      if (tok.ref && semanticMap[tok.ref]) return semanticMap[tok.ref]
      if (tok.default) return tok.default
    }
  }
  if (TOKEN_REFS[tokenId] && semanticMap[TOKEN_REFS[tokenId]]) {
    return semanticMap[TOKEN_REFS[tokenId]]
  }
  return TOKEN_DEFAULTS[tokenId] || ''
}

function resolveAll(semanticMap) {
  const all = {}
  const allIds = [...Object.keys(TOKEN_DEFAULTS), ...Object.keys(TOKEN_REFS)]
  for (const id of new Set(allIds)) {
    all[id] = resolveToken(semanticMap, id)
  }
  return all
}

const tokensLight = computed(() => resolveAll(tLight.value))
const tokensDark = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const variants = [
  { id: 'default',   label: 'Default' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'outline',   label: 'Outline' },
  { id: 'success',   label: 'Success' },
  { id: 'warning',   label: 'Warning' },
  { id: 'error',     label: 'Error' },
  { id: 'info',      label: 'Info' }
]

const counters = ['1', '9', '99', '99+']

const avatarBadges = [
  { variant: 'success', text: '3' },
  { variant: 'error',   text: '99+' },
  { variant: 'info',    text: 'New' }
]

// Vite base path fuer public/ Assets
const base = import.meta.env.BASE_URL
const photos = [
  `${base}avatars/females/avatar-female-1.png`,
  `${base}avatars/males/avatar-male-5.png`,
  `${base}avatars/females/avatar-female-4.png`
]

// ---------------------------------------------------------------------------
// Icons pro Variante (Tabler-artige SVGs, 24x24 viewBox)
// ---------------------------------------------------------------------------
const ICONS = {
  default:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  secondary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  outline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  success:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M9 12l2 2l4-4"/></svg>',
  warning:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87l-8.106-13.536a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 16h.01"/></svg>',
  error:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 9v4"/><path d="M12 16h.01"/></svg>',
  info:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>'
}

function variantIcon(variantId) {
  return ICONS[variantId] || ICONS.default
}

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------

function badgeStyle(tokens, variant, size) {
  const isOutline = variant === 'outline'
  const h = size === 'sm' ? tokens['nc-badge-height-sm'] : tokens['nc-badge-height-md']
  const fs = size === 'sm' ? tokens['nc-badge-font-size-sm'] : tokens['nc-badge-font-size']
  const px = size === 'sm' ? '6px' : tokens['nc-badge-padding-x']
  const py = size === 'sm' ? '0' : tokens['nc-badge-padding-y']

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens['nc-badge-icon-gap'],
    minHeight: h,
    padding: `${py} ${px}`,
    borderRadius: tokens['nc-badge-radius'],
    fontSize: fs,
    fontWeight: tokens['nc-badge-font-weight'],
    lineHeight: '1',
    whiteSpace: 'nowrap',
    background: tokens[`nc-badge-${variant}-bg`] || (isOutline ? 'transparent' : tokens['nc-badge-default-bg']),
    color: tokens[`nc-badge-${variant}-color`] || tokens['nc-badge-default-color'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tokens[`nc-badge-${variant}-border`] || 'transparent'
  }
}

function dotStyle(tokens, variant) {
  return {
    width: tokens['nc-badge-dot-size'],
    height: tokens['nc-badge-dot-size'],
    borderRadius: '9999px',
    background: tokens[`nc-badge-${variant}-bg`] || tokens['nc-badge-default-bg'],
    flexShrink: '0'
  }
}

function iconStyle(tokens) {
  return {
    width: tokens['nc-badge-icon-size'],
    height: tokens['nc-badge-icon-size'],
    flexShrink: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

function avatarBaseStyle() {
  return {
    position: 'relative',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  }
}

function avatarBadgeSlotStyle() {
  return {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    zIndex: '2'
  }
}
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.arena-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.arena-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.arena-mode-labels {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  opacity: 0.6;
}

.arena-category-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
}

.arena-category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.15;
}

.arena-category-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  white-space: nowrap;
}

.arena-specimen {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.arena-specimen__label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  opacity: 0.55;
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 16px;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

/* Badge Rows */
.arena-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Size Scale Row — SM + MD nebeneinander pro Variante */
.arena-badge-size-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.arena-badge-size-row:last-child {
  margin-bottom: 0;
}

/* Badge Base — rein inline-styled, nur layout-Reset hier */
.arena-badge {
  box-sizing: border-box;
}

.arena-badge__label {
  display: inline-flex;
  align-items: center;
}

.arena-badge__icon {
  line-height: 0;
}

.arena-badge__icon > :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Dot Labeled */
.arena-badge-labeled {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.arena-badge-dot-label {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.6;
}

/* Counter group */
.arena-badge-counter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-badge-counter-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arena-badge-counter-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.55;
  min-width: 44px;
}

/* Avatar with Badge */
.arena-avatar-with-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.arena-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arena-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
