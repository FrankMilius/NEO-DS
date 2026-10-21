// Sichtbare Texte aus Vue- und JS-Quellen der Konfig-App (E7, 21.10.2026).
//
// Mit dem echten Vue-Compiler und Babel-Parser der App, nicht mit regulären
// Ausdrücken über Zeilen: so kommen mehrzeiliger Text, Bindungen wie
// :title="'…'", {{ }}-Platzhalter und Template-Strings richtig heraus, und
// Code zwischen zwei Zeichenketten wird nie für Text gehalten
// (Widersacher-Befunde vom 21.10.2026).
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../apps/theme-configurator/package.json')
const benoetige = createRequire(APP)
const { parse: parseSfc } = benoetige('@vue/compiler-sfc')
const { parse: parseJs, parseExpression } = benoetige('@babel/parser')

// Grundsatz (Widersacher 21.10.2026, 3. Runde): ALLES auslesen und nur sicher
// Technisches auslassen — lieber ein Hinweis zu viel als ein übersehener Text.
/** Attribute, deren Wert sicher technisch ist (alle anderen gelten als möglicher Text, auch Props wie titel, panelLabel) */
const TECHNISCH = /^(class|style|id|key|ref|is|for|name|type|role|href|src|srcset|target|rel|tabindex|data-[\w-]+|aria-(controls|describedby|labelledby|owns|activedescendant|expanded|hidden|selected|checked|pressed|current|haspopup|live|modal|invalid|disabled|level|setsize|posinset|valuemin|valuemax|valuenow)|viewBox|viewbox|d|fill|stroke[\w-]*|width|height|x|y|cx|cy|r|points|xmlns|transform|loading|decoding|autocomplete|inputmode|step|min|max|pattern|accept|method|action|width|lang|dir)$/
/** Nur das ERSTE Argument dieser Aufrufe ist technisch (Selektor, Ereignis-, Schlüssel-, Attributname); weitere Argumente und Rückrufe werden gelesen */
const ERSTES_ARGUMENT_TECHNISCH = /^(querySelector(All)?|getElementById|closest|matches|addEventListener|removeEventListener|emit|\$emit|dispatchEvent|getAttribute|setAttribute|removeAttribute|hasAttribute|getPropertyValue|setProperty|removeProperty|getItem|setItem|removeItem|createElement|require|import|inject|provide|startsWith|endsWith|includes|split|indexOf|has|get|delete)$/
/** Aufrufe ganz ohne Text (Module, Klassenlisten) */
const GANZ_TECHNISCH = /^(require|import)$/

