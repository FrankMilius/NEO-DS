<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Vertical Form -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Vertical Form</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormVertical :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormVertical :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormVertical :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Inline Form -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Inline Form</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormInline :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormInline :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormInline :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Layout Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Layout Variants — Compact vs. Loose</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormLayoutVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormLayoutVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormLayoutVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, h, defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { componentTokenGroups } from '../../data/tokens.js'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('form-layout')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-form-gap':                   '24px',
  'nc-form-section-gap':           '32px',
  'nc-form-label-font-size':       '14px',
  'nc-form-label-font-weight':     '600',
  'nc-form-label-color':           '#0f172a',
  'nc-form-label-gap':             '8px',
  'nc-form-label-required-color':  '#dc2626',
  'nc-form-label-optional-color':  '#94a3b8',
  'nc-form-hint-font-size':        '13px',
  'nc-form-hint-color':            '#64748b',
  'nc-form-hint-gap':              '4px',
  'nc-form-error-font-size':       '13px',
  'nc-form-error-font-weight':     '500',
  'nc-form-error-color':           '#dc2626',
  'nc-form-error-icon-size':       '16px',
  'nc-form-error-gap':             '4px'
}

const TOKEN_REFS = {
  'nc-form-label-color':          'text-primary',
  'nc-form-label-required-color': 'feedback-danger',
  'nc-form-label-optional-color': 'text-tertiary',
  'nc-form-hint-color':           'text-secondary',
  'nc-form-error-color':          'feedback-danger'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'form-layout') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

function resolveToken(semanticMap, tokenId) {
  const override = store.currentComponentOverrides?.value?.[tokenId]
  if (override !== undefined) return override
  if (componentData.value) {
    const tok = componentData.value.tokens.find(t => t.id === tokenId)
    if (tok) {
      if (tok.ref && semanticMap[tok.ref]) return semanticMap[tok.ref]
      if (tok.default) return tok.default
    }
  }
  if (TOKEN_REFS[tokenId] && semanticMap[TOKEN_REFS[tokenId]]) {
    return semanticMap[TOKEN_REFS[tokenId]]
  }
  return TOKEN_DEFAULTS[tokenId] || ''
}

function resolveAll(semanticMap) {
  const all = {}
  for (const id of Object.keys(TOKEN_DEFAULTS)) {
    all[id] = resolveToken(semanticMap, id)
  }
  return all
}

const tokensLight = computed(() => resolveAll(tLight.value))
const tokensDark = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() => arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value)
const activeTheme = computed(() => arenaMode.value === 'dark' ? tDark.value : tLight.value)
const activeBg = computed(() =>
  arenaMode.value === 'dark' ? tDark.value['background-base'] : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------
function labelStyle(tokens) {
  return {
    display: 'block',
    fontSize: tokens['nc-form-label-font-size'] || '14px',
    fontWeight: tokens['nc-form-label-font-weight'] || '600',
    color: tokens['nc-form-label-color'] || '#0f172a',
    marginBottom: tokens['nc-form-label-gap'] || '8px',
    fontFamily: 'inherit'
  }
}

function inputStyle(theme) {
  return {
    display: 'block',
    width: '100%',
    height: '36px',
    padding: '0 10px',
    border: `1px solid ${theme['border-primary'] || '#cbd5e1'}`,
    borderRadius: '6px',
    background: theme['surface-elevated'] || theme['background-base'] || '#fff',
    color: theme['text-primary'] || '#0f172a',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none'
  }
}

function textareaStyle(theme) {
  return {
    ...inputStyle(theme),
    height: '72px',
    padding: '8px 10px',
    resize: 'none'
  }
}

function hintStyle(tokens) {
  return {
    display: 'block',
    fontSize: tokens['nc-form-hint-font-size'] || '13px',
    color: tokens['nc-form-hint-color'] || '#64748b',
    marginTop: tokens['nc-form-hint-gap'] || '4px',
    fontFamily: 'inherit',
    lineHeight: '1.4'
  }
}

function errorStyle(tokens) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: tokens['nc-form-error-gap'] || '4px',
    fontSize: tokens['nc-form-error-font-size'] || '13px',
    fontWeight: tokens['nc-form-error-font-weight'] || '500',
    color: tokens['nc-form-error-color'] || '#dc2626',
    marginTop: tokens['nc-form-error-gap'] || '4px',
    fontFamily: 'inherit'
  }
}

function requiredMark(tokens) {
  return h('span', { style: { color: tokens['nc-form-label-required-color'] || '#dc2626', marginLeft: '2px' } }, '*')
}

function optionalMark(tokens) {
  return h('span', { style: { color: tokens['nc-form-label-optional-color'] || '#94a3b8', fontWeight: '400', marginLeft: '4px', fontSize: '12px' } }, '(optional)')
}

