/*
 * SimplEat — CopingChef: lógica de supervivencia de alacena.
 *
 * "Croto pero rico": ante la falta de un ingrediente, sugiere reemplazos
 * y hacks técnicos usando lo que ya hay en la alacena.
 *
 * Lógica pura: no toca DOM ni localStorage.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.COPING = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  /*
   * Devuelve el hack técnico de un ingrediente (si tiene), o null.
   */
  function obtenerHack(item) {
    if (item.generico || !item.ingrediente) return null;
    return item.ingrediente.hack || null;
  }

  /*
   * Devuelve los reemplazos sugeridos para un ingrediente (si tiene), o null.
   */
  function obtenerSustitutos(item) {
    if (item.generico || !item.ingrediente) return null;
    var s = item.ingrediente.sustitutos;
    if (s && s.length) return s;
    return null;
  }

  /*
   * Recorre los items y junta todos los "Ingenio Argento" (hacks) y
   * sustituciones disponibles, para decorar la receta.
   */
  function decorar(items) {
    var hacks = [];
    var sustituciones = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var h = obtenerHack(it);
      if (h) hacks.push({ ingrediente: it.ingrediente.nombre, tip: h });
      var s = obtenerSustitutos(it);
      if (s) {
        sustituciones.push({
          ingrediente: it.ingrediente.nombre,
          reemplazos: s
        });
      }
    }
    return { hacks: hacks, sustituciones: sustituciones };
  }

  return {
    obtenerHack: obtenerHack,
    obtenerSustitutos: obtenerSustitutos,
    decorar: decorar
  };
});
