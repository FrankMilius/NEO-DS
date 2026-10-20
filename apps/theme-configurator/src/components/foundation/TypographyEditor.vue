<template>
  <div class="typography-editor">

    <!-- ═══════════════════════════════════════════════════════════════════
         FONT FAMILIES
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">
        Schriften
        <span v-if="isDefaultNeo" class="locked-badge" title="Im NEO-Standard sind die Schriften fest. Legen Sie ein eigenes Theme an, um sie zu ändern.">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          NEO-Standard
        </span>
        <span v-else class="theme-name-badge">{{ currentThemeName }}</span>
      </h3>
      <p v-if="isDefaultNeo" class="sub-desc">Schriften des NEO-Standards — Manrope (Fließtext), Space Grotesk (Überschriften), JetBrains Mono (Kicker, Tabellenköpfe, Zähler, Code); Bedienelemente wie Fließtext.</p>
      <p v-else-if="buehne" class="sub-desc">
        Schriften dieses Themes je Rolle. Ändern in den Einstellungen rechts.
      </p>
      <p v-else class="sub-desc">
        Jede Rolle steuert einen Teil der Website. Schrift je Rolle wählen — aus NEO, System, Google
        oder vom Server. Neue Schriften erst unten hinzufügen (Google) bzw. hochladen (Server).
      </p>

      <!-- Default NEO: Read-only font cards -->
      <div v-if="isDefaultNeo" class="font-cards">
        <div v-for="font in defaultFonts" :key="font.id" class="font-card font-card--locked">
          <div class="font-preview" :style="{ fontFamily: font.value }">
            <span class="font-sample">Aa Bb Cc 123</span>
          </div>
          <div class="font-info">
            <span class="font-role-badge">{{ font.role }}</span>
            <span class="font-label">{{ font.label }}</span>
            <code class="font-value">{{ font.primary }}</code>
          </div>
        </div>
        <div class="font-card font-card--locked" data-test="schrift-rolle-ui-neo">
          <div class="font-preview" :style="{ fontFamily: typoTokens['font-body'].value }">
            <span class="font-sample">Aa Bb Cc 123</span>
          </div>
          <div class="font-info">
            <span class="font-role-badge">Bedienelemente</span>
            <span class="font-label">wie Body</span>
            <code class="font-value">Manrope</code>
          </div>
        </div>
      </div>

      <!-- Theme: Rollen zuweisen (Befund Frank 15.10.2026: Auswahl statt
           Freitext, Wirkung je Rolle, Bühne nur Anzeige) -->
      <template v-else>
        <div class="font-cards">
          <div v-for="font in activeFonts" :key="font.id" class="font-card" :data-test="`schrift-rolle-${font.id}`">
            <div class="font-preview" :style="{ fontFamily: font.value }">
              <span class="font-sample">Aa Bb Cc 123</span>
            </div>
            <div class="font-info">
              <span class="font-role-badge">{{ font.role }}</span>
              <p class="font-wirkung">{{ font.wirkung }}</p>
              <template v-if="!buehne">
                <label class="font-select-label" :for="`schrift-wahl-${font.id}`">Schrift<span class="cfg-sr-only"> für {{ font.role }}</span></label>
                <select
                  :id="`schrift-wahl-${font.id}`"
                  class="font-select"
                  :value="auswahlWert(font)"
                  @change="waehleSchrift(font, $event.target.value)"
                >
                  <optgroup v-for="g in schriftGruppen(font)" :key="g.label" :label="g.label">
                    <option v-for="o in g.optionen" :key="g.label + o.familie" :value="o.familie">{{ o.familie }}{{ o.zusatz ? ` – ${o.zusatz}` : '' }}</option>
                  </optgroup>
                  <option v-if="auswahlWert(font) === EIGENE" :value="EIGENE">Eigene Angabe (siehe unten)</option>
                </select>
                <details class="font-eigene" :open="auswahlWert(font) === EIGENE">
                  <summary>Eigene Angabe (Font-Stack)</summary>
                  <input :aria-label="`Font-Stack ${font.role}`"
                    type="text"
                    class="font-input"
                    :value="font.value"
                    :aria-invalid="feldFehler['stack-' + font.id] ? 'true' : undefined"
                    :aria-describedby="feldFehler['stack-' + font.id] ? `fehler-stack-${font.id}` : undefined"
                    @change="updateFontFamily(font.tokenKey, $event.target.value, 'stack-' + font.id)"
                    :placeholder="font.placeholder"
                  />
                  <p v-if="feldFehler['stack-' + font.id]" :id="`fehler-stack-${font.id}`" class="feld-fehler" role="alert">{{ feldFehler['stack-' + font.id] }}</p>
                </details>
              </template>
              <code v-else class="font-value font-value--stack">{{ font.value }}</code>
              <code class="font-value">{{ font.cssVar }}</code>
            </div>
          </div>
          <!-- Rolle Bedienelemente (20.10.2026): verweist auf eine der drei Schriften -->
          <div class="font-card" data-test="schrift-rolle-ui">
            <div class="font-preview" :style="{ fontFamily: uiRolle.familie }">
              <span class="font-sample">Aa Bb Cc 123</span>
            </div>
            <div class="font-info">
              <span class="font-role-badge">Bedienelemente</span>
              <p class="font-wirkung">{{ ROLLEN_WIRKUNG.ui }}</p>
              <template v-if="!buehne">
                <span class="font-select-label">Schrift wie</span>
                <SchriftRolleWahl label="Bedienelemente" :rollen="['body', 'heading', 'mono']"
                  :modelValue="uiRolle.value" :standard="typoTokens['font-ui'].value" :eigeneErlaubt="false"
                  :isOverridden="uiRolle.value !== typoTokens['font-ui'].value"
                  @update:modelValue="updateUiRolle" />
              </template>
              <code v-else class="font-value font-value--stack">{{ uiRolle.value }}</code>
              <code class="font-value">{{ typoTokens['font-ui'].cssVar }}</code>
            </div>
          </div>
        </div>

        <!-- Google-Schriften: hinzufügen, dann einer Rolle zuweisen -->
        <template v-if="!buehne">
          <h4 class="font-untertitel">Google-Schriften</h4>
          <p class="sub-desc">
            Schrift von Google Fonts einbinden: Name, Font-Stack und Adresse eintragen. Wirksam wird sie erst,
            wenn sie einer Rolle zugewiesen ist (Auswahl oben oder „Als …“). Auf der Website lädt der Browser
            der Besucher sie dann bei Google. Ohne Verbindung nach außen: Schriften auf dem Server nutzen.
          </p>
          <div class="font-cards">
            <div v-for="font in customFonts" :key="font.id" class="font-card" :data-test="`google-schrift-${font.name}`">
              <div class="font-preview" :style="{ fontFamily: font.family }">
                <span class="font-sample">Aa Bb Cc 123</span>
              </div>
              <div class="font-info">
                <span class="font-role-badge font-role-badge--custom">Google</span>
                <div class="font-edit-row">
                  <input aria-label="Name der eigenen Schrift"
                    type="text"
                    class="font-input font-input--name"
                    :value="font.name"
                    @change="updateCustomFontName(font.id, $event.target.value)"
                    placeholder="Font name"
                  />
                  <button
                    class="btn-remove"
                    @click="removeCustomFont(font.id)"
                    :aria-label="`${font.name} entfernen`"
                    title="Schrift entfernen"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </button>
                </div>
                <div class="font-edit-row">
                  <input aria-label="Schriftfamilie (Font Stack)"
                    type="text"
                    class="font-input"
                    :value="font.family"
                    :aria-invalid="feldFehler['gf-family-' + font.id] ? 'true' : undefined"
                    @change="updateCustomFontFamily(font.id, $event.target.value)"
                    placeholder="Font stack, e.g. Inter, sans-serif"
                  />
                </div>
                <p v-if="feldFehler['gf-family-' + font.id]" class="feld-fehler" role="alert">{{ feldFehler['gf-family-' + font.id] }}</p>
                <div class="font-edit-row">
                  <label class="font-url-label">Google-Fonts-Adresse</label>
                  <input :aria-label="`Google-Fonts-Adresse von ${font.name}`"
                    type="text"
                    class="font-input font-input--url"
                    :value="font.url"
                    :aria-invalid="feldFehler['gf-url-' + font.id] ? 'true' : undefined"
                    @change="updateCustomFontUrl(font.id, $event.target.value)"
                    placeholder="https://fonts.googleapis.com/css2?family=..."
                  />
                </div>
                <p v-if="feldFehler['gf-url-' + font.id]" class="feld-fehler" role="alert">{{ feldFehler['gf-url-' + font.id] }}</p>
                <!-- UX-14: was die Website von dieser Schrift bekommt -->
                <p v-if="!font.url" class="feld-fehler" role="status" :data-test="`schrift-stand-${font.id}`">
                  Ohne Google-Fonts-Adresse lädt die Website diese Schrift nicht.
                  <button type="button" class="font-rolle-btn" :data-test="`schrift-adresse-bauen-${font.id}`" @click="updateCustomFontUrl(font.id, '')">Adresse aus dem Font-Stack bauen</button>
                </p>
                <p v-else-if="schriftStand[font.id] === 'fehler'" class="feld-fehler" role="alert" :data-test="`schrift-stand-${font.id}`">
                  Nicht ladbar: Google Fonts liefert „{{ ersteFamilie(font.family) }}“ unter dieser Adresse nicht. Die Website zeigt stattdessen die Ersatzschrift. Namen auf fonts.google.com prüfen.
                </p>
                <p v-else-if="schriftStand[font.id] === 'ok'" class="font-wirkung" role="status" :data-test="`schrift-stand-${font.id}`">Geladen von Google Fonts.</p>
                <div class="font-rollen" role="group" :aria-label="`${font.name} verwenden als`">
                  <button
                    v-for="r in activeFonts"
                    :key="r.id"
                    type="button"
                    class="font-rolle-btn"
                    :aria-pressed="ersteFamilie(r.value) === ersteFamilie(font.family) ? 'true' : 'false'"
                    :data-test="`google-schrift-rolle-${r.id}`"
                    @click="weiseStackZu(r, font.family)"
                  >Als {{ r.role }}</button>
                </div>
              </div>
            </div>

            <!-- Add Font Family Card -->
            <div class="font-card add-font-card">
              <!-- UX-35, UX-52: gemeinsames Formular; Fehler stehen am Feld -->
              <HinzufuegenFormular
                knopf-text="Google-Schrift hinzufügen"
                test-id="google-schrift-neu"
                id-basis="gf-neu"
                :felder="schriftFelder"
                :pruefe="pruefeNeueSchrift"
                @hinzufuegen="addCustomFont"
              >
                <template #vorschau="{ werte }">
                  <div v-if="String(werte.stack || '').trim()" class="add-font-preview" :style="{ fontFamily: werte.stack }">
                    <span class="font-sample">Aa Bb Cc Dd 1234</span>
                  </div>
                </template>
              </HinzufuegenFormular>
            </div>
          </div>
        </template>
      </template>
    </section>

    <!-- Lokale Schriften aus Drupal (Vertrag 1.1.0): hochgeladen oder Server-Ordner -->
    <DrupalSchriften v-if="drupalBetrieb && !buehne" :gesperrt="isDefaultNeo" />

    <!-- ═══════════════════════════════════════════════════════════════════
         FONT WEIGHTS — alle Stärken aus der Quelle (Plan v2, 2.3)
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">Schriftstärken <span class="te-count">{{ weights.length }}</span></h3>
      <div class="weight-strip">
        <div v-for="weight in weights" :key="weight.id" class="weight-chip" :title="weight.cssVar">
          <span class="weight-preview" :style="{ fontWeight: weight.value, fontFamily: weight.mono ? monoFamily : weight.heading ? headingFamily : bodyFontFamily }">Ag</span>
          <span class="weight-label">{{ weight.label }}</span>
          <span class="weight-number">{{ weight.value }}</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         FLUIDE SCHRIFTSKALA — wie _typography.scss (Plan v2, 2.3)
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">
        Schriftskala
        <span class="te-count">{{ skala.length }} Stufen · fluide {{ p.viewportMin }}–{{ p.viewportMax }} px</span>
        <span v-if="geaendert" class="te-badge">geändert</span>
      </h3>
      <p class="te-desc">
        Jede Stufe wächst zwischen {{ p.viewportMin }} und {{ p.viewportMax }} px Viewport-Breite von ihrem
        Minimal- zum Maximalwert: Basis &times; Verhältnis<sup>Stufe</sup>. Die kleinen Stufen sind feste Werte,
        keine Stufe fällt unter {{ p.boden }} px.
      </p>

      <div class="te-params">
        <div class="te-param">
          <label class="te-param-feld">
            <span>Basis bei {{ p.viewportMin }} px</span>
            <input type="number" step="0.5" min="10" max="32" :value="p.baseMin" :aria-describedby="`${uid}-bereich-base_min_px`"
                   @change="store.updateTypeScale('base_min_px', $event.target.value)" /> px
          </label>
          <FeldBereich :id="`${uid}-bereich-base_min_px`" :text="erlaubterBereich('schriftskala', 'base_min_px')" />
        </div>
        <div class="te-param">
          <label class="te-param-feld">
            <span>Basis bei {{ p.viewportMax }} px</span>
            <input type="number" step="0.5" min="10" max="32" :value="p.baseMax" :aria-describedby="`${uid}-bereich-base_max_px`"
                   @change="store.updateTypeScale('base_max_px', $event.target.value)" /> px
          </label>
          <FeldBereich :id="`${uid}-bereich-base_max_px`" :text="erlaubterBereich('schriftskala', 'base_max_px')" />
        </div>
        <div class="te-param">
          <label class="te-param-feld">
            <span>Verhältnis klein</span>
            <input type="number" step="0.01" min="1" max="1.618" :value="p.ratioMin" :aria-describedby="`${uid}-bereich-ratio_min`"
                   @change="store.updateTypeScale('ratio_min', $event.target.value)" />
          </label>
          <FeldBereich :id="`${uid}-bereich-ratio_min`" :text="erlaubterBereich('schriftskala', 'ratio_min')" />
        </div>
        <div class="te-param">
          <label class="te-param-feld">
            <span>Verhältnis groß</span>
            <input type="number" step="0.01" min="1" max="1.618" :value="p.ratioMax" :aria-describedby="`${uid}-bereich-ratio_max`"
                   @change="store.updateTypeScale('ratio_max', $event.target.value)" />
          </label>
          <FeldBereich :id="`${uid}-bereich-ratio_max`" :text="erlaubterBereich('schriftskala', 'ratio_max')" />
        </div>
        <button v-if="geaendert" type="button" class="te-reset" @click="store.resetTypeScale()">
          Auf Design System zurücksetzen
        </button>
      </div>

      <label class="te-vw">
        <span>Vorschau bei <strong>{{ vw }} px</strong> Viewport</span>
        <input type="range" :min="p.viewportMin" :max="p.viewportMax" step="10" v-model.number="vw"
               aria-label="Viewport-Breite für die Vorschau" />
      </label>

      <div class="scale-list">
        <div v-for="s in skala" :key="s.stufe" class="scale-row">
          <span class="scale-name">
            {{ s.stufe }}
            <span v-if="s.fest" class="te-fest" title="fester Wert, nicht aus dem Verhältnis">fest</span>
          </span>
          <span class="scale-sample" :style="{ fontSize: groesse(s) + 'px', fontFamily: bodyFontFamily }">The quick brown fox</span>
          <span class="scale-value" :title="`--fs-${s.stufe}: ${s.css}`">
            {{ px(groesse(s)) }} <span class="te-range">{{ px(s.minPx) }}–{{ px(s.maxPx) }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         TYPO-ROLLEN — heading / paragraph / display
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">Typo-Rollen <span class="te-count">bei {{ vw }} px</span></h3>
      <p class="te-desc">
        Überschriften und Fließtext verweisen auf Stufen der Skala und folgen ihr automatisch;
        Display-Größen haben eigene Grenzen. Zeilenhöhe: Überschrift &times;{{ lh.heading }}, Text &times;{{ lh.body }}.
      </p>
      <div class="scale-list">
        <div v-for="r in rollen" :key="r.id" class="scale-row">
          <span class="scale-name te-role">{{ r.id }} <span class="te-range">{{ r.quelle }}</span></span>
          <span class="scale-sample" :style="{ fontSize: r.px + 'px', lineHeight: r.lh, letterSpacing: r.ls, fontFamily: r.art === 'paragraph' ? bodyFontFamily : headingFamily }">{{ r.art === 'paragraph' ? 'Fließtext liest sich ruhig' : 'Überschrift' }}</span>
          <span class="scale-value">{{ px(r.px) }}</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import HinzufuegenFormular from '../ui/HinzufuegenFormular.vue'
import FeldBereich from '../ui/FeldBereich.vue'
import SchriftRolleWahl from '../editors/SchriftRolleWahl.vue'
import { erlaubterBereich } from '../../utils/token-pruefung.js'
import { ref, reactive, computed, watch, onMounted, onUnmounted, useId } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens, typographyScale } from '../../data/tokens.js'
import { skalenParameter, berechneSkala, groesseBei, istGeaendert } from '../../utils/fluid-scale.js'
import { speicher } from '../../speicher/index.js'
import { pruefeFontStack } from '../../utils/css-wert.js'
import { bestaetigen } from '../../composables/useBestaetigung.js'
import { ersteFamilie, baueGoogleUrl, pruefeFamilieZurUrl, pruefeLadbarkeit } from '../../utils/google-schrift.js'
import DrupalSchriften from '../drupal/DrupalSchriften.vue'
import { ladeServerSchriften, serverSchriften } from '../../composables/useServerSchriften.js'

