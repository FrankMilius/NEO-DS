// ============================================================
// NavMolecules — Auto-generated from nav-molecules-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavMolecules',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavMolecules** v2.0.0 (stable)

Nav-Link: inline-flex, gap, padding, radius — Hover: BG-Wechsel + Textfarbe. Active: border-bottom accent.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-nav__link">
    <span class="nc-nav__link">nav-link</span>
  </div>`,
};

export const NavLinkStates = {
  name: 'Nav Link States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__link">
    <span class="nc-nav__link">nav-link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default → Hover → Active → Focus' },
    },
  },
};

export const LinkwithIconBadge = {
  name: 'Link with Icon + Badge',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__link">
    <span class="nc-nav__link">nav-link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nav-Link mit Icon-Atom und optionalem Badge-Dot' },
    },
  },
};

export const MobileToggleHamburger = {
  name: 'Mobile Toggle (Hamburger)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__link">
    <span class="nc-nav__link">nav-link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hamburger-Icon mit 3 Balken — steuert Mobile Panel' },
    },
  },
};

export const LanguageToggle = {
  name: 'Language Toggle',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-nav__link">
    <span class="nc-nav__link">nav-link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sprachumschalter mit Active-State' },
    },
  },
};

export const FullNavMoleculeComposition = {
  name: 'Full Nav Molecule Composition',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Molekuele zusammen: Links + Toggle + Lang + Mobile' },
    },
  },
};
