/*! neo-behaviors 0.3.0 — NEO Design System. Gebaut aus packages/neo-behaviors (scripts/baue-behaviors.mjs). Nicht von Hand aendern. */
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
          const reason = grund || "programmatic";
          sende(dialog, `${art.praefix}-close`, art.schliessDetail ? art.schliessDetail(reason) : { reason });
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
  var OHNE_KNOPF = ["escape", "programmatic"];
  var alertDialog = dialogBehavior({
    id: "alert-dialog",
    selektor: "dialog.nc-alert-dialog",
    praefix: "alert-dialog",
    schliessen: "[data-action]",
    hintergrundSchliesst: () => false,
    schliessDetail: (reason) => ({ reason, action: OHNE_KNOPF.includes(reason) ? null : reason, open: false }),
    fokusZiel: (dialog) => {
      const bedienbar = fokussierbare(dialog).filter((e) => !gesperrt(e));
      const markiert = bedienbar.find((e) => e.hasAttribute("autofocus"));
      if (markiert) return markiert;
      const abbrechen = (
        /** @type {HTMLElement|null} */
        dialog.querySelector('[data-action="cancel"]')
      );
      return abbrechen && !gesperrt(abbrechen) ? abbrechen : bedienbar[0] || fokussierbare(dialog)[0] || null;
    },
    aktion: (ziel, dialog) => {
      const knopf = (
        /** @type {HTMLElement|null} */
        ziel.closest("[data-action]")
      );
      if (!knopf || !dialog.contains(knopf) || gesperrt(knopf)) return null;
      const wert = knopf.getAttribute("data-action") || null;
      if (wert === "confirm" && dialog.getAttribute("data-close") === "manuell") {
        sende(dialog, "alert-dialog-close", { reason: "confirm", action: "confirm", open: true });
        return null;
      }
      return wert;
    }
  });

  // packages/neo-behaviors/breadcrumb.js
  var EINTRAG2 = ".nc-breadcrumb__dropdown-item";
  var breadcrumb = {
    id: "breadcrumb",
    selektor: ".nc-breadcrumb",
    binde(wurzel, signal) {
      const knopf = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-breadcrumb__ellipsis")
      );
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-breadcrumb__dropdown")
      );
      if (!knopf || !menue) return;
      const dok = wurzel.ownerDocument;
      const huelle = (
        /** @type {HTMLElement} */
        knopf.closest(".nc-breadcrumb__ellipsis-wrap") || knopf.parentElement || wurzel
      );
      const eintraege = () => (
        /** @type {HTMLElement[]} */
        [...menue.querySelectorAll(EINTRAG2)]
      );
      const offen = () => menue.classList.contains("is-open");
      for (const e of eintraege()) e.tabIndex = -1;
      if (!knopf.hasAttribute("aria-haspopup")) knopf.setAttribute("aria-haspopup", "true");
      knopf.setAttribute("aria-expanded", String(offen()));
      const setze = (an, fokus = null) => {
        var _a;
        if (offen() !== an) {
          menue.classList.toggle("is-open", an);
          knopf.setAttribute("aria-expanded", String(an));
          sende(wurzel, "breadcrumb-toggle", { open: an });
        }
        if (an && fokus) (_a = ersterBedienbar(eintraege(), fokus === "letzter")) == null ? void 0 : _a.focus();
      };
      const schliesse = (fokusZurueck) => {
        if (!offen()) return;
        setze(false);
        if (fokusZurueck) knopf.focus();
      };
      knopf.addEventListener("click", () => {
        if (gesperrt(knopf)) return;
        if (offen()) schliesse(false);
        else setze(true, "erster");
      }, { signal });
      knopf.addEventListener("keydown", (e) => {
        if (gesperrt(knopf)) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setze(true, "erster");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setze(true, "letzter");
        } else if (e.key === "Escape") schliesse(true);
      }, { signal });
      menue.addEventListener("keydown", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG2)
        );
        if (!eintrag) return;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse(true);
          return;
        }
        if (e.key === "Tab") {
          schliesse(false);
          return;
        }
        const ziel = zielFuerTaste(e.key, eintraege(), eintrag, "vertikal");
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
      menue.addEventListener("click", (e) => {
        if (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG2)
        ) schliesse(false);
      }, { signal });
      dok.addEventListener("click", (e) => {
        if (offen() && !huelle.contains(
          /** @type {Node} */
          e.target
        )) schliesse(false);
      }, { signal, capture: true });
      huelle.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (nach && !huelle.contains(nach)) schliesse(false);
      }, { signal });
    }
  };

  // packages/neo-behaviors/treeview.js
  var EINTRAG3 = ".nc-treeview__item";
  var treeview = {
    id: "treeview",
    selektor: ".nc-treeview",
    binde(wurzel, signal) {
      const baum = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector('[role="tree"]') || wurzel.querySelector(".nc-treeview__list")
      );
      if (!baum) return;
      const mehrfach = baum.getAttribute("aria-multiselectable") === "true" || wurzel.classList.contains("nc-treeview--checkboxes");
      const alle = () => (
        /** @type {HTMLElement[]} */
        [...baum.querySelectorAll(EINTRAG3)]
      );
      const zeile = (li) => (
        /** @type {HTMLElement|null} */
        li.querySelector(":scope > .nc-treeview__node")
      );
      const eltern = (li) => {
        var _a;
        const p = (
          /** @type {HTMLElement|null} */
          ((_a = li.parentElement) == null ? void 0 : _a.closest(EINTRAG3)) || null
        );
        return p && baum.contains(p) ? p : null;
      };
      const kinder = (li) => alle().filter((x) => eltern(x) === li);
      const zweig = (li) => li.hasAttribute("aria-expanded");
      const offen = (li) => li.getAttribute("aria-expanded") === "true";
      const gesperrtE = (li) => gesperrt(li) || li.classList.contains("nc-treeview__item--disabled");
      const sichtbar = (li) => {
        for (let p = eltern(li); p; p = eltern(p)) if (!offen(p)) return false;
        return true;
      };
      const bedienbar = () => alle().filter((li) => sichtbar(li) && !gesperrtE(li) && zeile(li));
      const wertVon2 = (li) => {
        var _a, _b;
        return li.dataset.value || (((_b = (_a = zeile(li)) == null ? void 0 : _a.querySelector(".nc-treeview__label, .nc-treeview__link")) == null ? void 0 : _b.textContent) || "").trim();
      };
      const gewaehlt = (li) => li.getAttribute(mehrfach ? "aria-checked" : "aria-selected") === "true";
      const tabStopp = (li, fokus = false) => {
        var _a;
        for (const x of alle()) {
          const z = zeile(x);
          if (z) z.tabIndex = x === li ? 0 : -1;
        }
        if (fokus) (_a = zeile(li)) == null ? void 0 : _a.focus();
      };
      const moegliche = bedienbar();
      const start = moegliche.find((li) => {
        var _a;
        return ((_a = zeile(li)) == null ? void 0 : _a.getAttribute("tabindex")) === "0";
      }) || moegliche.find(gewaehlt) || moegliche[0];
      if (start) tabStopp(start);
      if (!mehrfach) {
        for (const li of alle()) if (!li.hasAttribute("aria-selected")) li.setAttribute("aria-selected", "false");
      }
      const klappe = (li, an) => {
        if (!zweig(li) || gesperrtE(li) || offen(li) === an) return;
        li.setAttribute("aria-expanded", String(an));
        if (!an) {
          const aktiv = wurzel.ownerDocument.activeElement;
          const stopp = alle().find((x) => {
            var _a;
            return ((_a = zeile(x)) == null ? void 0 : _a.tabIndex) === 0;
          });
          if (aktiv && li.contains(aktiv) && aktiv !== zeile(li)) tabStopp(li, true);
          else if (stopp && stopp !== li && li.contains(stopp)) tabStopp(li);
        }
        sende(wurzel, "treeview-toggle", { value: wertVon2(li), expanded: an });
      };
      const melde = (li) => sende(wurzel, "treeview-select", { value: wertVon2(li), selected: gewaehlt(li), values: alle().filter(gewaehlt).map(wertVon2) });
      const setzeHaken = (li, wert) => {
        var _a;
        li.setAttribute("aria-checked", wert);
        const box = (
          /** @type {HTMLInputElement|null} */
          ((_a = zeile(li)) == null ? void 0 : _a.querySelector(".nc-treeview__checkbox")) || null
        );
        if (box) {
          box.checked = wert === "true";
          box.indeterminate = wert === "mixed";
        }
      };
      const hake = (li) => {
        const neu = li.getAttribute("aria-checked") === "true" ? "false" : "true";
        for (const x of [li, ...li.querySelectorAll(EINTRAG3)]) if (!gesperrtE(
          /** @type {HTMLElement} */
          x
        )) setzeHaken(x, neu);
        for (let p = eltern(li); p; p = eltern(p)) {
          const werte = new Set(kinder(p).map((k) => k.getAttribute("aria-checked") || "false"));
          setzeHaken(p, werte.size === 1 ? [...werte][0] : "mixed");
        }
        melde(li);
      };
      const waehle2 = (li) => {
        if (gesperrtE(li)) return;
        if (mehrfach) {
          hake(li);
          return;
        }
        if (gewaehlt(li)) return;
        for (const x of alle()) {
          x.setAttribute("aria-selected", String(x === li));
          x.classList.toggle("nc-treeview__item--selected", x === li);
        }
        melde(li);
      };
      baum.addEventListener("keydown", (e) => {
        var _a;
        const z = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!((_a = z.classList) == null ? void 0 : _a.contains("nc-treeview__node"))) return;
        const li = (
          /** @type {HTMLElement} */
          z.closest(EINTRAG3)
        );
        const liste = bedienbar();
        const i = liste.indexOf(li);
        let ziel = null;
        switch (e.key) {
          case "ArrowDown":
            ziel = liste[i + 1] || null;
            break;
          case "ArrowUp":
            ziel = i > 0 ? liste[i - 1] : null;
            break;
          case "Home":
            ziel = liste[0] || null;
            break;
          case "End":
            ziel = liste.at(-1) || null;
            break;
          case "ArrowRight":
            e.preventDefault();
            if (zweig(li) && !offen(li)) klappe(li, true);
            else if (zweig(li)) ziel = kinder(li).find((k) => !gesperrtE(k)) || null;
            break;
          case "ArrowLeft":
            e.preventDefault();
            if (zweig(li) && offen(li)) klappe(li, false);
            else ziel = eltern(li);
            break;
          case "Enter":
          case " ": {
            e.preventDefault();
            waehle2(li);
            const link = (
              /** @type {HTMLElement|null} */
              z.querySelector(".nc-treeview__link")
            );
            if (e.key === "Enter" && link) link.click();
            return;
          }
          default:
            return;
        }
        if (!ziel) return;
        e.preventDefault();
        tabStopp(ziel, true);
      }, { signal });
      baum.addEventListener("click", (e) => {
        const ziel = (
          /** @type {HTMLElement} */
          e.target
        );
        const z = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-treeview__node")
        );
        if (!z || !baum.contains(z)) return;
        const li = (
          /** @type {HTMLElement} */
          z.closest(EINTRAG3)
        );
        if (gesperrtE(li)) return;
        if (ziel.closest(".nc-treeview__actions, .nc-treeview__drag-handle")) return;
        tabStopp(li, true);
        if (ziel.closest(".nc-treeview__toggle")) {
          klappe(li, !offen(li));
          return;
        }
        waehle2(li);
      }, { signal });
      baum.addEventListener("focusin", (e) => {
        var _a;
        const z = (
          /** @type {HTMLElement} */
          e.target
        );
        if (((_a = z.classList) == null ? void 0 : _a.contains("nc-treeview__node")) && z.tabIndex !== 0) tabStopp(
          /** @type {HTMLElement} */
          z.closest(EINTRAG3)
        );
      }, { signal });
    }
  };

  // packages/neo-behaviors/navigation-menu.js
  var VERWEILEN2 = 150;
  var OBEN = ":scope > .nc-navigation-menu__item > .nc-navigation-menu__trigger, :scope > .nc-navigation-menu__item > .nc-navigation-menu__link--top";
  var EINTRAG4 = '[role="menuitem"], a[href], button:not([disabled])';
  var navigationMenu = {
    id: "navigation-menu",
    selektor: ".nc-navigation-menu",
    binde(wurzel, signal) {
      const leiste = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-navigation-menu__list")
      );
      if (!leiste) return;
      const dok = wurzel.ownerDocument;
      const huelle = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-navigation-menu__viewport-wrapper")
      );
      const sicht = (
        /** @type {HTMLElement|null} */
        (huelle == null ? void 0 : huelle.querySelector(":scope > .nc-navigation-menu__viewport")) || null
      );
      const zeiger = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-navigation-menu__indicator")
      );
      const perHover = wurzel.dataset.trigger !== "click";
      const oben = () => (
        /** @type {HTMLElement[]} */
        [...leiste.querySelectorAll(OBEN)]
      );
      const istAusloeser = (el) => el.classList.contains("nc-navigation-menu__trigger");
      const vorlage = (a) => {
        var _a;
        return (
          /** @type {HTMLElement|null} */
          ((_a = a.parentElement) == null ? void 0 : _a.querySelector(":scope > .nc-navigation-menu__content")) || null
        );
      };
      const name = (a) => {
        var _a;
        return (((_a = a.querySelector("span")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
      };
      const eintraege = () => sicht ? (
        /** @type {HTMLElement[]} */
        [...sicht.querySelectorAll(EINTRAG4)]
      ) : [];
      let offen = (
        /** @type {HTMLElement|null} */
        null
      );
      let uhr = 0;
      for (const a of oben()) {
        const v = istAusloeser(a) && vorlage(a);
        if (v) v.setAttribute("inert", "");
      }
      const start = oben().find((a) => a.dataset.state === "open" || a.dataset.current === "true" || a.getAttribute("aria-current") === "page") || oben()[0];
      const tabStopp = (el) => {
        for (const a of oben()) a.tabIndex = a === el ? 0 : -1;
      };
      if (start) tabStopp(start);
      for (const a of oben()) if (istAusloeser(a) && !a.hasAttribute("aria-expanded")) a.setAttribute("aria-expanded", "false");
      const zustand = (el, an) => {
        if (el) el.dataset.state = an ? "open" : "closed";
      };
      const oeffne = (a, fokus = (
        /** @type {'erster'|'letzter'|null} */
        null
      )) => {
        var _a;
        const v = vorlage(a);
        if (!sicht || !v || a.hasAttribute("disabled")) return;
        clearTimeout(uhr);
        if (offen !== a) {
          const liste = oben();
          const vorher = offen;
          if (vorher) {
            zustand(vorher, false);
            vorher.setAttribute("aria-expanded", "false");
            const alt = vorlage(vorher);
            zustand(alt, false);
            if (alt) alt.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? "to-start" : "to-end";
          }
          offen = a;
          zustand(a, true);
          a.setAttribute("aria-expanded", "true");
          zustand(v, true);
          if (vorher) v.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? "from-end" : "from-start";
          else delete v.dataset.motion;
          const kopie = (
            /** @type {HTMLElement} */
            v.cloneNode(true)
          );
          kopie.removeAttribute("inert");
          sicht.replaceChildren(kopie);
          for (const e of eintraege()) e.tabIndex = -1;
          zustand(huelle, true);
          zustand(sicht, true);
          if (zeiger) {
            const r = a.getBoundingClientRect();
            const n = wurzel.getBoundingClientRect();
            zeiger.dataset.state = "visible";
            zeiger.style.left = `${r.left - n.left + r.width / 2 - 5}px`;
            zeiger.style.width = "10px";
          }
          sende(wurzel, "navigation-menu-change", { value: name(a), previousValue: vorher ? name(vorher) : null });
        }
        if (fokus) {
          const liste = eintraege();
          (_a = fokus === "letzter" ? liste.at(-1) : liste[0]) == null ? void 0 : _a.focus();
        }
      };
      const schliesse = (fokusZurueck = false) => {
        clearTimeout(uhr);
        const a = offen;
        if (!a) return;
        offen = null;
        zustand(a, false);
        a.setAttribute("aria-expanded", "false");
        zustand(vorlage(a), false);
        zustand(huelle, false);
        zustand(sicht, false);
        sicht == null ? void 0 : sicht.replaceChildren();
        if (zeiger) zeiger.dataset.state = "hidden";
        sende(wurzel, "navigation-menu-change", { value: null, previousValue: name(a) });
        if (fokusZurueck) a.focus();
      };
      const wechsle = (ziel, panelMit) => {
        tabStopp(ziel);
        ziel.focus();
        if (panelMit && istAusloeser(ziel)) oeffne(ziel);
        else if (panelMit) schliesse();
      };
      leiste.addEventListener("keydown", (e) => {
        const a = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!oben().includes(a)) return;
        const ausloeser = istAusloeser(a);
        if (ausloeser && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          oeffne(a, "erster");
          return;
        }
        if (ausloeser && e.key === "ArrowUp") {
          e.preventDefault();
          oeffne(a, "letzter");
          return;
        }
        if (e.key === "Escape") {
          if (offen) {
            e.preventDefault();
            schliesse(true);
          }
          return;
        }
        if (e.key === "Tab") {
          schliesse();
          return;
        }
        const ziel = zielFuerTaste(e.key, oben(), a, "horizontal");
        if (!ziel) return;
        e.preventDefault();
        wechsle(ziel, !!offen);
      }, { signal });
      sicht == null ? void 0 : sicht.addEventListener("keydown", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!offen || !eintraege().includes(eintrag)) return;
        const a = offen;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse(true);
          return;
        }
        if (e.key === "Tab") {
          schliesse();
          return;
        }
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const ziel2 = zielFuerTaste(e.key, oben(), a, "horizontal");
          schliesse();
          if (ziel2) wechsle(ziel2, true);
          return;
        }
        const ziel = zielFuerTaste(e.key, eintraege(), eintrag, "vertikal");
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
      leiste.addEventListener("click", (e) => {
        const a = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-navigation-menu__trigger")
        );
        if (!a || !leiste.contains(a)) return;
        tabStopp(
          /** @type {HTMLElement} */
          a
        );
        if (offen === a) schliesse();
        else oeffne(
          /** @type {HTMLElement} */
          a
        );
      }, { signal });
      sicht == null ? void 0 : sicht.addEventListener("click", (e) => {
        if (
          /** @type {HTMLElement} */
          e.target.closest("a[href]")
        ) schliesse();
      }, { signal });
      leiste.addEventListener("focusin", (e) => {
        const a = (
          /** @type {HTMLElement} */
          e.target
        );
        if (oben().includes(a) && a.tabIndex !== 0) tabStopp(a);
      }, { signal });
      const spaeter = (fn) => {
        clearTimeout(uhr);
        uhr = window.setTimeout(fn, VERWEILEN2);
      };
      if (perHover) {
        for (const a of oben().filter(istAusloeser)) {
          const item = (
            /** @type {HTMLElement} */
            a.parentElement
          );
          item.addEventListener("mouseenter", () => spaeter(() => oeffne(a)), { signal });
          item.addEventListener("mouseleave", () => spaeter(() => schliesse()), { signal });
        }
        huelle == null ? void 0 : huelle.addEventListener("mouseenter", () => clearTimeout(uhr), { signal });
        huelle == null ? void 0 : huelle.addEventListener("mouseleave", () => spaeter(() => schliesse()), { signal });
      }
      signal.addEventListener("abort", () => {
        var _a;
        clearTimeout(uhr);
        for (const a of oben()) (_a = vorlage(a)) == null ? void 0 : _a.removeAttribute("inert");
      });
      dok.addEventListener("click", (e) => {
        if (offen && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse();
      }, { signal, capture: true });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (offen && nach && !wurzel.contains(nach)) schliesse();
      }, { signal });
    }
  };

  // packages/neo-behaviors/toolbar.js
  var BEDIENELEMENT = 'button, a[href], input:not([type="hidden"]), select, textarea, [contenteditable="true"], [role="button"], [role="radio"], [role="checkbox"], [role="switch"]';
  var KEIN_FELD = ["button", "submit", "reset", "checkbox", "radio", "image", "file", "color"];
  function istFeld(el) {
    if (el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable || el.getAttribute("contenteditable") === "true") return true;
    return el.tagName === "INPUT" && !KEIN_FELD.includes(
      /** @type {HTMLInputElement} */
      el.type
    );
  }
  function beobachteSticky(wurzel, signal) {
    if (!wurzel.classList.contains("nc-toolbar--sticky")) return;
    const fenster = wurzel.ownerDocument.defaultView;
    const IO = fenster == null ? void 0 : fenster.IntersectionObserver;
    if (typeof IO !== "function") return;
    const vorher = wurzel.classList.contains("is-scrolled");
    const oben = parseFloat(fenster.getComputedStyle(wurzel).top) || 0;
    const beobachter = new IO((eintraege) => {
      for (const e of eintraege) {
        const rahmenOben = e.rootBounds ? e.rootBounds.top : oben + 1;
        wurzel.classList.toggle("is-scrolled", e.intersectionRatio < 1 && e.boundingClientRect.top < rahmenOben);
      }
    }, { rootMargin: `-${oben + 1}px 0px 0px 0px`, threshold: [1] });
    beobachter.observe(wurzel);
    signal.addEventListener("abort", () => {
      beobachter.disconnect();
      wurzel.classList.toggle("is-scrolled", vorher);
    });
  }
  var nameVon = (el) => (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.getAttribute("name") || "").trim();
  var toolbar = {
    id: "toolbar",
    selektor: ".nc-toolbar",
    binde(wurzel, signal) {
      beobachteSticky(wurzel, signal);
      const elemente = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(BEDIENELEMENT)].filter((e) => !e.hasAttribute("disabled") && !e.closest('[hidden], [inert], [role="menu"], [role="listbox"], [role="dialog"]') && e.closest(".nc-toolbar") === wurzel)
      );
      if (!elemente().length) return;
      const vorher = new Map(elemente().map((e) => [e, e.getAttribute("tabindex")]));
      let aktuell = (
        /** @type {HTMLElement|null} */
        null
      );
      const tabStopp = (el, melden = true) => {
        for (const e of elemente()) e.tabIndex = e === el ? 0 : -1;
        const alt = aktuell;
        aktuell = el;
        if (melden && alt !== el) sende(wurzel, "toolbar-focus", { value: nameVon(el), previousValue: alt ? nameVon(alt) : null });
      };
      tabStopp(elemente().find((e) => !gesperrt(e)) || elemente()[0], false);
      wurzel.addEventListener("keydown", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        const liste = elemente();
        if (!liste.includes(el)) return;
        if (istFeld(el)) {
          if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
          const bedienbar = liste.filter((x) => x === el || !gesperrt(x));
          const ziel2 = bedienbar[bedienbar.indexOf(el) + (e.shiftKey ? -1 : 1)];
          if (!ziel2) return;
          e.preventDefault();
          tabStopp(ziel2);
          ziel2.focus();
          return;
        }
        const ziel = zielFuerTaste(e.key, liste, el, "horizontal");
        if (!ziel) return;
        e.preventDefault();
        e.stopPropagation();
        tabStopp(ziel);
        ziel.focus();
      }, { signal, capture: true });
      wurzel.addEventListener("focusin", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        if (el !== aktuell && elemente().includes(el)) tabStopp(el);
      }, { signal });
      wurzel.addEventListener("click", (e) => {
        const el = (
          /** @type {HTMLElement|null} */
          /** @type {HTMLElement} */
          e.target.closest(BEDIENELEMENT)
        );
        if (el && elemente().includes(el)) tabStopp(el);
      }, { signal });
      signal.addEventListener("abort", () => {
        for (const [e, wert] of vorher) {
          if (wert === null) e.removeAttribute("tabindex");
          else e.setAttribute("tabindex", wert);
        }
      });
    }
  };

  // packages/neo-behaviors/sidebar.js
  var UNTER = "button.nc-sidebar__item[aria-controls]";
  var EINKLAPPEN = "Navigation einklappen";
  var AUSKLAPPEN = "Navigation ausklappen";
  var sidebar = {
    id: "sidebar",
    selektor: ".nc-sidebar",
    binde(wurzel, signal) {
      var _a;
      const dok = wurzel.ownerDocument;
      const ziel = (knopf) => (
        /** @type {HTMLElement|null} */
        dok.getElementById(knopf.getAttribute("aria-controls") || "")
      );
      const label = (el) => {
        var _a2;
        return (((_a2 = el.querySelector(".nc-sidebar__item-label")) == null ? void 0 : _a2.textContent) || el.getAttribute("aria-label") || el.textContent || "").trim();
      };
      for (const k of wurzel.querySelectorAll(UNTER)) {
        const panel = ziel(k);
        if (!panel || !wurzel.contains(panel)) continue;
        if (!k.hasAttribute("aria-expanded")) k.setAttribute("aria-expanded", String(!panel.hidden));
        panel.hidden = k.getAttribute("aria-expanded") !== "true";
      }
      const klappe = (k) => {
        const panel = ziel(k);
        if (!panel || gesperrt(k)) return;
        const an = k.getAttribute("aria-expanded") !== "true";
        k.setAttribute("aria-expanded", String(an));
        panel.hidden = !an;
        sende(wurzel, "sidebar-submenu-toggle", { value: label(k), open: an });
      };
      const kopfKnopf = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-sidebar__toggle")
      );
      const vonUns = /* @__PURE__ */ new Set();
      const klappeEin = (an) => {
        wurzel.classList.toggle("nc-sidebar--collapsed", an);
        if (kopfKnopf) {
          kopfKnopf.setAttribute("aria-expanded", String(!an));
          kopfKnopf.setAttribute("aria-label", an ? AUSKLAPPEN : EINKLAPPEN);
        }
        if (an) {
          for (const el of wurzel.querySelectorAll(".nc-sidebar__item:not(.nc-sidebar__item--sub)")) {
            if (el.hasAttribute("aria-label")) continue;
            el.setAttribute("aria-label", label(el));
            vonUns.add(el);
          }
        } else {
          for (const el of vonUns) el.removeAttribute("aria-label");
          vonUns.clear();
        }
        sende(wurzel, "sidebar-collapse", { collapsed: an });
      };
      if (kopfKnopf) kopfKnopf.setAttribute("aria-expanded", String(!wurzel.classList.contains("nc-sidebar--collapsed")));
      wurzel.addEventListener("click", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        const k = (
          /** @type {HTMLElement|null} */
          el.closest(UNTER)
        );
        if (k && wurzel.contains(k) && wurzel.contains(ziel(k))) {
          klappe(k);
          return;
        }
        if (kopfKnopf && el.closest(".nc-sidebar__toggle") === kopfKnopf && !gesperrt(kopfKnopf)) klappeEin(!wurzel.classList.contains("nc-sidebar--collapsed"));
      }, { signal });
      const hinten = (
        /** @type {HTMLElement|null} */
        ((_a = wurzel.parentElement) == null ? void 0 : _a.querySelector(":scope > .nc-sidebar-backdrop")) || null
      );
      const offen = () => wurzel.classList.contains("nc-sidebar--open");
      let oeffner = (
        /** @type {HTMLElement|null} */
        null
      );
      if (hinten) hinten.hidden = !offen();
      const setze = (an, grund, knopf = null) => {
        if (offen() === an) return;
        wurzel.classList.toggle("nc-sidebar--open", an);
        if (hinten) hinten.hidden = !an;
        if (an) {
          oeffner = knopf;
          oeffner == null ? void 0 : oeffner.setAttribute("aria-expanded", "true");
          const start = (
            /** @type {HTMLElement|null} */
            wurzel.querySelector('[aria-current="page"]') || fokussierbare(wurzel)[0]
          );
          start == null ? void 0 : start.focus();
        } else {
          const zurueck = oeffner;
          oeffner = null;
          zurueck == null ? void 0 : zurueck.setAttribute("aria-expanded", "false");
          if (zurueck && (wurzel.contains(dok.activeElement) || grund !== "trigger")) zurueck.focus();
        }
        sende(wurzel, "sidebar-toggle", { open: an, reason: grund });
      };
      if (wurzel.id) {
        for (const k of dok.querySelectorAll(`[aria-controls="${CSS.escape(wurzel.id)}"]`)) if (!wurzel.contains(k)) k.setAttribute("aria-expanded", String(offen()));
        dok.addEventListener("click", (e) => {
          var _a2, _b;
          const knopf = (
            /** @type {HTMLElement|null} */
            /** @type {HTMLElement} */
            ((_b = (_a2 = e.target).closest) == null ? void 0 : _b.call(_a2, "[aria-controls]")) || null
          );
          if (!knopf || knopf.getAttribute("aria-controls") !== wurzel.id || wurzel.contains(knopf) || gesperrt(knopf)) return;
          e.preventDefault();
          if (offen()) setze(false, "trigger");
          else setze(true, "trigger", knopf);
        }, { signal });
      }
      hinten == null ? void 0 : hinten.addEventListener("click", () => setze(false, "overlay-click"), { signal });
      dok.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && offen()) {
          e.preventDefault();
          setze(false, "escape");
        }
      }, { signal });
    }
  };

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
    "alert-dialog": alertDialog,
    breadcrumb,
    treeview,
    "navigation-menu": navigationMenu,
    toolbar,
    sidebar
  });
  var MIT_VERHALTEN = Object.freeze(Object.keys(BEHAVIORS));
  function anbinden(bereich, nur) {
    return bindeAlle(bereich, waehle(nur));
  }
  function abbinden(bereich, nur) {
    loeseAlle(bereich, waehle(nur));
  }
  function waehle(nur) {
    return Object.keys(BEHAVIORS).filter((id) => !nur || nur.includes(id)).map((id) => BEHAVIORS[id]);
  }

  // packages/neo-behaviors/package.json
  var package_default = {
    name: "neo-behaviors",
    version: "0.3.0",
    private: true,
    description: "Verhalten der NEO-Bauteile (Tabs, Akkordeon, Select, Suche, Formular-Bauteile, Overlays, Navigation) — eine Quelle fuer Drupal, Doku und Theme-Konfigurator",
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