const drupalBetrieb = speicher().art === 'drupal'
// Auf der Bühne (TypografieBuehne) erscheint der Editor ein zweites Mal —
// die Schriftverwaltung nur einmal, im Inspector.
defineProps({ buehne: { type: Boolean, default: false } })
/** eindeutige ids je Instanz — der Editor steht auf der Bühne und in den Einstellungen (R06) */
const uid = useId()

const store = useThemeStore()
const typoTokens = foundationTokens.typography.tokens

// ---------------------------------------------------------------------------
// Is the user on the factory default NEO Theme?
// ---------------------------------------------------------------------------
const isDefaultNeo = computed(() => {
  return store.state.activeThemeSet === 'neo' && store.state.currentThemeMeta === null
})

const currentThemeName = computed(() => {
  if (store.state.currentThemeMeta) return store.state.currentThemeMeta.name
  return store.state.activeThemeSet === 'neo' ? 'NEO-Standard' : 'NEO-Standard, Variante Kunde'
})

// ---------------------------------------------------------------------------
// Default NEO fonts (read-only display)
// ---------------------------------------------------------------------------
const defaultFonts = [
  { id: 'body', role: 'Body', label: 'Manrope', primary: 'Manrope', value: typoTokens['font-body'].value },
  { id: 'heading', role: 'Heading', label: 'Space Grotesk', primary: 'Space Grotesk', value: typoTokens['font-heading'].value },
  { id: 'mono', role: 'Mono', label: 'JetBrains Mono', primary: 'JetBrains Mono', value: typoTokens['font-mono'].value }
]

