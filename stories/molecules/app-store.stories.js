// ============================================================
// AppStore — Auto-generated from app-store-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/AppStore',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AppStore** v1.0.0 (stable)

Die Abzeichen sind KEINE Nachbauten der Marken von Apple und Google. Beide geben eigene Bilddateien und Gestaltungsvorgaben vor; bis die vorliegen, steht hier eine Schaltflaeche im Systemstil.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/app-store.html</code>.
  </p>
  <div class="nc-app-store">
    app-store
  </div>
</div>`,
};
