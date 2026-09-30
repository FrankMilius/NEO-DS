<template>
  <div class="component-editor">
    <section class="token-section">

      <!-- Sync Geometry Toggle -->
      <label class="sync-toggle">
        <svg v-if="store.state.syncGeometry" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 15l6-6"/><path d="M11 6l.463-.536a5 5 0 017.071 7.072L18 13"/><path d="M13 18l-.397.534a5.068 5.068 0 01-7.127 0 4.972 4.972 0 010-7.071L6 11"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 15l3-3m2-2 1-1"/><path d="M11 6l.463-.536a5 5 0 017.071 7.072"/><path d="M3 3l18 18"/><path d="M13 18l-.397.534a5.068 5.068 0 01-7.127 0 4.972 4.972 0 010-7.071"/>
        </svg>
        <span class="sync-label">Sync Geometry</span>
        <button
          :class="['sync-switch', { on: store.state.syncGeometry }]"
          role="switch"
          :aria-checked="store.state.syncGeometry"
          @click="store.setSyncGeometry(!store.state.syncGeometry)"
        >
          <span class="sync-switch__thumb"></span>
        </button>
      </label>

      <!-- Locked Overlay Notice -->
      <div v-if="isLocked" class="locked-notice">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>This component is locked. Unlock to edit tokens.</span>
      </div>

      <!-- Context Bar: zeigt aktives Specimen an -->
      <div v-if="arenaSelection && arenaSelection.componentId === componentId" class="context-bar">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
        <span class="context-label">Filtered: <strong>{{ arenaSelection.specimenId }}</strong></span>
        <button class="context-reset" @click="store.clearArenaSelection()">Show All</button>
      </div>

      <!-- Token Search -->
      <div class="token-search-wrap">
        <svg class="token-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          class="token-search-input"
          placeholder="Token suchen (z.B. radius, color, font)…"
          autocomplete="off"
        />
        <button v-if="searchQuery" class="token-search-clear" @click="searchQuery = ''" title="Suche löschen">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Token Content (dimmed when locked) -->
      <div :class="{ 'ce-locked': isLocked }">

      <!-- ═══════════════════════════════════════════════════════════════
           SEKTION 1: ANATOMY (Geometrie-Tokens) — theme-invariant
           ═══════════════════════════════════════════════════════════════ -->
      <div v-if="anatomySubgroups.length" class="inspector-section" :class="{ collapsed: !anatomyOpen }">
        <button class="inspector-section__header" @click="anatomyOpen = !anatomyOpen">
          <!-- Anatomy Icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v-2a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
            <rect x="7" y="7" width="10" height="10" rx="1"/>
          </svg>
          <span class="inspector-section__title">Position & Layout</span>
          <span class="inspector-section__count">{{ anatomyTokenCount }}</span>
          <svg class="inspector-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="anatomyOpen" class="inspector-section__body">
          <template v-for="sg in anatomySubgroups" :key="sg.id">
            <div :class="['ce-subgroup', { 'ce-subgroup--glow': glowingSubgroups.has(sg.id) }]">
              <div class="ce-subgroup-header" @click="toggleSubgroup('anat-' + sg.id)">
                <svg class="ce-subgroup-chevron" :class="{ open: expandedSubgroups.has('anat-' + sg.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span class="ce-subgroup-label">{{ sg.label }}</span>
                <span class="ce-subgroup-count">{{ sg.tokens.length }}</span>
              </div>
              <div v-if="expandedSubgroups.has('anat-' + sg.id)" class="ce-subgroup-body">
                <div v-for="token in sg.tokens" :key="token.id" class="anatomy-row">
                  <div class="anatomy-row__label">
                    {{ token.label }}
                    <span v-if="resolveInheritance(token)" class="inheritance-link" :title="`Erbt von ${resolveInheritance(token).category} › ${resolveInheritance(token).varName}`">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      {{ resolveInheritance(token).category }} › {{ resolveInheritance(token).label }}
                    </span>
                  </div>
                  <!-- Color-Tokens: Native Picker + Swatch + Text-Input -->
                  <div v-if="token.type === 'color'" class="anatomy-color-wrap">
                    <label class="anatomy-color-picker">
                      <input type="color" :value="getTokenValue(token)" @input="updateToken(token, $event.target.value)" class="anatomy-color-native" />
                      <span class="anatomy-color-swatch" :style="{ background: getTokenValue(token) }"></span>
                    </label>
                    <input type="text" class="anatomy-color-input" :class="{ modified: isOverridden(token) }" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
                  </div>
                  <!-- Size/Other Tokens: GeometryTokenSelect -->
                  <GeometryTokenSelect v-else
                    :token="token"
                    :modelValue="getTokenValue(token)"
                    :isOverridden="isOverridden(token)"
                    @update:modelValue="updateToken(token, $event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           SEKTION 2: TYPOGRAPHY (Font-Tokens) — theme-invariant
           ═══════════════════════════════════════════════════════════════ -->
      <div v-if="typographySubgroups.length" class="inspector-section" :class="{ collapsed: !typographyOpen }">
        <button class="inspector-section__header" @click="typographyOpen = !typographyOpen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
          </svg>
          <span class="inspector-section__title">Typography</span>
          <span class="inspector-section__count">{{ typographyTokenCount }}</span>
          <span class="inspector-section__hint">Font, Size, Weight</span>
          <svg class="inspector-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="typographyOpen" class="inspector-section__body">
          <template v-for="sg in typographySubgroups" :key="sg.id">
            <div :class="['ce-subgroup', { 'ce-subgroup--glow': glowingSubgroups.has(sg.id) }]">
              <div class="ce-subgroup-header" @click="toggleSubgroup('typo-' + sg.id)">
                <svg class="ce-subgroup-chevron" :class="{ open: expandedSubgroups.has('typo-' + sg.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span class="ce-subgroup-label">{{ sg.label }}</span>
                <span class="ce-subgroup-count">{{ sg.tokens.length }}</span>
              </div>
              <div v-if="expandedSubgroups.has('typo-' + sg.id)" class="ce-subgroup-body">
                <template v-for="token in sg.tokens" :key="token.id">
                  <div :class="['token-row', { selected: selectedId === token.id }]" @click="selectToken(token)">
                    <div class="token-left">
                      <div class="token-typo-indicator">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                      </div>
                    </div>
                    <div class="token-info">
                      <span class="token-label">{{ token.label }}</span>
                      <code class="token-name">--{{ token.id }}</code>
                    </div>
                    <div class="token-value-wrap">
                      <code class="token-value">{{ getTokenValue(token) }}</code>
                      <code v-if="getConcreteDisplay(token)" class="token-concrete">{{ getConcreteDisplay(token) }}</code>
                      <span v-if="isOverridden(token)" class="override-badge">modified</span>
                      <span v-else-if="resolveInheritance(token)" class="inheritance-link" :title="resolveInheritance(token).varName">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        {{ resolveInheritance(token).category }} › {{ resolveInheritance(token).label }}
                      </span>
                    </div>
                  </div>
                  <transition name="slide">
                    <div v-if="selectedId === token.id" class="inline-editor">
                      <SizeEditor v-if="token.type === 'size'"
                        :modelValue="getTokenValue(token)" @update:modelValue="updateToken(token, $event)"
                        :title="token.label" :tokenId="token.id" :max="200" />
                      <div v-else class="generic-editor">
                        <input type="text" class="generic-input" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
                      </div>
                      <SemanticTokenPicker v-if="token.ref || token.type === 'size'"
                        :token="token" :currentValue="getTokenValue(token)" @select="updateToken(token, $event)" />
                    </div>
                  </transition>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           SEKTION 3: APPEARANCE (Farb-Tokens) — Mirror-Layout Light/Dark
           ═══════════════════════════════════════════════════════════════ -->
      <div v-if="appearanceSubgroups.length" class="inspector-section" :class="{ collapsed: !appearanceOpen }">
        <button class="inspector-section__header" @click="appearanceOpen = !appearanceOpen">
          <!-- Palette Icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8 0 1.06-.474 2.078-1.318 2.828-.844.75-1.989 1.172-3.182 1.172H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"/>
            <circle cx="7.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="12" cy="7.5" r=".5" fill="currentColor"/><circle cx="16.5" cy="10.5" r=".5" fill="currentColor"/>
          </svg>
          <span class="inspector-section__title">Fill</span>
          <span class="inspector-section__count">{{ appearanceTokenCount }}</span>
          <svg class="inspector-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="appearanceOpen" class="inspector-section__body">
          <!-- Mirror-Header: Light / Dark -->
          <div class="mirror-header">
            <span class="mirror-header__prop">Property</span>
            <span class="mirror-header__mode">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>
              Light
            </span>
            <span></span>
            <span class="mirror-header__mode">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9z"/></svg>
              Dark
            </span>
          </div>

          <!-- Varianten-Subgroups -->
          <template v-for="sg in appearanceSubgroups" :key="sg.id">
            <!-- Subgroup Accordion -->
            <div :class="['ce-subgroup', { 'ce-subgroup--glow': glowingSubgroups.has(sg.id) }]">
              <div class="ce-subgroup-header" @click="toggleSubgroup(sg.id)">
                <svg class="ce-subgroup-chevron" :class="{ open: expandedSubgroups.has(sg.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span class="ce-subgroup-label">{{ sg.label }}</span>
                <div v-if="sg.swatches.length" class="ce-subgroup-swatches">
                  <span v-for="(sw, i) in sg.swatches" :key="i" class="ce-swatch-dot" :style="{ background: sw }" :title="['bg', 'color', 'border'][i]"></span>
                </div>
                <span class="ce-subgroup-count">{{ sg.tokens.length }}</span>
              </div>
              <div v-if="expandedSubgroups.has(sg.id)" class="ce-subgroup-body">
                <template v-for="token in sg.tokens" :key="token.id">
                  <!-- Mirror Row: Light + Dark nebeneinander -->
                  <div :class="['mirror-row', { diff: tokenValuesDiffer(token), selected: selectedId === token.id }]" @click="selectToken(token)">
                    <div class="mirror-row__label">
                      <span class="token-label">{{ token.label }}</span>
                      <span v-if="resolveInheritance(token)" class="inheritance-link inheritance-link--compact" :title="resolveInheritance(token).varName">
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        {{ resolveInheritance(token).category }} › {{ resolveInheritance(token).label }}
                      </span>
                    </div>
                    <div class="mirror-row__light">
                      <div v-if="token.type === 'color'" class="token-swatch token-swatch--sm" :style="{ background: getTokenValueForMode(token, 'light') }"></div>
                      <code class="token-value">{{ formatValue(getTokenValueForMode(token, 'light')) }}</code>
                    </div>
                    <!-- Mirror Button -->
                    <button class="mirror-btn" @click.stop="mirrorValue(token, $event)" title="Light → Dark kopieren (Shift: Dark → Light)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 7h10v10"/><path d="M7 17L17 7"/>
                      </svg>
                    </button>
                    <div class="mirror-row__dark">
                      <div v-if="token.type === 'color'" class="token-swatch token-swatch--sm" :style="{ background: getTokenValueForMode(token, 'dark') }"></div>
                      <code class="token-value">{{ formatValue(getTokenValueForMode(token, 'dark')) }}</code>
                    </div>
                  </div>
                  <!-- Inline Editor -->
                  <transition name="slide">
                    <div v-if="selectedId === token.id" class="inline-editor">
                      <div v-if="token.ref" class="semantic-ref-bar">
                        <span class="semantic-ref-label">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          Semantic: <code>--fnd-color-{{ token.ref }}</code>
                        </span>
                        <button v-if="isOverridden(token)" class="reset-ref-btn" @click.stop="resetToSemantic(token)" title="Reset to semantic reference">Reset</button>
                      </div>
                      <ColorEditor v-if="token.type === 'color'"
                        :modelValue="getTokenValue(token)"
                        @update:modelValue="updateToken(token, $event)"
                        :title="token.label" :tokenId="token.id"
                        :tokenPalettes="palettes"
                        :contrastTarget="getContrastTarget(token)" />
                      <SemanticTokenPicker v-if="token.ref || token.type === 'color'"
                        :token="token" :currentValue="getTokenValue(token)"
                        @select="updateToken(token, $event)" />
                    </div>
                  </transition>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           SEKTION 3: STATES (Hover, Focus, Disabled) — collapsed
           ═══════════════════════════════════════════════════════════════ -->
      <div v-if="stateSubgroups.length" class="inspector-section" :class="{ collapsed: !statesOpen }">
        <button class="inspector-section__header" @click="statesOpen = !statesOpen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
          </svg>
          <span class="inspector-section__title">Effects & States</span>
          <span class="inspector-section__count">{{ stateTokenCount }}</span>
          <span class="inspector-section__hint">Hover, Focus, Transitions</span>
          <svg class="inspector-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="statesOpen" class="inspector-section__body">
          <template v-for="sg in stateSubgroups" :key="sg.id">
            <div :class="['ce-subgroup', { 'ce-subgroup--glow': glowingSubgroups.has(sg.id) }]">
              <div class="ce-subgroup-header" @click="toggleSubgroup(sg.id)">
                <svg class="ce-subgroup-chevron" :class="{ open: expandedSubgroups.has(sg.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span class="ce-subgroup-label">{{ sg.label }}</span>
                <div v-if="sg.swatches.length" class="ce-subgroup-swatches">
                  <span v-for="(sw, i) in sg.swatches" :key="i" class="ce-swatch-dot" :style="{ background: sw }"></span>
                </div>
                <span class="ce-subgroup-count">{{ sg.tokens.length }}</span>
              </div>
              <div v-if="expandedSubgroups.has(sg.id)" class="ce-subgroup-body">
                <template v-for="token in sg.tokens" :key="token.id">
                  <div :class="['token-row', { selected: selectedId === token.id }]" @click="selectToken(token)">
                    <div class="token-left">
                      <div v-if="token.type === 'color'" class="token-swatch" :style="{ background: getTokenValue(token) }"></div>
                      <div v-else-if="token.type === 'size'" class="token-size-indicator">
                        <div class="size-bar" :style="{ width: Math.min(parseFloat(getTokenValue(token)), 60) + 'px' }"></div>
                      </div>
                      <div v-else class="token-generic-indicator"><span class="indicator-text">{{ token.type }}</span></div>
                    </div>
                    <div class="token-info">
                      <span class="token-label">{{ token.label }}</span>
                      <code class="token-name">--{{ token.id }}</code>
                    </div>
                    <div class="token-value-wrap">
                      <code class="token-value">{{ getTokenValue(token) }}</code>
                      <code v-if="getConcreteDisplay(token)" class="token-concrete">{{ getConcreteDisplay(token) }}</code>
                      <span v-if="isOverridden(token)" class="override-badge">modified</span>
                      <span v-else-if="resolveInheritance(token)" class="inheritance-link" :title="resolveInheritance(token).varName">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        {{ resolveInheritance(token).category }} › {{ resolveInheritance(token).label }}
                      </span>
                    </div>
                  </div>
                  <transition name="slide">
                    <div v-if="selectedId === token.id" class="inline-editor">
                      <div v-if="token.ref" class="semantic-ref-bar">
                        <span class="semantic-ref-label">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          Semantic: <code>--fnd-color-{{ token.ref }}</code>
                        </span>
                        <button v-if="isOverridden(token)" class="reset-ref-btn" @click.stop="resetToSemantic(token)">Reset</button>
                      </div>
                      <ColorEditor v-if="token.type === 'color'"
                        :modelValue="getTokenValue(token)" @update:modelValue="updateToken(token, $event)"
                        :title="token.label" :tokenId="token.id" :tokenPalettes="palettes"
                        :contrastTarget="getContrastTarget(token)" />
                      <SizeEditor v-else-if="token.type === 'size'"
                        :modelValue="getTokenValue(token)" @update:modelValue="updateToken(token, $event)"
                        :title="token.label" :tokenId="token.id" :max="200" />
                      <div v-else class="generic-editor">
                        <input type="text" class="generic-input" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
                      </div>
                      <SemanticTokenPicker v-if="token.ref || token.type === 'color' || token.type === 'size'"
                        :token="token" :currentValue="getTokenValue(token)" @select="updateToken(token, $event)" />
                    </div>
                  </transition>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           SEKTION 4: ADVANCED (Shadows, Opacity, Motion) — collapsed
           ═══════════════════════════════════════════════════════════════ -->
      <div v-if="advancedTokens.length" class="inspector-section" :class="{ collapsed: !advancedOpen }">
        <button class="inspector-section__header" @click="advancedOpen = !advancedOpen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span class="inspector-section__title">Advanced</span>
          <span class="inspector-section__count">{{ advancedTokens.length }}</span>
          <svg class="inspector-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="advancedOpen" class="inspector-section__body">
          <template v-for="token in advancedTokens" :key="token.id">
            <div :class="['token-row', { selected: selectedId === token.id }]" @click="selectToken(token)">
              <div class="token-left">
                <div class="token-generic-indicator"><span class="indicator-text">{{ token.type }}</span></div>
              </div>
              <div class="token-info">
                <span class="token-label">{{ token.label }}</span>
                <code class="token-name">--{{ token.id }}</code>
              </div>
              <div class="token-value-wrap">
                <code class="token-value">{{ getTokenValue(token) }}</code>
                <code v-if="getConcreteDisplay(token)" class="token-concrete">{{ getConcreteDisplay(token) }}</code>
                <span v-if="isOverridden(token)" class="override-badge">modified</span>
              </div>
            </div>
            <transition name="slide">
              <div v-if="selectedId === token.id" class="inline-editor">
                <SizeEditor v-if="token.type === 'size'"
                  :modelValue="getTokenValue(token)" @update:modelValue="updateToken(token, $event)"
                  :title="token.label" :tokenId="token.id" :max="200" />
                <div v-else class="generic-editor">
                  <input type="text" class="generic-input" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
                </div>
              </div>
            </transition>
          </template>
        </div>
      </div>

      </div><!-- /ce-locked wrapper -->

      <!-- Custom Variants Section -->
      <VariantCreator
        v-if="hasRecipeData && hasVariantAxes"
        :componentId="componentId"
        :componentLabel="componentLabel"
        :recipe="recipe"
        :isLocked="isLocked"
      />

      <!-- ─── Action Bar ──────────────────────────────────────────── -->
      <div v-if="tokens.length" class="ce-action-bar">
        <button
          class="ce-action-btn ce-action-btn--reset"
          :disabled="overrideCount === 0"
          @click="resetAllTokens"
          :title="overrideCount ? `${overrideCount} Override(s) zurücksetzen` : 'Keine Overrides'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          <span>Reset All</span>
          <span v-if="overrideCount" class="ce-action-badge">{{ overrideCount }}</span>
        </button>
        <button
          :class="['ce-action-btn', 'ce-action-btn--export', { success: exportFeedback }]"
          :disabled="overrideCount === 0"
          @click="exportCSS"
          title="Overrides als CSS-Custom-Properties in Zwischenablage kopieren"
        >
          <svg v-if="!exportFeedback" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ exportFeedback ? 'Kopiert!' : 'Export CSS' }}</span>
        </button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, toRef, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups, primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, systemPalettes, foundationTokens } from '../../data/tokens.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import ColorEditor from '../editors/ColorEditor.vue'
