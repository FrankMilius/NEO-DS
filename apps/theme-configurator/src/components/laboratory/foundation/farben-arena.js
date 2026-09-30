// Farben-Arena (foundation-colors, Semantic-Tab): Zustand und Ableitungen.
// Ausgelagert aus LaboratoryPanel.vue (Plan v2, 3.4) — Verhalten unveraendert.
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { componentTokenGroups } from '../../../data/tokens.js'

const SPECIMEN_TOKENS = {
  buttons:    ['interactive-default', 'text-on-interactive', 'text-primary'],
  input:      ['background-base', 'border-primary', 'text-primary', 'text-tertiary'],
  card:       ['layer-01', 'border-secondary', 'text-primary', 'text-secondary', 'text-tertiary'],
  badges:     ['background-success', 'background-danger', 'background-warning', 'background-info',
               'text-success', 'text-danger', 'text-warning', 'text-info'],
  alert:      ['feedback-success', 'feedback-danger', 'background-success', 'background-danger',
               'border-success', 'border-danger'],
  toggle:     ['interactive-default', 'background-tertiary'],
  navigation: ['text-link', 'text-link-hover', 'interactive-visited'],
  textblock:  ['text-primary', 'text-secondary', 'text-tertiary', 'text-disabled'],
  tablerow:   ['layer-01', 'layer-02', 'border-secondary', 'text-primary', 'text-secondary'],
  codesnippet:['layer-01', 'border-secondary', 'text-primary', 'text-secondary', 'text-tertiary',
               'background-base', 'background-secondary']
}

export function useFarbenArena () {
  const store = useThemeStore()

  const isColorsSection = computed(() => store.state.activeSection === 'foundation-colors')

  const isColorSemanticTab = computed(() => isColorsSection.value && store.state.colorActiveTab === 'semantic')

  const semanticCategory = computed(() => store.state.semanticCategory)

  const hasSemanticCategory = computed(() => isColorSemanticTab.value && semanticCategory.value !== null)

  const selectedSemanticToken = computed(() => store.state.selectedToken)

  const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)

  const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

  const activeThemeMode = computed(() => store.state.previewMode === 'split' ? 'light' : store.state.previewMode)

  const activeThemeTokenValue = computed(() => {
    if (!selectedSemanticToken.value) return '#000000'
    const t = activeThemeMode.value === 'dark' ? tDark.value : tLight.value
    return t[selectedSemanticToken.value.id] || '#000000'
  })

  const activeThemeBg = computed(() => {
    const t = activeThemeMode.value === 'dark' ? tDark.value : tLight.value
    return t['background-base'] || '#ffffff'
  })

  const tokenToSpecimens = computed(() => {
    const map = {}
    for (const [specId, tokens] of Object.entries(SPECIMEN_TOKENS)) {
      for (const tok of tokens) {
        if (!map[tok]) map[tok] = []
        if (!map[tok].includes(specId)) map[tok].push(specId)
      }
    }
    return map
  })

  const activeSpecimens = computed(() => {
    if (!selectedSemanticToken.value) return Object.keys(SPECIMEN_TOKENS)
    const id = selectedSemanticToken.value.id
    return tokenToSpecimens.value[id] || []
  })

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

  const highlightedSpecimens = ref(new Set())

  function triggerPulse(ids) {
    for (const id of ids) highlightedSpecimens.value.add(id)
    highlightedSpecimens.value = new Set(highlightedSpecimens.value)
    setTimeout(() => {
      for (const id of ids) highlightedSpecimens.value.delete(id)
      highlightedSpecimens.value = new Set(highlightedSpecimens.value)
    }, 900)
  }

  let prevColorSnapshot = null
  watch(
    () => JSON.stringify(store.state.themes[store.state.activeThemeSet]),
    (next, prev) => {
      if (!prev || !isColorsSection.value) { prevColorSnapshot = next; return }
      try {
        const oldObj = JSON.parse(prev)
        const newObj = JSON.parse(next)
        const changed = []
        for (const mode of ['light', 'dark']) {
          for (const key of Object.keys(newObj[mode] || {})) {
            if (oldObj[mode]?.[key] !== newObj[mode]?.[key]) changed.push(key)
          }
        }
        if (changed.length > 0 && changed.length <= 5) {
          const affected = new Set()
          for (const tokenId of changed) {
            const specs = tokenToSpecimens.value[tokenId]
            if (specs) specs.forEach(s => affected.add(s))
          }
          if (affected.size > 0) triggerPulse(affected)
        }
      } catch {}
      prevColorSnapshot = next
    }
  )

  function contrastColor(hex) {
    if (!hex || hex.length < 7) return '#000'
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return lum > 0.55 ? '#000000' : '#ffffff'
  }

  return {
    store, semanticCategory, hasSemanticCategory, selectedSemanticToken, tLight, tDark,
    activeThemeMode, activeThemeTokenValue, activeThemeBg, activeSpecimens,
    semanticToComponents, highlightedSpecimens, contrastColor
  }
}
