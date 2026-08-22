/**
 * El widget, probado desde el sitio de un cliente.
 *
 *   CLAVE_WIDGET=pk_... npm run test:widget
 *
 * Lo que verifica no se puede verificar de otra forma: que el widget funcione
 * embebido en OTRO origen, con el CSS de ese sitio peleándole, en una pantalla
 * de celular. Eso no lo prueba ningún test de unidad.
 *
 * Levanta un servidor propio en el puerto 8081 sirviendo pruebas/sitio-externo/,
 * que simula el sitio de un cliente con CSS deliberadamente hostil: un reset a
 * box-sizing content-box, Comic Sans en todos los botones, fondos magenta y
 * bordes punteados con !important. Si el aislamiento del Shadow DOM falla, se
 * ve inmediatamente.
 *
 * Necesita:
 *   · el servidor de JOTA corriendo (npm run dev), por defecto en :3000
 *   · CLAVE_WIDGET: la clave pública de un negocio ACTIVO
 *     (npm run preview:seed la imprime)
 *   · playwright con chromium instalado
 *
 * No corre en CI: necesita dos servidores y un navegador. Se corre a mano
 * antes de mostrarle el widget a un cliente.
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CAPTURAS = join(AQUI, "capturas");
const JOTA = process.env.BASE_URL ?? "http://localhost:3000";
const PUERTO = 8081;
const CLAVE = process.env.CLAVE_WIDGET;

if (!CLAVE) {
  console.error(
    "\n❌ Falta CLAVE_WIDGET.\n\n" +
      "   Es la clave pública de un negocio activo. Para obtener una:\n" +
      "     npm run preview:seed      → imprime CLAVE_WIDGET=pk_...\n\n" +
      "   Después:\n" +
      "     CLAVE_WIDGET=pk_... npm run test:widget\n",
  );
  process.exit(1);
}

// Playwright no es dependencia del proyecto: sumarlo haría que cada `npm ci`
// del CI se baje un navegador para un test que el CI no corre.
let chromium;
try {
  const pw = await import("playwright");
  chromium = (pw.default ?? pw).chromium;
} catch {
  try {
    const pw = await import("/opt/node22/lib/node_modules/playwright/index.js");
    chromium = (pw.default ?? pw).chromium;
  } catch {
    console.error(
      "\n❌ Falta playwright.\n\n" +
        "   npm i -g playwright && npx playwright install chromium\n",
    );
    process.exit(1);
  }
}

// --- Servidor que hace de sitio del cliente, en otro origen ---------------
const HTML = readFileSync(join(AQUI, "sitio-externo", "index.html"), "utf8")
  .replace("__JOTA__", JOTA)
  .replace("CLAVE_PUBLICA", CLAVE);

const servidor = createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.writeHead(204).end();
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(HTML);
});
await new Promise((r) => servidor.listen(PUERTO, r));
const SITIO = `http://localhost:${PUERTO}/`;
mkdirSync(CAPTURAS, { recursive: true });

let fallos = 0;
const ok = (c, m, extra) => {
  console.log(c ? `  ✅ ${m}` : `  ❌ ${m}`);
  if (extra) console.log(`       ${extra}`);
  if (!c) fallos++;
};

console.log(`\n  Sitio del cliente: ${SITIO}`);
console.log(`  Widget servido por: ${JOTA}\n`);

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

for (const v of [
  { nombre: "mobile", ancho: 390, alto: 844, movil: true },
  { nombre: "desktop", ancho: 1280, alto: 800, movil: false },
]) {
  console.log(`━━━ ${v.nombre.toUpperCase()} (${v.ancho}×${v.alto})`);
  const ctx = await navegador.newContext({
    viewport: { width: v.ancho, height: v.alto },
    isMobile: v.movil, hasTouch: v.movil, deviceScaleFactor: v.movil ? 2 : 1,
  });
  const pag = await ctx.newPage();

  const errores = [];
  const fallidos = [];
  pag.on("pageerror", (e) => errores.push(String(e)));
  pag.on("requestfailed", (r) => fallidos.push(r.url()));
  pag.on("response", (r) => { if (r.status() >= 400) fallidos.push(`${r.status()} ${r.url()}`); });
  const pedidos = [];
  pag.on("request", (r) => r.url().includes("/api/agente/") && pedidos.push(r.method() + " " + r.url().split("?")[0]));

  await pag.goto(SITIO, { waitUntil: "networkidle", timeout: 60000 });
  await pag.waitForTimeout(1500);

  // Playwright atraviesa el Shadow DOM solo.
  const lanzador = pag.locator("button.b");
  const panel = pag.locator("div.p");
  const mensajes = pag.locator("div.p .m");
  const caja = pag.locator("div.p textarea");
  const enviar = pag.locator("div.p .f button");

  // --- Montaje ---
  const host = await pag.evaluate(() => {
    const e = [...document.body.children].find((x) => x.shadowRoot);
    return e ? e.tagName.toLowerCase() : null;
  });
  ok(Boolean(host), "el widget se montó en Shadow DOM", host ? `<${host}>` : "no hay host");
  ok(pedidos.some((p) => p.includes("/api/agente/widget")), "el script vino del origen de JOTA (cross-origin)");
  ok(await lanzador.isVisible(), "el botón flotante se ve");
  ok(!(await panel.evaluate((el) => el.classList.contains("on"))), "el panel arranca cerrado");

  // --- No rompió el sitio del cliente ---
  const sitio = await pag.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    boton: Boolean(document.getElementById("boton-propio")?.offsetParent),
  }));
  ok(!sitio.horizontal, "el sitio del cliente no scrollea en horizontal");
  ok(sitio.boton, "el contenido del cliente sigue visible");

  // --- El CSS hostil del cliente no entró al widget ---
  const est = await lanzador.evaluate((b) => {
    const s = getComputedStyle(b);
    return { fuente: s.fontFamily, fondo: s.backgroundColor, borde: s.borderStyle, radio: s.borderRadius };
  });
  ok(!/comic sans/i.test(est.fuente), "la tipografía Comic Sans del cliente no se filtró");
  ok(est.borde !== "dotted", "el borde punteado del cliente no se filtró");
  ok(!/255,\s*0,\s*255/.test(est.fondo), "el fondo magenta del cliente no se filtró", `fondo real: ${est.fondo}`);
  ok(est.radio !== "0px", "el border-radius sobrevivió al reset del cliente", `radio: ${est.radio}`);

  await pag.screenshot({ path: join(CAPTURAS, `widget-${v.nombre}-cerrado.png`) });

  // --- Abrir ---
  await lanzador.click();
  await pag.waitForTimeout(800);
  ok(await panel.evaluate((el) => el.classList.contains("on")), "el panel abre al clickear");
  ok(await caja.isVisible(), "hay un campo para escribir");

  const saludo = (await mensajes.textContent()) ?? "";
  ok(saludo.trim().length > 10, "saluda al abrir", saludo.trim().slice(0, 100));

  const cajaPanel = await panel.boundingBox();
  ok(cajaPanel !== null && cajaPanel.x >= -1 && cajaPanel.x + cajaPanel.width <= v.ancho + 1,
    "el panel entra en la pantalla",
    cajaPanel ? `x=${Math.round(cajaPanel.x)} ancho=${Math.round(cajaPanel.width)} de ${v.ancho}` : "sin caja");

  await pag.screenshot({ path: join(CAPTURAS, `widget-${v.nombre}-abierto.png`) });

  // --- Escribir y enviar, como una persona ---
  await caja.fill("My water heater is leaking in Kihei. Can someone come today?");
  await enviar.click();

  // La condición correcta es que YA NO quede el indicador de "escribiendo":
  // el widget lo borra justo antes de pintar la respuesta. Esperar por "hay 3
  // burbujas" se cumple con el typing presente y se lee el hilo demasiado
  // pronto — es el error que tuvo la primera versión de esta prueba.
  let seColgo = false;
  await pag.waitForFunction(
    () => {
      const h = [...document.body.children].find((x) => x.shadowRoot);
      const m = h?.shadowRoot.querySelector(".m");
      if (!m) return false;
      const hijos = [...m.children];
      return hijos.some((c) => c.className === "u") && !hijos.some((c) => c.className === "t");
    },
    { timeout: 45000 },
  ).catch(() => { seColgo = true; });
  ok(!seColgo, "el widget resolvió el envío dentro de 45s (no quedó colgado)");

  ok(pedidos.some((p) => p.startsWith("POST") && p.includes("/api/agente/chat")),
    "el mensaje salió por POST al chat de JOTA, cross-origin");

  const burbujas = await mensajes.evaluate((m) =>
    [...m.children].map((c) => ({ clase: c.className, texto: (c.textContent || "").trim() })));
  const delUsuario = burbujas.find((b) => b.clase === "u");
  const respuestas = burbujas.filter((b) => b.clase === "a");

  ok(Boolean(delUsuario?.texto.includes("water heater")), "el mensaje enviado se ve en el hilo");
  ok(respuestas.length >= 2, "el agente respondió", `${respuestas.length} burbujas del agente`);
  ok(!burbujas.some((b) => b.clase === "t"), "el indicador de «escribiendo» se limpió");
  ok((respuestas.at(-1)?.texto ?? "").length > 20, "la respuesta tiene contenido",
    (respuestas.at(-1)?.texto ?? "").slice(0, 110));

  await pag.screenshot({ path: join(CAPTURAS, `widget-${v.nombre}-conversando.png`) });

  // --- Cerrar ---
  await pag.locator("div.p .x").click();
  await pag.waitForTimeout(500);
  ok(!(await panel.evaluate((el) => el.classList.contains("on"))), "el panel cierra con la ×");

  // --- Salud de la página ---
  const rotos = fallidos.filter((f) => !/favicon/i.test(f));
  ok(rotos.length === 0, "ningún recurso falló", rotos.slice(0, 3).join(" | "));
  ok(errores.length === 0, "sin errores de JavaScript", errores.slice(0, 2).join(" | "));

  await ctx.close();
  console.log("");
}

await navegador.close();
servidor.close();
console.log(`  Capturas en pruebas/capturas/`);
console.log(fallos === 0 ? `\n✅ el widget funciona en un sitio externo\n` : `\n❌ ${fallos} comprobaciones fallaron\n`);
process.exit(fallos === 0 ? 0 : 1);
