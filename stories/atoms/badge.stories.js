// ============================================================
// Badge — Auto-generated from badge-recipe.json
// Version: 2.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Badge** v2.2.0 (stable)

Badge ist NIEMALS fokussierbar — immer <span>, kein role='button', kein tabindex.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>`,
};

export const AllVariantsMD = {
  name: 'All Variants — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Tone-Varianten in Standardgroesse' },
    },
  },
};

export const EmphasisTone = {
  name: 'Emphasis × Tone',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Solid, Outline und Soft je Tone — visuelles QA-Grid' },
    },
  },
};

export const SizeScaleSMMD = {
  name: 'Size Scale — SM / MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Jede Variante in SM und MD' },
    },
  },
};

export const WithIcon = {
  name: 'With Icon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Leading-Icon je nach Variante' },
    },
  },
};

export const DotMode = {
  name: 'Dot Mode',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Status-Kreise pro Variante' },
    },
  },
};

export const CounterBadges = {
  name: 'Counter Badges',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Notification Counts — Default und Error' },
    },
  },
};

export const BadgeonAvatar = {
  name: 'Badge on Avatar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Integration mit Avatar-Komponente' },
    },
  },
};

export const DecoratorBadgeonIcon = {
  name: 'Decorator (Badge on Icon)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-badge">
    <span class="nc-badge__label">badge</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Absolute positioniertes Badge auf Icon-Button mit Ring-Abgrenzung' },
    },
  },
};