// ---------------------------------------------------------------------------
// Active theme font families (editable for non-default)
// ---------------------------------------------------------------------------
const ROLLEN_WIRKUNG = {
  body: 'Wirkt auf Fließtext und Navigation — und auf Buttons und Formulare, solange „Bedienelemente“ auf Body steht.',
  heading: 'Wirkt auf Überschriften (H1–H6), Hero- und Abschnittstitel.',
  mono: 'Wirkt auf Eyebrows/Kicker, Tabellenköpfe, Zähler und Code.',
  ui: 'Wirkt auf Buttons, Formularfelder, Badges, Chips, Tags, Brotkrumen und Seitenzahlen. Jede dieser Komponenten kann in ihren Einstellungen eine andere Rolle wählen.',
}

// Rolle Bedienelemente: Wert ist immer ein Verweis var(--font-body|heading|mono)
const uiRolle = computed(() => {
  const typo = store.currentFoundation?.typography || {}
  const value = typo['font-ui'] || typoTokens['font-ui'].value
  const ziel = (String(value).match(/--font-(body|heading|mono)/) || [])[1] || 'body'
  return { value, familie: typo[`font-${ziel}`] || typoTokens[`font-${ziel}`].value }
})

function updateUiRolle (wert) {
  store.updateFoundationToken('typography', 'font-ui', wert)
}

