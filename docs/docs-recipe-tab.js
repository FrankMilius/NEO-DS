// ==========================================================================
// Docs Recipe Tab — Dynamischer Rezept-Tab fuer Komponentenseiten
// ==========================================================================
// Laedt die Recipe-JSON-Datei fuer die aktuelle Komponente und injiziert
// einen "Rezept"-Tab mit Achsen, States, Specimens, Token Groups und A11y.
//
// Voraussetzung: docs-tabs.js muss Event-Delegation verwenden, damit
// dynamisch hinzugefuegte Tabs funktionieren.
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Component-Slug aus URL extrahieren
  // -----------------------------------------------------------------------

  var match = window.location.pathname.match(/\/([a-z0-9-]+)-docs(?:\.html)?$/);
  if (!match) return;
  var slug = match[1];

  // Kein Rezept-Tab fuer Nicht-Komponenten-Seiten
  var NON_COMPONENT_SLUGS = [
    'index', 'grid', 'color', 'spacing', 'typography', 'radii', 'border',
    'elements', 'icons', 'themes', 'shadow-elevation', 'opacity-zindex-motion',
    'utility-a11y', 'utility-visibility', 'component-matrix',
    'architecture', 'recipe-status',
    'home-hero', 'home-basic', 'dashboard',
    'settings-page', 'error-page'
  ];
  if (NON_COMPONENT_SLUGS.indexOf(slug) !== -1) return;

  // -----------------------------------------------------------------------
  // 2. Pruefe ob ein Tablist existiert (nur Komponentenseiten haben Tabs)
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list[role="tablist"]');
  if (!tabList) return;

  // -----------------------------------------------------------------------
  // 3. Recipe-JSON laden
  // -----------------------------------------------------------------------

  var recipeUrl = '../data/' + slug + '-recipe.json';

  fetch(recipeUrl)
    .then(function (r) {
      if (!r.ok) throw new Error('Kein Recipe gefunden');
      return r.json();
    })
    .then(function (recipe) {
      injectRecipeTab(tabList, recipe);
    })
    .catch(function () {
      // Kein Recipe vorhanden — kein Tab anzeigen (graceful degradation)
    });

  // -----------------------------------------------------------------------
  // 4. Tab injizieren
  // -----------------------------------------------------------------------

  function injectRecipeTab(tabList, recipe) {
    // Tab-Trigger erstellen
    var trigger = document.createElement('button');
    trigger.className = 'docs-tabs__trigger';
    trigger.setAttribute('role', 'tab');
    trigger.setAttribute('aria-selected', 'false');
    trigger.setAttribute('aria-controls', 'tab-recipe');
    trigger.id = 'trigger-recipe';
    trigger.textContent = 'Rezept';
    tabList.appendChild(trigger);

    // Panel erstellen
    var panel = document.createElement('div');
    panel.className = 'docs-tabs__panel';
    panel.setAttribute('role', 'tabpanel');
    panel.id = 'tab-recipe';
    panel.setAttribute('aria-labelledby', 'trigger-recipe');

    // Panel nach dem letzten existierenden Panel einfuegen
    var tabsContainer = document.querySelector('.docs-tabs');
    if (tabsContainer) {
      tabsContainer.appendChild(panel);
    }

    // Inhalt rendern
    renderRecipeContent(panel, recipe);

    // TOC ueber neue Headings informieren
    document.dispatchEvent(new CustomEvent('docs-recipe-ready', {
      detail: { panelId: 'tab-recipe' }
    }));
  }

  // -----------------------------------------------------------------------
  // 5. Recipe-Inhalt rendern
  // -----------------------------------------------------------------------

  function renderRecipeContent(container, recipe) {
    var html = '';

    // Meta
    html += renderMeta(recipe.meta);

    // Anatomy
    if (recipe.anatomy) {
      html += renderAnatomy(recipe.anatomy);
    }

    // Achsen
    if (recipe.axes) {
      html += renderAxes(recipe.axes);
    }

    // States
    if (recipe.states) {
      html += renderStates(recipe.states);
    }

    // Specimens
    if (recipe.specimens && recipe.specimens.length) {
      html += renderSpecimens(recipe.specimens);
    }

    // Token Groups
    if (recipe.styling && recipe.styling.tokenGroups) {
      html += renderTokenGroups(recipe.styling);
    }

    // Accessibility
    if (recipe.a11y) {
      html += renderA11y(recipe.a11y);
    }

    // Constraints
    if (recipe.constraints && recipe.constraints.rules && recipe.constraints.rules.length) {
      html += renderConstraints(recipe.constraints);
    }

    // JSON-Link
    html += '<div class="docs-recipe__source">';
    html += '<a href="../data/' + slug + '-recipe.json" target="_blank" class="docs-recipe__json-link">';
    html += slug + '-recipe.json ansehen</a>';
    html += '</div>';

    container.innerHTML = html;

    // IDs fuer alle Section-Headings setzen (fuer TOC-Verlinkung)
    var recipeHeadings = container.querySelectorAll('.docs__section-title');
    recipeHeadings.forEach(function (h, i) {
      if (!h.id) {
        h.id = 'recipe-section-' + (i + 1);
      }
    });

    // Verwandte Komponenten nachladen (async)
    loadRelatedComponents(container, recipe);

    // Sidebar-Indikator setzen
    setSidebarIndicator(recipe.meta);
  }

  // -----------------------------------------------------------------------
  // 6. Render-Funktionen
  // -----------------------------------------------------------------------

  function renderMeta(meta) {
    if (!meta) return '';
    var statusClass = meta.status === 'stable' ? 'nc-badge--success'
      : meta.status === 'draft' ? 'nc-badge--warning'
      : meta.status === 'deprecated' ? 'nc-badge--danger' : '';

    var html = '<div class="docs-recipe__meta">';
    html += '<h2 class="docs__section-title">Rezept: ' + capitalize(meta.component) + '</h2>';
    html += '<div class="docs-recipe__meta-row">';
    html += '<span class="nc-badge ' + statusClass + '">' + (meta.status || 'unknown') + '</span>';
    html += '<span class="docs-recipe__version">v' + (meta.version || '?') + '</span>';
    html += '<span class="docs-recipe__schema">Schema ' + (meta.schemaVersion || '?') + '</span>';
    html += '</div>';

    if (meta.tags && meta.tags.length) {
      html += '<div class="docs-recipe__tags">';
      meta.tags.forEach(function (tag) {
        html += '<span class="nc-tag nc-tag--sm">' + tag + '</span>';
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderAnatomy(anatomy) {
    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Anatomy</h3>';

    // Root
    html += '<p class="docs-recipe__root">Root-Element: <code>' + anatomy.root.element + '</code></p>';

    // Slots
    if (anatomy.slots && anatomy.slots.length) {
      html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
      html += '<table class="nc-data-table__table">';
      html += '<thead><tr><th>Slot</th><th>Element</th><th>Optional</th></tr></thead>';
      html += '<tbody>';
      anatomy.slots.forEach(function (slot) {
        html += '<tr>';
        html += '<td><code>' + slot.name + '</code></td>';
        html += '<td><code>' + slot.element + '</code></td>';
        html += '<td>' + (slot.optional ? 'Ja' : 'Nein') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }

    // DOM Notes
    if (anatomy.domNotes && anatomy.domNotes.length) {
      html += '<div class="docs-recipe__dom-notes">';
      html += '<h4>DOM-Hinweise</h4>';
      html += '<ul>';
      anatomy.domNotes.forEach(function (note) {
        html += '<li>' + note + '</li>';
      });
      html += '</ul></div>';
    }

    html += '</div>';
    return html;
  }

  function renderAxes(axes) {
    var keys = Object.keys(axes);
    if (!keys.length) return '';

    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Achsen (' + keys.length + ')</h3>';
    html += '<p class="docs-recipe__desc">Variationsdimensionen der Komponente. Jede Achse definiert eine unabhaengige Eigenschaft.</p>';

    keys.forEach(function (axisKey) {
      var axis = axes[axisKey];
      var values = axis.values ? Object.keys(axis.values) : [];

      html += '<div class="docs-recipe__axis">';
      html += '<h4>' + (axis.label || axisKey) + '</h4>';
      if (axis.description) {
        html += '<p class="docs-recipe__axis-desc">' + axis.description + '</p>';
      }

      html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
      html += '<table class="nc-data-table__table">';
      html += '<thead><tr><th>Wert</th><th>Modifier-Klasse</th><th>Render-Hint</th></tr></thead>';
      html += '<tbody>';

      values.forEach(function (valKey) {
        var val = axis.values[valKey];
        html += '<tr>';
        html += '<td><code>' + valKey + '</code></td>';
        html += '<td>' + (val.modifier ? '<code>.' + val.modifier + '</code>' : '<span class="docs-recipe__none">—</span>') + '</td>';
        html += '<td>' + (val.renderHint || '—') + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table></div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderStates(states) {
    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">States</h3>';

    // Supported States
    if (states.supported && states.supported.length) {
      html += '<div class="docs-recipe__states-list">';
      html += '<strong>Unterstuetzt:</strong> ';
      states.supported.forEach(function (s, i) {
        if (i > 0) html += ' → ';
        html += '<code>' + s + '</code>';
      });
      html += '</div>';
    }

    // Precedence
    if (states.precedence && states.precedence.length) {
      html += '<div class="docs-recipe__states-list">';
      html += '<strong>Prioritaet (hoch → niedrig):</strong> ';
      states.precedence.forEach(function (s, i) {
        if (i > 0) html += ' → ';
        html += '<code>' + s + '</code>';
      });
      html += '</div>';
    }

    // Interactive
    html += '<div class="docs-recipe__states-list">';
    html += '<strong>Interaktiv:</strong> ' + (states.interactive ? 'Ja' : 'Nein');
    html += '</div>';

    // Rules
    if (states.rules && states.rules.length) {
      html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
      html += '<table class="nc-data-table__table">';
      html += '<thead><tr><th>State</th><th>Bedingung</th></tr></thead>';
      html += '<tbody>';
      states.rules.forEach(function (rule) {
        html += '<tr>';
        html += '<td><code>' + rule.state + '</code></td>';
        html += '<td>' + (rule.condition || rule.effects ? (rule.condition || rule.effects.join(', ')) : '—') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }

    html += '</div>';
    return html;
  }

  function renderSpecimens(specimens) {
    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Specimens (' + specimens.length + ')</h3>';
    html += '<p class="docs-recipe__desc">Vordefinierte Test-Matrizen fuer Varianten-Kombinationen.</p>';

    html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
    html += '<table class="nc-data-table__table">';
    html += '<thead><tr><th>ID</th><th>Label</th><th>Beschreibung</th><th>Layout</th><th>Matrix</th></tr></thead>';
    html += '<tbody>';

    specimens.forEach(function (spec) {
      var matrixSummary = '';
      if (spec.matrix && spec.matrix.axes) {
        var axisEntries = Object.keys(spec.matrix.axes).map(function (k) {
          var v = spec.matrix.axes[k];
          return k + ': ' + (v === '*' ? 'alle' : (Array.isArray(v) ? v.join(', ') : v));
        });
        matrixSummary = axisEntries.join('; ');
      }

      html += '<tr>';
      html += '<td><code>' + spec.id + '</code></td>';
      html += '<td>' + (spec.label || '') + '</td>';
      html += '<td>' + (spec.description || '') + '</td>';
      html += '<td><code>' + (spec.layout || 'row') + '</code></td>';
      html += '<td>' + matrixSummary + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    html += '</div>';
    return html;
  }

  function renderTokenGroups(styling) {
    var groups = styling.tokenGroups || {};
    var keys = Object.keys(groups);
    if (!keys.length) return '';

    var hasTokens = keys.some(function (k) { return groups[k].tokens && groups[k].tokens.length; });

    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Token Groups (' + keys.length + ')</h3>';

    // Base Classes
    if (styling.baseClasses && styling.baseClasses.length) {
      html += '<p><strong>Basis-Klassen:</strong> ';
      styling.baseClasses.forEach(function (cls, i) {
        if (i > 0) html += ', ';
        html += '<code>.' + cls + '</code>';
      });
      html += '</p>';
    }

    // Base Token Groups
    if (styling.baseTokenGroups && styling.baseTokenGroups.length) {
      html += '<p><strong>Basis Token Groups:</strong> ';
      styling.baseTokenGroups.forEach(function (tg, i) {
        if (i > 0) html += ', ';
        html += '<code>' + tg + '</code>';
      });
      html += '</p>';
    }

    if (!hasTokens) {
      html += '<p class="docs-recipe__empty">Keine Token-Zuweisungen (Lean Recipe).</p>';
    } else {
      keys.forEach(function (groupKey) {
        var group = groups[groupKey];
        if (!group.tokens || !group.tokens.length) return;

        html += '<details class="docs-recipe__token-group">';
        html += '<summary><strong>' + (group.label || groupKey) + '</strong> (' + group.tokens.length + ' Tokens)</summary>';
        html += '<ul class="docs-recipe__token-list">';
        group.tokens.forEach(function (token) {
          html += '<li><code>--' + token + '</code></li>';
        });
        html += '</ul></details>';
      });
    }

    html += '</div>';
    return html;
  }

  function renderA11y(a11y) {
    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Accessibility</h3>';

    if (a11y.base) {
      html += '<div class="docs-recipe__a11y-base">';
      html += '<p><strong>Interaktiv:</strong> ' + (a11y.base.interactive ? 'Ja' : 'Nein') + '</p>';
      html += '<p><strong>Kontrast-Ziel:</strong> ' + (a11y.base.contrastTarget || '—') + '</p>';

      if (a11y.base.assertions && a11y.base.assertions.length) {
        html += '<p><strong>Assertions:</strong></p><ul>';
        a11y.base.assertions.forEach(function (a) {
          html += '<li><code>' + a + '</code></li>';
        });
        html += '</ul>';
      }

      if (a11y.base.note) {
        html += '<p class="docs-recipe__note">' + a11y.base.note + '</p>';
      }
      html += '</div>';
    }

    // Overrides
    if (a11y.overrides && a11y.overrides.length) {
      html += '<h4>Bedingte Overrides</h4>';
      html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
      html += '<table class="nc-data-table__table">';
      html += '<thead><tr><th>Bedingung</th><th>Anforderung</th><th>Kontrast</th></tr></thead>';
      html += '<tbody>';

      a11y.overrides.forEach(function (ov) {
        var condition = '—';
        if (ov.when && ov.when.axes) {
          condition = Object.keys(ov.when.axes).map(function (k) {
            return k + ': ' + (Array.isArray(ov.when.axes[k]) ? ov.when.axes[k].join(', ') : ov.when.axes[k]);
          }).join('; ');
        }
        html += '<tr>';
        html += '<td>' + condition + '</td>';
        html += '<td>' + (ov.require ? ov.require.join(', ') : '—') + '</td>';
        html += '<td>' + (ov.contrastTarget || '—') + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table></div>';
    }

    html += '</div>';
    return html;
  }

  function renderConstraints(constraints) {
    var html = '<div class="docs-recipe__section">';
    html += '<h3 class="docs__section-title">Constraints</h3>';

    if (constraints.rules && constraints.rules.length) {
      html += '<div class="nc-data-table nc-data-table--static nc-data-table--striped">';
      html += '<table class="nc-data-table__table">';
      html += '<thead><tr><th>Bedingung</th><th>Anforderung</th></tr></thead>';
      html += '<tbody>';

      constraints.rules.forEach(function (rule) {
        var condition = '—';
        if (rule.when && rule.when.axes) {
          condition = Object.keys(rule.when.axes).map(function (k) {
            return k + ': ' + (Array.isArray(rule.when.axes[k]) ? rule.when.axes[k].join(', ') : rule.when.axes[k]);
          }).join('; ');
        }
        html += '<tr>';
        html += '<td>' + condition + '</td>';
        html += '<td>' + (rule.require ? rule.require.join(', ') : '—') + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table></div>';
    }

    if (constraints.copy) {
      var copyKeys = Object.keys(constraints.copy);
      if (copyKeys.length) {
        html += '<h4>Copy-Regeln</h4>';
        html += '<ul>';
        copyKeys.forEach(function (k) {
          var c = constraints.copy[k];
          html += '<li><code>' + k + '</code>: max ' + c.maxChars + ' Zeichen';
          if (c.truncation) html += ' (Truncation: ' + c.truncation + ')';
          html += '</li>';
        });
        html += '</ul>';
      }
    }

    html += '</div>';
    return html;
  }

  // -----------------------------------------------------------------------
  // 7. Verwandte Komponenten (Cross-Links via Recipe Manifest)
  // -----------------------------------------------------------------------

  function loadRelatedComponents(container, recipe) {
    fetch('../data/recipe-manifest.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (manifest) {
        if (!manifest.length) return;

        var currentTags = new Set(recipe.meta && recipe.meta.tags ? recipe.meta.tags : []);
        var currentComponent = recipe.meta ? recipe.meta.component : slug;
        if (!currentTags.size) return;

        // Verwandte finden: mindestens 1 gemeinsamer Tag
        var related = manifest.filter(function (m) {
          if (m.component === currentComponent) return false;
          return m.tags.some(function (t) { return currentTags.has(t); });
        });

        // Nach Uebereinstimmungsgrad sortieren (meiste gemeinsame Tags zuerst)
        related.sort(function (a, b) {
          var aCount = a.tags.filter(function (t) { return currentTags.has(t); }).length;
          var bCount = b.tags.filter(function (t) { return currentTags.has(t); }).length;
          return bCount - aCount;
        });

        // Max 8 anzeigen
        related = related.slice(0, 8);
        if (!related.length) return;

        var html = '<div class="docs-recipe__section">';
        html += '<h3 class="docs__section-title">Verwandte Komponenten</h3>';
        html += '<div class="docs-recipe__related">';

        related.forEach(function (m) {
          var href = m.docsLink ? '.' + m.docsLink + '.html' : './' + m.component + '-docs.html';
          var commonTags = m.tags.filter(function (t) { return currentTags.has(t); });

          html += '<a href="' + href + '" class="docs-recipe__related-item">';
          html += '<strong>' + capitalize(m.component) + '</strong>';
          html += '<span class="docs-recipe__related-tags">' + commonTags.join(', ') + '</span>';
          html += '</a>';
        });

        html += '</div></div>';

        // Vor dem JSON-Link einfuegen
        var sourceDiv = container.querySelector('.docs-recipe__source');
        if (sourceDiv) {
          sourceDiv.insertAdjacentHTML('beforebegin', html);
        } else {
          container.insertAdjacentHTML('beforeend', html);
        }
      })
      .catch(function () { /* Manifest nicht verfuegbar — kein Problem */ });
  }

  // -----------------------------------------------------------------------
  // 8. Sidebar-Indikator
  // -----------------------------------------------------------------------

  function setSidebarIndicator(meta) {
    if (!meta || !meta.component) return;

    // Link im Sidebar finden
    var links = document.querySelectorAll('.docs-sidebar__link');
    var currentHref = slug + '-docs';

    links.forEach(function (link) {
      if (link.getAttribute('href') && link.getAttribute('href').indexOf(currentHref) !== -1) {
        // Nur setzen wenn noch kein Indikator vorhanden
        if (link.querySelector('.docs-sidebar__recipe-dot')) return;

        var dot = document.createElement('span');
        dot.className = 'docs-sidebar__recipe-dot';
        dot.setAttribute('data-status', meta.status || 'unknown');
        dot.title = 'Recipe: ' + (meta.status || 'unknown');
        link.appendChild(dot);
      }
    });
  }

  // -----------------------------------------------------------------------
  // 9. Hilfsfunktionen
  // -----------------------------------------------------------------------

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();
