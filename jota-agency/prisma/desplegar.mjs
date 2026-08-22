#!/usr/bin/env node
/**
 * Aplica las migraciones en el deploy, resolviendo solo el caso del baseline.
 *
 * EL PROBLEMA QUE RESUELVE
 *
 * La base de producción se construyó con `prisma db push`, así que tiene las
 * 30 tablas pero ninguna fila en `_prisma_migrations`. Prisma ve una base con
 * cosas adentro y sin historial, y se planta con P3005. Eso significaba que
 * alguien tenía que correr `prisma migrate resolve --applied 0_init` a mano,
 * con la DATABASE_URL de producción en la terminal, antes del próximo deploy.
 * Un paso manual, que hay que recordar, y que si se olvida rompe el deploy.
 *
 * Este script lo hace solo. Pero NO a ciegas.
 *
 * POR QUÉ ESTO NO ES EL `db push` DE ANTES CON OTRO NOMBRE
 *
 * Lo que se sacó del build fue peligroso porque MODIFICABA EL ESQUEMA sin
 * pedir permiso: podía borrar una columna, y con ella los datos. Este script
 * nunca toca el esquema en el camino del baseline. Lo único que escribe es una
 * fila en `_prisma_migrations` diciendo "0_init ya está aplicada". Es
 * imposible que pierda un dato.
 *
 * Y antes de escribir esa fila, verifica que el esquema real de la base
 * coincida exactamente con el del repositorio. Si no coincide, NO baseliniza y
 * rompe el deploy con un mensaje explícito: una diferencia ahí significa que
 * producción tiene algo que el repo no refleja, y taparlo con un baseline
 * dejaría esa diferencia enterrada para siempre.
 *
 * Los tres caminos posibles:
 *
 *   base vacía             → migrate deploy crea todo desde 0_init
 *   base ya migrada        → migrate deploy no encuentra nada pendiente
 *   base de db push (P3005) → verifica drift, baseliniza, y recién ahí deploya
 */

import { execFileSync } from "node:child_process";

const CORRER = { encoding: "utf8", stdio: "pipe" };

function prisma(args) {
  try {
    return { ok: true, salida: execFileSync("npx", ["prisma", ...args], CORRER) };
  } catch (e) {
    return {
      ok: false,
      // Prisma escribe los errores en stderr y a veces en stdout: se miran los dos.
      salida: `${e.stdout ?? ""}\n${e.stderr ?? ""}`,
      codigo: e.status,
    };
  }
}

function morir(titulo, detalle) {
  console.error(`\n❌ ${titulo}\n`);
  console.error(detalle.trim().split("\n").map((l) => `   ${l}`).join("\n"));
  console.error("");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  morir("Falta DATABASE_URL.", "No se puede aplicar ninguna migración sin saber contra qué base.");
}

console.log("→ Aplicando migraciones…");
let r = prisma(["migrate", "deploy"]);

if (r.ok) {
  console.log(r.salida.trim());
  console.log("✅ Base al día.\n");
  process.exit(0);
}

// P3005: la base tiene tablas pero ningún historial de migraciones. Es el
// único error que este script sabe resolver; cualquier otro se propaga.
if (!/P3005/.test(r.salida)) {
  morir("Las migraciones fallaron.", r.salida);
}

console.log("\n⚠️  La base tiene tablas pero ningún historial de migraciones (P3005).");
console.log("   Es la base creada con `db push`. Verificando antes de registrarla…\n");

// La verificación que hace que esto sea seguro: el esquema real tiene que ser
// idéntico al del repositorio. --exit-code devuelve 2 cuando hay diferencias.
const drift = prisma([
  "migrate", "diff",
  "--from-url", process.env.DATABASE_URL,
  "--to-schema-datamodel", "prisma/schema.prisma",
  "--exit-code",
]);

if (!drift.ok && drift.codigo === 2) {
  morir(
    "La base de producción NO coincide con el esquema del repositorio.",
    "No se baseliniza y el deploy se detiene a propósito.\n\n" +
      "Una diferencia acá significa que la base tiene algo que el código no\n" +
      "refleja. Registrar 0_init como aplicada dejaría esa diferencia enterrada,\n" +
      "y la próxima migración se escribiría sobre una realidad equivocada.\n\n" +
      "Diferencias encontradas:\n" + drift.salida,
  );
}
if (!drift.ok) {
  morir("No se pudo comparar la base con el esquema.", drift.salida);
}

console.log("   ✅ El esquema de la base coincide exactamente con el del repositorio.");

const resolver = prisma(["migrate", "resolve", "--applied", "0_init"]);
if (!resolver.ok) {
  morir("No se pudo registrar 0_init como aplicada.", resolver.salida);
}
console.log("   ✅ 0_init registrada como aplicada (no se tocó ninguna tabla).\n");

console.log("→ Aplicando migraciones pendientes…");
r = prisma(["migrate", "deploy"]);
if (!r.ok) morir("Las migraciones fallaron después del baseline.", r.salida);

console.log(r.salida.trim());
console.log("✅ Base al día.\n");