import SizeEditor from '../editors/SizeEditor.vue'
import GeometryTokenSelect from '../editors/GeometryTokenSelect.vue'
import SemanticTokenPicker from '../editors/SemanticTokenPicker.vue'
import VariantCreator from './VariantCreator.vue'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const selectedToken = ref(null)
const selectedId = computed(() => selectedToken.value?.id || null)

// ---------------------------------------------------------------------------
// Section Collapse State
// ---------------------------------------------------------------------------
const anatomyOpen = ref(true)
const typographyOpen = ref(false)
const appearanceOpen = ref(true)
const statesOpen = ref(false)
const advancedOpen = ref(false)

// ---------------------------------------------------------------------------
// Token Search
// ---------------------------------------------------------------------------
const searchQuery = ref('')
const exportFeedback = ref(false)

// ---------------------------------------------------------------------------
// Recipe Loader (lazy, cached)
// ---------------------------------------------------------------------------
const { recipe, loading: recipeLoading } = useRecipeLoader(toRef(props, 'componentId'))

const hasRecipeData = computed(() => !!recipe.value?.styling?.tokenGroups)

// ---------------------------------------------------------------------------
// Component Lock State
// ---------------------------------------------------------------------------
const isLocked = computed(() => store.isComponentLocked(props.componentId))

