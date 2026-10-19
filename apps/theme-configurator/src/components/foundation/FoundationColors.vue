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
         TAB 1: PRIMITIVE COLORS
         ═══════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'primitives'" class="tab-content">

      <!-- ── MAIN PALETTES ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Markenpaletten
          <span class="palette-count-badge" :class="{ 'palette-count-badge--full': mainPaletteCount >= 5 }">{{ mainPaletteCount }}/5</span>
        </h3>
        <p class="sub-desc" v-if="isDefaultNeo">Grundtöne der Marke — die Abstufungen (50–950, in 5-%-Schritten) entstehen automatisch.</p>
        <p class="sub-desc" v-else data-test="markenpaletten-hinweis">
          Markenfarben dieses Themes — übernommen aus dem NEO Design System und hier änderbar.
          <strong>Primary</strong> trägt Flächen und Text (Graphit-Leiter), <strong>Accent</strong> den Akzent:
          Ändern zieht die semantischen Farben mit, die auf eine Stufe der Palette zeigen.
          <strong>Secondary</strong> ist vorerst gleich Primary und wirkt auf der Website nicht.
        </p>

        <div class="primitives-grid">
          <!-- Existing main palettes (default NEO or custom theme palettes) -->
          <!-- Markenpaletten in JEDEM Theme (übernommen aus NEO, änderbar;
               Befund Frank 15.10.2026: Einheitlichkeit mit Schriften) -->
          <template v-if="true">
            <div v-for="palette in brandPalettes" :key="palette.id" class="primitive-card">
              <div class="primitive-header">
                <div class="primitive-swatch" :style="{ background: currentPrimitives[palette.id] }"></div>
                <div class="primitive-info">
                  <span class="primitive-label">{{ palette.label }}</span>
                  <span class="primitive-token">--fnd-primitive-{{ palette.id }}-500</span>
                </div>
              </div>
              <div class="primitive-editor">
                <input :aria-label="`${palette.label || palette.id}: Farbe wählen`"
                  type="color"
                  :value="currentPrimitives[palette.id]"
                  @input="store.updatePrimitive(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input :aria-label="`${palette.label || palette.id}: HEX-Wert`"
                  type="text"
                  class="hex-input"
                  :value="currentPrimitives[palette.id]"
                  @change="store.updatePrimitive(palette.id, $event.target.value, $event.target) && ($event.target.value = currentPrimitives[palette.id])"
                />
              </div>
              <div class="shade-strip">
                <div
                  v-for="shade in palette.shades"
                  :key="shade.step"
                  class="shade-chip"
                  :style="{ background: shade.color }"
                  tabindex="0"
                  role="img"
                  :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @focus="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                  @blur="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
              <!-- C1 (Testlauf 16.10.2026): was diese Palette auf der Website färbt -->
              <details class="paletten-wirkung" :data-test="`paletten-wirkung-${palette.id}`">
                <summary>
                  <template v-if="wirkungFuer(palette).length">Färbt auf der Website {{ wirkungFuer(palette).length }} Farbrollen</template>
                  <template v-else>Wirkt auf der Website derzeit nicht</template>
                </summary>
                <p v-if="!wirkungFuer(palette).length" class="paletten-wirkung__text">
                  Keine semantische Farbe zeigt auf eine Stufe dieser Palette. Eine Änderung hier verändert die Website nicht.
                </p>
                <template v-else>
                  <p class="paletten-wirkung__text">
                    Diese Farbrollen zeigen auf eine Stufe der Palette. Ändert sich die Grundfarbe, ändern sie sich mit — auf Buttons, Links, Flächen und Texten, die sie verwenden.
                  </p>
                  <ul class="paletten-wirkung__liste">
                    <li v-for="w in wirkungFuer(palette)" :key="w.id">
                      <span class="paletten-wirkung__farbe" :style="{ background: w.farbe }" aria-hidden="true"></span>
                      {{ w.label }} <code>--fnd-color-{{ w.id }}</code>
                      <span class="paletten-wirkung__modi">{{ w.modi.join(' · ') }}</span>
                    </li>
                  </ul>
                </template>
              </details>
            </div>

            <!-- Custom Main Palettes (default NEO: ergaenzen die 3 Brand-Paletten) -->
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
                <input :aria-label="`${palette.label || palette.id}: Farbe wählen`"
                  type="color"
                  :value="palette.base"
                  @input="updateCustomMainPaletteColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input :aria-label="`${palette.label || palette.id}: HEX-Wert`"
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
                  tabindex="0"
                  role="img"
                  :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @focus="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                  @blur="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>

            <!-- Add Main Palette (Default NEO) -->
            <div v-if="mainPaletteCount < 5 && !drupalBetrieb" class="primitive-card add-palette-card">
              <HinzufuegenFormular
                knopf-text="Markenpalette hinzufügen"
                test-id="markenpalette-neu"
                id-basis="markenpalette-neu"
                :felder="markenpaletteFelder"
                :pruefe="pruefePalette"
                @hinzufuegen="addCustomMainPalette"
              >
                <template #vorschau="{ werte }">
                  <div v-if="paletteVorschau(werte.grundton).length" class="shade-strip" aria-hidden="true">
                    <div
                      v-for="shade in paletteVorschau(werte.grundton)"
                      :key="shade.step"
                      class="shade-chip"
                      :style="{ background: shade.color }"
                      @mouseenter="showTooltip($event, 'preview', shade)"
                      @mouseleave="hideTooltip"
                    >
                      <span class="shade-label">{{ shade.step }}</span>
                    </div>
                  </div>
                </template>
              </HinzufuegenFormular>

            </div>
          </template>

        </div>
      </section>

      <!-- ── SUPPORTING PALETTES ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Ergänzende Paletten
          <button
            v-if="hasPending && isDefaultNeo"
            class="sync-badge"
            @click="triggerManualSync"
            title="Ausstehende Aktualisierungen für die Doku"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
            </svg>
            {{ pendingCountValue }} ausstehend
          </button>
        </h3>
        <p class="sub-desc">Ergänzende Paletten — dekorative und Hilfstöne (50–950, in 5-%-Schritten).</p>
        <p v-if="drupalBetrieb" class="sub-desc" data-test="supporting-hinweis">
          Übernommen aus dem NEO Design System. Im Drupal-Betrieb nicht änderbar: eigene Paletten speichert
          der Konfigurator bisher nur im Browser, nicht im Theme.
        </p>

        <div class="primitives-grid" :inert="drupalBetrieb || undefined" :class="{ 'primitives-grid--gesperrt': drupalBetrieb }">
          <!-- Default NEO (und Drupal-Betrieb): eingebaute + eigene Supporting Palettes -->
          <template v-if="isDefaultNeo || drupalBetrieb">
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
                <input :aria-label="`${palette.label || palette.id}: Farbe wählen`"
                  type="color"
                  :value="palette.base"
                  @input="palette.builtin ? updateSupportingPaletteColor(palette.id, $event.target.value) : updateCustomSupportingPaletteColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input :aria-label="`${palette.label || palette.id}: HEX-Wert`"
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
                  tabindex="0"
                  role="img"
                  :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @focus="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                  @blur="hideTooltip"
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
                <input :aria-label="`${palette.label || palette.id}: Farbe wählen`"
                  type="color"
                  :value="palette.base"
                  @input="updateCustomThemeSupportingColor(palette.id, $event.target.value)"
                  class="color-picker-mini"
                />
                <input :aria-label="`${palette.label || palette.id}: HEX-Wert`"
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
                  tabindex="0"
                  role="img"
                  :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                  @mouseenter="showTooltip($event, palette.id, shade)"
                  @focus="showTooltip($event, palette.id, shade)"
                  @mouseleave="hideTooltip"
                  @blur="hideTooltip"
                >
                  <span class="shade-label">{{ shade.step }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Add Supporting Palette Card (nicht im Drupal-Betrieb: nur Browser-Speicher) -->
          <div v-if="!drupalBetrieb" class="primitive-card add-palette-card">
            <HinzufuegenFormular
              knopf-text="Ergänzende Palette hinzufügen"
              test-id="ergaenzende-palette-neu"
              id-basis="ergaenzende-palette-neu"
              :felder="ergaenzendePaletteFelder"
              :pruefe="pruefePalette"
              @hinzufuegen="addSupportingPalette"
            >
              <template #vorschau="{ werte }">
                <div v-if="paletteVorschau(werte.grundton).length" class="shade-strip" aria-hidden="true">
                  <div
                    v-for="shade in paletteVorschau(werte.grundton)"
                    :key="shade.step"
                    class="shade-chip"
                    :style="{ background: shade.color }"
                    @mouseenter="showTooltip($event, 'preview', shade)"
                    @mouseleave="hideTooltip"
                  >
                    <span class="shade-label">{{ shade.step }}</span>
                  </div>
                </div>
              </template>
            </HinzufuegenFormular>

          </div>
        </div>
      </section>

      <!-- ── FOUNDATION PALETTES (always locked) ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Grundpaletten
          <span class="locked-badge" title="Grundpaletten sind fest und lassen sich nicht ändern">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            nicht änderbar
          </span>
        </h3>
        <p class="sub-desc">Schwarz und Weiß in Transparenzstufen (10–100 %). Für Abdunklungen, Schatten und Ebenen.</p>

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
            nicht änderbar
          </span>
        </h3>
        <p class="sub-desc">Neutrale Grauskala aus dem Grundton #7a7a7a. Basis für Text, Rahmen und Flächen.</p>

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

      <!-- ── PAPIERE / LEITERN (Markenbuch 04.2, always locked) ── -->
      <section class="token-section">
        <h3 class="sub-heading">
          <span class="tier-badge tier-1">L1</span>
          Papiere
          <span class="locked-badge" title="Leitern aus dem Markenbuch; Quelle ist _neutral-ramps.scss">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            nicht änderbar
          </span>
        </h3>
        <p class="sub-desc">Sechs Bereichspapiere (Stufe 100 ist die Seite), zwei Reserveleitern und Forest als Grund. Alle Papiere tragen Stufe für Stufe dieselbe Helligkeit wie Graphit — ein Bereichswechsel über <code>data-bg-paper</code> behält jeden Kontrast.</p>

        <div class="primitives-grid">
          <div v-for="palette in paperLadderList" :key="palette.id" class="primitive-card primitive-card--locked">
            <div class="primitive-header">
              <div class="primitive-swatch" :style="{ background: palette.shades.find(s => s.step === '100')?.color || palette.base }"></div>
              <div class="primitive-info">
                <span class="primitive-label">{{ palette.label }}<template v-if="palette.area"> · {{ palette.area.bereich }}</template><template v-else-if="palette.reserve"> · Reserve</template><template v-else> · Grund</template></span>
                <span class="primitive-token">--fnd-primitive-{{ palette.id }}-*</span>
              </div>
            </div>
            <div class="shade-strip">
              <div
                v-for="shade in palette.shades"
                :key="shade.step"
                class="shade-chip"
                :style="{ background: shade.color }"
                tabindex="0"
                role="img"
                :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                @mouseenter="showTooltip($event, palette.id, shade)"
                @focus="showTooltip($event, palette.id, shade)"
                @mouseleave="hideTooltip"
                @blur="hideTooltip"
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
          Systempaletten
          <span class="locked-badge" title="System palettes are fixed and cannot be overridden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            nicht änderbar
          </span>
        </h3>
        <p class="sub-desc">Rückmelde- und Statusfarben — Info, Erfolg, Warnung, Gefahr mit Abstufungen (50–950, in 5-%-Schritten).</p>

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
                tabindex="0"
                role="img"
                :aria-label="`Stufe ${shade.step}: ${shade.color}`"
                @mouseenter="showTooltip($event, palette.id, shade)"
                @focus="showTooltip($event, palette.id, shade)"
                @mouseleave="hideTooltip"
                @blur="hideTooltip"
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

      <!-- ── CATEGORY CARDS OVERVIEW ── -->
      <template v-if="!store.state.semanticCategory">
        <p class="sub-desc">Wählen Sie eine Kategorie, um die zugehörigen Farbrollen einzustellen.</p>
        <!-- UX-33: „Erhebung“ sind Schatten, keine Farben -->
        <p class="sub-desc" data-test="erhebung-hinweis">Schatten bearbeiten Sie unter <a href="#/foundation/shadows">Grundlagen › Schatten</a>.</p>
        <div class="semantic-category-grid">
          <button
            v-for="group in farbGruppen"
            :key="group.id"
            class="semantic-category-card"
            :data-kategorie="group.id"
            @click="store.state.semanticCategory = group.id"
          >
            <div class="semantic-category-card__icon">
              <!-- Text -->
              <svg v-if="group.id === 'text'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l3-8h10l3 8"/><path d="M7 12l5-8 5 8"/></svg>
              <!-- Background -->
              <svg v-else-if="group.id === 'background'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              <!-- Border -->
              <svg v-else-if="group.id === 'border'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="4 2"/></svg>
              <!-- Interactive -->
              <svg v-else-if="group.id === 'interactive'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"/></svg>
              <!-- Feedback -->
              <svg v-else-if="group.id === 'feedback'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              <!-- Surface / Layer -->
              <svg v-else-if="group.id === 'layer'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4.5v5l-8 4.5l-8 -4.5v-5z"/><path d="M12 12l8 -4.5"/><path d="M12 12v9"/><path d="M12 12l-8 -4.5"/></svg>
              <!-- On-Color -->
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3a9 9 0 0 1 0 18"/></svg>
            </div>
            <div class="semantic-category-card__title-row">
              <span class="semantic-category-card__label">{{ group.label }}</span>
              <!-- UX-32: Warnung nur bei echten Abweichungen (freier Wert, der
                   vom NEO-Standard abweicht) — nicht schon im frischen Theme -->
              <span
                v-if="freieWerte(group).length"
                class="semantic-category-card__status semantic-category-card__status--partial"
                :title="`${freieWerte(group).length} Farbrolle(n) mit eigenem Farbwert ohne Palettenbindung — ziehen bei Palettenänderungen nicht mit`"
                data-test="kategorie-frei"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v8"/><path d="M12 17h.01"/></svg>
                <span class="cfg-sr-only">{{ freieWerte(group).length }} ohne Palettenbindung</span>
              </span>
            </div>
            <span class="semantic-category-card__count">{{ getCategoryMappedCount(group) }}/{{ group.tokens.length }} an Palette gebunden</span>
            <div class="semantic-category-card__swatches">
              <span
                v-for="token in group.tokens.slice(0, 5)"
                :key="token.id"
                class="semantic-category-card__swatch"
                :style="{ background: getLightValue(token.id) }"
              ></span>
            </div>
          </button>
        </div>
      </template>

      <!-- ── ACTIVE CATEGORY: TOKEN LIST ── -->
      <template v-else>
        <div class="semantic-category-header">
          <button type="button" class="semantic-back-btn" @click="store.state.semanticCategory = null; store.state.selectedToken = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 6l-6 6l6 6"/>
            </svg>
            Kategorien
          </button>
          <h4 ref="kategorieTitel" class="semantic-category-title" tabindex="-1">{{ activeCategoryGroup?.label }}</h4>
          <span class="semantic-category-count">{{ activeCategoryGroup?.tokens.length }} Tokens</span>
        </div>

        <div class="semantic-token-grid">
          <div
            v-for="token in activeCategoryGroup?.tokens"
            :key="token.id"
            :class="['semantic-token-card', { 'semantic-token-card--active': selectedTokenId === token.id }]"
          >
            <button
              type="button"
              class="semantic-token-header"
              :aria-expanded="selectedTokenId === token.id ? 'true' : 'false'"
              @click="toggleSemanticToken(token)"
            >
              <!-- Single swatch: zeigt aktive Theme-Farbe -->
              <div
                class="token-swatch"
                :style="{ background: getActiveThemeValue(token.id) }"
                :title="getResolvedChain(token.id, activeThemeMode)"
              ></div>
              <div class="token-meta">
                <span class="token-label">{{ token.label }}</span>
                <span class="token-value"><span class="token-modus" data-test="token-modus">{{ activeThemeMode === 'dark' ? 'Dunkel' : 'Hell' }}</span> {{ getActiveDisplayValue(token.id) }}</span>
                <span v-if="token.description" class="token-hint">{{ token.description }}</span>
              </div>
              <span v-if="getUsedByCount(token.id)" class="used-by-badge" :title="getUsedByTooltip(token.id)">
                {{ getUsedByCount(token.id) }} Komponenten
              </span>
              <svg
                class="token-chevron"
                :class="{ 'token-chevron--open': selectedTokenId === token.id }"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- Expanded: Color Editor + Used-By -->
            <transition name="expand">
              <div v-if="selectedTokenId === token.id" class="primitive-picker">
                <!-- UX-13: welcher Wert bearbeitet wird, sichtbar und umschaltbar -->
                <div class="modus-wahl" role="group" :aria-label="`Wert von ${token.label} bearbeiten`" data-test="modus-wahl">
                  <button
                    v-for="m in MODI"
                    :key="m.id"
                    type="button"
                    :class="['modus-wahl__knopf', { 'modus-wahl__knopf--aktiv': activeThemeMode === m.id }]"
                    :aria-pressed="activeThemeMode === m.id ? 'true' : 'false'"
                    :data-test="`modus-${m.id}`"
                    @click="store.setBearbeitungsModus(m.id)"
                  >
                    <span class="modus-wahl__farbe" :style="{ background: m.id === 'dark' ? getDarkValue(token.id) : getLightValue(token.id) }" aria-hidden="true"></span>
                    <span>{{ m.label }}</span>
                    <code>{{ m.id === 'dark' ? getDarkValue(token.id) : getLightValue(token.id) }}</code>
                  </button>
                </div>
                <!-- UX-32: freier Wert sichtbar machen und Wiederverknüpfen anbieten -->
                <p v-if="!hasPrimitiveMapping(token.id) && naechsteStufe(getActiveThemeValue(token.id))" class="modus-wahl__hinweis" data-test="frei-hinweis">
                  Freier Farbwert — nicht an eine Palette gebunden, zieht bei Palettenänderungen nicht mit.
                  <button type="button" class="modus-wahl__binden" data-test="wieder-binden" @click="assignHexToSemantic(token.id, naechsteStufe(getActiveThemeValue(token.id)).color)">
                    An {{ naechsteStufe(getActiveThemeValue(token.id)).token }} binden
                  </button>
                </p>
                <p v-if="store.state.previewMode === 'split' || store.state.previewMode === 'matrix'" class="modus-wahl__hinweis">
                  Die Vorschau zeigt mehrere Modi. Sie bearbeiten den Wert für {{ activeThemeMode === 'dark' ? 'Dunkel' : 'Hell' }}.
                </p>
                <ColorEditor
                  :modelValue="getActiveThemeValue(token.id)"
                  @update:modelValue="assignHexToSemantic(token.id, $event)"
                  @select-primitive="assignPrimitiveToSemantic(token.id, $event)"
                  :title="token.label"
                  :tokenId="'fnd-color-' + token.id"
                  :tokenPalettes="availablePrimitiveGroups"
                  :contrastTarget="getContrastTarget(token.id)"
                  :themeBackground="activeThemeMode === 'dark' ? getDarkValue('background-base') : getLightValue('background-base')"
                />

                <!-- Wird verwendet von: Component Token Referenzen -->
                <div v-if="getUsedBy(token.id).length" class="used-by-section">
                  <h5 class="used-by-heading">Wird verwendet von</h5>
                  <div class="used-by-list">
                    <div
                      v-for="dep in getUsedBy(token.id)"
                      :key="dep.tokenId"
                      class="used-by-item"
                    >
                      <span class="used-by-component">{{ dep.component }}</span>
                      <code class="used-by-token">{{ dep.tokenId }}</code>
                      <span class="used-by-label">{{ dep.label }}</span>
                    </div>
                  </div>
                </div>

                <!-- Nicht betroffen: Varianten die anderen Token nutzen -->
                <div v-if="getNotAffected(token.id).length" class="not-affected-section">
                  <h5 class="not-affected-heading">Nicht betroffen</h5>
                  <div class="not-affected-list">
                    <div
                      v-for="item in getNotAffected(token.id)"
                      :key="item.label"
                      class="not-affected-item"
                    >
                      <span class="not-affected-label">{{ item.label }}</span>
                      <code class="not-affected-token">→ {{ item.usesToken }}</code>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </template>

    </div><!-- /tab-content: semantic -->
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useStyleguideSync } from '../../stores/styleguide-sync.js'
import { semanticTokenGroups, semanticDefaults, primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, paperLadders, papers, systemPalettes, componentTokenGroups } from '../../data/tokens.js'
import ColorEditor from '../editors/ColorEditor.vue'
import HinzufuegenFormular from '../ui/HinzufuegenFormular.vue'
import { normalisiereHex, HEX_MELDUNG } from '../../utils/token-pruefung.js'
import { paletteSkala, MITZIEHENDE_PALETTEN } from '../../utils/farbskala.js'
import { speicher } from '../../speicher/index.js'

