/*
 * Tests del parser NLP de SimplEat.
 * Ejecutar: node --test tests/parser.test.js
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const DATOS = require(path.join(__dirname, "..", "js", "data", "ingredientes.js"));
const PARSER = require(path.join(__dirname, "..", "js", "core", "parser.js"));

function nombres(items) {
  return items.filter(function (i) { return !i.generico; })
    .map(function (i) { return i.ingrediente.nombre; });
}

test("asado con papas detecta Asado y Papas", function () {
  const items = PARSER.parsearEntrada("asado con papas", DATOS.INGREDIENTES);
  assert.ok(nombres(items).includes("Asado"), "debe detectar Asado");
  assert.ok(nombres(items).includes("Papas"), "debe detectar Papas");
});

test("cantidades: 2 alitas y 1 cebolla", function () {
  const items = PARSER.parsearEntrada("2 alitas de pollo con 1 cebolla", DATOS.INGREDIENTES);
  const alitas = items.find(function (i) { return i.ingrediente && i.ingrediente.nombre === "Alitas de Pollo"; });
  const cebolla = items.find(function (i) { return i.ingrediente && i.ingrediente.nombre === "Cebolla"; });
  assert.ok(alitas, "debe encontrar alitas");
  assert.ok(cebolla, "debe encontrar cebolla");
  assert.equal(alitas.cantidad, 2);
  assert.equal(cebolla.cantidad, 1);
});

test("greedy: 'zapallito de tronco' gana sobre 'zapallito'", function () {
  const items = PARSER.parsearEntrada("zapallito de tronco", DATOS.INGREDIENTES);
  assert.ok(nombres(items).includes("Zapallito de Tronco"), "debe matchear el término largo");
  assert.ok(!nombres(items).includes("Zapallo Plomo"), "no debe confundir con zapallo");
});

test("cantidad en texto: 'dos cebollas'", function () {
  const items = PARSER.parsearEntrada("dos cebollas moradas", DATOS.INGREDIENTES);
  const cebolla = items.find(function (i) { return i.ingrediente && i.ingrediente.nombre === "Cebolla Morada"; });
  assert.ok(cebolla, "debe detectar cebolla morada");
  assert.equal(cebolla.cantidad, 2);
});

test("ingrediente desconocido se conserva como genérico", function () {
  const items = PARSER.parsearEntrada("pollo con queso azul", DATOS.INGREDIENTES);
  const genericos = items.filter(function (i) { return i.generico; });
  assert.ok(genericos.length > 0, "debe conservar el ingrediente desconocido");
});

test("no duplica el 'un' dentro de 'un kilo'", function () {
  const items = PARSER.parsearEntrada("un kilo de asado", DATOS.INGREDIENTES);
  const asado = items.find(function (i) { return i.ingrediente && i.ingrediente.nombre === "Asado"; });
  assert.ok(asado, "debe detectar asado");
  assert.equal(asado.cantidad, 1);
});