const hasVariantAxes = computed(() => {
  if (!recipe.value?.axes) return false
  return Object.values(recipe.value.axes).some(axis =>
    Object.values(axis.values).some(v => v.tokenGroups?.length > 0)
  )
})

// ---------------------------------------------------------------------------
// Arena Selection (kontextuelle Filterung)
// ---------------------------------------------------------------------------
const arenaSelection = computed(() => store.state.arenaSelection)

// ---------------------------------------------------------------------------
// Token Registry from componentTokenGroups
// ---------------------------------------------------------------------------
const registryData = computed(() => {
  return componentTokenGroups.find(c => c.id === props.componentId) || null
})

const tokenRegistry = computed(() => {
  if (!registryData.value) return new Map()
  return new Map(registryData.value.tokens.map(t => [t.id, t]))
})

// ---------------------------------------------------------------------------
// Component Label
// ---------------------------------------------------------------------------
const componentLabel = computed(() => {
  if (recipe.value?.meta?.component) {
    return recipe.value.meta.component.charAt(0).toUpperCase() + recipe.value.meta.component.slice(1)
  }
  return registryData.value?.label || props.componentId
})

// ---------------------------------------------------------------------------
// Flat token list
// ---------------------------------------------------------------------------
const tokens = computed(() => {
  return registryData.value?.tokens || []
})

