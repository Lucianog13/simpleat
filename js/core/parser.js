/*
 * SimplEat — Parser NLP de ingredientes.
 *
 * Interpreta lo que el usuario escribe en el Omnibar y lo convierte en
 * una lista estructurada de ingredientes con cantidades.
 *
 * Reglas (según "Advanced NLP Ingredient Parser" recuperado):
 *   - No-truncación: nunca se descarta un ingrediente; si no se reconoce,
 *     se conserva como "Ingrediente Genérico".
 *   - Matching greedy multi-término: se matchea el término más largo
 *     primero ("zapallito de tronco" antes que "zapallito").
 *   - Cantidades por regex (números, fracciones y números en texto).
 *
 * Lógica pura: no toca DOM ni localStorage.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.PARSER = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // Números escritos en texto, como los entiende un argentino.
  var NUMEROS_TEXTO = {
    "un": 1, "una": 1, "uno": 1,
    "media": 0.5, "medio": 0.5,
    "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
    "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10
  };

  // Separadores y conectores que dividen segmentos.
  var SEPARADORES = /[,;+\n]|(?: y )|(?: con )|(?: mas )|(?: más )/gi;

  // Palabras que ignoramos al detectar "ingrediente genérico".
  var RUIDO = {
    "y": 1, "con": 1, "mas": 1, "más": 1, "de": 1, "del": 1, "la": 1, "el": 1,
    "los": 1, "las": 1, "un": 1, "una": 1, "unos": 1, "unas": 1, "para": 1,
    "sin": 1, "al": 1, "a": 1, "en": 1, "kilo": 1, "kilos": 1, "kg": 1,
    "gramos": 1, "gr": 1, "g": 1, "litro": 1, "litros": 1, "cc": 1, "ml": 1
  };

  // Quita acentos y pasa a minúsculas (para matchear sin importar tildes).
  function normalizar(s) {
    return String(s).toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Pluraliza una palabra según las reglas básicas del español.
  function pluralizarPalabra(w) {
    if (!w) return w;
    if (w.endsWith("z")) return w.slice(0, -1) + "ces";
    if (w.endsWith("s") || w.endsWith("x")) return w;
    if ("aeiou".indexOf(w[w.length - 1]) !== -1) return w + "s";
    return w + "es";
  }

  // Pluraliza todas las palabras de un término multi-palabra.
  function pluralizarTermino(t) {
    return t.split(" ").map(pluralizarPalabra).join(" ");
  }

  /*
   * Construye el índice de matching greedy:
   * una lista de { termino, ingrediente } ordenada de término más largo
   * a más corto, para que "zapallito de tronco" gane antes que "zapallito".
   * Incluye también la forma plural de cada término ("cebollas moradas").
   */
  function construirIndice(ingredientes) {
    var indice = [];
    var vistos = {};
    function agregar(t, ing) {
      if (t && !vistos[t]) {
        vistos[t] = 1;
        indice.push({ termino: t, ingrediente: ing });
      }
    }
    for (var i = 0; i < ingredientes.length; i++) {
      var ing = ingredientes[i];
      var terminos = [ing.nombre].concat(ing.alias || []);
      for (var j = 0; j < terminos.length; j++) {
        var t = normalizar(terminos[j]);
        agregar(t, ing);
        agregar(pluralizarTermino(t), ing);
      }
    }
    indice.sort(function (a, b) { return b.termino.length - a.termino.length; });
    return indice;
  }

  // Convierte un texto de cantidad a número (soporta "1/2", "2,5", "dos").
  function aNumero(texto) {
    var t = normalizar(texto).trim();
    if (t === "un kilo") return 1;
    if (t === "medio kilo") return 0.5;
    if (NUMEROS_TEXTO[t] !== undefined) return NUMEROS_TEXTO[t];
    if (t.indexOf("/") !== -1) {
      var partes = t.split("/");
      return parseFloat(partes[0]) / parseFloat(partes[1]);
    }
    return parseFloat(t.replace(",", "."));
  }

  /*
   * Analiza el texto completo y devuelve una lista de items:
   *   { ingrediente, cantidad, cantidadTexto, unidad, generico, texto }
   *   - ingrediente: objeto del diccionario, o null si es genérico
   *   - cantidad: número (o null si el usuario no puso)
   *   - cantidadTexto: "dos", "1/2", "2" ... (para mostrar)
   *   - generico: true si el ingrediente no se reconoció
   */
  function parsearEntrada(texto, ingredientes) {
    var txt = normalizar(texto || "");
    var indice = construirIndice(ingredientes);

    // 1) Matching greedy de ingredientes (con posición).
    var textoRestante = txt;
    var matches = [];
    for (var i = 0; i < indice.length; i++) {
      var termino = indice[i].termino;
      var idx = textoRestante.indexOf(termino);
      if (idx !== -1) {
        matches.push({ ingrediente: indice[i].ingrediente, pos: idx, termino: termino });
        var mascara = "";
        for (var k = 0; k < termino.length; k++) mascara += " ";
        textoRestante = textoRestante.slice(0, idx) + mascara + textoRestante.slice(idx + termino.length);
      }
    }
    matches.sort(function (a, b) { return a.pos - b.pos; });

    // 2) Cantidades con posición (regex global).
    var re = /(un kilo|medio kilo|media|medio|una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+(?:\/\d+)?|\d+(?:[.,]\d+)?)/gi;
    var cantidades = [];
    var m;
    while ((m = re.exec(txt)) !== null) {
      // evitamos que "un" dentro de "un kilo" se duplique
      cantidades.push({ valor: aNumero(m[1]), pos: m.index, texto: m[1] });
    }

    // 3) Asociar cada cantidad al ingrediente más cercano hacia adelante.
    var items = [];
    var usado = {};
    for (var c = 0; c < cantidades.length; c++) {
      var cant = cantidades[c];
      var mejor = null;
      var mejorDist = Infinity;
      for (var mm = 0; mm < matches.length; mm++) {
        if (usado[mm]) continue;
        var dist = matches[mm].pos - cant.pos;
        if (dist >= 0 && dist < mejorDist) {
          mejorDist = dist;
          mejor = mm;
        }
      }
      if (mejor !== null && mejorDist < 40) {
        usado[mejor] = 1;
        matches[mejor].cantidad = cant.valor;
        matches[mejor].cantidadTexto = cant.texto;
      }
    }

    // 4) Armar items desde los matches.
    for (var q = 0; q < matches.length; q++) {
      var mt = matches[q];
      items.push({
        ingrediente: mt.ingrediente,
        cantidad: mt.cantidad !== undefined ? mt.cantidad : null,
        cantidadTexto: mt.cantidadTexto || null,
        generico: false,
        texto: mt.termino
      });
    }

    // 5) Ingredientes genéricos: lo que quedó sin matchear y sin cantidad.
    var resto = textoRestante;
    // tachar también las cantidades para no tomarlas como genérico
    for (var c2 = 0; c2 < cantidades.length; c2++) {
      var pos2 = cantidades[c2].pos;
      var t2 = cantidades[c2].texto;
      resto = resto.slice(0, pos2) + t2.split("").map(function () { return " "; }).join("") + resto.slice(pos2 + t2.length);
    }
    var tokens = resto.split(/[\s,;+]+/).filter(function (w) { return w.length >= 3; });
    var genericosVistos = {};
    for (var t = 0; t < tokens.length; t++) {
      var w = tokens[t];
      if (RUIDO[w]) continue;
      if (genericosVistos[w]) continue;
      genericosVistos[w] = 1;
      items.push({
        ingrediente: null,
        cantidad: null,
        cantidadTexto: null,
        generico: true,
        texto: w
      });
    }

    return items;
  }

  return {
    parsearEntrada: parsearEntrada,
    normalizar: normalizar,
    construirIndice: construirIndice
  };
});
