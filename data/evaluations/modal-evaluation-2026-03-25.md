# Evaluation: Modal v2.0.0

**Datum:** 2026-03-25
**Status:** stable
**Recipe:** data/modal-recipe.json

---

## 1. Executive Summary

Das NEO Modal ist solide auf nativem `<dialog>` aufgebaut, nutzt die Token-Architektur konsequent und hat gute A11y-Grundlagen. **Größte Stärke:** Saubere Anatomy mit 6 Slots, semantischer Danger-Intent, Scrollable-Variante mit Scroll-Indicators. **Größte Lücken:** Keine Motion-Presets (Animation nur hardcoded), kein Mobile Bottom-Sheet, keine `motionPreset`-Achse, fehlende semantische Varianten (Success, Warning), und die SCSS-Implementierung (`_modal.scss`) verwendet noch Legacy-Klassen (`.location-preference-modal`) statt der BEM-Klassen aus dem Recipe (`.nc-modal`).

**Gesamtbewertung: 6.5/10** — Gute Architektur, aber erhebliche Implementierungslücken gegenüber dem Recipe.

---

## 2. Stärken (vs. Markt)

| Feature | NEO | Marktstandard | Bewertung |
|---------|-----|---------------|-----------|
| **Natives `<dialog>`** | ✅ `showModal()` | Radix/Chakra nutzen custom Overlay | Vorsprung — nativer Focus-Trap, Top-Layer, ESC |
| **`::backdrop` Styling** | ✅ mit `@starting-style` | Nur Carbon/Ant nutzen nativen Backdrop | Branchenführend |
| **3-Layer Token System** | ✅ `--nc-dialog-*` Tokens | Radix unstyled, Ant hardcoded | Sehr gut — ermöglicht Theming |
| **Danger Intent** | ✅ Eigene Token-Gruppe | Carbon (5 Intents), Ant (statische Methoden) | Gut, aber ausbaubar |
| **Scrollable mit Sticky Header/Footer** | ✅ JS-basierte Scroll-Detection | Chakra `scrollBehavior`, Carbon fest | Gleichwertig |
| **4 Größen (sm/md/lg/full)** | ✅ | Carbon 4, Chakra 7, Ant frei | Standard |
| **Backdrop-Close konfigurierbar** | ✅ `data-backdrop-close` | Alle bieten das | Standard |
| **Body Scroll Lock** | ✅ `body:has(.nc-modal[open])` | Alle bieten das | Standard |

---

## 3. Lücken (Missing Features)

### Must-Have (Branchenstandard — alle Top-5 haben es)

| Feature | Radix | Shadcn | Chakra | Carbon | Ant | NEO | Empfehlung |
|---------|-------|--------|--------|--------|-----|-----|------------|
| **Motion Presets** | CSS custom | Tailwind-Klassen | 6 Presets (scale, slide-*) | Carbon Motion | rc-motion | ❌ Hardcoded | **P1: motionPreset-Axis hinzufügen** |
| **`aria-describedby`** | ✅ auto | ✅ auto | ❌ | ✅ | ❌ | ❌ nicht im Recipe | **P1: Description-Slot + auto-linking** |
| **Focus-Restore zum Trigger** | ✅ auto | ✅ auto | ✅ configurable | ✅ | ✅ | ⚠️ nur in domNotes erwähnt | **P1: JS-Pattern implementieren** |
| **`prefers-reduced-motion`** | Selbst | Selbst | ❌ | ✅ Carbon Motion | ❌ | ❌ | **P1: In Motion-Tokens integrieren** |
| **Exit-Animation (CSS-only)** | Via `data-state` | Tailwind | `motionPreset` | Carbon Motion | rc-motion | ❌ nur Entry | **P1: `@starting-style` + `allow-discrete`** |
| **Non-Modal Variante** | ✅ `modal` Prop | ❌ | ✅ `modal` Prop | ❌ | ❌ | ❌ | **P2: Für Sidepanels/Drawers** |

### Nice-to-Have (Differenzierung — ≤2 Design Systems haben es)

| Feature | Wer hat es | NEO | Empfehlung |
|---------|-----------|-----|------------|
| **Mobile Bottom-Sheet** | Chakra (`cover`), Custom | ❌ | **P2: Responsive size + slide-in-bottom** |
| **Statische Methoden** (`Modal.confirm()`) | Ant Design | ❌ | P3: Nur für Imperative Dialoge |
| **Semantische Varianten** (success, warning, info) | Carbon (5), Ant (4) | Nur `danger` | **P2: Intent-Axis erweitern** |
| **`scrollBehavior` Prop** (inside/outside) | Chakra | ⚠️ nur `--scrollable` | P3: Erweitern |
| **Container Queries** | Keiner explizit | ❌ | **P2: Adaptive Layouts im Modal** |
| **Nested Dialogs** | Chakra (Overlay Manager) | ❌ | P3: Max 2 Ebenen |
| **`command`/`commandfor`** (deklarativ) | Native (Chrome 135+) | ❌ | P3: Progressive Enhancement |
| **Loading-State** | Ant (`loading`, `confirmLoading`) | ❌ | P2: Skeleton + Button Loading |