const activeFonts = computed(() => {
  const foundation = store.currentFoundation
  const typo = foundation?.typography || {}
  return ['body', 'heading', 'mono'].map((id) => {
    const tokenKey = `font-${id}`
    return {
      id,
      role: id === 'body' ? 'Body' : id === 'heading' ? 'Heading' : 'Mono',
      tokenKey,
      cssVar: typoTokens[tokenKey].cssVar,
      wirkung: ROLLEN_WIRKUNG[id],
      value: typo[tokenKey] || typoTokens[tokenKey].value,
      placeholder: typoTokens[tokenKey].value,
    }
  })
})

// ---------------------------------------------------------------------------
// Rollen-Auswahl (15.10.2026): Schrift je Rolle aus einer Liste statt Freitext
// ---------------------------------------------------------------------------
const EIGENE = '__eigene__'
const SYSTEM_SCHRIFTEN = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'system-ui']
const NEO_SCHRIFTEN = [
  { familie: 'Manrope', token: 'font-body' },
  { familie: 'Space Grotesk', token: 'font-heading' },
  { familie: 'JetBrains Mono', token: 'font-mono' },
]

/** Erste Familie eines Font-Stacks, ohne Anführungszeichen */
/** Ersatzschriften der Rolle (alles nach der ersten Schrift des NEO-Stacks) */
function ersatz (tokenKey) {
  return String(typoTokens[tokenKey]?.value || 'sans-serif').split(',').slice(1).map(s => s.trim()).filter(Boolean).join(', ')
}

