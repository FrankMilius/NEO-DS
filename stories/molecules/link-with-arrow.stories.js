// ============================================================
// LinkWithArrow — Auto-generated from link-with-arrow-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/LinkWithArrow',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**LinkWithArrow** v1.0.0 (stable)

Flex-Row: Text + Pfeil-Icon. Gap spacing-02.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<a href="#" class="link-with-arrow">
 Mehr erfahren
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M5 12h14M12 5l7 7-7 7">
</path>
</svg>
</a>`,
};
