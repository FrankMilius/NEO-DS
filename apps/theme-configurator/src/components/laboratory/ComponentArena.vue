<template>
  <div class="component-arena" v-if="componentData">

    <!-- variants-matrix Renderer -->
    <template v-if="arenaConfig && arenaConfig.type === 'variants-matrix'">

      <!-- Pro Category -->
      <template v-for="cat in variantCategories" :key="cat.id">
        <div class="arena-category-divider">
          <span class="arena-category-label">{{ cat.label }}</span>
        </div>

        <!-- Pro Variant -->
        <div
          v-for="variant in cat.variants"
          :key="variant.id"
          :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has(variant.id) }]"
        >
          <span class="arena-specimen__label">{{ variant.label }}</span>
          <div class="arena-specimen__pair">
            <!-- Light Panel -->
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes"
                  :key="size"
                  class="arena-btn"
                  :style="iStyle(tokensLight, variant.id, size, bk('l', variant.id, size))"
                  v-on="iEvents(bk('l', variant.id, size))"
                >{{ variant.label }} {{ size.toUpperCase() }}</button>
              </div>
            </div>
            <!-- Dark Panel -->
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes"
                  :key="size"
                  class="arena-btn"
                  :style="iStyle(tokensDark, variant.id, size, bk('d', variant.id, size))"
                  v-on="iEvents(bk('d', variant.id, size))"
                >{{ variant.label }} {{ size.toUpperCase() }}</button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- States Section (statisch — zeigt alle States nebeneinander) -->
      <div class="arena-category-divider">
        <span class="arena-category-label">States</span>
      </div>
      <div class="arena-specimen">
        <span class="arena-specimen__label">Primary — States</span>
        <div class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
            <div class="arena-btn-row">
              <button class="arena-btn" :style="buildStyle(tokensLight, 'primary', 'md')">Default</button>
              <button class="arena-btn" :style="hoverStyle(tokensLight, 'primary', 'md')">Hover</button>
              <button class="arena-btn" :style="activeStyle(tokensLight, 'primary', 'md')">Active</button>
              <button class="arena-btn arena-btn--disabled" :style="disabledStyle(tokensLight)">Disabled</button>
            </div>
          </div>
          <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
            <div class="arena-btn-row">
              <button class="arena-btn" :style="buildStyle(tokensDark, 'primary', 'md')">Default</button>
              <button class="arena-btn" :style="hoverStyle(tokensDark, 'primary', 'md')">Hover</button>
              <button class="arena-btn" :style="activeStyle(tokensDark, 'primary', 'md')">Active</button>
              <button class="arena-btn arena-btn--disabled" :style="disabledStyle(tokensDark)">Disabled</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- Patterns Section — 6 Specimens                                -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <template v-if="specimens.length">
        <div class="arena-category-divider">
          <span class="arena-category-label">Patterns</span>
        </div>

        <!-- With Icon -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('with-icon') }]">
          <span class="arena-specimen__label">With Icon</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes" :key="size"
                  class="arena-btn"
                  :style="{ ...iStyle(tokensLight, 'primary', size, bk('l', 'wi', size)), gap: tokensLight['nc-button-gap'] || '8px' }"
                  v-on="iEvents(bk('l', 'wi', size))"
                ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>Label</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes" :key="size"
                  class="arena-btn"
                  :style="{ ...iStyle(tokensDark, 'primary', size, bk('d', 'wi', size)), gap: tokensDark['nc-button-gap'] || '8px' }"
                  v-on="iEvents(bk('d', 'wi', size))"
                ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>Label</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Icon Only -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('icon-only') }]">
          <span class="arena-specimen__label">Icon Only</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <template v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid">
                  <button
                    v-for="size in arenaConfig.sizes" :key="size"
                    class="arena-btn"
                    :style="iIconOnlyStyle(tokensLight, vid, size, bk('l', 'io-' + vid, size))"
                    v-on="iEvents(bk('l', 'io-' + vid, size))"
                  ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                </template>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <template v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid">
                  <button
                    v-for="size in arenaConfig.sizes" :key="size"
                    class="arena-btn"
                    :style="iIconOnlyStyle(tokensDark, vid, size, bk('d', 'io-' + vid, size))"
                    v-on="iEvents(bk('d', 'io-' + vid, size))"
                  ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('loading') }]">
          <span class="arena-specimen__label">Loading</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="vid in ['primary', 'secondary']" :key="vid"
                  class="arena-btn"
                  :style="loadingStyle(tokensLight, vid, 'md')"
                ><span style="opacity: 0">Loading</span><span class="arena-btn__spinner" :style="spinnerStyle(tokensLight, vid)"></span></button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="vid in ['primary', 'secondary']" :key="vid"
                  class="arena-btn"
                  :style="loadingStyle(tokensDark, vid, 'md')"
                ><span style="opacity: 0">Loading</span><span class="arena-btn__spinner" :style="spinnerStyle(tokensDark, vid)"></span></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Button Group -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('group') }]">
          <span class="arena-specimen__label">Button Group</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-group">
                <button
                  v-for="(pos, i) in ['first', 'middle', 'last']" :key="pos"
                  class="arena-btn"
                  :style="iGroupBtnStyle(tokensLight, 'outline', 'md', pos, bk('l', 'grp', pos))"
                  v-on="iEvents(bk('l', 'grp', pos))"
                >{{ ['Left', 'Center', 'Right'][i] }}</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-group">
                <button
                  v-for="(pos, i) in ['first', 'middle', 'last']" :key="pos"
                  class="arena-btn"
                  :style="iGroupBtnStyle(tokensDark, 'outline', 'md', pos, bk('d', 'grp', pos))"
                  v-on="iEvents(bk('d', 'grp', pos))"
                >{{ ['Left', 'Center', 'Right'][i] }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toggle -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('toggle') }]">
          <span class="arena-specimen__label">Toggle</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button class="arena-btn"
                  :style="iStyle(tokensLight, 'outline', 'md', bk('l', 'tgl', 'off'))"
                  v-on="iEvents(bk('l', 'tgl', 'off'))"
                  aria-pressed="false">Unpressed</button>
                <button class="arena-btn"
                  :style="iTogglePressedStyle(tokensLight, 'md', bk('l', 'tgl', 'on'))"
                  v-on="iEvents(bk('l', 'tgl', 'on'))"
                  aria-pressed="true">Pressed</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button class="arena-btn"
                  :style="iStyle(tokensDark, 'outline', 'md', bk('d', 'tgl', 'off'))"
                  v-on="iEvents(bk('d', 'tgl', 'off'))"
                  aria-pressed="false">Unpressed</button>
                <button class="arena-btn"
                  :style="iTogglePressedStyle(tokensDark, 'md', bk('d', 'tgl', 'on'))"
                  v-on="iEvents(bk('d', 'tgl', 'on'))"
                  aria-pressed="true">Pressed</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Link as Button -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('link') }]">
          <span class="arena-specimen__label">Link as Button</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <a v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid"
                   class="arena-btn"
                   :style="{ ...iStyle(tokensLight, vid, 'md', bk('l', 'lnk', vid)), textDecoration: 'none' }"
                   v-on="iEvents(bk('l', 'lnk', vid))"
                   tabindex="0"
                >{{ vid.charAt(0).toUpperCase() + vid.slice(1) }} Link</a>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <a v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid"
                   class="arena-btn"
                   :style="{ ...iStyle(tokensDark, vid, 'md', bk('d', 'lnk', vid)), textDecoration: 'none' }"
                   v-on="iEvents(bk('d', 'lnk', vid))"
                   tabindex="0"
                >{{ vid.charAt(0).toUpperCase() + vid.slice(1) }} Link</a>
              </div>
            </div>
          </div>
        </div>

      </template>

    </template>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- Generic Preview Renderer (47 Komponenten ohne eigene Arena)      -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <template v-else-if="previewType">
      <div class="arena-generic-preview">

        <!-- ─── form-input ─────────────────────────────────────────── -->
        <template v-if="previewType === 'form-input'">
          <div class="arena-category-divider"><span class="arena-category-label">Sizes</span></div>
          <div class="arena-specimen">
            <span class="arena-specimen__label">Default State — Sizes</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-preview-stack">
                  <template v-for="size in ['sm', 'md', 'lg']" :key="size">
                    <input type="text" class="arena-input" :placeholder="'Placeholder ' + size.toUpperCase()"
                      :style="inputStyle(tokensLight, size)" readonly />
                  </template>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-preview-stack">
                  <template v-for="size in ['sm', 'md', 'lg']" :key="size">
                    <input type="text" class="arena-input" :placeholder="'Placeholder ' + size.toUpperCase()"
                      :style="inputStyle(tokensDark, size)" readonly />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="arena-category-divider"><span class="arena-category-label">States</span></div>
          <div class="arena-specimen">
            <span class="arena-specimen__label">States</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-preview-stack">
                  <input type="text" class="arena-input" value="Default" :style="inputStyle(tokensLight, 'md')" readonly />
                  <input type="text" class="arena-input" value="Hover" :style="{ ...inputStyle(tokensLight, 'md'), borderColor: tk(tokensLight, 'border-hover') }" readonly />
                  <input type="text" class="arena-input" value="Focus" :style="{ ...inputStyle(tokensLight, 'md'), borderColor: tk(tokensLight, 'border-focus'), outline: '2px solid ' + (tk(tokensLight, 'border-focus') || 'currentColor'), outlineOffset: '1px' }" readonly />
                  <input type="text" class="arena-input" value="Error" :style="{ ...inputStyle(tokensLight, 'md'), borderColor: tk(tokensLight, 'border-error') }" readonly />
                  <input type="text" class="arena-input" value="Disabled" :style="{ ...inputStyle(tokensLight, 'md'), background: tk(tokensLight, 'disabled-bg'), color: tk(tokensLight, 'disabled-color'), borderColor: tk(tokensLight, 'disabled-border'), opacity: tk(tokensLight, 'disabled-opacity') || '0.5' }" readonly />
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-preview-stack">
                  <input type="text" class="arena-input" value="Default" :style="inputStyle(tokensDark, 'md')" readonly />
                  <input type="text" class="arena-input" value="Hover" :style="{ ...inputStyle(tokensDark, 'md'), borderColor: tk(tokensDark, 'border-hover') }" readonly />
                  <input type="text" class="arena-input" value="Focus" :style="{ ...inputStyle(tokensDark, 'md'), borderColor: tk(tokensDark, 'border-focus'), outline: '2px solid ' + (tk(tokensDark, 'border-focus') || 'currentColor'), outlineOffset: '1px' }" readonly />
                  <input type="text" class="arena-input" value="Error" :style="{ ...inputStyle(tokensDark, 'md'), borderColor: tk(tokensDark, 'border-error') }" readonly />
                  <input type="text" class="arena-input" value="Disabled" :style="{ ...inputStyle(tokensDark, 'md'), background: tk(tokensDark, 'disabled-bg'), color: tk(tokensDark, 'disabled-color'), borderColor: tk(tokensDark, 'disabled-border'), opacity: tk(tokensDark, 'disabled-opacity') || '0.5' }" readonly />
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── inline-element (tag, chip, kbd, divider) ───────────── -->
        <template v-else-if="previewType === 'inline-element'">
          <!-- Tag / Chip -->
          <template v-if="props.componentId === 'tag' || props.componentId === 'chip'">
            <div class="arena-category-divider"><span class="arena-category-label">Variants</span></div>
            <div class="arena-specimen">
              <span class="arena-specimen__label">Color Variants</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-btn-row">
                    <span v-for="v in ['default','primary','success','warning','error','info']" :key="v" class="arena-tag"
                      :style="tagStyle(tokensLight, v)">{{ v }}</span>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-btn-row">
                    <span v-for="v in ['default','primary','success','warning','error','info']" :key="v" class="arena-tag"
                      :style="tagStyle(tokensDark, v)">{{ v }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="arena-category-divider"><span class="arena-category-label">Sizes</span></div>
            <div class="arena-specimen">
              <span class="arena-specimen__label">Sizes</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-btn-row">
                    <span v-for="s in ['sm','md','lg']" :key="s" class="arena-tag"
                      :style="tagStyle(tokensLight, 'primary', s)">{{ s.toUpperCase() }}</span>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-btn-row">
                    <span v-for="s in ['sm','md','lg']" :key="s" class="arena-tag"
                      :style="tagStyle(tokensDark, 'primary', s)">{{ s.toUpperCase() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Kbd -->
          <template v-else-if="props.componentId === 'kbd'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Keyboard Keys</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-btn-row">
                    <kbd v-for="k in ['⌘','Shift','Alt','Enter','Esc','Tab']" :key="k" class="arena-kbd"
                      :style="kbdStyle(tokensLight)">{{ k }}</kbd>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-btn-row">
                    <kbd v-for="k in ['⌘','Shift','Alt','Enter','Esc','Tab']" :key="k" class="arena-kbd"
                      :style="kbdStyle(tokensDark)">{{ k }}</kbd>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Divider -->
          <template v-else-if="props.componentId === 'divider'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Dividers</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 16px; padding: 8px 0;">
                    <hr class="arena-divider" :style="dividerStyle(tokensLight)" />
                    <hr class="arena-divider" :style="{ ...dividerStyle(tokensLight), borderStyle: 'dashed' }" />
                    <div style="display: flex; align-items: stretch; gap: 12px; height: 40px;">
                      <span :style="{ color: tLight['text-primary'] }">Left</span>
                      <div class="arena-divider-v" :style="dividerVertStyle(tokensLight)"></div>
                      <span :style="{ color: tLight['text-primary'] }">Right</span>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 16px; padding: 8px 0;">
                    <hr class="arena-divider" :style="dividerStyle(tokensDark)" />
                    <hr class="arena-divider" :style="{ ...dividerStyle(tokensDark), borderStyle: 'dashed' }" />
                    <div style="display: flex; align-items: stretch; gap: 12px; height: 40px;">
                      <span :style="{ color: tDark['text-primary'] }">Left</span>
                      <div class="arena-divider-v" :style="dividerVertStyle(tokensDark)"></div>
                      <span :style="{ color: tDark['text-primary'] }">Right</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── control (checkbox, radio, switch, slider, rating) ──── -->
        <template v-else-if="previewType === 'control'">
          <!-- Checkbox / Radio -->
          <template v-if="props.componentId === 'checkbox' || props.componentId === 'radio'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">States</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack">
                    <label class="arena-check-label" v-for="(st, i) in ['Unchecked', 'Checked', 'Disabled']" :key="st" :style="{ color: tLight['text-primary'], gap: tk(tokensLight, 'label-gap') || '8px', opacity: i === 2 ? (tk(tokensLight, 'disabled-opacity') || '0.5') : '1' }">
                      <span class="arena-check-box" :style="checkboxStyle(tokensLight, i === 1, i === 2, props.componentId === 'radio')">
                        <svg v-if="i === 1 && props.componentId === 'checkbox'" viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px;"><polyline points="2.5 7 5.5 10.5 11.5 3.5"/></svg>
                        <span v-if="i === 1 && props.componentId === 'radio'" style="width: 6px; height: 6px; border-radius: 50%; background: white;"></span>
                      </span>
                      {{ st }}
                    </label>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack">
                    <label class="arena-check-label" v-for="(st, i) in ['Unchecked', 'Checked', 'Disabled']" :key="st" :style="{ color: tDark['text-primary'], gap: tk(tokensDark, 'label-gap') || '8px', opacity: i === 2 ? (tk(tokensDark, 'disabled-opacity') || '0.5') : '1' }">
                      <span class="arena-check-box" :style="checkboxStyle(tokensDark, i === 1, i === 2, props.componentId === 'radio')">
                        <svg v-if="i === 1 && props.componentId === 'checkbox'" viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px;"><polyline points="2.5 7 5.5 10.5 11.5 3.5"/></svg>
                        <span v-if="i === 1 && props.componentId === 'radio'" style="width: 6px; height: 6px; border-radius: 50%; background: white;"></span>
                      </span>
                      {{ st }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Switch -->
          <template v-else-if="props.componentId === 'switch'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">States</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack">
                    <label v-for="(st, i) in ['Off', 'On', 'Disabled']" :key="st" class="arena-check-label"
                      :style="{ color: tLight['text-primary'], gap: tk(tokensLight, 'label-gap') || '8px', opacity: i === 2 ? (tk(tokensLight, 'disabled-opacity') || '0.5') : '1' }">
                      <span class="arena-switch-track" :style="switchTrackStyle(tokensLight, i === 1, i === 2)">
                        <span class="arena-switch-thumb" :style="switchThumbStyle(tokensLight, i === 1)"></span>
                      </span>
                      {{ st }}
                    </label>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack">
                    <label v-for="(st, i) in ['Off', 'On', 'Disabled']" :key="st" class="arena-check-label"
                      :style="{ color: tDark['text-primary'], gap: tk(tokensDark, 'label-gap') || '8px', opacity: i === 2 ? (tk(tokensDark, 'disabled-opacity') || '0.5') : '1' }">
                      <span class="arena-switch-track" :style="switchTrackStyle(tokensDark, i === 1, i === 2)">
                        <span class="arena-switch-thumb" :style="switchThumbStyle(tokensDark, i === 1)"></span>
                      </span>
                      {{ st }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Slider -->
          <template v-else-if="props.componentId === 'slider'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Slider</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack" style="padding: 12px 0;">
                    <div class="arena-slider-track" :style="sliderTrackStyle(tokensLight)">
                      <div class="arena-slider-fill" :style="sliderFillStyle(tokensLight, 65)"></div>
                      <div class="arena-slider-thumb" :style="sliderThumbStyle(tokensLight, 65)"></div>
                    </div>
                    <div class="arena-slider-track" :style="{ ...sliderTrackStyle(tokensLight), opacity: tk(tokensLight, 'disabled-opacity') || '0.5' }">
                      <div class="arena-slider-fill" :style="sliderFillStyle(tokensLight, 30)"></div>
                      <div class="arena-slider-thumb" :style="sliderThumbStyle(tokensLight, 30)"></div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack" style="padding: 12px 0;">
                    <div class="arena-slider-track" :style="sliderTrackStyle(tokensDark)">
                      <div class="arena-slider-fill" :style="sliderFillStyle(tokensDark, 65)"></div>
                      <div class="arena-slider-thumb" :style="sliderThumbStyle(tokensDark, 65)"></div>
                    </div>
                    <div class="arena-slider-track" :style="{ ...sliderTrackStyle(tokensDark), opacity: tk(tokensDark, 'disabled-opacity') || '0.5' }">
                      <div class="arena-slider-fill" :style="sliderFillStyle(tokensDark, 30)"></div>
                      <div class="arena-slider-thumb" :style="sliderThumbStyle(tokensDark, 30)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Rating -->
          <template v-else-if="props.componentId === 'rating'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Rating</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-btn-row" style="gap: 2px;">
                    <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :style="{ width: tk(tokensLight, 'size') || '24px', height: tk(tokensLight, 'size') || '24px', fill: i <= 3 ? (tk(tokensLight, 'color-active') || tk(tokensLight, 'active-color') || '#f59e0b') : 'none', stroke: i <= 3 ? (tk(tokensLight, 'color-active') || tk(tokensLight, 'active-color') || '#f59e0b') : (tk(tokensLight, 'color-inactive') || tk(tokensLight, 'inactive-color') || '#d1d5db'), strokeWidth: '1.5' }"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-btn-row" style="gap: 2px;">
                    <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :style="{ width: tk(tokensDark, 'size') || '24px', height: tk(tokensDark, 'size') || '24px', fill: i <= 3 ? (tk(tokensDark, 'color-active') || tk(tokensDark, 'active-color') || '#f59e0b') : 'none', stroke: i <= 3 ? (tk(tokensDark, 'color-active') || tk(tokensDark, 'active-color') || '#f59e0b') : (tk(tokensDark, 'color-inactive') || tk(tokensDark, 'inactive-color') || '#4b5563'), strokeWidth: '1.5' }"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── surface (alert, toast, banner, popover, dialog, tooltip, validation-summary, empty-state) ── -->
        <template v-else-if="previewType === 'surface'">
          <!-- Alert / Banner / Validation-Summary / Toast -->
          <template v-if="['alert','banner','validation-summary','toast'].includes(props.componentId)">
            <div class="arena-category-divider"><span class="arena-category-label">Variants</span></div>
            <div class="arena-specimen" v-for="v in surfaceVariants" :key="v.id">
              <span class="arena-specimen__label">{{ v.label }}</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-surface-card" :style="surfaceStyle(tokensLight, v.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ width: tk(tokensLight, 'icon-size') || '20px', height: tk(tokensLight, 'icon-size') || '20px', flexShrink: 0, color: tk(tokensLight, v.id + '-icon-color') || 'currentColor' }"><circle v-if="v.id==='info'" cx="12" cy="12" r="10"/><path v-if="v.id==='info'" d="M12 16v-4M12 8h.01"/><path v-if="v.id==='success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="v.id==='success'" points="22 4 12 14.01 9 11.01"/><path v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" x1="12" y1="9" x2="12" y2="13"/><line v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div class="arena-surface-content">
                      <strong>{{ v.label }} Title</strong>
                      <span style="font-size: 0.9em; opacity: 0.85;">Description text for the {{ v.label.toLowerCase() }} message.</span>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-surface-card" :style="surfaceStyle(tokensDark, v.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ width: tk(tokensDark, 'icon-size') || '20px', height: tk(tokensDark, 'icon-size') || '20px', flexShrink: 0, color: tk(tokensDark, v.id + '-icon-color') || 'currentColor' }"><circle v-if="v.id==='info'" cx="12" cy="12" r="10"/><path v-if="v.id==='info'" d="M12 16v-4M12 8h.01"/><path v-if="v.id==='success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="v.id==='success'" points="22 4 12 14.01 9 11.01"/><path v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" x1="12" y1="9" x2="12" y2="13"/><line v-if="v.id==='warning'||v.id==='danger'||v.id==='error'" x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div class="arena-surface-content">
                      <strong>{{ v.label }} Title</strong>
                      <span style="font-size: 0.9em; opacity: 0.85;">Description text for the {{ v.label.toLowerCase() }} message.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Dialog -->
          <template v-else-if="props.componentId === 'dialog'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Dialog</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-dialog" :style="dialogStyle(tokensLight)">
                    <strong :style="{ fontSize: tk(tokensLight, 'title-font-size') || '18px', fontWeight: tk(tokensLight, 'title-font-weight') || '600', color: tk(tokensLight, 'title-color') || tLight['text-primary'] }">Dialog Title</strong>
                    <p :style="{ fontSize: tk(tokensLight, 'description-font-size') || '14px', color: tk(tokensLight, 'description-color') || tLight['text-secondary'], margin: 0 }">Are you sure you want to continue? This action cannot be undone.</p>
                    <div :style="{ display: 'flex', gap: tk(tokensLight, 'footer-gap') || '8px', justifyContent: 'flex-end', marginTop: '8px' }">
                      <span class="arena-dialog-btn" :style="{ background: 'transparent', color: tLight['text-primary'], border: '1px solid ' + (tLight['border-primary'] || '#ccc'), borderRadius: tk(tokensLight, 'radius') || '8px' }">Cancel</span>
                      <span class="arena-dialog-btn" :style="{ background: tLight['interactive-default'] || '#002049', color: '#fff', border: 'none', borderRadius: tk(tokensLight, 'radius') || '8px' }">Confirm</span>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-dialog" :style="dialogStyle(tokensDark)">
                    <strong :style="{ fontSize: tk(tokensDark, 'title-font-size') || '18px', fontWeight: tk(tokensDark, 'title-font-weight') || '600', color: tk(tokensDark, 'title-color') || tDark['text-primary'] }">Dialog Title</strong>
                    <p :style="{ fontSize: tk(tokensDark, 'description-font-size') || '14px', color: tk(tokensDark, 'description-color') || tDark['text-secondary'], margin: 0 }">Are you sure you want to continue? This action cannot be undone.</p>
                    <div :style="{ display: 'flex', gap: tk(tokensDark, 'footer-gap') || '8px', justifyContent: 'flex-end', marginTop: '8px' }">
                      <span class="arena-dialog-btn" :style="{ background: 'transparent', color: tDark['text-primary'], border: '1px solid ' + (tDark['border-primary'] || '#555'), borderRadius: tk(tokensDark, 'radius') || '8px' }">Cancel</span>
                      <span class="arena-dialog-btn" :style="{ background: tDark['interactive-default'] || '#009fe3', color: '#fff', border: 'none', borderRadius: tk(tokensDark, 'radius') || '8px' }">Confirm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Tooltip -->
          <template v-else-if="props.componentId === 'tooltip'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Tooltip</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
                    <div class="arena-tooltip" :style="tooltipStyle(tokensLight)">Tooltip text</div>
                    <div class="arena-tooltip" :style="{ ...tooltipStyle(tokensLight), maxWidth: '160px' }">Longer tooltip with more detailed explanation text</div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
                    <div class="arena-tooltip" :style="tooltipStyle(tokensDark)">Tooltip text</div>
                    <div class="arena-tooltip" :style="{ ...tooltipStyle(tokensDark), maxWidth: '160px' }">Longer tooltip with more detailed explanation text</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Popover -->
          <template v-else-if="props.componentId === 'popover'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Popover</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-dialog" :style="popoverStyle(tokensLight)">
                    <strong :style="{ color: tLight['text-primary'] }">Popover Title</strong>
                    <span :style="{ fontSize: '13px', color: tLight['text-secondary'] }">Content that appears inside the popover element.</span>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-dialog" :style="popoverStyle(tokensDark)">
                    <strong :style="{ color: tDark['text-primary'] }">Popover Title</strong>
                    <span :style="{ fontSize: '13px', color: tDark['text-secondary'] }">Content that appears inside the popover element.</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Empty State -->
          <template v-else-if="props.componentId === 'empty-state'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Empty State</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ width: tk(tokensLight, 'icon-size') || '48px', height: tk(tokensLight, 'icon-size') || '48px', color: tLight['text-tertiary'] || '#999' }"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    <strong :style="{ color: tk(tokensLight, 'title-color') || tLight['text-primary'] }">No items found</strong>
                    <span :style="{ fontSize: '13px', color: tk(tokensLight, 'description-color') || tLight['text-secondary'] }">Try adjusting your search or filter criteria.</span>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; text-align: center;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ width: tk(tokensDark, 'icon-size') || '48px', height: tk(tokensDark, 'icon-size') || '48px', color: tDark['text-tertiary'] || '#666' }"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    <strong :style="{ color: tk(tokensDark, 'title-color') || tDark['text-primary'] }">No items found</strong>
                    <span :style="{ fontSize: '13px', color: tk(tokensDark, 'description-color') || tDark['text-secondary'] }">Try adjusting your search or filter criteria.</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── navigation ─────────────────────────────────────────── -->
        <template v-else-if="previewType === 'navigation'">
          <!-- Breadcrumb -->
          <template v-if="props.componentId === 'breadcrumb'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Breadcrumb</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <nav class="arena-breadcrumb" :style="{ fontSize: tk(tokensLight, 'font-size') || '14px', gap: tk(tokensLight, 'gap') || '8px' }">
                    <a :style="{ color: tk(tokensLight, 'color') || tLight['text-link'] }">Home</a>
                    <span :style="{ color: tk(tokensLight, 'separator-color') || tLight['text-tertiary'] }">/</span>
                    <a :style="{ color: tk(tokensLight, 'color') || tLight['text-link'] }">Products</a>
                    <span :style="{ color: tk(tokensLight, 'separator-color') || tLight['text-tertiary'] }">/</span>
                    <span :style="{ color: tk(tokensLight, 'color-current') || tLight['text-primary'] }">Details</span>
                  </nav>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <nav class="arena-breadcrumb" :style="{ fontSize: tk(tokensDark, 'font-size') || '14px', gap: tk(tokensDark, 'gap') || '8px' }">
                    <a :style="{ color: tk(tokensDark, 'color') || tDark['text-link'] }">Home</a>
                    <span :style="{ color: tk(tokensDark, 'separator-color') || tDark['text-tertiary'] }">/</span>
                    <a :style="{ color: tk(tokensDark, 'color') || tDark['text-link'] }">Products</a>
                    <span :style="{ color: tk(tokensDark, 'separator-color') || tDark['text-tertiary'] }">/</span>
                    <span :style="{ color: tk(tokensDark, 'color-current') || tDark['text-primary'] }">Details</span>
                  </nav>
                </div>
              </div>
            </div>
          </template>
          <!-- Pagination -->
          <template v-else-if="props.componentId === 'pagination'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Pagination</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <nav class="arena-pagination" :style="{ gap: tk(tokensLight, 'gap') || '4px', fontSize: tk(tokensLight, 'font-size') || '14px' }">
                    <span class="arena-page-item" :style="pageItemStyle(tokensLight, false, true)">‹</span>
                    <span v-for="p in [1,2,3]" :key="p" class="arena-page-item" :style="pageItemStyle(tokensLight, p === 2)">{{ p }}</span>
                    <span class="arena-page-item" :style="{ color: tk(tokensLight, 'ellipsis-color') || tLight['text-tertiary'] }">…</span>
                    <span class="arena-page-item" :style="pageItemStyle(tokensLight)">8</span>
                    <span class="arena-page-item" :style="pageItemStyle(tokensLight)">›</span>
                  </nav>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <nav class="arena-pagination" :style="{ gap: tk(tokensDark, 'gap') || '4px', fontSize: tk(tokensDark, 'font-size') || '14px' }">
                    <span class="arena-page-item" :style="pageItemStyle(tokensDark, false, true)">‹</span>
                    <span v-for="p in [1,2,3]" :key="p" class="arena-page-item" :style="pageItemStyle(tokensDark, p === 2)">{{ p }}</span>
                    <span class="arena-page-item" :style="{ color: tk(tokensDark, 'ellipsis-color') || tDark['text-tertiary'] }">…</span>
                    <span class="arena-page-item" :style="pageItemStyle(tokensDark)">8</span>
                    <span class="arena-page-item" :style="pageItemStyle(tokensDark)">›</span>
                  </nav>
                </div>
              </div>
            </div>
          </template>
          <!-- Stepper -->
          <template v-else-if="props.componentId === 'stepper'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Stepper</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-stepper">
                    <div v-for="(step, i) in ['Completed', 'Current', 'Upcoming']" :key="step" class="arena-stepper-step">
                      <span class="arena-stepper-dot" :style="stepperDotStyle(tokensLight, i)">{{ i === 0 ? '✓' : i + 1 }}</span>
                      <span :style="{ fontSize: '12px', color: i === 1 ? tLight['text-primary'] : tLight['text-tertiary'] }">{{ step }}</span>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-stepper">
                    <div v-for="(step, i) in ['Completed', 'Current', 'Upcoming']" :key="step" class="arena-stepper-step">
                      <span class="arena-stepper-dot" :style="stepperDotStyle(tokensDark, i)">{{ i === 0 ? '✓' : i + 1 }}</span>
                      <span :style="{ fontSize: '12px', color: i === 1 ? tDark['text-primary'] : tDark['text-tertiary'] }">{{ step }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Accordion -->
          <template v-else-if="props.componentId === 'accordion'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Accordion</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-accordion" :style="{ borderColor: tk(tokensLight, 'border') || tLight['border-primary'] || '#e5e7eb' }">
                    <div v-for="(item, i) in ['Section 1 (expanded)', 'Section 2', 'Section 3']" :key="item" class="arena-accordion-item" :style="{ borderColor: tk(tokensLight, 'border') || tLight['border-primary'] || '#e5e7eb', padding: tk(tokensLight, 'padding') || '12px 16px' }">
                      <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <span :style="{ color: tLight['text-primary'], fontWeight: '500' }">{{ item }}</span>
                        <svg :style="{ width: tk(tokensLight, 'icon-size') || '16px', height: tk(tokensLight, 'icon-size') || '16px', transform: i === 0 ? 'rotate(180deg)' : 'none', color: tLight['text-tertiary'] }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      <div v-if="i === 0" :style="{ fontSize: '13px', color: tLight['text-secondary'], marginTop: '8px' }">Expanded content for the first section with details.</div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-accordion" :style="{ borderColor: tk(tokensDark, 'border') || tDark['border-primary'] || '#333' }">
                    <div v-for="(item, i) in ['Section 1 (expanded)', 'Section 2', 'Section 3']" :key="item" class="arena-accordion-item" :style="{ borderColor: tk(tokensDark, 'border') || tDark['border-primary'] || '#333', padding: tk(tokensDark, 'padding') || '12px 16px' }">
                      <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <span :style="{ color: tDark['text-primary'], fontWeight: '500' }">{{ item }}</span>
                        <svg :style="{ width: tk(tokensDark, 'icon-size') || '16px', height: tk(tokensDark, 'icon-size') || '16px', transform: i === 0 ? 'rotate(180deg)' : 'none', color: tDark['text-tertiary'] }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      <div v-if="i === 0" :style="{ fontSize: '13px', color: tDark['text-secondary'], marginTop: '8px' }">Expanded content for the first section with details.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Segmented Control / Toggle Group / Dropdown Menu — generic nav items -->
          <template v-else>
            <div class="arena-specimen">
              <span class="arena-specimen__label">{{ componentData.label }}</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-nav-items">
                    <span v-for="(item, i) in ['Option A', 'Option B', 'Option C']" :key="item"
                      class="arena-nav-item" :style="navItemStyle(tokensLight, i === 1, i === 2)">{{ item }}</span>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-nav-items">
                    <span v-for="(item, i) in ['Option A', 'Option B', 'Option C']" :key="item"
                      class="arena-nav-item" :style="navItemStyle(tokensDark, i === 1, i === 2)">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── progress-indicator ─────────────────────────────────── -->
        <template v-else-if="previewType === 'progress-indicator'">
          <!-- Progress -->
          <template v-if="props.componentId === 'progress'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Progress Bar</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 12px;">
                    <div v-for="v in [{id: 'default', pct: 65}, {id: 'success', pct: 100}, {id: 'warning', pct: 45}, {id: 'danger', pct: 25}]" :key="v.id">
                      <div class="arena-progress-track" :style="progressTrackStyle(tokensLight, 'md')">
                        <div class="arena-progress-fill" :style="progressFillStyle(tokensLight, v.id, v.pct)"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 12px;">
                    <div v-for="v in [{id: 'default', pct: 65}, {id: 'success', pct: 100}, {id: 'warning', pct: 45}, {id: 'danger', pct: 25}]" :key="v.id">
                      <div class="arena-progress-track" :style="progressTrackStyle(tokensDark, 'md')">
                        <div class="arena-progress-fill" :style="progressFillStyle(tokensDark, v.id, v.pct)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="arena-category-divider"><span class="arena-category-label">Sizes</span></div>
            <div class="arena-specimen">
              <span class="arena-specimen__label">Sizes</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 10px;">
                    <div v-for="s in ['xs','sm','md','lg']" :key="s">
                      <span :style="{ fontSize: '10px', color: tLight['text-tertiary'], textTransform: 'uppercase' }">{{ s }}</span>
                      <div class="arena-progress-track" :style="progressTrackStyle(tokensLight, s)">
                        <div class="arena-progress-fill" :style="progressFillStyle(tokensLight, 'default', 65)"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 10px;">
                    <div v-for="s in ['xs','sm','md','lg']" :key="s">
                      <span :style="{ fontSize: '10px', color: tDark['text-tertiary'], textTransform: 'uppercase' }">{{ s }}</span>
                      <div class="arena-progress-track" :style="progressTrackStyle(tokensDark, s)">
                        <div class="arena-progress-fill" :style="progressFillStyle(tokensDark, 'default', 65)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Spinner -->
          <template v-else-if="props.componentId === 'spinner'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Spinner Sizes</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-btn-row" style="gap: 16px; padding: 12px;">
                    <div v-for="s in ['xs','sm','md','lg','xl']" :key="s" class="arena-spinner" :style="spinnerPreviewStyle(tokensLight, s)"></div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-btn-row" style="gap: 16px; padding: 12px;">
                    <div v-for="s in ['xs','sm','md','lg','xl']" :key="s" class="arena-spinner" :style="spinnerPreviewStyle(tokensDark, s)"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Skeleton -->
          <template v-else-if="props.componentId === 'skeleton'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Skeleton Shapes</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 10px; padding: 8px;">
                    <div :style="skeletonStyle(tokensLight, '100%', tk(tokensLight, 'height-lg') || '20px')"></div>
                    <div :style="skeletonStyle(tokensLight, '75%', tk(tokensLight, 'height-md') || '16px')"></div>
                    <div :style="skeletonStyle(tokensLight, '50%', tk(tokensLight, 'height-sm') || '12px')"></div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <div :style="skeletonStyle(tokensLight, '40px', '40px', true)"></div>
                      <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                        <div :style="skeletonStyle(tokensLight, '60%', '12px')"></div>
                        <div :style="skeletonStyle(tokensLight, '40%', '12px')"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-preview-stack" style="gap: 10px; padding: 8px;">
                    <div :style="skeletonStyle(tokensDark, '100%', tk(tokensDark, 'height-lg') || '20px')"></div>
                    <div :style="skeletonStyle(tokensDark, '75%', tk(tokensDark, 'height-md') || '16px')"></div>
                    <div :style="skeletonStyle(tokensDark, '50%', tk(tokensDark, 'height-sm') || '12px')"></div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <div :style="skeletonStyle(tokensDark, '40px', '40px', true)"></div>
                      <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                        <div :style="skeletonStyle(tokensDark, '60%', '12px')"></div>
                        <div :style="skeletonStyle(tokensDark, '40%', '12px')"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── data-display ───────────────────────────────────────── -->
        <template v-else-if="previewType === 'data-display'">
          <!-- Data Table -->
          <template v-if="props.componentId === 'data-table'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Data Table</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-table-wrap" :style="{ borderRadius: tk(tokensLight, 'radius') || '8px', border: '1px solid ' + (tk(tokensLight, 'border') || tLight['border-primary'] || '#e5e7eb'), overflow: 'hidden' }">
                    <div class="arena-table-header" :style="{ background: tk(tokensLight, 'header-bg') || tLight['background-secondary'], color: tk(tokensLight, 'header-color') || tLight['text-primary'], fontSize: tk(tokensLight, 'header-font-size') || '12px', fontWeight: tk(tokensLight, 'header-font-weight') || '600', letterSpacing: tk(tokensLight, 'header-letter-spacing') || '0.04em', height: tk(tokensLight, 'header-height') || '40px', padding: '0 ' + (tk(tokensLight, 'cell-padding-x') || '12px') }">
                      <span style="flex:2">Name</span><span style="flex:1">Status</span><span style="flex:1;text-align:right">Actions</span>
                    </div>
                    <div v-for="(row, i) in [{n:'Alice',s:'Active'},{n:'Bob',s:'Pending'},{n:'Charlie',s:'Inactive'}]" :key="row.n"
                      class="arena-table-row" :style="{ background: i % 2 === 1 ? (tk(tokensLight, 'row-bg-stripe') || 'transparent') : (tk(tokensLight, 'body-bg') || 'transparent'), color: tk(tokensLight, 'body-color') || tLight['text-primary'], fontSize: tk(tokensLight, 'body-font-size') || '14px', height: tk(tokensLight, 'row-height') || tk(tokensLight, 'row-height-default') || '48px', padding: '0 ' + (tk(tokensLight, 'cell-padding-x') || '12px'), borderBottom: '1px solid ' + (tk(tokensLight, 'row-border-bottom') || tLight['border-secondary'] || '#eee') }">
                      <span style="flex:2">{{ row.n }}</span><span style="flex:1">{{ row.s }}</span><span style="flex:1;text-align:right;opacity:0.5">⋯</span>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-table-wrap" :style="{ borderRadius: tk(tokensDark, 'radius') || '8px', border: '1px solid ' + (tk(tokensDark, 'border') || tDark['border-primary'] || '#333'), overflow: 'hidden' }">
                    <div class="arena-table-header" :style="{ background: tk(tokensDark, 'header-bg') || tDark['background-secondary'], color: tk(tokensDark, 'header-color') || tDark['text-primary'], fontSize: tk(tokensDark, 'header-font-size') || '12px', fontWeight: tk(tokensDark, 'header-font-weight') || '600', letterSpacing: tk(tokensDark, 'header-letter-spacing') || '0.04em', height: tk(tokensDark, 'header-height') || '40px', padding: '0 ' + (tk(tokensDark, 'cell-padding-x') || '12px') }">
                      <span style="flex:2">Name</span><span style="flex:1">Status</span><span style="flex:1;text-align:right">Actions</span>
                    </div>
                    <div v-for="(row, i) in [{n:'Alice',s:'Active'},{n:'Bob',s:'Pending'},{n:'Charlie',s:'Inactive'}]" :key="row.n"
                      class="arena-table-row" :style="{ background: i % 2 === 1 ? (tk(tokensDark, 'row-bg-stripe') || 'transparent') : (tk(tokensDark, 'body-bg') || 'transparent'), color: tk(tokensDark, 'body-color') || tDark['text-primary'], fontSize: tk(tokensDark, 'body-font-size') || '14px', height: tk(tokensDark, 'row-height') || tk(tokensDark, 'row-height-default') || '48px', padding: '0 ' + (tk(tokensDark, 'cell-padding-x') || '12px'), borderBottom: '1px solid ' + (tk(tokensDark, 'row-border-bottom') || tDark['border-secondary'] || '#333') }">
                      <span style="flex:2">{{ row.n }}</span><span style="flex:1">{{ row.s }}</span><span style="flex:1;text-align:right;opacity:0.5">⋯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Timeline -->
          <template v-else-if="props.componentId === 'timeline'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Timeline</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-timeline">
                    <div v-for="(ev, i) in ['Event created', 'Processing started', 'Completed']" :key="ev" class="arena-timeline-item">
                      <div class="arena-timeline-dot" :style="timelineDotStyle(tokensLight, i === 2)"></div>
                      <div class="arena-timeline-line" v-if="i < 2" :style="timelineLineStyle(tokensLight)"></div>
                      <div class="arena-timeline-content">
                        <strong :style="{ color: tLight['text-primary'], fontSize: '13px' }">{{ ev }}</strong>
                        <span :style="{ color: tLight['text-tertiary'], fontSize: '11px' }">{{ ['Jan 1', 'Jan 5', 'Jan 10'][i] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-timeline">
                    <div v-for="(ev, i) in ['Event created', 'Processing started', 'Completed']" :key="ev" class="arena-timeline-item">
                      <div class="arena-timeline-dot" :style="timelineDotStyle(tokensDark, i === 2)"></div>
                      <div class="arena-timeline-line" v-if="i < 2" :style="timelineLineStyle(tokensDark)"></div>
                      <div class="arena-timeline-content">
                        <strong :style="{ color: tDark['text-primary'], fontSize: '13px' }">{{ ev }}</strong>
                        <span :style="{ color: tDark['text-tertiary'], fontSize: '11px' }">{{ ['Jan 1', 'Jan 5', 'Jan 10'][i] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- Sidebar -->
          <template v-else-if="props.componentId === 'sidebar'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Sidebar Navigation</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-sidebar" :style="{ background: tk(tokensLight, 'bg') || tLight['background-secondary'], borderRadius: '8px', padding: '8px' }">
                    <div v-for="(item, i) in ['Dashboard', 'Settings', 'Users', 'Reports']" :key="item"
                      class="arena-sidebar-item" :style="sidebarItemStyle(tokensLight, i === 0)">{{ item }}</div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-sidebar" :style="{ background: tk(tokensDark, 'bg') || tDark['background-secondary'], borderRadius: '8px', padding: '8px' }">
                    <div v-for="(item, i) in ['Dashboard', 'Settings', 'Users', 'Reports']" :key="item"
                      class="arena-sidebar-item" :style="sidebarItemStyle(tokensDark, i === 0)">{{ item }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── form-layout ────────────────────────────────────────── -->
        <template v-else-if="previewType === 'form-layout'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">{{ componentData.label }}</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-form-layout" :style="{ gap: tk(tokensLight, 'gap') || '16px' }">
                  <div class="arena-form-field">
                    <label :style="formLabelStyle(tokensLight)">Label <span :style="{ color: tk(tokensLight, 'required-color') || tLight['text-danger'] || '#dc2626' }">*</span></label>
                    <input type="text" class="arena-input" placeholder="Value" :style="formInputStyle(tokensLight)" readonly />
                    <span :style="formHintStyle(tokensLight)">Hint text for this field</span>
                  </div>
                  <div class="arena-form-field">
                    <label :style="formLabelStyle(tokensLight)">Field with Error</label>
                    <input type="text" class="arena-input" value="Invalid" :style="{ ...formInputStyle(tokensLight), borderColor: tLight['border-danger'] || '#dc2626' }" readonly />
                    <span :style="formErrorStyle(tokensLight)">This field is required</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-form-layout" :style="{ gap: tk(tokensDark, 'gap') || '16px' }">
                  <div class="arena-form-field">
                    <label :style="formLabelStyle(tokensDark)">Label <span :style="{ color: tk(tokensDark, 'required-color') || tDark['text-danger'] || '#f87171' }">*</span></label>
                    <input type="text" class="arena-input" placeholder="Value" :style="formInputStyle(tokensDark)" readonly />
                    <span :style="formHintStyle(tokensDark)">Hint text for this field</span>
                  </div>
                  <div class="arena-form-field">
                    <label :style="formLabelStyle(tokensDark)">Field with Error</label>
                    <input type="text" class="arena-input" value="Invalid" :style="{ ...formInputStyle(tokensDark), borderColor: tDark['border-danger'] || '#f87171' }" readonly />
                    <span :style="formErrorStyle(tokensDark)">This field is required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── layout (shell, toolbar) ────────────────────────────── -->
        <template v-else-if="previewType === 'layout'">
          <template v-if="props.componentId === 'shell'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Shell Layout</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-shell-diagram">
                    <div class="arena-shell-header" :style="{ background: tLight['background-inverse'] || '#002049', color: tLight['text-inverse'] || '#fff' }">Header</div>
                    <div class="arena-shell-body">
                      <div class="arena-shell-sidebar" :style="{ background: tLight['background-secondary'] || '#f3f4f6', color: tLight['text-secondary'] }">Sidebar</div>
                      <div class="arena-shell-content" :style="{ background: tLight['background-base'], color: tLight['text-tertiary'] }">Content</div>
                    </div>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-shell-diagram">
                    <div class="arena-shell-header" :style="{ background: tDark['background-inverse'] || '#fff', color: tDark['text-inverse'] || '#000' }">Header</div>
                    <div class="arena-shell-body">
                      <div class="arena-shell-sidebar" :style="{ background: tDark['background-secondary'] || '#1a1a1a', color: tDark['text-secondary'] }">Sidebar</div>
                      <div class="arena-shell-content" :style="{ background: tDark['background-base'], color: tDark['text-tertiary'] }">Content</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="props.componentId === 'toolbar'">
            <div class="arena-specimen">
              <span class="arena-specimen__label">Toolbar</span>
              <div class="arena-specimen__pair">
                <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                  <div class="arena-toolbar" :style="{ background: tk(tokensLight, 'bg') || tLight['background-secondary'], borderRadius: tk(tokensLight, 'radius') || '8px', padding: tk(tokensLight, 'padding') || '8px 12px', gap: tk(tokensLight, 'gap') || '8px', borderBottom: '1px solid ' + (tLight['border-primary'] || '#e5e7eb') }">
                    <svg v-for="ic in 5" :key="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ width: tk(tokensLight, 'icon-size') || '20px', height: tk(tokensLight, 'icon-size') || '20px', color: tLight['text-secondary'] }"><rect v-if="ic===1" x="3" y="3" width="18" height="18" rx="2"/><line v-if="ic===2" x1="12" y1="5" x2="12" y2="19"/><line v-if="ic===3" x1="5" y1="12" x2="19" y2="12"/><polyline v-if="ic===4" points="6 9 12 15 18 9"/><circle v-if="ic===5" cx="12" cy="12" r="3"/></svg>
                  </div>
                </div>
                <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                  <div class="arena-toolbar" :style="{ background: tk(tokensDark, 'bg') || tDark['background-secondary'], borderRadius: tk(tokensDark, 'radius') || '8px', padding: tk(tokensDark, 'padding') || '8px 12px', gap: tk(tokensDark, 'gap') || '8px', borderBottom: '1px solid ' + (tDark['border-primary'] || '#333') }">
                    <svg v-for="ic in 5" :key="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ width: tk(tokensDark, 'icon-size') || '20px', height: tk(tokensDark, 'icon-size') || '20px', color: tDark['text-secondary'] }"><rect v-if="ic===1" x="3" y="3" width="18" height="18" rx="2"/><line v-if="ic===2" x1="12" y1="5" x2="12" y2="19"/><line v-if="ic===3" x1="5" y1="12" x2="19" y2="12"/><polyline v-if="ic===4" points="6 9 12 15 18 9"/><circle v-if="ic===5" cx="12" cy="12" r="3"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- ─── code (code-snippet) ────────────────────────────────── -->
        <template v-else-if="previewType === 'code'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Code Snippet</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-code-block" :style="codeBlockStyle(tokensLight)">
                  <div class="arena-code-header" :style="codeHeaderStyle(tokensLight)">
                    <span>script.js</span>
                    <span style="opacity: 0.5; font-size: 11px;">Copy</span>
                  </div>
                  <pre class="arena-code-body" :style="codeBodyStyle(tokensLight)"><span :style="{ color: tk(tokensLight, 'keyword-color') || '#8b5cf6' }">const</span> greeting = <span :style="{ color: tk(tokensLight, 'string-color') || '#059669' }">"Hello"</span>;
<span :style="{ color: tk(tokensLight, 'keyword-color') || '#8b5cf6' }">function</span> <span :style="{ color: tk(tokensLight, 'function-color') || '#2563eb' }">greet</span>(name) {
  <span :style="{ color: tk(tokensLight, 'keyword-color') || '#8b5cf6' }">return</span> <span :style="{ color: tk(tokensLight, 'string-color') || '#059669' }">`${greeting}, ${name}!`</span>;
}</pre>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-code-block" :style="codeBlockStyle(tokensDark)">
                  <div class="arena-code-header" :style="codeHeaderStyle(tokensDark)">
                    <span>script.js</span>
                    <span style="opacity: 0.5; font-size: 11px;">Copy</span>
                  </div>
                  <pre class="arena-code-body" :style="codeBodyStyle(tokensDark)"><span :style="{ color: tk(tokensDark, 'keyword-color') || '#c084fc' }">const</span> greeting = <span :style="{ color: tk(tokensDark, 'string-color') || '#34d399' }">"Hello"</span>;
<span :style="{ color: tk(tokensDark, 'keyword-color') || '#c084fc' }">function</span> <span :style="{ color: tk(tokensDark, 'function-color') || '#60a5fa' }">greet</span>(name) {
  <span :style="{ color: tk(tokensDark, 'keyword-color') || '#c084fc' }">return</span> <span :style="{ color: tk(tokensDark, 'string-color') || '#34d399' }">`${greeting}, ${name}!`</span>;
}</pre>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── icon-set ───────────────────────────────────────────── -->
        <template v-else-if="previewType === 'icon-set'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Icon Grid</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-icon-grid">
                  <div v-for="s in ['16', '20', '24', '32']" :key="s" class="arena-icon-cell" :style="{ color: tk(tokensLight, 'color') || tLight['text-primary'] }">
                    <svg :width="s" :height="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style="font-size: 10px; opacity: 0.5;">{{ s }}px</span>
                  </div>
                  <div v-for="s in ['16', '20', '24', '32']" :key="'h-'+s" class="arena-icon-cell" :style="{ color: tk(tokensLight, 'color') || tLight['text-primary'] }">
                    <svg :width="s" :height="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span style="font-size: 10px; opacity: 0.5;">{{ s }}px</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-icon-grid">
                  <div v-for="s in ['16', '20', '24', '32']" :key="s" class="arena-icon-cell" :style="{ color: tk(tokensDark, 'color') || tDark['text-primary'] }">
                    <svg :width="s" :height="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style="font-size: 10px; opacity: 0.5;">{{ s }}px</span>
                  </div>
                  <div v-for="s in ['16', '20', '24', '32']" :key="'h-'+s" class="arena-icon-cell" :style="{ color: tk(tokensDark, 'color') || tDark['text-primary'] }">
                    <svg :width="s" :height="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span style="font-size: 10px; opacity: 0.5;">{{ s }}px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Layout Primitive: Schematic diagram of layout composition -->
        <template v-else-if="previewType === 'layout-primitive'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">{{ componentData.label }} — Token-Übersicht</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-layout-diagram" :style="{ color: tLight['text-primary'] }">
                  <!-- Container diagram -->
                  <template v-if="componentId === 'container'">
                    <div class="arena-layout-box" :style="{ border: '2px dashed ' + (tLight['border-primary'] || '#ccc'), padding: '12px', borderRadius: '6px' }">
                      <span class="arena-layout-label">Section</span>
                      <div class="arena-layout-box" :style="{ border: '2px solid ' + (tLight['interactive-default'] || '#0077cc'), padding: '8px 16px', borderRadius: '4px', background: tLight['background-secondary'] || '#f5f5f5' }">
                        <span class="arena-layout-label" :style="{ color: tLight['interactive-default'] || '#0077cc' }">Container (max-width: {{ tk(tokensLight, 'max-width') || '1200px' }})</span>
                        <div class="arena-layout-content" :style="{ background: tLight['background-base'], padding: '8px', borderRadius: '3px' }">
                          <span style="font-size: 11px; opacity: 0.6;">padding-inline: {{ tk(tokensLight, 'padding-inline') || 'clamp(16px, 3.5vw, 48px)' }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- Grid diagram -->
                  <template v-else-if="componentId === 'grid'">
                    <div class="arena-grid-demo" :style="{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px' }">
                      <div v-for="i in 12" :key="i" :style="{ background: tLight['interactive-default'] || '#0077cc', height: '28px', borderRadius: '2px', opacity: 0.2 + (i % 3) * 0.15 }"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.5; margin-top: 4px;">
                      <span>columns: {{ tk(tokensLight, 'columns') || '12' }}</span>
                      <span>gap: {{ tk(tokensLight, 'gap') || 'clamp(12px, 1.5vw, 24px)' }}</span>
                    </div>
                  </template>
                  <!-- Section diagram -->
                  <template v-else-if="componentId === 'section'">
                    <div class="arena-layout-box" :style="{ border: '2px solid ' + (tLight['interactive-default'] || '#0077cc'), borderRadius: '6px', background: tk(tokensLight, 'bg') || tLight['background-base'] }">
                      <div style="text-align: center; padding: 4px 0; font-size: 10px; opacity: 0.5;">↕ padding-block: {{ tk(tokensLight, 'padding-block') || 'clamp(2rem, 4vw, 6rem)' }}</div>
                      <div :style="{ padding: '12px', background: tLight['background-secondary'] || '#f5f5f5', borderRadius: '3px', margin: '0 8px' }">
                        <span class="arena-layout-label">Container + Grid + Content</span>
                      </div>
                      <div style="text-align: center; padding: 4px 0; font-size: 10px; opacity: 0.5;">↕ padding-block</div>
                    </div>
                  </template>
                  <!-- Spacing conceptual -->
                  <template v-else-if="componentId === 'spacing'">
                    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
                      <div v-for="role in ['section', 'component', 'element', 'gutter', 'inline', 'stack', 'inset']" :key="role" style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 80px; text-align: right; opacity: 0.6;">{{ role }}</span>
                        <div :style="{ width: role === 'section' ? '100%' : role === 'component' ? '60%' : '30%', height: '8px', background: tLight['interactive-default'] || '#0077cc', borderRadius: '2px', opacity: 0.4 }"></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-layout-diagram" :style="{ color: tDark['text-primary'] }">
                  <template v-if="componentId === 'container'">
                    <div class="arena-layout-box" :style="{ border: '2px dashed ' + (tDark['border-primary'] || '#555'), padding: '12px', borderRadius: '6px' }">
                      <span class="arena-layout-label">Section</span>
                      <div class="arena-layout-box" :style="{ border: '2px solid ' + (tDark['interactive-default'] || '#009fe3'), padding: '8px 16px', borderRadius: '4px', background: tDark['background-secondary'] || '#1a1a1a' }">
                        <span class="arena-layout-label" :style="{ color: tDark['interactive-default'] || '#009fe3' }">Container</span>
                        <div class="arena-layout-content" :style="{ background: tDark['background-base'], padding: '8px', borderRadius: '3px' }">
                          <span style="font-size: 11px; opacity: 0.6;">padding-inline</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="componentId === 'grid'">
                    <div class="arena-grid-demo" :style="{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px' }">
                      <div v-for="i in 12" :key="i" :style="{ background: tDark['interactive-default'] || '#009fe3', height: '28px', borderRadius: '2px', opacity: 0.2 + (i % 3) * 0.15 }"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.5; margin-top: 4px;">
                      <span>columns: 12</span>
                      <span>gap: clamp(12px, 1.5vw, 24px)</span>
                    </div>
                  </template>
                  <template v-else-if="componentId === 'section'">
                    <div class="arena-layout-box" :style="{ border: '2px solid ' + (tDark['interactive-default'] || '#009fe3'), borderRadius: '6px', background: tk(tokensDark, 'bg') || tDark['background-base'] }">
                      <div style="text-align: center; padding: 4px 0; font-size: 10px; opacity: 0.5;">↕ padding-block</div>
                      <div :style="{ padding: '12px', background: tDark['background-secondary'] || '#1a1a1a', borderRadius: '3px', margin: '0 8px' }">
                        <span class="arena-layout-label">Container + Grid + Content</span>
                      </div>
                      <div style="text-align: center; padding: 4px 0; font-size: 10px; opacity: 0.5;">↕ padding-block</div>
                    </div>
                  </template>
                  <template v-else-if="componentId === 'spacing'">
                    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
                      <div v-for="role in ['section', 'component', 'element', 'gutter', 'inline', 'stack', 'inset']" :key="role" style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 80px; text-align: right; opacity: 0.6;">{{ role }}</span>
                        <div :style="{ width: role === 'section' ? '100%' : role === 'component' ? '60%' : '30%', height: '8px', background: tDark['interactive-default'] || '#009fe3', borderRadius: '2px', opacity: 0.4 }"></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </template>

    <!-- Fallback Placeholder -->
    <div v-else class="arena-placeholder">
      Vorschau für {{ componentData.label }} wird bald verfügbar.
    </div>

  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()

const componentData = computed(() => {
  return componentTokenGroups.find(g => g.id === props.componentId) || null
})

const arenaConfig = computed(() => componentData.value?.arenaConfig || null)

const specimens = computed(() => arenaConfig.value?.specimens || [])

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
function resolveTokens(semanticMap, useDarkDefaults = false) {
  const resolved = {}
  if (!componentData.value) return resolved
  for (const token of componentData.value.tokens) {
    const override = store.currentComponentOverrides.value[token.id]
    if (override !== undefined) { resolved[token.id] = override; continue }
    if (token.ref) { resolved[token.id] = semanticMap[token.ref] || token.default || ''; continue }
    if (useDarkDefaults && token.darkDefault) { resolved[token.id] = token.darkDefault; continue }
    resolved[token.id] = token.default || ''
  }
  return resolved
}

const tokensLight = computed(() => resolveTokens(tLight.value, false))
const tokensDark = computed(() => resolveTokens(tDark.value, true))

// ---------------------------------------------------------------------------
// Generic Preview Config (47 Komponenten ohne eigene Arena)
// ---------------------------------------------------------------------------
const PREVIEW_CONFIG = {
  // form-input (6)
  input: 'form-input', select: 'form-input', textarea: 'form-input',
  search: 'form-input', 'otp-input': 'form-input', 'file-upload': 'form-input',
  // inline-element (4)
  tag: 'inline-element', chip: 'inline-element', kbd: 'inline-element', divider: 'inline-element',
  // control (5)
  checkbox: 'control', radio: 'control', switch: 'control', slider: 'control', rating: 'control',
  // surface (8)
  alert: 'surface', toast: 'surface', banner: 'surface', popover: 'surface',
  dialog: 'surface', tooltip: 'surface', 'validation-summary': 'surface', 'empty-state': 'surface',
  // navigation (7)
  breadcrumb: 'navigation', pagination: 'navigation', stepper: 'navigation',
  accordion: 'navigation', 'segmented-control': 'navigation', 'toggle-group': 'navigation',
  'dropdown-menu': 'navigation',
  // progress-indicator (3)
  progress: 'progress-indicator', spinner: 'progress-indicator', skeleton: 'progress-indicator',
  // data-display (3)
  'data-table': 'data-display', timeline: 'data-display', sidebar: 'data-display',
  // form-layout (7)
  form: 'form-layout', 'form-field': 'form-layout', 'form-label': 'form-layout',
  'form-error': 'form-layout', 'form-hint': 'form-layout', 'input-group': 'form-layout',
  fieldset: 'form-layout',
  // layout (2)
  shell: 'layout', toolbar: 'layout',
  // code (1)
  'code-snippet': 'code',
  // icon-set (1)
  icon: 'icon-set',
  // layout-primitives (3)
  container: 'layout-primitive', grid: 'layout-primitive', section: 'layout-primitive',
  // spacing (foundation, conceptual)
  spacing: 'layout-primitive'
}

const previewType = computed(() => PREVIEW_CONFIG[props.componentId] || null)

// Token-Shorthand: tk(tokens, 'bg') → tokens['nc-{componentId}-bg']
function tk(tokens, prop) {
  return tokens[`nc-${props.componentId}-${prop}`] || ''
}

// ---------------------------------------------------------------------------
// Generic Preview Style Builders
// ---------------------------------------------------------------------------

// --- form-input ---
function inputStyle(tokens, size) {
  const cid = props.componentId
  const t = (p) => tokens[`nc-${cid}-${p}`] || tokens[`nc-input-${p}`] || ''
  return {
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
    height: t(`height-${size}`) || { sm: '32px', md: '40px', lg: '48px' }[size],
    padding: `${t(`padding-y-${size}`) || '8px'} ${t(`padding-x-${size}`) || '12px'}`,
    fontSize: t(`font-size-${size}`) || { sm: '13px', md: '14px', lg: '16px' }[size],
    background: t('bg') || 'transparent',
    color: t('color') || tLight.value['text-primary'],
    borderColor: t('border') || tLight.value['border-primary'] || '#ccc',
    borderWidth: t('border-width') || '1px',
    borderStyle: 'solid',
    borderRadius: t('radius') || '6px'
  }
}

// --- inline-element (tag/chip) ---
function tagStyle(tokens, variant, size) {
  const cid = props.componentId
  const t = (p) => tokens[`nc-${cid}-${p}`] || ''
  const sizeH = size ? (t(`height-${size}`) || { sm: '24px', md: '28px', lg: '32px' }[size]) : (t('height-md') || '28px')
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    height: sizeH,
    padding: `${t('padding-y') || '2px'} ${t('padding-x') || '8px'}`,
    fontSize: size ? (t(`font-size-${size}`) || t('font-size') || '12px') : (t('font-size') || '12px'),
    fontWeight: t('font-weight') || '500',
    borderRadius: t('radius') || '4px',
    background: t(`${variant}-bg`) || 'transparent',
    color: t(`${variant}-color`) || 'currentColor',
    border: `1px solid ${t(`${variant}-border`) || 'transparent'}`
  }
}

// --- kbd ---
function kbdStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: t('min-width') || '28px', height: t('height') || '28px',
    padding: `${t('padding-y') || '2px'} ${t('padding-x') || '6px'}`,
    fontSize: t('font-size') || '12px', fontFamily: 'monospace',
    background: t('bg') || tLight.value['background-secondary'] || '#f3f4f6',
    color: t('color') || 'currentColor',
    border: `1px solid ${t('border') || tLight.value['border-primary'] || '#ddd'}`,
    borderRadius: t('radius') || '4px',
    boxShadow: '0 1px 0 1px rgba(0,0,0,0.05)'
  }
}

// --- divider ---
function dividerStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    border: 'none', width: '100%',
    borderTop: `${t('width') || '1px'} solid ${t('color') || tLight.value['border-primary'] || '#e5e7eb'}`,
    margin: 0
  }
}
function dividerVertStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: t('width') || '1px',
    background: t('color') || tLight.value['border-primary'] || '#e5e7eb',
    alignSelf: 'stretch'
  }
}

// --- control: checkbox/radio ---
function checkboxStyle(tokens, checked, disabled, isRadio) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const size = t('size-md') || '18px'
  return {
    width: size, height: size, flexShrink: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: isRadio ? '50%' : (t('radius') || '4px'),
    borderWidth: t('border-width') || '2px', borderStyle: 'solid',
    borderColor: checked ? (t('border-checked') || t('bg-checked') || '#002049') : (disabled ? (t('disabled-border') || '#ccc') : (t('border') || '#ccc')),
    background: checked ? (t('bg-checked') || '#002049') : (disabled ? (t('disabled-bg') || 'transparent') : (t('bg') || 'transparent')),
    transition: 'all 0.15s ease'
  }
}

// --- switch ---
function switchTrackStyle(tokens, checked, disabled) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: t('width') || '36px', height: t('height') || '20px',
    borderRadius: t('radius') || '999px',
    background: checked ? (t('bg-checked') || '#002049') : (disabled ? (t('disabled-bg') || '#ccc') : (t('bg') || '#ccc')),
    position: 'relative', display: 'inline-flex', alignItems: 'center',
    transition: 'background 0.15s ease', flexShrink: 0, cursor: 'pointer'
  }
}
function switchThumbStyle(tokens, checked) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const thumbSize = t('thumb-size') || '16px'
  const offset = t('thumb-offset') || '2px'
  return {
    width: thumbSize, height: thumbSize, borderRadius: '50%',
    background: checked ? (t('thumb-color') || '#fff') : (t('disabled-thumb') || t('thumb-color') || '#fff'),
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    left: checked ? `calc(100% - ${thumbSize} - ${offset})` : offset,
    transition: 'left 0.15s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  }
}

// --- slider ---
function sliderTrackStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: '100%', height: t('track-height') || '6px', position: 'relative',
    background: t('track-bg') || '#e5e7eb',
    borderRadius: t('track-radius') || '999px'
  }
}
function sliderFillStyle(tokens, pct) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: `${pct}%`,
    background: t('track-bg-active') || '#002049',
    borderRadius: 'inherit'
  }
}
function sliderThumbStyle(tokens, pct) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const size = t('thumb-size') || '16px'
  return {
    position: 'absolute', top: '50%', left: `${pct}%`,
    transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%',
    background: t('thumb-bg') || '#fff',
    border: `${t('thumb-border-width') || '2px'} solid ${t('thumb-border') || '#002049'}`,
    boxShadow: t('thumb-shadow') || '0 1px 3px rgba(0,0,0,0.15)'
  }
}