function schriftGruppen (font) {
  const google = (customFonts.value || []).map(f => ({ familie: ersteFamilie(f.family) })).filter(o => o.familie)
  const server = (serverSchriften.value || []).map(f => ({ familie: f.familie, zusatz: f.quelle === 'server' ? 'Server-Ordner' : 'hochgeladen' }))
  const gruppen = [
    { label: 'NEO Design System', optionen: NEO_SCHRIFTEN.map(n => ({ familie: n.familie, zusatz: n.token === font.tokenKey ? 'NEO-Standard' : '' })) },
    { label: 'Systemschriften', optionen: SYSTEM_SCHRIFTEN.map(f => ({ familie: f })) },
  ]
  if (google.length) gruppen.push({ label: 'Google-Schriften (dieses Theme)', optionen: google })
  if (server.length) gruppen.push({ label: 'Schriften auf dem Server', optionen: server })
  return gruppen
}

/** Welche Option zeigt die Auswahl? Unbekannte erste Familie = eigene Angabe. */
function auswahlWert (font) {
  const erste = ersteFamilie(font.value)
  const alle = schriftGruppen(font).flatMap(g => g.optionen.map(o => o.familie))
  return alle.find(f => f.toLowerCase() === erste.toLowerCase()) || EIGENE
}

/** Rolle auf eine Schrift setzen: NEO-Schrift der Rolle = Standard-Stack (keine Abweichung). */
function weiseZu (font, familie) {
  const neo = NEO_SCHRIFTEN.find(n => n.familie === familie)
  if (neo && neo.token === font.tokenKey) {
    updateFontFamily(font.tokenKey, typoTokens[font.tokenKey].value)
    return
  }
  const name = /[\s]/.test(familie) && !/^system-ui$/.test(familie) ? `'${familie}'` : familie
  updateFontFamily(font.tokenKey, `${name}, ${ersatz(font.tokenKey)}`)
}

// UX-36: „Als …“ an einer Google-Schrift übernimmt den eingegebenen Stack;
// nur eine einzelne Schrift bekommt die Ersatzschriften der Rolle
function weiseStackZu (font, stack) {
  const teile = String(stack || '').split(',').map(t => t.trim()).filter(Boolean)
  if (teile.length < 2) return weiseZu(font, ersteFamilie(stack))
  updateFontFamily(font.tokenKey, teile.join(', '))
}

function waehleSchrift (font, wert) {
  if (wert === EIGENE) return
  weiseZu(font, wert)
}

// Body font family for weight/scale preview
const bodyFontFamily = computed(() => {
  if (isDefaultNeo.value) return typoTokens['font-body'].value
  const foundation = store.currentFoundation
  return foundation?.typography?.['font-body'] || typoTokens['font-body'].value
})

