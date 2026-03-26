<template>
  <div class="component-arena psychedelic-arena">

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Inspector Controls                                             -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="psychedelic-arena__controls">

      <!-- Row 1: Shape + Mouse Effect -->
      <div class="psychedelic-arena__row">
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Form</span>
          <select v-model="cfg.shape" class="psychedelic-arena__select">
            <option value="lines">Linien (Moiré)</option>
            <option value="circles">Kreise (Konzentrisch)</option>
            <option value="squares">Quadrate</option>
            <option value="rectangles">Rechtecke</option>
            <option value="dots">Punkte (Halftone)</option>
            <option value="triangles">Dreiecke</option>
            <option value="waves">Wellen (Lissajous)</option>
          </select>
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Maus-Effekt</span>
          <select v-model="cfg.mouseEffect" class="psychedelic-arena__select">
            <option value="none">Keiner</option>
            <option value="lens">Lupe</option>
            <option value="funnel">Trichter</option>
            <option value="distort">Verzerrung</option>
            <option value="repel">Abstoßung</option>
            <option value="attract">Anziehung</option>
            <option value="ripple">Wellenringe</option>
          </select>
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Farbmodus</span>
          <select v-model="cfg.colorMode" class="psychedelic-arena__select">
            <option value="mono">Einfarbig</option>
            <option value="palette">Farbpalette</option>
            <option value="gradient">Farbverlauf</option>
          </select>
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Region</span>
          <select v-model="cfg.region" class="psychedelic-arena__select">
            <option value="full">Vollflächig</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertikal</option>
            <option value="diagonal">Diagonal</option>
          </select>
        </label>
      </div>

      <!-- Row 2: Pattern params -->
      <div class="psychedelic-arena__row">
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Linienstärke <code>{{ cfg.lineWidth.toFixed(1) }}</code></span>
          <input type="range" v-model.number="cfg.lineWidth" min="0.5" max="6" step="0.1" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Frequenz <code>{{ cfg.frequency.toFixed(3) }}</code></span>
          <input type="range" v-model.number="cfg.frequency" min="0.002" max="0.06" step="0.001" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Amplitude <code>{{ cfg.amplitude.toFixed(0) }}</code></span>
          <input type="range" v-model.number="cfg.amplitude" min="0" max="100" step="1" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Speed <code>{{ cfg.speed.toFixed(1) }}</code></span>
          <input type="range" v-model.number="cfg.speed" min="0" max="3" step="0.1" class="psychedelic-arena__range" />
        </label>
      </div>

      <!-- Row 3: Density + Scale + Gap -->
      <div class="psychedelic-arena__row">
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Dichte <code>{{ cfg.density }}</code></span>
          <input type="range" v-model.number="cfg.density" min="10" max="200" step="1" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Abstand <code>{{ cfg.gap }}</code></span>
          <input type="range" v-model.number="cfg.gap" min="3" max="40" step="1" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Skalierung <code>{{ cfg.scale.toFixed(1) }}</code></span>
          <input type="range" v-model.number="cfg.scale" min="0.3" max="3" step="0.1" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Phase <code>{{ cfg.phase.toFixed(1) }}</code></span>
          <input type="range" v-model.number="cfg.phase" min="0" max="6.28" step="0.1" class="psychedelic-arena__range" />
        </label>
      </div>

      <!-- Row 4: Mouse params -->
      <div class="psychedelic-arena__row" v-if="cfg.mouseEffect !== 'none'">
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Maus-Radius <code>{{ cfg.mouseRadius }}</code></span>
          <input type="range" v-model.number="cfg.mouseRadius" min="30" max="400" step="5" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Maus-Stärke <code>{{ cfg.mouseStrength.toFixed(2) }}</code></span>
          <input type="range" v-model.number="cfg.mouseStrength" min="0.05" max="2" step="0.05" class="psychedelic-arena__range" />
        </label>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Smoothing <code>{{ cfg.mouseSmoothing.toFixed(2) }}</code></span>
          <input type="range" v-model.number="cfg.mouseSmoothing" min="0.02" max="0.5" step="0.01" class="psychedelic-arena__range" />
        </label>
      </div>

      <!-- Row 5: Colors -->
      <div class="psychedelic-arena__row">
        <label class="psychedelic-arena__field psychedelic-arena__field--color">
          <span class="psychedelic-arena__label">Hintergrund</span>
          <input type="color" v-model="cfg.bgColor" class="psychedelic-arena__color-input" />
          <code>{{ cfg.bgColor }}</code>
        </label>

        <template v-if="cfg.colorMode === 'mono'">
          <label class="psychedelic-arena__field psychedelic-arena__field--color">
            <span class="psychedelic-arena__label">Musterfarbe</span>
            <input type="color" v-model="cfg.color" class="psychedelic-arena__color-input" />
            <code>{{ cfg.color }}</code>
          </label>
        </template>

        <template v-if="cfg.colorMode === 'gradient'">
          <label class="psychedelic-arena__field psychedelic-arena__field--color">
            <span class="psychedelic-arena__label">Verlauf Start</span>
            <input type="color" v-model="cfg.gradientStart" class="psychedelic-arena__color-input" />
            <code>{{ cfg.gradientStart }}</code>
          </label>
          <label class="psychedelic-arena__field psychedelic-arena__field--color">
            <span class="psychedelic-arena__label">Verlauf Ende</span>
            <input type="color" v-model="cfg.gradientEnd" class="psychedelic-arena__color-input" />
            <code>{{ cfg.gradientEnd }}</code>
          </label>
        </template>

        <template v-if="cfg.colorMode === 'palette'">
          <div class="psychedelic-arena__palette-row">
            <span class="psychedelic-arena__label">Palette</span>
            <div class="psychedelic-arena__palette-swatches">
              <label v-for="(c, i) in cfg.palette" :key="i" class="psychedelic-arena__swatch-wrap">
                <input type="color" :value="c" @input="updatePaletteColor(i, $event.target.value)" class="psychedelic-arena__color-input" />
              </label>
              <button v-if="cfg.palette.length < 8" @click="addPaletteColor" class="psychedelic-arena__add-btn" title="Farbe hinzufügen">+</button>
              <button v-if="cfg.palette.length > 2" @click="removePaletteColor" class="psychedelic-arena__add-btn" title="Letzte Farbe entfernen">−</button>
            </div>
          </div>
        </template>

        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Deckkraft <code>{{ cfg.opacity.toFixed(2) }}</code></span>
          <input type="range" v-model.number="cfg.opacity" min="0.1" max="1" step="0.01" class="psychedelic-arena__range" />
        </label>
      </div>

      <!-- Row 6: Region coords (only if not full) -->
      <div class="psychedelic-arena__row" v-if="cfg.region !== 'full'">
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Start X <code>{{ cfg.regionX1 }}%</code></span>
          <input type="range" v-model.number="cfg.regionX1" min="0" max="100" step="1" class="psychedelic-arena__range" />
        </label>
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Start Y <code>{{ cfg.regionY1 }}%</code></span>
          <input type="range" v-model.number="cfg.regionY1" min="0" max="100" step="1" class="psychedelic-arena__range" />
        </label>
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Ende X <code>{{ cfg.regionX2 }}%</code></span>
          <input type="range" v-model.number="cfg.regionX2" min="0" max="100" step="1" class="psychedelic-arena__range" />
        </label>
        <label class="psychedelic-arena__field">
          <span class="psychedelic-arena__label">Ende Y <code>{{ cfg.regionY2 }}%</code></span>
          <input type="range" v-model.number="cfg.regionY2" min="0" max="100" step="1" class="psychedelic-arena__range" />
        </label>
      </div>

      <!-- Presets -->
      <div class="psychedelic-arena__row">
        <span class="psychedelic-arena__label">Presets</span>
        <div class="psychedelic-arena__presets">
          <button v-for="p in presets" :key="p.id" @click="applyPreset(p)" class="psychedelic-arena__preset-btn" :class="{ active: activePreset === p.id }">
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Canvas Preview                                                 -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="psychedelic-arena__preview" ref="previewRef">
      <canvas ref="canvasRef" aria-hidden="true" class="psychedelic-arena__canvas"></canvas>

      <!-- Overlay text to demonstrate readability -->
      <div class="psychedelic-arena__overlay-text">
        <h2>Headline über dem Muster</h2>
        <p>Text-Lesbarkeit auf psychedelischem Hintergrund prüfen.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { PsychedelicRenderer } from '../../lib/PsychedelicRenderer.js'

