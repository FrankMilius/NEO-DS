// ============================================================
// Skeleton — Auto-generated from skeleton-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Skeleton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Skeleton** v1.0.0 (stable)

Skeleton ist ein <div class='nc-skeleton'> mit aria-hidden='true'.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-skeleton">
    skeleton
  </div>`,
};

export const AllShapes = {
  name: 'All Shapes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Form-Varianten im Vergleich' },
    },
  },
};

export const SizeScaleXSSMMDLG = {
  name: 'Size Scale — XS / SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-skeleton">
    skeleton
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 4 Hoehen-Stufen fuer Text-Skeletons' },
    },
  },
};

export const SkeletonGroupTextBlock = {
  name: 'Skeleton Group (Text Block)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-skeleton">
    skeleton
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Gestapelte Textzeilen — simuliert einen Absatz' },
    },
  },
};

export const CardPlaceholder = {
  name: 'Card Placeholder',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-skeleton">
    skeleton
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Skeleton als Card-Platzhalter (Rect + Heading + Text-Zeilen)' },
    },
  },
};

export const AvatarTextPlaceholder = {
  name: 'Avatar + Text Placeholder',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-skeleton">
    skeleton
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Circle-Skeleton neben Text-Zeilen — simuliert User-Info' },
    },
  },
};

export const ReducedMotion = {
  name: 'Reduced Motion',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-skeleton">
    skeleton
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Shimmer-Animation deaktiviert bei prefers-reduced-motion' },
    },
  },
};
