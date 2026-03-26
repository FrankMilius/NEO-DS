// ============================================================
// CodeSnippet — Auto-generated from code-snippet-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CodeSnippet',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CodeSnippet** v2.0.0 (stable)

Inline: <code class='nc-code-snippet nc-code-snippet--inline'>. Kein Copy-Button.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>`,
};

export const AllVariants = {
  name: 'All Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inline, Single-Line und Multi-Line im Vergleich' },
    },
  },
};

export const HeaderStyles = {
  name: 'Header Styles',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plain vs macOS vs Window Header' },
    },
  },
};

export const WithLineNumbers = {
  name: 'With Line Numbers',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'CSS-Counter Zeilennummern am linken Rand' },
    },
  },
};

export const LineHighlight = {
  name: 'Line Highlight',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einzelne Zeilen hervorgehoben (z.B. fuer Erlaeuterungen)' },
    },
  },
};

export const LineNumbersHighlight = {
  name: 'Line Numbers + Highlight',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kombination: Zeilennummern + hervorgehobene Zeilen' },
    },
  },
};

export const WrapvsScroll = {
  name: 'Wrap vs Scroll',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zeilenumbruch vs horizontaler Scroll bei langen Zeilen' },
    },
  },
};

export const InlineinFliesstext = {
  name: 'Inline in Fliesstext',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inline-Code eingebettet in einen Textabsatz' },
    },
  },
};

export const MultiLineCollapsedvsExpanded = {
  name: 'Multi-Line: Collapsed vs Expanded',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-code-snippet">
    <span class="nc-code-snippet__pre">pre</span>
    <span class="nc-code-snippet__code">code</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Collapsible Code-Block in beiden Zustaenden' },
    },
  },
};