---

## 4. UX-Empfehlungen

### Animation
- **Entry:** 250ms `ease-out`, Scale 95% → 100% + Fade (nicht translate-Y wie aktuell)
- **Exit:** 200ms `ease-in`, Scale 100% → 95% + Fade (kürzer als Entry = reaktiver)
- **Backdrop:** Parallel Fade + `backdrop-filter: blur(8px)` mit `color-mix()`
- **Reduced Motion:** Nur Opacity, kein Transform

### Mobile
- Unter `sm` Breakpoint (768px): Bottom-Sheet Verhalten
  - Slide-in von unten, volle Breite, abgerundete obere Ecken
  - Max-Height: `90vh` (bereits als Token vorhanden: `nc-dialog-mobile-max-height`)
  - Swipe-down zum Schließen (optional, Progressive Enhancement)

### Form-Modals
- Dirty-State-Tracking: Bei ungespeicherten Änderungen 3-Button-Discard-Dialog
- Submit-Button im Footer: Immer sichtbar (Scrollable-Variante)
- Inline-Validierung bei Blur

### Stacking
- Maximal 2 Ebenen (Modal + Confirmation)
- Hinteres Modal dimmen (`opacity: 0.3`)
- Inline-Bestätigung bevorzugen

---

## 5. A11y-Audit

### Implementiert ✅
- `role="dialog"` (nativ via `<dialog>`)
- `aria-modal="true"` (nativ via `showModal()`)
- `aria-labelledby` → Title
- ESC schließt (nativ)
- Focus-Trap (nativ)
- Close-Button mit `aria-label`
- Body Scroll Lock

### Fehlt ❌
| Anforderung | WCAG SC | Status | Fix |
|-------------|---------|--------|-----|
| `aria-describedby` → Body-Text | 4.1.2 | Fehlt | Description-Slot + Auto-Link |
| Focus-Restore zum Trigger | 2.4.3 | Nur dokumentiert, nicht implementiert | JS: `activeElement` speichern |
| `prefers-reduced-motion` | 2.3.3 | Fehlt | `@media` Query in Motion-Tokens |
| Focus-Visible `:focus:not(:focus-visible)` auf Dialog-Container | 2.4.7 | Nicht geprüft | Outline entfernen auf Container |
| `<form method="dialog">` Support | — | Nicht dokumentiert | Recipe-Constraint hinzufügen |
| Danger: autofocus auf Cancel | — | Nur in domNotes | Default-Focus-Regel implementieren |

---

## 6. Token-Architektur

### Aktuell: 25 Tokens in 7 Gruppen ✅

| Gruppe | Tokens | Bewertung |
|--------|--------|-----------|
| Container | 8 (max-width, max-height, padding, radius, bg, shadow, overlay-bg, section-gap) | ✅ Vollständig |
| Header | 5 (title font-size/weight/color, gap, border-color) | ✅ Gut |
| Body | 2 (description font-size, color) | ⚠️ Dünn — padding fehlt |
| Footer | 2 (gap, border-color) | ⚠️ Dünn — padding, alignment fehlen |
| Close | 5 (size, radius, bg, bg-hover, icon-size) | ✅ Gut |
| Danger | 3 (icon-color, action-bg, action-color) | ⚠️ Nur 3 — border, bg-hover fehlen |
| Scroll-Borders | 2 (header/footer border-color) | ✅ OK |

### Fehlende Token-Gruppen

| Gruppe | Tokens | Priorität |
|--------|--------|-----------|
| **Motion** | `nc-dialog-enter-duration`, `nc-dialog-enter-easing`, `nc-dialog-exit-duration`, `nc-dialog-exit-easing`, `nc-dialog-enter-transform` | **P1** |
| **Mobile** | `nc-dialog-mobile-radius`, `nc-dialog-mobile-max-height`, `nc-dialog-mobile-enter-transform` | **P2** |
| **Backdrop** | `nc-dialog-backdrop-blur`, `nc-dialog-backdrop-opacity` | **P2** |
| **Sizes** | `nc-dialog-width-sm`, `nc-dialog-width-md`, `nc-dialog-width-lg` (aktuell nur `max-width`) | **P2** |
| **Loading** | `nc-dialog-loading-bg`, `nc-dialog-loading-spinner-size` | P3 |

### Inkonsistenz: Recipe vs. SCSS

**Kritisch:** Die SCSS-Datei `_modal.scss` implementiert `.location-preference-modal` — eine projektspezifische Klasse, NICHT die BEM-Klassen aus dem Recipe (`.nc-modal`, `.nc-modal__header`, `.nc-modal__body` etc.). Das Recipe dokumentiert eine Architektur die in SCSS nicht existiert.

---

## 7. Konkrete Iterations-Vorschläge

### Recipe-Änderungen (neue Axis: `motionPreset`)