// --- surface variants ---
const surfaceVariants = computed(() => {
  if (props.componentId === 'alert') return [
    { id: 'info', label: 'Info' }, { id: 'success', label: 'Success' },
    { id: 'warning', label: 'Warning' }, { id: 'danger', label: 'Danger' }
  ]
  return [
    { id: 'info', label: 'Info' }, { id: 'success', label: 'Success' },
    { id: 'warning', label: 'Warning' }, { id: 'error', label: 'Error' }
  ]
})

function surfaceStyle(tokens, variant) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    display: 'flex', gap: t('gap') || '10px', alignItems: 'flex-start',
    padding: t('padding') || '12px 16px',
    borderRadius: t('radius') || '8px',
    background: t(`${variant}-bg`) || 'transparent',
    color: t(`${variant}-color`) || 'currentColor',
    border: `${t('border-width') || '1px'} solid ${t(`${variant}-border`) || 'transparent'}`
  }
}

// --- dialog ---
function dialogStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    display: 'flex', flexDirection: 'column',
    gap: t('section-gap') || t('header-gap') || '12px',
    padding: t('padding') || '24px',
    borderRadius: t('radius') || '12px',
    background: t('bg') || tokens[`nc-dialog-bg`] || tLight.value['surface-elevated'] || '#fff',
    boxShadow: t('shadow') || '0 4px 24px rgba(0,0,0,0.15)',
    maxWidth: t('max-width') || '360px'
  }
}

