# SimpleEat

**El chef argentino de tu heladera.** Escribís lo que tenés y SimpleEat te dice **qué cocinar** y **cómo**, con técnica de Master Chef y nomenclatura oficial argentina (IPCVA · INTA · GAPA), más el toque regional de Entre Ríos (Nodo Paraná).

## Qué hace

- **Omnibar** de lenguaje natural: "2 alitas, 1 cebolla morada" → receta profesional.
- **Parser NLP** con matching greedy multi-término y cantidades (números, fracciones y texto).
- **Master Chef Protocol**: matemática de cocción (`T = Base + Cantidad × Factor`), filtro rápido (< 20 min), semáforo nutricional.
- **CopingChef** ("Ingenio Argento"): hacks y reemplazos de alacena cuando falta algo.
- **Estacionalidad**: indicador 🌟 AHORRO y ferias de Paraná.

## Cómo correrla

No necesita build ni servidor. Abrí `index.html` en el navegador (doble clic).

```bash
# o, si preferís un servidor local:
python -m http.server 8000
# → http://localhost:8000
```

## Tests

```bash
node --test tests/parser.test.js tests/cocina.test.js
```

## Estructura

```
index.html            # SPA (Omnibar → receta)
css/style.css         # Estética "Premium Night 2.0"
js/data/ingredientes.js   # Diccionario IPCVA/INTA/GAPA (Master Source)
js/core/parser.js         # Parser NLP (puro)
js/core/cocina.js         # Master Chef Protocol (puro)
js/core/coping.js         # CopingChef (puro)
js/ui/app.js              # Capa DOM
tests/*.test.js           # node:test (lógica pura)
docs/recuperados/         # Documentos originales recuperados
```

## Origen

Reconstruida a partir de los documentos de diseño originales del proyecto (recuperados y preservados en `docs/recuperados/`). El código anterior se perdió; este es el renacimiento, con Git desde el primer commit.
