// ============================================================
// Toolbar — Auto-generated from toolbar-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Toolbar** v2.0.0 (stable)

Root: role='toolbar', aria-label. Flex-Layout, flex-wrap, min-height 48px.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>`,
};

export const Variants = {
  name: 'Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Bordered, Border-Bottom, Floating, Blurred im Vergleich' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start, Center, Justify — Ausrichtung der Gruppen' },
    },
  },
};

export const Density = {
  name: 'Density',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default (48px) vs Compact (32px Desktop / 48px Mobile)' },
    },
  },
};

export const Content = {
  name: 'Content',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Buttons-Only, Separator, Spacer, Label, Full' },
    },
  },
};

export const FloatingCanvasEditor = {
  name: 'Floating (Canvas Editor)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Schwebende Toolbar fuer Canvas-/Grafik-Editoren' },
    },
  },
};

export const BlurredShell = {
  name: 'Blurred (Shell)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Glassmorphism-Toolbar fuer Shell-/App-Frames' },
    },
  },
};

export const TableToolbar = {
  name: 'Table Toolbar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typische Toolbar ueber einer Datentabelle — Filter, Suche, Aktionen' },
    },
  },
};

export const EditorToolbar = {
  name: 'Editor Toolbar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toolbar">
    <span class="nc-toolbar__group">group</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Formatting-Toolbar fuer Text-Editor — Bold, Italic, Alignment via Toggle-Group' },
    },
  },
};
