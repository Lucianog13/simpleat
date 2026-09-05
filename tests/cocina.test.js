/*
 * Tests del motor de cocción (Master Chef Protocol) de SimplEat.
 * Ejecutar: node --test tests/cocina.test.js
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const DATOS = require(path.join(__dirname, "..", "js", "data", "ingredientes.js"));
const PARSER = require(path.join(__dirname, "..", "js", "core", "parser.js"));
const COCINA = require(path.join(__dirname, "..", "js", "core", "cocina.js"));

test("calcularTiempo suma base + cantidad×factor", function () {
  const items = PARSER.parsearEntrada("2 alitas de pollo", DATOS.INGREDIENTES);
  // alitas: base 25, factor 6; qty 2 → factor 6×0.8 = 4.8 → 25 + 9.6 = 34.6 ≈ 35
  const t = COCINA.calcularTiempo(items);
  assert.ok(t >= 34 && t <= 35, "tiempo esperado ~35, dio " + t);
});

test("filtro rápido se aplica si supera 20 min", function () {
  const r = COCINA.aplicarFiltroRapido(60);
  assert.equal(r.aplicado, true);
  assert.equal(r.tiempo, 42); // 60 × 0.7
  assert.ok(r.notas.length >= 2);
});

test("filtro rápido NO se aplica si es rápido", function () {
  const r = COCINA.aplicarFiltroRapido(15);
  assert.equal(r.aplicado, false);
  assert.equal(r.tiempo, 15);
});

test("semáforo: solo verduras → verde", function () {
  const items = PARSER.parsearEntrada("zapallito con tomate", DATOS.INGREDIENTES);
  assert.equal(COCINA.semaforo(items), "verde");
});

test("semáforo: carne con grasa (asado) → amarillo", function () {
  const items = PARSER.parsearEntrada("asado con papas", DATOS.INGREDIENTES);
  assert.equal(COCINA.semaforo(items), "amarillo");
});

test("generarReceta produce título, pasos y semáforo", function () {
  const items = PARSER.parsearEntrada("asado con papas", DATOS.INGREDIENTES);
  const receta = COCINA.generarReceta(items, 2);
  assert.ok(receta.titulo.length > 0);
  assert.ok(receta.pasos.length >= 2);
  assert.ok(["verde", "amarillo", "rojo"].includes(receta.semaforo));
});

test("nudge estacional en febrero para zapallito", function () {
  const items = PARSER.parsearEntrada("zapallito de tronco", DATOS.INGREDIENTES);
  const receta = COCINA.generarReceta(items, 2); // febrero
  assert.equal(receta.nudge.hay, true);
});

test("asado (cocción lenta) NO se acelera con el filtro rápido", function () {
  const items = PARSER.parsearEntrada("asado con papas", DATOS.INGREDIENTES);
  const receta = COCINA.generarReceta(items, 2);
  assert.equal(receta.cocionLenta, true);
  assert.equal(receta.filtroRapido, false);
  assert.equal(receta.tiempo, receta.tiempoOriginal);
});

test("alitas (cocción rápida) SÍ se acelera", function () {
  const items = PARSER.parsearEntrada("2 alitas de pollo", DATOS.INGREDIENTES);
  const receta = COCINA.generarReceta(items, 2);
  assert.equal(receta.cocionLenta, false);
});