// Fehler am Feld (UX-02): ein ungültiger Font-Stack wird nicht übernommen
const feldFehler = reactive({})
const GOOGLE_URL = /^https:\/\/fonts\.googleapis\.com\/css2?\?[^"'\\\s<>]+$/
function pruefeGoogleUrl (url) {
  const u = String(url || '').trim()
  if (!u) return null
  return GOOGLE_URL.test(u) ? null : 'Nur Adressen von Google Fonts: https://fonts.googleapis.com/css2?family=…'
}

function updateFontFamily(tokenKey, value, feld) {
  const fehler = pruefeFontStack(value)
  if (feld) feldFehler[feld] = fehler || ''
  if (fehler) return
  store.updateFoundationToken('typography', tokenKey, value.trim())
}

// ---------------------------------------------------------------------------
// Custom Font Families (store-managed, persisted via theme snapshot)
// ---------------------------------------------------------------------------
const customFonts = computed(() => store.state.customFonts[store.state.activeThemeSet])
const schriftFelder = [
  { name: 'name', label: 'Name', pflicht: true, platzhalter: 'z. B. Inter' },
  { name: 'stack', label: 'Font-Stack', pflicht: true, breit: true, platzhalter: 'z. B. Inter, Helvetica Neue, sans-serif', hilfe: 'Die Schrift und ihre Ersatzschriften, durch Kommas getrennt. „Als Body/Heading/Mono“ übernimmt genau diesen Stack.' },
  { name: 'url', label: 'Google-Fonts-Adresse (optional)', breit: true, platzhalter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', hilfe: 'Leer lassen: Die Adresse wird aus der ersten Schrift des Font-Stacks gebaut (nur Stärke 400). Für weitere Stärken die Adresse von fonts.google.com einfügen.' },
]

// UX-14: ohne Adresse lädt die Website die Schrift nie — dann aus dem
// Font-Stack bauen; Adresse und Stack müssen dieselbe Familie nennen
const schriftAdresse = (stack, url) => String(url ?? '').trim() || baueGoogleUrl(ersteFamilie(String(stack).trim()))

function pruefeNeueSchrift ({ name, stack, url }) {
  const n = String(name ?? '').trim()
  const st = String(stack ?? '').trim()
  if (!n) return { feld: 'name', text: 'Bitte geben Sie einen Namen ein, z. B. Inter.' }
  if (pruefeFontStack(n)) return { feld: 'name', text: 'Im Namen sind nur Buchstaben, Ziffern, Leerzeichen und . _ - erlaubt.' }
  if (!st) return { feld: 'stack', text: 'Bitte geben Sie den Font-Stack ein, z. B. Inter, sans-serif.' }
  const fStack = pruefeFontStack(st)
  if (fStack) return { feld: 'stack', text: fStack }
  const adresse = schriftAdresse(st, url)
  const fUrl = pruefeGoogleUrl(adresse) || pruefeFamilieZurUrl(st, adresse)
  if (fUrl) return { feld: String(url ?? '').trim() ? 'url' : 'stack', text: fUrl }
  return null
}

// Track dynamically loaded font stylesheets
const loadedStylesheets = ref(new Map())

function addCustomFont ({ name, stack, url }) {
  const family = stack.trim()
  const adresse = schriftAdresse(family, url)
  const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)
  store.state.customFonts[store.state.activeThemeSet].push({ id, name: name.trim(), family, url: adresse })
  loadGoogleFont(id, adresse, family)
}

// UX-49: Rückfrage; Rollen, die die Schrift nutzen, bekommen die NEO-Schrift
async function removeCustomFont(id) {
  const themeSet = store.state.activeThemeSet
  const font = store.state.customFonts[themeSet].find(f => f.id === id)
  if (!font) return
  const familie = ersteFamilie(font.family)
  const rollen = activeFonts.value.filter(r => ersteFamilie(r.value) === familie)
  const ok = await bestaetigen({
    titel: 'Google-Schrift entfernen?',
    text: `${font.name} wird aus diesem Theme entfernt.` + (rollen.length
      ? ` Sie ist als ${rollen.map(r => r.role).join(' und ')} zugewiesen — diese Rolle${rollen.length > 1 ? 'n bekommen' : ' bekommt'} wieder die NEO-Schrift.`
      : ''),
    bestaetigenText: 'Entfernen',
    gefaehrlich: true,
  })
  if (!ok) return
  store.state.customFonts[themeSet] = store.state.customFonts[themeSet].filter(f => f.id !== id)
  unloadGoogleFont(id)
  for (const r of rollen) updateFontFamily(r.tokenKey, typoTokens[r.tokenKey].value)
}

function updateCustomFontName(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  if (font) {
    font.name = value
  }
}

function updateCustomFontFamily(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  const fehler = pruefeFontStack(value) || (font?.url ? pruefeFamilieZurUrl(value, font.url) : null)
  feldFehler['gf-family-' + id] = fehler || ''
  if (font && !fehler) {
    font.family = value.trim()
  }
}

function updateCustomFontUrl(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  if (!font) return
  // Leer: Adresse aus dem Font-Stack bauen (UX-14)
  const url = String(value || '').trim() || baueGoogleUrl(ersteFamilie(font.family))
  const fehler = pruefeGoogleUrl(url) || pruefeFamilieZurUrl(font.family, url)
  feldFehler['gf-url-' + id] = fehler || ''
  if (fehler) return
  font.url = url
  loadGoogleFont(id, url, font.family)
}

// Reload font stylesheets when theme or customFonts change
watch(customFonts, (newFonts, oldFonts) => {
  // Unload stylesheets for fonts no longer present
  const newIds = new Set((newFonts || []).map(f => f.id))
  loadedStylesheets.value.forEach((_, id) => {
    if (!newIds.has(id)) unloadGoogleFont(id)
  })
  // Load stylesheets for new fonts
  ;(newFonts || []).forEach(f => {
    if (f.url && !loadedStylesheets.value.has(f.id)) {
      loadGoogleFont(f.id, f.url, f.family)
    }
  })
}, { deep: true })

// ---------------------------------------------------------------------------
// Dynamic Google Font Loading
// ---------------------------------------------------------------------------
// Ladbarkeit je eigener Schrift (UX-14): 'laedt' | 'ok' | 'fehler' | 'unbekannt'
const schriftStand = reactive({})

function loadGoogleFont(id, url, family) {
  // Remove existing if any
  unloadGoogleFont(id)
  // Only load URLs from Google Fonts
  if (!url.includes('fonts.googleapis.com')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  link.dataset.customFontId = id
  schriftStand[id] = 'laedt'
  pruefeLadbarkeit(link, ersteFamilie(family)).then((stand) => {
    if (loadedStylesheets.value.get(id) === link) schriftStand[id] = stand
  })
  document.head.appendChild(link)
  loadedStylesheets.value.set(id, link)
}

function unloadGoogleFont(id) {
  delete schriftStand[id]
  const link = loadedStylesheets.value.get(id)
  if (link) {
    link.remove()
    loadedStylesheets.value.delete(id)
  }
}

// Load custom font stylesheets on mount
onMounted(() => {
  if (drupalBetrieb) ladeServerSchriften()
  customFonts.value.forEach(f => {
    if (f.url) loadGoogleFont(f.id, f.url, f.family)
  })
})

// Cleanup on unmount
onUnmounted(() => {
  loadedStylesheets.value.forEach((_, id) => unloadGoogleFont(id))
})

// ---------------------------------------------------------------------------
// Font Weights & Type Scale (shared between default and custom themes)
// ---------------------------------------------------------------------------
// Schriftstaerken aus der Quelle (foundation._configurator.typography)
const weights = computed(() => Object.entries(typoTokens)
  .filter(([k]) => k.startsWith('weight-'))
  .map(([k, t]) => ({
    id: k, label: t.label, cssVar: t.cssVar,
    value: store.currentFoundation?.typography?.[k] ?? t.value,
    heading: k.startsWith('weight-heading'), mono: k === 'weight-mono',
  })))

// Fluide Schriftskala (Plan v2, 2.3) — Rechnung in utils/fluid-scale.js
const p = computed(() => skalenParameter(typographyScale, store.currentTypeScale))
const skala = computed(() => berechneSkala(p.value))
const geaendert = computed(() => istGeaendert(typographyScale, store.currentTypeScale))
const vw = ref(1440)
const groesse = (stufe) => groesseBei(stufe, vw.value, p.value)
const px = (x) => `${Math.round(x * 10) / 10} px`
const lh = typographyScale.line_height

const headingFamily = computed(() => store.currentFoundation?.typography?.['font-heading'] || typoTokens['font-heading'].value)
const monoFamily = computed(() => store.currentFoundation?.typography?.['font-mono'] || typoTokens['font-mono'].value)

// Rollen: heading/paragraph zeigen auf Stufen, display hat eigene Grenzen (rem)
const rollen = computed(() => {
  const m = typographyScale.mappings
  const stufe = (name) => skala.value.find((s) => s.stufe === name)
  const ls = (art, groesse) => typographyScale.roles?.[art]?.[groesse]?.letter_spacing
  const liste = []
  for (const [g, d] of Object.entries(m.display || {})) {
    const s = { minPx: d.min_rem * 16, maxPx: d.max_rem * 16 }
    liste.push({ id: `display-${g}`, art: 'display', quelle: `${d.min_rem}–${d.max_rem} rem`, px: groesse(s), lh: lh.heading, ls: ls('display', g) })
  }
  for (const [g, name] of Object.entries(m.heading || {})) {
    const s = stufe(name)
    if (s) liste.push({ id: `heading-${g}`, art: 'heading', quelle: `--fs-${name}`, px: groesse(s), lh: lh.heading, ls: ls('heading', g) })
  }
  for (const [g, name] of Object.entries(m.paragraph || {})) {
    const s = stufe(name)
    if (s) liste.push({ id: `paragraph-${g}`, art: 'paragraph', quelle: `--fs-${name}`, px: groesse(s), lh: lh.body, ls: ls('paragraph', g) })
  }
  return liste
})
</script>

<style scoped>
.typography-editor { display: flex; flex-direction: column; gap: 32px; }
.token-section { display: flex; flex-direction: column; gap: 16px; }

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

.theme-name-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
  margin-left: auto;
}

/* ═══════════════════════════════════════════════════════════════════
   FONT CARDS
   ═══════════════════════════════════════════════════════════════════ */
.font-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.font-card {
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cfg-surface);
  display: flex;
  flex-direction: column;
}

