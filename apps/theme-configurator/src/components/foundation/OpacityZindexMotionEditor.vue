<template>
  <div class="ozm-editor">

    <!-- ══════════════════════════════════════════ -->
    <!-- OPACITY                                    -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Opacity
        <span class="ozm-heading__count">{{ totalOpacityCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Opacity-Werte fuer States und Inhalts-Abstufungen.</p>

      <div class="ozm-token-list">
        <div v-for="(token, key) in opacityTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-opacity-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-opacity-box" :style="{ opacity: currentOpacity(key) }"></div>
          </div>
          <input
            type="text"
            class="ozm-value-input"
            :value="currentOpacity(key)"
            @change="store.updateFoundationToken('opacity', key, Number($event.target.value))"
          />
        </div>
      </div>

      <!-- Custom Opacity -->
      <div v-if="customOpacityCount > 0" class="ozm-token-list">
        <div v-for="(token, key) in customOpacities" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-opacity-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-opacity-box" :style="{ opacity: token.value }"></div>
          </div>
          <input
            type="text"
            class="ozm-value-input"
            :value="token.value"
            @change="store.addCustomOpacityToken(key, $event.target.value, token.label)"
          />
          <button class="ozm-remove-btn" @click="store.removeCustomOpacityToken(key)" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="!showAddOpacity" class="ozm-add-row">
        <button class="ozm-add-btn" @click="showAddOpacity = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Opacity Token hinzufuegen
        </button>
      </div>
      <div v-else class="ozm-add-form">
        <div class="ozm-add-fields">
          <input ref="addOpacityKeyInput" type="text" class="ozm-input" v-model="newOpacityKey" placeholder="Token-Name (z.B. ghost)" @keyup.enter="addOpacity" @keyup.escape="cancelAddOpacity" />
          <input type="text" class="ozm-input" v-model="newOpacityValue" placeholder="Wert (z.B. 0.04)" @keyup.enter="addOpacity" @keyup.escape="cancelAddOpacity" />
        </div>
        <div class="ozm-add-actions">
          <button class="ozm-btn ozm-btn--primary" @click="addOpacity" :disabled="!newOpacityKey.trim() || !newOpacityValue.trim()">Hinzufuegen</button>
          <button class="ozm-btn ozm-btn--ghost" @click="cancelAddOpacity">Abbrechen</button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- Z-INDEX                                    -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Z-Index
        <span class="ozm-heading__count">{{ totalZindexCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Z-Index-Schichten fuer die Stapelreihenfolge von Komponenten.</p>

      <div class="ozm-token-list">
        <div v-for="(token, key) in zindexTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-z-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-zindex-bar">
              <div class="ozm-zindex-fill" :style="{ width: zindexWidth(currentZindex(key)) + '%' }"></div>
            </div>
          </div>
          <input
            type="text"
            class="ozm-value-input"
            :value="currentZindex(key)"
            @change="store.updateFoundationToken('zindex', key, Number($event.target.value))"
          />
        </div>
      </div>

      <!-- Custom Z-Index -->
      <div v-if="customZindexCount > 0" class="ozm-token-list">
        <div v-for="(token, key) in customZindices" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-z-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-zindex-bar">
              <div class="ozm-zindex-fill" :style="{ width: zindexWidth(token.value) + '%' }"></div>
            </div>
          </div>
          <input
            type="text"
            class="ozm-value-input"
            :value="token.value"
            @change="store.addCustomZindexToken(key, $event.target.value, token.label)"
          />
          <button class="ozm-remove-btn" @click="store.removeCustomZindexToken(key)" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="!showAddZindex" class="ozm-add-row">
        <button class="ozm-add-btn" @click="showAddZindex = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Z-Index Token hinzufuegen
        </button>
      </div>
      <div v-else class="ozm-add-form">
        <div class="ozm-add-fields">
          <input ref="addZindexKeyInput" type="text" class="ozm-input" v-model="newZindexKey" placeholder="Token-Name (z.B. popover)" @keyup.enter="addZindex" @keyup.escape="cancelAddZindex" />
          <input type="text" class="ozm-input" v-model="newZindexValue" placeholder="Wert (z.B. 15)" @keyup.enter="addZindex" @keyup.escape="cancelAddZindex" />
        </div>
        <div class="ozm-add-actions">
          <button class="ozm-btn ozm-btn--primary" @click="addZindex" :disabled="!newZindexKey.trim() || !newZindexValue.trim()">Hinzufuegen</button>
          <button class="ozm-btn ozm-btn--ghost" @click="cancelAddZindex">Abbrechen</button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- MOTION                                     -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Motion
        <span class="ozm-heading__count">{{ totalMotionCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Easing-Kurven und Dauer-Werte fuer Animationen und Transitions.</p>

      <!-- Easings -->
      <h4 class="ozm-sub-heading">Easing</h4>
      <div class="ozm-token-list">
        <div v-for="(token, key) in easingTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-motion-demo" :style="{ transitionTimingFunction: currentMotion(key) }" @mouseenter="animateMotion($event)" @mouseleave="resetMotion($event)"></div>
          </div>
          <input
            type="text"
            class="ozm-value-input ozm-value-input--wide"
            :value="currentMotion(key)"
            @change="store.updateFoundationToken('motion', key, $event.target.value)"
          />
        </div>
      </div>

      <!-- Durations -->
      <h4 class="ozm-sub-heading">Duration</h4>
      <div class="ozm-token-list">
        <div v-for="(token, key) in durationTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-duration-bar">
              <div class="ozm-duration-fill" :style="{ width: durationWidth(currentMotion(key)) + '%' }"></div>
            </div>
          </div>
          <input
            type="text"
            class="ozm-value-input"
            :value="currentMotion(key)"
            @change="store.updateFoundationToken('motion', key, $event.target.value)"
          />
        </div>
      </div>

      <!-- Custom Motion -->
      <div v-if="customMotionCount > 0" class="ozm-token-list">
        <div v-for="(token, key) in customMotions" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
            <span class="ozm-type-badge">{{ token.type }}</span>
          </div>
          <div class="ozm-token-preview">
            <code class="ozm-value-ro">{{ token.value }}</code>
          </div>
          <button class="ozm-remove-btn" @click="store.removeCustomMotionToken(key)" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="!showAddMotion" class="ozm-add-row">
        <button class="ozm-add-btn" @click="showAddMotion = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Motion Token hinzufuegen
        </button>
      </div>
      <div v-else class="ozm-add-form">
        <div class="ozm-add-fields">
          <input ref="addMotionKeyInput" type="text" class="ozm-input" v-model="newMotionKey" placeholder="Token-Name (z.B. bounce)" @keyup.enter="addMotion" @keyup.escape="cancelAddMotion" />
          <input type="text" class="ozm-input ozm-input--wide" v-model="newMotionValue" placeholder="Wert (z.B. 0.5s oder ease-out)" @keyup.enter="addMotion" @keyup.escape="cancelAddMotion" />
          <select class="ozm-select" v-model="newMotionType">
            <option value="easing">Easing</option>
            <option value="duration">Duration</option>
            <option value="delay">Delay</option>
          </select>
        </div>
        <div class="ozm-add-actions">
          <button class="ozm-btn ozm-btn--primary" @click="addMotion" :disabled="!newMotionKey.trim() || !newMotionValue.trim()">Hinzufuegen</button>
          <button class="ozm-btn ozm-btn--ghost" @click="cancelAddMotion">Abbrechen</button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- MOTION EFFECTS                             -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Motion Effects
        <span class="ozm-heading__count">{{ totalEffectCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Vordefinierte Effekt-Presets fuer UI-Interaktionen: State Changes, Entrance, Attention, Feedback und raeumliche Orientierung.</p>

      <!-- Intent Groups -->
      <template v-for="(group, groupKey) in effectGroups" :key="groupKey">
        <h4 class="ozm-sub-heading">{{ group.label }}</h4>
        <p class="ozm-desc ozm-desc--sm">{{ group.desc }}</p>
        <div class="ozm-token-list">
          <div v-for="(token, key) in group.tokens" :key="key" class="ozm-token-row">
            <div class="ozm-token-info">
              <span class="ozm-token-label">{{ token.label }}</span>
              <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
              <span class="ozm-intent-badge" :class="'ozm-intent--' + token.intent">{{ intentLabels[token.intent] }}</span>
            </div>
            <div class="ozm-token-preview">
              <code class="ozm-value-ro">{{ token.value }}</code>
            </div>
            <input
              type="text"
              class="ozm-value-input ozm-value-input--wide"
              :value="currentMotion(key)"
              @change="store.updateFoundationToken('motion', key, $event.target.value)"
            />
          </div>
        </div>
      </template>

      <!-- Custom Effects -->
      <div v-if="customEffectCount > 0" class="ozm-token-list">
        <h4 class="ozm-sub-heading">Eigene Effekte</h4>
        <div v-for="(token, key) in customEffects" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
            <span class="ozm-intent-badge" :class="'ozm-intent--' + token.intent">{{ intentLabels[token.intent] }}</span>
          </div>
          <div class="ozm-token-preview">
            <code class="ozm-value-ro">{{ token.value }}</code>
          </div>
          <button class="ozm-remove-btn" @click="store.removeCustomMotionEffectToken(key)" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="!showAddEffect" class="ozm-add-row">
        <button class="ozm-add-btn" @click="showAddEffect = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Motion Effect hinzufuegen
        </button>
      </div>
      <div v-else class="ozm-add-form">
        <div class="ozm-add-fields">
          <input ref="addEffectKeyInput" type="text" class="ozm-input" v-model="newEffectKey" placeholder="Effect-Name (z.B. bounce-in)" @keyup.enter="addEffect" @keyup.escape="cancelAddEffect" />
          <input type="text" class="ozm-input ozm-input--wide" v-model="newEffectValue" placeholder="CSS-Wert (z.B. translateY(-4px))" @keyup.enter="addEffect" @keyup.escape="cancelAddEffect" />
        </div>
        <div class="ozm-add-fields">
          <input type="text" class="ozm-input ozm-input--wide" v-model="newEffectTransition" placeholder="Transition (z.B. transform 0.3s ease)" @keyup.enter="addEffect" @keyup.escape="cancelAddEffect" />
          <select class="ozm-select" v-model="newEffectIntent">
            <option value="state-change">State Change</option>
            <option value="entrance">Entrance</option>
            <option value="attention">Attention</option>
            <option value="feedback">Feedback</option>
            <option value="spatial">Spatial</option>
          </select>
        </div>
        <div class="ozm-add-actions">
          <button class="ozm-btn ozm-btn--primary" @click="addEffect" :disabled="!newEffectKey.trim() || !newEffectValue.trim()">Hinzufuegen</button>
          <button class="ozm-btn ozm-btn--ghost" @click="cancelAddEffect">Abbrechen</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()

// ── Opacity ──
const opacityTokens = computed(() => foundationTokens.opacity?.tokens || {})
const customOpacities = computed(() => store.currentCustomOpacityTokens || {})
const customOpacityCount = computed(() => Object.keys(customOpacities.value).length)
const totalOpacityCount = computed(() => Object.keys(opacityTokens.value).length + customOpacityCount.value)

function currentOpacity(key) {
  return store.currentFoundation.opacity?.[key] ?? opacityTokens.value[key]?.value ?? ''
}

// ── Z-Index ──
const zindexTokens = computed(() => foundationTokens.zindex?.tokens || {})
const customZindices = computed(() => store.currentCustomZindexTokens || {})
const customZindexCount = computed(() => Object.keys(customZindices.value).length)
const totalZindexCount = computed(() => Object.keys(zindexTokens.value).length + customZindexCount.value)

function currentZindex(key) {
  return store.currentFoundation.zindex?.[key] ?? zindexTokens.value[key]?.value ?? ''
}

function zindexWidth(value) {
  return Math.min(100, (Number(value) / 20) * 100)
}

// ── Motion ──
const motionTokens = computed(() => foundationTokens.motion?.tokens || {})
const easingTokens = computed(() => {
  const result = {}
  for (const [k, v] of Object.entries(motionTokens.value)) {
    if (v.type === 'easing') result[k] = v
  }
  return result
})
const durationTokens = computed(() => {
  const result = {}
  for (const [k, v] of Object.entries(motionTokens.value)) {
    if (v.type === 'duration') result[k] = v
  }
  return result
})
const customMotions = computed(() => store.currentCustomMotionTokens || {})
const customMotionCount = computed(() => Object.keys(customMotions.value).length)
const totalMotionCount = computed(() => Object.keys(motionTokens.value).length + customMotionCount.value)

function currentMotion(key) {
  return store.currentFoundation.motion?.[key] ?? motionTokens.value[key]?.value ?? ''
}

function durationWidth(value) {
  const ms = parseFloat(value) * (String(value).includes('ms') ? 1 : 1000)
  return Math.min(100, (ms / 1500) * 100)
}

function animateMotion(e) {
  e.target.style.transform = 'translateX(60px)'
}
function resetMotion(e) {
  e.target.style.transform = 'translateX(0)'
}

// ── Add Opacity ──
const showAddOpacity = ref(false)
const newOpacityKey = ref('')
const newOpacityValue = ref('')
const addOpacityKeyInput = ref(null)
watch(showAddOpacity, (v) => { if (v) nextTick(() => addOpacityKeyInput.value?.focus()) })

function addOpacity() {
  const key = newOpacityKey.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const value = newOpacityValue.value.trim()
  if (!key || !value) return
  store.addCustomOpacityToken(key, value)
  cancelAddOpacity()
}
function cancelAddOpacity() {
  showAddOpacity.value = false
  newOpacityKey.value = ''
  newOpacityValue.value = ''
}

// ── Add Z-Index ──
const showAddZindex = ref(false)
const newZindexKey = ref('')
const newZindexValue = ref('')
const addZindexKeyInput = ref(null)
watch(showAddZindex, (v) => { if (v) nextTick(() => addZindexKeyInput.value?.focus()) })

function addZindex() {
  const key = newZindexKey.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const value = newZindexValue.value.trim()
  if (!key || !value) return
  store.addCustomZindexToken(key, value)
  cancelAddZindex()
}
function cancelAddZindex() {
  showAddZindex.value = false
  newZindexKey.value = ''
  newZindexValue.value = ''
}

// ── Add Motion ──
const showAddMotion = ref(false)
const newMotionKey = ref('')
const newMotionValue = ref('')
const newMotionType = ref('duration')
const addMotionKeyInput = ref(null)
watch(showAddMotion, (v) => { if (v) nextTick(() => addMotionKeyInput.value?.focus()) })

function addMotion() {
  const key = newMotionKey.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const value = newMotionValue.value.trim()
  if (!key || !value) return
  store.addCustomMotionToken(key, value, null, newMotionType.value)
  cancelAddMotion()
}
function cancelAddMotion() {
  showAddMotion.value = false
  newMotionKey.value = ''
  newMotionValue.value = ''
  newMotionType.value = 'duration'
}

// ── Motion Effects ──
const effectTokens = computed(() => {
  const result = {}
  for (const [k, v] of Object.entries(motionTokens.value)) {
    if (v.type === 'effect') result[k] = v
  }
  return result
})

const customEffects = computed(() => store.currentCustomMotionEffectTokens || {})
const customEffectCount = computed(() => Object.keys(customEffects.value).length)
const totalEffectCount = computed(() => Object.keys(effectTokens.value).length + customEffectCount.value)

const intentLabels = {
  'state-change': 'State Change',
  'entrance': 'Entrance',
  'attention': 'Attention',
  'feedback': 'Feedback',
  'spatial': 'Spatial'
}

const intentGroupDefs = {
  'state-change': { label: 'Zustandsaenderung (State Change)', desc: 'Bestaetigt Nutzeraktionen durch visuelle Micro-Interactions.' },
  'entrance': { label: 'Einblendung (Entrance)', desc: 'Sanftes Erscheinen neuer Inhalte und Komponenten.' },
  'attention': { label: 'Aufmerksamkeit (Attention)', desc: 'Lenkt das Auge zur wichtigsten Aktion oder Aktivitaet.' },
  'feedback': { label: 'Feedback (Error Handling)', desc: 'Kommuniziert Fehler schneller und intuitiver als reiner Text.' },
  'spatial': { label: 'Raeumliche Orientierung (Spatial)', desc: 'Hilft dem Nutzer zu verstehen, woher Elemente kommen.' }
}

const effectGroups = computed(() => {
  const groups = {}
  for (const [key, tok] of Object.entries(effectTokens.value)) {
    const intent = tok.intent || 'state-change'
    if (!groups[intent]) {
      groups[intent] = {
        label: intentGroupDefs[intent]?.label || intent,
        desc: intentGroupDefs[intent]?.desc || '',
        tokens: {}
      }
    }
    groups[intent].tokens[key] = tok
  }
  return groups
})

// ── Add Effect ──
const showAddEffect = ref(false)
const newEffectKey = ref('')
const newEffectValue = ref('')
const newEffectTransition = ref('')
const newEffectIntent = ref('state-change')
const addEffectKeyInput = ref(null)
watch(showAddEffect, (v) => { if (v) nextTick(() => addEffectKeyInput.value?.focus()) })

function addEffect() {
  const key = 'effect-' + newEffectKey.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const value = newEffectValue.value.trim()
  if (!key || !value) return
  store.addCustomMotionEffectToken(key, value, newEffectKey.value.trim(), newEffectTransition.value.trim(), newEffectIntent.value)
  cancelAddEffect()
}
function cancelAddEffect() {
  showAddEffect.value = false
  newEffectKey.value = ''
  newEffectValue.value = ''
  newEffectTransition.value = ''
  newEffectIntent.value = 'state-change'
}
</script>

<style scoped>
.ozm-editor { display: flex; flex-direction: column; gap: 32px; }

.ozm-section { display: flex; flex-direction: column; gap: 12px; }

.ozm-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}

.ozm-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted); background: var(--cfg-surface-elevated);
  padding: 2px 6px; border-radius: 4px;
}

.ozm-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }
.ozm-sub-heading { font-size: 12px; font-weight: 700; color: var(--cfg-text-muted); margin: 8px 0 0; text-transform: uppercase; letter-spacing: 0.5px; }

/* ── Token List ── */
.ozm-token-list { display: flex; flex-direction: column; gap: 2px; }

.ozm-token-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px;
}

.ozm-token-row:hover { background: var(--cfg-surface-elevated); }

.ozm-token-info {
  display: flex; flex-direction: column; gap: 1px;
  width: 130px; flex-shrink: 0;
}

.ozm-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.ozm-token-name { font-size: 10px; color: var(--cfg-text-muted); }

.ozm-type-badge {
  font-size: 9px; font-weight: 600; text-transform: uppercase;
  color: var(--cfg-accent); letter-spacing: 0.3px;
}

.ozm-token-preview { flex: 1; display: flex; align-items: center; min-width: 0; }

/* Opacity preview */
.ozm-opacity-box {
  width: 36px; height: 36px; border-radius: 6px;
  background: var(--cfg-accent); transition: opacity 0.2s;
}

/* Z-Index bar */
.ozm-zindex-bar {
  flex: 1; height: 10px; background: var(--cfg-surface-elevated);
  border-radius: 2px; overflow: hidden;
}

.ozm-zindex-fill {
  height: 100%; background: var(--cfg-accent); opacity: 0.6;
  border-radius: 2px; transition: width 0.2s;
}

/* Motion demo */
.ozm-motion-demo {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--cfg-accent);
  transition: transform 0.4s;
  cursor: pointer;
}

/* Duration bar */
.ozm-duration-bar {
  flex: 1; height: 6px; background: var(--cfg-surface-elevated);
  border-radius: 2px; overflow: hidden;
}

.ozm-duration-fill {
  height: 100%; background: var(--cfg-accent); opacity: 0.5;
  border-radius: 2px; transition: width 0.2s;
}

.ozm-value-ro {
  font-size: 10px; color: var(--cfg-text-muted); font-family: monospace;
  word-break: break-all;
}

/* ── Inputs ── */
.ozm-value-input {
  width: 70px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none;
  text-align: right; flex-shrink: 0;
  transition: border-color 0.15s;
}

.ozm-value-input--wide { width: 120px; text-align: left; }
.ozm-value-input:focus { border-color: var(--cfg-accent); }

.ozm-select {
  height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; outline: none; cursor: pointer;
}

/* ── Remove Button ── */
.ozm-remove-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; border-radius: 4px;
  background: transparent; color: var(--cfg-text-muted); cursor: pointer;
  flex-shrink: 0;
}

.ozm-remove-btn:hover { color: var(--cfg-danger); background: var(--cfg-danger-subtle); }

/* ── Add Token ── */
.ozm-add-row { display: flex; }

.ozm-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border: 1px dashed var(--cfg-border);
  border-radius: 6px; background: transparent;
  color: var(--cfg-text-muted); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
}

