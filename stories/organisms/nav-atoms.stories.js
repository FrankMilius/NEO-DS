// ============================================================
// NavAtoms — Auto-generated from nav-atoms-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavAtoms',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavAtoms** v2.0.0 (stable)

Icon: inline-flex Container, width/height via --nc-nav-atom-icon-size (default 24px).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-nav__icon">
    <span class="nc-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-nav__label">nav-atoms</span>
  </div>`,
};

export const IconPrimitives = {
  name: 'Icon Primitives',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__icon">
    <span class="nc-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-nav__label">nav-atoms</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nav-Icon in verschiedenen Groessen und Farben' },
    },
  },
};

export const LabelPrimitives = {
  name: 'Label Primitives',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__icon">
    <span class="nc-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-nav__label">nav-atoms</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nav-Label mit unterschiedlichen Gewichtungen' },
    },
  },
};

export const BadgeDot = {
  name: 'Badge Dot',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__icon">
    <span class="nc-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-nav__label">nav-atoms</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Notification-Indikator an Icon' },
    },
  },
};
