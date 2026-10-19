// Roadmap V03 (19.10.2026): Klick oder Enter auf eine Vorschau öffnet ihre Token-Gruppen
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const quelle = (pfad) => readFileSync(resolve(__dirname, '../../', pfad), 'utf8')

describe('RecipeArena: Zelle als Auslöser', () => {
  const q = quelle('src/components/laboratory/RecipeArena.vue')
  it('Beschriftung ist ein Knopf mit sprechendem Namen', () => {
    expect(q).toContain('data-test="zu-token"')
    expect(q).toContain(': Einstellungen im Inspector öffnen`')
  })
  it('setzt die Arena-Auswahl mit den Gruppen DIESER Zelle und der Sektion', () => {
    expect(q).toContain('store.setArenaSelection(props.sektion || props.componentId, name, [...z.tokenGroups])')
  })
  it('Links in Vorschauen ändern die Route nicht', () => {
    expect(q).toContain("if (e.target.closest?.('a[href]')) e.preventDefault()")
  })
})

describe('ComponentEditor: scrollt zur spezifischen Gruppe und setzt den Fokus', () => {
  const q = quelle('src/components/components/ComponentEditor.vue')
  it('Basis-Gruppen werden übersprungen', () => {
    expect(q).toContain('matchedIds.find((id) => !basis.has(id)) || matchedIds[0]')
    expect(q).toContain(".querySelector('.ce-subgroup-header')?.focus({ preventScroll: true })")
    expect(q.match(/:data-subgroup="sg.id"/g)).toHaveLength(4)
  })
})
