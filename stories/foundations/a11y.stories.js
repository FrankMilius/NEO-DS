// ============================================================
// Accessibility — Foundation Token Showcase
// Focus Ring, Screen Reader, Touch Targets, Reduced Motion
// ============================================================

export default {
  title: 'Foundations/Accessibility',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Accessibility Foundation** — WCAG 2.1 AA konforme Tokens und Utilities.
Focus Ring (\`--fnd-focus-ring-*\`), Touch Targets (\`--fnd-touch-target-min: 44px\`),
Screen Reader (\`.u-sr-only\`), Live Regions (\`.u-live-region\`), Reduced Motion.`,
      },
    },
  },
};

export const FocusRingTokens = {
  name: 'Focus Ring Tokens',
  render: () => `<div style="padding:24px">
    <div class="nc-data-table nc-data-table--static nc-data-table--striped" style="max-width:700px;margin-bottom:24px">
      <table class="nc-data-table__table">
        <thead><tr><th>Token</th><th>Wert</th><th>Beschreibung</th></tr></thead>
        <tbody>
          <tr><td><code>--fnd-focus-ring-color</code></td><td><code>var(--fnd-color-text-primary)</code></td><td>Farbe des Focus-Rings</td></tr>
          <tr><td><code>--fnd-focus-ring-width</code></td><td>2px</td><td>Breite des Outlines</td></tr>
          <tr><td><code>--fnd-focus-ring-style</code></td><td>solid</td><td>Outline-Stil</td></tr>
          <tr><td><code>--fnd-focus-offset</code></td><td>2px</td><td>Abstand nach aussen</td></tr>
          <tr><td><code>--fnd-focus-inset</code></td><td>2px</td><td>Abstand nach innen (inset-Variante)</td></tr>
        </tbody>
      </table>
    </div>
    <h3 style="font-size:var(--fs-base);margin-bottom:12px">Live Demo</h3>
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Tab-Taste druecken um den Focus-Ring zu sehen. Nur bei Tastatur-Navigation sichtbar (:focus-visible).</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
      <button class="nc-button"><span class="nc-button__label">Button</span></button>
      <input class="nc-input" type="text" placeholder="Input" style="width:160px" />
      <a href="#" style="color:var(--fnd-color-interactive-default)">Link Element</a>
    </div>
    <div style="margin-top:24px;padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <h4 style="margin-top:0;font-size:var(--fs-sm)">SCSS Mixin</h4>
      <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>// Standard (outset)
@include focus-ring;

// Inset (fuer Elemente mit overflow:hidden)
@include focus-ring-inset;</code></pre>
    </div>
  </div>`,
};

export const TouchTargets = {
  name: 'Touch Targets (WCAG 2.5.8)',
  render: () => `<div style="padding:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Minimum Touch Target: <code>--fnd-touch-target-min: 44px</code> (WCAG 2.5.8)</p>
    <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center">
      <div style="position:relative;text-align:center">
        <div style="width:44px;height:44px;border:2px dashed var(--fnd-color-feedback-danger);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;justify-content:center">
          <button class="nc-button nc-button--sm" style="font-size:var(--fs-xs);padding:4px 8px"><span class="nc-button__label">SM</span></button>
        </div>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">44px Touch Zone<br/>(unsichtbar, via ::before)</div>
      </div>
      <div style="text-align:center">
        <div style="width:44px;height:44px;background:color-mix(in srgb, var(--fnd-color-feedback-success) 10%, transparent);border:2px solid var(--fnd-color-feedback-success);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;justify-content:center">
          <button class="nc-button"><span class="nc-button__label">MD</span></button>
        </div>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">44px+ nativ</div>
      </div>
    </div>
    <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-top:16px">XS/SM Buttons haben unsichtbaren ::before Touch-Target (44px Minimum). MD/LG Buttons erfuellen die Groesse nativ.</p>
  </div>`,
};

export const ScreenReaderUtilities = {
  name: 'Screen Reader Utilities',
  render: () => `<div style="padding:24px">
    <div class="nc-data-table nc-data-table--static nc-data-table--striped" style="max-width:700px;margin-bottom:24px">
      <table class="nc-data-table__table">
        <thead><tr><th>Klasse</th><th>Beschreibung</th><th>Verwendung</th></tr></thead>
        <tbody>
          <tr><td><code>.u-sr-only</code></td><td>Visuell versteckt, fuer Screenreader sichtbar</td><td>Labels, Beschreibungen, Skip-Links</td></tr>
          <tr><td><code>.u-live-region</code></td><td><code>aria-live="polite"</code> Container</td><td>Dynamische Statusmeldungen</td></tr>
          <tr><td><code>.u-sr-only-focusable</code></td><td>Versteckt bis fokussiert</td><td>Skip-to-Content Links</td></tr>
        </tbody>
      </table>
    </div>
    <h3 style="font-size:var(--fs-base);margin-bottom:12px">Beispiel: Skip-to-Content</h3>
    <div style="padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>&lt;a href="#main" class="u-sr-only-focusable"&gt;
  Zum Hauptinhalt springen
&lt;/a&gt;</code></pre>
    </div>
  </div>`,
};

export const ReducedMotion = {
  name: 'Reduced Motion',
  render: () => `<div style="padding:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">
      Alle Animationen respektieren <code>prefers-reduced-motion: reduce</code> automatisch.
      Wenn der Nutzer reduzierte Bewegung bevorzugt, werden Transitionen auf ein Minimum reduziert.
    </p>
    <div style="padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <h4 style="margin-top:0;font-size:var(--fs-sm)">Globale Regel (in 02-generic/_animations.scss)</h4>
      <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}</code></pre>
    </div>
    <div style="margin-top:16px;padding:12px;background:color-mix(in srgb, var(--fnd-color-feedback-warning) 10%, transparent);border-left:4px solid var(--fnd-color-feedback-warning);border-radius:0 var(--fnd-radius-md) var(--fnd-radius-md) 0">
      <p style="font-size:var(--fs-sm);margin:0"><strong>Tipp:</strong> Im macOS: System Settings → Accessibility → Display → Reduce Motion. Im Browser DevTools: Rendering Panel → Emulate prefers-reduced-motion.</p>
    </div>
  </div>`,
};
