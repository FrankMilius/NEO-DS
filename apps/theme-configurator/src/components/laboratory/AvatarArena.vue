<template>
  <div class="component-arena">

    <!-- Header -->
    <div class="arena-header">
      <h4 class="arena-title">Avatar Arena</h4>
      <span class="arena-mode-labels">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>
        Light
        <span style="margin: 0 4px; opacity: .35">|</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9z"/></svg>
        Dark
      </span>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 1: Size Scale (Image)                                  -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — Image</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">XS – XL mit Foto</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(s, i) in sizes" :key="s" class="arena-avatar" :style="avatarStyle(tokensLight, s)">
              <img class="arena-avatar__image" :src="photos[i]" alt="" :style="imageClipStyle(tokensLight)" />
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(s, i) in sizes" :key="s" class="arena-avatar" :style="avatarStyle(tokensDark, s)">
              <img class="arena-avatar__image" :src="photos[i]" alt="" :style="imageClipStyle(tokensDark)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 2: Size Scale (Initials Fallback)                      -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — Initials Fallback</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">XS – XL nur Initialen</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(s, i) in sizes" :key="s" class="arena-avatar" :style="avatarStyle(tokensLight, s)">
              <span class="arena-avatar__fallback" :style="fallbackStyle(tokensLight, s)">{{ initials[i] }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(s, i) in sizes" :key="s" class="arena-avatar" :style="avatarStyle(tokensDark, s)">
              <span class="arena-avatar__fallback" :style="fallbackStyle(tokensDark, s)">{{ initials[i] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 3: Badge States                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Badge States</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Online · Offline · Busy · Away</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(badge, i) in badges" :key="badge.id" class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensLight, 'lg')">
                <img class="arena-avatar__image" :src="photos[i]" alt="" :style="imageClipStyle(tokensLight)" />
                <span class="arena-avatar__badge" :style="badgeStyle(tokensLight, badge.id)"></span>
              </div>
              <span class="arena-avatar-label">{{ badge.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="(badge, i) in badges" :key="badge.id" class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensDark, 'lg')">
                <img class="arena-avatar__image" :src="photos[i]" alt="" :style="imageClipStyle(tokensDark)" />
                <span class="arena-avatar__badge" :style="badgeStyle(tokensDark, badge.id)"></span>
              </div>
              <span class="arena-avatar-label" :style="{ color: tDark['text-secondary'] }">{{ badge.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 4: Shape Variants                                      -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Shape Variants</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Rund (default) vs. Quadratisch</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-row">
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensLight, 'lg')">
                <img class="arena-avatar__image" :src="photos[0]" alt="" :style="imageClipStyle(tokensLight)" />
              </div>
              <span class="arena-avatar-label">Round</span>
            </div>
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensLight, 'lg', true)">
                <img class="arena-avatar__image" :src="photos[1]" alt="" :style="imageClipStyle(tokensLight, true)" />
              </div>
              <span class="arena-avatar-label">Square</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-row">
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensDark, 'lg')">
                <img class="arena-avatar__image" :src="photos[0]" alt="" :style="imageClipStyle(tokensDark)" />
              </div>
              <span class="arena-avatar-label" :style="{ color: tDark['text-secondary'] }">Round</span>
            </div>
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensDark, 'lg', true)">
                <img class="arena-avatar__image" :src="photos[1]" alt="" :style="imageClipStyle(tokensDark, true)" />
              </div>
              <span class="arena-avatar-label" :style="{ color: tDark['text-secondary'] }">Square</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 5: Ring Modifier                                       -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Ring Modifier</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Ohne Ring vs. Mit Ring (auf Layer-01 Flaeche)</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-ring-stage" :style="{ background: tLight['layer-01'] || '#f5f5f5' }">
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensLight, 'lg')">
                <img class="arena-avatar__image" :src="photos[4]" alt="" :style="imageClipStyle(tokensLight)" />
              </div>
              <span class="arena-avatar-label">Default</span>
            </div>
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="{ ...avatarStyle(tokensLight, 'lg'), ...ringStyle(tokensLight) }">
                <img class="arena-avatar__image" :src="photos[4]" alt="" :style="imageClipStyle(tokensLight)" />
              </div>
              <span class="arena-avatar-label">Ring</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-ring-stage" :style="{ background: tDark['layer-01'] || '#1a1a1a' }">
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="avatarStyle(tokensDark, 'lg')">
                <img class="arena-avatar__image" :src="photos[4]" alt="" :style="imageClipStyle(tokensDark)" />
              </div>
              <span class="arena-avatar-label" :style="{ color: tDark['text-secondary'] }">Default</span>
            </div>
            <div class="arena-avatar-labeled">
              <div class="arena-avatar" :style="{ ...avatarStyle(tokensDark, 'lg'), ...ringStyle(tokensDark) }">
                <img class="arena-avatar__image" :src="photos[4]" alt="" :style="imageClipStyle(tokensDark)" />
              </div>
              <span class="arena-avatar-label" :style="{ color: tDark['text-secondary'] }">Ring</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 6: Avatar Group                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Avatar Group</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Gruppe mit Overlap + Count</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-group">
            <div class="arena-avatar-group__count" :style="groupCountStyle(tokensLight, 'md')">+3</div>
            <div v-for="i in 4" :key="i" class="arena-avatar" :style="{ ...avatarStyle(tokensLight, 'md'), ...groupItemRing(tokensLight) }">
              <img class="arena-avatar__image" :src="photos[i - 1]" alt="" :style="imageClipStyle(tokensLight)" />
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-group">
            <div class="arena-avatar-group__count" :style="groupCountStyle(tokensDark, 'md')">+3</div>
            <div v-for="i in 4" :key="i" class="arena-avatar" :style="{ ...avatarStyle(tokensDark, 'md'), ...groupItemRing(tokensDark) }">
              <img class="arena-avatar__image" :src="photos[i - 1]" alt="" :style="imageClipStyle(tokensDark)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 7: Icon Fallback                                       -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Icon Fallback</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">SM · MD · LG mit User-Icon</span>
      <div class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="s in ['sm', 'md', 'lg']" :key="s" class="arena-avatar" :style="avatarStyle(tokensLight, s)">
              <span class="arena-avatar__fallback" :style="fallbackStyle(tokensLight, s)">
                <svg :width="iconSize(s)" :height="iconSize(s)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-avatar-row">
            <div v-for="s in ['sm', 'md', 'lg']" :key="s" class="arena-avatar" :style="avatarStyle(tokensDark, s)">
              <span class="arena-avatar__fallback" :style="fallbackStyle(tokensDark, s)">
                <svg :width="iconSize(s)" :height="iconSize(s)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </span>
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
  componentTokenGroups.find(g => g.id === 'avatar') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  'nc-avatar-size-xs':              '24px',
  'nc-avatar-size-sm':              '32px',
  'nc-avatar-size-md':              '40px',
  'nc-avatar-size-lg':              '48px',
  'nc-avatar-size-xl':              '64px',
  'nc-avatar-font-size-xs':         '0.625rem',
  'nc-avatar-font-size-sm':         '0.75rem',
  'nc-avatar-font-size-md':         '0.875rem',
  'nc-avatar-font-size-lg':         '1rem',
  'nc-avatar-font-size-xl':         '1.25rem',
  'nc-avatar-font-weight':          '600',
  'nc-avatar-radius':               '9999px',
  'nc-avatar-radius-square':        '4px',
  'nc-avatar-ring-width':           '2px',
  'nc-avatar-badge-size':           '12px',
  'nc-avatar-badge-border-width':   '2px',
  'nc-avatar-group-spacing':        '-8px',
  'nc-avatar-group-ring-width':     '2px',
  'nc-avatar-transition-duration':  '200ms'
}