// ---------------------------------------------------------------------------
// Subgroup Building (Recipe-driven or legacy)
// ---------------------------------------------------------------------------
const hasSubgroups = computed(() => {
  if (hasRecipeData.value) {
    return Object.keys(recipe.value.styling.tokenGroups).length > 0
  }
  return registryData.value?.subgroups?.length > 0
})

const subgroups = computed(() => {
  if (hasRecipeData.value) return buildRecipeSubgroups()
  return buildLegacySubgroups()
})

function buildRecipeSubgroups() {
  const recipeGroups = recipe.value.styling.tokenGroups
  const result = []
  for (const [groupId, group] of Object.entries(recipeGroups)) {
    const sgTokens = (group.tokens || []).map(id => tokenRegistry.value.get(id)).filter(Boolean)
    if (sgTokens.length === 0) continue
    const category = detectCategory(groupId)
    const swatches = buildSwatches(sgTokens, category)
    result.push({ id: groupId, label: group.label || groupId, category, tokenIds: sgTokens.map(t => t.id), tokens: sgTokens, swatches })
  }
  return result
}

function buildLegacySubgroups() {
  if (!registryData.value?.subgroups) return []
  const tokenMap = new Map(registryData.value.tokens.map(t => [t.id, t]))
  return registryData.value.subgroups.map(sg => {
    const sgTokens = sg.tokenIds.map(id => tokenMap.get(id)).filter(Boolean)
    const swatches = buildSwatches(sgTokens, sg.category)
    return { ...sg, tokens: sgTokens, swatches }
  })
}

function detectCategory(groupId) {
  if (recipe.value?.axes) {
    for (const [axisId, axis] of Object.entries(recipe.value.axes)) {
      if (axis.values && groupId in axis.values) {
        if (axisId === 'variant') return 'main'
        if (axisId === 'severity' || axisId === 'intent') return 'system'
        if (axisId === 'tone') return 'tone'
        if (axisId === 'emphasis') return 'emphasis'
      }
    }
  }
  const lower = groupId.toLowerCase()
  if (['geometry', 'typography', 'interaction', 'core-geometry', 'icon-sizing', 'size-scale'].includes(lower)) return 'core'
  if (['disabled', 'error', 'loading', 'spinner'].includes(lower)) return 'state'
  if (['core-colors'].includes(lower)) return 'core'
  return 'general'
}

function buildSwatches(sgTokens, category) {
  const swatches = []
  if (category && category !== 'core' && category !== 'general') {
    const bgToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-bg'))
    const colorToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-color'))
    const borderToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-border'))
    if (bgToken) swatches.push(getTokenValue(bgToken))
    if (colorToken) swatches.push(getTokenValue(colorToken))
    if (borderToken) { const v = getTokenValue(borderToken); if (v !== 'transparent') swatches.push(v) }
  }
  return swatches
}

// ---------------------------------------------------------------------------
// Token Classification: Figma-Style Sections via useTokenClassifier
// ---------------------------------------------------------------------------
// Tokens werden anhand ihrer ID in 5 Sektionen klassifiziert:
//   Layout | Typography | Fill | Stroke | Effects

import { classifyToken, classifySubgroups as classifySubgroupsFn } from '../../composables/useTokenClassifier.js'

// Legacy Compatibility: isAnatomySubgroup etc. werden durch den Classifier ersetzt
// aber die Computed Properties behalten ihre Namen fuer Template-Kompatibilitaet

const ANATOMY_IDS = new Set([
  'geometry', 'icon-sizing', 'size-scale', 'interaction', 'core-geometry',
  'layout', 'kicker', 'title', 'subtitle', 'highlights', 'actions', 'overlay',
  'input', 'trigger', 'list', 'link', 'indicator', 'header', 'brand',
  'container', 'content', 'sidebar-density', 'footerbar', 'linkbar', 'sidebars',
  'toggle', 'mobile', 'links'
])

function isAnatomySubgroup(sg) {
  // Nutze Classifier: Subgroups deren Tokens mehrheitlich "layout" oder "stroke" sind
  if (ANATOMY_IDS.has(sg.id) || sg.category === 'core') return true
  // Pruefe ob >50% der Tokens layout/stroke sind
  if (!sg.tokens?.length) return false
  const layoutCount = sg.tokens.filter(t => {
    const s = classifyToken(t.id)
    return s === 'layout' || s === 'stroke'
  }).length
  return layoutCount > sg.tokens.length * 0.5
}

function isStateSubgroup(sg) {
  return sg.category === 'state'
}

function isAppearanceSubgroup(sg) {
  return !isAnatomySubgroup(sg) && !isStateSubgroup(sg)
}

function isTypographyToken(token) {
  return classifyToken(token.id) === 'typography'
}

// Klassifizierte Subgroups (mit Arena-Filter + Token-Suche)
const allFilteredSubgroups = computed(() => {
  if (!hasSubgroups.value) return subgroups.value

  let groups = subgroups.value

  // Arena-Filter
  if (arenaSelection.value && arenaSelection.value.componentId === props.componentId) {
    const activeGroups = new Set(arenaSelection.value.tokenGroups)
    groups = groups.filter(sg => activeGroups.has(sg.id))
  }

  // Token-Suche
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    groups = groups
      .map(sg => ({
        ...sg,
        tokens: sg.tokens.filter(t =>
          t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
        )
      }))
      .filter(sg => sg.tokens.length > 0)
  }

  return groups
})

const anatomySubgroups = computed(() => allFilteredSubgroups.value.filter(isAnatomySubgroup))

// Typography: Font-bezogene Tokens aus Appearance-Subgroups extrahiert
const typographySubgroups = computed(() => {
  return allFilteredSubgroups.value
    .filter(isAppearanceSubgroup)
    .map(sg => ({
      ...sg,
      tokens: sg.tokens.filter(t => t.type !== 'color' && isTypographyToken(t))
    }))
    .filter(sg => sg.tokens.length > 0)
})

const appearanceSubgroups = computed(() => {
  // Nur Farb-Tokens in Appearance anzeigen
  return allFilteredSubgroups.value
    .filter(isAppearanceSubgroup)
    .map(sg => ({
      ...sg,
      tokens: sg.tokens.filter(t => t.type === 'color')
    }))
    .filter(sg => sg.tokens.length > 0)
})
const stateSubgroups = computed(() => allFilteredSubgroups.value.filter(isStateSubgroup))

