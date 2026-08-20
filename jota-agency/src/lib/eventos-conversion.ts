"use client";

import { track } from "@vercel/analytics";

/**
 * Eventos de conversión — la fuente de verdad de los nombres.
 *
 * El funnel de analytics del Día 4 se arma contando estos eventos. Si un
 * nombre cambia acá, el histórico del funnel se parte en dos y nadie se entera:
 * el gráfico simplemente muestra una caída. Por eso los nombres viven en un
 * solo lugar, como constantes, y no sueltos en cada onClick.
 *
 * Regla: un evento se emite cuando la cosa PASÓ, no cuando se intentó.
 * `form_submit` va después de que el servidor respondió que sí, no al hacer
 * click en el botón. Un funnel que cuenta intentos como conversiones miente
 * hacia arriba, que es la peor dirección para mentir.
 */

export const EVENTOS = {
  /** Click en cualquier CTA principal. Propiedad `lugar`: dónde estaba. */
  CTA_CLICK: "cta_click",
  /** La persona empezó a escribir en el formulario de registro/acceso. */
  FORM_START: "form_start",
  /** El registro o el login terminaron bien. */
  FORM_SUBMIT: "form_submit",
  /** Se pidió un diagnóstico y el modelo empezó a responder. */
  DIAGNOSTICO_PEDIDO: "diagnostico_pedido",

  // --- Reservados: todavía no se emiten desde ningún lado ---
  // Existen acá para que el Día 3 y el Día 4 usen estos nombres y no inventen
  // otros. Mientras no se emitan, el funnel los muestra en cero, que es la
  // verdad, no un hueco que haya que rellenar.
  /** Se abrió el selector de horarios. Lo emitirá el booking (Día 3). */
  AGENDA_ABIERTA: "agenda_abierta",
  /** Se confirmó una cita. Lo emitirá el booking (Día 3). */
  CITA_RESERVADA: "cita_reservada",
} as const;

/**
 * Lo que NO se mide acá, y por qué.
 *
 * El widget de chat corre en el sitio del CLIENTE, no en jotaagency.org: ahí
 * Vercel Analytics no está cargado y nunca lo va a estar. Las conversaciones,
 * los mensajes y los leads de los negocios se cuentan del lado del servidor,
 * sobre las tablas Conversation / Message / Lead, que es la fuente de verdad
 * real — ya existe en src/lib/agente/metricas.ts.
 *
 * O sea: este módulo mide el embudo de MARKETING de JOTA (visitante → CTA →
 * registro → diagnóstico). El embudo OPERATIVO de cada cliente (consulta →
 * lead → calificado → agendado) sale de la base. El panel del Día 4 tiene que
 * mostrarlos como dos cosas distintas y decir de dónde sale cada número.
 */

export type Evento = (typeof EVENTOS)[keyof typeof EVENTOS];

/**
 * Emite un evento. Nunca rompe la página: si Vercel Analytics no está cargado
 * —bloqueador de anuncios, entorno local, script caído— la conversión igual
 * tiene que suceder. Un fallo de medición no puede costar un lead.
 */
export function medir(evento: Evento, props?: Record<string, string | number | boolean>) {
  try {
    track(evento, props);
  } catch {
    // Silencio a propósito: medir es secundario a que el sitio funcione.
  }
}