const store = useThemeStore()
const sync = useStyleguideSync()

// ---------------------------------------------------------------------------
// Dual-Swatch helpers: Light + Dark values for token cards
// ---------------------------------------------------------------------------
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

// ---------------------------------------------------------------------------
// Active Tab State
// ---------------------------------------------------------------------------
const activeTab = computed(() => store.state.colorActiveTab)

const activeCategoryGroup = computed(() => {
  if (!store.state.semanticCategory) return null
  return semanticTokenGroups.find(g => g.id === store.state.semanticCategory) || null
})

const selectedToken = ref(null)
const selectedTokenId = computed(() => selectedToken.value?.id || null)

const currentPrimitives = computed(() => store.currentPrimitives)
// Drupal-Betrieb: eigene Paletten speichert die App nur im Browser — dort
// ausgeblendet bzw. gesperrt, damit nichts verloren geht (15.10.2026)
const drupalBetrieb = speicher().art === 'drupal'

// ---------------------------------------------------------------------------
// Is the user on the factory default NEO Theme? (no custom theme loaded)
// ---------------------------------------------------------------------------
const isDefaultNeo = computed(() => {
  return store.state.activeThemeSet === 'neo' && store.state.currentThemeMeta === null
})

// ---------------------------------------------------------------------------
// Brand Palettes (default NEO: primary, secondary, accent from primitives)
// ---------------------------------------------------------------------------
const brandPalettes = computed(() => {
  return ['primary', 'secondary', 'accent'].map(id => {
    const base = currentPrimitives.value[id] || primitiveColors[id].base
    // Gleiche Skala wie Export und Mitziehen: NEO-Leiter oder erzeugt
    const shades = paletteSkala(id, base)
    return {
      id,
      label: primitiveColors[id].label,
      shades: Object.entries(shades).map(([step, color]) => ({ step, color }))
    }
  })
})

