/*
 * Demo B2B — Perfil de ejemplo para una carnicería.
 *
 * Muestra cómo se personaliza SimpleEat para un comercio: se cambia este
 * archivo y se referencia desde el HTML (ver demo-carniceria.html).
 * El motor, la lógica y el diseño no se tocan.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.COMERCIO = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  return {
    nombre: "Carnicería El Gaucho",
    lema: "Te decimos cómo cocinar cada corte que te llevás.",
    rubro: "Carnes · Paraná",
    colorAcento: "#f59e0b",
    productos: [
      { nombre: "Asado", ejemplo: "asado con papas" },
      { nombre: "Vacío", ejemplo: "vacio a la parrilla" },
      { nombre: "Entraña", ejemplo: "entraña vuelta y vuelta" },
      { nombre: "Matambre", ejemplo: "matambre a la pizza" },
      { nombre: "Bondiola", ejemplo: "bondiola al horno" }
    ]
  };
});
