<template>
  <div class="hero-arena">

    <!-- ═══ Specimen 1: Full-Featured Hero ═══ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Full-Featured Hero — Bild + Overlay + Kicker + Title + Subtitle + Actions</span>
    </div>
    <div class="arena-specimen" data-specimen-id="full-featured" data-token-groups="layout,overlay,kicker,title,subtitle,actions">
      <div class="ha-hero" :style="heroStyle(true)">
        <div class="ha-overlay" :style="overlayStyle()"></div>
        <div class="ha-content">
          <p class="ha-kicker" :style="kickerStyle()">NEO Workplace Platform</p>
          <h1 class="ha-title" :style="titleStyle()">Der digitale Arbeitsplatz der alle begeistert</h1>
          <p class="ha-subtitle" :style="subtitleStyle()">Verbinden Sie Ihre Teams, automatisieren Sie Prozesse und schaffen Sie eine Arbeitsumgebung, die inspiriert.</p>
          <ul class="ha-highlights" :style="highlightsStyle()">
            <li class="ha-highlight"><span class="ha-dot" :style="dotStyle()">●</span> Live-Dashboards mit unter 200ms Latenz</li>
            <li class="ha-highlight"><span class="ha-dot" :style="dotStyle()">●</span> KI-gestützte Anomalie-Erkennung</li>
            <li class="ha-highlight"><span class="ha-dot" :style="dotStyle()">●</span> DSGVO-konform, gehostet in der EU</li>
          </ul>
          <div class="ha-actions" :style="actionsStyle()">
            <button class="ha-btn ha-btn--accent" :style="accentBtnStyle()">Demo anfragen</button>
            <button class="ha-btn ha-btn--ghost" :style="ghostBtnStyle()">Use Cases ansehen</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Specimen 2: Overlay Konfiguration ═══ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Overlay — Visible / Gradient / Direction</span>
    </div>
    <div class="arena-specimen" data-specimen-id="overlay-config" data-token-groups="overlay">
      <div class="ha-grid-2">
        <!-- Mit Overlay -->
        <div class="ha-mini-hero" :style="miniHeroStyle(true)">
          <div class="ha-overlay" :style="overlayStyle()"></div>
          <div class="ha-mini-content">
            <span class="ha-mini-label" style="color:#fff">Overlay: visible={{ resolve('nc-hero-overlay-visible') }}</span>
            <span class="ha-mini-label" style="color:rgba(255,255,255,0.5);font-size:10px">{{ resolve('nc-hero-overlay-direction') }} | {{ resolve('nc-hero-overlay-start') }}</span>
          </div>
        </div>
        <!-- Ohne Overlay -->
        <div class="ha-mini-hero" :style="miniHeroStyle(true)">
          <div class="ha-overlay" :style="{ ...overlayStyle(), opacity: '0' }"></div>
          <div class="ha-mini-content">
            <span class="ha-mini-label" style="color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.8)">Overlay: visible=0</span>
            <span class="ha-mini-label" style="color:rgba(255,255,255,0.6);font-size:10px">Bild ohne Overlay — Kontrast beachten!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Specimen 3: Kicker (<p> Element, Token-gesteuert) ═══ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Kicker — &lt;p class="nc-hero__kicker"&gt; Token-Konfiguration</span>
    </div>
    <div class="arena-specimen" data-specimen-id="kicker-config" data-token-groups="kicker">
      {# Kicker im Hero-Kontext (dunkel) #}
      <div class="ha-kicker-preview" :style="{ background: resolve('nc-hero-bg') || '#0a0a0a', padding: '24px', borderRadius: '8px' }">
        <p class="ha-kicker" :style="kickerStyle()">NEO Workplace Platform</p>
        <h2 :style="{ color: resolve('nc-hero-title-color') || '#fff', fontSize: '24px', fontWeight: '700', margin: '4px 0 0' }">Headline nach dem Kicker</h2>
      </div>
      {# Kicker Varianten #}
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:16px;align-items:center" :style="{ background: theme['background-secondary'], borderRadius: '0 0 8px 8px' }">
        <p class="ha-kicker" :style="kickerStyle()">Default</p>
        <p class="ha-kicker" :style="{ ...kickerStyle(), background: 'transparent', color: resolve('nc-hero-title-color') || '#fff', borderBottom: '2px solid ' + (resolve('nc-hero-kicker-bg') || theme['background-accent']) }">Underline</p>
        <p class="ha-kicker" :style="{ ...kickerStyle(), background: 'transparent', color: theme['text-secondary'], textTransform: 'uppercase', letterSpacing: '0.1em' }">Uppercase</p>
      </div>
      {# Token-Tabelle #}
      <div class="ha-token-table" :style="{ borderColor: theme['border-secondary'] }">
        <div v-for="t in kickerTokens" :key="t" class="ha-token-row" :style="{ borderColor: theme['border-secondary'] }">
          <code class="ha-token-name" :style="{ color: theme['text-secondary'] }">--{{ t }}</code>
          <code class="ha-token-val" :style="{ color: theme['interactive-default'] }">{{ resolve(t) }}</code>
        </div>
      </div>
    </div>

    <!-- ═══ Specimen 4: Typography — Title + Subtitle + Highlights ═══ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Typography — Title / Subtitle / Highlights</span>
    </div>
    <div class="arena-specimen" data-specimen-id="typography" data-token-groups="title,subtitle,highlights">
      <div class="ha-hero ha-hero--compact" :style="heroStyle(true)">
        <div class="ha-overlay" :style="overlayStyle()"></div>
        <div class="ha-content">
          <h1 class="ha-title" :style="titleStyle()">
            Title: {{ resolve('nc-hero-title-size') }}
          </h1>
          <p class="ha-subtitle" :style="subtitleStyle()">
            Subtitle: {{ resolve('nc-hero-subtitle-size') }}, max-width: {{ resolve('nc-hero-subtitle-max-width') }}
          </p>
          <ul class="ha-highlights" :style="highlightsStyle()">
            <li class="ha-highlight"><span class="ha-dot" :style="dotStyle()">●</span> Highlight: {{ resolve('nc-hero-highlights-size') }}</li>
            <li class="ha-highlight"><span class="ha-dot" :style="dotStyle()">●</span> Marker Color: {{ resolve('nc-hero-highlights-marker') }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ═══ Specimen 5: Layout — Padding, Min-Height, Radius ═══ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Layout — Padding, Min-Height, Gap, Radius</span>
    </div>
    <div class="arena-specimen" data-specimen-id="layout" data-token-groups="layout">
      <div class="ha-grid-2">
        <div class="ha-mini-hero" :style="{ ...miniHeroStyle(false), minHeight: resolve('nc-hero-min-height'), borderRadius: resolve('nc-hero-radius'), padding: resolve('nc-hero-padding-block') + ' ' + resolve('nc-hero-padding-inline') }">
          <div class="ha-mini-content" style="justify-content:space-between;height:100%">
            <span class="ha-mini-label" :style="{ color: theme['text-inverse'] || '#fff' }">{{ resolve('nc-hero-min-height') }} × {{ resolve('nc-hero-radius') }}</span>
            <span class="ha-mini-label" :style="{ color: theme['text-inverse'] || '#fff', opacity:0.5 }">padding: {{ resolve('nc-hero-padding-block') }} {{ resolve('nc-hero-padding-inline') }}</span>
          </div>
        </div>
        <div class="ha-token-table" :style="{ borderColor: theme['border-secondary'] }">
          <div v-for="t in layoutTokens" :key="t" class="ha-token-row" :style="{ borderColor: theme['border-secondary'] }">
            <code class="ha-token-name" :style="{ color: theme['text-secondary'] }">--{{ t }}</code>
            <code class="ha-token-val" :style="{ color: theme['interactive-default'] }">{{ resolve(t) }}</code>
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
const theme = computed(() => store.state.themes[store.state.activeThemeSet].light)

const heroData = computed(() => componentTokenGroups.find(c => c.id === 'hero') || null)
const tokenMap = computed(() => heroData.value ? new Map(heroData.value.tokens.map(t => [t.id, t])) : new Map())

function resolve(tokenId) {
  const override = store.currentComponentOverrides.value[tokenId]
  if (override !== undefined) return override
  const token = tokenMap.value.get(tokenId)
  if (!token) return ''
  if (token.ref) return store.currentSemanticTokens.value[token.ref] || token.default || ''
  return token.default || ''
}

const layoutTokens = ['nc-hero-bg', 'nc-hero-min-height', 'nc-hero-padding-block', 'nc-hero-padding-inline', 'nc-hero-gap', 'nc-hero-radius']
const kickerTokens = ['nc-hero-kicker-size', 'nc-hero-kicker-weight', 'nc-hero-kicker-bg', 'nc-hero-kicker-color', 'nc-hero-kicker-radius', 'nc-hero-kicker-padding']

// Demo image URL (placeholder)
const HERO_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop&q=80'

function heroStyle(withImage) {
  const s = {
    position: 'relative',
    minHeight: resolve('nc-hero-min-height') || '360px',
    padding: `${resolve('nc-hero-padding-block') || '48px'} ${resolve('nc-hero-padding-inline') || '24px'}`,
    background: resolve('nc-hero-bg') || '#0a0a0a',
    borderRadius: resolve('nc-hero-radius') || '0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  }
  if (withImage) {
    s.backgroundImage = `url("${HERO_IMG}")`
    s.backgroundSize = 'cover'
    s.backgroundPosition = 'center'
  }
  return s
}

function miniHeroStyle(withImage) {
  const s = {
    position: 'relative',
    minHeight: '180px',
    background: '#0a0a0a',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (withImage) {
    s.backgroundImage = `url("${HERO_IMG}")`
    s.backgroundSize = 'cover'
    s.backgroundPosition = 'center'
  }
  return s
}

function overlayStyle() {
  return {
    position: 'absolute', inset: '0',
    background: `linear-gradient(${resolve('nc-hero-overlay-direction') || '135deg'}, ${resolve('nc-hero-overlay-start') || 'rgba(0,0,0,0.7)'}, ${resolve('nc-hero-overlay-end') || 'rgba(0,0,0,0.3)'})`,
    zIndex: '0', pointerEvents: 'none',
    opacity: resolve('nc-hero-overlay-visible') || '1',
  }
}

function titleStyle() {
  return {
    fontSize: resolve('nc-hero-title-size') || '32px',
    fontWeight: resolve('nc-hero-title-weight') || '700',
    color: resolve('nc-hero-title-color') || '#fff',
    maxWidth: resolve('nc-hero-title-max-width') || '18ch',
    lineHeight: resolve('nc-hero-title-line-height') || '1.15',
  }
}

function subtitleStyle() {
  return {
    fontSize: resolve('nc-hero-subtitle-size') || '18px',
    color: resolve('nc-hero-subtitle-color') || 'rgba(255,255,255,0.8)',
    maxWidth: resolve('nc-hero-subtitle-max-width') || '40ch',
    lineHeight: resolve('nc-hero-subtitle-line-height') || '1.6',
  }
}

function highlightsStyle() {
  return {
    listStyle: 'none', padding: '0', margin: '0',
    display: 'grid',
    gap: resolve('nc-hero-highlights-gap') || '8px',
    color: resolve('nc-hero-highlights-color') || 'rgba(255,255,255,0.7)',
    fontSize: resolve('nc-hero-highlights-size') || '14px',
  }
}

function dotStyle() {
  return { color: resolve('nc-hero-highlights-marker') || theme.value['background-accent'] || '#37e93d', marginRight: '6px' }
}

function kickerStyle() {
  return {
    display: 'inline-block',
    fontSize: resolve('nc-hero-kicker-size') || '11px',
    fontWeight: resolve('nc-hero-kicker-weight') || '600',
    background: resolve('nc-hero-kicker-bg') || theme.value['background-accent'] || '#37e93d',
    color: resolve('nc-hero-kicker-color') || theme.value['on-accent'] || '#000',
    borderRadius: resolve('nc-hero-kicker-radius') || '4px',
    padding: resolve('nc-hero-kicker-padding') || '2px 10px',
  }
}

function actionsStyle() {
  return {
    display: 'flex', flexWrap: 'wrap',
    gap: resolve('nc-hero-actions-gap') || '16px',
    marginTop: resolve('nc-hero-actions-margin-top') || '16px',
  }
}

function accentBtnStyle() {
  return {
    padding: '10px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer',
    background: theme.value['background-accent'] || '#37e93d',
    color: theme.value['on-accent'] || '#000',
    fontWeight: '600', fontSize: '14px',
  }
}

function ghostBtnStyle() {
  return {
    padding: '10px 24px', borderRadius: '6px', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'transparent', color: '#fff',
    fontWeight: '600', fontSize: '14px',
  }
}
</script>

<style>
.hero-arena { padding: 12px; }
.ha-hero { border-radius: 10px; width: 100%; }
.ha-hero--compact { min-height: 240px !important; }
.ha-content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; max-width: 600px; }
.ha-mini-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 16px; width: 100%; }
.ha-mini-label { font-size: 13px; font-weight: 600; }
.ha-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ha-highlights { margin: 0; }
.ha-highlight { display: flex; align-items: center; }
.ha-token-table { display: flex; flex-direction: column; padding: 8px 0; }
.ha-token-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 12px; border-bottom: 1px solid; }
.ha-token-name { font-size: 10px; font-family: monospace; }
.ha-token-val { font-size: 10px; font-family: monospace; font-weight: 600; }
</style>
