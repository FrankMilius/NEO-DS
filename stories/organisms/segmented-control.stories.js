// ============================================================
// SegmentedControl — Auto-generated from segmented-control-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SegmentedControl',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SegmentedControl** v2.0.0 (stable)

Container ist ein <div class='nc-segmented-control' role='radiogroup'> mit aria-label.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Segmented Control mit Items in allen Zustaenden' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich' },
    },
  },
};

export const ContentTypes = {
  name: 'Content Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text-only vs Icon+Text vs Icon-only vs Text+Badge' },
    },
  },
};

export const WithBadgeCounter = {
  name: 'With Badge Counter',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Segmented Control mit Badge-Countern — Farbe wechselt bei Selected-State' },
    },
  },
};

export const AutovsFullWidth = {
  name: 'Auto vs Full Width',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Auto-Width (Inhalt bestimmt Breite) vs Full-Width (gleichmaessig verteilt)' },
    },
  },
};

export const SlidingIndicator = {
  name: 'Sliding Indicator',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Animierter aktiver Hintergrund — gleitet per CSS transition zum aktiven Segment' },
    },
  },
};

export const ScrollableOverflow = {
  name: 'Scrollable Overflow',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontaler Scroll bei vielen Segmenten' },
    },
  },
};

export const SelectedStateDetail = {
  name: 'Selected State Detail',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-segmented-control">
    <span class="nc-segmented-control__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Detail-Ansicht des Selected-State mit Shadow und Transition' },
    },
  },
};
