<template>
  <div class="ozm-editor">

    <!-- ══════════════════════════════════════════ -->
    <!-- OPACITY                                    -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Deckkraft
        <span class="ozm-heading__count">{{ totalOpacityCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Opacity-Werte für States und Inhalts-Abstufungen.</p>

      <div class="ozm-token-list">
        <div v-for="(token, key) in opacityTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-opacity-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-opacity-box" :style="{ opacity: currentOpacity(key) }"></div>
          </div>
          <input :aria-label="`Deckkraft ${token.label || key}`"
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
          <input :aria-label="`Deckkraft ${token.label || key}`"
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

      <HinzufuegenFormular knopf-text="Deckkraft hinzufügen" :felder="DECKKRAFT_FELDER" :pruefe="pruefeDeckkraft" test-id="deckkraft-hinzufuegen" @hinzufuegen="(w) => store.addCustomOpacityToken(w.name.trim(), String(w.wert).trim())" />
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- Z-INDEX                                    -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Stapelebenen
        <span class="ozm-heading__count">{{ totalZindexCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Z-Index-Schichten für die Stapelreihenfolge von Komponenten.</p>

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
          <input :aria-label="`Z-Index ${token.label || key}`"
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
          <input :aria-label="`Z-Index ${token.label || key}`"
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

      <HinzufuegenFormular knopf-text="Stapelebene hinzufügen" :felder="EBENEN_FELDER" :pruefe="pruefeEbene" test-id="ebene-hinzufuegen" @hinzufuegen="(w) => store.addCustomZindexToken(w.name.trim(), String(w.wert).trim())" />
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- MOTION                                     -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Bewegung
        <span class="ozm-heading__count">{{ totalMotionCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Easing-Kurven und Dauer-Werte für Animationen und Transitions.</p>

      <!-- Easings -->
      <h4 class="ozm-sub-heading">Bewegungskurve</h4>
      <div class="ozm-token-list">
        <div v-for="(token, key) in easingTokens" :key="key" class="ozm-token-row">
          <div class="ozm-token-info">
            <span class="ozm-token-label">{{ token.label }}</span>
            <code class="ozm-token-name">--fnd-motion-{{ key }}</code>
          </div>
          <div class="ozm-token-preview">
            <div class="ozm-motion-demo" :style="{ transitionTimingFunction: currentMotion(key) }" @mouseenter="animateMotion($event)" @mouseleave="resetMotion($event)"></div>
          </div>
          <input :aria-label="`Easing ${token.label || key}`"
            type="text"
            class="ozm-value-input ozm-value-input--wide"
            :value="currentMotion(key)"
            @change="store.updateFoundationToken('motion', key, $event.target.value)"
          />
        </div>
      </div>

      <!-- Durations -->
      <h4 class="ozm-sub-heading">Dauer</h4>
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
          <input :aria-label="`Dauer ${token.label || key}`"
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

      <HinzufuegenFormular knopf-text="Bewegung hinzufügen" :felder="BEWEGUNG_FELDER" :pruefe="pruefeBewegung" test-id="bewegung-hinzufuegen" @hinzufuegen="(w) => store.addCustomMotionToken(w.name.trim(), String(w.wert).trim(), null, w.art)" />
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- MOTION EFFECTS                             -->
    <!-- ══════════════════════════════════════════ -->
    <section class="ozm-section">
      <h3 class="ozm-heading">
        Bewegungseffekte
        <span class="ozm-heading__count">{{ totalEffectCount }} Tokens</span>
      </h3>
      <p class="ozm-desc">Vordefinierte Effekt-Presets für UI-Interaktionen: State Changes, Entrance, Attention, Feedback und räumliche Orientierung.</p>

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
            <input :aria-label="`Effekt ${token.label || key}`"
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

      <HinzufuegenFormular knopf-text="Bewegungseffekt hinzufügen" :felder="EFFEKT_FELDER" :pruefe="pruefeEffekt" test-id="effekt-hinzufuegen" @hinzufuegen="(w) => store.addCustomMotionEffectToken('effect-' + w.name.trim(), String(w.wert).trim(), w.name.trim(), String(w.transition || '').trim(), w.ausloeser)" />
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import HinzufuegenFormular from '../ui/HinzufuegenFormular.vue'
import { pruefeNeuenNamen, pruefeNeuenWert } from '../../utils/token-pruefung.js'
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
  'state-change': { label: 'Zustandsänderung (State Change)', desc: 'Bestätigt Nutzeraktionen durch visuelle Micro-Interactions.' },
  'entrance': { label: 'Einblendung (Entrance)', desc: 'Sanftes Erscheinen neuer Inhalte und Komponenten.' },
  'attention': { label: 'Aufmerksamkeit (Attention)', desc: 'Lenkt das Auge zur wichtigsten Aktion oder Aktivität.' },
  'feedback': { label: 'Feedback (Error Handling)', desc: 'Kommuniziert Fehler schneller und intuitiver als reiner Text.' },
  'spatial': { label: 'Räumliche Orientierung (Spatial)', desc: 'Hilft dem Nutzer zu verstehen, woher Elemente kommen.' }
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

// ── Hinzufügen (UX-52: ein gemeinsames Formular für alle vier) ──
const NAME = { name: 'name', label: 'Name', platzhalter: 'z. B. hinweis' }
const DECKKRAFT_FELDER = [NAME, { name: 'wert', label: 'Deckkraft', platzhalter: 'z. B. 0.4', hilfe: 'Zahl zwischen 0 und 1' }]
const EBENEN_FELDER = [NAME, { name: 'wert', label: 'Ebene', platzhalter: 'z. B. 450', hilfe: 'Ganze Zahl; höher liegt oben' }]
const BEWEGUNG_FELDER = [
  NAME,
  { name: 'art', label: 'Art', typ: 'auswahl', start: 'duration', optionen: [{ wert: 'duration', text: 'Dauer' }, { wert: 'delay', text: 'Verzögerung' }, { wert: 'easing', text: 'Bewegungskurve' }] },
  { name: 'wert', label: 'Wert', platzhalter: 'z. B. 0.5s oder ease-out' },
]
const EFFEKT_FELDER = [
  { name: 'name', label: 'Name', platzhalter: 'z. B. bounce-in' },
  { name: 'wert', label: 'CSS-Wert', platzhalter: 'z. B. translateY(-4px)' },
  { name: 'transition', label: 'Übergang', platzhalter: 'z. B. transform 0.3s ease' },
  { name: 'ausloeser', label: 'Anlass', typ: 'auswahl', start: 'state-change', optionen: [{ wert: 'state-change', text: 'Zustandswechsel' }, { wert: 'entrance', text: 'Erscheinen' }, { wert: 'attention', text: 'Aufmerksamkeit' }, { wert: 'feedback', text: 'Rückmeldung' }, { wert: 'spatial', text: 'Räumliche Orientierung' }] },
]
const namenFehler = (name, ...listen) => pruefeNeuenNamen(name, listen.flatMap((l) => Object.keys(l)))
function pruefeDeckkraft (w) {
  const n = namenFehler(w.name, opacityTokens.value, customOpacities.value)
  if (n) return { feld: 'name', text: n }
  const v = pruefeNeuenWert('zahl', w.wert, 'opacity')
  return v ? { feld: 'wert', text: v } : null
}
function pruefeEbene (w) {
  const n = namenFehler(w.name, zindexTokens.value, customZindices.value)
  if (n) return { feld: 'name', text: n }
  const v = pruefeNeuenWert('zahl', w.wert, 'zindex')
  return v ? { feld: 'wert', text: v } : null
}
function pruefeBewegung (w) {
  const n = namenFehler(w.name, motionTokens.value, customMotions.value)
  if (n) return { feld: 'name', text: n }
  const v = pruefeNeuenWert(w.art === 'easing' ? 'frei' : 'dauer', w.wert)
  return v ? { feld: 'wert', text: v } : null
}
function pruefeEffekt (w) {
  const n = pruefeNeuenNamen(w.name, [...Object.keys(effectTokens.value), ...Object.keys(customEffects.value)].map((k) => k.replace(/^effect-/, '')))
  if (n) return { feld: 'name', text: n }
  const v = pruefeNeuenWert('frei', w.wert)
  return v ? { feld: 'wert', text: v } : null
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

.ozm-btn--primary { background: var(--cfg-accent); color: var(--cfg-on-accent); }
.ozm-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ozm-btn--ghost { background: var(--cfg-surface); color: var(--cfg-text-muted); border: 1px solid var(--cfg-border); }

/* ── Intent Badges ── */
.ozm-desc--sm { font-size: 11px; margin-top: -4px; }

.ozm-intent-badge {
  display: inline-block; font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.4px; padding: 1px 5px; border-radius: 3px; margin-top: 2px;
  width: fit-content;
}

.ozm-intent--state-change { background: color-mix(in srgb, #3b82f6 15%, transparent); color: var(--cfg-info-text); }
.ozm-intent--entrance { background: color-mix(in srgb, #10b981 15%, transparent); color: var(--cfg-success-text); }
.ozm-intent--attention { background: color-mix(in srgb, #f59e0b 15%, transparent); color: var(--cfg-warning-text); }
.ozm-intent--feedback { background: color-mix(in srgb, #ef4444 15%, transparent); color: var(--fnd-color-text-danger); }
.ozm-intent--spatial { background: color-mix(in srgb, #8b5cf6 15%, transparent); color: var(--cfg-processing-text); }
</style>
