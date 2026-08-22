/**
 * ¿Los emails van a salir de verdad?
 *
 *   npm run check:email
 *
 * Existe porque el modo de falla de Resend es traicionero: la clave puede ser
 * válida, el panel puede decir "proveedor conectado", y aun así los emails no
 * llegan a nadie — porque el dominio no está verificado y Resend solo deja
 * enviar desde onboarding@resend.dev a la casilla dueña de la cuenta.
 *
 * Sin este chequeo eso se descubre cuando un cliente reclama que nunca recibió
 * la confirmación de su cita.
 *
 * No manda ningún email. Solo consulta el estado y lo compara contra la
 * dirección que la aplicación realmente usaría.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));

// .env no se carga solo en Node: se lee a mano, sin dependencias.
function delEnv(clave) {
  if (process.env[clave]?.trim()) return process.env[clave].trim();
  try {
    const txt = readFileSync(join(AQUI, "..", ".env"), "utf8");
    const m = txt.match(new RegExp(`^${clave}\\s*=\\s*(.*)$`, "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
  } catch {
    return "";
  }
}

const bien = (m, extra) => { console.log(`  ✅ ${m}`); if (extra) console.log(`       ${extra}`); };
const mal = (m, extra) => { console.log(`  ❌ ${m}`); if (extra) console.log(`       ${extra}`); };
const ojo = (m, extra) => { console.log(`  ⚠️  ${m}`); if (extra) console.log(`       ${extra}`); };

console.log("\n━━━ ¿Los emails van a salir?\n");

// --- 1. La clave ----------------------------------------------------------
const clave = delEnv("RESEND_API_KEY");
if (!clave) {
  mal("No hay RESEND_API_KEY.",
    "Los emails quedan marcados como «simulados»: se ven en el panel y no salen.\n" +
    "       Generala en resend.com → API Keys y cargala en Vercel.");
  process.exit(1);
}
bien("RESEND_API_KEY presente", `empieza con ${clave.slice(0, 8)}… (${clave.length} caracteres)`);
if (!clave.startsWith("re_")) {
  ojo("No tiene la forma habitual de una clave de Resend (re_…). Puede estar mal copiada.");
}

// --- 2. El dominio que la aplicación usaría -------------------------------
const sitio = delEnv("SITIO_URL") || "https://jotaagency.org";
let host;
try { host = new URL(sitio).hostname; } catch { host = "jotaagency.org"; }
// Mismo criterio que HOST_ID en src/lib/agente/email.ts.
const remitente = `no-reply@${host}`;
console.log(`\n  La aplicación enviaría desde: ${remitente}`);
console.log(`  (derivado de SITIO_URL=${sitio})\n`);

// --- 3. Estado de los dominios en Resend ----------------------------------
let res;
try {
  res = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${clave}` },
  });
} catch (e) {
  mal("No se pudo contactar a api.resend.com", String(e).split("\n")[0]);
  process.exit(1);
}

if (res.status === 401) {
  mal("Resend rechazó la clave (401).", "Está mal copiada, o fue revocada. Generá una nueva.");
  process.exit(1);
}
if (!res.ok) {
  mal(`Resend respondió ${res.status}`, (await res.text()).slice(0, 200));
  process.exit(1);
}
bien("La clave es válida: Resend respondió");

const { data: dominios = [] } = await res.json();

if (dominios.length === 0) {
  mal("No hay ningún dominio cargado en esta cuenta de Resend.",
    "Sin dominio propio, Resend solo permite enviar desde onboarding@resend.dev\n" +
    "       y SOLO a la casilla dueña de la cuenta. Para clientes reales no sirve.\n" +
    `       resend.com → Domains → Add Domain → ${host}`);
  process.exit(1);
}

console.log(`\n  Dominios en la cuenta:\n`);
for (const d of dominios) {
  const v = d.status === "verified";
  console.log(`    ${v ? "✅" : "⏳"} ${d.name.padEnd(28)} ${d.status}`);
}
console.log("");

const elNuestro = dominios.find((d) => d.name === host);

if (!elNuestro) {
  mal(`El dominio ${host} NO está en esta cuenta de Resend.`,
    `La aplicación enviaría desde ${remitente} y Resend lo va a rechazar.\n` +
    `       O agregás ${host} en Resend, o cambiás SITIO_URL a un dominio que sí esté.`);
  process.exit(1);
}

if (elNuestro.status !== "verified") {
  mal(`El dominio ${host} está cargado pero NO verificado (${elNuestro.status}).`,
    "Faltan los registros DNS, o todavía no propagaron.\n" +
    "       En resend.com → Domains → " + host + " están los registros exactos\n" +
    "       (SPF y DKIM) para cargar en tu proveedor de DNS.\n" +
    "       Mientras tanto los emails a clientes NO salen.");
  process.exit(1);
}

bien(`El dominio ${host} está verificado`);
bien(`${remitente} puede enviar a cualquier destinatario`);

console.log("\n✅ Los emails van a salir de verdad.\n");
console.log("   Para confirmarlo con un envío real a tu casilla:");
console.log("     ALLOW_REAL_EMAIL_TEST=true TEST_EMAIL_RECIPIENT=vos@correo.com npm run test:email-real\n");
