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
- **Filtro rápido**: si el tiempo total > 20 min, se aplica ×0.7 con notas de aceleración. *Pendiente de refinar*: hoy también se aplica a cortes de cocción lenta (asado/osobuco) donde no tiene sentido físico.
- **Estacionalidad**: hemisferio sur. Verano [12,1,2,3], invierno [6,7,8] (solo lo que figura en el Master Source).

## Pendiente / roadmap

- [ ] Refinar filtro rápido para que no acelere cocciones lentas (asado, osobuco).
- [ ] Ampliar diccionario (más cortes, verduras, especias).
- [ ] Backend opcional (Supabase + Gemini) cuando haya tracción — el diseño original lo contempla.
- [ ] Modo comercio (B2B): recetas asociadas a los productos de un negocio.