.font-card--locked {
  opacity: 0.9;
  position: relative;
}

.font-card--locked::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    color-mix(in srgb, var(--cfg-text-muted) 3%, transparent) 8px,
    color-mix(in srgb, var(--cfg-text-muted) 3%, transparent) 16px
  );
}

.font-preview {
  padding: 20px;
  background: var(--cfg-surface-elevated);
  text-align: center;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-sample {
  font-size: 24px;
  color: var(--cfg-text);
}

.font-info {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.font-role-badge {
  display: inline-flex;
  align-self: flex-start;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--cfg-info-bg);
  color: var(--cfg-info-text);
}

.font-role-badge--custom {
  background: var(--cfg-warning-bg);
  color: var(--cfg-warning-text);
}

.font-label { font-size: 13px; font-weight: 600; color: var(--cfg-text); }
.font-value { font-size: 10px; color: var(--cfg-text-muted); }
.font-value--stack { white-space: normal; overflow-wrap: anywhere; color: var(--cfg-text-secondary); }

/* Rollen-Auswahl (15.10.2026) */
.feld-fehler { margin: 4px 0 0; font-size: 12px; line-height: 1.4; color: var(--cfg-danger); }
.font-input[aria-invalid='true'] { border-color: var(--cfg-danger); }
.font-wirkung { margin: 0; font-size: 12px; line-height: 1.4; color: var(--cfg-text-secondary); }
.font-select-label { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
.font-select {
  width: 100%;
  min-height: 32px;
  padding: 4px 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font: inherit;
  font-size: 13px;
}
.font-select:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 1px; }
.font-eigene summary { cursor: pointer; font-size: 11px; color: var(--cfg-text-secondary); padding: 2px 0; }
.font-eigene summary:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 1px; border-radius: 3px; }
.font-eigene[open] summary { margin-bottom: 4px; }
.font-untertitel { margin: 8px 0 0; font-size: 13px; font-weight: 700; color: var(--cfg-text); }
.font-rollen { display: flex; flex-wrap: wrap; gap: 4px; }
.font-rolle-btn {
  min-height: 28px;
  padding: 2px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.font-rolle-btn[aria-pressed='true'] { background: var(--cfg-accent-subtle); border-color: var(--cfg-accent); font-weight: 600; }
.font-rolle-btn:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 1px; }