// --- tooltip ---
function tooltipStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    padding: t('padding') || '6px 10px',
    borderRadius: t('radius') || '6px',
    background: t('bg') || '#1a1a1a',
    color: t('color') || '#fff',
    fontSize: t('font-size') || '12px',
    boxShadow: t('shadow') || '0 2px 8px rgba(0,0,0,0.2)',
    maxWidth: t('max-width') || '240px'
  }
}

// --- popover ---
function popoverStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: t('padding') || '16px',
    borderRadius: t('radius') || '10px',
    background: t('bg') || tLight.value['surface-elevated'] || '#fff',
    boxShadow: t('shadow') || '0 4px 16px rgba(0,0,0,0.12)',
    maxWidth: '260px',
    border: `1px solid ${t('border') || tLight.value['border-primary'] || '#e5e7eb'}`
  }
}

// --- navigation: pagination ---
function pageItemStyle(tokens, isActive, isDisabled) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: t('item-size') || '32px', height: t('item-size') || '32px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: t('item-radius') || '6px',
    background: isActive ? (t('item-bg-active') || '#002049') : (t('item-bg') || 'transparent'),
    color: isActive ? (t('item-color-active') || '#fff') : (isDisabled ? (t('nav-color-disabled') || '#ccc') : (t('item-color') || t('color') || 'currentColor')),
    fontWeight: isActive ? (t('item-font-weight') || '600') : 'normal',
    cursor: isDisabled ? 'not-allowed' : 'pointer'
  }
}