// C1 (Testlauf 16.10.2026): Wirkung einer Markenpalette. Eine semantische
// Farbe „gehört“ zur Palette, wenn ihr Wert eine Stufe der Skala ist — genau
// die zieht beim Ändern der Grundfarbe mit (utils/farbskala.js, zieheMit).
const semantikLabel = Object.fromEntries(semanticTokenGroups.flatMap(g => g.tokens.map(t => [t.id, t.label])))
const wirkungJePalette = computed(() => {
  const aus = {}
  const themen = store.state.themes[store.state.activeThemeSet] || {}
  for (const pal of brandPalettes.value) {
    // Nur Primary und Accent ziehen beim Ändern mit; Secondary teilt vorerst
    // die Stufen von Primary, wirkt aber nicht (Hinweis oben)
    if (!MITZIEHENDE_PALETTEN.includes(pal.id)) { aus[pal.id] = []; continue }
    const stufen = new Set(pal.shades.map(sh => String(sh.color).toLowerCase()))
    const treffer = new Map()
    for (const [modus, name] of [['light', 'Hell'], ['dark', 'Dunkel']]) {
      for (const [id, wert] of Object.entries(themen[modus] || {})) {
        if (!stufen.has(String(wert).toLowerCase())) continue
        const t = treffer.get(id) || { id, label: semantikLabel[id] || id, farbe: wert, modi: [] }
        t.modi.push(name)
        treffer.set(id, t)
      }
    }
    aus[pal.id] = [...treffer.values()].sort((a, b) => a.label.localeCompare(b.label, 'de'))
  }
  return aus
})
function wirkungFuer (palette) {
  return wirkungJePalette.value[palette.id] || []
}

