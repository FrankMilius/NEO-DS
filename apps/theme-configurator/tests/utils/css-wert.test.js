// UX-02 (Usability-Audit 15.10.2026): CSS-Injektion über Eingabewerte
import { describe, it, expect, beforeEach } from 'vitest'
import { pruefeFontStack, istSichererCssWert, bereinigeCss, pruefeCss } from '../../src/utils/css-wert.js'
import { useThemeStore } from '../../src/stores/theme.js'

const ANGRIFF = 'Arial; } body { display: none } :root {'

describe('pruefeFontStack', () => {
  it('nimmt übliche Stacks an', () => {
    for (const s of ['Manrope, Helvetica Neue, Arial, sans-serif', "'Times New Roman', Georgia, serif", 'ui-monospace, SFMono-Regular, monospace', '"Space Grotesk", system-ui', 'Arimo']) expect(pruefeFontStack(s), s).toBeNull()
  })
  it('lehnt Ausbruch, Markup, Kommentare und Leeres ab', () => {
    for (const s of [ANGRIFF, 'Arial</style>', 'Arial /* x */', 'Arial,,Georgia', '', 'url(x)', 'Arial\u005c;']) expect(pruefeFontStack(s), s).toBeTruthy()
  })
})

describe('pruefeCss (Server-Grammatik)', () => {
  it('erlaubt Kommentare, Google-Import und Blöcke mit eigenen Eigenschaften — in jeder Schreibweise', () => {
    expect(pruefeCss(':root{--x:1}')).toEqual([])
    expect(pruefeCss('/* a */\n@import url("https://fonts.googleapis.com/css2?family=A:wght@0,400;1,700&display=swap");\n.neo-light-theme, .neo-dark-theme {\n  --a: #fff;\n  --b: var(--c);\n}')).toEqual([])
  })
  it('findet Ausbruch, fremde Eigenschaften, fremde Imports und Markup', () => {
    expect(pruefeCss(`:root { --font-body: ${ANGRIFF} }`).length).toBeGreaterThan(0)
    expect(pruefeCss('body { display: none }')).toHaveLength(1)
    expect(pruefeCss('@import url("https://evil.example/x.css");')).toHaveLength(1)
    expect(pruefeCss('</style><script>alert(1)</script>').length).toBeGreaterThan(0)
    expect(pruefeCss(':root { --a: 1 } /* </style> */')).toEqual(['Kommentar mit < oder >'])
    expect(pruefeCss(':root { --a: 1')).toEqual(['Block nicht geschlossen'])
  })
})

describe('Export und Store', () => {
  let store
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'; store.state.currentThemeMeta = { id: 't', name: 'T' } })

  it('vollständiger Export aller NEO-Werte besteht die Server-Prüfung ohne Fund', () => {
    for (const set of ['neo', 'customer']) {
      store.state.activeThemeSet = set
      expect(pruefeCss(store.exportAsCSSVars()), set).toEqual([])
      expect(pruefeCss(store.exportAsCSSVars({ nurAbweichungen: true })), set).toEqual([])
    }
  })

  it('Store weist den Angriff aus dem Audit ab (Font-Stack, Foundation, Semantik, Komponente)', () => {
    const vorher = store.currentFoundation.typography['font-heading']
    store.updateFoundationToken('typography', 'font-heading', ANGRIFF)
    expect(store.currentFoundation.typography['font-heading']).toBe(vorher)
    store.updateFoundationToken('radius', 'md', '4px; } body { display:none')
    expect(store.currentFoundation.radius.md).not.toContain('display')
    store.updateSemanticToken('text-link', '#000; } body {')
    expect(store.state.themes.neo.light['text-link']).not.toContain('}')
    expect(store.updateComponentToken('nc-button-accent-bg', 'red; }')).toBe(false)
  })

  it('Export entfernt einen trotzdem gespeicherten Angriff (z. B. aus altem Stand)', () => {
    store.state.foundationOverrides.neo.typography['font-heading'] = ANGRIFF   // am Store vorbei
    const css = store.exportAsCSSVars({ nurAbweichungen: true })
    expect(css).not.toContain('display')
    expect(css).toContain('entfernt: --font-heading')
    expect(pruefeCss(css)).toEqual([])
  })

  it('bereinigeCss lässt fremde Blöcke und Imports nicht durch', () => {
    const { css, entfernt } = bereinigeCss('body {\n  display: none;\n}\n@import url("https://evil.example/a.css");\n:root {\n  --ok: 1px;\n}')
    expect(css).not.toContain('display')
    expect(css).not.toContain('evil')
    expect(css).toContain('--ok: 1px;')
    expect(entfernt.length).toBe(2)
    expect(istSichererCssWert(12)).toBe(true)
  })
})
