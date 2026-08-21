// ============================================================
// Input — Auto-generated from input-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Input** v2.0.0 (stable)

Input ist immer ein <input> Element mit type='text|email|url|tel|password|search|number|color'.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /datenschutz -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<input class="nc-input nc-footer__newsletter-input" type="email" id="ft-nl-email" name="email" placeholder="name@firma.de" autocomplete="email" required="">`,
};