function renderField(tokens, theme, { label, placeholder, required = false, optional = false, hint = null, error = null, isTextarea = false } = {}) {
  const labelChildren = [label]
  if (required) labelChildren.push(requiredMark(tokens))
  if (optional) labelChildren.push(optionalMark(tokens))

  const inputBorderColor = error
    ? (tokens['nc-form-error-color'] || '#dc2626')
    : theme['border-primary'] || '#cbd5e1'

  const fieldChildren = [
    h('label', { style: labelStyle(tokens) }, labelChildren)
  ]

  if (isTextarea) {
    fieldChildren.push(h('textarea', {
      placeholder,
      disabled: true,
      style: { ...textareaStyle(theme), borderColor: inputBorderColor }
    }))
  } else {
    fieldChildren.push(h('input', {
      type: 'text',
      placeholder,
      disabled: true,
      style: { ...inputStyle(theme), borderColor: inputBorderColor }
    }))
  }

  if (hint && !error) fieldChildren.push(h('span', { style: hintStyle(tokens) }, hint))
  if (error) fieldChildren.push(h('span', { style: errorStyle(tokens) }, ['⚠ ', error]))

  return h('div', { style: { display: 'flex', flexDirection: 'column' } }, fieldChildren)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Vertical Form with section, labels, hints, errors
const FormVertical = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: t['nc-form-gap'] || '24px',
          maxWidth: '360px',
          width: '100%'
        }
      }, [
        h('div', {
          style: {
            paddingBottom: t['nc-form-section-gap'] || '32px',
            borderBottom: `1px solid ${theme['border-secondary'] || '#e2e8f0'}`,
            marginBottom: '0'
          }
        }, [
          h('span', {
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: theme['text-primary'] || '#0f172a',
              fontFamily: 'inherit'
            }
          }, 'Persönliche Informationen')
        ]),
        renderField(t, theme, {
          label: 'Vorname',
          placeholder: 'Max',
          required: true
        }),
        renderField(t, theme, {
          label: 'E-Mail',
          placeholder: 'max@example.com',
          hint: 'Wir senden eine Bestätigungsmail'
        }),
        renderField(t, theme, {
          label: 'Passwort',
          placeholder: '••••••••',
          required: true,
          error: 'Mindestens 8 Zeichen'
        }),
        renderField(t, theme, {
          label: 'Beschreibung',
          placeholder: 'Kurze Beschreibung...',
          optional: true,
          isTextarea: true
        })
      ])
    }
  }
})

// Inline Form: label + input + button on one row with hint below
const FormInline = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      return h('div', { style: { maxWidth: '480px', width: '100%' } }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }
        }, [
          h('label', {
            style: {
              ...labelStyle(t),
              marginBottom: '0',
              minWidth: '80px',
              whiteSpace: 'nowrap'
            }
          }, 'E-Mail'),
          h('input', {
            type: 'email',
            placeholder: 'ihre@email.de',
            disabled: true,
            style: {
              ...inputStyle(theme),
              flex: '1'
            }
          }),
          h('button', {
            disabled: true,
            style: {
              height: '36px',
              padding: '0 16px',
              background: theme['interactive-default'] || '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              flexShrink: '0',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap'
            }
          }, 'Abonnieren')
        ]),
        h('span', { style: { ...hintStyle(t), marginTop: '8px' } }, 'Wir versenden monatlich Informationen')
      ])
    }
  }
})

// Layout Variants: Compact vs. Loose
const FormLayoutVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const fieldLabels = [
        { label: 'Vorname', placeholder: 'Max' },
        { label: 'E-Mail', placeholder: 'max@example.com' },
        { label: 'Telefon', placeholder: '+49 123 456789' }
      ]

      function renderMiniForm(gap, caption) {
        return h('div', { style: { flex: '1', minWidth: '0' } }, [
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap,
              padding: '16px',
              border: `1px solid ${theme['border-secondary'] || '#e2e8f0'}`,
              borderRadius: '8px',
              background: theme['background-base'] || '#fff',
              marginBottom: '8px'
            }
          },
            fieldLabels.map(({ label, placeholder }) =>
              renderField(t, theme, { label, placeholder })
            )
          ),
          h('span', {
            style: {
              fontSize: '11px',
              color: theme['text-secondary'] || '#666',
              fontWeight: '600'
            }
          }, caption)
        ])
      }

      return h('div', { style: { display: 'flex', gap: '16px', width: '100%', alignItems: 'flex-start' } }, [
        renderMiniForm('12px', 'Compact — gap: 12px'),
        renderMiniForm('32px', 'Loose — gap: 32px')
      ])
    }
  }
})
</script>
