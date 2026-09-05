/*
 * SimplEat — Master Chef Protocol (matemática de cocción).
 *
 * Transforma la lista de ingredientes parseada en una receta profesional:
 *   - Tiempo: T = Base + (Cantidad × Factor), con economía de escala.
 *   - Filtro rápido: si supera 20 min, acelera y explica cómo.
 *   - Semáforo nutricional (GAPA): verde / amarillo / rojo.
 *   - Sinergia de ingredientes y título Master Chef.
 *   - Nudge de estacionalidad (🌟 AHORRO, ferias de Paraná).
 *
 * Lógica pura: no toca DOM ni localStorage.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.COCINA = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // Iconos por categoría (reconocimiento visual instantáneo).
  var ICONOS = {
    "carne": "🥩",
    "pescado": "🐟",
    "verdura": "🥬",
    "aromatica": "🧄",
    "lacteo": "🧀",
    "basico": "🫙"
  };
  var ICONO_GENERICO = "🍽️";

  // Meses de estacionalidad en el hemisferio sur.
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function iconoDe(item) {
    if (item.generico || !item.ingrediente) return ICONO_GENERICO;
    return ICONOS[item.ingrediente.categoria] || ICONO_GENERICO;
  }

  // ── Cálculo de tiempo ──────────────────────────────────────────────
  function calcularTiempo(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.generico || !it.ingrediente) continue;
      var ing = it.ingrediente;
      var base = ing.tiempoBase || 0;
      var factor = ing.factorTiempo || 0;
      var qty = it.cantidad && it.cantidad > 0 ? it.cantidad : 1;
      // Economía de escala: más de una unidad se procesa en paralelo (×0.8).
      if (qty > 1) factor = factor * 0.8;
      total += base + (qty * factor);
    }
    return Math.round(total);
  }

  // ── Filtro rápido (si el plato tarda mucho) ─────────────────────────
  function aplicarFiltroRapido(tiempo) {
    if (tiempo <= 20) {
      return { tiempo: tiempo, aplicado: false, notas: [] };
    }
    var notas = [
      "Corte fino: reducís el tiempo de penetración del calor (−30%).",
      "Uso de tapa: el vapor atrapado acelera la cocción interna (−20%).",
      "Pre-cocción a vapor: ablanda y acorta la cocción final (−15%)."
    ];
    return { tiempo: Math.round(tiempo * 0.7), aplicado: true, notas: notas };
  }

  // ── Semáforo nutricional (GAPA) ────────────────────────────────────
  function semaforo(items) {
    var peor = 3; // 3=verde, 2=amarillo, 1=rojo
    var mapa = { "verde": 3, "amarillo": 2, "rojo": 1 };
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.generico || !it.ingrediente) continue;
      var nivel = mapa[it.ingrediente.salud] || 3;
      if (nivel < peor) peor = nivel;
    }
    return peor === 3 ? "verde" : (peor === 2 ? "amarillo" : "rojo");
  }

  // ── Sinergia de ingredientes ───────────────────────────────────────
  function detectarSinergia(items) {
    var tieneAjo = false, tieneAlbahaca = false;
    var tieneProteina = false, tieneVerdura = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.generico || !it.ingrediente) continue;
      var n = it.ingrediente.nombre;
      var c = it.ingrediente.categoria;
      if (n === "Ajo") tieneAjo = true;
      if (n === "Albahaca") tieneAlbahaca = true;
      if (c === "carne" || c === "pescado") tieneProteina = true;
      if (c === "verdura") tieneVerdura = true;
    }
    var notas = [];
    if (tieneAjo && tieneAlbahaca) {
      notas.push("Emulsión aromática: emulsioná el ajo y la albahaca con aceite de oliva para potenciar el aroma.");
    }
    return { notas: notas, proteinaConVerdura: tieneProteina && tieneVerdura };
  }

  // ── Título Master Chef ─────────────────────────────────────────────
  function generarTitulo(items) {
    var proteinas = [], verduras = [], otros = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.generico) { otros.push("Ingrediente genérico"); continue; }
      if (!it.ingrediente) continue;
      var c = it.ingrediente.categoria;
      if (c === "carne" || c === "pescado") proteinas.push(it.ingrediente.nombre);
      else if (c === "verdura") verduras.push(it.ingrediente.nombre);
      else otros.push(it.ingrediente.nombre);
    }
    if (proteinas.length && verduras.length) {
      return proteinas[0] + " con " + verduras[0] + (verduras.length > 1 ? " y más" : "");
    }
    if (proteinas.length) {
      return proteinas.join(" y ") + " a la plancha";
    }
    if (verduras.length) {
      return verduras.join(" y ") + " salteados";
    }
    return "Preparado de la alacena";
  }

  // ── Pasos técnicos ─────────────────────────────────────────────────
  function generarPasos(items) {
    var pasos = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var cantidadTexto;
      if (it.cantidad === null || it.cantidad === undefined) {
        cantidadTexto = "A gusto";
      } else if (Number.isInteger(it.cantidad)) {
        cantidadTexto = String(it.cantidad);
      } else {
        cantidadTexto = it.cantidadTexto || String(it.cantidad);
      }
      var nombre = it.generico ? "Ingrediente genérico (" + it.texto + ")" : it.ingrediente.nombre;
      var tecnica = (it.generico || !it.ingrediente) ? "Cocción a gusto" : it.ingrediente.tecnica;
      pasos.push({
        icono: iconoDe(it),
        cantidad: cantidadTexto,
        ingrediente: nombre,
        tecnica: tecnica,
        categoria: it.generico ? "generico" : it.ingrediente.categoria,
        origen: it.generico ? null : it.ingrediente.origen,
        generico: it.generico
      });
    }
    return pasos;
  }

  // ── Nudge de estacionalidad ────────────────────────────────────────
  function nudgeEstacional(items, mes) {
    // mes: 1-12 (si no se pasa, se usa la fecha actual)
    if (mes === undefined || mes === null) {
      mes = new Date().getMonth() + 1;
    }
    var estacionales = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.generico || !it.ingrediente) continue;
      var est = it.ingrediente.estacional || [];
      if (est.indexOf(mes) !== -1) estacionales.push(it.ingrediente.nombre);
    }
    if (!estacionales.length) {
      return { hay: false, tipo: null, texto: null };
    }
    return {
      hay: true,
      tipo: "AHORRO",
      texto: "🌟 " + estacionales.join(", ") + " está en temporada. " +
        "Mejores precios en las ferias municipales de Paraná (Salta y Nogoyá)."
    };
  }

  /*
   * Orquesta todo: recibe los items ya parseados y devuelve la receta.
   */
  function generarReceta(items, mes) {
    var tiempoOriginal = calcularTiempo(items);
    var filtro = aplicarFiltroRapido(tiempoOriginal);
    var sinergia = detectarSinergia(items);
    var nudge = nudgeEstacional(items, mes);

    return {
      titulo: generarTitulo(items),
      tiempoOriginal: tiempoOriginal,
      tiempo: filtro.tiempo,
      filtroRapido: filtro.aplicado,
      notasTecnica: filtro.notas,
      semaforo: semaforo(items),
      pasos: generarPasos(items),
      sinergia: sinergia.notas,
      nudge: nudge
    };
  }

  return {
    generarReceta: generarReceta,
    calcularTiempo: calcularTiempo,
    aplicarFiltroRapido: aplicarFiltroRapido,
    semaforo: semaforo,
    MESES: MESES
  };
});
