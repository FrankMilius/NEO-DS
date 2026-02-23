<template>
  <div class="foundation-colors">
    <!-- Shade Tooltip (global, positioned via JS) -->
    <div
      v-if="tooltip.visible"
      class="shade-tooltip"
      role="tooltip"
      aria-hidden="true"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      <div class="tooltip-swatch" :style="{ background: tooltip.color }"></div>
      <div class="tooltip-info">
        <span class="tooltip-token">{{ tooltip.token }}</span>
        <span class="tooltip-hex">{{ tooltip.hex }}</span>
        <span class="tooltip-rgba">{{ tooltip.rgba }}</span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════
         TAB BAR — Primitives / Semantic Colors
         ═══════════════════════════════════════════════════════════════════ -->
    <div class="color-tabs">
      <button
        :class="['color-tab', { active: activeTab === 'primitives' }]"
        @click="activeTab = 'primitives'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
          <circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="12" cy="7.5" r="1" fill="currentColor" /><circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
        </svg>
        <span>Primitive Colors</span>
        <span class="tab-badge tier-1">L1</span>
      </button>
      <button
        :class="['color-tab', { active: activeTab === 'semantic' }]"
        @click="activeTab = 'semantic'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3l4 7h-8z" /><circle cx="17" cy="17" r="3" /><rect x="4" y="14" width="6" height="6" rx="1" />
        </svg>
        <span>Semantic Colors</span>
        <span class="tab-badge tier-2">L2</span>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════
         TAB 1: PRIMITIVE COLORS
         ═══════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'primitives'" class="tab-content">

      <!-- ── MAIN PALETTES ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Main Palettes
          <span v-if="!isDefaultNeo" class="theme-name-badge">{{ currentThemeName }}</span>
        </h3>
        <p class="sub-desc" v-if="isDefaultNeo">Brand color bases — shade scales are auto-generated (50–950, 5% steps).</p>
        <p class="sub-desc" v-else>
          Custom main palettes for this theme. Add your brand colors below.
          <em>Default NEO palettes are not inherited.</em>
        </p>

        <div class="primitives-grid">
          <!-- Existing main palettes (default NEO or custom theme palettes) -->
          <template v-if="isDefaultNeo">
            <div v-for="palette in brandPalettes" :key="palette.id" class="primitive-card">
              <div class="primitive-header">
                <div class="primitive-swatch" :style="{ background: currentPrimitives[palette.id] }"></div>
                <div class="primitive-info">
                  <span class="primitive-label">{{ palette.label }}</span>
                  <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
                </div>
              </div>
              <div class="primitive-editor">
                <input
                  type="color"
                  :value="currentPrimitives[palette.id]"
                  @input="store.updatePrimitive(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input
                  type="text"
                  class="hex-input"
                  :value="currentPrimitives[palette.id]"
                  @change="store.updatePrimitive(palette.id, $event.target.value)"
                />
              </div>
              <div class="shade-strip">
                <div
                  v-for="shade in palette.shades"
                  :key="shade.step"
                  class="shade-chip"
                  :style="{ background: shade.color }"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Non-default theme: show custom main palettes -->
          <template v-else>
            <div v-for="palette in customMainPalettesWithShades" :key="palette.id" class="primitive-card">
              <div class="primitive-header">
                <div class="primitive-swatch" :style="{ background: palette.base }"></div>
                <div class="primitive-info">
                  <span class="primitive-label">{{ palette.label }}</span>
                  <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
                </div>
                <button
                  class="btn-remove"
                  @click="removeCustomMainPalette(palette.id)"
                  title="Delete palette"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </div>
              <div class="primitive-editor">
                <input
                  type="color"
                  :value="palette.base"
                  @input="updateCustomMainPaletteColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input
                  type="text"
                  class="hex-input"
                  :value="palette.base"
                  @change="updateCustomMainPaletteColor(palette.id, $event.target.value)"
                />
              </div>
              <div class="shade-strip">
                <div
                  v-for="shade in palette.shades"
                  :key="shade.step"
                  class="shade-chip"
                  :style="{ background: shade.color }"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>

            <!-- Add Main Palette Card (non-default themes only) -->
            <div class="primitive-card add-palette-card">
              <template v-if="!showAddMainForm">
                <button class="add-palette-btn" @click="showAddMainForm = true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add Main Palette</span>
                </button>
              </template>
              <template v-else>
                <div class="add-form">
                  <label class="add-form-label">Palette Name</label>
                  <input
                    ref="addMainNameInput"
                    type="text"
                    class="hex-input"
                    v-model="newMainPaletteName"
                    placeholder="e.g. Primary"
                    @keyup.enter="addCustomMainPalette"
                    @keyup.escape="cancelAddMainPalette"
                  />
                  <label class="add-form-label">Base Color (500)</label>
                  <div class="primitive-editor">
                    <input
                      type="color"
                      v-model="newMainPaletteColor"
                      class="color-picker-mini"
                    />
                    <input
                      type="text"
                      class="hex-input"
                      v-model="newMainPaletteColor"
                    />
                  </div>
                  <div class="shade-strip" v-if="newMainPalettePreview.length">
                    <div
                      v-for="shade in newMainPalettePreview"
                      :key="shade.step"
                      class="shade-chip"
                      :style="{ background: shade.color }"
                      @mouseenter="showTooltip($event, 'preview', shade)"
                      @mouseleave="hideTooltip"
                    >
                      <span class="shade-label">{{ shade.step }}</span>
                    </div>
                  </div>
                  <div class="add-form-actions">
                    <button class="btn-add-confirm" @click="addCustomMainPalette" :disabled="!newMainPaletteName.trim()">Add</button>
                    <button class="btn-add-cancel" @click="cancelAddMainPalette">Cancel</button>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </section>

      <!-- ── SUPPORTING PALETTES ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Supporting Palettes
          <button
            v-if="hasPending && isDefaultNeo"
            class="sync-badge"
            @click="triggerManualSync"
            title="Pending updates for the Style Guide"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
            </svg>
            {{ pendingCountValue }} pending
          </button>
        </h3>
        <p class="sub-desc">Extended color palette — decorative and auxiliary shades (50–950, 5% steps).</p>

        <div class="primitives-grid">
          <!-- Default NEO: show built-in + custom supporting palettes -->
          <template v-if="isDefaultNeo">
            <div v-for="palette in allSupportingPalettes" :key="palette.id" class="primitive-card">
              <div class="primitive-header">
                <div class="primitive-swatch" :style="{ background: palette.base }"></div>
                <div class="primitive-info">
                  <span class="primitive-label">{{ palette.label }}</span>
                  <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
                </div>
                <button
                  v-if="palette.custom"
                  class="btn-remove"
                  @click="removeCustomPalette(palette.id)"
                  title="Delete palette"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </div>
              <div class="primitive-editor">
                <input
                  type="color"
                  :value="palette.base"
                  @input="palette.builtin ? updateSupportingPaletteColor(palette.id, $event.target.value) : updateCustomSupportingPaletteColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input
                  type="text"
                  class="hex-input"
                  :value="palette.base"
                  @change="palette.builtin ? updateSupportingPaletteColor(palette.id, $event.target.value) : updateCustomSupportingPaletteColor(palette.id, $event.target.value)"
                />
              </div>
              <div class="shade-strip">
                <div
                  v-for="shade in palette.shades"
                  :key="shade.step"
                  class="shade-chip"
                  :style="{ background: shade.color }"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Non-default theme: show fully editable, overridable, deletable supporting palettes -->
          <template v-else>
            <div v-for="palette in customThemeSupportingPalettes" :key="palette.id" class="primitive-card">
              <div class="primitive-header">
                <div class="primitive-swatch" :style="{ background: palette.base }"></div>
                <div class="primitive-info">
                  <span class="primitive-label">{{ palette.label }}</span>
                  <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
                </div>
                <button
                  class="btn-remove"
                  @click="removeCustomThemeSupportingPalette(palette.id)"
                  title="Delete palette"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </div>
              <div class="primitive-editor">
                <input
                  type="color"
                  :value="palette.base"
                  @input="updateCustomThemeSupportingColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input
                  type="text"
                  class="hex-input"
                  :value="palette.base"
                  @change="updateCustomThemeSupportingColor(palette.id, $event.target.value)"
                />
              </div>
              <div class="shade-strip">
                <div
                  v-for="shade in palette.shades"
                  :key="shade.step"
                  class="shade-chip"
                  :style="{ background: shade.color }"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Add Supporting Palette Card (shown for both default and non-default) -->
          <div class="primitive-card add-palette-card">
            <template v-if="!showAddForm">
              <button class="add-palette-btn" @click="showAddForm = true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Add Supporting Palette</span>
              </button>
            </template>
            <template v-else>
              <div class="add-form">
                <label class="add-form-label">Name</label>
                <input
                  ref="addNameInput"
                  type="text"
                  class="hex-input"
                  v-model="newPaletteName"
                  placeholder="e.g. Coral"
                  @keyup.enter="addSupportingPalette"
                  @keyup.escape="cancelAddPalette"
                />
                <label class="add-form-label">Base Color (500)</label>
                <div class="primitive-editor">
                  <input
                    type="color"
                    v-model="newPaletteColor"
                    class="color-picker-mini"
                  />
                  <input
                    type="text"
                    class="hex-input"
                    v-model="newPaletteColor"
                  />
                </div>
                <div class="shade-strip" v-if="newPalettePreview.length">
                  <div
                    v-for="shade in newPalettePreview"
                    :key="shade.step"
                    class="shade-chip"
                    :style="{ background: shade.color }"
                    @mouseenter="showTooltip($event, 'preview', shade)"
                    @mouseleave="hideTooltip"
                  >
                    <span class="shade-label">{{ shade.step }}</span>
                  </div>
                </div>
                <div class="add-form-actions">
                  <button class="btn-add-confirm" @click="addSupportingPalette" :disabled="!newPaletteName.trim()">Add</button>
                  <button class="btn-add-cancel" @click="cancelAddPalette">Cancel</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- ── FOUNDATION PALETTES (always locked) ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Foundation Palettes
          <span class="locked-badge" title="Foundation palettes are fixed and cannot be overridden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Not overridable
          </span>
        </h3>
        <p class="sub-desc">Black &amp; White transparency scales (10–100%). Used for overlays, shadows and layering.</p>

        <div class="primitives-grid">
          <div v-for="palette in foundationPaletteList" :key="palette.id" class="primitive-card primitive-card--locked">
            <div class="primitive-header">
              <div class="primitive-swatch" :style="{ background: palette.base, border: palette.id === 'white' ? '1px solid var(--cfg-border)' : undefined }"></div>
              <div class="primitive-info">
                <span class="primitive-label">{{ palette.label }}</span>
                <span class="primitive-token">--fnd-primitive-{{ palette.id }}-*</span>
              </div>
            </div>
            <div class="shade-strip shade-strip--bordered">
              <div
                v-for="shade in palette.shades"
                :key="shade.step"
                class="shade-chip"
                :class="{ 'shade-chip--white': palette.id === 'white' }"
                :style="{ background: shade.color }"
                @mouseenter="showTooltip($event, palette.id, shade)"
                @mouseleave="hideTooltip"
              >
                <span class="shade-label">{{ shade.step }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── NEUTRAL (always locked) ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Neutral
          <span class="locked-badge" title="Neutral palette is fixed and cannot be overridden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Not overridable
          </span>
        </h3>
        <p class="sub-desc">Generated neutral gray scale from base #7a7a7a. Backbone for text, borders and surfaces.</p>

        <div class="primitives-grid">
          <div v-for="palette in neutralPaletteList" :key="palette.id" class="primitive-card primitive-card--locked">
            <div class="primitive-header">
              <div class="primitive-swatch" :style="{ background: palette.base }"></div>
              <div class="primitive-info">
                <span class="primitive-label">{{ palette.label }}</span>
                <span class="primitive-token">--fnd-primitive-neutral-*</span>
              </div>
            </div>
            <div class="shade-strip">
              <div
                v-for="shade in palette.shades"
                :key="shade.step"
                class="shade-chip"
                :style="{ background: shade.color }"
                @mouseenter="showTooltip($event, 'neutral', shade)"
                @mouseleave="hideTooltip"
              >
                <span class="shade-label">{{ shade.step }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SYSTEM PALETTES (always locked) ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          System Palettes
          <span class="locked-badge" title="System palettes are fixed and cannot be overridden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Not overridable
          </span>
        </h3>
        <p class="sub-desc">Feedback and status colors — Info, Success, Warning, Danger with shade scales (50–950, 5% steps).</p>

        <div class="primitives-grid">
          <div v-for="palette in systemPaletteList" :key="palette.id" class="primitive-card primitive-card--locked">
            <div class="primitive-header">
              <div class="primitive-swatch" :style="{ background: palette.base }"></div>
              <div class="primitive-info">
                <span class="primitive-label">{{ palette.label }}</span>
                <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
              </div>
            </div>
            <div class="shade-strip">
              <div
                v-for="shade in palette.shades"
                :key="shade.step"
                class="shade-chip"
                :style="{ background: shade.color }"
                @mouseenter="showTooltip($event, palette.id, shade)"
                @mouseleave="hideTooltip"
              >
                <span class="shade-label">{{ shade.step }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div><!-- /tab-content: primitives -->

    <!-- ═══════════════════════════════════════════════════════════════════
         TAB 2: SEMANTIC COLORS
         ═══════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'semantic'" class="tab-content">

      <div class="semantic-intro">
        <p class="sub-desc">
          Map intent-based tokens to primitive colors. Each semantic token references a defined primitive shade.
        </p>
        <span class="theme-indicator">{{ themeLabel }}</span>
      </div>

      <!-- Semantic Token Groups -->
      <section v-for="group in semanticTokenGroups" :key="group.id" class="token-section">
        <h4 class="group-label">{{ group.label }}</h4>
        <div class="semantic-token-grid">
          <div
            v-for="token in group.tokens"
            :key="token.id"
            :class="['semantic-token-card', { 'semantic-token-card--active': selectedTokenId === token.id }]"
          >
            <button
              class="semantic-token-header"
              @click="toggleSemanticToken(token)"
            >
              <div class="token-swatch" :style="{ background: getSemanticValue(token.id) }"></div>
              <div class="token-meta">
                <span class="token-label">{{ token.label }}</span>
                <span class="token-value">{{ getSemanticDisplayValue(token.id) }}</span>
              </div>
              <svg
                class="token-chevron"
                :class="{ 'token-chevron--open': selectedTokenId === token.id }"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- Expanded: Primitive Color Picker -->
            <transition name="expand">
              <div v-if="selectedTokenId === token.id" class="primitive-picker">
                <div class="picker-current">
                  <div class="picker-preview" :style="{ background: getSemanticValue(token.id) }">
                    <span class="picker-preview-label" :style="{ color: getContrastColor(getSemanticValue(token.id)) }">Aa</span>
                  </div>
                  <div class="picker-info">
                    <span class="picker-token-name">--fnd-color-{{ token.id }}</span>
                    <span class="picker-hex">{{ getSemanticValue(token.id) }}</span>
                    <div v-if="getSemanticRef(token.id)" class="picker-ref">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                      </svg>
                      {{ getSemanticRef(token.id) }}
                    </div>
                  </div>
                </div>

                <!-- WCAG Contrast info -->
                <div v-if="getContrastTarget(token.id)" class="picker-contrast">
                  <span class="contrast-ratio-label">Contrast</span>
                  <span :class="['contrast-ratio-value', getContrastLevel(token.id)]">
                    {{ getContrastRatio(token.id) }}:1
                  </span>
                  <span :class="['wcag-mini-badge', { pass: getContrastRatio(token.id) >= 4.5 }]">AA</span>
                  <span :class="['wcag-mini-badge', { pass: getContrastRatio(token.id) >= 7 }]">AAA</span>
                </div>

                <!-- Palette Groups: only defined primitives -->
                <div class="picker-palettes">
                  <div
                    v-for="pg in availablePrimitiveGroups"
                    :key="pg.id"
                    class="picker-palette-group"
                  >
                    <span class="picker-palette-label">{{ pg.label }}</span>
                    <div class="picker-palette-strip">
                      <button
                        v-for="shade in pg.shades"
                        :key="shade.token"
                        :class="['picker-swatch', {
                          'picker-swatch--active': getSemanticValue(token.id) === shade.color,
                          'picker-swatch--white': pg.id === 'white'
                        }]"
                        :style="{ background: shade.color }"
                        :title="`${shade.token}\n${shade.color}`"
                        @click="assignPrimitiveToSemantic(token.id, shade)"
                      >
                        <span class="picker-swatch-step">{{ shade.step }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>

    </div><!-- /tab-content: semantic -->
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useStyleguideSync } from '../../stores/styleguide-sync.js'
import { semanticTokenGroups, primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, systemPalettes } from '../../data/tokens.js'

const store = useThemeStore()
const sync = useStyleguideSync()

// ---------------------------------------------------------------------------
// Active Tab State
// ---------------------------------------------------------------------------
const activeTab = ref('primitives')

const selectedToken = ref(null)
const selectedTokenId = computed(() => selectedToken.value?.id || null)

const currentPrimitives = computed(() => store.currentPrimitives.value)
const themeLabel = computed(() => {
  const labels = {
    'neo-light': 'NEO Light', 'neo-dark': 'NEO Dark',
    'customer-light': 'Customer Light', 'customer-dark': 'Customer Dark'
  }
  return labels[store.currentThemeKey.value] || ''
})

// ---------------------------------------------------------------------------
// Is the user on the factory default NEO Theme? (no custom theme loaded)
// ---------------------------------------------------------------------------
const isDefaultNeo = computed(() => {
  return store.state.activeThemeSet === 'neo' && store.state.currentThemeMeta === null
})

const currentThemeName = computed(() => {
  if (store.state.currentThemeMeta) return store.state.currentThemeMeta.name
  return store.state.activeThemeSet === 'neo' ? 'Neo Theme' : 'Customer Theme'
})

// ---------------------------------------------------------------------------
// Brand Palettes (default NEO: primary, secondary, accent from primitives)
// ---------------------------------------------------------------------------
const brandPalettes = computed(() => {
  return ['primary', 'secondary', 'accent'].map(id => {
    const base = currentPrimitives.value[id] || primitiveColors[id].base
    const shades = generateShadeScale(base)
    return {
      id,
      label: primitiveColors[id].label,
      shades: Object.entries(shades).map(([step, color]) => ({ step, color }))
    }
  })
})

// ---------------------------------------------------------------------------
// Custom Main Palettes (non-default themes)
// ---------------------------------------------------------------------------
const MAIN_PALETTES_KEY = 'neo-cfg-custom-main-palettes'

const customMainPalettes = ref(loadCustomMainPalettes())
const showAddMainForm = ref(false)
const newMainPaletteName = ref('')
const newMainPaletteColor = ref('#002049')
const addMainNameInput = ref(null)

function getMainPalettesStorageKey() {
  const themeId = store.state.currentThemeMeta?.id || 'default'
  return `${MAIN_PALETTES_KEY}-${themeId}`
}

function loadCustomMainPalettes() {
  try {
    const key = store.state.currentThemeMeta?.id
      ? `${MAIN_PALETTES_KEY}-${store.state.currentThemeMeta.id}`
      : MAIN_PALETTES_KEY
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCustomMainPalettes() {
  const key = getMainPalettesStorageKey()
  localStorage.setItem(key, JSON.stringify(customMainPalettes.value))
}

const customMainPalettesWithShades = computed(() => {
  return customMainPalettes.value.map(p => ({
    ...p,
    shades: Object.entries(generateShadeScale(p.base)).map(([step, color]) => ({ step, color }))
  }))
})

function addCustomMainPalette() {
  const name = newMainPaletteName.value.trim()
  if (!name) return
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  if (customMainPalettes.value.some(p => p.id === id)) return
  customMainPalettes.value.push({ id, label: name, base: newMainPaletteColor.value })
  saveCustomMainPalettes()
  cancelAddMainPalette()
}

function removeCustomMainPalette(id) {
  customMainPalettes.value = customMainPalettes.value.filter(p => p.id !== id)
  saveCustomMainPalettes()
}

function updateCustomMainPaletteColor(id, color) {
  const pal = customMainPalettes.value.find(p => p.id === id)
  if (pal) {
    pal.base = color
    saveCustomMainPalettes()
  }
}

function cancelAddMainPalette() {
  showAddMainForm.value = false
  newMainPaletteName.value = ''
  newMainPaletteColor.value = '#002049'
}

const newMainPalettePreview = computed(() => {
  if (!newMainPaletteColor.value || !newMainPaletteColor.value.match(/^#[0-9a-fA-F]{6}$/)) return []
  const shades = generateShadeScale(newMainPaletteColor.value)
  return Object.entries(shades).map(([step, color]) => ({ step, color }))
})

watch(showAddMainForm, (v) => {
  if (v) nextTick(() => addMainNameInput.value?.focus())
})

// Reload custom main palettes when the active theme changes
watch(() => store.state.currentThemeMeta, () => {
  customMainPalettes.value = loadCustomMainPalettes()
}, { deep: true })

// ---------------------------------------------------------------------------
// Convert palette objects to list; regenerate 5% shade scales from base color
// ---------------------------------------------------------------------------
function palettesToList(obj, regenerate = true) {
  return Object.entries(obj).map(([id, pal]) => ({
    id,
    label: pal.label,
    base: pal.base,
    shades: regenerate && pal.base
      ? Object.entries(generateShadeScale(pal.base)).map(([step, color]) => ({ step, color }))
      : Object.entries(pal.shades).map(([step, color]) => ({ step, color }))
  }))
}

const supportingPaletteList = computed(() => palettesToList(supportingPalettes))
// Foundation palettes (black/white) use rgba — keep their original shades
const foundationPaletteList = computed(() => palettesToList(foundationPalettes, false))
const neutralPaletteList = computed(() => palettesToList(neutralPalette))
const systemPaletteList = computed(() => palettesToList(systemPalettes))

// ---------------------------------------------------------------------------
// Color Helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
  const n = parseInt(hex, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')
}

function mixColor(c1, c2, weight) {
  return {
    r: c1.r + (c2.r - c1.r) * weight,
    g: c1.g + (c2.g - c1.g) * weight,
    b: c1.b + (c2.b - c1.b) * weight
  }
}

// 5% steps: 50, 100, 150, 200, ..., 900, 950 (19 steps)
const SHADE_STEPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950]

function generateShadeScale(baseHex) {
  const base = hexToRgb(baseHex)
  const white = { r: 255, g: 255, b: 255 }
  const black = { r: 0, g: 0, b: 0 }
  const shades = {}
  SHADE_STEPS.forEach(step => {
    if (step < 500) {
      const t = (500 - step) / 500
      const c = mixColor(base, white, t)
      shades[step] = rgbToHex(c.r, c.g, c.b)
    } else if (step === 500) {
      shades[step] = baseHex
    } else {
      const t = (step - 500) / 500
      const c = mixColor(base, black, t)
      shades[step] = rgbToHex(c.r, c.g, c.b)
    }
  })
  return shades
}

function hexToRgbaString(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}) / 100%`
}

function parseColorToRgba(color) {
  if (!color) return ''
  if (color.startsWith('#')) return hexToRgbaString(color)
  const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (m) {
    const a = m[4] !== undefined ? Math.round(parseFloat(m[4]) * 100) : 100
    return `rgb(${m[1]}, ${m[2]}, ${m[3]}) / ${a}%`
  }
  return color
}

// ---------------------------------------------------------------------------
// Tooltip state
// ---------------------------------------------------------------------------
const tooltip = ref({ visible: false, x: 0, y: 0, color: '', token: '', hex: '', rgba: '' })

function showTooltip(event, paletteId, shade) {
  const rect = event.target.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
    color: shade.color,
    token: `--fnd-primitive-${paletteId}-${shade.step}`,
    hex: shade.color.startsWith('#') ? shade.color.toUpperCase() : shade.color,
    rgba: parseColorToRgba(shade.color)
  }
}

function hideTooltip() {
  tooltip.value.visible = false
}

// ---------------------------------------------------------------------------
// Custom Supporting Palettes (default NEO theme — syncs with styleguide)
// ---------------------------------------------------------------------------
const customPalettes = ref(loadCustomPalettes())
const showAddForm = ref(false)
const newPaletteName = ref('')
const newPaletteColor = ref('#e06060')
const addNameInput = ref(null)

function loadCustomPalettes() {
  try {
    const raw = localStorage.getItem('neo-cfg-custom-palettes')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCustomPalettes() {
  localStorage.setItem('neo-cfg-custom-palettes', JSON.stringify(customPalettes.value))
}

const newPalettePreview = computed(() => {
  if (!newPaletteColor.value || !newPaletteColor.value.match(/^#[0-9a-fA-F]{6}$/)) return []
  const shades = generateShadeScale(newPaletteColor.value)
  return Object.entries(shades).map(([step, color]) => ({ step, color }))
})

// ---------------------------------------------------------------------------
// Built-in Supporting Palette Base Color Overrides (default NEO theme)
// Allows users to edit the base color of built-in supporting palettes.
// ---------------------------------------------------------------------------
const SUPPORTING_OVERRIDES_KEY = 'neo-cfg-supporting-overrides'

const supportingPaletteOverrides = ref(loadSupportingOverrides())

function loadSupportingOverrides() {
  try {
    const raw = localStorage.getItem(SUPPORTING_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveSupportingOverrides() {
  localStorage.setItem(SUPPORTING_OVERRIDES_KEY, JSON.stringify(supportingPaletteOverrides.value))
}

function updateSupportingPaletteColor(id, color) {
  supportingPaletteOverrides.value[id] = color
  saveSupportingOverrides()
}

function updateCustomSupportingPaletteColor(id, color) {
  const pal = customPalettes.value.find(p => p.id === id)
  if (pal) {
    pal.base = color
    saveCustomPalettes()
  }
}

const allSupportingPalettes = computed(() => {
  const overrides = supportingPaletteOverrides.value
  const base = Object.entries(supportingPalettes).map(([id, pal]) => {
    const overriddenBase = overrides[id] || pal.base
    return {
      id,
      label: pal.label,
      base: overriddenBase,
      builtin: true,
      shades: Object.entries(generateShadeScale(overriddenBase)).map(([step, color]) => ({ step, color }))
    }
  })
  const custom = customPalettes.value.map(p => ({
    id: p.id,
    label: p.label,
    base: p.base,
    custom: true,
    shades: Object.entries(generateShadeScale(p.base)).map(([step, color]) => ({ step, color }))
  }))
  return [...base, ...custom]
})

// Unified "add supporting palette" handler — routes to NEO or custom-theme storage
function addSupportingPalette() {
  const name = newPaletteName.value.trim()
  if (!name) return
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  if (isDefaultNeo.value) {
    // NEO default: uses the existing custom palettes system (syncs with styleguide)
    if (allSupportingPalettes.value.some(p => p.id === id)) return
    const palette = { id, label: name, base: newPaletteColor.value }
    customPalettes.value.push(palette)
    saveCustomPalettes()
    cancelAddPalette()

    // Trigger CI/CD pipeline for styleguide update
    if (store.state.activeThemeSet === 'neo' && !store.state.currentThemeMeta) {
      sync.startPipeline(customPalettes.value, { trigger: 'add-palette', palette }, store)
    }
  } else {
    // Non-default theme: uses custom theme supporting palettes
    if (customThemeSupportingPalettes.value.some(p => p.id === id)) return
    customThemeSupportingStorage.value.push({ id, label: name, base: newPaletteColor.value })
    saveCustomThemeSupportingPalettes()
    cancelAddPalette()
  }
}

function removeCustomPalette(id) {
  customPalettes.value = customPalettes.value.filter(p => p.id !== id)
  saveCustomPalettes()
  // Re-check pending updates after removal (only for default NEO Theme)
  if (store.state.activeThemeSet === 'neo' && !store.state.currentThemeMeta) {
    sync.quickDetect(customPalettes.value, store)
  }
}

function cancelAddPalette() {
  showAddForm.value = false
  newPaletteName.value = ''
  newPaletteColor.value = '#e06060'
}

watch(showAddForm, (v) => {
  if (v) nextTick(() => addNameInput.value?.focus())
})

// On initial load, detect any already-pending updates from previous sessions
watch(() => sync.state.loaded, (loaded) => {
  if (loaded && customPalettes.value.length > 0 && store.state.activeThemeSet === 'neo' && !store.state.currentThemeMeta) {
    sync.quickDetect(customPalettes.value, store)
  }
}, { immediate: true })

// Expose computed values that avoid the .value-on-computed bug
const hasPending = computed(() => sync.hasPendingUpdates.value)
const pendingCountValue = computed(() => sync.pendingCount.value)

// Manual sync trigger from the badge button
async function triggerManualSync() {
  await sync.startPipeline(customPalettes.value, { trigger: 'manual' }, store)
}

// ---------------------------------------------------------------------------
// Custom Theme Supporting Palettes (non-default themes — fully editable)
// ---------------------------------------------------------------------------
const THEME_SUPPORTING_KEY = 'neo-cfg-theme-supporting-palettes'

const customThemeSupportingStorage = ref(loadCustomThemeSupportingPalettes())

function getThemeSupportingKey() {
  const themeId = store.state.currentThemeMeta?.id || 'default'
  return `${THEME_SUPPORTING_KEY}-${themeId}`
}

function loadCustomThemeSupportingPalettes() {
  try {
    const key = store.state.currentThemeMeta?.id
      ? `${THEME_SUPPORTING_KEY}-${store.state.currentThemeMeta.id}`
      : THEME_SUPPORTING_KEY
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCustomThemeSupportingPalettes() {
  const key = getThemeSupportingKey()
  localStorage.setItem(key, JSON.stringify(customThemeSupportingStorage.value))
}

const customThemeSupportingPalettes = computed(() => {
  return customThemeSupportingStorage.value.map(p => ({
    ...p,
    shades: Object.entries(generateShadeScale(p.base)).map(([step, color]) => ({ step, color }))
  }))
})

function removeCustomThemeSupportingPalette(id) {
  customThemeSupportingStorage.value = customThemeSupportingStorage.value.filter(p => p.id !== id)
  saveCustomThemeSupportingPalettes()
}

function updateCustomThemeSupportingColor(id, color) {
  const pal = customThemeSupportingStorage.value.find(p => p.id === id)
  if (pal) {
    pal.base = color
    saveCustomThemeSupportingPalettes()
  }
}

// Reload when active theme changes
watch(() => store.state.currentThemeMeta, () => {
  customThemeSupportingStorage.value = loadCustomThemeSupportingPalettes()
}, { deep: true })

// ---------------------------------------------------------------------------
// Semantic Token Editing (Tab 2)
// ---------------------------------------------------------------------------

// Build a flat lookup of all available primitive colors for reference-picking
// This is the authoritative list of selectable colors for semantic tokens.
const availablePrimitiveGroups = computed(() => {
  const groups = []

  // 1. Brand / Main palettes
  if (isDefaultNeo.value) {
    ;['primary', 'secondary', 'accent'].forEach(id => {
      const base = currentPrimitives.value[id] || primitiveColors[id].base
      const shades = generateShadeScale(base)
      groups.push({
        id,
        label: primitiveColors[id].label,
        shades: Object.entries(shades).map(([step, color]) => ({
          step, color, token: `--fnd-primitive-${id}-${step}`
        }))
      })
    })
  } else {
    customMainPalettesWithShades.value.forEach(p => {
      groups.push({
        id: p.id,
        label: p.label,
        shades: p.shades.map(s => ({
          step: s.step, color: s.color, token: `--fnd-primitive-${p.id}-${s.step}`
        }))
      })
    })
  }

  // 2. Supporting palettes
  if (isDefaultNeo.value) {
    allSupportingPalettes.value.forEach(p => {
      groups.push({
        id: p.id,
        label: p.label,
        shades: p.shades.map(s => ({
          step: s.step, color: s.color, token: `--fnd-primitive-${p.id}-${s.step}`
        }))
      })
    })
  } else {
    customThemeSupportingPalettes.value.forEach(p => {
      groups.push({
        id: p.id,
        label: p.label,
        shades: p.shades.map(s => ({
          step: s.step, color: s.color, token: `--fnd-primitive-${p.id}-${s.step}`
        }))
      })
    })
  }

  // 3. Neutral
  neutralPaletteList.value.forEach(p => {
    groups.push({
      id: p.id,
      label: p.label,
      shades: p.shades.map(s => ({
        step: s.step, color: s.color, token: `--fnd-primitive-neutral-${s.step}`
      }))
    })
  })

  // 4. Foundation (black/white)
  foundationPaletteList.value.forEach(p => {
    groups.push({
      id: p.id,
      label: p.label,
      shades: p.shades.map(s => ({
        step: s.step, color: s.color, token: `--fnd-primitive-${p.id}-${s.step}`
      }))
    })
  })

  // 5. System palettes
  systemPaletteList.value.forEach(p => {
    groups.push({
      id: p.id,
      label: p.label,
      shades: p.shades.map(s => ({
        step: s.step, color: s.color, token: `--fnd-primitive-${p.id}-${s.step}`
      }))
    })
  })

  return groups
})

// Build a flat color→token map for reverse lookups
const primitiveColorMap = computed(() => {
  const map = {}
  availablePrimitiveGroups.value.forEach(g => {
    g.shades.forEach(s => {
      // Normalize hex to lowercase for matching
      const normalized = s.color.startsWith('#') ? s.color.toLowerCase() : s.color
      if (!map[normalized]) {
        map[normalized] = s.token
      }
    })
  })
  return map
})

function getSemanticValue(tokenId) {
  return store.currentSemanticTokens.value[tokenId] || '#000000'
}

// Display: show primitive token reference if available, otherwise hex
function getSemanticDisplayValue(tokenId) {
  const hex = getSemanticValue(tokenId)
  const normalized = hex.startsWith('#') ? hex.toLowerCase() : hex
  const ref = primitiveColorMap.value[normalized]
  return ref || hex
}

// Get the primitive reference token for a semantic value
function getSemanticRef(tokenId) {
  const hex = getSemanticValue(tokenId)
  const normalized = hex.startsWith('#') ? hex.toLowerCase() : hex
  return primitiveColorMap.value[normalized] || null
}

function toggleSemanticToken(token) {
  if (selectedToken.value?.id === token.id) {
    selectedToken.value = null
  } else {
    selectedToken.value = token
  }
  store.selectToken(token)
}

function assignPrimitiveToSemantic(tokenId, shade) {
  store.updateSemanticToken(tokenId, shade.color)
}

// Contrast helpers
function relativeLuminance(hex) {
  if (!hex || hex === 'transparent' || !hex.startsWith('#')) return 0
  const h = hex.replace('#', '')
  const [r, g, b] = [
    parseInt(h.substr(0, 2), 16) / 255,
    parseInt(h.substr(2, 2), 16) / 255,
    parseInt(h.substr(4, 2), 16) / 255
  ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastColor(hex) {
  return relativeLuminance(hex) > 0.179 ? '#000000' : '#ffffff'
}

function getContrastTarget(tokenId) {
  const tokens = store.currentSemanticTokens.value
  if (tokenId.startsWith('text-') || tokenId.startsWith('on-')) {
    return tokens['background-base'] || '#ffffff'
  }
  if (tokenId.startsWith('background-')) {
    return tokens['text-primary'] || '#000000'
  }
  return ''
}

function getContrastRatio(tokenId) {
  const target = getContrastTarget(tokenId)
  if (!target) return 0
  const l1 = relativeLuminance(getSemanticValue(tokenId))
  const l2 = relativeLuminance(target)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return Math.round(ratio * 10) / 10
}

function getContrastLevel(tokenId) {
  const ratio = getContrastRatio(tokenId)
  if (ratio >= 7) return 'aaa'
  if (ratio >= 4.5) return 'aa'
  if (ratio >= 3) return 'aa-large'
  return 'fail'
}
</script>

<style scoped>
.foundation-colors {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ═══════════════════════════════════════════════════════════════════
   TAB BAR
   ═══════════════════════════════════════════════════════════════════ */
.color-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--cfg-border);
  margin-bottom: 24px;
  position: sticky;
  top: -24px;
  z-index: var(--cfg-z-sticky);
  background: var(--cfg-bg);
  padding-top: 0;
}

.color-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  background: none;
  color: var(--cfg-text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color var(--fnd-motion-duration-150);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.color-tab:hover {
  color: var(--cfg-text);
}

.color-tab.active {
  color: var(--cfg-accent);
  border-bottom-color: var(--cfg-accent);
}

.color-tab svg {
  opacity: 0.6;
}

.color-tab.active svg {
  opacity: 1;
}

.tab-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  font-family: monospace;
  line-height: 1.3;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ═══════════════════════════════════════════════════════════════════
   PRIMITIVES TAB — Existing styles
   ═══════════════════════════════════════════════════════════════════ */
.token-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-desc {
  font-size: 12px;
  color: var(--cfg-text-muted);
  margin: 0;
}

.sub-desc em {
  font-style: italic;
  opacity: 0.7;
}

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.tier-1 { background: #dbeafe; color: #1d4ed8; }
.tier-2 { background: #dcfce7; color: #16a34a; }
.tier-3 { background: #fef3c7; color: #d97706; }

.theme-indicator {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
}

.theme-name-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
  margin-left: auto;
}

/* Primitives — wider cards for the expanded 19-step scale */
.primitives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 16px;
}

.primitive-card {
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primitive-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.primitive-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.primitive-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.primitive-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cfg-text);
}

.primitive-token {
  font-size: 10px;
  font-family: monospace;
  color: var(--cfg-text-muted);
}

.primitive-editor {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-picker-mini {
  width: 32px;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  background: var(--cfg-surface-elevated);
}

.hex-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
}

.shade-strip {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
}

.shade-chip {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  position: relative;
  transition: transform var(--fnd-motion-duration-100), z-index 0s;
}

.shade-chip:hover {
  transform: scaleY(1.25);
  z-index: var(--cfg-z-hover);
  box-shadow: var(--cfg-shadow-md);
}

.shade-label {
  font-size: 7px;
  font-weight: 700;
  opacity: 0;
  color: white;
  mix-blend-mode: difference;
  transition: opacity var(--fnd-motion-duration-100);
  pointer-events: none;
}

.shade-chip:hover .shade-label {
  opacity: 1;
}

/* White shade chips — border for visibility */
.shade-chip--white {
  box-shadow: inset 0 0 0 1px var(--cfg-border);
}

/* Locked / not-overridable cards */
.primitive-card--locked {
  opacity: 0.85;
  position: relative;
}

.primitive-card--locked::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    color-mix(in srgb, var(--cfg-text-muted) 4%, transparent) 8px,
    color-mix(in srgb, var(--cfg-text-muted) 4%, transparent) 16px
  );
}

.locked-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  border: 1px solid var(--cfg-border);
}

/* Bordered shade strip (foundation) */
.shade-strip--bordered {
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
}

/* Add palette card */
.add-palette-card {
  border-style: dashed;
  background: var(--cfg-surface);
  min-height: 120px;
  justify-content: center;
  align-items: center;
}

.add-palette-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: none;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all var(--fnd-motion-duration-150) ease;
  width: 100%;
}

.add-palette-btn:hover {
  color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.add-palette-btn span {
  font-size: 12px;
  font-weight: 600;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.add-form-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.add-form-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.btn-add-confirm {
  flex: 1;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: var(--cfg-accent);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--fnd-motion-duration-150);
}

.btn-add-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-add-confirm:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-add-cancel {
  flex: 1;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150);
}

.btn-add-cancel:hover {
  border-color: var(--cfg-text-muted);
  color: var(--cfg-text);
}

.btn-remove {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150);
  flex-shrink: 0;
}

.btn-remove:hover {
  color: var(--cfg-danger);
  background: var(--cfg-danger-subtle);
  border-color: var(--cfg-danger-border-subtle);
}

/* Sync badge */
.sync-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: #d97706;
  padding: 2px 8px;
  border-radius: 4px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150);
}

.sync-badge:hover {
  background: #fde68a;
  border-color: #fcd34d;
}

/* ═══════════════════════════════════════════════════════════════════
   SEMANTIC COLORS TAB
   ═══════════════════════════════════════════════════════════════════ */
.semantic-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.group-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.semantic-token-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.semantic-token-card {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  overflow: hidden;
  transition: border-color var(--fnd-motion-duration-150);
}

.semantic-token-card--active {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.semantic-token-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  color: inherit;
  transition: background var(--fnd-motion-duration-100);
}

.semantic-token-header:hover {
  background: var(--cfg-surface-elevated);
}

.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.token-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.token-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
}

.token-value {
  font-size: 10px;
  font-family: monospace;
  color: var(--cfg-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.token-chevron {
  color: var(--cfg-text-muted);
  transition: transform var(--fnd-motion-duration-200);
  flex-shrink: 0;
}

.token-chevron--open {
  transform: rotate(180deg);
}

/* ── Primitive Picker (expanded state) ── */
.primitive-picker {
  padding: 12px;
  border-top: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.picker-current {
  display: flex;
  gap: 12px;
  align-items: center;
}

.picker-preview {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid var(--cfg-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.picker-preview-label {
  font-size: 16px;
  font-weight: 700;
}

.picker-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.picker-token-name {
  font-size: 11px;
  font-weight: 600;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-text);
}

.picker-hex {
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-text-muted);
}

.picker-ref {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-accent);
  margin-top: 1px;
}

/* WCAG Contrast mini-bar */
.picker-contrast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--cfg-surface);
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
}

.contrast-ratio-label {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-weight: 500;
}

.contrast-ratio-value {
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-right: auto;
}

.contrast-ratio-value.aaa { color: var(--cfg-indicator-pass); }
.contrast-ratio-value.aa { color: var(--cfg-indicator-pass); }
.contrast-ratio-value.aa-large { color: var(--cfg-indicator-warn); }
.contrast-ratio-value.fail { color: var(--cfg-indicator-fail); }

.wcag-mini-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--cfg-indicator-fail-bg);
  color: var(--cfg-indicator-fail);
}

.wcag-mini-badge.pass {
  background: var(--cfg-indicator-pass-bg);
  color: var(--cfg-indicator-pass);
}

/* ── Palette group strips ── */
.picker-palettes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.picker-palette-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.picker-palette-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.picker-palette-strip {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
}

.picker-swatch {
  flex: 1;
  height: 28px;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: transform var(--fnd-motion-duration-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-swatch:hover {
  transform: scaleY(1.3);
  z-index: var(--cfg-z-hover);
  box-shadow: var(--cfg-shadow-md);
}

.picker-swatch--active {
  box-shadow: inset 0 0 0 2px var(--cfg-accent), 0 0 0 1px var(--cfg-accent);
  z-index: calc(var(--cfg-z-hover) + 1);
  transform: scaleY(1.15);
}

.picker-swatch--white {
  box-shadow: inset 0 0 0 1px var(--cfg-border);
}

.picker-swatch--white.picker-swatch--active {
  box-shadow: inset 0 0 0 2px var(--cfg-accent), 0 0 0 1px var(--cfg-accent);
}

.picker-swatch-step {
  font-size: 6px;
  font-weight: 700;
  opacity: 0;
  color: white;
  mix-blend-mode: difference;
  transition: opacity var(--fnd-motion-duration-100);
  pointer-events: none;
}

.picker-swatch:hover .picker-swatch-step {
  opacity: 1;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all var(--fnd-motion-duration-200) ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}

/* ── Shade Chip Tooltip ── */
.shade-tooltip {
  position: fixed;
  z-index: var(--cfg-z-tooltip);
  transform: translate(-50%, -100%);
  pointer-events: none;
  background: var(--cfg-surface, #fff);
  border: 1px solid var(--cfg-border, #e0e0e0);
  border-radius: 10px;
  box-shadow: var(--cfg-shadow-lg);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  animation: tooltip-in var(--fnd-motion-duration-150) ease;
}

@keyframes tooltip-in {
  from { opacity: 0; transform: translate(-50%, -100%) translateY(4px); }
  to   { opacity: 1; transform: translate(-50%, -100%) translateY(0); }
}

.tooltip-swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border, #e0e0e0);
  flex-shrink: 0;
}

.tooltip-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-token {
  font-size: 11px;
  font-weight: 600;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-text, #000);
}

.tooltip-hex {
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-text-muted, #888);
}

.tooltip-rgba {
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: var(--cfg-text-muted, #888);
}
</style>