```json
"motionPreset": {
  "label": "Motion Preset",
  "description": "Eingangs-/Ausgangs-Animation",
  "values": {
    "scale": { "modifier": null, "tokenGroups": ["motion"], "renderHint": "scale" },
    "slide-up": { "modifier": "nc-modal--slide-up", "tokenGroups": ["motion"], "renderHint": "slide-up" },
    "slide-down": { "modifier": "nc-modal--slide-down", "tokenGroups": ["motion"], "renderHint": "slide-down" },
    "none": { "modifier": "nc-modal--no-motion", "tokenGroups": [], "renderHint": "no-motion" }
  }
}
```

### Recipe-Änderungen (Intent-Axis erweitern)

```json
"intent": {
  "values": {
    "default": { "modifier": null, "tokenGroups": [] },
    "danger": { "modifier": "nc-modal--danger", "tokenGroups": ["danger"] },
    "success": { "modifier": "nc-modal--success", "tokenGroups": ["success"] },
    "warning": { "modifier": "nc-modal--warning", "tokenGroups": ["warning"] }
  }
}
```

### Neue Token-Gruppe: Motion

```json
"motion": {
  "label": "Motion",
  "tokens": [
    "nc-dialog-enter-duration",
    "nc-dialog-enter-easing",
    "nc-dialog-exit-duration",
    "nc-dialog-exit-easing",
    "nc-dialog-backdrop-blur",
    "nc-dialog-backdrop-opacity"
  ]
}
```

### SCSS: `@starting-style` + CSS-only Animationen

```scss
.nc-modal {
  // Entry + Exit Animation (CSS-only, kein JS)
  opacity: 1;
  transform: scale(1) translateY(0);
  transition:
    opacity var(--nc-dialog-enter-duration) var(--nc-dialog-enter-easing),
    transform var(--nc-dialog-enter-duration) var(--nc-dialog-enter-easing),
    overlay var(--nc-dialog-enter-duration) allow-discrete,
    display var(--nc-dialog-enter-duration) allow-discrete;

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }

  &:not([open]) {
    opacity: 0;
    transform: scale(0.95);
  }

  // Slide-Up Variante
  &--slide-up {
    @starting-style { transform: translateY(16px); }
    &:not([open]) { transform: translateY(16px); }
  }

  // Backdrop
  &::backdrop {
    background: color-mix(in srgb, var(--fnd-color-text-primary) 40%, transparent);
    backdrop-filter: blur(var(--nc-dialog-backdrop-blur, 8px));
    transition: opacity var(--nc-dialog-enter-duration), overlay allow-discrete, display allow-discrete;
    @starting-style { opacity: 0; }
  }

  // Reduced Motion
  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
    &::backdrop { transition-duration: 0ms; }
  }
}
```

---

## 8. Priorisierte Roadmap

| Prio | Änderung | Aufwand | Impact |
|------|----------|---------|--------|
| **P1** | SCSS: `.nc-modal` BEM-Klassen implementieren (Recipe↔SCSS Alignment) | L | Kritisch — ohne das ist alles andere wirkungslos |
| **P1** | Motion-Tokens + `@starting-style` Entry/Exit Animation | M | Hoch — CSS-only, kein JS, alle Browsers 2026 |
| **P1** | `aria-describedby` Auto-Link + Focus-Restore JS | S | Hoch — A11y Compliance |
| **P1** | `prefers-reduced-motion` Support | S | Hoch — WCAG 2.3.3 |
| **P2** | `motionPreset` Axis (scale, slide-up, slide-down, none) | M | Mittel — UX-Differenzierung |
| **P2** | Intent erweitern (success, warning) | S | Mittel — Semantische Vollständigkeit |
| **P2** | Mobile Bottom-Sheet (responsive behavior unter sm) | M | Hoch — Mobile UX |
| **P2** | Backdrop: `backdrop-filter: blur()` + `color-mix()` | S | Mittel — Visueller Lift |
| **P2** | Container Queries für adaptive Modal-Layouts | S | Mittel — Zukunftssicher |
| **P3** | Non-Modal Variante (Sidepanel-Verhalten) | M | Niedrig — Nischenfall |
| **P3** | Loading-State (Skeleton + Button Loading) | S | Niedrig |
| **P3** | `command`/`commandfor` Progressive Enhancement | S | Niedrig — Chrome 135+ |

---

## Quellen

- W3C ARIA Authoring Practices: Dialog (Modal) Pattern
- MDN Web Docs: `<dialog>` Element
- Radix UI: Dialog Primitives Docs
- Shadcn/ui: Dialog Component
- Chakra UI v3: Dialog Component
- Carbon Design System: Modal Usage
- Ant Design v5: Modal Component
- Material Design 3: Dialogs Guidelines
- Nielsen Norman Group: Modal & Nonmodal Dialogs
- Baymard Institute: Overlays & Modals
- Chrome Blog: Dialog Animation Improvements (`@starting-style`)
