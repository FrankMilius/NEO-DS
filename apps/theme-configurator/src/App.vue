<template>
  <div
    class="app-shell"
    :class="{ 'sidebar-collapsed': leisteZu, 'mit-hinweis': mitHinweis, 'app-shell--kompakt': kompakt, 'app-shell--overlay-offen': kompakt && overlayOffen }"
    :data-ansicht="kompakt ? kompaktAnsicht : null"
    @keydown.escape="overlaySchliessen"
  >
    <!-- UX-46: Sprunglinks, sichtbar beim ersten Tab -->
    <nav class="sprunglinks" aria-label="Sprunglinks">
      <button v-for="z in SPRUNGZIELE" :key="z.id" type="button" class="sprunglinks__link" :data-test="`sprung-${z.id}`" @click="springe(z.id)">{{ z.label }}</button>
    </nav>
    <AppHeader @toggle-sidebar="toggleSidebar" :sidebarCollapsed="leisteZu" />
    <DrupalRechteHinweis v-if="mitHinweis" />
    <!-- UX-04: unter 1200 px Bühne und Inspector als Tabs -->
    <div v-if="kompakt" class="kompakt-tabs" role="tablist" aria-label="Ansicht">
      <button
        v-for="t in KOMPAKT_TABS"
        :key="t.id"
        type="button"
        role="tab"
        class="kompakt-tabs__tab"
        :aria-selected="kompaktAnsicht === t.id ? 'true' : 'false'"
        :data-test="`kompakt-tab-${t.id}`"
        @click="kompaktAnsicht = t.id"
      >{{ t.label }}</button>
    </div>
    <div class="app-body">
      <SidebarNav :collapsed="leisteZu" @toggle="toggleSidebar" />
      <div v-if="kompakt && overlayOffen" class="kompakt-schleier" aria-hidden="true" @click="overlaySchliessen"></div>
      <ErrorBoundary panelLabel="Die Bühne">
        <LaboratoryPanel />
      </ErrorBoundary>
      <ErrorBoundary panelLabel="Die Spalte „Einstellungen“">
        <InspectorPanel />
      </ErrorBoundary>
    </div>
    <UpdateDialog />
    <KonfigBestaetigung />
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from './stores/theme.js'
import { useStyleguideSync } from './stores/styleguide-sync.js'
import AppHeader from './components/layout/AppHeader.vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import InspectorPanel from './components/layout/InspectorPanel.vue'
import LaboratoryPanel from './components/laboratory/LaboratoryPanel.vue'
import UpdateDialog from './components/components/UpdateDialog.vue'
import ErrorBoundary from './components/layout/ErrorBoundary.vue'
import KonfigBestaetigung from './components/ui/KonfigBestaetigung.vue'
import { starteHashRouter } from './navigation/hash-router.js'
import DrupalRechteHinweis from './components/drupal/DrupalRechteHinweis.vue'
import { darf, speicher } from './speicher/index.js'
import { starteDrupalBetrieb } from './composables/useDrupalBetrieb.js'
import { neoAnsicht } from './composables/neoAnsicht.js'
import { seitenTitel } from './navigation/namen.js'
import { useTechnischeNamen } from './composables/useTechnischeNamen.js'

const store = useThemeStore()
const sync = useStyleguideSync()

// Drupal-Betrieb (Plan v2, 2.6): Katalog aus Drupal, Speicherstatus;
// ohne Recht „bearbeiten“ nur Ansicht. Lokal bleibt alles wie bisher.
const drupal = speicher().art === 'drupal'
const nurAnsicht = drupal && !darf('bearbeiten')
// Hinweisleiste: ohne Recht „bearbeiten“ oder beim Ansehen des NEO-Standards
const mitHinweis = computed(() => nurAnsicht || (drupal && neoAnsicht.value))
let stoppeDrupal = null

// Sidebar collapse state (persisted)
const SIDEBAR_KEY = 'neo-cfg-sidebar-collapsed'
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')