.font-edit-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.font-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;
}

.font-input:focus {
  border-color: var(--cfg-accent);
}

.font-input--name {
  font-family: inherit;
  font-weight: 600;
}

.font-input--url {
  font-size: 10px;
}

.font-url-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════════════════
   ADD FONT CARD
   ═══════════════════════════════════════════════════════════════════ */
.add-font-card {
  border-style: dashed;
  min-height: 140px;
  justify-content: center;
  align-items: center;
}

.add-font-card > .hf { width: 100%; }
.add-font-card :deep(.hf-oeffnen) { justify-self: center; }

.add-font-preview {
  padding: 12px;
  background: var(--cfg-surface-elevated);
  border-radius: 6px;
  text-align: center;
}


.btn-remove {
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

/* ═══════════════════════════════════════════════════════════════════
   WEIGHTS & TYPE SCALE
   ═══════════════════════════════════════════════════════════════════ */
.weight-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.weight-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  min-width: 70px;
}

.weight-preview { font-size: 24px; color: var(--cfg-text); }
.weight-label { font-size: 10px; font-weight: 500; color: var(--cfg-text-muted); }
.weight-number { font-size: 10px; font-family: monospace; color: var(--cfg-text-muted); }

.scale-list { display: flex; flex-direction: column; gap: 2px; }

.scale-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 6px;
}

.scale-row:hover { background: var(--cfg-surface-elevated); }

.scale-name {
  width: 40px;
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
}

.scale-sample {
  flex: 1;
  color: var(--cfg-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scale-value {
  font-size: 11px;
  font-family: monospace;
  color: var(--cfg-text-muted);
}

/* ── Plan v2, 2.3: fluide Skala ── */
.te-count { margin-left: 8px; font-size: 10px; font-weight: 600; color: var(--cfg-text-muted); background: var(--cfg-surface-elevated); padding: 2px 6px; border-radius: 4px; }
.te-badge { margin-left: 6px; font-size: 10px; font-weight: 600; color: var(--cfg-accent); border: 1px solid var(--cfg-accent); padding: 1px 6px; border-radius: 4px; }
.te-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }
.te-params { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px 12px; align-items: end; }
.te-param { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--cfg-text-muted); }
/* R06: Bereichshinweis neben dem Label, nicht darin (sonst Teil des Feldnamens) */
.te-param-feld { display: flex; flex-direction: column; gap: 4px; }
.te-param input { width: 90px; height: 26px; padding: 0 6px; border: 1px solid var(--cfg-border); border-radius: 4px; background: var(--cfg-surface-elevated); color: var(--cfg-text); font-family: monospace; font-size: 11px; }
.te-param input:focus { outline: none; border-color: var(--cfg-accent); }
.te-reset { height: 28px; padding: 0 10px; border: 1px solid var(--cfg-border); border-radius: 4px; background: transparent; color: var(--cfg-text); font-size: 11px; cursor: pointer; }
.te-reset:hover { border-color: var(--cfg-accent); }
.te-vw { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--cfg-text-muted); }
.te-vw input { width: 100%; }
.te-fest { margin-left: 4px; font-size: 9px; color: var(--cfg-text-muted); border: 1px solid var(--cfg-border); padding: 0 4px; border-radius: 3px; }
.te-range { display: block; font-size: 9px; color: var(--cfg-text-muted); }
.te-role { min-width: 110px; }
</style>