// ── Config ──
const cfg = reactive({
  shape: 'lines',
  mouseEffect: 'lens',
  colorMode: 'mono',
  region: 'full',
  lineWidth: 1.5,
  frequency: 0.015,
  amplitude: 30,
  speed: 0.8,
  phase: 0,
  density: 60,
  gap: 8,
  scale: 1,
  mouseRadius: 150,
  mouseStrength: 0.5,
  mouseSmoothing: 0.1,
  color: '#00a5a5',
  bgColor: '#e63312',
  opacity: 1,
  palette: ['#e63312', '#00a5a5', '#ff6b35', '#1a1a2e', '#f7f7f7'],
  gradientStart: '#e63312',
  gradientEnd: '#00a5a5',
  regionX1: 0,
  regionY1: 0,
  regionX2: 100,
  regionY2: 100,
})

const activePreset = ref('neocon-moire')

// ── Presets ──
const presets = [
  {
    id: 'neocon-moire',
    label: 'NeoCon Moiré',
    config: {
      shape: 'lines', mouseEffect: 'lens', colorMode: 'mono', region: 'full',
      lineWidth: 1.5, frequency: 0.015, amplitude: 30, speed: 0.8, phase: 0,
      density: 60, gap: 8, scale: 1, mouseRadius: 150, mouseStrength: 0.5,
      color: '#00a5a5', bgColor: '#e63312', opacity: 1,
    },
  },
  {
    id: 'halftone-bw',
    label: 'Halftone B/W',
    config: {
      shape: 'dots', mouseEffect: 'distort', colorMode: 'mono', region: 'full',
      lineWidth: 1, frequency: 0.008, amplitude: 0, speed: 0.3, phase: 0,
      density: 60, gap: 12, scale: 1, mouseRadius: 180, mouseStrength: 0.8,
      color: '#1a1a1a', bgColor: '#f5f5f5', opacity: 1,
    },
  },
  {
    id: 'ocean-circles',
    label: 'Ocean Circles',
    config: {
      shape: 'circles', mouseEffect: 'ripple', colorMode: 'gradient', region: 'full',
      lineWidth: 1, frequency: 0.01, amplitude: 15, speed: 0.5, phase: 0,
      density: 60, gap: 10, scale: 1, mouseRadius: 200, mouseStrength: 0.6,
      gradientStart: '#0077b6', gradientEnd: '#90e0ef', bgColor: '#03045e', opacity: 1,
    },
  },
  {
    id: 'neon-triangles',
    label: 'Neon Triangles',
    config: {
      shape: 'triangles', mouseEffect: 'funnel', colorMode: 'palette', region: 'full',
      lineWidth: 1.5, frequency: 0.012, amplitude: 20, speed: 0.6, phase: 0,
      density: 60, gap: 18, scale: 1, mouseRadius: 160, mouseStrength: 0.7,
      palette: ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'],
      bgColor: '#0a0a0a', opacity: 1,
    },
  },
  {
    id: 'lissajous-sunset',
    label: 'Lissajous Sunset',
    config: {
      shape: 'waves', mouseEffect: 'attract', colorMode: 'gradient', region: 'full',
      lineWidth: 1.2, frequency: 0.01, amplitude: 40, speed: 0.4, phase: 0,
      density: 80, gap: 6, scale: 1, mouseRadius: 200, mouseStrength: 0.4,
      gradientStart: '#ff7b00', gradientEnd: '#8b0000', bgColor: '#1a0005', opacity: 0.9,
    },
  },
  {
    id: 'squares-grid',
    label: 'Op-Art Squares',
    config: {
      shape: 'squares', mouseEffect: 'repel', colorMode: 'mono', region: 'full',
      lineWidth: 1, frequency: 0.02, amplitude: 0, speed: 1, phase: 0,
      density: 60, gap: 20, scale: 1, mouseRadius: 180, mouseStrength: 0.8,
      color: '#ffffff', bgColor: '#111111', opacity: 1,
    },
  },
  {
    id: 'horizontal-band',
    label: 'Horizontal Band',
    config: {
      shape: 'lines', mouseEffect: 'lens', colorMode: 'mono', region: 'horizontal',
      lineWidth: 1.5, frequency: 0.015, amplitude: 25, speed: 0.8, phase: 0,
      density: 60, gap: 8, scale: 1, mouseRadius: 150, mouseStrength: 0.5,
      color: '#00a5a5', bgColor: '#e63312', opacity: 1,
      regionX1: 0, regionY1: 20, regionX2: 100, regionY2: 80,
    },
  },
]

