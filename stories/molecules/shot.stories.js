// ============================================================
// Shot — Auto-generated from shot-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Shot',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Shot** v1.0.0 (stable)

Ein Master-Bild, viele Ausspielungen: je Instanz Fokuspunkt, Zoom und Format; darueber die Darstellungen Standard, Browser-Rahmen, Ken-Burns-Fahrt, Lupe, Marker mit Erklaerung und Vorher/Nachher-Vergleich.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard (Fokus-Crop)',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="none">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Fokus-Crop" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 32.00% 38.00%; transform-origin: 32.00% 38.00%; transform: scale(1.6);">
</div>`,
};

export const BrowserRahmen = {
  name: 'Browser-Rahmen',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="frame">
<div class="nc-shot__frame nc-shot--shadow">
<div class="nc-shot__chrome-bar">
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-dot">
</span>
<span class="nc-shot__chrome-url">workplace.neocosmo.de</span>
</div>
<div class="nc-shot__viewport">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Browser-Rahmen" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 45.00%; transform-origin: 50.00% 45.00%; transform: scale(1.1);">
</div>
</div>
</div>`,
};

export const RahmenMinimalohneSchatten = {
  name: 'Rahmen Minimal ohne Schatten',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="frame">
<div class="nc-shot__frame">
<div class="nc-shot__viewport">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Browser-Rahmen" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 45.00%; transform-origin: 50.00% 45.00%; transform: scale(1.1);">
</div>
</div>
</div>`,
};

export const KenBurns = {
  name: 'Ken-Burns',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10; --nc-shot-dur: 7s;" data-nc-shot="kenburns" data-nc-shot-fokus="0.25 0.3 1.6" data-nc-shot-ziel="0.7 0.6 1.3" data-nc-shot-dauer="7">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Ken-Burns" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 25.00% 30.00%; transform-origin: 25.00% 30.00%; transform: scale(1.6);">
</div>`,
};

export const Lupe = {
  name: 'Lupe',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="lens" data-nc-shot-lupe-groesse="160" data-nc-shot-lupe-zoom="2.5">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Lupe" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 50.00%; transform-origin: 50.00% 50.00%;">
</div>`,
};

export const Marker = {
  name: 'Marker',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="hotspots">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Marker" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 50.00%; transform-origin: 50.00% 50.00%;">
<button type="button" class="nc-shot__hotspot" aria-label="Suche" style="left: 30%; top: 32%;" data-nc-shot-titel="Suche" data-nc-shot-text="Volltextsuche über alle Bereiche." data-nc-shot-fokus="0.3 0.32 2.5">
</button>
<button type="button" class="nc-shot__hotspot" aria-label="Detail 2" style="left: 72%; top: 60%;" data-nc-shot-text="Detail ohne Titel — Zoom nach Vorgabe.">
</button>
</div>`,
};

export const MarkerErklrungoffen = {
  name: 'Marker — Erklärung offen',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="hotspots">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Marker" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 50.00%; transform-origin: 50.00% 50.00%;">
<button type="button" class="nc-shot__hotspot" aria-label="Suche" style="left: 30%; top: 32%;" data-nc-shot-titel="Suche" data-nc-shot-text="Volltextsuche über alle Bereiche." data-nc-shot-fokus="0.3 0.32 2.5" aria-expanded="true" aria-description="Suche: Volltextsuche über alle Bereiche.">
<div class="nc-shot__tip">
<div class="nc-shot">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 30.00% 32.00%; transform-origin: 30.00% 32.00%; transform: scale(2.5);">
</div>
<strong class="nc-shot__tip-title">Suche</strong>
<p>Volltextsuche über alle Bereiche.</p>
</div>
</button>
<button type="button" class="nc-shot__hotspot" aria-label="Detail 2" style="left: 72%; top: 60%;" data-nc-shot-text="Detail ohne Titel — Zoom nach Vorgabe." aria-expanded="false">
</button>
</div>`,
};

export const VorherNachher = {
  name: 'Vorher/Nachher',
  render: () => `<div class="nc-shot nc-shot--ratio" style="aspect-ratio: 16 / 10;" data-nc-shot="compare">
<div class="nc-shot__compare">
<div class="nc-shot">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E" alt="Vergleich" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 50.00%; transform-origin: 50.00% 50.00%;">
</div>
<div class="nc-shot" style="clip-path: inset(0 65% 0 0);">
<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%239fb7c9%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23587386%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23587386%22/%3E%3C/svg%3E" alt="" loading="lazy" decoding="async" class="nc-shot__img" style="object-position: 50.00% 50.00%; transform-origin: 50.00% 50.00%;">
</div>
<div class="nc-shot__divider" style="left: 35%;">
</div>
<input type="range" min="0" max="100" aria-label="Vergleichsposition">
</div>
</div>`,
};
