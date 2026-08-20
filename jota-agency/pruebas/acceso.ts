import { destinoSeguro } from "@/lib/destino-seguro";
import { esRutaPublica, RUTAS_PUBLICAS } from "@/lib/rutas-publicas";

/**
 * Control de acceso: qué se sirve sin sesión y a dónde se puede redirigir
 * después del login.
 *
 * Estas dos cosas no se pueden verificar mirando el código de cada ruta —
 * justamente el problema que resuelven es "alguien agregó una ruta y se olvidó
 * del guard". Acá quedan fijadas.
 */

let f = 0;
const ok = (c: boolean, m: string) => { console.log(c ? `  ✅ ${m}` : `  ❌ ${m}`); if (!c) f++; };

console.log("\n1. destinoSeguro — open redirect");
ok(destinoSeguro("//evil.com") === null, "//evil.com se rechaza (el navegador lo resuelve como otro dominio)");
ok(destinoSeguro("///evil.com") === null, "///evil.com se rechaza");
ok(destinoSeguro("/\\evil.com") === null, "/\\evil.com se rechaza (la barra invertida se normaliza a //)");
ok(destinoSeguro("https://evil.com") === null, "una URL absoluta se rechaza");
ok(destinoSeguro("http://evil.com") === null, "http absoluto se rechaza");
ok(destinoSeguro("evil.com") === null, "sin barra inicial se rechaza");
ok(destinoSeguro("") === null, "vacío es null");
ok(destinoSeguro(null) === null, "null es null");
ok(destinoSeguro(undefined) === null, "undefined es null");

console.log("\n2. destinoSeguro — destinos legítimos que NO hay que romper");
ok(destinoSeguro("/ceo") === "/ceo", "/ceo pasa");
ok(destinoSeguro("/ceo/agent/inbox") === "/ceo/agent/inbox", "una subruta profunda pasa");
ok(destinoSeguro("/ceo/agent?tab=leads") === "/ceo/agent?tab=leads", "con query string pasa");
ok(destinoSeguro("/panel") === "/panel", "/panel pasa");

console.log("\n3. Rutas públicas — lo que tiene que entrar sin sesión");
for (const r of ["/", "/acceder", "/acceder/estado", "/diagnostico", "/api/auth/session", "/api/registro", "/api/diagnostico"]) {
  ok(esRutaPublica(r), `${r} es pública`);
}
console.log("  — los canales del agente: el widget los llama desde el sitio del cliente");
for (const r of ["/api/agente/chat", "/api/agente/form", "/api/agente/email", "/api/agente/widget", "/api/agente/cron"]) {
  ok(esRutaPublica(r), `${r} es pública (tiene su propia autenticación)`);
}

console.log("\n4. Rutas privadas — lo que NO puede entrar sin sesión");
for (const r of ["/ceo", "/ceo/agent", "/ceo/agent/inbox", "/ceo/agent/leads", "/panel", "/panel/prospectos", "/api/perfil", "/api/panel/export"]) {
  ok(!esRutaPublica(r), `${r} pide sesión`);
}

console.log("\n5. El prefijo no se puede usar para colarse");
ok(!esRutaPublica("/accederotracosa"), "/accederotracosa NO hereda lo público de /acceder");
ok(!esRutaPublica("/api/agenteX"), "/api/agenteX NO hereda lo público de /api/agente");
ok(!esRutaPublica("/diagnosticos"), "/diagnosticos NO hereda lo público de /diagnostico");
ok(!esRutaPublica("/api/panel"), "/api/panel pide sesión");

console.log("\n6. Cierra por defecto: una ruta nueva nace privada");
for (const r of ["/admin/seo", "/admin/analytics", "/ceo/voz", "/api/voz/llamada", "/api/reportes/semanal", "/cualquier/cosa"]) {
  ok(!esRutaPublica(r), `${r} (que todavía no existe) nace pidiendo sesión`);
}

console.log("\n7. La lista pública es corta y explícita");
ok(RUTAS_PUBLICAS.length <= 10, `${RUTAS_PUBLICAS.length} rutas públicas — si crece mucho, revisar por qué`);
ok(RUTAS_PUBLICAS.every((r) => r.startsWith("/")), "todas empiezan con /");
ok(new Set(RUTAS_PUBLICAS).size === RUTAS_PUBLICAS.length, "sin duplicados");

console.log(f === 0 ? `\n✅ todas las comprobaciones de acceso pasaron\n` : `\n❌ ${f} fallaron\n`);
process.exit(f === 0 ? 0 : 1);