.ozm-add-btn:hover { border-color: var(--cfg-accent); color: var(--cfg-accent); }

.ozm-add-form {
  display: flex; flex-direction: column; gap: 8px;
  padding: 12px; border: 1px solid var(--cfg-border);
  border-radius: 8px; background: var(--cfg-surface);
}

.ozm-add-fields { display: flex; gap: 6px; }

.ozm-input {
  flex: 1; height: 28px; padding: 0 8px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 12px; outline: none; min-width: 0;
  transition: border-color 0.15s;
}

.ozm-input--wide { flex: 2; }
.ozm-input:focus { border-color: var(--cfg-accent); }

.ozm-add-actions { display: flex; gap: 6px; }

.ozm-btn {
  flex: 1; height: 28px; border: none; border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
}

.ozm-btn--primary { background: var(--cfg-accent); color: #fff; }
.ozm-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ozm-btn--ghost { background: var(--cfg-surface); color: var(--cfg-text-muted); border: 1px solid var(--cfg-border); }

/* ── Intent Badges ── */
.ozm-desc--sm { font-size: 11px; margin-top: -4px; }

.ozm-intent-badge {
  display: inline-block; font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.4px; padding: 1px 5px; border-radius: 3px; margin-top: 2px;
  width: fit-content;
}

.ozm-intent--state-change { background: color-mix(in srgb, #3b82f6 15%, transparent); color: #3b82f6; }
.ozm-intent--entrance { background: color-mix(in srgb, #10b981 15%, transparent); color: #10b981; }
.ozm-intent--attention { background: color-mix(in srgb, #f59e0b 15%, transparent); color: #f59e0b; }
.ozm-intent--feedback { background: color-mix(in srgb, #ef4444 15%, transparent); color: #ef4444; }
.ozm-intent--spatial { background: color-mix(in srgb, #8b5cf6 15%, transparent); color: #8b5cf6; }
</style>
