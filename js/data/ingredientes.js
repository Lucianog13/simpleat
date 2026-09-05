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
    },

    // ── CARNES ADICIONALES (IPCVA) ─────────────────────────────────
    {
      nombre: "Bife de Chorizo", alias: ["bife de chorizo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellado fuerte a fuego máximo; jugoso por dentro.",
      tiempoBase: 10, factorTiempo: 3, salud: SALUD.AMARILLO, estacional: [],
      hack: "Sellado perfecto: sartén MUY caliente y sal recién al final.", sustitutos: []
    },
    {
      nombre: "Cuadril", alias: ["cuadril", "colita de cuadril"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Corte magro; sellar rápido y no sobrecocer.",
      tiempoBase: 12, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Bondiola", alias: ["bondiola", "bondiola de cerdo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Horno lento o desmechado; ideal para cocción prolongada.",
      tiempoBase: 60, factorTiempo: 15, salud: SALUD.AMARILLO, estacional: [],
      hack: "Marinado ácido con limón tierniza las fibras antes de hornear.", sustitutos: []
    },
    {
      nombre: "Carré de Cerdo", alias: ["carre", "carré", "carre de cerdo"],
      categoria: "carne", origen: "IPCVA",
      tecnica: "Sellar la superficie y terminar al horno; reposo obligatorio.",
      tiempoBase: 35, factorTiempo: 8, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },

    // ── PESCADOS ADICIONALES ───────────────────────────────────────
    {
      nombre: "Merluza", alias: ["merluza", "filet de merluza"],
      categoria: "pescado", origen: "Regional",
      tecnica: "Plancha o sartén con limón; cocción breve para no secarla.",
      tiempoBase: 12, factorTiempo: 3, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Sábalo", alias: ["sabalo", "sábalo"],
      categoria: "pescado", origen: "Regional",
      tecnica: "A la parrilla o frito; carne sabrosa de río.",
      tiempoBase: 15, factorTiempo: 4, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },

    // ── HORTICULTURA ADICIONAL (INTA) ──────────────────────────────
    {
      nombre: "Zanahoria", alias: ["zanahoria", "zanahorias"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Hervir, dorar o rallar en crudo según el plato.",
      tiempoBase: 12, factorTiempo: 2, salud: SALUD.VERDE, estacional: [1, 2, 3, 4, 5], hack: null, sustitutos: []
    },
    {
      nombre: "Morrón", alias: ["morron", "morrón", "pimiento"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Asar y pelar para realzar el dulzor; o saltear en tiras.",
      tiempoBase: 15, factorTiempo: 3, salud: SALUD.VERDE, estacional: [12, 1, 2, 3], hack: null, sustitutos: []
    },
    {
      nombre: "Espinaca", alias: ["espinaca"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Salteado rápido con ajo; apenas se reduce su volumen.",
      tiempoBase: 5, factorTiempo: 1, salud: SALUD.VERDE, estacional: [6, 7, 8, 9], hack: null, sustitutos: []
    },
    {
      nombre: "Lechuga", alias: ["lechuga"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Consumo en crudo; lavar y secar bien antes de usar.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Remolacha", alias: ["remolacha", "remolachas"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Hervir hasta tierna (piel se desprende sola) o al horno.",
      tiempoBase: 40, factorTiempo: 10, salud: SALUD.VERDE, estacional: [6, 7, 8], hack: null, sustitutos: []
    },
    {
      nombre: "Brócoli", alias: ["brocoli", "brócoli"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Al vapor 5 min para conservar color y crocancia.",
      tiempoBase: 8, factorTiempo: 2, salud: SALUD.VERDE, estacional: [4, 5, 6, 7, 8, 9], hack: null, sustitutos: []
    },
    {
      nombre: "Batata", alias: ["batata", "batatas", "boniato"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Al horno con cáscara o hervida para puré.",
      tiempoBase: 25, factorTiempo: 5, salud: SALUD.VERDE, estacional: [3, 4, 5, 6], hack: null, sustitutos: []
    },
    {
      nombre: "Repollo", alias: ["repollo"],
      categoria: "verdura", origen: "INTA",
      tecnica: "Salteado en juliana o en guisos; soporta cocción media.",
      tiempoBase: 10, factorTiempo: 3, salud: SALUD.VERDE, estacional: [6, 7, 8], hack: null, sustitutos: []
    },

    // ── AROMÁTICAS ADICIONALES ─────────────────────────────────────
    {
      nombre: "Perejil", alias: ["perejil"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Picar fino y agregar al final para no perder frescura.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Romero", alias: ["romero"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Con carnes y papas; resiste cocciones largas.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Orégano", alias: ["oregano", "orégano"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Seco o fresco; va al final de salsas y carnes.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Limón", alias: ["limon", "limón"],
      categoria: "aromatica", origen: "INTA",
      tecnica: "Jugo y ralladura; el ácido realza y tierniza.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: "El ácido del limón tierniza carnes y pescados si los dejás 20 min.", sustitutos: []
    },

    // ── BÁSICOS DE ALACENA ─────────────────────────────────────────
    {
      nombre: "Huevo", alias: ["huevo", "huevos"],
      categoria: "basico", origen: "INTA",
      tecnica: "Duro (8 min), revuelto a fuego bajo, o a la plancha.",
      tiempoBase: 8, factorTiempo: 2, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Arroz", alias: ["arroz"],
      categoria: "basico", origen: "INTA",
      tecnica: "Dos partes de agua por una de arroz; reposar tapado.",
      tiempoBase: 15, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Fideos", alias: ["fideos", "pasta", "tallarines", "spaghetti"],
      categoria: "basico", origen: "INTA",
      tecnica: "Hervir en abundante agua con sal hasta al dente.",
      tiempoBase: 10, factorTiempo: 3, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Lentejas", alias: ["lentejas", "lenteja"],
      categoria: "basico", origen: "INTA",
      tecnica: "Guiso de cocción media; remojar no es obligatorio.",
      tiempoBase: 25, factorTiempo: 5, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Queso Cremoso", alias: ["queso cremoso", "queso", "queso fresco"],
      categoria: "lacteo", origen: "GAPA",
      tecnica: "Agregar al final; se funde con calor suave.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [], hack: null, sustitutos: []
    },
    {
      nombre: "Manteca", alias: ["manteca"],
      categoria: "lacteo", origen: "GAPA",
      tecnica: "Para dorar y dar sabor; no quemarla (fuego medio).",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.AMARILLO, estacional: [],
      hack: null, sustitutos: ["Aceite de oliva (más saludable)"]
    },
    {
      nombre: "Aceite de Oliva", alias: ["aceite de oliva", "aceite", "oliva"],
      categoria: "basico", origen: "GAPA",
      tecnica: "En crudo para aliños; para cocinar a fuego medio.",
      tiempoBase: 0, factorTiempo: 0, salud: SALUD.VERDE, estacional: [], hack: null, sustitutos: []
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