// UX-04 (Usability-Audit 15.10.2026): Bei 1024 px blieben der Bühne 184 px,
// bei 720 px (≈ 200 % Zoom) verschwand sie, Knöpfe der Kopfleiste lagen
// außerhalb. Unter 1200 px („kompakt“): Bühne und Inspector als Tabs in
// voller Breite, die Sidebar als schmale Leiste, aufgeklappt über dem Inhalt.
const KOMPAKT_GRENZE = '(max-width: 1199px)'
const KOMPAKT_TABS = [{ id: 'buehne', label: 'Bühne' }, { id: 'inspector', label: 'Einstellungen' }]
const kompaktAbfrage = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(KOMPAKT_GRENZE) : null
const kompakt = ref(!!kompaktAbfrage?.matches)
const kompaktAnsicht = ref('buehne')
const overlayOffen = ref(false)
function kompaktGeaendert (e) { kompakt.value = e.matches; overlayOffen.value = false }
kompaktAbfrage?.addEventListener?.('change', kompaktGeaendert)
const leisteZu = computed(() => (kompakt.value ? !overlayOffen.value : sidebarCollapsed.value))
function overlaySchliessen () { if (kompakt.value) overlayOffen.value = false }
// Auswahl in der Sidebar schließt die Überlagerung
watch(() => store.state.activeSection, overlaySchliessen)
// Seitentitel je Bereich (WCAG 2.4.2, Befund UX-56): vorher blieb er gleich
watch(() => store.state.activeSection, (id) => { document.title = seitenTitel(id) }, { immediate: true })
// UX-20: technische Angaben überall ausblendbar (Klasse am Dokument, style.css)
const technik = useTechnischeNamen()
watch(technik, (an) => document.documentElement.classList.toggle('cfg-ohne-technik', !an), { immediate: true })

// UX-46: Sprungziele (Knöpfe statt Anker: der Hash gehört dem Router)
const SPRUNGZIELE = [
  { id: 'navigation', label: 'Zur Navigation' },
  { id: 'buehne', label: 'Zur Bühne' },
  { id: 'inspector', label: 'Zu den Einstellungen' },
]
function springe (ziel) {
  if (kompakt.value && (ziel === 'buehne' || ziel === 'inspector')) kompaktAnsicht.value = ziel
  if (ziel === 'navigation' && leisteZu.value) toggleSidebar()
  nextTick(() => {
    const el = ziel === 'navigation' ? document.querySelector('[data-test="sidebar-suche"]') : document.getElementById(`cfg-${ziel}`)
    el?.focus()
  })
}

function toggleSidebar () {
  if (kompakt.value) { overlayOffen.value = !overlayOffen.value; return }
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed.value)
}

// In Eingabefeldern gehoert Cmd+Z dem Browser (Text-Undo), nicht dem Theme.
function isTextInput (el) {
  if (!el) return false
  const tag = el.tagName
  if (el.isContentEditable || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag !== 'INPUT') return false
  return !['checkbox', 'radio', 'range', 'color', 'button', 'submit'].includes(el.type)
}

function onKeydown (e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !isTextInput(e.target)) {
    e.preventDefault()
    if (e.shiftKey) {
      store.redo()
    } else {
      store.undo()
    }
  }
  // Toggle Sidebar: Ctrl+B (wie VS Code)
  if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
    e.preventDefault()
    toggleSidebar()
  }
}

// Deep-Links: Sektion ↔ URL-Hash (Plan v2, 3.4). Start nach loadFromStorage,
// damit ein Hash in der URL den gespeicherten Stand ueberschreibt.
let stoppeHashRouter = null

