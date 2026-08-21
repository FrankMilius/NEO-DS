// ============================================================
// Textarea — Auto-generated from textarea-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Textarea',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Textarea** v2.0.0 (stable)

Textarea ist ein natives <textarea class='nc-textarea'>. Kein JS fuer Basis-Funktion noetig.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /unternehmen/kontakt -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<textarea class="nc-textarea" rows="4" name="message" id="nf-message" placeholder="Beschreiben Sie Ihr Vorhaben …" required="">
</textarea>`,
};