// Advanced: Nicht-Farb, Nicht-Typography Tokens aus Appearance-Subgroups
const advancedTokens = computed(() => {
  if (!hasSubgroups.value) return []
  const result = []
  for (const sg of allFilteredSubgroups.value.filter(isAppearanceSubgroup)) {
    for (const t of sg.tokens) {
      if (t.type !== 'color' && !isTypographyToken(t)) result.push(t)
    }
  }
  return result
})

// Token-Counts
const anatomyTokenCount = computed(() => anatomySubgroups.value.reduce((n, sg) => n + sg.tokens.length, 0))
const typographyTokenCount = computed(() => typographySubgroups.value.reduce((n, sg) => n + sg.tokens.length, 0))
const appearanceTokenCount = computed(() => appearanceSubgroups.value.reduce((n, sg) => n + sg.tokens.length, 0))
const stateTokenCount = computed(() => stateSubgroups.value.reduce((n, sg) => n + sg.tokens.length, 0))

const expandedSubgroups = ref(new Set())

function toggleSubgroup(id) {
  const s = new Set(expandedSubgroups.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedSubgroups.value = s
}

// ---------------------------------------------------------------------------
// Arena Selection → Auto-Expand + Glow
// ---------------------------------------------------------------------------
const glowingSubgroups = ref(new Set())

watch(arenaSelection, async (sel) => {
  glowingSubgroups.value = new Set()

  if (!sel || sel.componentId !== props.componentId) return

  const activeGroups = new Set(sel.tokenGroups)

  // Oeffne alle passenden Sektionen
  const allSgs = subgroups.value
  const matchedIds = allSgs.filter(sg => activeGroups.has(sg.id)).map(sg => sg.id)

  if (matchedIds.length === 0) return

  // Sektionen automatisch oeffnen
  const hasAnatomy = matchedIds.some(id => anatomySubgroups.value.find(sg => sg.id === id))
  const hasAppearance = matchedIds.some(id => appearanceSubgroups.value.find(sg => sg.id === id))
  const hasTypo = matchedIds.some(id => typographySubgroups.value.find(sg => sg.id === id))
  const hasState = matchedIds.some(id => stateSubgroups.value.find(sg => sg.id === id))

  if (hasAnatomy) anatomyOpen.value = true
  if (hasAppearance) appearanceOpen.value = true
  if (hasTypo) typographyOpen.value = true
  if (hasState) statesOpen.value = true

  // Subgroups aufklappen
  const s = new Set(expandedSubgroups.value)
  for (const id of matchedIds) {
    s.add(id)
    s.add('anat-' + id)
    s.add('typo-' + id)
  }
  expandedSubgroups.value = s

  // Glow-Effekt aktivieren (entfernt sich nach 2s)
  await nextTick()
  glowingSubgroups.value = new Set(matchedIds)
  setTimeout(() => { glowingSubgroups.value = new Set() }, 2000)
})

// ---------------------------------------------------------------------------
// Token Value Resolution
// ---------------------------------------------------------------------------
function getTokenValue(token) {
  const override = store.currentComponentOverrides[token.id]
  if (override !== undefined) return override
  if (token.ref) return store.currentSemanticTokens[token.ref] || token.default || ''
  return token.default || ''
}

function getTokenValueForMode(token, mode) {
  const override = store.currentComponentOverrides[token.id]
  if (override !== undefined) return override
  if (token.ref) {
    const semanticMap = store.state.themes[store.state.activeThemeSet][mode]
    return semanticMap[token.ref] || token.default || ''
  }
  return token.default || ''
}

function tokenValuesDiffer(token) {
  return getTokenValueForMode(token, 'light') !== getTokenValueForMode(token, 'dark')
}

function isOverridden(token) {
  return store.currentComponentOverrides[token.id] !== undefined
}

function selectToken(token) {
  selectedToken.value = selectedToken.value?.id === token.id ? null : token
}

function updateToken(token, value) {
  store.updateComponentToken(token.id, value)
}

function resetToSemantic(token) {
  store.resetComponentToken(token.id)
}

// ---------------------------------------------------------------------------
// Inheritance Map: zeigt woher ein Token-Wert kommt
// ---------------------------------------------------------------------------

// Category-Key → CSS-Variablen-Praefix Mapping
// foundationTokens hat z.B. "sizes" als Key, aber CSS-Variable heisst --fnd-size-*
const _categoryToCssPrefix = {
  sizes: 'size',
  radius: 'radius',
  spacing: 'spacing',
  shadow: 'shadow',
  elevation: 'elevation',
  opacity: 'opacity',
  typography: 'typography',
  motion: 'motion',
  border: 'border',
  zindex: 'zindex',
  focus: 'focus',
  media: 'media'
}

// Baut eine flache Lookup-Map: "var(--fnd-radius-sm)" → { category: "radius", key: "sm", label: "SM (Default)" }
const _inheritanceMap = (() => {
  const map = {}
  for (const [category, data] of Object.entries(foundationTokens)) {
    if (!data.tokens) continue
    const cssPrefix = _categoryToCssPrefix[category] || category
    for (const [key, token] of Object.entries(data.tokens)) {
      // Standard foundation tokens: --fnd-{cssPrefix}-{key}
      map[`var(--fnd-${cssPrefix}-${key})`] = { category: data.label, key, label: token.label, varName: `--fnd-${cssPrefix}-${key}` }
    }
  }
  // Spezialfaelle: spacing, shadow, elevation, radius haben konsistente Namensgebung
  // Aber manche Tokens nutzen Kurzformen wie var(--fs-sm), var(--fnd-font-weight-bold)
  // Diese werden separat gemappt
  const EXTRA_PREFIXES = {
    'fs': { category: 'Typography', prefix: '--fs' },
    'font-heading': { category: 'Typography', prefix: '--font-heading' },
    'font-body': { category: 'Typography', prefix: '--font-body' },
    'lh-heading': { category: 'Typography', prefix: '--lh-heading' },
    'lh-body': { category: 'Typography', prefix: '--lh-body' },
  }
  // Map typography scale: --fs-xs, --fs-sm, --fs-base, etc.
  const typoScales = ['2xs','xs','sm','base','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl']
  for (const s of typoScales) {
    map[`var(--fs-${s})`] = { category: 'Typography', key: s, label: `Font Size ${s.toUpperCase()}`, varName: `--fs-${s}` }
  }
  // Font weight tokens
  const weights = ['light','regular','medium','semibold','bold','black']
  for (const w of weights) {
    map[`var(--fnd-font-weight-${w})`] = { category: 'Typography', key: w, label: `Weight ${w}`, varName: `--fnd-font-weight-${w}` }
  }
  return map
})()

/**
 * Resolves the inheritance chain for a token.
 * Returns { source, category, label, varName } or null if no inheritance.
 *
 * source: 'semantic' | 'foundation'
 * category: z.B. "Border Radius", "Spacing", "Typography"
 * label: z.B. "SM (Default)", "04"
 * varName: z.B. "--fnd-radius-sm"
 */
function resolveInheritance(token) {
  // Overridden tokens have no inheritance (user has set explicit value)
  if (isOverridden(token)) return null

  // 1) Semantic color inheritance via ref
  if (token.ref) {
    return {
      source: 'semantic',
      category: 'Semantic',
      label: token.ref,
      varName: `--fnd-color-${token.ref}`
    }
  }

  // 2) Foundation inheritance via var(--fnd-*) in default
  const defaultVal = token.default
  if (!defaultVal || typeof defaultVal !== 'string') return null

  // Direct match: entire default is a var() reference
  const directMatch = _inheritanceMap[defaultVal]
  if (directMatch) return { source: 'foundation', ...directMatch }

  // Extract var() from composite values like "var(--fnd-spacing-02) var(--fnd-spacing-04)"
  const varMatch = defaultVal.match(/var\(--(?:fnd-|fs-)[^)]+\)/)
  if (varMatch) {
    const found = _inheritanceMap[varMatch[0]]
    if (found) return { source: 'foundation', ...found }

    // Fallback: parse the variable name for display
    const nameMatch = varMatch[0].match(/var\(--(fnd-|fs-)(.+)\)/)
    if (nameMatch) {
      const fullName = `--${nameMatch[1]}${nameMatch[2]}`
      return {
        source: 'foundation',
        category: 'Foundations',
        key: nameMatch[2],
        label: nameMatch[2],
        varName: fullName
      }
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Mirror Button: Wert zwischen Light/Dark kopieren
// ---------------------------------------------------------------------------
function mirrorValue(token, event) {
  // Shift+Click: Dark → Light, sonst Light → Dark
  // Da overrides derzeit nicht mode-spezifisch sind, kopiert der Mirror-Button
  // den resolved Light-Wert als explizites Override (gilt dann fuer beide)
  const sourceMode = event.shiftKey ? 'dark' : 'light'
  const value = getTokenValueForMode(token, sourceMode)
  store.updateComponentToken(token.id, value)
}

// ---------------------------------------------------------------------------
// Highlight Property Mapping (fuer Arena-Overlay)
// ---------------------------------------------------------------------------
function mapTokenToProperty(tokenId) {
  if (tokenId.includes('height')) return 'height'
  if (tokenId.includes('padding-x') || tokenId.includes('padding-inline')) return 'padding-inline'
  if (tokenId.includes('padding-y') || tokenId.includes('padding-block')) return 'padding-block'
  if (tokenId.includes('radius')) return 'border-radius'
  if (tokenId.includes('gap')) return 'gap'
  if (tokenId.includes('border-width')) return 'border-width'
  if (tokenId.includes('font-size')) return 'font-size'
  if (tokenId.includes('line-height')) return 'line-height'
  return 'box'
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------
function formatValue(val) {
  if (!val) return '—'
  // Kuerze lange Hex-Werte oder Token-Referenzen
  if (val.length > 12) return val.substring(0, 10) + '…'
  return val
}

// ---------------------------------------------------------------------------
// Concrete Value Resolution: var(--fnd-*) → tatsaechlicher Wert
// ---------------------------------------------------------------------------
// Flache Lookup-Map: "var(--fnd-radius-sm)" → "4px"
const _concreteValueMap = (() => {
  const map = {}
  for (const [category, data] of Object.entries(foundationTokens)) {
    if (!data.tokens) continue
    const cssPrefix = _categoryToCssPrefix[category] || category
    for (const [key, token] of Object.entries(data.tokens)) {
      const val = token.value
      if (val === undefined || val === null) continue
      map[`var(--fnd-${cssPrefix}-${key})`] = String(val)
    }
  }
  // Typography: --fs-* (nicht in foundationTokens als eigene Kategorie)
  const typoScales = { '2xs': '9.7px', 'xs': '11.7px', 'sm': '14px', 'base': '16px', 'lg': '19.2px', 'xl': '23px', '2xl': '27.6px', '3xl': '33.2px', '4xl': '39.8px', '5xl': '47.8px', '6xl': '57.3px', '7xl': '68.8px', '8xl': '82.6px', '9xl': '99.1px' }
  for (const [s, v] of Object.entries(typoScales)) {
    map[`var(--fs-${s})`] = `clamp(…${v})`
  }
  // Font weights
  const fwMap = { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700', black: '900' }
  for (const [w, v] of Object.entries(fwMap)) {
    map[`var(--fnd-font-weight-${w})`] = v
  }
  // Border widths (alias in border category: width-xs, width-sm, etc.)
  // These are under foundationTokens.border as "width-xs", "width-sm", etc.
  if (foundationTokens.border?.tokens) {
    for (const [key, token] of Object.entries(foundationTokens.border.tokens)) {
      map[`var(--fnd-border-${key})`] = String(token.value)
    }
  }
  return map
})()

/**
 * Resolves a token's display value to its concrete form.
 * Returns the concrete value string if the token references a var(), otherwise null.
 *
 * Examples:
 *   "var(--fnd-radius-sm)" → "4px"
 *   "var(--fnd-spacing-04)" → "16px"
 *   "color-mix(in srgb, ...)" → null (too complex)
 *   "#ff0000" → null (already concrete)
 */
function resolveConcreteValue(tokenDefault) {
  if (!tokenDefault || typeof tokenDefault !== 'string') return null
  // Skip values that are already concrete (hex, rgb, px, numbers)
  if (/^(#|rgb|hsl|\d)/.test(tokenDefault)) return null
  // Skip complex expressions that combine multiple vars
  if (tokenDefault.includes('color-mix') || tokenDefault.includes('calc(')) return null

  // Direct single var() reference
  const direct = _concreteValueMap[tokenDefault]
  if (direct) return direct

  // Composite: "var(--fnd-spacing-02) var(--fnd-spacing-04)" → "8px 16px"
  const varPattern = /var\(--(?:fnd-|fs-)[^)]+\)/g
  const matches = tokenDefault.match(varPattern)
  if (matches && matches.length > 0) {
    let resolved = tokenDefault
    let anyResolved = false
    for (const m of matches) {
      const val = _concreteValueMap[m]
      if (val) {
        resolved = resolved.replace(m, val)
        anyResolved = true
      }
    }
    if (anyResolved && resolved !== tokenDefault) return resolved
  }

  return null
}

/**
 * Returns the concrete resolved value for a token, considering overrides.
 * For color tokens with ref: resolves via semantic map.
 * For size/other tokens: resolves var(--fnd-*) references.
 */
function getConcreteDisplay(token) {
  if (isOverridden(token)) return null
  // Semantic color tokens: already resolved by getTokenValue
  if (token.ref) return null
  return resolveConcreteValue(token.default)
}

/**
 * Mode-aware concrete value for mirror rows.
 */
function getConcreteDisplayForMode(token, mode) {
  if (isOverridden(token)) return null
  if (token.ref) return null
  return resolveConcreteValue(token.default)
}

// ---------------------------------------------------------------------------
// Palette fuer ColorEditor
// ---------------------------------------------------------------------------
function palettesToPicker(obj) {
  return Object.entries(obj).map(([id, pal]) => ({
    id, label: pal.label,
    shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
  }))
}

const palettes = computed(() => {
  const groups = []
  for (const [id, pal] of Object.entries(primitiveColors)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
    })
  }
  groups.push(...palettesToPicker(supportingPalettes))
  for (const [id, pal] of Object.entries(neutralPalette)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-neutral-${step}` }))
    })
  }
  groups.push(...palettesToPicker(foundationPalettes))
  groups.push(...palettesToPicker(systemPalettes))
  return groups
})

// ---------------------------------------------------------------------------
// Action Bar: Reset All + Export CSS
// ---------------------------------------------------------------------------
const overrideCount = computed(() => Object.keys(store.currentComponentOverrides).length)

function resetAllTokens() {
  tokens.value.forEach(token => store.resetComponentToken(token.id))
}

function exportCSS() {
  const overrides = store.currentComponentOverrides
  if (!Object.keys(overrides).length) return
  const lines = [`:root {`]
  for (const [id, value] of Object.entries(overrides)) {
    lines.push(`  --${id}: ${value};`)
  }
  lines.push(`}`)
  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    exportFeedback.value = true
    setTimeout(() => { exportFeedback.value = false }, 2000)
  })
}

// ---------------------------------------------------------------------------
// WCAG Kontrast Auto-Detect
// ---------------------------------------------------------------------------
function getContrastTarget(token) {
  if (token.type !== 'color') return ''
  const tokenId = token.id
  const sg = subgroups.value.find(s => s.tokens.some(t => t.id === tokenId))
  const siblings = sg ? sg.tokens : tokens.value

  if (tokenId.endsWith('-bg') || tokenId.endsWith('-background')) {
    const colorToken = siblings.find(t => t.type === 'color' && (t.id.endsWith('-color') || t.id.endsWith('-text')))
    return colorToken ? getTokenValue(colorToken) : ''
  }
  if (tokenId.endsWith('-color') || tokenId.endsWith('-text')) {
    const bgToken = siblings.find(t => t.type === 'color' && (t.id.endsWith('-bg') || t.id.endsWith('-background')))
    return bgToken ? getTokenValue(bgToken) : ''
  }
  return ''
}
</script>

<style scoped>
.component-editor { display: flex; flex-direction: column; gap: 24px; }
.token-section { display: flex; flex-direction: column; gap: 12px; }

.sub-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}


/* ═══════════════════════════════════════════════════════════════
   Inspector Section Card
   ═══════════════════════════════════════════════════════════════ */

.inspector-section {
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.inspector-section:hover {
  border-color: color-mix(in srgb, var(--cfg-text-muted) 30%, transparent);
}

.inspector-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
  transition: background 0.1s;
}

.inspector-section__header:hover {
  background: var(--cfg-surface-elevated);
}

.inspector-section__title {
  color: var(--cfg-text);
  font-size: 12px;
}

.inspector-section__count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
  font-variant-numeric: tabular-nums;
}

.inspector-section__hint {
  font-size: 10px;
  font-weight: 400;
  color: var(--cfg-text-muted);
  opacity: 0.7;
  margin-left: auto;
  text-transform: none;
  letter-spacing: 0;
}

.inspector-section__chevron {
  margin-left: auto;
  flex-shrink: 0;
  transition: transform 0.15s ease;
  color: var(--cfg-text-muted);
}

.inspector-section__hint + .inspector-section__chevron {
  margin-left: 0;
}

.inspector-section.collapsed .inspector-section__chevron {
  transform: rotate(-90deg);
}

.inspector-section__body {
  border-top: 1px solid var(--cfg-border);
  padding: 8px;
}

/* ═══════════════════════════════════════════════════════════════
   Anatomy Section
   ═══════════════════════════════════════════════════════════════ */

.anatomy-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
  padding: 8px 8px 4px;
}

.anatomy-row {
  display: grid;
  grid-template-columns: 1fr auto 28px;
  gap: 8px;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.1s;
}

.anatomy-row:hover {
  background: var(--cfg-surface-elevated);
}

.anatomy-row__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--cfg-text);
}

.anatomy-row__value {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Color-Widget in Anatomy-Rows */
.anatomy-color-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.anatomy-color-picker {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
}
.anatomy-color-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.anatomy-color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
}
.anatomy-color-input {
  flex: 1;
  min-width: 0;
  padding: 3px 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: monospace;
}
.anatomy-color-input.modified { border-color: #d97706; }
.anatomy-color-input:focus { outline: 1px solid var(--cfg-accent); }

.anatomy-row__bar {
  width: 40px;
  height: 8px;
  display: flex;
  align-items: center;
}

.anatomy-value-code {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
  border: 1px solid transparent;
}

.anatomy-value-code:hover {
  border-color: var(--cfg-accent);
}

.override-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d97706;
  flex-shrink: 0;
}

.anatomy-highlight-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.15s;
}

.anatomy-highlight-btn:hover {
  opacity: 1;
  color: #06b6d4;
  background: color-mix(in srgb, #06b6d4 12%, transparent);
}

/* ═══════════════════════════════════════════════════════════════
   Appearance Section — Mirror Layout
   ═══════════════════════════════════════════════════════════════ */

.mirror-header {
  display: grid;
  grid-template-columns: minmax(80px, 1fr) 1fr 28px 1fr;
  gap: 4px;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  border-bottom: 1px solid var(--cfg-border);
  margin-bottom: 4px;
}

.mirror-header__prop { }

.mirror-header__mode {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mirror-row {
  display: grid;
  grid-template-columns: minmax(80px, 1fr) 1fr 28px 1fr;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
  align-items: center;
  border: 1px solid transparent;
}

.mirror-row:hover { background: var(--cfg-surface-elevated); }

.mirror-row.selected {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.mirror-row.diff {
  background: color-mix(in srgb, #fbbf24 8%, transparent);
}

.mirror-row.diff:hover {
  background: color-mix(in srgb, #fbbf24 15%, transparent);
}

.mirror-row__label {
  min-width: 0;
}

.mirror-row__light,
.mirror-row__dark {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.mirror-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.15s;
}

.mirror-btn:hover {
  opacity: 1;
  color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

/* ═══════════════════════════════════════════════════════════════
   Shared Token Styles (reused across sections)
   ═══════════════════════════════════════════════════════════════ */

.token-list { display: flex; flex-direction: column; gap: 2px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
  border: 1px solid transparent;
}

.token-row:hover { background: var(--cfg-surface-elevated); }

.token-row.selected {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.ref-indicator {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-left: 3px;
  color: #3b82f6;
  opacity: 0.7;
}

.token-left { flex-shrink: 0; width: 36px; }

.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
}

.token-swatch--sm {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.token-size-indicator {
  height: 28px;
  display: flex;
  align-items: center;
}

.size-bar {
  height: 8px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 4px;
}

.token-generic-indicator {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-text { font-size: 8px; color: var(--cfg-text-muted); text-transform: uppercase; }

.token-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.token-name { font-size: 10px; color: var(--cfg-text-muted); }

.token-value-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.token-value {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}

.token-concrete {
  font-size: 10px;
  color: #059669;
  background: color-mix(in srgb, #059669 8%, transparent);
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
  white-space: nowrap;
}

.ref-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #dbeafe;
  color: #1d4ed8;
}

.override-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #fef3c7;
  color: #d97706;
  font-weight: 600;
}

/* Inline Editor */
.inline-editor {
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 4px 0;
}

.semantic-ref-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 11px;
  color: #1d4ed8;
}

.semantic-ref-label {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.semantic-ref-label code {
  font-size: 10px;
  background: #dbeafe;
  padding: 1px 4px;
  border-radius: 3px;
}

.reset-ref-btn {
  padding: 2px 8px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  background: transparent;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.reset-ref-btn:hover {
  background: #3b82f6;
  color: white;
}

.generic-editor { display: flex; flex-direction: column; gap: 8px; }
.editor-title { font-size: 14px; font-weight: 600; color: var(--cfg-text); margin: 0; }

.generic-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
}

/* Subgroup Accordion */
.ce-category-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 6px;
}

.ce-category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--cfg-border);
}

.ce-category-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  white-space: nowrap;
}

.ce-subgroup {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  margin-bottom: 4px;
  overflow: visible;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.ce-subgroup--glow {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px color-mix(in srgb, #8b5cf6 20%, transparent),
              0 0 12px color-mix(in srgb, #8b5cf6 15%, transparent);
  animation: subgroup-glow 2s ease-out;
}

@keyframes subgroup-glow {
  0%   { box-shadow: 0 0 0 3px color-mix(in srgb, #8b5cf6 35%, transparent), 0 0 20px color-mix(in srgb, #8b5cf6 25%, transparent); }
  50%  { box-shadow: 0 0 0 2px color-mix(in srgb, #8b5cf6 25%, transparent), 0 0 14px color-mix(in srgb, #8b5cf6 18%, transparent); }
  100% { box-shadow: 0 0 0 0 transparent, 0 0 0 transparent; border-color: var(--cfg-border); }
}

.ce-subgroup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s;
}

.ce-subgroup-header:hover { background: var(--cfg-surface-elevated); }

.ce-subgroup-chevron {
  flex-shrink: 0;
  transition: transform 0.15s ease;
  color: var(--cfg-text-muted);
}

.ce-subgroup-chevron.open { transform: rotate(90deg); }

.ce-subgroup-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
  flex: 1;
}

.ce-subgroup-swatches {
  display: flex;
  gap: 3px;
  align-items: center;
}

.ce-swatch-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--cfg-border);
}

.ce-subgroup-count {
  font-size: 10px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 1px 5px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.ce-subgroup-body {
  border-top: 1px solid var(--cfg-border);
  padding: 4px;
}

/* Context Bar */
.context-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--cfg-accent-subtle);
  border: 1px solid color-mix(in srgb, var(--cfg-accent) 30%, transparent);
  border-radius: 8px;
  font-size: 12px;
  color: var(--cfg-accent);
}

.context-label { flex: 1; }
.context-label strong { text-transform: capitalize; }

.context-reset {
  padding: 3px 8px;
  border: 1px solid var(--cfg-accent);
  border-radius: 4px;
  background: transparent;
  color: var(--cfg-accent);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.context-reset:hover {
  background: var(--cfg-accent);
  color: white;
}

/* Locked Notice */
.locked-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  font-size: 12px;
  color: #d97706;
  font-weight: 500;
}

.ce-locked {
  opacity: 0.55;
  pointer-events: none;
  user-select: none;
}

/* ── Sync Geometry Toggle ── */
.sync-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--cfg-text-secondary);
  user-select: none;
}

.sync-label { flex: 1; }

.sync-switch {
  position: relative;
  width: 34px;
  height: 20px;
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  background: var(--cfg-surface-elevated);
  cursor: pointer;
  transition: all 150ms ease;
  padding: 0;
}

.sync-switch.on {
  background: var(--cfg-accent);
  border-color: var(--cfg-accent);
}

.sync-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: transform 150ms ease;
}

.sync-switch.on .sync-switch__thumb {
  transform: translateX(14px);
}

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }

/* ═══════════════════════════════════════════════════════════════
   Token Search
   ═══════════════════════════════════════════════════════════════ */

.token-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
}

.token-search-icon {
  position: absolute;
  left: 10px;
  color: var(--cfg-text-muted);
  pointer-events: none;
  flex-shrink: 0;
}

.token-search-input {
  width: 100%;
  height: 32px;
  padding: 0 30px 0 30px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
  /* Reset browser search appearance */
  -webkit-appearance: none;
  appearance: none;
}

.token-search-input:focus {
  border-color: var(--cfg-accent);
  background: var(--fnd-color-background-base, #fff);
}

.token-search-input::placeholder {
  color: var(--cfg-text-muted);
  opacity: 0.6;
}

/* Remove browser's native clear button */
.token-search-input::-webkit-search-cancel-button { display: none; }

.token-search-clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: var(--cfg-text-muted);
  color: var(--fnd-color-background-base, #fff);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.token-search-clear:hover { opacity: 1; }

/* ═══════════════════════════════════════════════════════════════
   Typography Section
   ═══════════════════════════════════════════════════════════════ */

.token-typo-indicator {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: color-mix(in srgb, #8b5cf6 12%, transparent);
  color: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══════════════════════════════════════════════════════════════
   Inherited Badge (Smart-Link Indicator)
   ═══════════════════════════════════════════════════════════════ */

.inherited-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  background: color-mix(in srgb, #3b82f6 10%, transparent);
  color: #3b82f6;
  border: 1px solid color-mix(in srgb, #3b82f6 20%, transparent);
  cursor: help;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════════════
   Inheritance Link — zeigt Foundation-Vererbung an
   ═══════════════════════════════════════════════════════════════ */

.inheritance-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: 3px;
  background: color-mix(in srgb, #8b5cf6 8%, transparent);
  color: #7c3aed;
  border: 1px solid color-mix(in srgb, #8b5cf6 15%, transparent);
  cursor: help;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inheritance-link svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.inheritance-link--compact {
  font-size: 8px;
  padding: 0 4px;
  margin-top: 1px;
}

/* In der Anatomy-Row: unter dem Label */
.anatomy-row__label .inheritance-link {
  display: flex;
  margin-top: 2px;
}

/* In der Mirror-Row: unter dem Token-Label */
.mirror-row__label .inheritance-link {
  display: flex;
}

/* ═══════════════════════════════════════════════════════════════
   Action Bar
   ═══════════════════════════════════════════════════════════════ */

.ce-action-bar {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--cfg-border);
  margin-top: 4px;
}

.ce-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid var(--cfg-border);
  background: transparent;
  color: var(--cfg-text-muted);
}

.ce-action-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ce-action-btn:not(:disabled):hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  border-color: color-mix(in srgb, var(--cfg-text) 30%, transparent);
}

.ce-action-btn--reset:not(:disabled):hover {
  color: #d97706;
  border-color: #fbbf24;
  background: color-mix(in srgb, #fbbf24 10%, transparent);
}

.ce-action-btn--export:not(:disabled):hover {
  color: #2563eb;
  border-color: #93c5fd;
  background: color-mix(in srgb, #3b82f6 10%, transparent);
}

.ce-action-btn--export.success {
  color: #16a34a;
  border-color: #86efac;
  background: color-mix(in srgb, #22c55e 10%, transparent);
}

.ce-action-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  background: #fbbf24;
  color: #78350f;
}
</style>