/** Sieht eine Zeichenkette wie Oberflächentext aus? (nicht: Pfad, Klasse, Schlüssel, Bezeichner) */
export function istText (s) {
  const t = String(s).trim()
  if (t.length < 2 || !/\p{L}/u.test(t)) return false
  if (/^[\w$.\/:#@?&=%+-]+$/.test(t) && !/^\p{Lu}\p{Ll}/u.test(t)) return false   // bezeichner, pfad, css-klasse, --variable
  if (/^(https?:|mailto:|data:|#|\.|\/|var\(|calc\(|rgba?\()/.test(t)) return false
  if (t.split(/\s+/).every((w) => /^[a-z0-9]+(?:[_-]+[a-z0-9]+)+$/.test(w))) return false   // Klassenliste: nc-button nc-button--sm
  if (/^\(?[a-z-]+\s*:\s*\S/.test(t) || /[{}]/.test(t) || /!important/.test(t)) return false   // CSS-Deklaration, Regel, Medienabfrage
  if (/(^|[\s,(])(--[\w-]+|\.[a-z][\w-]*|:root|@media|@supports|prefers-[\w-]+)/.test(t) || /;\s*$/.test(t)) return false   // CSS: Selektoren, Variablen, Medienabfragen
  return /\s/.test(t) || /^\p{Lu}/u.test(t) || /[äöüÄÖÜß…]/.test(t)
}

function zeichenketten (knoten, ergebnis, zeilenVersatz = 0, eltern = null) {
  if (!knoten || typeof knoten !== 'object') return
  if (Array.isArray(knoten)) { for (const k of knoten) zeichenketten(k, ergebnis, zeilenVersatz, eltern); return }
  const zeile = (knoten.loc?.start?.line ?? 1) + zeilenVersatz
  const aufrufName = (n) => n?.type === 'Identifier' ? n.name : n?.type === 'MemberExpression' ? aufrufName(n.property) : n?.type === 'StringLiteral' ? n.value : ''
  if (knoten.type === 'ImportDeclaration' || knoten.type === 'ExportAllDeclaration' || knoten.type === 'ExportNamedDeclaration' && knoten.source) return
  if (knoten.type === 'CallExpression' || knoten.type === 'NewExpression') {
    const name = aufrufName(knoten.callee)
    if (GANZ_TECHNISCH.test(name)) return
    const klassenliste = knoten.callee?.type === 'MemberExpression' && aufrufName(knoten.callee.object) === 'classList'
    if (klassenliste || ERSTES_ARGUMENT_TECHNISCH.test(name)) {
      zeichenketten(knoten.callee, ergebnis, zeilenVersatz, knoten)
      zeichenketten(knoten.arguments.slice(klassenliste ? knoten.arguments.length : 1), ergebnis, zeilenVersatz, knoten)
      return
    }
  }
  if (knoten.type === 'StringLiteral') {
    const istSchluessel = (eltern?.type === 'ObjectProperty' || eltern?.type === 'ClassProperty') && eltern.key === knoten && !eltern.computed
    if (!istSchluessel && istText(knoten.value)) ergebnis.push({ text: knoten.value.trim(), zeile })
    return
  }
  if (knoten.type === 'TemplateLiteral') {
    const t = knoten.quasis.map((q) => q.value.cooked ?? '').join('…').replace(/\s+/g, ' ').trim()
    if (istText(t.replace(/…/g, ' '))) ergebnis.push({ text: t, zeile })
  }
  if (knoten.type === 'BinaryExpression' && knoten.left?.type === 'StringLiteral' && knoten.right?.type === 'StringLiteral') {
    const t = (knoten.left.value + knoten.right.value).trim()
    if (istText(t)) { ergebnis.push({ text: t, zeile }); return }
  }
  for (const [schluessel, wert] of Object.entries(knoten)) {
    if (schluessel === 'loc' || schluessel === 'start' || schluessel === 'end' || schluessel === 'leadingComments' || schluessel === 'trailingComments' || schluessel === 'extra') continue
    if (wert && typeof wert === 'object') zeichenketten(wert, ergebnis, zeilenVersatz, knoten)
  }
}

/** Texte aus JS-Quelltext (Zeichenketten und Template-Strings mit Textcharakter). */
export function texteAusJs (code, zeilenVersatz = 0, sprache = 'js') {
  const ergebnis = []
  let ast
  const plugins = ['jsx', 'topLevelAwait', ...(/^tsx?$/.test(sprache ?? '') ? ['typescript'] : [])]
  try { ast = parseJs(code, { sourceType: 'module', plugins, errorRecovery: true }) } catch (f) { throw new Error(`Skript nicht lesbar: ${f.message}`) }
  zeichenketten(ast.program, ergebnis, zeilenVersatz)
  return ergebnis
}

function texteAusAusdruck (ausdruck, zeile) {
  const ergebnis = []
  try { zeichenketten(parseExpression(ausdruck, { plugins: ['jsx'] }), ergebnis, zeile - 1) } catch { /* kein gültiger Ausdruck */ }
  return ergebnis
}

/** Texte aus einer Vue-Einzeldatei: Vorlage (Text, sichtbare Attribute, Bindungen) und Skript. */
export function texteAusVue (quelle) {
  const ergebnis = []
  const { descriptor } = parseSfc(quelle, { sourceMap: false, ignoreEmpty: true })
  const lauf = (knoten) => {
    // Text und {{ }} nebeneinander: EIN Satz mit … für den Platzhalter, die Stücke nicht zusätzlich
    const kinder = knoten?.children ?? []
    const gemischt = kinder.some((c) => c.type === 5) && kinder.some((c) => c.type === 2 && c.content.trim())
    if (gemischt) {
      const t = kinder.filter((c) => c.type === 2 || c.type === 5).map((c) => (c.type === 2 ? c.content : '…')).join('').replace(/\s+/g, ' ').trim()
      if (istText(t.replace(/…/g, ' '))) ergebnis.push({ text: t, zeile: knoten.loc.start.line })
      for (const c of kinder) if (c.type === 5) ergebnis.push(...texteAusAusdruck(c.content.content, c.loc.start.line))
    }
    for (const k of kinder) {
      if (gemischt && (k.type === 2 || k.type === 5)) continue
      if (k.type === 2) {                                  // Text
        const t = k.content.replace(/\s+/g, ' ').trim()
        if (istText(t)) ergebnis.push({ text: t, zeile: k.loc.start.line })
      } else if (k.type === 5) {                           // {{ Ausdruck }}
        ergebnis.push(...texteAusAusdruck(k.content.content, k.loc.start.line))
      } else if (k.type === 8) {                           // zusammengesetzt (Text + {{ }})
        const t = k.children.filter((c) => typeof c === 'object' && c.type === 2).map((c) => c.content).join('…').replace(/\s+/g, ' ').trim()
        if (istText(t)) ergebnis.push({ text: t, zeile: k.loc.start.line })
      }
      if (k.type === 1) {                                  // Element
        for (const p of k.props ?? []) {
          // statische Attribute: alle außer sicher technischen (auch Props wie titel, panelLabel, knopf-text)
          if (p.type === 6 && !TECHNISCH.test(p.name) && p.value && istText(p.value.content)) ergebnis.push({ text: p.value.content.trim(), zeile: p.loc.start.line })
          // Direktiven: alle Ausdrücke (Bindungen außer technischen, @click-Argumente, v-for-Listen, v-tooltip, v-bind-Objekte)
          if (p.type === 7 && p.exp && !(p.name === 'bind' && p.arg?.content && TECHNISCH.test(p.arg.content))) {
            const ausdruck = p.name === 'for' ? p.exp.content.replace(/^[\s\S]*?\s+(in|of)\s+/, '') : p.exp.content
            ergebnis.push(...texteAusAusdruck(ausdruck, p.loc.start.line))
          }
        }
        lauf(k)
      }
    }
  }
  if (descriptor.template?.ast) lauf(descriptor.template.ast)
  for (const s of [descriptor.script, descriptor.scriptSetup]) {
    if (s) ergebnis.push(...texteAusJs(s.content, s.loc.start.line - 1, s.lang))
  }
  // CSS content: '…' ist sichtbar
  for (const st of descriptor.styles ?? []) {
    for (const m of st.content.matchAll(/content\s*:\s*(['"])((?:(?!\1).)+)\1/g)) {
      if (istText(m[2])) ergebnis.push({ text: m[2], zeile: st.loc.start.line + st.content.slice(0, m.index).split('\n').length - 1 })
    }
  }
  return ergebnis
}

/** Texte einer Datei je nach Endung. */
export function texte (datei, quelle) {
  if (!quelle) return []
  return datei.endsWith('.vue') ? texteAusVue(quelle) : texteAusJs(quelle)
}
