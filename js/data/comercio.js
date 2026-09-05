/*
 * SimplEat — Perfil del comercio (modo B2B).
 *
 * Este archivo convierte la app de "consumidor" en la app de un NEGOCIO
 * de alimentos (carnicería, verdulería, pescadería, supermercado).
 *
 * Para venderle a un cliente, se cambia este objeto (nombre, rubro, color
 * y productos destacados) o se crea una copia del repo con su perfil.
 * El resto de la app no se toca.
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

  // Perfil por defecto: la marca SimpleEat (modo consumidor).
  var PERFIL = {
    nombre: null,           // null → usa el logo "SimpleEat" original
    lema: null,             // null → usa el lema por defecto
    rubro: "Gastronomía argentina · Nodo Paraná",
    colorAcento: null,      // null → verde orgánico por defecto (ej. "#f59e0b" para carnicería)
    // Productos destacados del negocio: clic = receta de ese producto.
    // Vacío → usa los ejemplos genéricos de la app.
    productos: []
  };

  /*
   * EJEMPLO de perfil para una carnicería (descomentar y ajustar):
   *
   * var PERFIL = {
   *   nombre: "Carnicería El Gaucho",
   *   lema: "Te decimos cómo cocinar cada corte que te llevás.",
   *   rubro: "Carnes · Paraná",
   *   colorAcento: "#f59e0b",
   *   productos: [
   *     { nombre: "Asado", ejemplo: "asado con papas" },
   *     { nombre: "Vacío", ejemplo: "vacio a la parrilla" },
   *     { nombre: "Entraña", ejemplo: "entraña vuelta y vuelta" },
   *     { nombre: "Matambre", ejemplo: "matambre a la pizza" },
   *     { nombre: "Bondiola", ejemplo: "bondiola al horno" }
   *   ]
   * };
   */

  return PERFIL;
});
