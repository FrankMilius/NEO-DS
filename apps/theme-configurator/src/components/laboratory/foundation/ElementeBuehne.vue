<template>
  <!--
    Bühne „HTML-Elemente“ (19.10.2026). Vorher: Tabellen mit Token-Namen
    (ElementsOverview). Jetzt: die Elemente selbst, so wie die Website sie mit
    den Grundstilen des Design Systems (03-elements) zeigt — im geöffneten
    Theme, Hell/Dunkel nach dem Vorschaumodus der Kopfzeile.
  -->
  <div class="eb" data-test="elemente-buehne">
    <p class="eb-hinweis">So sehen die Grundelemente auf der Website aus. Sie folgen der Typografie und den Farben dieses Themes.</p>
    <div class="eb-raster" :class="{ 'eb-raster--mehrere': ansichten.length > 1 }">
      <WebsiteAusschnitt
        v-for="a in ansichten"
        :key="`${a.set}-${a.modus}`"
        :set="a.set"
        :modus="a.modus"
        :label="a.label"
        :mit-titel="ansichten.length > 1"
        :komponenten="['button', 'input', 'form-field', 'form-label', 'compare-table']"
      >
        <article class="eb-seite">
          <span class="eb-gruppe">Überschriften</span>
          <h1>Überschrift 1</h1>
          <h2>Überschrift 2</h2>
          <h3>Überschrift 3</h3>
          <h4>Überschrift 4</h4>
          <h5>Überschrift 5</h5>
          <h6>Überschrift 6</h6>

          <span class="eb-gruppe">Fließtext und Auszeichnungen</span>
          <p>
            Der digitale Arbeitsplatz verbindet Kommunikation, Wissen und Werkzeuge.
            Mehr dazu im <a href="#" @click.prevent>Leitfaden für Verwaltungen</a> —
            mit <strong>fetten</strong>, <em>kursiven</em> und <mark>markierten</mark>
            Stellen, <code>Code im Text</code> und <small>kleingedruckten Hinweisen</small>.
          </p>

          <span class="eb-gruppe">Listen</span>
          <ul>
            <li>Live-Dashboards aus allen Quellen</li>
            <li>KI-gestützte Suche und Assistenz</li>
            <li>DSGVO-konform, gehostet in der EU</li>
          </ul>
          <ol>
            <li>Bedarf klären</li>
            <li>Pilot einrichten</li>
            <li>Ausrollen</li>
          </ol>

          <span class="eb-gruppe">Zitat</span>
          <blockquote>
            <p>Seit der Einführung finden unsere Mitarbeitenden Informationen in Sekunden statt in Stunden.</p>
          </blockquote>

          <span class="eb-gruppe">Tabelle</span>
          <p class="eb-anmerkung"><small>Eine reine Tabelle hat im Design System keine Grundstile; auf der Website steht sie als Komponente „Compare Table“.</small></p>
          <div class="eb-tabelle">
            <table class="nc-compare-table" aria-label="Pakete im Vergleich">
              <thead><tr><th>Paket</th><th>Nutzer</th><th>Speicher</th></tr></thead>
              <tbody>
                <tr><td>Basis</td><td>bis 50</td><td>100 GB</td></tr>
                <tr><td>Behörde</td><td>bis 500</td><td>1 TB</td></tr>
              </tbody>
            </table>
          </div>

          <span class="eb-gruppe">Code-Block</span>
          <pre><code>curl https://beispiel.de/api/v1/status</code></pre>

          <span class="eb-gruppe">Bild mit Bildunterschrift</span>
          <figure class="eb-figur">
            <img :src="BILD_SRC" alt="Platzhalterbild">
            <figcaption><small>Bildunterschrift: Team-Workshop in Berlin</small></figcaption>
          </figure>

          <hr>

          <span class="eb-gruppe">Knöpfe und Formular</span>
          <p class="eb-anmerkung"><small>Auf der Website tragen Knöpfe und Felder immer die Klassen der Komponenten (Button, Input); die reinen Elemente sind zurückgesetzt.</small></p>
          <div class="eb-knoepfe">
            <button type="button" class="nc-button nc-button--primary"><span class="nc-button__label">Demo anfragen</span></button>
            <button type="button" class="nc-button nc-button--outline"><span class="nc-button__label">Mehr erfahren</span></button>
            <button type="button" class="nc-button nc-button--ghost"><span class="nc-button__label">Abbrechen</span></button>
          </div>
          <div class="nc-form-field">
            <label class="nc-form-label" :for="`eb-mail-${a.set}-${a.modus}`"><span class="nc-form-label__text">E-Mail-Adresse</span></label>
            <input :id="`eb-mail-${a.set}-${a.modus}`" class="nc-input" type="email" placeholder="name@behoerde.de">
          </div>
        </article>
      </WebsiteAusschnitt>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import WebsiteAusschnitt from './WebsiteAusschnitt.vue'
import { useVorschauKombinationen } from '../../../composables/useVorschauKombinationen.js'
import { BILD_SRC } from '../../../arena-templates/_helfer.js'

const store = useThemeStore()

// Vorschaumodus der Kopfzeile; immer nur das geöffnete Theme (19.10.2026)
const { fuerModus } = useVorschauKombinationen()
const ansichten = computed(() => fuerModus(store.state.previewMode))
</script>

<style scoped>
.eb { display: grid; gap: 12px; padding: 16px; }
.eb-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-muted); }
.eb-raster { display: grid; gap: 16px; }
.eb-raster--mehrere { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.eb-seite { display: grid; gap: 0; }
/* Gruppentitel gehören zur App, nicht zur Website */
.eb-gruppe {
  display: block; margin: 20px 0 8px; padding-top: 8px; border-top: 1px dashed var(--cfg-border);
  font: 600 10px/1.4 var(--cfg-font-body); letter-spacing: .06em; text-transform: uppercase; color: var(--cfg-text-muted);
}
.eb-seite > .eb-gruppe:first-child { margin-top: 0; border-top: 0; padding-top: 0; }
.eb-tabelle { overflow-x: auto; }
.eb-figur { margin: 0; display: grid; gap: 6px; max-width: 360px; }
.eb-figur img { width: 100%; border-radius: 6px; }
.eb-knoepfe { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.eb-anmerkung { margin-bottom: 8px; }
</style>
