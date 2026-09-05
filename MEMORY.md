# MEMORY — SimpleEat

Notas de arquitectura y decisiones para que cualquier sesión futura se auto-bootstrapee sin releer todo.

## Qué es

Asistente de cocina argentino ("tecnología invisible"). Omnibar → receta técnica con nomenclatura oficial (IPCVA carnes, INTA horticultura, GAPA semáforo) + regional Entre Ríos (Nodo Paraná).

## Arquitectura

- **Sin build, sin dependencias.** `index.html` + CSS + JS vanilla (UMD), corre con doble clic y en GitHub Pages.
- **Separación estricta:**
  - `js/data/` — SOLO datos (diccionario de ingredientes).
  - `js/core/` — lógica pura (sin DOM, sin localStorage). Testeable con node:test.
  - `js/ui/` — SOLO DOM (render + eventos).
- **Patrón UMD** en todos los `.js`: `(function(root,factory){ if(module.exports) module.exports=factory(); else root.X=factory(); })(...)`. Así un archivo sirve para navegador y Node.

## Modelo de datos (ingrediente)

```
nombre, alias[], categoria (carne|pescado|verdura|aromatica|lacteo|basico),
origen (IPCVA|INTA|GAPA|Regional), tecnica, tiempoBase, factorTiempo,
salud (verde|amarillo|rojo), estacional[] (meses 1-12), hack, sustitutos[]
```

## Decisiones

- **Todo en español**: nombres de variables, comentarios, UI, docs (requisito del dueño).
- **Parser greedy**: índice de términos (nombre + alias + plural) ordenado por longitud desc; match largo primero, luego se "tacha" del string.
- **Plurales**: el índice genera la forma plural de cada término automáticamente (`pluralizarTermino`).
- **Filtro rápido**: si el tiempo total > 20 min, ×0.7 con notas. NO se aplica a cocciones lentas (`tiempoBase >= 45`: asado, osobuco, bondiola, tapa).
- **Estacionalidad**: hemisferio sur. Verano [12,1,2,3], invierno [6,7,8].
- **Cámara/foto**: botón 📷 captura → redimensiona a 512px (canvas) → `POST http://localhost:11434/api/generate` (Ollama + llava-phi3) → lista de ingredientes → auto-cocina. Requiere `OLLAMA_ORIGINS="*"` (ya seteado con `setx` y relanzado el serve). Solo funciona en local; en Pages no hay Ollama del visitante.

## Pendiente / roadmap

- [x] Refinar filtro rápido (no acelera cocciones lentas).
- [x] Ampliar diccionario (58 ingredientes).
- [x] Cámara/foto con reconocimiento local (Ollama + llava-phi3).
- [ ] Reconocimiento de foto en producción: API de visión (Gemini/OpenAI) detrás de backend (Supabase Edge Function) — hoy la app estática no puede guardar una key.
- [ ] Modo comercio (B2B): recetas asociadas a los productos de un negocio.
