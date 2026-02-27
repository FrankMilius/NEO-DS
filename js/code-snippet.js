/**
 * Code Snippet – Vanilla JS Controller
 * =====================================
 * Syntax-Highlighting (Prism.js), Copy-to-Clipboard, Show More/Less.
 *
 * Verwendung:
 *   const cs = setupCodeSnippet(containerEl);
 *
 * Auto-Init:
 *   setupCodeSnippets() — initialisiert alle .nc-code-snippet Block-Container.
 *
 * API:
 *   destroy()  Event-Listener entfernen
 */

// SVG Icons (Tabler: clipboard + check, 16×16)
const ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2"/></svg>';
const ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10"/></svg>';

/**
 * Initialisiert ein einzelnes Code-Snippet.
 * @param {HTMLElement} container - Das .nc-code-snippet Element
 * @returns {{ destroy: () => void }}
 */
const setupCodeSnippet = (container) => {
  const ac = new AbortController();
  const signal = ac.signal;

  const codeEl = container.querySelector('.nc-code-snippet__code');
  const copyBtn = container.querySelector('.nc-code-snippet__copy');
  const showMoreBtn = container.querySelector('.nc-code-snippet__show-more');
  const preEl = container.querySelector('.nc-code-snippet__pre');

  // --- Prism Highlighting ---
  if (codeEl && typeof Prism !== 'undefined') {
    try {
      Prism.highlightElement(codeEl);
    } catch (err) {
      console.warn('[code-snippet] Prism highlighting failed:', err.message);
    }
  }

  // --- Copy to Clipboard ---
  if (copyBtn && codeEl) {
    // Icons injizieren falls leer
    if (!copyBtn.querySelector('.nc-code-snippet__copy-icon')) {
      copyBtn.innerHTML =
        `<span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--copy">${ICON_COPY}</span>` +
        `<span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--check">${ICON_CHECK}</span>`;
    }

    let resetTimer = null;

    copyBtn.addEventListener('click', async () => {
      const text = codeEl.textContent;

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback fuer aeltere Browser / unsichere Kontexte
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visuelles Feedback
      copyBtn.classList.add('nc-code-snippet__copy--success');
      copyBtn.setAttribute('aria-label', 'Kopiert!');

      // Reset nach 2 Sekunden
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copyBtn.classList.remove('nc-code-snippet__copy--success');
        copyBtn.setAttribute('aria-label', 'Code kopieren');
      }, 2000);
    }, { signal });
  }

  // --- Show More / Less ---
  if (showMoreBtn && preEl) {
    const labelEl = showMoreBtn.querySelector('.nc-code-snippet__show-more-label');

    const checkOverflow = () => {
      const maxH = parseFloat(getComputedStyle(container).getPropertyValue('--nc-cs-multi-max-height')) || 240;
      const scrollH = preEl.scrollHeight;
      const needsExpand = scrollH > maxH;
      showMoreBtn.hidden = !needsExpand;

      // Wenn Inhalt nicht ueberlaeuft, Expanded-State entfernen
      if (!needsExpand) {
        container.classList.remove('nc-code-snippet--expanded');
        showMoreBtn.setAttribute('aria-expanded', 'false');
        if (labelEl) labelEl.textContent = 'Mehr anzeigen';
      }
    };

    // Initial pruefen (nach Prism-Highlighting kann sich Hoehe aendern)
    checkOverflow();
    requestAnimationFrame(checkOverflow);

    showMoreBtn.addEventListener('click', () => {
      const expanded = container.classList.toggle('nc-code-snippet--expanded');
      showMoreBtn.setAttribute('aria-expanded', String(expanded));
      if (labelEl) {
        labelEl.textContent = expanded ? 'Weniger anzeigen' : 'Mehr anzeigen';
      }
    }, { signal });
  }

  return {
    destroy() {
      ac.abort();
    },
  };
};

/**
 * Auto-Init: Initialisiert alle .nc-code-snippet Block-Varianten auf der Seite.
 * Inline-Snippets brauchen kein JS.
 */
const setupCodeSnippets = () => {
  document.querySelectorAll('.nc-code-snippet:not(.nc-code-snippet--inline)').forEach((el) => {
    if (el._ncCodeSnippet) return; // bereits initialisiert
    el._ncCodeSnippet = setupCodeSnippet(el);
  });
};

// --- Window Export ---
if (typeof window !== 'undefined') {
  window.setupCodeSnippet = setupCodeSnippet;
  window.setupCodeSnippets = setupCodeSnippets;
}
