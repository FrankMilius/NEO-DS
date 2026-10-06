/**
 * useArenaHighlight — Composable fuer visuelles Feedback zwischen Inspector und Arena.
 *
 * Liest store.state.highlightedToken und liefert computed-Refs fuer das Highlight-Overlay.
 * Wird in Arena-Komponenten (RecipeArena und die verbliebenen Sonderfall-Arenen) importiert.
 */
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'

export function useArenaHighlight(componentId) {
  const store = useThemeStore()

  const isHighlighted = computed(() => {
    const ht = store.state.highlightedToken
    if (!ht) return false
    // Pruefe ob das Token zu dieser Komponente gehoert
    return ht.tokenId.startsWith(`nc-${componentId}-`)
  })

  const highlightProperty = computed(() => {
    return store.state.highlightedToken?.property || 'box'
  })

  const highlightStyle = computed(() => {
    if (!isHighlighted.value) return {}

    const prop = highlightProperty.value
    const base = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '10',
      transition: 'opacity 0.15s ease'
    }

    // Verschiedene Overlay-Stile je nach Property
    switch (prop) {
      case 'padding-inline':
        return {
          ...base,
          inset: '0',
          borderLeft: '3px solid #06b6d4',
          borderRight: '3px solid #06b6d4',
          background: 'linear-gradient(90deg, color-mix(in srgb, #06b6d4 15%, transparent) 0%, transparent 30%, transparent 70%, color-mix(in srgb, #06b6d4 15%, transparent) 100%)'
        }
      case 'padding-block':
        return {
          ...base,
          inset: '0',
          borderTop: '3px solid #06b6d4',
          borderBottom: '3px solid #06b6d4',
          background: 'linear-gradient(180deg, color-mix(in srgb, #06b6d4 15%, transparent) 0%, transparent 30%, transparent 70%, color-mix(in srgb, #06b6d4 15%, transparent) 100%)'
        }
      case 'height':
        return {
          ...base,
          inset: '0',
          borderTop: '2px dashed #06b6d4',
          borderBottom: '2px dashed #06b6d4',
          background: 'color-mix(in srgb, #06b6d4 8%, transparent)'
        }
      case 'border-radius':
        return {
          ...base,
          inset: '0',
          border: '3px solid #06b6d4',
          borderRadius: 'inherit',
          background: 'color-mix(in srgb, #06b6d4 6%, transparent)'
        }
      case 'gap':
        return {
          ...base,
          inset: '0',
          background: 'repeating-linear-gradient(90deg, color-mix(in srgb, #06b6d4 20%, transparent) 0px, color-mix(in srgb, #06b6d4 20%, transparent) 4px, transparent 4px, transparent 8px)'
        }
      default:
        // Generisches Box-Overlay
        return {
          ...base,
          inset: '0',
          border: '2px solid #06b6d4',
          borderRadius: 'inherit',
          background: 'color-mix(in srgb, #06b6d4 10%, transparent)'
        }
    }
  })

  return {
    isHighlighted,
    highlightProperty,
    highlightStyle
  }
}
