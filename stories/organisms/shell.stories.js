// ============================================================
// Shell — Auto-generated from shell-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Shell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Shell** v2.0.0 (stable)

Aeusseres Grid (.nc-shell): 5 Rows — banner, linkbar, navbar, stage, footerbar. min-height: 100dvh.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>`,
};

export const LayoutPresets = {
  name: 'Layout Presets',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 6 Presets im Ueberblick — Dashboard, Content-Page, Docs, Landing, Focused, Settings' },
    },
  },
};

export const SidebarStates = {
  name: 'Sidebar States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Expanded, Collapsed, Drawer (Mobile) — am Beispiel Dashboard-Preset' },
    },
  },
};

export const SidebarDensity = {
  name: 'Sidebar Density',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Narrow / Standard / Wide — am Beispiel Dashboard-Preset mit linker Sidebar' },
    },
  },
};

export const ContentAlignment = {
  name: 'Content Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Full vs Center vs Left — am Beispiel Content-Page-Preset' },
    },
  },
};

export const ZIndexGovernance = {
  name: 'Z-Index Governance',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Feste Z-Index-Rangfolge der Shell-Zonen — verhindert Z-Index-Kriege' },
    },
  },
};

export const SkipLink = {
  name: 'Skip-Link',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Accessibility Skip-Link — unsichtbar, erscheint bei :focus ganz oben' },
    },
  },
};

export const Linkbar = {
  name: 'Linkbar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '32px Leiste ueber der Navigation — Links/Rechts-Bereiche, sticky bei Landing' },
    },
  },
};

export const Footerbar = {
  name: 'Footerbar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-shell">
    <span class="nc-shell__skip-link">skip-link</span>
    <span class="nc-shell__navbar">navbar</span>
    <span class="nc-shell__stage">stage</span>
    <span class="nc-shell__main">main</span>
    <span class="nc-shell__content-body">content-body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sticky-Bottom Footerbar mit 3-Zonen-Grid (left/center/right)' },
    },
  },
};