// --- navigation: stepper ---
function stepperDotStyle(tokens, stepIndex) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const isComplete = stepIndex === 0
  const isCurrent = stepIndex === 1
  return {
    width: t('dot-size') || '28px', height: t('dot-size') || '28px',
    borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '600', flexShrink: 0,
    background: isComplete ? (t('completed-bg') || tLight.value['interactive-default'] || '#002049') : (isCurrent ? (t('active-bg') || tLight.value['interactive-default'] || '#002049') : (t('bg') || tLight.value['background-secondary'] || '#e5e7eb')),
    color: (isComplete || isCurrent) ? '#fff' : (t('color') || tLight.value['text-tertiary'] || '#999'),
    border: isCurrent ? `2px solid ${t('active-border') || tLight.value['interactive-default'] || '#002049'}` : 'none'
  }
}

// --- navigation: generic nav items ---
function navItemStyle(tokens, isActive, isDisabled) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    padding: t('padding') || '8px 16px',
    borderRadius: t('radius') || '6px',
    background: isActive ? (t('active-bg') || t('bg-active') || tLight.value['interactive-default'] || '#002049') : (t('bg') || 'transparent'),
    color: isActive ? (t('active-color') || t('color-active') || '#fff') : (isDisabled ? (t('disabled-color') || '#999') : (t('color') || 'currentColor')),
    fontWeight: isActive ? '600' : 'normal',
    fontSize: t('font-size') || '14px',
    opacity: isDisabled ? '0.5' : '1',
    cursor: isDisabled ? 'not-allowed' : 'pointer'
  }
}

