/*
 * Simpleat — Analítica y conversiones (Umami + GA4 + Google Ads).
 *
 * Centraliza TODO el tracking en un solo lugar. El resto del código solo
 * llama a Analytics.cocinar() cuando el usuario genera una receta; acá se
 * decide qué se dispara y a dónde. Idempotente: sin IDs cargados, no hace
 * nada y la app no se rompe.
 *
 * IDs (completar con los reales; dejar vacío desactiva esa pieza):
 *   - ga4:                ID de medición de Google Analytics 4 (ej. "G-XXXXXXXXXX")
 *   - adsConversionId:    ID de conversión de Google Ads       (ej. "AW-123456789")
 *   - adsConversionLabel: etiqueta de la conversión de Ads     (ej. "AbC123xyz")
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.Analytics = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var CONFIG = {
    ga4: "",
    adsConversionId: "",
    adsConversionLabel: "",
  };

  var gtagCargado = false;

  function gtag() {
    if (root.dataLayer) root.dataLayer.push(arguments);
  }

  // Carga gtag.js una sola vez, solo si hay al menos un ID de Google configurado.
  function cargarGtag() {
    if (gtagCargado || typeof document === "undefined") return;
    var id = CONFIG.ga4 || CONFIG.adsConversionId;
    if (!id) return;
    gtagCargado = true;
    root.dataLayer = root.dataLayer || [];
    root.gtag = function () { root.dataLayer.push(arguments); };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    root.gtag("js", new Date());
    if (CONFIG.ga4) root.gtag("config", CONFIG.ga4);
    if (CONFIG.adsConversionId) root.gtag("config", CONFIG.adsConversionId);
  }

  // Conversión: el usuario generó una receta (botón "Cocinar").
  function cocinar() {
    cargarGtag();
    if (CONFIG.adsConversionId && CONFIG.adsConversionLabel) {
      try {
        gtag("event", "conversion", {
          send_to: CONFIG.adsConversionId + "/" + CONFIG.adsConversionLabel,
        });
      } catch (err) { /* sin ads no se rompe */ }
    }
    if (CONFIG.ga4) {
      try { gtag("event", "cocinar"); } catch (err) { /* sin GA4 no se rompe */ }
    }
    if (root.umami) {
      try { root.umami.track("cocinar"); } catch (err) { /* sin analítica no se rompe */ }
    }
  }

  return {
    config: CONFIG,
    cocinar: cocinar,
  };
});
