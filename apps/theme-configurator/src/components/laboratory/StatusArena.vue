<template>
  <div class="component-arena">

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 1: All Variants × All Sizes                            -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All Variants &times; All Sizes</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">5 Varianten &times; 3 Groessen (xs / sm / md)</span>
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <div class="arena-status-matrix">
            <div v-for="v in variants" :key="v.id" class="arena-status-matrix-row">
              <span class="arena-status-matrix-label">{{ v.label }}</span>
              <span v-for="s in sizes" :key="s.id" class="arena-status-dot" :style="dotStyle(tokensLight, v.id, s.id)"></span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-status-matrix">
            <div v-for="v in variants" :key="v.id" class="arena-status-matrix-row">
              <span class="arena-status-matrix-label" :style="{ color: tDark['text-secondary'] }">{{ v.label }}</span>
              <span v-for="s in sizes" :key="s.id" class="arena-status-dot" :style="dotStyle(tokensDark, v.id, s.id)"></span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <div class="arena-status-matrix">
            <div v-for="v in variants" :key="v.id" class="arena-status-matrix-row">
              <span class="arena-status-matrix-label" :style="arenaMode === 'dark' ? { color: activeTheme['text-secondary'] } : {}">{{ v.label }}</span>
              <span v-for="s in sizes" :key="s.id" class="arena-status-dot" :style="dotStyle(activeTokens, v.id, s.id)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 2: Ring Modifier                                       -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Ring Modifier</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Weisser Ring fuer farbige Hintergruende</span>
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <div class="arena-ring-stage" :style="{ background: tLight['layer-01'] || '#f5f5f5' }">
            <div v-for="v in variants" :key="v.id" class="arena-status-labeled">
              <span class="arena-status-dot" :style="{ ...dotStyle(tokensLight, v.id, 'md'), ...ringStyle(tokensLight) }"></span>
              <span class="arena-status-dot-label">{{ v.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-ring-stage" :style="{ background: tDark['layer-01'] || '#1d1d1d' }">
            <div v-for="v in variants" :key="v.id" class="arena-status-labeled">
              <span class="arena-status-dot" :style="{ ...dotStyle(tokensDark, v.id, 'md'), ...ringStyle(tokensDark) }"></span>
              <span class="arena-status-dot-label" :style="{ color: tDark['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <div class="arena-ring-stage" :style="{ background: activeTheme['layer-01'] || (arenaMode === 'dark' ? '#1d1d1d' : '#f5f5f5') }">
            <div v-for="v in variants" :key="v.id" class="arena-status-labeled">
              <span class="arena-status-dot" :style="{ ...dotStyle(activeTokens, v.id, 'md'), ...ringStyle(activeTokens) }"></span>
              <span class="arena-status-dot-label" :style="arenaMode === 'dark' ? { color: activeTheme['text-secondary'] } : {}">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 3: Pulse Animation                                     -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Pulse Animation</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Live-Status mit pulsierendem Ring</span>
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <div class="arena-status-row">
            <div v-for="v in pulseVariants" :key="v.id" class="arena-status-labeled">
              <span
                class="arena-status-dot arena-status--pulse"
                :style="{ ...dotStyle(tokensLight, v.id, 'md'), color: tokensLight[`nc-status-${v.id}`], '--arena-pulse-duration': tokensLight['nc-status-pulse-duration'] }"
              ></span>
              <span class="arena-status-dot-label">{{ v.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-status-row">
            <div v-for="v in pulseVariants" :key="v.id" class="arena-status-labeled">
              <span
                class="arena-status-dot arena-status--pulse"
                :style="{ ...dotStyle(tokensDark, v.id, 'md'), color: tokensDark[`nc-status-${v.id}`], '--arena-pulse-duration': tokensDark['nc-status-pulse-duration'] }"
              ></span>
              <span class="arena-status-dot-label" :style="{ color: tDark['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <div class="arena-status-row">
            <div v-for="v in pulseVariants" :key="v.id" class="arena-status-labeled">
              <span
                class="arena-status-dot arena-status--pulse"
                :style="{ ...dotStyle(activeTokens, v.id, 'md'), color: activeTokens[`nc-status-${v.id}`], '--arena-pulse-duration': activeTokens['nc-status-pulse-duration'] }"
              ></span>
              <span class="arena-status-dot-label" :style="arenaMode === 'dark' ? { color: activeTheme['text-secondary'] } : {}">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 4: Status mit Label                                    -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Status mit Label</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Punkt + Text nebeneinander</span>
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <div class="arena-status-label-group">
            <div v-for="v in variants" :key="v.id" class="arena-status-label-row">
              <span class="arena-status-dot" :style="dotStyle(tokensLight, v.id, 'sm')"></span>
              <span class="arena-status-label-text" :style="{ color: tLight['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-status-label-group">
            <div v-for="v in variants" :key="v.id" class="arena-status-label-row">
              <span class="arena-status-dot" :style="dotStyle(tokensDark, v.id, 'sm')"></span>
              <span class="arena-status-label-text" :style="{ color: tDark['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <div class="arena-status-label-group">
            <div v-for="v in variants" :key="v.id" class="arena-status-label-row">
              <span class="arena-status-dot" :style="dotStyle(activeTokens, v.id, 'sm')"></span>
              <span class="arena-status-label-text" :style="{ color: activeTheme['text-secondary'] }">{{ v.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Sektion 5: Status on Avatar                                    -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Status on Avatar</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">Komposition mit Avatar-Komponente</span>
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <div class="arena-status-row">
            <div v-for="(cfg, i) in avatarStatuses" :key="i" class="arena-status-labeled">
              <div class="arena-avatar" style="width: 48px; height: 48px; min-width: 48px; border-radius: 9999px; position: relative; display: inline-flex;">
                <img class="arena-avatar__image" :src="photos[i]" alt="" style="border-radius: 9999px;" />
                <span
                  class="arena-avatar__status"
                  :style="{ ...dotStyle(tokensLight, cfg.id, 'sm'), ...ringStyle(tokensLight), position: 'absolute', bottom: '0', right: '0', zIndex: 2 }"
                ></span>
              </div>
              <span class="arena-status-dot-label">{{ cfg.label }}</span>
            </div>
          </div>
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <div class="arena-status-row">
            <div v-for="(cfg, i) in avatarStatuses" :key="i" class="arena-status-labeled">
              <div class="arena-avatar" style="width: 48px; height: 48px; min-width: 48px; border-radius: 9999px; position: relative; display: inline-flex;">
                <img class="arena-avatar__image" :src="photos[i]" alt="" style="border-radius: 9999px;" />
                <span
                  class="arena-avatar__status"
                  :style="{ ...dotStyle(tokensDark, cfg.id, 'sm'), ...ringStyle(tokensDark), position: 'absolute', bottom: '0', right: '0', zIndex: 2 }"
                ></span>
              </div>
              <span class="arena-status-dot-label" :style="{ color: tDark['text-secondary'] }">{{ cfg.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <div class="arena-status-row">
            <div v-for="(cfg, i) in avatarStatuses" :key="i" class="arena-status-labeled">
              <div class="arena-avatar" style="width: 48px; height: 48px; min-width: 48px; border-radius: 9999px; position: relative; display: inline-flex;">
                <img class="arena-avatar__image" :src="photos[i]" alt="" style="border-radius: 9999px;" />
                <span
                  class="arena-avatar__status"
                  :style="{ ...dotStyle(activeTokens, cfg.id, 'sm'), ...ringStyle(activeTokens), position: 'absolute', bottom: '0', right: '0', zIndex: 2 }"
                ></span>
              </div>
              <span class="arena-status-dot-label" :style="arenaMode === 'dark' ? { color: activeTheme['text-secondary'] } : {}">{{ cfg.label }}</span>
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
  componentTokenGroups.find(g => g.id === 'status') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  'nc-status-size-xs':         '6px',
  'nc-status-size-sm':         '8px',
  'nc-status-size-md':         '12px',
  'nc-status-ring-width':      '2px',
  'nc-status-ring-color':      '#ffffff',
  'nc-status-online':          '#22c55e',
  'nc-status-offline':         '#a3a3a3',
  'nc-status-busy':            '#ef4444',
  'nc-status-away':            '#eab308',
  'nc-status-neutral':         '#737373',
  'nc-status-pulse-duration':  '1000ms'
}

const TOKEN_REFS = {
  'nc-status-ring-color':  'background-base',
  'nc-status-online':      'feedback-success',
  'nc-status-offline':     'text-disabled',
  'nc-status-busy':        'feedback-danger',
  'nc-status-away':        'feedback-warning',
  'nc-status-neutral':     'text-tertiary'
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
// 3-Mode Support (light / dark / split)
// ---------------------------------------------------------------------------
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() =>
  arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value
)
const activeTheme = computed(() =>
  arenaMode.value === 'dark' ? tDark.value : tLight.value
)
const activeBg = computed(() =>
  arenaMode.value === 'dark'
    ? tDark.value['background-base']
    : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const variants = [
  { id: 'online',  label: 'Online' },
  { id: 'offline', label: 'Offline' },
  { id: 'busy',    label: 'Busy' },
  { id: 'away',    label: 'Away' },
  { id: 'neutral', label: 'Neutral' }
]

const sizes = [
  { id: 'xs', label: 'XS' },
  { id: 'sm', label: 'SM' },
  { id: 'md', label: 'MD' }
]

const pulseVariants = [
  { id: 'online', label: 'Online' },
  { id: 'busy',   label: 'Busy' }
]

const avatarStatuses = [
  { id: 'online', label: 'Online' },
  { id: 'busy',   label: 'Busy' },
  { id: 'away',   label: 'Away' }
]

const base = import.meta.env.BASE_URL
const photos = [
  `${base}avatars/females/avatar-female-1.png`,
  `${base}avatars/males/avatar-male-5.png`,
  `${base}avatars/females/avatar-female-4.png`
]

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------

function dotStyle(tokens, variant, size) {
  const s = tokens[`nc-status-size-${size}`] || '8px'
  return {
    width: s,
    height: s,
    borderRadius: '9999px',
    background: tokens[`nc-status-${variant}`] || tokens['nc-status-neutral'],
    display: 'inline-block',
    flexShrink: '0'
  }
}

function ringStyle(tokens) {
  const w = tokens['nc-status-ring-width'] || '2px'
  const c = tokens['nc-status-ring-color'] || '#fff'
  return {
    boxShadow: `0 0 0 ${w} ${c}`
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
  border-radius: 4px;
  background: var(--arena-label-bg, transparent);
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 16px;
}

.arena-specimen__single {
  display: grid;
  grid-template-columns: 1fr;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.arena-specimen__panel--full {
  /* Volle Breite im Single-Modus */
}

/* Status Matrix (Variants × Sizes) */
.arena-status-matrix {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.arena-status-matrix-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.arena-status-matrix-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.6;
  min-width: 48px;
}

/* Status Row (horizontal) */
.arena-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

/* Labeled Status */
.arena-status-labeled {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.arena-status-dot-label {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.6;
}

/* Ring Stage */
.arena-ring-stage {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 16px 20px;
  border-radius: 8px;
  justify-content: center;
}

/* Status Label Group */
.arena-status-label-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-status-label-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.arena-status-label-text {
  font-size: 13px;
  line-height: 1;
}

/* Avatar (minimal, fuer Status-on-Avatar) */
.arena-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Pulse Animation */
@keyframes arena-status-pulse {
  0% {
    box-shadow: 0 0 0 0 currentColor;
  }
  70% {
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.arena-status--pulse {
  animation: arena-status-pulse var(--arena-pulse-duration, 1s) ease-out infinite;
}
</style>