// --- progress ---
function progressTrackStyle(tokens, size) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: '100%',
    height: t(`height-${size}`) || { xs: '4px', sm: '6px', md: '8px', lg: '12px' }[size] || '8px',
    background: t('bg') || '#e5e7eb',
    borderRadius: t('radius') || '999px',
    overflow: 'hidden'
  }
}
function progressFillStyle(tokens, variant, pct) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const fill = variant === 'default' ? (t('fill') || tLight.value['interactive-default'] || '#002049')
    : (t(`fill-${variant}`) || t('fill') || '#002049')
  return {
    width: `${pct}%`, height: '100%',
    background: fill, borderRadius: 'inherit',
    transition: 'width 0.3s ease'
  }
}

// --- spinner ---
function spinnerPreviewStyle(tokens, size) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  const s = t(`size-${size}`) || { xs: '16px', sm: '20px', md: '28px', lg: '36px', xl: '48px' }[size]
  const bw = t(`border-width-${size}`) || { xs: '2px', sm: '2px', md: '3px', lg: '3px', xl: '4px' }[size]
  return {
    width: s, height: s,
    borderRadius: '50%', borderStyle: 'solid',
    borderWidth: bw,
    borderColor: t('track-color') || '#e5e7eb',
    borderTopColor: t('color') || tLight.value['interactive-default'] || '#002049',
    animation: 'arena-spin 0.8s linear infinite'
  }
}