function applyPreset(preset) {
  activePreset.value = preset.id
  Object.assign(cfg, preset.config)
}

// ── Palette helpers ──
function updatePaletteColor(index, value) {
  const newPalette = [...cfg.palette]
  newPalette[index] = value
  cfg.palette = newPalette
}

function addPaletteColor() {
  cfg.palette = [...cfg.palette, '#888888']
}

function removePaletteColor() {
  if (cfg.palette.length > 2) {
    cfg.palette = cfg.palette.slice(0, -1)
  }
}

// ── Canvas Renderer ──
const canvasRef = ref(null)
const previewRef = ref(null)
let renderer = null

onMounted(() => {
  if (canvasRef.value) {
    renderer = new PsychedelicRenderer(canvasRef.value, { ...cfg })
    renderer.start()
  }
})

onBeforeUnmount(() => {
  if (renderer) renderer.destroy()
})

// Sync config changes to renderer
watch(cfg, (newCfg) => {
  activePreset.value = '' // Reset preset marker on manual change
  if (renderer) renderer.updateConfig({ ...newCfg })
}, { deep: true })
</script>

<style scoped>
.psychedelic-arena {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Controls Panel ── */
.psychedelic-arena__controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--lab-surface, #1a1a2e);
  border-radius: 8px;
  border: 1px solid var(--lab-border, rgba(255,255,255,0.1));
}

