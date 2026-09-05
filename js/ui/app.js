/*
 * SimplEat — Capa de interfaz (DOM).
 *
 * Conecta el Omnibar con el motor (parser + cocina + coping) y
 * renderiza la receta. Solo toca DOM; toda la lógica vive en js/core.
 */
(function () {
  "use strict";

  var omnibar = document.getElementById("omnibar");
  var boton = document.getElementById("cocinar");
  var resultado = document.getElementById("resultado");
  var vacio = document.getElementById("vacio");
  var sugerencias = document.getElementById("sugerencias");

  var EJEMPLOS = [
    "asado con papas",
    "2 alitas de pollo y 1 cebolla morada",
    "surubí con limón",
    "zapallito de tronco con tomate",
    "milanesa de nalga con puré",
    "boga a la parrilla",
    "osobuco con zapallo plomo"
  ];

  function escapar(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function etiquetaSemaforo(nivel) {
    if (nivel === "verde") return { texto: "Saludable", clase: "chip--verde", icono: "●" };
    if (nivel === "amarillo") return { texto: "Moderado", clase: "chip--amarillo", icono: "●" };
    return { texto: "Pesado", clase: "chip--rojo", icono: "●" };
  }

  function renderPasos(pasos) {
    if (!pasos.length) return "";
    var html = '<div class="tarjeta"><div class="titulo-seccion">Pasos</div>';
    for (var i = 0; i < pasos.length; i++) {
      var p = pasos[i];
      var origen = p.origen ? '<span class="paso__origen">' + escapar(p.origen) + "</span>" : "";
      html +=
        '<div class="paso">' +
          '<span class="paso__icono">' + p.icono + "</span>" +
          '<div class="paso__cuerpo">' +
            '<div class="paso__header"><span class="cantidad">' + escapar(p.cantidad) + "</span> " +
            escapar(p.ingrediente) + "</div>" +
            '<div class="paso__tecnica">' + escapar(p.tecnica) + "</div>" +
            origen +
          "</div>" +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  function renderNotas(receta) {
    if (!receta.filtroRapido) return "";
    var html = '<div class="tarjeta"><div class="titulo-seccion">Acelerador del chef</div><ul class="notas">';
    for (var i = 0; i < receta.notasTecnica.length; i++) {
      html += "<li>" + escapar(receta.notasTecnica[i]) + "</li>";
    }
    html += "</ul></div>";
    return html;
  }

  function renderHacks(coping) {
    if (!coping.hacks.length) return "";
    var html = '<div class="tarjeta"><div class="titulo-seccion">Ingenio Argento</div>';
    for (var i = 0; i < coping.hacks.length; i++) {
      var h = coping.hacks[i];
      html +=
        '<div class="hack">' +
          '<span class="hack__badge">INGENIO</span>' +
          '<span class="hack__texto"><strong>' + escapar(h.ingrediente) + ":</strong> " + escapar(h.tip) + "</span>" +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  function renderSustituciones(coping) {
    if (!coping.sustituciones.length) return "";
    var html = '<div class="tarjeta"><div class="titulo-seccion">Si te falta algo en la alacena</div><ul class="notas">';
    for (var i = 0; i < coping.sustituciones.length; i++) {
      var s = coping.sustituciones[i];
      html += "<li><strong>" + escapar(s.ingrediente) + "</strong> → " + escapar(s.reemplazos.join(" o ")) + "</li>";
    }
    html += "</ul></div>";
    return html;
  }

  function renderSinergia(receta) {
    if (!receta.sinergia.length) return "";
    var html = '<div class="tarjeta"><div class="titulo-seccion">Técnica del chef</div><ul class="notas">';
    for (var i = 0; i < receta.sinergia.length; i++) {
      html += "<li>" + escapar(receta.sinergia[i]) + "</li>";
    }
    html += "</ul></div>";
    return html;
  }

  function renderNudge(receta) {
    if (!receta.nudge.hay) return "";
    return '<div class="tarjeta"><div class="nudge">' + escapar(receta.nudge.texto) + "</div></div>";
  }

  function renderReceta(receta, coping) {
    var sem = etiquetaSemaforo(receta.semaforo);
    var tiempoChip = receta.filtroRapido
      ? '<span class="chip chip--rapido">⚡ ' + receta.tiempo + " min (acelerado)</span>"
      : '<span class="chip chip--tiempo">⏱ ' + receta.tiempo + " min</span>";

    var html =
      '<div class="tarjeta">' +
        '<h2 class="receta__titulo">' + escapar(receta.titulo) + "</h2>" +
        '<div class="chips">' +
          tiempoChip +
          '<span class="chip ' + sem.clase + '">' + sem.icono + " " + sem.texto + "</span>" +
        "</div>" +
      "</div>" +
      renderPasos(receta.pasos) +
      renderNotas(receta) +
      renderSinergia(receta) +
      renderHacks(coping) +
      renderSustituciones(coping) +
      renderNudge(receta);

    resultado.innerHTML = html;
    resultado.hidden = false;
    if (vacio) vacio.hidden = true;
  }

  function cocinar() {
    var texto = omnibar.value.trim();
    if (!texto) return;
    var items = PARSER.parsearEntrada(texto, DATOS.INGREDIENTES);
    var receta = COCINA.generarReceta(items);
    var coping = COPING.decorar(items);
    renderReceta(receta, coping);
  }

  // Sugerencias clicables.
  function armarSugerencias() {
    var html = "";
    for (var i = 0; i < EJEMPLOS.length; i++) {
      html += '<button type="button" class="chip-sugerencia" data-ejemplo="' + escapar(EJEMPLOS[i]) + '">' + escapar(EJEMPLOS[i]) + "</button>";
    }
    sugerencias.innerHTML = html;
  }

  sugerencias.addEventListener("click", function (e) {
    var el = e.target.closest("[data-ejemplo]");
    if (!el) return;
    omnibar.value = el.getAttribute("data-ejemplo");
    cocinar();
  });

  boton.addEventListener("click", cocinar);

  omnibar.addEventListener("keydown", function (e) {
    if (e.key === "Enter") cocinar();
  });

  armarSugerencias();
})();