// --- skeleton ---
function skeletonStyle(tokens, w, h, circle) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: w, height: h,
    borderRadius: circle ? (t('radius-circle') || '50%') : (t('radius') || '4px'),
    background: t('bg') || '#e5e7eb',
    animation: `arena-skeleton-shimmer ${t('duration') || '1.5s'} ease infinite`
  }
}

// --- data-display: timeline ---
function timelineDotStyle(tokens, isLast) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: t('dot-size') || '12px', height: t('dot-size') || '12px',
    borderRadius: '50%', flexShrink: 0,
    background: isLast ? (t('dot-color-active') || t('active-color') || tLight.value['interactive-default'] || '#002049') : (t('dot-color') || tLight.value['border-primary'] || '#ccc'),
    zIndex: 1
  }
}
function timelineLineStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    width: t('line-width') || '2px',
    background: t('line-color') || tLight.value['border-secondary'] || '#e5e7eb',
    position: 'absolute', top: '14px', bottom: '-22px', left: '5px'
  }
}

// --- data-display: sidebar ---
function sidebarItemStyle(tokens, isActive) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    padding: t('item-padding') || '8px 12px',
    borderRadius: t('item-radius') || '6px',
    fontSize: t('item-font-size') || '13px',
    background: isActive ? (t('item-bg-active') || tLight.value['background-active'] || 'rgba(0,0,0,0.06)') : 'transparent',
    color: isActive ? (t('item-color-active') || tLight.value['text-primary']) : (t('item-color') || tLight.value['text-secondary']),
    fontWeight: isActive ? '600' : 'normal',
    cursor: 'pointer'
  }
}

