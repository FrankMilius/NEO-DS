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
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/code-snippet-docs.html -->
<!-- @punkte: 30 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-code-snippet nc-code-snippet--multi">
<span class="nc-code-snippet__label">JavaScript</span>
<pre class="nc-code-snippet__pre language-javascript" tabindex="0">
<code class="nc-code-snippet__code language-javascript">
<span class="token comment">/**
 * Code Snippet – Vanilla JS Controller
 * Syntax-Highlighting, Copy-to-Clipboard, Show More/Less.
 */</span>
<span class="token keyword">const</span>
<span class="token function-variable function">setupCodeSnippet</span>
<span class="token operator">=</span>
<span class="token punctuation">(</span>
<span class="token parameter">container</span>
<span class="token punctuation">)</span>
<span class="token operator">=&gt;</span>
<span class="token punctuation">{</span>
<span class="token keyword">const</span> ac <span class="token operator">=</span>
<span class="token keyword">new</span>
<span class="token class-name">AbortController</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token keyword">const</span> signal <span class="token operator">=</span> ac<span class="token punctuation">.</span>signal<span class="token punctuation">;</span>
<span class="token keyword">const</span> codeEl <span class="token operator">=</span> container<span class="token punctuation">.</span>
<span class="token function">querySelector</span>
<span class="token punctuation">(</span>
<span class="token string">'.nc-code-snippet__code'</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token keyword">const</span> copyBtn <span class="token operator">=</span> container<span class="token punctuation">.</span>
<span class="token function">querySelector</span>
<span class="token punctuation">(</span>
<span class="token string">'.nc-code-snippet__copy'</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token comment">// Prism Highlighting</span>
<span class="token keyword">if</span>
<span class="token punctuation">(</span>codeEl <span class="token operator">&amp;&amp;</span>
<span class="token keyword">typeof</span> Prism <span class="token operator">!==</span>
<span class="token string">'undefined'</span>
<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
 Prism<span class="token punctuation">.</span>
<span class="token function">highlightElement</span>
<span class="token punctuation">(</span>codeEl<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// Copy to Clipboard</span>
<span class="token keyword">if</span>
<span class="token punctuation">(</span>copyBtn <span class="token operator">&amp;&amp;</span> codeEl<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
 copyBtn<span class="token punctuation">.</span>
<span class="token function">addEventListener</span>
<span class="token punctuation">(</span>
<span class="token string">'click'</span>
<span class="token punctuation">,</span>
<span class="token keyword">async</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token operator">=&gt;</span>
<span class="token punctuation">{</span>
<span class="token keyword">const</span> text <span class="token operator">=</span> codeEl<span class="token punctuation">.</span>textContent<span class="token punctuation">;</span>
<span class="token keyword">await</span> navigator<span class="token punctuation">.</span>clipboard<span class="token punctuation">.</span>
<span class="token function">writeText</span>
<span class="token punctuation">(</span>text<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
 copyBtn<span class="token punctuation">.</span>classList<span class="token punctuation">.</span>
<span class="token function">add</span>
<span class="token punctuation">(</span>
<span class="token string">'nc-code-snippet__copy--success'</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token function">setTimeout</span>
<span class="token punctuation">(</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token operator">=&gt;</span>
<span class="token punctuation">{</span>
 copyBtn<span class="token punctuation">.</span>classList<span class="token punctuation">.</span>
<span class="token function">remove</span>
<span class="token punctuation">(</span>
<span class="token string">'nc-code-snippet__copy--success'</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">,</span>
<span class="token number">2000</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">,</span>
<span class="token punctuation">{</span> signal <span class="token punctuation">}</span>
<span class="token punctuation">)</span>
<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">return</span>
<span class="token punctuation">{</span>
<span class="token function-variable function">destroy</span>
<span class="token operator">:</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token operator">=&gt;</span> ac<span class="token punctuation">.</span>
<span class="token function">abort</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">;</span>
</code>
</pre>
<button class="nc-code-snippet__copy" type="button" aria-label="Code kopieren">
<span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--copy">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none">
</path>
<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2">
</path>
<path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2">
</path>
</svg>
</span>
<span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--check">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none">
</path>
<path d="M5 12l5 5l10 -10">
</path>
</svg>
</span>
</button>
<button class="nc-code-snippet__show-more" type="button" aria-expanded="false">
<span class="nc-code-snippet__show-more-label">Mehr anzeigen</span>
</button>
</div>`,
};
