# SEO y analytics — estado real y pasos manuales

Lo que está hecho en el código, y lo que solo podés hacer vos desde una consola
externa. Nada de esto inventa datos: si un proveedor no está conectado, el
estado dice "no conectado".

---

## Hecho en el código

| Ítem | Estado | Dónde |
|---|---|---|
| `metadataBase` y canonical de la home | ✅ | `src/app/layout.tsx` |
| Canonical propio en rutas privadas | ✅ | `/panel`, `/acceder`, `/acceder/estado`, `/diagnostico` |
| `noindex` en todo lo privado | ✅ | layout de `/ceo` + las 21 páginas |
| `robots.txt` | ✅ | `src/app/robots.ts` — disallow `/panel`, `/ceo`, `/acceder`, `/diagnostico`, `/api/` |
| `sitemap.xml` | ✅ | `src/app/sitemap.ts` — solo la landing (ver nota) |
| Open Graph + Twitter card | ✅ | `src/app/layout.tsx` |
| Imagen de OG | ✅ | `src/app/opengraph-image` |
| Favicon e íconos | ✅ | `src/app/icon.svg`, `public/icono-*.png` |
| JSON-LD de Organization | ✅ | `src/app/layout.tsx` — solo con datos reales |
| Manifest PWA | ✅ | `src/app/manifest.ts` |
| Vercel Web Analytics | ✅ | `<Analytics />` en el layout |
| Eventos de conversión | ✅ | `src/lib/eventos-conversion.ts` |

**Nota sobre el sitemap:** lleva una sola URL. No es un olvido — es la única
página indexable que existe. `/diagnostico` es pública pero tiene `noindex` a
propósito, porque su contenido real está detrás del registro. Listar una URL
con `noindex` en el sitemap le manda a Google dos señales opuestas.

---

## Eventos de conversión: los nombres son contrato

Definidos en `src/lib/eventos-conversion.ts`. **No los renombres**: el funnel
del Día 4 los cuenta, y un cambio de nombre parte el histórico sin avisar — el
gráfico solo muestra una caída.

| Evento | Cuándo se emite | Propiedades |
|---|---|---|
| `cta_click` | Click en un CTA principal | `lugar`: nav · hero · hero_secundario · cierre |
| `form_start` | Primera tecla en el formulario, una sola vez | `tipo`: signup · login |
| `form_submit` | **Después** de que el servidor confirmó | `tipo`: signup · login |
| `diagnostico_pedido` | El servidor aceptó y empieza a responder | `modo`: real · demo |
| `agenda_abierta` | *Reservado* — lo emitirá el booking (Día 3) | — |
| `cita_reservada` | *Reservado* — lo emitirá el booking (Día 3) | — |

Regla: un evento se emite cuando la cosa **pasó**, no cuando se intentó.
`form_submit` va después de la respuesta del servidor, no en el click. Un
funnel que cuenta intentos como conversiones miente hacia arriba.

### Dos embudos distintos, dos fuentes de verdad

- **Embudo de marketing de JOTA** (visitante → CTA → registro → diagnóstico):
  sale de Vercel Analytics, con los eventos de arriba.
- **Embudo operativo de cada cliente** (consulta → lead → calificado →
  agendado): sale de la base, sobre `Conversation` / `Message` / `Lead`, en
  `src/lib/agente/metricas.ts`.

El widget corre en el sitio del cliente, donde Vercel Analytics no está
cargado, así que sus eventos **no pueden** venir de ahí. El panel del Día 4
tiene que mostrar los dos embudos por separado y decir de dónde sale cada
número.

---

## Pasos manuales — los tenés que hacer vos

### 1. Activar Web Analytics en Vercel

El paquete ya está instalado y el componente montado, pero el proyecto no
recolecta nada hasta que lo prendas:

**Vercel → tu proyecto → pestaña Analytics → Enable.**

Plan Hobby: 2.500 eventos por mes. Pro: 25.000.

Hasta que lo prendas, `medir()` es un no-op silencioso — no rompe nada y no
mide nada.

### 2. Google Search Console

1. Entrá a [search.google.com/search-console](https://search.google.com/search-console).
2. **Add property → Domain** → `jotaagency.org`.
3. Verificá con **registro TXT en el DNS** (no con el archivo HTML: el archivo
   se pierde en el próximo deploy si no está en `public/`).
4. Una vez verificado: **Sitemaps → agregar** `https://jotaagency.org/sitemap.xml`.
5. **URL Inspection** sobre `https://jotaagency.org/` → *Request indexing*.

Comprobación de que el bloqueo funciona: inspeccioná
`https://jotaagency.org/ceo`. Tiene que decir *Excluded by robots.txt*. Si dice
otra cosa, avisá.

Search Console tarda entre dos días y dos semanas en mostrar datos. **No hay
forma de acelerarlo**, y hasta entonces el panel SEO del Día 4 va a decir "not
connected" o "sin datos suficientes", que es la verdad.

### 3. Speed Insights (opcional, Core Web Vitals reales)

**Vercel → proyecto → Speed Insights → Enable**, e instalar
`@vercel/speed-insights`. Da LCP, INP y CLS de visitantes reales en vez de
mediciones de laboratorio. Queda para el Día 4, bloque de performance.

---

## Lo que falta y no está hecho

| Ítem | Día |
|---|---|
| Panel SEO en el admin, con checks por URL | 4 |
| Adapter de Search Console (clicks, impresiones, CTR, posición) | 4 |
| Core Web Vitals medidos | 4 |
| Más de una página indexable — páginas por rubro, casos | fuera de los 5 días |
| Metadata segmentada por vertical | fuera de los 5 días |

Hoy el sitio tiene **una sola página indexable y sin contenido de fondo**. Eso
es un techo de SEO que no se rompe con configuración técnica: se rompe
escribiendo páginas que respondan preguntas reales de cada rubro. La parte
técnica ya está lista para cuando existan.