// --- form-layout ---
function formLabelStyle(tokens) {
  // Greife auf form-label Tokens zu, unabhaengig vom aktuellen componentId
  const t = (p) => tokens[`nc-form-label-${p}`] || tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    fontSize: t('font-size') || '14px',
    fontWeight: t('font-weight') || '500',
    color: t('color') || tLight.value['text-primary'],
    display: 'flex', gap: t('gap') || '4px'
  }
}
function formInputStyle(tokens) {
  const t = (p) => tokens[`nc-input-${p}`] || ''
  return {
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
    height: t('height-md') || '40px',
    padding: `${t('padding-y-md') || '8px'} ${t('padding-x-md') || '12px'}`,
    fontSize: t('font-size-md') || '14px',
    background: t('bg') || 'transparent',
    color: t('color') || tLight.value['text-primary'],
    borderColor: t('border') || tLight.value['border-primary'] || '#ccc',
    borderWidth: t('border-width') || '1px', borderStyle: 'solid',
    borderRadius: t('radius') || '6px'
  }
}
function formHintStyle(tokens) {
  const t = (p) => tokens[`nc-form-hint-${p}`] || tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    fontSize: t('font-size') || '12px',
    color: t('color') || tLight.value['text-tertiary']
  }
}
function formErrorStyle(tokens) {
  const t = (p) => tokens[`nc-form-error-${p}`] || tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    fontSize: t('font-size') || '12px',
    fontWeight: t('font-weight') || '500',
    color: t('color') || tLight.value['text-danger'] || '#dc2626'
  }
}

// --- code ---
function codeBlockStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    borderRadius: t('radius') || '8px',
    overflow: 'hidden',
    border: `1px solid ${t('border') || tLight.value['border-primary'] || '#e5e7eb'}`
  }
}
function codeHeaderStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: t('header-padding') || '8px 12px',
    background: t('header-bg') || tLight.value['background-secondary'] || '#f3f4f6',
    color: t('header-color') || tLight.value['text-secondary'],
    fontSize: '12px', fontWeight: '500',
    borderBottom: `1px solid ${t('border') || tLight.value['border-primary'] || '#e5e7eb'}`
  }
}
function codeBodyStyle(tokens) {
  const t = (p) => tokens[`nc-${props.componentId}-${p}`] || ''
  return {
    margin: 0, padding: t('padding') || '12px 16px',
    background: t('bg') || tLight.value['background-base'] || '#fff',
    color: t('color') || tLight.value['text-primary'],
    fontSize: t('font-size') || '13px',
    fontFamily: 'monospace', lineHeight: '1.6',
    overflow: 'auto'
  }
}

// ---------------------------------------------------------------------------
// Variant Categories
// ---------------------------------------------------------------------------
const CATEGORY_LABELS = { main: 'Main Variants', supporting: 'Supporting', system: 'System' }

const variantCategories = computed(() => {
  if (!arenaConfig.value) return []
  const groups = []
  let lastCat = null
  for (const v of arenaConfig.value.variants) {
    const cat = v.category || 'main'
    if (cat !== lastCat) {
      groups.push({ id: cat, label: CATEGORY_LABELS[cat] || cat, variants: [] })
      lastCat = cat
    }
    groups[groups.length - 1].variants.push(v)
  }
  return groups
})

// ---------------------------------------------------------------------------
// Interactive State Tracking
// ---------------------------------------------------------------------------
const btnStates = reactive({})

function bk(theme, variant, size) {
  return `${theme}-${variant}-${size}`
}

function getState(key) {
  return btnStates[key] || null
}

function iEvents(key) {
  return {
    mouseenter() { btnStates[key] = { ...btnStates[key], hover: true } },
    mouseleave() { btnStates[key] = { ...btnStates[key], hover: false, active: false } },
    mousedown() { btnStates[key] = { ...btnStates[key], active: true } },
    mouseup() { btnStates[key] = { ...btnStates[key], active: false } },
    focus() { btnStates[key] = { ...btnStates[key], focus: true } },
    blur() { btnStates[key] = { ...btnStates[key], focus: false } }
  }
}

// Focus ring style (matches @include focus-ring from the design system)
const FOCUS_RING = {
  outline: '2px solid currentColor',
  outlineOffset: '3px'
}

// ---------------------------------------------------------------------------
// Inline Style Builders
// ---------------------------------------------------------------------------
function resolvePattern(tokens, pattern, variant, size) {
  return tokens[pattern.replace('{variant}', variant).replace('{size}', size)] || ''
}

function buildStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const p = arenaConfig.value.tokenPattern
  return {
    background: resolvePattern(tokens, p.background, variantId, sizeId),
    color: resolvePattern(tokens, p.color, variantId, sizeId),
    borderColor: resolvePattern(tokens, p.borderColor, variantId, sizeId) || 'transparent',
    minHeight: resolvePattern(tokens, p.height, variantId, sizeId),
    borderRadius: resolvePattern(tokens, p.radius, variantId, sizeId),
    fontSize: resolvePattern(tokens, p.fontSize, variantId, sizeId),
    paddingInline: resolvePattern(tokens, p.paddingX, variantId, sizeId),
    paddingBlock: resolvePattern(tokens, p.paddingY, variantId, sizeId),
    fontWeight: tokens['nc-button-font-weight'] || '600',
    borderWidth: sizeId === 'lg' ? '2px' : '1px',
    borderStyle: 'solid',
    transition: 'background 0.15s ease, box-shadow 0.15s ease, outline-color 0.15s ease'
  }
}

