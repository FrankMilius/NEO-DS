// ==========================================================================
// Specimen Click Composable
// ==========================================================================
// Delegiert Klick-Events auf .arena-specimen Elemente im Lab-Panel.
// Liest Recipe-Daten, um focusTokenGroups fuer die Inspector-Filterung
// bereitzustellen. Zeigt Selection-State auf der Specimen-Card.
//
// Funktioniert mit:
//  a) data-specimen-id Attribut (explizit gesetzt)
//  b) Automatisch via .arena-specimen Container (Label als ID)
// ==========================================================================

import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useThemeStore } from '../stores/theme.js'

/**
 * Generiert eine slug-ID aus einem Label-Text.
 * "All States — MD" → "all-states-md"
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Installiert einen delegierten Click-Handler auf einem Container-Element.
 * Klicks auf .arena-specimen loesen setArenaSelection() aus.
 *
 * @param {import('vue').Ref<HTMLElement|null>} containerRef — ref zum Lab-Panel Container
 * @param {import('vue').Ref<string>} componentIdRef — aktive Komponenten-ID
 * @param {import('vue').Ref<object|null>} recipeRef — geladenes Recipe-Objekt
 */
export function useSpecimenClick(containerRef, componentIdRef, recipeRef) {
  const store = useThemeStore()
  const selectedSpecimenId = ref(null)

  function handleClick(e) {
    // Ignore Klicks auf Buttons, Inputs, Links (interaktive Elemente im Specimen)
    if (e.target.closest('button, input, select, a, .arena-btn')) return

    // Finde naechstes .arena-specimen Element im Event-Pfad
    const specimen = e.target.closest('.arena-specimen')
    if (!specimen) return

    const componentId = componentIdRef.value
    if (!componentId) return

    // Specimen-ID bestimmen: data-Attribut oder Label-Text
    let specimenId = specimen.dataset.specimenId
    if (!specimenId) {
      // Fallback: Label-Text als ID verwenden
      const labelEl = specimen.querySelector('.arena-specimen__label')
      if (labelEl) {
        specimenId = slugify(labelEl.textContent.trim())
      }
      // Fallback 2: vorherige arena-category-divider
      if (!specimenId) {
        const prev = specimen.previousElementSibling
        if (prev && prev.classList.contains('arena-category-divider')) {
          const catLabel = prev.querySelector('.arena-category-label')
          if (catLabel) specimenId = slugify(catLabel.textContent.trim())
        }
      }
    }
    if (!specimenId) return

    // Toggle: erneuter Klick auf dasselbe Specimen loescht die Selektion
    if (selectedSpecimenId.value === specimenId) {
      clearSelection()
      return
    }

    // TokenGroups auflösen
    let tokenGroups = resolveTokenGroups(specimen, specimenId)

    // Alle Specimens: Selection-Klasse managen
    updateSelectionUI(specimen)
    selectedSpecimenId.value = specimenId
    store.setArenaSelection(componentId, specimenId, tokenGroups)
  }

  function resolveTokenGroups(specimen, specimenId) {
    let tokenGroups = []

    // 1) Explizites data-Attribut
    if (specimen.dataset.tokenGroups) {
      tokenGroups = specimen.dataset.tokenGroups.split(',').filter(Boolean)
    }

    // 2) Aus Recipe-Specimens auflösen (focusTokenGroups)
    if (tokenGroups.length === 0 && recipeRef?.value?.specimens) {
      const recipeSpecimen = recipeRef.value.specimens.find(s => s.id === specimenId)
      if (recipeSpecimen?.focusTokenGroups) {
        tokenGroups = [...recipeSpecimen.focusTokenGroups]
      }
    }

    // 3) Aus Recipe-Axes auflösen (Variant-ID als Achsen-Wert)
    if (tokenGroups.length === 0 && recipeRef?.value?.axes) {
      for (const axis of Object.values(recipeRef.value.axes)) {
        if (axis.values && axis.values[specimenId]) {
          const axisTokenGroups = axis.values[specimenId].tokenGroups || []
          tokenGroups.push(...axisTokenGroups)
        }
      }
    }

    // 4) Fallback: alle styling.tokenGroups Keys (nichts filtern)
    if (tokenGroups.length === 0 && recipeRef?.value?.styling?.tokenGroups) {
      tokenGroups = Object.keys(recipeRef.value.styling.tokenGroups)
    }

    return tokenGroups
  }

  function updateSelectionUI(activeSpecimen) {
    if (!containerRef.value) return
    // Entferne Selection von allen Specimens
    containerRef.value.querySelectorAll('.arena-specimen--selected')
      .forEach(el => el.classList.remove('arena-specimen--selected'))
    // Setze Selection auf aktives Specimen
    activeSpecimen.classList.add('arena-specimen--selected')
  }

  function clearSelection() {
    selectedSpecimenId.value = null
    store.clearArenaSelection()
    if (containerRef.value) {
      containerRef.value.querySelectorAll('.arena-specimen--selected')
        .forEach(el => el.classList.remove('arena-specimen--selected'))
    }
  }

  // Event delegation setup
  onMounted(() => {
    const el = containerRef.value
    if (el) el.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    const el = containerRef.value
    if (el) el.removeEventListener('click', handleClick)
  })

  // Reset bei Komponenten-Wechsel
  watch(componentIdRef, () => {
    clearSelection()
  })

  return { selectedSpecimenId, clearSelection }
}
