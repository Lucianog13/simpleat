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

  // Personalización por comercio (modo B2B): si hay un perfil definido en
  // js/data/comercio.js, la app adopta el nombre, lema, rubro y color del
  // negocio. Sin tocar el resto del código.
  var COM = window.COMERCIO || null;
  if (COM) {
    if (COM.nombre) {
      document.querySelector(".marca__simple").textContent = COM.nombre;
      document.querySelector(".marca__eat").textContent = "";
    }
    if (COM.rubro) document.querySelector(".marca__nodo").textContent = COM.rubro;
    if (COM.lema) document.querySelector(".cabecera__lema").textContent = COM.lema;
    if (COM.colorAcento) document.documentElement.style.setProperty("--acento", COM.colorAcento);
  }

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

  // Sugerencias clicables (los productos del comercio, si los hay).
  function armarSugerencias() {
    var lista = EJEMPLOS;
    if (COM && COM.productos && COM.productos.length) {
      lista = COM.productos.map(function (p) { return p.ejemplo; });
    }
    var html = "";
    for (var i = 0; i < lista.length; i++) {
      html += '<button type="button" class="chip-sugerencia" data-ejemplo="' + escapar(lista[i]) + '">' + escapar(lista[i]) + "</button>";
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

  // Soporte de URL: ?cocinar=asado con papas → auto-cocina al cargar
  // (útil para demos, links compartibles y capturas con receta).
  var params = new URLSearchParams(window.location.search);
  var precargado = params.get("cocinar");
  if (precargado) {
    omnibar.value = precargado;
    cocinar();
  }

  // ── Cámara / foto (reconocimiento con VLM local) ────────────────
  // Usa el modelo de visión local (Ollama + llava-phi3) para detectar
  // los ingredientes de una foto de la heladera. Funciona cuando la app
  // corre en ESTA PC (localhost:11434). Para el producto público hace
  // falta una API de visión detrás de un backend.
  var botonFoto = document.getElementById("foto");
  var inputCaptura = document.getElementById("captura");
  var PLACEHOLDER_ORIGINAL = omnibar.placeholder;

  if (botonFoto && inputCaptura) {
    botonFoto.addEventListener("click", function () {
      inputCaptura.click();
    });

    inputCaptura.addEventListener("change", function () {
      var archivo = inputCaptura.files && inputCaptura.files[0];
      if (!archivo) return;
      reconocerFoto(archivo);
      inputCaptura.value = ""; // permite volver a elegir la misma foto
    });
  }

  function reconocerFoto(archivo) {
    var lector = new FileReader();
    lector.onload = function (e) {
      omnibar.value = "";
      omnibar.placeholder = "Reconociendo ingredientes… 📸";
      redimensionar(e.target.result, 512, function (dataUrl) {
        pedirIngredientes(dataUrl);
      });
    };
    lector.readAsDataURL(archivo);
  }

  function redimensionar(dataUrl, maxLado, cb) {
    var img = new Image();
    img.onload = function () {
      var escala = Math.min(1, maxLado / Math.max(img.width, img.height));
      var w = Math.max(1, Math.round(img.width * escala));
      var h = Math.max(1, Math.round(img.height * escala));
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  }

  function limpiarLista(texto) {
    // Saca viñetas, salta líneas a comas, y deduplica ingredientes.
    var limpio = String(texto || "")
      .replace(/[\*\-\u2022]/g, "")
      .replace(/\n+/g, ",")
      .replace(/\s+/g, " ")
      .trim();
    var partes = limpio.split(/[,;]/).map(function (s) { return s.trim(); }).filter(Boolean);
    var vistos = {};
    var unicos = [];
    for (var i = 0; i < partes.length; i++) {
      var clave = partes[i].toLowerCase();
      if (vistos[clave]) continue;
      vistos[clave] = 1;
      unicos.push(partes[i]);
    }
    return unicos.join(", ");
  }

  function esLocal() {
    var h = location.hostname;
    return location.protocol === "file:" || h === "localhost" || h === "127.0.0.1";
  }

  function pedirIngredientes(dataUrl) {
    var base64 = dataUrl.split(",")[1];
    if (esLocal()) {
      pedirAOllama(base64);
    } else {
      pedirASupabase(base64);
    }
  }

  function aplicarRespuesta(texto) {
    var limpio = limpiarLista(texto);
    omnibar.placeholder = PLACEHOLDER_ORIGINAL;
    if (limpio) {
      omnibar.value = limpio;
      cocinar();
    } else {
      omnibar.placeholder = "No detecté ingredientes, probá otra foto.";
    }
  }

  function pedirAOllama(base64) {
    var cuerpo = {
      model: "llava-phi3",
      prompt: "List the food ingredients visible in this photo, each one only once. Answer with ONLY a comma-separated list of ingredient names in Spanish. No sentences, no extra words.",
      images: [base64],
      stream: false,
      options: { num_predict: 60, temperature: 0 }
    };
    fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    })
      .then(function (r) { return r.json(); })
      .then(function (d) { aplicarRespuesta(d.response); })
      .catch(function () {
        omnibar.placeholder = PLACEHOLDER_ORIGINAL;
        alert("No pude reconocer la foto (modo local). ¿Ollama está corriendo?");
      });
  }

  function pedirASupabase(base64) {
    if (!window.CONFIG || !window.CONFIG.SUPABASE_URL) {
      omnibar.placeholder = PLACEHOLDER_ORIGINAL;
      alert("Falta la configuración de backend.");
      return;
    }
    var url = window.CONFIG.SUPABASE_URL + "/functions/v1/" + window.CONFIG.VISION_FUNCTION;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + window.CONFIG.SUPABASE_ANON_KEY,
        "apikey": window.CONFIG.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ imagen: base64, mime: "image/jpeg" })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.error) throw new Error(d.error);
        aplicarRespuesta(d.ingredientes);
      })
      .catch(function (e) {
        omnibar.placeholder = PLACEHOLDER_ORIGINAL;
        alert("No pude reconocer la foto: " + (e && e.message ? e.message : "error"));
      });
  }

  // ── Chips rápidos (agregan al input sin borrar lo que hay) ──────
  var filaRapidos = document.querySelector(".omnibar__rapidos");
  if (filaRapidos) {
    filaRapidos.addEventListener("click", function (e) {
      var el = e.target.closest("[data-agregar]");
      if (!el) return;
      var ing = el.getAttribute("data-agregar");
      var actual = omnibar.value.trim();
      omnibar.value = actual ? actual + ", " + ing : ing;
      omnibar.focus();
    });
  }

  // ── Navegación inferior ─────────────────────────────────────────
  var itemsNav = document.querySelectorAll(".pienav__item");
  for (var n = 0; n < itemsNav.length; n++) {
    itemsNav[n].addEventListener("click", function () {
      var nav = this.getAttribute("data-nav");
      if (nav === "recetas") {
        if (!resultado.hidden) resultado.scrollIntoView({ behavior: "smooth" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