// Interactive style — applies hover/active/focus based on tracked state
function iStyle(tokens, variantId, sizeId, btnKey) {
  const base = buildStyle(tokens, variantId, sizeId)
  const s = getState(btnKey)
  if (!s || !arenaConfig.value) return base
  const p = arenaConfig.value.tokenPattern
  if (s.active) {
    base.background = resolvePattern(tokens, p.backgroundActive, variantId, sizeId) || base.background
  } else if (s.hover) {
    base.background = resolvePattern(tokens, p.backgroundHover, variantId, sizeId) || base.background
  }
  if (s.focus) {
    Object.assign(base, FOCUS_RING)
  }
  return base
}

function hoverStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, variantId, sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.backgroundHover, variantId, sizeId) || base.background
  return base
}

function activeStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, variantId, sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.backgroundActive, variantId, sizeId) || base.background
  return base
}

function disabledStyle(tokens) {
  return {
    background: tokens['nc-button-disabled-bg'] || '',
    color: tokens['nc-button-disabled-color'] || '',
    borderColor: tokens['nc-button-disabled-border'] || 'transparent',
    minHeight: tokens['nc-button-height-md'] || '40px',
    borderRadius: tokens['nc-button-radius-md'] || '6px',
    fontSize: tokens['nc-button-font-size-md'] || '16px',
    paddingInline: tokens['nc-button-padding-x-md'] || '20px',
    paddingBlock: tokens['nc-button-padding-y-md'] || '12px',
    fontWeight: tokens['nc-button-font-weight'] || '600',
    borderWidth: '1px',
    borderStyle: 'solid',
    opacity: '0.5',
    cursor: 'not-allowed'
  }
}

// ---------------------------------------------------------------------------
// Pattern Specimen Helpers
// ---------------------------------------------------------------------------
const ICON_SIZES = { xs: '14px', sm: '16px', md: '18px', lg: '20px' }

function iconSize(sizeId) {
  return ICON_SIZES[sizeId] || '18px'
}

function iconOnlyStyle(tokens, variantId, sizeId) {
  const base = buildStyle(tokens, variantId, sizeId)
  const h = base.minHeight || '40px'
  base.width = h
  base.minWidth = h
  base.paddingInline = '0'
  base.paddingBlock = '0'
  return base
}

function iIconOnlyStyle(tokens, variantId, sizeId, btnKey) {
  const base = iStyle(tokens, variantId, sizeId, btnKey)
  const h = base.minHeight || '40px'
  base.width = h
  base.minWidth = h
  base.paddingInline = '0'
  base.paddingBlock = '0'
  return base
}

function loadingStyle(tokens, variantId, sizeId) {
  const base = buildStyle(tokens, variantId, sizeId)
  base.position = 'relative'
  base.pointerEvents = 'none'
  return base
}

function spinnerStyle(tokens, variantId) {
  if (!arenaConfig.value) return {}
  const p = arenaConfig.value.tokenPattern
  return {
    width: tokens['nc-button-spinner-size'] || '20px',
    height: tokens['nc-button-spinner-size'] || '20px',
    borderWidth: tokens['nc-button-spinner-border-width'] || '2px',
    borderColor: resolvePattern(tokens, p.color, variantId, 'md') || 'currentColor'
  }
}

function togglePressedStyle(tokens, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, 'outline', sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.background, 'primary', sizeId)
  base.color = resolvePattern(tokens, p.color, 'primary', sizeId)
  base.borderColor = resolvePattern(tokens, p.background, 'primary', sizeId)
  return base
}

function iTogglePressedStyle(tokens, sizeId, btnKey) {
  const base = togglePressedStyle(tokens, sizeId)
  const s = getState(btnKey)
  if (!s || !arenaConfig.value) return base
  const p = arenaConfig.value.tokenPattern
  if (s.active) {
    base.background = resolvePattern(tokens, p.backgroundActive, 'primary', sizeId) || base.background
  } else if (s.hover) {
    base.background = resolvePattern(tokens, p.backgroundHover, 'primary', sizeId) || base.background
  }
  if (s.focus) {
    Object.assign(base, FOCUS_RING)
  }
  return base
}

function groupBtnStyle(tokens, variantId, sizeId, position) {
  const base = buildStyle(tokens, variantId, sizeId)
  const r = base.borderRadius || '4px'
  if (position === 'first') {
    base.borderRadius = `${r} 0 0 ${r}`
    base.marginRight = '-1px'
  } else if (position === 'middle') {
    base.borderRadius = '0'
    base.marginRight = '-1px'
  } else {
    base.borderRadius = `0 ${r} ${r} 0`
  }
  return base
}

function iGroupBtnStyle(tokens, variantId, sizeId, position, btnKey) {
  const base = iStyle(tokens, variantId, sizeId, btnKey)
  const r = tokens[arenaConfig.value?.tokenPattern?.radius?.replace('{size}', sizeId)] || '4px'
  if (position === 'first') {
    base.borderRadius = `${r} 0 0 ${r}`
    base.marginRight = '-1px'
  } else if (position === 'middle') {
    base.borderRadius = '0'
    base.marginRight = '-1px'
  } else {
    base.borderRadius = `0 ${r} ${r} 0`
  }
  if (getState(btnKey)?.hover || getState(btnKey)?.active) {
    base.zIndex = '1'
    base.position = 'relative'
  }
  return base
}

// ---------------------------------------------------------------------------
// Pulse bei Token-Aenderungen
// ---------------------------------------------------------------------------
const pulsingVariants = ref(new Set())

function triggerPulse(ids) {
  for (const id of ids) pulsingVariants.value.add(id)
  pulsingVariants.value = new Set(pulsingVariants.value)
  setTimeout(() => {
    pulsingVariants.value = new Set()
  }, 900)
}

watch(
  () => JSON.stringify(store.currentComponentOverrides.value),
  (next, prev) => {
    if (!prev || !arenaConfig.value) return
    try {
      const oldObj = JSON.parse(prev)
      const newObj = JSON.parse(next)
      const changed = new Set()
      for (const key of Object.keys(newObj)) {
        if (oldObj[key] !== newObj[key] && key.startsWith('nc-button-')) {
          // Finde betroffene Variante
          for (const v of arenaConfig.value.variants) {
            if (key.includes(`-${v.id}-`)) { changed.add(v.id); break }
          }
        }
      }
      // Pulse fuer Pattern-Specimens
      for (const key of Object.keys(newObj)) {
        if (oldObj[key] === newObj[key]) continue
        if (key.startsWith('nc-icon-button-')) changed.add('icon-only')
        if (key.startsWith('nc-button-spinner-')) changed.add('loading')
      }
      if (changed.size > 0) triggerPulse(changed)
    } catch {}
  }
)
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
  transition: box-shadow 0.3s ease;
}

.arena-specimen--pulse {
  animation: arena-pulse 0.9s ease;
}

@keyframes arena-pulse {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 0 3px rgba(0, 159, 227, 0.35); }
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
  padding: 12px;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.arena-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.arena-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  cursor: pointer;
  line-height: 1.25;
  white-space: nowrap;
  outline: none;
  appearance: none;
  text-decoration: none;
}

.arena-btn--disabled {
  cursor: not-allowed;
}

/* Pattern: Icon */
.arena-btn__icon {
  display: inline-flex;
  flex-shrink: 0;
}

/* Pattern: Spinner */
.arena-btn__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border-style: solid;
  border-color: currentColor;
  border-top-color: transparent;
  animation: arena-spin 0.6s linear infinite;
}

@keyframes arena-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Pattern: Button Group */
.arena-btn-group {
  display: inline-flex;
}

.arena-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 13px;
  opacity: 0.5;
  font-style: italic;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* Generic Preview Styles                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */
.arena-generic-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.arena-preview-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-input {
  font-family: inherit;
  outline: none;
  appearance: none;
}

/* Tag / Chip */
.arena-tag {
  white-space: nowrap;
  line-height: 1;
}

/* Kbd */
.arena-kbd {
  font-family: inherit;
  white-space: nowrap;
}

/* Divider */
.arena-divider { margin: 0; }
.arena-divider-v { flex-shrink: 0; }

/* Checkbox / Radio */
.arena-check-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}
.arena-check-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Switch */
.arena-switch-track {
  display: inline-flex;
  flex-shrink: 0;
}
.arena-switch-thumb {
  position: absolute;
}

/* Slider */
.arena-slider-track { position: relative; }
.arena-slider-fill { position: absolute; }
.arena-slider-thumb { position: absolute; }

/* Surface */
.arena-surface-card { display: flex; }
.arena-surface-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

/* Dialog */
.arena-dialog {
  display: flex;
  flex-direction: column;
}
.arena-dialog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

/* Tooltip */
.arena-tooltip {
  word-break: break-word;
}

/* Navigation — Breadcrumb */
.arena-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.arena-breadcrumb a {
  text-decoration: none;
  cursor: pointer;
}

/* Pagination */
.arena-pagination {
  display: flex;
  align-items: center;
}
.arena-page-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

/* Stepper */
.arena-stepper {
  display: flex;
  gap: 24px;
  align-items: center;
}
.arena-stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.arena-stepper-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Accordion */
.arena-accordion {
  border: 1px solid;
  border-radius: 8px;
  overflow: hidden;
}
.arena-accordion-item {
  border-bottom: 1px solid;
}
.arena-accordion-item:last-child {
  border-bottom: none;
}

/* Nav items (segmented-control, toggle-group, dropdown-menu) */
.arena-nav-items {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  background: rgba(128,128,128,0.08);
}
.arena-nav-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
}

/* Progress */
.arena-progress-track {
  position: relative;
  overflow: hidden;
}
.arena-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

/* Spinner */
.arena-spinner {
  display: inline-block;
  animation: arena-spin 0.8s linear infinite;
}

/* Skeleton shimmer */
@keyframes arena-skeleton-shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

/* Data Table */
.arena-table-wrap {
  overflow: hidden;
}
.arena-table-header {
  display: flex;
  align-items: center;
  text-transform: uppercase;
}
.arena-table-row {
  display: flex;
  align-items: center;
}

/* Timeline */
.arena-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0 8px 8px;
}
.arena-timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}
.arena-timeline-dot { z-index: 1; }
.arena-timeline-line { position: absolute; }
.arena-timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Sidebar */
.arena-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.arena-sidebar-item {
  cursor: pointer;
}

/* Form Layout */
.arena-form-layout {
  display: flex;
  flex-direction: column;
}
.arena-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Shell */
.arena-shell-diagram {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(128,128,128,0.15);
}
.arena-shell-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.arena-shell-body {
  display: flex;
  min-height: 80px;
}
.arena-shell-sidebar {
  width: 70px;
  padding: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(128,128,128,0.15);
}
.arena-shell-content {
  flex: 1;
  padding: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Toolbar */
.arena-toolbar {
  display: flex;
  align-items: center;
}

/* Code */
.arena-code-block { overflow: hidden; }
.arena-code-header {
  display: flex;
  justify-content: space-between;
}
.arena-code-body {
  margin: 0;
  overflow: auto;
  white-space: pre;
}

/* Icon grid */
.arena-icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px;
}
.arena-icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Layout Primitive Diagram */
.arena-layout-diagram {
  padding: 12px;
  font-size: 12px;
}
.arena-layout-box {
  padding: 8px;
  position: relative;
}
.arena-layout-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}
.arena-layout-content {
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