// ---------------------------------------------------------------------------
// Custom Main Palettes (non-default themes)
// ---------------------------------------------------------------------------
const MAIN_PALETTES_KEY = 'neo-cfg-custom-main-palettes'

const customMainPalettes = ref(loadCustomMainPalettes())

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

const MAX_MAIN_PALETTES = 5

const mainPaletteCount = computed(() => {
  const base = 3 // primary, secondary, accent — in jedem Theme
  return base + customMainPalettes.value.length
})

function addCustomMainPalette({ name, grundton }) {
  if (mainPaletteCount.value >= MAX_MAIN_PALETTES) return
  customMainPalettes.value.push({ id: paletteId(name), label: name.trim(), base: normalisiereHex(grundton) })
  saveCustomMainPalettes()
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

// Foundation palettes (black/white) use rgba — keep their original shades
const foundationPaletteList = computed(() => palettesToList(foundationPalettes, false))
const neutralPaletteList = computed(() => palettesToList(neutralPalette))
// Leitern aus dem Markenbuch (Kapitel 04.2): feste Werte aus _neutral-ramps.scss,
// nie aus einem Basiswert regeneriert — die Stufen tragen dieselbe Helligkeit
// wie Graphit, das liesse sich aus einem Mittelwert nicht zurueckrechnen.
const paperOrder = (papers.liste || []).concat(papers.reserve || [], ['forest'])
const paperLadderList = computed(() => paperOrder
  .filter(id => paperLadders[id])
  .map(id => ({ ...palettesToList({ [id]: paperLadders[id] }, false)[0], area: papers.bereiche?.[id] || null, reserve: (papers.reserve || []).includes(id) })))
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

function loadCustomPalettes() {
  try {
    const raw = localStorage.getItem('neo-cfg-custom-palettes')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCustomPalettes() {
  localStorage.setItem('neo-cfg-custom-palettes', JSON.stringify(customPalettes.value))
}

// ---------------------------------------------------------------------------
// Formulare „Palette hinzufügen“ (UX-52: gemeinsames Formular)
// ---------------------------------------------------------------------------
const paletteId = (name) => String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const grundtonHilfe = 'Ton 500; die Stufen 50 bis 950 werden daraus berechnet.'
const markenpaletteFelder = [
  { name: 'name', label: 'Name', pflicht: true, platzhalter: 'z. B. Highlight' },
  { name: 'grundton', label: 'Grundton (500)', typ: 'farbe', pflicht: true, start: '#002049', hilfe: grundtonHilfe },
]
const ergaenzendePaletteFelder = [
  { name: 'name', label: 'Name', pflicht: true, platzhalter: 'z. B. Koralle' },
  { name: 'grundton', label: 'Grundton (500)', typ: 'farbe', pflicht: true, start: '#e06060', hilfe: grundtonHilfe },
]

// Jede Palette wird zu --fnd-primitive-<id>-<stufe>: Kennungen sind über alle Paletten eindeutig
const vergebenePaletten = computed(() => new Map([
  ...Object.entries(primitiveColors).map(([id, p]) => [id, p.label]),
  ...customMainPalettes.value.map(p => [p.id, p.label]),
  ...allSupportingPalettes.value.map(p => [p.id, p.label]),
  ...customThemeSupportingStorage.value.map(p => [p.id, p.label]),
  ['neutral', 'Neutral'],
]))

function pruefePalette({ name, grundton }) {
  const n = String(name ?? '').trim()
  if (!n) return { feld: 'name', text: 'Bitte geben Sie einen Namen ein.' }
  const id = paletteId(n)
  if (!id) return { feld: 'name', text: `„${n}“ enthält keine Buchstaben oder Ziffern.` }
  if (vergebenePaletten.value.has(id)) return { feld: 'name', text: `Die Palette „${vergebenePaletten.value.get(id) || id}“ gibt es schon. Bitte wählen Sie einen anderen Namen.` }
  if (!normalisiereHex(grundton)) return { feld: 'grundton', text: HEX_MELDUNG(grundton) }
  return null
}

function paletteVorschau(grundton) {
  const hex = normalisiereHex(grundton)
  return hex ? Object.entries(generateShadeScale(hex)).map(([step, color]) => ({ step, color })) : []
}

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
function addSupportingPalette({ name, grundton }) {
  const palette = { id: paletteId(name), label: name.trim(), base: normalisiereHex(grundton) }

  if (isDefaultNeo.value) {
    // NEO default: uses the existing custom palettes system (syncs with styleguide)
    customPalettes.value.push(palette)
    saveCustomPalettes()

    // Trigger CI/CD pipeline for styleguide update
    if (store.state.activeThemeSet === 'neo' && !store.state.currentThemeMeta) {
      sync.startPipeline(customPalettes.value, { trigger: 'add-palette', palette }, store)
    }
  } else {
    // Non-default theme: uses custom theme supporting palettes
    customThemeSupportingStorage.value.push(palette)
    saveCustomThemeSupportingPalettes()
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


// On initial load, detect any already-pending updates from previous sessions
watch(() => sync.state.loaded, (loaded) => {
  if (loaded && customPalettes.value.length > 0 && store.state.activeThemeSet === 'neo' && !store.state.currentThemeMeta) {
    sync.quickDetect(customPalettes.value, store)
  }
}, { immediate: true })

// Expose computed values that avoid the .value-on-computed bug
const hasPending = computed(() => sync.hasPendingUpdates)
const pendingCountValue = computed(() => sync.pendingCount)

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

  // 1. Brand / Main palettes (in jedem Theme, dazu eigene Hauptpaletten)
  {
    ;['primary', 'secondary', 'accent'].forEach(id => {
      const base = currentPrimitives.value[id] || primitiveColors[id].base
      const shades = paletteSkala(id, base)
      groups.push({
        id,
        label: primitiveColors[id].label,
        shades: Object.entries(shades).map(([step, color]) => ({
          step, color, token: `--fnd-primitive-${id}-${step}`
        }))
      })
    })
  }
  {
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

// ---------------------------------------------------------------------------
// Theme-aware helpers: resolve to active previewMode
// ---------------------------------------------------------------------------
const MODI = [{ id: 'light', label: 'Hell' }, { id: 'dark', label: 'Dunkel' }]

// UX-17: Beim Wechsel zwischen Kategorien-Übersicht und Kategorie bleibt der
// Tastaturfokus an einer sinnvollen Stelle (vorher fiel er auf <body>)
const kategorieTitel = ref(null)
watch(() => store.state.semanticCategory, (neu, alt) => {
  const fokus = document.activeElement
  if (!fokus || fokus === document.body || fokus.closest?.('.semantic-category-card, .semantic-category-header')) {
    nextTick(() => {
      if (neu) kategorieTitel.value?.focus()
      else if (alt) document.querySelector(`.semantic-category-card[data-kategorie="${alt}"]`)?.focus()
    })
  }
})
const activeThemeMode = computed(() => {
  return store.editMode   // bearbeiteter Modus, nie „split“/„matrix“ (UX-08/UX-13)
})

function getLightValue(tokenId) {
  return tLight.value[tokenId] || '#000000'
}
function getDarkValue(tokenId) {
  return tDark.value[tokenId] || '#000000'
}

function getActiveThemeValue(tokenId) {
  return activeThemeMode.value === 'dark' ? getDarkValue(tokenId) : getLightValue(tokenId)
}

function getActiveDisplayValue(tokenId) {
  const hex = getActiveThemeValue(tokenId)
  const normalized = hex.startsWith('#') ? hex.toLowerCase() : hex
  const ref = primitiveColorMap.value[normalized]
  return ref || hex
}

// ---------------------------------------------------------------------------
// Category Status: Wie viele Tokens haben ein Primitive-Mapping?
// ---------------------------------------------------------------------------
function hasPrimitiveMapping(tokenId) {
  const hex = getActiveThemeValue(tokenId)
  if (!hex || hex === '#000000') return false
  const normalized = hex.startsWith('#') ? hex.toLowerCase() : hex
  return !!primitiveColorMap.value[normalized]
}

// UX-33: Die Gruppe „Erhebung“ enthält Schattenwerte (box-shadow), keine
// Farben — sie hat hier weder Werte noch eine Wirkung auf der Website
const farbGruppen = semanticTokenGroups.filter(g => g.id !== 'elevation')

/** UX-32: Farbrollen mit freiem Wert, der vom NEO-Standard abweicht */
function freieWerte(group) {
  const set = store.state.activeThemeSet
  const std = semanticDefaults?.[`${set}-${activeThemeMode.value}`] || {}
  return group.tokens.filter(t => {
    const wert = String(getActiveThemeValue(t.id) || '').toLowerCase()
    return !hasPrimitiveMapping(t.id) && std[t.id] !== undefined && wert !== String(std[t.id]).toLowerCase()
  })
}

/** Nächstgelegene Palettenstufe zu einem freien HEX-Wert (RGB-Abstand) */
function naechsteStufe(hex) {
  const h = String(hex || '').toLowerCase()
  if (!/^#[0-9a-f]{6}$/.test(h)) return null
  const rgb = (x) => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16))
  const ziel = rgb(h)
  let beste = null, abstand = Infinity
  for (const g of availablePrimitiveGroups.value) for (const sh of g.shades) {
    if (!/^#[0-9a-f]{6}$/i.test(sh.color)) continue
    const d = rgb(sh.color.toLowerCase()).reduce((n, v, i) => n + (v - ziel[i]) ** 2, 0)
    if (d < abstand) { abstand = d; beste = sh }
  }
  return beste
}

function getCategoryMappedCount(group) {
  return group.tokens.filter(t => hasPrimitiveMapping(t.id)).length
}


function getResolvedChain(tokenId, mode) {
  const hex = mode === 'dark' ? getDarkValue(tokenId) : getLightValue(tokenId)
  const normalized = hex.startsWith('#') ? hex.toLowerCase() : hex
  const primitiveRef = primitiveColorMap.value[normalized]
  if (primitiveRef) {
    return `--fnd-color-${tokenId} → ${primitiveRef} → ${hex}`
  }
  return `--fnd-color-${tokenId} → ${hex}`
}

function toggleSemanticToken(token) {
  if (selectedToken.value?.id === token.id) {
    selectedToken.value = null
  } else {
    selectedToken.value = token
  }
  store.selectToken(selectedToken.value)
}

function assignPrimitiveToSemantic(tokenId, shade) {
  store.updateSemanticToken(tokenId, shade.color)
}

function assignHexToSemantic(tokenId, hex) {
  store.updateSemanticToken(tokenId, hex)
}

// Contrast helpers
function getContrastTarget(tokenId) {
  const tokens = store.currentSemanticTokens
  if (tokenId.startsWith('text-') || tokenId.startsWith('on-')) {
    return tokens['background-base'] || '#ffffff'
  }
  if (tokenId.startsWith('background-')) {
    return tokens['text-primary'] || '#000000'
  }
  return ''
}

// ---------------------------------------------------------------------------
// Reverse-Mapping: Semantic → Component Tokens (Used-By)
// ---------------------------------------------------------------------------
const semanticToComponents = computed(() => {
  const map = {}
  for (const group of componentTokenGroups) {
    for (const token of group.tokens) {
      if (token.ref) {
        if (!map[token.ref]) map[token.ref] = []
        map[token.ref].push({ component: group.label, tokenId: token.id, label: token.label })
      }
    }
  }
  return map
})

function getUsedBy(semanticId) {
  return semanticToComponents.value[semanticId] || []
}

function getUsedByCount(semanticId) {
  return getUsedBy(semanticId).length
}

function getUsedByTooltip(semanticId) {
  return getUsedBy(semanticId).map(d => `${d.component}: ${d.label}`).join(', ')
}

// ---------------------------------------------------------------------------
// Nicht betroffen: Varianten die NICHT diesen Token nutzen (Kontext-Hilfe)
// Zeigt z.B. bei text-on-interactive, dass Secondary → interactive-default nutzt
// ---------------------------------------------------------------------------
const NOT_AFFECTED_MAP = {
  'text-on-interactive': [
    { label: 'Secondary Button', usesToken: 'interactive-default' },
    { label: 'Ghost Button', usesToken: 'text-primary' },
    { label: 'Inactive Tab', usesToken: 'text-secondary' },
    { label: 'Text Link', usesToken: 'text-link' }
  ],
  'interactive-default': [
    { label: 'Ghost Button Text', usesToken: 'text-primary' },
    { label: 'Disabled Button', usesToken: 'text-disabled' }
  ],
  'text-primary': [
    { label: 'Primary Button Text', usesToken: 'text-on-interactive' },
    { label: 'Active Tab Text', usesToken: 'text-on-interactive' }
  ]
}

function getNotAffected(semanticId) {
  return NOT_AFFECTED_MAP[semanticId] || []
}
</script>

<style scoped>
.foundation-colors {
  display: flex;
  flex-direction: column;
  gap: 0;
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

.sub-desc a { color: var(--cfg-text); text-decoration: underline; text-underline-offset: 2px; }   /* axe link-in-text-block */

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
.tier-2 { background: #dcfce7; color: #166534; }   /* UX-19: 6,9:1 statt 3:1 */
.tier-3 { background: #fef3c7; color: #d97706; }

.theme-indicator {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
}

.palette-count-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  font-variant-numeric: tabular-nums;
}

.palette-count-badge--full {
  color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
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
.primitives-grid--gesperrt { opacity: 0.75; }

/* C1: Wirkung einer Palette */
.paletten-wirkung { margin-top: 10px; font-size: 12px; color: var(--cfg-text); }
.paletten-wirkung summary { cursor: pointer; font-weight: 600; }
.paletten-wirkung__text { margin: 6px 0; color: var(--cfg-text-muted); line-height: 1.5; }
.paletten-wirkung__liste { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; max-height: 220px; overflow-y: auto; }
.paletten-wirkung__liste li { display: flex; align-items: center; gap: 6px; }
.paletten-wirkung__liste code { font-size: 11px; color: var(--cfg-text-muted); }
.paletten-wirkung__farbe { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--cfg-border); flex: none; }
.paletten-wirkung__modi { margin-left: auto; font-size: 11px; color: var(--cfg-text-muted); }

.add-palette-card {
  border-style: dashed;
  background: var(--cfg-surface);
  min-height: 120px;
  justify-content: center;
  align-items: center;
}

.add-palette-card > .hf { width: 100%; }
.add-palette-card :deep(.hf-oeffnen) { justify-self: center; }

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
   SEMANTIC COLORS TAB — Category Cards
   ═══════════════════════════════════════════════════════════════════ */
.semantic-category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.semantic-category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  background: var(--cfg-surface);
  cursor: pointer;
  transition: border-color var(--fnd-motion-duration-150), box-shadow var(--fnd-motion-duration-150);
  text-align: left;
  color: inherit;
}

.semantic-category-card:hover {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.semantic-category-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--cfg-surface-elevated, #f5f5f5);
  color: var(--cfg-accent);
}

.semantic-category-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.semantic-category-card__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
}

.semantic-category-card__status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  color: #fff;
}

.semantic-category-card__status--complete {
  background: #16a34a;
}

.semantic-category-card__status--partial {
  background: #b45309;
}

.semantic-category-card__status--none {
  background: #dc2626;
}

.semantic-category-card__count {
  font-size: 11px;
  color: var(--cfg-text-muted);
}

.semantic-category-card__swatches {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}

.semantic-category-card__swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.08);
}

/* ── Category Header (back + title) ── */
.semantic-category-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.semantic-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 4px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--fnd-motion-duration-100), border-color var(--fnd-motion-duration-100);
}

.semantic-back-btn:hover {
  color: var(--cfg-text);
  border-color: var(--cfg-text-muted);
}

.semantic-category-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
}

