// ============================================================
// Device — Auto-generated from device-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Device',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Device** v1.0.0 (stable)

Das Seitenverhaeltnis 1206/2622 ist das gemessene Mass der vorhandenen App-Screenshots (iPhone 17), nicht ein gerundeter Geraetewert. Wo Rahmen und Bild uebereinstimmen, hat object-fit nichts zu tun.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-device">
    <span class="nc-device__screen">screen</span>
  </div>`,
};
