/*! neo-behaviors 0.2.0 — NEO Design System. Gebaut aus packages/neo-behaviors (scripts/baue-behaviors.mjs). Nicht von Hand aendern. */
(() => {
  // packages/neo-behaviors/kern.js
  var GEBUNDEN = /* @__PURE__ */ new WeakMap();
  function bindeAlle(bereich, behaviors) {
    const neu = [];
    for (const b of behaviors) {
      for (const wurzel of finde(bereich, b.selektor)) {
        let liste = GEBUNDEN.get(wurzel);
        if (!liste) {
          liste = /* @__PURE__ */ new Map();
          GEBUNDEN.set(wurzel, liste);
        }
        if (liste.has(b.id)) continue;
        const steuerung = new AbortController();
        liste.set(b.id, steuerung);
        wurzel.setAttribute("data-neo-behavior", [...liste.keys()].join(" "));
        b.binde(wurzel, steuerung.signal);
        neu.push([wurzel, b.id]);
      }
    }
    return () => {
      for (const [w, id] of neu) loese(w, id);
    };
  }
  function loeseAlle(bereich, behaviors) {
    for (const b of behaviors) for (const wurzel of finde(bereich, b.selektor)) loese(wurzel, b.id);
  }
  function loese(wurzel, id) {
    const liste = GEBUNDEN.get(wurzel);
    const steuerung = liste == null ? void 0 : liste.get(id);
    if (!steuerung) return;
    steuerung.abort();
    liste.delete(id);
    if (liste.size) wurzel.setAttribute("data-neo-behavior", [...liste.keys()].join(" "));
    else wurzel.removeAttribute("data-neo-behavior");
  }
  function finde(bereich, selektor) {
    const treffer = [];
    if (bereich instanceof Element && bereich.matches(selektor)) treffer.push(bereich);
    if ("querySelectorAll" in bereich) treffer.push(...bereich.querySelectorAll(selektor));
    return (
      /** @type {HTMLElement[]} */
      treffer
    );
  }
  function sende(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  }
  function nachbar(liste, aktuell, schritt) {
    const bedienbar = liste.filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
    if (!bedienbar.length) return null;
    const i = bedienbar.indexOf(aktuell);
    return bedienbar[(i + schritt + bedienbar.length) % bedienbar.length];
  }
  function ersterBedienbar(liste, vonHinten = false) {
    const bedienbar = liste.filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
    return vonHinten ? bedienbar.at(-1) : bedienbar[0];
  }
  function zielFuerTaste(key, liste, aktuell, richtung = "beide") {
    const vor = richtung === "horizontal" ? ["ArrowRight"] : richtung === "vertikal" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"];
    const zurueck = richtung === "horizontal" ? ["ArrowLeft"] : richtung === "vertikal" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"];
    if (vor.includes(key)) return nachbar(liste, aktuell, 1);
    if (zurueck.includes(key)) return nachbar(liste, aktuell, -1);
    if (key === "Home") return ersterBedienbar(liste) || null;
    if (key === "End") return ersterBedienbar(liste, true) || null;
    return null;
  }
  var FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';
  function fokussierbare(bereich) {
    return (
      /** @type {HTMLElement[]} */
      [...bereich.querySelectorAll(FOKUSSIERBAR)].filter((e) => !e.closest("[hidden], [inert]") && e.getAttribute("aria-hidden") !== "true")
    );
  }
  function fokusFalle(e, bereich) {
    if (e.key !== "Tab") return;
    const liste = fokussierbare(bereich);
    if (!liste.length) {
      e.preventDefault();
      return;
    }
    const erstes = liste[0];
    const letztes = liste.at(-1);
    const aktiv = (
      /** @type {HTMLElement|null} */
      bereich.ownerDocument.activeElement
    );
    const drin = aktiv && bereich.contains(aktiv);
    if (e.shiftKey && (aktiv === erstes || !drin)) {
      e.preventDefault();
      letztes.focus();
    } else if (!e.shiftKey && (aktiv === letztes || !drin)) {
      e.preventDefault();
      erstes.focus();
    }
  }
  function gesperrt(el) {
    return !!el && (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true");
  }

  // packages/neo-behaviors/tabs.js
  var tabs = {
    id: "tabs",
    selektor: ".nc-tabs",
    binde(wurzel, signal) {
      const liste = wurzel.querySelector(".nc-tabs__list");
      if (!liste) return;
      const ausloeser = () => (
        /** @type {HTMLElement[]} */
        [...liste.querySelectorAll(".nc-tabs__trigger")]
      );
      const vertikal = liste.getAttribute("aria-orientation") === "vertical" || wurzel.classList.contains("nc-tabs--vertical");
      const manuell = wurzel.dataset.neoTabs === "manuell";
      const aktiviere = (tab) => {
        if (!tab || tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true") return;
        const alle = ausloeser();
        const vorher = alle.find((t) => t.getAttribute("aria-selected") === "true");
        if (vorher === tab) return;
        for (const t of alle) {
          const an = t === tab;
          t.classList.toggle("is-active", an);
          t.setAttribute("aria-selected", String(an));
          t.tabIndex = an ? 0 : -1;
          const panel = t.getAttribute("aria-controls") && wurzel.querySelector("#" + CSS.escape(t.getAttribute("aria-controls")));
          if (panel) {
            panel.classList.toggle("is-active", an);
            panel.hidden = !an;
          }
        }
        sende(wurzel, "tab-change", { value: tab.id || tab.textContent.trim(), previousValue: vorher ? vorher.id || vorher.textContent.trim() : null });
      };
      liste.addEventListener("click", (e) => {
        const tab = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-tabs__trigger")
        );
        if (tab && liste.contains(tab)) aktiviere(tab);
      }, { signal });
      liste.addEventListener("keydown", (e) => {
        const tab = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-tabs__trigger")
        );
        if (!tab) return;
        const alle = ausloeser();
        const vor = vertikal ? "ArrowDown" : "ArrowRight";
        const zurueck = vertikal ? "ArrowUp" : "ArrowLeft";
        let ziel = null;
        if (e.key === vor) ziel = nachbar(alle, tab, 1);
        else if (e.key === zurueck) ziel = nachbar(alle, tab, -1);
        else if (e.key === "Home") ziel = ersterBedienbar(alle);
        else if (e.key === "End") ziel = ersterBedienbar(alle, true);
        else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          aktiviere(tab);
          return;
        }
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        if (!manuell) aktiviere(ziel);
      }, { signal });
    }
  };

  // packages/neo-behaviors/accordion.js
  var akkordeon = {
    id: "accordion",
    selektor: ".nc-accordion",
    binde(wurzel, signal) {
      const eintraege = () => (
        /** @type {HTMLDetailsElement[]} */
        [...wurzel.querySelectorAll(":scope > .nc-accordion__item, :scope > * > .nc-accordion__item")]
      );
      const koepfe = () => eintraege().map((e) => (
        /** @type {HTMLElement} */
        e.querySelector(".nc-accordion__trigger")
      )).filter(Boolean);
      const einzeln = wurzel.dataset.neoAccordion === "einzeln";
      wurzel.addEventListener("toggle", (e) => {
        var _a;
        const item = (
          /** @type {HTMLDetailsElement} */
          e.target
        );
        if (!((_a = item.classList) == null ? void 0 : _a.contains("nc-accordion__item"))) return;
        if (einzeln && item.open) {
          for (const andere of eintraege()) if (andere !== item && andere.open) andere.open = false;
        }
        sende(wurzel, "accordion-toggle", { itemId: item.id || null, open: item.open });
      }, { signal, capture: true });
      wurzel.addEventListener("keydown", (e) => {
        const kopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-accordion__trigger")
        );
        if (!kopf) return;
        const alle = koepfe();
        let ziel = null;
        if (e.key === "ArrowDown") ziel = nachbar(alle, kopf, 1);
        else if (e.key === "ArrowUp") ziel = nachbar(alle, kopf, -1);
        else if (e.key === "Home") ziel = ersterBedienbar(alle);
        else if (e.key === "End") ziel = ersterBedienbar(alle, true);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
    }
  };

  // packages/neo-behaviors/select.js
  var select = {
    id: "select",
    selektor: ".nc-select-wrapper",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLSelectElement|null} */
        wurzel.querySelector("select.nc-select")
      );
      if (!feld || feld.multiple) return;
      const setze = (offen) => wurzel.classList.toggle("is-open", offen);
      feld.addEventListener("mousedown", () => {
        if (!feld.disabled) setze(!wurzel.classList.contains("is-open"));
      }, { signal });
      feld.addEventListener("keydown", (e) => {
        if (e.key === "Escape" || e.key === "Tab") setze(false);
        else if (e.key === "ArrowDown" && e.altKey || e.key === "F4" || (e.key === " " || e.key === "Enter") && !wurzel.classList.contains("is-open")) setze(true);
      }, { signal });
      feld.addEventListener("change", () => setze(false), { signal });
      feld.addEventListener("blur", () => setze(false), { signal });
    }
  };

  // packages/neo-behaviors/suche.js
  var escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var suche = {
    id: "search",
    selektor: ".nc-search",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLInputElement|null} */
        wurzel.querySelector(".nc-search__input")
      );
      const liste = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-search__results")
      );
      if (!feld || !liste) return;
      const eintraege = () => (
        /** @type {HTMLElement[]} */
        [...liste.querySelectorAll(".nc-search__item")]
      );
      for (const e of eintraege()) {
        const label = (
          /** @type {HTMLElement} */
          e.querySelector(".nc-search__item-label") || e
        );
        if (!label.dataset.neoText) label.dataset.neoText = label.textContent;
      }
      let leer = (
        /** @type {HTMLElement|null} */
        liste.querySelector(".nc-search__empty")
      );
      if (document.activeElement !== feld) {
        liste.hidden = true;
        feld.setAttribute("aria-expanded", "false");
      }
      const offen = () => !liste.hidden;
      const setze = (an) => {
        if (offen() === an) return;
        liste.hidden = !an;
        feld.setAttribute("aria-expanded", String(an));
        if (!an) markiere(null);
        sende(wurzel, "search-open", { open: an });
      };
      const markiere = (eintrag) => {
        var _a;
        for (const e of eintraege()) e.setAttribute("aria-selected", String(e === eintrag));
        if (eintrag == null ? void 0 : eintrag.id) feld.setAttribute("aria-activedescendant", eintrag.id);
        else feld.removeAttribute("aria-activedescendant");
        (_a = eintrag == null ? void 0 : eintrag.scrollIntoView) == null ? void 0 : _a.call(eintrag, { block: "nearest" });
      };
      const filtere = () => {
        const q = feld.value.trim().toLowerCase();
        let sichtbar = 0;
        for (const e of eintraege()) {
          const label = (
            /** @type {HTMLElement} */
            e.querySelector(".nc-search__item-label") || e
          );
          const text = label.dataset.neoText || "";
          const pos = q ? text.toLowerCase().indexOf(q) : -1;
          const zeigen = !q || pos >= 0;
          e.hidden = !zeigen;
          if (zeigen) sichtbar++;
          if (q && pos >= 0) label.innerHTML = escHtml(text.slice(0, pos)) + '<span class="nc-search__highlight">' + escHtml(text.slice(pos, pos + q.length)) + "</span>" + escHtml(text.slice(pos + q.length));
          else label.textContent = text;
        }
        for (const g2 of liste.querySelectorAll(".nc-search__group")) {
          g2.hidden = ![...g2.querySelectorAll(".nc-search__item")].some((e) => !/** @type {HTMLElement} */
          e.hidden);
        }
        if (!sichtbar && eintraege().length) {
          if (!leer) {
            leer = document.createElement("div");
            leer.className = "nc-search__empty";
            liste.append(leer);
          }
          leer.textContent = `Keine Treffer für „${feld.value.trim()}“`;
          leer.hidden = false;
        } else if (leer && eintraege().length) leer.hidden = true;
        markiere(null);
      };
      feld.addEventListener("focus", () => setze(true), { signal });
      feld.addEventListener("input", () => {
        setze(true);
        filtere();
      }, { signal });
      feld.addEventListener("keydown", (e) => {
        const sichtbare = eintraege().filter((x) => !x.hidden);
        const aktuell = sichtbare.find((x) => x.getAttribute("aria-selected") === "true");
        if (e.key === "Escape") {
          setze(false);
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setze(true);
          if (!sichtbare.length) return;
          const i = aktuell ? sichtbare.indexOf(aktuell) : -1;
          const n = e.key === "ArrowDown" ? (i + 1) % sichtbare.length : i < 0 ? sichtbare.length - 1 : (i - 1 + sichtbare.length) % sichtbare.length;
          markiere(sichtbare[n]);
        } else if (e.key === "Enter" && aktuell) {
          e.preventDefault();
          feld.value = /** @type {HTMLElement} */
          (aktuell.querySelector(".nc-search__item-label") || aktuell).dataset.neoText || aktuell.textContent.trim();
          sende(wurzel, "search-select", { value: feld.value });
          setze(false);
        }
      }, { signal });
      liste.addEventListener("mousedown", (e) => e.preventDefault(), { signal });
      liste.addEventListener("click", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-search__item")
        );
        if (!eintrag) return;
        e.preventDefault();
        feld.value = /** @type {HTMLElement} */
        (eintrag.querySelector(".nc-search__item-label") || eintrag).dataset.neoText || eintrag.textContent.trim();
        sende(wurzel, "search-select", { value: feld.value });
        setze(false);
      }, { signal });
      wurzel.addEventListener("focusout", (e) => {
        if (!wurzel.contains(
          /** @type {Node} */
          e.relatedTarget
        )) setze(false);
      }, { signal });
      const bereich = wurzel.querySelector(".nc-search__scope-trigger");
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-search__scope-menu")
      );
      if (bereich && menue) {
        bereich.addEventListener("click", () => {
          const an = menue.hidden;
          menue.hidden = !an;
          bereich.setAttribute("aria-expanded", String(an));
        }, { signal });
      }
    }
  };

  // packages/neo-behaviors/segmented-control.js
  var SEGMENT = ".nc-segmented-control__item";
  function setzeIndikator(leiste) {
    const gewaehlt = (
      /** @type {HTMLElement|null} */
      leiste.querySelector(`${SEGMENT}[aria-checked="true"], ${SEGMENT}[aria-pressed="true"]`)
    );
    if (!gewaehlt || !leiste.querySelector(".nc-segmented-control__indicator")) return;
    leiste.style.setProperty("--_indicator-left", `${gewaehlt.offsetLeft}px`);
    leiste.style.setProperty("--_indicator-width", `${gewaehlt.offsetWidth}px`);
  }
  function wertVon(el) {
    return el.dataset.value || el.getAttribute("aria-label") || el.textContent.trim();
  }
  var segmentedControl = {
    id: "segmented-control",
    selektor: ".nc-segmented-control",
    binde(wurzel, signal) {
      const segmente = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(SEGMENT)]
      );
      if (!segmente().length) return;
      const attr = (el) => el.getAttribute("role") === "radio" ? "aria-checked" : "aria-pressed";
      const istGewaehlt = (el) => el.getAttribute(attr(el)) === "true";
      const waehle2 = (segment) => {
        var _a;
        if (!segment || gesperrt(segment)) return;
        const alle = segmente();
        const vorher = alle.find(istGewaehlt) || null;
        for (const s of alle) {
          s.setAttribute(attr(s), String(s === segment));
          s.tabIndex = s === segment ? 0 : -1;
        }
        setzeIndikator(wurzel);
        (_a = segment.scrollIntoView) == null ? void 0 : _a.call(segment, { block: "nearest", inline: "nearest" });
        if (vorher !== segment) sende(wurzel, "segment-change", { value: wertVon(segment), previousValue: vorher ? wertVon(vorher) : null });
      };
      const start = segmente().find(istGewaehlt) || segmente().find((s) => !gesperrt(s));
      for (const s of segmente()) s.tabIndex = s === start ? 0 : -1;
      setzeIndikator(wurzel);
      wurzel.addEventListener("click", (e) => {
        const segment = (
          /** @type {HTMLElement} */
          e.target.closest(SEGMENT)
        );
        if (segment && wurzel.contains(segment)) waehle2(segment);
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const segment = (
          /** @type {HTMLElement} */
          e.target.closest(SEGMENT)
        );
        if (!segment) return;
        const ziel = zielFuerTaste(e.key, segmente(), segment);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        waehle2(ziel);
      }, { signal });
      if (typeof ResizeObserver === "function" && wurzel.querySelector(".nc-segmented-control__indicator")) {
        const beobachter = new ResizeObserver(() => setzeIndikator(wurzel));
        beobachter.observe(wurzel);
        signal.addEventListener("abort", () => beobachter.disconnect());
      }
    }
  };

  // packages/neo-behaviors/toggle-group.js
  var KNOPF = ".nc-toggle-group__item";
  var toggleGroup = {
    id: "toggle-group",
    selektor: ".nc-toggle-group",
    binde(wurzel, signal) {
      const knoepfe = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(KNOPF)]
      );
      if (!knoepfe().length) return;
      const einzeln = wurzel.getAttribute("role") === "radiogroup" || knoepfe().some((k) => k.getAttribute("role") === "radio");
      const attr = einzeln ? "aria-checked" : "aria-pressed";
      const an = (k) => k.getAttribute(attr) === "true";
      const melde = (knopf) => sende(wurzel, "toggle-change", { value: wertVon(knopf), selected: an(knopf), values: knoepfe().filter(an).map(wertVon) });
      const waehle2 = (knopf) => {
        if (!knopf || gesperrt(knopf)) return;
        if (!einzeln) {
          knopf.setAttribute(attr, String(!an(knopf)));
          melde(knopf);
          return;
        }
        if (an(knopf)) return;
        for (const k of knoepfe()) {
          k.setAttribute(attr, String(k === knopf));
          k.tabIndex = k === knopf ? 0 : -1;
        }
        melde(knopf);
      };
      if (einzeln) {
        const start = knoepfe().find(an) || knoepfe().find((k) => !gesperrt(k));
        for (const k of knoepfe()) k.tabIndex = k === start ? 0 : -1;
      }
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF)
        );
        if (knopf && wurzel.contains(knopf)) waehle2(knopf);
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF)
        );
        if (!knopf) return;
        const ziel = zielFuerTaste(e.key, knoepfe(), knopf);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        if (einzeln) waehle2(ziel);
      }, { signal });
    }
  };

  // packages/neo-behaviors/switch.js
  var KNOPF2 = 'button[role="switch"]';
  var schalter = {
    id: "switch",
    selektor: ".nc-switch",
    binde(wurzel, signal) {
      if (!wurzel.querySelector(KNOPF2)) return;
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF2)
        );
        if (!knopf || !wurzel.contains(knopf) || gesperrt(knopf)) return;
        const an = knopf.getAttribute("aria-checked") !== "true";
        knopf.setAttribute("aria-checked", String(an));
        sende(wurzel, "switch-change", { checked: an });
      }, { signal });
    }
  };

  // packages/neo-behaviors/rating.js
  var STUFE = ["nc-rating--sentiment-low", "nc-rating--sentiment-mid", "nc-rating--sentiment-high"];
  function stufe(wert) {
    if (wert <= 2) return STUFE[0];
    if (wert < 4) return STUFE[1];
    return STUFE[2];
  }
  var rating = {
    id: "rating",
    selektor: ".nc-rating",
    binde(wurzel, signal) {
      const radios = () => (
        /** @type {HTMLInputElement[]} */
        [...wurzel.querySelectorAll('input.nc-rating__input[type="radio"]')]
      );
      if (!radios().length) return;
      const sterne = () => radios().filter((r) => !r.classList.contains("nc-rating__input--clear")).sort((a, b) => Number(a.value) - Number(b.value));
      const nullRadio = () => radios().find((r) => r.classList.contains("nc-rating__input--clear") || r.value === "0") || null;
      const labelVon = (r) => {
        var _a;
        return (
          /** @type {HTMLElement|null} */
          (r.id ? wurzel.querySelector(`label[for="${CSS.escape(r.id)}"]`) : null) || (((_a = r.nextElementSibling) == null ? void 0 : _a.classList.contains("nc-rating__item")) ? (
            /** @type {HTMLElement} */
            r.nextElementSibling
          ) : null)
        );
      };
      const aktuellerWert = () => {
        var _a;
        return Number(((_a = radios().find((r) => r.checked)) == null ? void 0 : _a.value) || 0);
      };
      let wert = aktuellerWert();
      const zeige = () => {
        var _a;
        const neu = aktuellerWert();
        for (const r of sterne()) (_a = labelVon(r)) == null ? void 0 : _a.classList.toggle("nc-rating__item--active", Number(r.value) <= neu);
        if (wurzel.classList.contains("nc-rating--sentiment")) {
          wurzel.classList.remove(...STUFE);
          if (neu > 0) wurzel.classList.add(stufe(neu));
        }
        const zahl = wurzel.querySelector(".nc-rating__value");
        if (zahl) zahl.textContent = neu.toFixed(1).replace(".", ",");
        if (neu !== wert) {
          const vorher = wert;
          wert = neu;
          sende(wurzel, "rating-change", { value: neu, previousValue: vorher });
        }
      };
      const setze = (ziel) => {
        if (!ziel || ziel.disabled) return;
        ziel.checked = true;
        ziel.focus();
        zeige();
      };
      wurzel.addEventListener("change", zeige, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const feld = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!(feld instanceof HTMLInputElement) || !feld.classList.contains("nc-rating__input") || gesperrt(feld)) return;
        const liste = sterne();
        const jetzt = aktuellerWert();
        const index = liste.findIndex((r) => Number(r.value) === jetzt);
        let ziel = (
          /** @type {HTMLInputElement|null|undefined} */
          void 0
        );
        if (e.key === "ArrowRight" || e.key === "ArrowUp") ziel = liste[Math.min(index + 1, liste.length - 1)];
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") ziel = index <= 0 ? nullRadio() : liste[index - 1];
        else if (e.key === "Home") ziel = liste[0];
        else if (e.key === "End") ziel = liste.at(-1);
        if (ziel === void 0) return;
        e.preventDefault();
        setze(ziel);
      }, { signal });
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-rating__clear")
        );
        if (!knopf || gesperrt(knopf)) return;
        e.preventDefault();
        setze(nullRadio());
      }, { signal });
      zeige();
    }
  };

  // packages/neo-behaviors/input.js
  var eingabe = {
    id: "input",
    selektor: ".nc-input-wrapper",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLInputElement|null} */
        wurzel.querySelector("input.nc-input")
      );
      if (!feld) return;
      const knopf = wurzel.querySelector(".nc-input__clear");
      const rueckfall = !feld.hasAttribute("placeholder");
      const leer = () => {
        if (rueckfall) feld.dataset.empty = String(feld.value === "");
      };
      if (rueckfall) {
        leer();
        feld.addEventListener("input", leer, { signal });
        feld.addEventListener("change", leer, { signal });
      }
      if (knopf) {
        knopf.addEventListener("click", (e) => {
          if (feld.disabled || feld.readOnly) return;
          e.preventDefault();
          const vorher = feld.value;
          feld.value = "";
          feld.dispatchEvent(new Event("input", { bubbles: true }));
          leer();
          feld.focus();
          if (vorher !== "") sende(wurzel, "input-clear", { previousValue: vorher });
        }, { signal });
      }
      signal.addEventListener("abort", () => {
        if (rueckfall) delete feld.dataset.empty;
      });
    }
  };

  // packages/neo-behaviors/dropdown-menu.js
  var EINTRAG = ".nc-dropdown__item";
  var VERWEILEN = 300;
  var dropdownMenu = {
    id: "dropdown-menu",
    selektor: ".nc-dropdown",
    binde(wurzel, signal) {
      const ausloeser = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-dropdown__trigger")
      );
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-dropdown__menu")
      );
      if (!ausloeser || !menue) return;
      const dok = wurzel.ownerDocument;
      const eintraege = (m) => (
        /** @type {HTMLElement[]} */
        [...m.querySelectorAll(EINTRAG)].filter((e) => e.closest(".nc-dropdown__menu") === m)
      );
      const untermenue = (eintrag) => (
        /** @type {HTMLElement|null} */
        eintrag.querySelector(":scope > .nc-dropdown__menu")
      );
      const offen = () => !menue.hidden;
      for (const e of wurzel.querySelectorAll(EINTRAG)) e.tabIndex = -1;
      if (!ausloeser.hasAttribute("aria-haspopup")) ausloeser.setAttribute("aria-haspopup", "true");
      ausloeser.setAttribute("aria-expanded", String(offen()));
      const unterZu = (eintrag) => {
        const u = untermenue(eintrag);
        if (!u || u.hidden) return;
        for (const e of eintraege(u)) if (untermenue(e)) unterZu(e);
        u.hidden = true;
        eintrag.setAttribute("aria-expanded", "false");
      };
      const unterAuf = (eintrag, fokus) => {
        var _a;
        const u = untermenue(eintrag);
        if (!u || gesperrt(eintrag)) return;
        const eltern = (
          /** @type {HTMLElement} */
          eintrag.closest(".nc-dropdown__menu")
        );
        for (const e of eintraege(eltern)) if (e !== eintrag) unterZu(e);
        u.hidden = false;
        eintrag.setAttribute("aria-expanded", "true");
        if (fokus) (_a = ersterBedienbar(eintraege(u))) == null ? void 0 : _a.focus();
      };
      const setze = (an, fokus = null) => {
        var _a;
        if (offen() !== an) {
          menue.hidden = !an;
          ausloeser.setAttribute("aria-expanded", String(an));
          if (!an) for (const e of eintraege(menue)) unterZu(e);
          sende(wurzel, "dropdown-toggle", { open: an });
        }
        if (an && fokus) (_a = ersterBedienbar(eintraege(menue), fokus === "letzter")) == null ? void 0 : _a.focus();
      };
      const schliesse = (fokusZurueck) => {
        if (!offen()) return;
        setze(false);
        if (fokusZurueck) ausloeser.focus();
      };
      const loese2 = (eintrag) => {
        if (gesperrt(eintrag)) return;
        if (untermenue(eintrag)) {
          unterAuf(eintrag, true);
          return;
        }
        const rolle = eintrag.getAttribute("role");
        let checked = null;
        if (rolle === "menuitemradio") {
          const gruppe = eintrag.closest('.nc-dropdown__group, [role="group"]') || eintrag.closest(".nc-dropdown__menu");
          for (const e of eintraege(
            /** @type {HTMLElement} */
            eintrag.closest(".nc-dropdown__menu")
          )) {
            if (e.getAttribute("role") !== "menuitemradio" || !gruppe.contains(e)) continue;
            e.setAttribute("aria-checked", String(e === eintrag));
            e.classList.toggle("nc-dropdown__item--checked", e === eintrag);
          }
          checked = true;
        } else if (rolle === "menuitemcheckbox") {
          checked = eintrag.getAttribute("aria-checked") !== "true";
          eintrag.setAttribute("aria-checked", String(checked));
          eintrag.classList.toggle("nc-dropdown__item--checked", checked);
        }
        const label = eintrag.querySelector(".nc-dropdown__item-label") || eintrag;
        sende(wurzel, "dropdown-select", { value: eintrag.dataset.value || label.textContent.trim(), checked });
        if (rolle !== "menuitemcheckbox") schliesse(true);
      };
      ausloeser.addEventListener("click", () => {
        if (gesperrt(ausloeser)) return;
        if (offen()) schliesse(false);
        else setze(true, "erster");
      }, { signal });
      ausloeser.addEventListener("keydown", (e) => {
        if (gesperrt(ausloeser)) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setze(true, "erster");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setze(true, "letzter");
        } else if (e.key === "Escape") schliesse(true);
      }, { signal });
      menue.addEventListener("click", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (eintrag && menue.contains(eintrag)) loese2(eintrag);
      }, { signal });
      menue.addEventListener("keydown", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (!eintrag) return;
        const eigenesMenue = (
          /** @type {HTMLElement} */
          eintrag.closest(".nc-dropdown__menu")
        );
        const elternEintrag = eigenesMenue === menue ? null : (
          /** @type {HTMLElement|null} */
          eigenesMenue.closest(EINTRAG)
        );
        if (e.key === "Escape" || e.key === "ArrowLeft" && elternEintrag) {
          e.preventDefault();
          if (elternEintrag) {
            unterZu(elternEintrag);
            elternEintrag.focus();
          } else schliesse(true);
          return;
        }
        if (e.key === "ArrowRight" && untermenue(eintrag)) {
          e.preventDefault();
          unterAuf(eintrag, true);
          return;
        }
        if (e.key === "Tab") {
          schliesse(false);
          return;
        }
        const ziel = zielFuerTaste(e.key, eintraege(eigenesMenue), eintrag, "vertikal");
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
      let uhr = 0;
      menue.addEventListener("mouseover", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (!eintrag) return;
        clearTimeout(uhr);
        uhr = window.setTimeout(() => {
          const eltern = (
            /** @type {HTMLElement} */
            eintrag.closest(".nc-dropdown__menu")
          );
          for (const x of eintraege(eltern)) if (x !== eintrag) unterZu(x);
          if (untermenue(eintrag)) unterAuf(eintrag, false);
        }, VERWEILEN);
      }, { signal });
      signal.addEventListener("abort", () => clearTimeout(uhr));
      dok.addEventListener("click", (e) => {
        if (offen() && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse(false);
      }, { signal, capture: true });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (nach && !wurzel.contains(nach)) schliesse(false);
      }, { signal });
    }
  };

  // packages/neo-behaviors/popover.js
  var OEFFNEN_NACH = 300;
  var SCHLIESSEN_NACH = 200;
  var popover = {
    id: "popover",
    selektor: ".nc-popover",
    binde(wurzel, signal) {
      const ausloeser = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-popover__trigger")
      );
      const panel = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-popover__panel")
      );
      if (!ausloeser || !panel) return;
      const dok = wurzel.ownerDocument;
      const hover = wurzel.classList.contains("nc-popover--hover-trigger");
      if (hover && !panel.hidden && !wurzel.contains(dok.activeElement)) panel.hidden = true;
      const lichtAus = () => wurzel.dataset.lightDismiss !== "false" && !panel.querySelector("form, input, select, textarea");
      const offen = () => !panel.hidden;
      if (!ausloeser.hasAttribute("aria-haspopup")) ausloeser.setAttribute("aria-haspopup", "dialog");
      ausloeser.setAttribute("aria-expanded", String(offen()));
      wurzel.classList.toggle("is-open", offen());
      const setze = (an, grund) => {
        if (offen() === an) return;
        panel.hidden = !an;
        wurzel.classList.toggle("is-open", an);
        ausloeser.setAttribute("aria-expanded", String(an));
        sende(wurzel, "popover-toggle", { open: an, reason: grund });
        if (an && !hover) {
          const feld = panel.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled])");
          const ziel = (
            /** @type {HTMLElement|null} */
            feld || fokussierbare(panel)[0] || null
          );
          if (ziel) ziel.focus();
          else {
            panel.tabIndex = -1;
            panel.focus();
          }
        }
      };
      const schliesse = (grund, fokusZurueck) => {
        if (!offen()) return;
        const warDrin = panel.contains(dok.activeElement);
        setze(false, grund);
        if (fokusZurueck || warDrin) ausloeser.focus();
      };
      ausloeser.addEventListener("click", () => {
        if (gesperrt(ausloeser)) return;
        if (offen()) schliesse("trigger", false);
        else setze(true, "trigger");
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        if (!offen()) return;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse("escape", true);
          return;
        }
        if (!hover && e.key === "Tab" && panel.contains(
          /** @type {Node} */
          e.target
        )) fokusFalle(e, panel);
      }, { signal });
      panel.addEventListener("click", (e) => {
        if (
          /** @type {HTMLElement} */
          e.target.closest(".nc-popover__close")
        ) schliesse("close-button", true);
      }, { signal });
      dok.addEventListener("click", (e) => {
        if (offen() && lichtAus() && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse("outside", false);
      }, { signal, capture: true });
      if (hover) {
        let uhr = 0;
        const spaeter = (fn, ms) => {
          clearTimeout(uhr);
          uhr = window.setTimeout(fn, ms);
        };
        wurzel.addEventListener("mouseenter", () => spaeter(() => setze(true, "hover"), OEFFNEN_NACH), { signal });
        wurzel.addEventListener("mouseleave", () => spaeter(() => {
          if (!wurzel.contains(dok.activeElement)) setze(false, "hover");
        }, SCHLIESSEN_NACH), { signal });
        ausloeser.addEventListener("focus", () => {
          clearTimeout(uhr);
          setze(true, "focus");
        }, { signal });
        wurzel.addEventListener("focusout", (e) => {
          const nach = (
            /** @type {Node|null} */
            e.relatedTarget
          );
          if (!nach || !wurzel.contains(nach)) setze(false, "focus");
        }, { signal });
        signal.addEventListener("abort", () => clearTimeout(uhr));
      }
    }
  };

  // packages/neo-behaviors/tooltip.js
  var laufendeNummer = 0;
  var tooltip = {
    id: "tooltip",
    selektor: ".nc-tooltip",
    binde(wurzel, signal) {
      const inhalt = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-tooltip__content")
      );
      if (!inhalt) return;
      const dok = wurzel.ownerDocument;
      const ausloeser = (
        /** @type {HTMLElement|null} */
        [...wurzel.children].find((k) => k !== inhalt) || null
      );
      if (!inhalt.id) inhalt.id = `neo-tooltip-${++laufendeNummer}`;
      if (!inhalt.getAttribute("role")) inhalt.setAttribute("role", "tooltip");
      if (ausloeser) {
        const ids = (ausloeser.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (!ids.includes(inhalt.id)) ausloeser.setAttribute("aria-describedby", [...ids, inhalt.id].join(" "));
      }
      let maus = false;
      const fokus = () => wurzel.contains(dok.activeElement);
      const freigeben = () => {
        if (!maus && !fokus()) inhalt.hidden = false;
      };
      wurzel.addEventListener("mouseenter", () => {
        maus = true;
      }, { signal });
      wurzel.addEventListener("mouseleave", () => {
        maus = false;
        freigeben();
      }, { signal });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (!nach || !wurzel.contains(nach)) {
          if (!maus) inhalt.hidden = false;
        }
      }, { signal });
      dok.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || inhalt.hidden || !(maus || fokus())) return;
        inhalt.hidden = true;
        sende(wurzel, "tooltip-dismiss", { reason: "escape" });
      }, { signal });
      signal.addEventListener("abort", () => {
        inhalt.hidden = false;
      });
    }
  };

  // packages/neo-behaviors/_dialog.js
  function dialogBehavior(art) {
    return {
      id: art.id,
      selektor: art.selektor,
      /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
      binde(wurzel, signal) {
        var _a;
        const dialog = (
          /** @type {HTMLDialogElement} */
          wurzel
        );
        if (typeof dialog.showModal !== "function") return;
        const dok = dialog.ownerDocument;
        let zurueck = (
          /** @type {HTMLElement|null} */
          null
        );
        let grund = (
          /** @type {string|null} */
          null
        );
        const oeffne = (ausloeser) => {
          var _a2;
          if (dialog.open) return;
          zurueck = ausloeser;
          dialog.showModal();
          const eigen = (_a2 = art.fokusZiel) == null ? void 0 : _a2.call(art, dialog);
          if (eigen) eigen.focus();
          else {
            const ziel = (
              /** @type {HTMLElement|null} */
              dialog.querySelector("[autofocus]") || fokussierbare(dialog)[0]
            );
            if (ziel && !dialog.contains(dok.activeElement)) ziel.focus();
          }
          sende(dialog, `${art.praefix}-open`, {});
        };
        const schliesse = (warum) => {
          if (!dialog.open) return;
          grund = warum;
          dialog.close();
        };
        dok.addEventListener("click", (e) => {
          var _a2, _b;
          const knopf = (
            /** @type {HTMLElement} */
            (_b = (_a2 = e.target).closest) == null ? void 0 : _b.call(_a2, "[aria-controls]")
          );
          if (!knopf || !dialog.id || knopf.getAttribute("aria-controls") !== dialog.id || dialog.contains(knopf)) return;
          if (knopf.hasAttribute("disabled") || knopf.getAttribute("aria-disabled") === "true") return;
          e.preventDefault();
          oeffne(
            /** @type {HTMLElement} */
            knopf
          );
        }, { signal });
        dialog.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            schliesse("escape");
          } else fokusFalle(e, dialog);
        }, { signal });
        dialog.addEventListener("cancel", (e) => {
          e.preventDefault();
          schliesse("escape");
        }, { signal });
        dialog.addEventListener("click", (e) => {
          const ziel = (
            /** @type {HTMLElement} */
            e.target
          );
          if (ziel === dialog) {
            const r = dialog.getBoundingClientRect();
            const draussen = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            if (draussen && art.hintergrundSchliesst(dialog)) schliesse("overlay-click");
            return;
          }
          const warum = art.aktion ? art.aktion(ziel, dialog) : ziel.closest(`${art.schliessen}, [data-action="close"], [data-action="cancel"]`) ? "close-button" : null;
          if (warum) schliesse(warum);
        }, { signal });
        dialog.addEventListener("close", () => {
          sende(dialog, `${art.praefix}-close`, { reason: grund || "programmatic" });
          grund = null;
          if (zurueck && zurueck.isConnected) zurueck.focus();
          zurueck = null;
        }, { signal });
        (_a = art.scroll) == null ? void 0 : _a.call(art, dialog, signal);
      }
    };
  }

  // packages/neo-behaviors/modal.js
  var modal = dialogBehavior({
    id: "modal",
    selektor: "dialog.nc-modal",
    praefix: "modal",
    schliessen: ".nc-modal__close",
    hintergrundSchliesst: (d) => d.dataset.backdropClose === "true",
    scroll(dialog, signal) {
      const body = dialog.querySelector(".nc-modal__body");
      if (!body || !dialog.classList.contains("nc-modal--scrollable")) return;
      const pruefe = () => {
        dialog.classList.toggle("is-scrolled-top", body.scrollTop > 0);
        dialog.classList.toggle("is-scrolled-bottom", body.scrollTop + body.clientHeight < body.scrollHeight - 1);
      };
      body.addEventListener("scroll", pruefe, { signal, passive: true });
      dialog.addEventListener("modal-open", pruefe, { signal });
    }
  });

  // packages/neo-behaviors/drawer.js
  var drawer = dialogBehavior({
    id: "drawer",
    selektor: "dialog.nc-drawer",
    praefix: "drawer",
    schliessen: ".nc-drawer__close",
    hintergrundSchliesst: () => true,
    scroll(dialog, signal) {
      const inhalt = dialog.querySelector(".nc-drawer__content");
      if (!inhalt) return;
      inhalt.addEventListener("scroll", () => dialog.classList.toggle("is-scrolled", inhalt.scrollTop > 0), { signal, passive: true });
    }
  });

  // packages/neo-behaviors/alert-dialog.js
  var alertDialog = dialogBehavior({
    id: "alert-dialog",
    selektor: "dialog.nc-alert-dialog",
    praefix: "alert-dialog",
    schliessen: "[data-action]",
    hintergrundSchliesst: () => false,
    fokusZiel: (dialog) => {
      const abbrechen = (
        /** @type {HTMLElement|null} */
        dialog.querySelector('[data-action="cancel"]')
      );
      return abbrechen && !gesperrt(abbrechen) ? abbrechen : fokussierbare(dialog)[0] || null;
    },
    aktion: (ziel, dialog) => {
      const knopf = (
        /** @type {HTMLElement|null} */
        ziel.closest("[data-action]")
      );
      if (!knopf || !dialog.contains(knopf) || gesperrt(knopf)) return null;
      return knopf.getAttribute("data-action") || null;
    }
  });

  // packages/neo-behaviors/index.js
  var BEHAVIORS = Object.freeze({
    tabs,
    accordion: akkordeon,
    select,
    search: suche,
    "segmented-control": segmentedControl,
    "toggle-group": toggleGroup,
    switch: schalter,
    rating,
    input: eingabe,
    "dropdown-menu": dropdownMenu,
    popover,
    tooltip,
    modal,
    drawer,
    "alert-dialog": alertDialog
  });
  var MIT_VERHALTEN = Object.freeze(Object.keys(BEHAVIORS));
  function anbinden(bereich, nur) {
    return bindeAlle(bereich, waehle(nur));
  }
  function abbinden(bereich, nur) {
    loeseAlle(bereich, waehle(nur));
  }
  function waehle(nur) {
    return (nur || Object.keys(BEHAVIORS)).map((id) => BEHAVIORS[id]).filter(Boolean);
  }

  // packages/neo-behaviors/package.json
  var package_default = {
    name: "neo-behaviors",
    version: "0.2.0",
    private: true,
    description: "Verhalten der NEO-Bauteile (Tabs, Akkordeon, Select, Suche, Formular-Bauteile, Overlays) — eine Quelle fuer Drupal, Doku und Theme-Konfigurator",
    type: "module",
    main: "index.js",
    exports: {
      ".": "./index.js"
    }
  };

  // packages/neo-behaviors/drupal.js
  var NeoBehaviors = Object.freeze({ anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, version: package_default.version });
  var g = (
    /** @type {any} */
    globalThis
  );
  g.NeoBehaviors = NeoBehaviors;
  if (g.Drupal && g.Drupal.behaviors) {
    g.Drupal.behaviors.neoBehaviors = {
      attach(context, settings) {
        const s = settings && settings.neoBehaviors || {};
        if (s.aus) return;
        anbinden(context || document, Array.isArray(s.nur) ? s.nur : void 0);
      },
      detach(context, settings, trigger) {
        if (trigger === "unload") abbinden(context || document);
      }
    };
  }
  var drupal_default = NeoBehaviors;
})();
