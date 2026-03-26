// ============================================================
// Treeview — Auto-generated from treeview-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Treeview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Treeview** v2.0.0 (stable)

Hierarchische Baumstruktur mit role=tree und role=treeitem.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>`,
};

export const Variants = {
  name: 'Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Bordered, Compact, Flush — je mit 3 Ebenen' },
    },
  },
};

export const InteractiveStates = {
  name: 'Interactive States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hover, Selected, Expanded, Disabled nebeneinander' },
    },
  },
};

export const GuideLines = {
  name: 'Guide-Lines',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertikale Verbindungslinien: none vs. solid vs. dashed' },
    },
  },
};

export const CheckboxMultiSelect = {
  name: 'Checkbox Multi-Select',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkboxen pro Node mit Mixed-State auf Eltern' },
    },
  },
};

export const WithActions = {
  name: 'With Actions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kontextuelle Aktionen (Drei-Punkte-Menue, Loeschen) bei Hover sichtbar' },
    },
  },
};

export const WithBadges = {
  name: 'With Badges',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Count-Badges an Nodes (z.B. Anzahl Kinder, ungelesene Items)' },
    },
  },
};

export const DragDrop = {
  name: 'Drag & Drop',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Draggable Nodes mit Drop-Indikatoren (before/inside/after)' },
    },
  },
};

export const DeepHierarchy5Levels = {
  name: 'Deep Hierarchy (5 Levels)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-treeview">
    <span class="nc-treeview__node">node</span>
    <span class="nc-treeview__label">treeview</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tiefer Baum mit Guide-Lines und Compact-Density' },
    },
  },
};