const TOKEN_REFS = {
  'nc-avatar-bg':                   'background-tertiary',
  'nc-avatar-color':                'text-primary',
  'nc-avatar-border-color':         'border-primary',
  'nc-avatar-ring-color':           'background-base',
  'nc-avatar-badge-border-color':   'background-base',
  'nc-avatar-badge-online':         'feedback-success',
  'nc-avatar-badge-offline':        'text-disabled',
  'nc-avatar-badge-busy':           'feedback-danger',
  'nc-avatar-badge-away':           'feedback-warning',
  'nc-avatar-group-ring-color':     'background-base'
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
// Data — Echte Avatar-Fotos aus assets/avatars/
// ---------------------------------------------------------------------------
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

const badges = [
  { id: 'online', label: 'Online' },
  { id: 'offline', label: 'Offline' },
  { id: 'busy', label: 'Busy' },
  { id: 'away', label: 'Away' }
]

const initials = ['FM', 'AK', 'JD', 'ML', 'SR']

// Vite base path fuer public/ Assets
const base = import.meta.env.BASE_URL

const photos = [
  `${base}avatars/females/avatar-female-1.png`,
  `${base}avatars/males/avatar-male-5.png`,
  `${base}avatars/females/avatar-female-4.png`,
  `${base}avatars/males/avatar-male-7.png`,
  `${base}avatars/females/avatar-female-8.png`,
  `${base}avatars/males/avatar-male-9.png`
]

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------

// Bild-Clipping: border-radius auf das <img> statt overflow:hidden auf den Container.
// So bleibt der Badge sichtbar und der box-shadow (Ring) wird nicht abgeschnitten.
function imageClipStyle(tokens, square = false) {
  return {
    borderRadius: square ? tokens['nc-avatar-radius-square'] : tokens['nc-avatar-radius']
  }
}

function avatarStyle(tokens, size, square = false) {
  const s = tokens[`nc-avatar-size-${size}`] || '40px'
  return {
    width: s,
    height: s,
    minWidth: s,
    borderRadius: square ? tokens['nc-avatar-radius-square'] : tokens['nc-avatar-radius'],
    transition: `all ${tokens['nc-avatar-transition-duration'] || '200ms'} ease`
  }
}

function fallbackStyle(tokens, size) {
  return {
    background: tokens['nc-avatar-bg'],
    color: tokens['nc-avatar-color'],
    fontSize: tokens[`nc-avatar-font-size-${size}`] || '0.875rem',
    fontWeight: tokens['nc-avatar-font-weight'],
    borderRadius: 'inherit'
  }
}

function badgeStyle(tokens, status) {
  return {
    width: tokens['nc-avatar-badge-size'],
    height: tokens['nc-avatar-badge-size'],
    background: tokens[`nc-avatar-badge-${status}`],
    borderColor: tokens['nc-avatar-badge-border-color'],
    borderWidth: tokens['nc-avatar-badge-border-width'],
    borderStyle: 'solid',
    borderRadius: '50%'
  }
}

function ringStyle(tokens) {
  const w = tokens['nc-avatar-ring-width'] || '2px'
  const c = tokens['nc-avatar-ring-color'] || '#fff'
  return {
    boxShadow: `0 0 0 ${w} ${c}`
  }
}

function groupItemRing(tokens) {
  const w = tokens['nc-avatar-group-ring-width'] || '2px'
  const c = tokens['nc-avatar-group-ring-color'] || '#fff'
  return {
    boxShadow: `0 0 0 ${w} ${c}`
  }
}

function groupCountStyle(tokens, size) {
  const s = tokens[`nc-avatar-size-${size}`] || '40px'
  return {
    width: s,
    height: s,
    minWidth: s,
    borderRadius: tokens['nc-avatar-radius'],
    background: tokens['nc-avatar-bg'],
    color: tokens['nc-avatar-color'],
    fontSize: tokens[`nc-avatar-font-size-${size}`] || '0.875rem',
    fontWeight: tokens['nc-avatar-font-weight'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginInlineStart: tokens['nc-avatar-group-spacing']
  }
}

function iconSize(size) {
  const map = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }
  return map[size] || 20
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

/* Avatar Rows */
.arena-avatar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/*
 * Avatar Base — KEIN overflow:hidden!
 * Bild-Clipping erfolgt per border-radius auf dem <img> selbst.
 * Dadurch bleibt der Badge (position:absolute, top/right) sichtbar
 * und box-shadow (Ring) wird nicht abgeschnitten.
 */
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
  /* border-radius kommt per inline-style via imageClipStyle() */
}

.arena-avatar__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
  /* border-radius: inherit — uebernimmt vom .arena-avatar */
}

/* Badge — liegt UEBER dem Bild dank z-index und keinem overflow:hidden */
.arena-avatar__badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

/* Labeled Avatar (mit Untertitel) */
.arena-avatar-labeled {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.arena-avatar-label {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.6;
}

/* Ring Stage — kontrastierende Unterlage damit Ring sichtbar wird */
.arena-ring-stage {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 16px 20px;
  border-radius: 8px;
  justify-content: center;
}

/* Avatar Group (row-reverse Overlap) */
.arena-avatar-group {
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
}

.arena-avatar-group > .arena-avatar {
  margin-inline-start: -8px;
}

.arena-avatar-group > .arena-avatar:last-child {
  margin-inline-start: 0;
}

.arena-avatar-group__count {
  z-index: 0;
}

.arena-avatar-group > .arena-avatar { z-index: 1; }
.arena-avatar-group > .arena-avatar:nth-child(2) { z-index: 2; }
.arena-avatar-group > .arena-avatar:nth-child(3) { z-index: 3; }
.arena-avatar-group > .arena-avatar:nth-child(4) { z-index: 4; }
.arena-avatar-group > .arena-avatar:nth-child(5) { z-index: 5; }
</style>