onMounted(() => {
  store.loadFromStorage()
  stoppeHashRouter = starteHashRouter(store)
  if (drupal) {
    // Styleguide-Abgleich spricht den lokalen Docs-Server — nicht in Drupal
    starteDrupalBetrieb(store).then((stopp) => { stoppeDrupal = stopp })
  } else {
    sync.fetchExistingPalettes()
  }
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  stoppeHashRouter?.()
  stoppeDrupal?.()
  kompaktAbfrage?.removeEventListener?.('change', kompaktGeaendert)
})
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-rows: 44px 1fr;
  grid-template-columns: 240px 1fr auto;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  transition: grid-template-columns 0.2s ease;
}

.app-shell.sidebar-collapsed {
  grid-template-columns: 44px 1fr auto;
}

/* Drupal-Betrieb ohne Recht „bearbeiten“: Hinweiszeile unter dem Header */
.app-shell.mit-hinweis {
  grid-template-rows: 44px auto 1fr;
}

.app-shell > .app-header {
  /* AppHeader: spans full width (nicht :first-child — davor stehen die Sprunglinks) */
  grid-column: 1 / -1;
}

.app-body {
  display: contents;
}

/* UX-04: kompakt (unter 1200 px) — Kopf, [Hinweis], Tabs, Inhalt */
.app-shell.app-shell--kompakt {
  grid-template-columns: 44px minmax(0, 1fr);
  grid-template-rows: auto auto minmax(0, 1fr);
}
.app-shell.app-shell--kompakt.mit-hinweis {
  grid-template-rows: auto auto auto minmax(0, 1fr);
}
.app-shell--kompakt.mit-hinweis > .drh { grid-column: 1 / -1; }
.app-shell--kompakt > .kompakt-tabs { grid-column: 2; grid-row: -3 / -2; }
</style>

<style>
/* ── UX-04: kompaktes Layout unter 1200 px (nicht scoped: betrifft die
   Wurzeln von Sidebar, Bühne und Inspector) ── */
.app-shell--kompakt .sidebar-nav { grid-column: 1; grid-row: -3 / -1; }
.app-shell--kompakt .laboratory-panel,
.app-shell--kompakt .inspector-panel { grid-column: 2; grid-row: -2 / -1; min-width: 0; }
.app-shell--kompakt .inspector-panel { width: auto !important; max-width: none; }
.app-shell--kompakt[data-ansicht="buehne"] .inspector-panel,
.app-shell--kompakt[data-ansicht="inspector"] .laboratory-panel { display: none; }
.app-shell--overlay-offen .sidebar-nav {
  position: relative;
  z-index: var(--cfg-z-dropdown, 50);
  width: min(300px, calc(100vw - 32px));
  box-shadow: var(--cfg-shadow-lg);
}
.sprunglinks { position: fixed; top: env(safe-area-inset-top, 0px); left: 8px; z-index: 10000; display: flex; gap: 6px; }
.sprunglinks__link {
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
  padding: 8px 12px; border: 2px solid var(--cfg-text); border-radius: 6px; background: var(--cfg-surface); color: var(--cfg-text); font-weight: 600; cursor: pointer;
}
.sprunglinks__link:focus { position: static; width: auto; height: auto; overflow: visible; clip: auto; }
.kompakt-schleier {
  position: fixed; inset: 0; z-index: calc(var(--cfg-z-dropdown, 50) - 1);
  background: color-mix(in srgb, #000 30%, transparent);
}
.kompakt-tabs {
  display: flex; gap: 4px; padding: 6px 12px;
  border-bottom: 1px solid var(--cfg-border); background: var(--cfg-surface);
}
.kompakt-tabs__tab {
  flex: 0 1 160px; min-height: 32px; padding: 4px 12px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text); font-size: 13px; cursor: pointer;
}
.kompakt-tabs__tab[aria-selected="true"] { border-color: var(--cfg-accent); box-shadow: inset 0 0 0 1px var(--cfg-accent); font-weight: 600; }
/* Breit: Inspector höchstens 45 % der Breite, damit die Bühne Platz behält */
@media (min-width: 1200px) {
  .inspector-panel { max-width: 45vw; }
}
</style>
