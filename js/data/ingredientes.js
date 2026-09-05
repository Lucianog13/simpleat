/*
 * SimplEat — Diccionario de gastronomía argentina (Nodo Paraná).
 *
 * "Verdad de tierra" del motor: nomenclatura oficial IPCVA (carnes),
 * INTA (horticultura), GAPA (semáforo nutricional) y estándares
 * regionales de Entre Ríos (pescados de río). Basado en el
 * "Master Source de Gastronomía Argentina 2026" recuperado.
 *
 * Este archivo es SOLO datos. No toca DOM ni localStorage.
 * Formato UMD: sirve para el navegador y para los tests de Node.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.DATOS = factory();
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // Categorías de salud (semáforo nutricional GAPA).
  var SALUD = { VERDE: "verde", AMARILLO: "amarillo", ROJO: "rojo" };

  /*
   * Cada ingrediente:
   *   nombre      -> nombre canónico (nomenclatura oficial)
   *   alias       -> formas en que la gente lo escribe (para el parser)
   *   categoria   -> carne | pescado | verdura | aromatica | lacteo | basico
   *   origen      -> IPCVA | INTA | GAPA | Regional
   *   tecnica     -> instrucción técnica del Master Chef
   *   tiempoBase  -> minutos base de cocción
   *   factorTiempo-> minutos extra por unidad/porción
   *   salud       -> verde | amarillo | rojo
   *   estacional  -> meses del año (1=enero ... 12=diciembre), [] si no aplica
   *   hack        -> tip contextual de CopingChef (opcional)
   *   sustitutos  -> reemplazos de alacena (para CopingChef, opcional)
   */
  var INGREDIENTES = [
    // ── CARNES (IPCVA) ─────────────────────────────────────────────
    {
      nombre: "Asado", alias: ["asado", "costillar", "costillar de asado", "tira de asado"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Cocción lenta a fuego corona; el hueso queda hacia abajo.",
      tiempoBase: 60, factorTiempo: 15, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Vacío", alias: ["vacio", "vacío"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Cocción del lado del cuero primero, hasta dejarlo crocante.",
      tiempoBase: 45, factorTiempo: 12, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Entraña", alias: ["entraña", "entrana"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Vuelta y vuelta (3-4 min por lado) a fuego máximo.",
      tiempoBase: 12, factorTiempo: 3, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Matambre", alias: ["matambre"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Tiernizar antes de la cocción final (maza o marinado).",
      tiempoBase: 40, factorTiempo: 10, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Peceto", alias: ["peceto"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellado rápido; corte magro premium, no sobrecocer.",
      tiempoBase: 25, factorTiempo: 8, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Osobuco", alias: ["osobuco", "osso buco"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Estofado largo (mínimo 2 hs) para liberar el colágeno.",
      tiempoBase: 120, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Tapa de Asado", alias: ["tapa de asado", "tapa de asado"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Horno lento con líquidos para que quede tierna.",
      tiempoBase: 90, factorTiempo: 20, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Nalga", alias: ["nalga"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellar rápido; ideal para milanesas tiernas.",
      tiempoBase: 10, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Bola de Lomo", alias: ["bola de lomo", "bola de lomo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Cocción rápida; alternativa a la nalga para milanesas.",
      tiempoBase: 10, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Lomo", alias: ["lomo", "bife de lomo", "bife"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellado perfecto: sartén muy caliente, sal al final.",
      tiempoBase: 8, factorTiempo: 3, salud: SALUD.VERDE, estacional: [],
      hack: "Sellado perfecto: sartén MUY caliente y no salar antes (la sal saca jugo y enfría la sartén).", sustitutos: []
    },
    {
      nombre: "Chuleta de Cerdo", alias: ["chuleta", "chuleta de cerdo", "cerdo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellar 4 min por lado; reposo obligatorio antes de servir.",
      tiempoBase: 18, factorTiempo: 5, salud: SALUD.AMARILLO, estacional: [],
      hack: "Marinado ácido: limón 30 min antes tierniza las fibras del cerdo.", sustitutos: []
    },
    {
      nombre: "Pata Muslo", alias: ["pata muslo", "pata y muslo", "pata", "muslo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Dorar la piel primero y terminar a fuego medio.",
      tiempoBase: 30, factorTiempo: 8, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Pechuga", alias: ["pechuga", "pollo", "suprema"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Cocción pareja a fuego medio para no secarla.",
      tiempoBase: 15, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Alitas de Pollo", alias: ["alitas", "alitas de pollo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Horno o fritura hasta crocante, con rebozado fino.",
      tiempoBase: 25, factorTiempo: 6, salud: SALUD.AMARILLO, estacional: [],
      hack: "Crocante croto: rebozá con polenta o pan rallado fino, no hace falta harina cara.", sustitutos: []
    },

    // ── PESCADOS DE RÍO (Entre Ríos) ───────────────────────────────
    {
      nombre: "Surubí", alias: ["surubi", "surubí"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Plancha caliente con rodajas de limón; evitar la sobrecocción.",
      tiempoBase: 15, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Pacú", alias: ["pacu", "pacú"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Cocción del lado de la escama; no necesita materia grasa extra.",
      tiempoBase: 20, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Boga", alias: ["boga"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Despinada a la espalda, a la parrilla con provenzal y limón.",
      tiempoBase: 18, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Dorado", alias: ["dorado"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Sellar con manteca y salvia; carne firme.",
      tiempoBase: 14, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Amarillo", alias: ["amarillo", "pati", "patí", "amarillo de rio"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Ideal para chupín o postas fritas.",
      tiempoBase: 25, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },

    // ── HORTICULTURA (INTA) ────────────────────────────────────────
    {
      nombre: "Zapallito de Tronco", alias: ["zapallito de tronco", "zapallito", "zapallitos"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Cocción seca (rehogado rápido) para evitar el exceso de agua; ideal en tortillas y rellenos.",
      tiempoBase: 12, factorTiempo: 3, salud: SALUD.VERDE, estacional: [12, 1, 2, 3],
      hack: "Zero waste: los centros del zapallito van al sofrito de cebolla, no se tiran.", sustitutos: []
    },
    {
      nombre: "Zapallo Anco", alias: ["zapallo anco", "anco", "cabutiá", "cabutia", "calabaza"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Asar con cáscara para concentrar los azúcares.",
      tiempoBase: 35, factorTiempo: 8, salud: SALUD.VERDE, estacional: [3, 4, 5], hack: null, sustitutos: []
    },
    {
      nombre: "Zapallo Plomo", alias: ["zapallo plomo", "zapallo", "zapallo criollo"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Guisos de larga cocción (locro) o dulces.",
      tiempoBase: 40, factorTiempo: 8, salud: SALUD.VERDE, estacional: [6, 7, 8], hack: null, sustitutos: []
    },
    {
      nombre: "Tomate Platense", alias: ["tomate platense", "tomate", "tomates"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Aprovechar su acidez y frescura en crudo o salsa rápida.",
      tiempoBase: 10, factorTiempo: 2, salud: SALUD.VERDE, estacional: [12, 1, 2, 3], hack: null, sustitutos: []
    },
    {
      nombre: "Choclo", alias: ["choclo", "choclo amarillo", "maiz", "maíz"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Hervido técnico (10 min) o grillado.",
      tiempoBase: 10, factorTiempo: 3, salud: SALUD.VERDE, estacional: [12, 1, 2, 3], hack: null, sustitutos: []
    },
    {
      nombre: "Acelga Criolla", alias: ["acelga", "acelga criolla"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Separar pencas de hojas para una cocción uniforme.",
      tiempoBase: 12, factorTiempo: 2, salud: SALUD.VERDE, estacional: [6, 7, 8], hack: null, sustitutos: []
    },
    {
      nombre: "Berenjena", alias: ["berenjena", "berenjenas"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Plancha sin exceso de grasa; salar antes para quitar amargor.",
      tiempoBase: 12, factorTiempo: 3, salud: SALUD.VERDE, estacional: [12, 1, 2, 3], hack: null, sustitutos: []
    },
    {
      nombre: "Papas", alias: ["papa", "papas", "papa rustica", "papas rusticas"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Rústicas: hervir con cáscara, aplastar y dorar al horno.",
      tiempoBase: 20, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },

    // ── AROMÁTICAS Y DE BASE ───────────────────────────────────────
    {
      nombre: "Cebolla Morada", alias: ["cebolla morada", "cebolla colorada"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Caramelización lenta para realzar el dulzor.",
      tiempoBase: 10, factorTiempo: 2, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Cebolla de Verdeo", alias: ["cebolla de verdeo", "verdeo"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Rehogado rápido; la parte verde va al final.",
      tiempoBase: 5, factorTiempo: 1, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Cebolla", alias: ["cebolla", "cebollas"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Rehogar a fuego medio hasta transparentar.",
      tiempoBase: 8, factorTiempo: 2, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Ajo", alias: ["ajo", "ajos", "diente de ajo"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Picar y rehogar para activar el sabor; nunca va entero.",
      tiempoBase: 3, factorTiempo: 1, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Albahaca", alias: ["albahaca"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Emulsionar con ajo y aceite para una emulsión aromática.",
      tiempoBase: 2, factorTiempo: 0, salud: SALUD.VERDE, estacional: [12, 1, 2, 3], hack: null, sustitutos: []
    },

    // ── LÁCTEOS Y BÁSICOS (para CopingChef) ────────────────────────
    {
      nombre: "Parmesano", alias: ["parmesano", "queso parmesano", "reggianito"],
      categoria: "lacteo", origen: "GAPA",
      tecnica: "Rallar fino y agregar al final para no perder aroma.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [],
      hack: null, sustitutos: ["Pan rallado + provenzal (tostado)"]
    },
    {
      nombre: "Crema de Leche", alias: ["crema de leche", "crema", "crema de leche"],
      categoria: "lacteo", origen: "GAPA",
      tecnica: "Agregar a fuego bajo para que no se corte.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [],
      hack: null, sustitutos: ["Leche + manteca (a fuego controlado)"]
    },
    {
      nombre: "Vino Blanco", alias: ["vino blanco", "vino"],
      categoria: "basico", origen: "GAPA",
      tecnica: "Desglasar la sartén para levantar el fondo de cocción.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [],
      hack: null, sustitutos: ["Sidra, o vinagre diluido + una pizca de azúcar"]
    }
  ];

  /*
   * Sustituciones estáticas de CopingChef ("Alacena Survival").
   * Clave = ingrediente que falta, valor = reemplazo croto pero rico.
   */
  var SUSTITUCIONES = {
    "parmesano": "Pan rallado + provenzal tostado",
    "crema de leche": "Leche + manteca (a fuego controlado)",
    "crema": "Leche + manteca (a fuego controlado)",
    "vino blanco": "Sidra, o vinagre diluido + azúcar",
    "vino": "Sidra, o vinagre diluido + azúcar"
  };

  return {
    INGREDIENTES: INGREDIENTES,
    SUSTITUCIONES: SUSTITUCIONES,
    SALUD: SALUD
  };
});
