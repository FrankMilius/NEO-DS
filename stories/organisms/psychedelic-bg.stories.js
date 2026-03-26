// ============================================================
// PsychedelicBg — Auto-generated from psychedelic-bg-recipe.json
// Version: 1.0.0 | Status: experimental
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/PsychedelicBg',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**PsychedelicBg** v1.0.0 (experimental)

Canvas mit position:absolute fuellt den Container. requestAnimationFrame fuer 60fps Rendering. ResizeObserver passt Canvas-Groesse automatisch an.


`,
      },
    },
    status: { type: 'experimental' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-psychedelic-bg">
    <span class="canvas">canvas</span>
  </div>`,
};

export const MoirLinesNeoConStil = {
  name: 'Moiré Lines (NeoCon-Stil)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-psychedelic-bg">
    <span class="canvas">canvas</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dichte parallele Linien mit Sinusverzerrung, erzeugen ein Fingerabdruck-artiges Moire-Muster. Inspiriert von neocon.com.' },
    },
  },
};

export const HalftoneDots = {
  name: 'Halftone Dots',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-psychedelic-bg">
    <span class="canvas">canvas</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Punktmatrix mit groessenmodulierter Verzerrung am Cursor.' },
    },
  },
};

export const KonzentrischeWellen = {
  name: 'Konzentrische Wellen',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-psychedelic-bg">
    <span class="canvas">canvas</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Konzentrische Kreise mit Wellenverzerrung und Ripple-Mauseffekt.' },
    },
  },
};

export const TriangleMesh = {
  name: 'Triangle Mesh',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-psychedelic-bg">
    <span class="canvas">canvas</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dreieck-Tessellation mit Funnel-Effekt am Cursor.' },
    },
  },
};