.psychedelic-arena__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.psychedelic-arena__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 140px;
  min-width: 120px;
}

.psychedelic-arena__field--color {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 0 1 auto;
}

.psychedelic-arena__label {
  font-size: 11px;
  color: var(--lab-text-secondary, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.psychedelic-arena__label code {
  color: var(--lab-text-primary, #fff);
  font-family: inherit;
  font-weight: 600;
  margin-left: 4px;
}

.psychedelic-arena__select {
  height: 28px;
  padding: 2px 8px;
  font-size: 12px;
  background: var(--lab-input-bg, rgba(255,255,255,0.08));
  color: var(--lab-text-primary, #fff);
  border: 1px solid var(--lab-border, rgba(255,255,255,0.15));
  border-radius: 4px;
  cursor: pointer;
}

.psychedelic-arena__range {
  width: 100%;
  height: 4px;
  accent-color: var(--lab-accent, #3a86ff);
  cursor: pointer;
}

.psychedelic-arena__color-input {
  width: 28px;
  height: 28px;
  border: 1px solid var(--lab-border, rgba(255,255,255,0.2));
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  background: none;
}

/* ── Palette ── */
.psychedelic-arena__palette-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 100%;
}

.psychedelic-arena__palette-swatches {
  display: flex;
  gap: 4px;
  align-items: center;
}

.psychedelic-arena__swatch-wrap {
  display: inline-flex;
}

.psychedelic-arena__add-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  background: var(--lab-input-bg, rgba(255,255,255,0.08));
  color: var(--lab-text-secondary, #aaa);
  border: 1px dashed var(--lab-border, rgba(255,255,255,0.2));
  border-radius: 4px;
  cursor: pointer;
}

.psychedelic-arena__add-btn:hover {
  background: var(--lab-input-bg, rgba(255,255,255,0.15));
  color: var(--lab-text-primary, #fff);
}

/* ── Presets ── */
.psychedelic-arena__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.psychedelic-arena__preset-btn {
  padding: 4px 10px;
  font-size: 11px;
  border: 1px solid var(--lab-border, rgba(255,255,255,0.15));
  border-radius: 4px;
  background: var(--lab-input-bg, rgba(255,255,255,0.05));
  color: var(--lab-text-secondary, #aaa);
  cursor: pointer;
  transition: all 0.15s;
}

.psychedelic-arena__preset-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.psychedelic-arena__preset-btn.active {
  background: var(--lab-accent, #3a86ff);
  color: #fff;
  border-color: var(--lab-accent, #3a86ff);
}

/* ── Canvas Preview ── */
.psychedelic-arena__preview {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--lab-border, rgba(255,255,255,0.1));
}

.psychedelic-arena__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.psychedelic-arena__overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.psychedelic-arena__overlay-text h2 {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  margin: 0 0 8px;
}

.psychedelic-arena__overlay-text p {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  margin: 0;
}
</style>
