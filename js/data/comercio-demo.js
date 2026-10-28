/*
 * Simpleat — Perfil demo (modo B2B) para la landing de comercios.
 *
 * Datos GENÉRICOS de ejemplo (no un cliente real): la app adopta este
 * nombre, rubro, color y productos en demo-carniceria.html. Para un
 * cliente concreto se edita este objeto o se crea una copia del repo.
 *
 * Solo datos: no toca DOM ni localStorage.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.COMERCIO = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var PERFIL = {
    nombre: "Tu Carnicería",
    lema: "Te decimos cómo cocinar cada corte que te llevás.",
    rubro: "Carnes · Paraná",
    colorAcento: "#f59e0b",
    productos: [
      { nombre: "Asado", ejemplo: "asado con papas" },
      { nombre: "Vacío", ejemplo: "vacio a la parrilla" },
      { nombre: "Entraña", ejemplo: "entraña vuelta y vuelta" },
      { nombre: "Matambre", ejemplo: "matambre a la pizza" },
      { nombre: "Bondiola", ejemplo: "bondiola al horno" },
      { nombre: "Milanesa", ejemplo: "milanesa de nalga con puré" },
    ],
  };

  return PERFIL;
});