.semantic-category-count {
  font-size: 11px;
  color: var(--cfg-text-muted);
  margin-left: auto;
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

/* ── Single Token Swatch (aktives Theme) ── */
.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

/* Legacy single swatch (fallback for non-semantic usage) */
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

.token-hint {
  font-size: 10px;
  color: var(--cfg-text-muted);
  line-height: 1.3;
  margin-top: 2px;
  white-space: normal;
}

.used-by-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  white-space: nowrap;
  flex-shrink: 0;
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
/* UX-13: Hell | Dunkel am Token */
.token-modus { font-weight: 600; color: var(--cfg-text); }
.modus-wahl { display: flex; gap: 6px; flex-wrap: wrap; }
.modus-wahl__knopf {
  display: inline-flex; align-items: center; gap: 6px; flex: 1 1 140px; min-height: 32px;
  padding: 4px 10px; border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text); font-size: 12px; cursor: pointer;
}
.modus-wahl__knopf code { font-size: 11px; color: var(--cfg-text-muted); margin-left: auto; }
.modus-wahl__knopf--aktiv { border-color: var(--cfg-accent); box-shadow: inset 0 0 0 1px var(--cfg-accent); font-weight: 600; }
.modus-wahl__farbe { width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--cfg-border); flex: none; }
.modus-wahl__hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-secondary); }
.modus-wahl__binden { margin-left: 6px; border: 1px solid var(--cfg-border); border-radius: 4px; background: var(--cfg-surface); color: var(--cfg-text); font-size: 11px; padding: 2px 6px; cursor: pointer; }

.primitive-picker {
  padding: 12px;
  border-top: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text, #000);
}

.tooltip-hex {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted, #888);
}

.tooltip-rgba {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted, #888);
}

/* ── Wird verwendet von / Nicht betroffen ── */
.used-by-section,
.not-affected-section {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--cfg-border, #e5e5e5);
}

.used-by-heading,
.not-affected-heading {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-text-secondary, #666);
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.not-affected-heading {
  color: var(--cfg-text-muted, #999);
}

.used-by-list,
.not-affected-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.used-by-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(59, 130, 246, 0.06);
  border-radius: 4px;
  font-size: 11px;
}

.used-by-component {
  font-weight: 600;
  color: var(--cfg-text-primary, #333);
  white-space: nowrap;
}

.used-by-token {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 10px;
  color: var(--cfg-text-muted, #888);
  flex: 1;
}

.used-by-label {
  font-size: 10px;
  color: var(--cfg-text-secondary, #666);
  white-space: nowrap;
}

.not-affected-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--cfg-text-muted, #999);
}

.not-affected-label {
  white-space: nowrap;
}

.not-affected-token {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 10px;
  color: var(--cfg-text-muted, #aaa);
}

</style>
