// ============================================================
// Kbd — Auto-generated from kbd-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Kbd',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Kbd** v1.0.0 (stable)

Kbd ist ein natives <kbd class='nc-kbd'> Element — semantisch korrekt fuer Tastatur-Eingaben.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-kbd">
    kbd
  </div>`,
};

export const SingleKey = {
  name: 'Single Key',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-kbd">
    kbd
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einzelne Taste in verschiedenen Laengen' },
    },
  },
};

export const KeyCombination = {
  name: 'Key Combination',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-kbd">
    kbd
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tastenkombination mit Separator (z.B. Ctrl+S, Cmd+Shift+P)' },
    },
  },
};

export const KbdinFliesstext = {
  name: 'Kbd in Fliesstext',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-kbd">
    kbd
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kbd eingebettet in einen Textabsatz' },
    },
  },
};

export const KbdinTooltip = {
  name: 'Kbd in Tooltip',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-kbd">
    kbd
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Shortcut-Anzeige innerhalb eines Tooltips' },
    },
  },
};

export const ModifierKeys = {
  name: 'Modifier Keys',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-kbd">
    kbd
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Gaengige Modifikator-Tasten (Ctrl, Shift, Alt, Cmd, Enter, Esc, Tab)' },
    },
  },
};
