# Landing 2 — estudio y decisiones

Por qué existe una segunda landing, en qué se diferencia de la primera, y con
qué criterio decidir cuál se queda.

---

## 1. Por qué dos y no un rediseño

Reemplazar la landing actual sería tirar información. No sabemos cuál convierte
mejor porque **la actual nunca se midió**: hasta hace unos días el sitio no
tenía analytics de ningún tipo. Cambiarla a ciegas sería cambiar una incógnita
por otra.

Con las dos vivas:

| | |
|---|---|
| `/` | Sirve la que diga `LANDING_ACTIVA` (por defecto la 1) |
| `/v1` | Siempre la 1 |
| `/v2` | Siempre la 2 |

`/v1` y `/v2` son `noindex` y su canonical apunta a `/`: dos URLs con el mismo
contenido comercial es contenido duplicado, y Google podría quedarse con la de
preview en vez de con la home.

Cambiar cuál se sirve en producción es mover una variable de entorno en Vercel
y volver a deployar. No hay que tocar código ni borrar la otra.

---

## 2. Diagnóstico de la Landing 1

De la auditoría del 31/7 (`.ai-review/jota-agency-auditoria-premium.md`), más lo
que se ve hoy:

**Lo que hace bien:** identidad visual fuerte y coherente, hero memorable, el
diagnóstico con IA en streaming es un gancho genuinamente bueno, y desde el
reposicionamiento de D1-D la oferta está clara.

**Sus límites, para el público que ahora buscamos:**

1. **Lee como agencia creativa, no como proveedor de software.** Fondo oscuro,
   dorado, parallax, tipografía display. Eso funciona vendiendo servicios de
   marca; funciona peor cuando el que decide es el dueño de una PyME de
   servicios evaluando meter software en su operación.
2. **Poca superficie de prueba.** Explica qué hace, pero casi no explica *cómo*.
   Un comprador desconfiado no tiene dónde apoyarse.
3. **No habla de datos ni de seguridad.** Es la primera pregunta de cualquier
   empresa que va a dejar entrar un sistema a hablar con sus clientes, y la
   página no la contesta en ningún lado.
4. **No dice qué NO hace.** Todo suena posible, que es exactamente lo que hace
   sospechar.

---

## 3. Qué significa "empresarial" en la práctica

La consulta a la base de diseño (`ui-ux-pro-max`, patrón *Enterprise Gateway*,
estilo *Exaggerated Minimalism*) devolvió recomendaciones que coinciden con lo
que se observa en el software B2B que se compra:

| Dimensión | Recomendación | Qué se hizo |
|---|---|---|
| Fondo | Claro, alto contraste (`#F8FAFC` / `#0F172A`) | Adoptado |
| Acento | Azul corporativo `#0369A1` | **Rechazado** — ver §4 |
| Tipografía | Plus Jakarta Sans | **Rechazado** — ver §4 |
| Señales de confianza | Prominentes, arriba de todo | Adoptado, pero sin logos falsos |
| CTA | Contactar + iniciar sesión | Adoptado |
| Evitar | Diseño lúdico, credenciales escondidas, degradados violeta de IA | Respetado |

---

## 4. Las dos recomendaciones que no seguí, y por qué

**El azul corporativo.** Adoptarlo hubiera borrado la marca. El dorado es lo
único que hace reconocible a JOTA hoy. Pero el dorado de marca (`#e3b341`)
sobre blanco da **1.8:1** de contraste — ilegible, y falla WCAG por lejos. La
solución fue un dorado profundo (`#8a6a16`) que da **5.06:1**, pasa AA, y sigue
leyéndose como el mismo color de marca. El dorado original se conserva solo
sobre fondos oscuros, donde sí contrasta.

**Plus Jakarta Sans.** Sumar una tercera familia tipográfica significa otra
petición de red y otro archivo que bloquea el renderizado, para una página cuya
métrica principal es la conversión. En su lugar, Landing 2 usa **IBM Plex Sans
para todo**, sin la display de la 1. Es la tipografía corporativa de IBM,
diseñada exactamente para este registro, **ya la carga el layout**, y sin la
display al lado el cambio de tono es completo. Costo: cero.

---

## 5. El problema de fondo: autoridad sin pruebas

Una landing empresarial clásica se apoya en tres cosas: logos de clientes,
testimonios y números de resultados. **JOTA no tiene ninguna de las tres**, y
la regla del proyecto es explícita: no inventar métricas, testimonios, clientes
ni integraciones. En la ronda 4 ya se eliminaron testimonios inventados por ese
motivo.

Así que la autoridad se construyó con lo que sí es verificable:

**1. Precisión en vez de adjetivos.** Cada una de las cuatro funciones tiene un
párrafo de detalle que explica el mecanismo: que la disponibilidad sale de los
horarios menos las citas tomadas, que los reintentos son idempotentes, que el
puntaje guarda sus razones. Un vendedor puede decir "es inteligente"; solo
alguien que lo construyó puede decir cómo funciona.

**2. Una sección entera de seguridad y datos.** Aislamiento por empresa,
cifrado AES-256-GCM, la consulta guardada antes de procesarse, el conocimiento
que entra al modelo como información y nunca como instrucciones, traza de
auditoría, borrado a pedido. Son seis afirmaciones verificables en el código.
Es la sección más "aburrida" de la página y probablemente la que más cierra.

**3. Una sección de "qué NO hace".** Cinco límites reales, dichos antes de que
los pregunten: no inventa precios, no reemplaza al equipo, no genera demanda
nueva, no atiende teléfono todavía, no sincroniza con Google Calendar todavía.
Un proveedor que te dice qué no hace es más creíble que uno que dice que hace
todo. Y evita la conversación incómoda de la tercera semana.

**4. Integraciones con estado honesto.** Lo que está en desarrollo se muestra
con borde punteado y otra etiqueta. Si "en desarrollo" se viera igual que
"disponible", la página estaría vendiendo algo que no está hecho.

**5. El proceso con su control humano.** Las cinco etapas dicen quién trabaja
en cada una, e incluyen explícitamente que el agente arranca supervisado y que
**nunca se activa solo**. Eso responde el miedo real del comprador: que un bot
suelto le diga cualquier cosa a sus clientes.

**Franja de confianza sin logos.** Debajo del hero, donde normalmente van los
logos de clientes, van cuatro hechos del producto. Ocupa el mismo lugar
psicológico sin mentir.

---

## 6. El mecanismo de conversión es el mismo

El bloque de cierre de Landing 2 usa **exactamente los mismos componentes**
(`AuthGate` y `DiagChat`) que la Landing 1. Se exportaron para poder
compartirlos.

Es deliberado: si cada landing tuviera su propio formulario, comparar la
conversión de las dos no mediría el diseño ni el copy — mediría dos
formularios distintos. Con el mecanismo fijo, la diferencia que se observe es
atribuible a lo que efectivamente cambió.

Ese bloque va sobre fondo oscuro, que además es un patrón habitual de cierre en
sitios corporativos y deja entrar el dorado de marca en su versión original.

---

## 7. Verificación

Corrido contra la página real en 390px y 1440px:

| Comprobación | Resultado |
|---|---|
| Contraste de los 7 estilos de texto principales | ✅ Todos ≥ 4.5:1 (títulos ≥ 3:1) |
| Sin scroll horizontal | ✅ |
| Nada se sale del viewport | ✅ |
| Alto táctil mínimo en controles | ✅ tras corregir los botones de idioma |
| Foco de teclado visible | ✅ |
| `prefers-reduced-motion`: todo visible | ✅ |
| Errores de JavaScript | ✅ ninguno |

**Dos bugs encontrados y corregidos durante la verificación:**

1. Los botones de idioma medían 28px de alto, por debajo del mínimo táctil de
   44px. Imposibles de acertar con el pulgar.
2. En pantallas de menos de 620px el CTA del nav se partía en dos líneas,
   rompía la altura fija de la barra y tapaba el selector de idioma. Se oculta
   en móvil: el hero tiene el mismo CTA a un centímetro, así que no se pierde
   ninguna conversión.

---

## 8. Qué medir para decidir

Los eventos de D1-E ya están instrumentados en las dos. Con la 2 activa, mirar:

| Métrica | Evento | Qué diría |
|---|---|---|
| Clicks en CTA / visitantes | `cta_click` | Si el hero convence |
| Formularios empezados / clicks | `form_start` | Si el portón asusta |
| Formularios completados / empezados | `form_submit` | Si la fricción es la misma |
| Diagnósticos pedidos | `diagnostico_pedido` | Conversión de punta a punta |

La propiedad `lugar` distingue de dónde salió cada click (`l2_hero`, `l2_nav`,
`hero`, `cierre`), así que se puede ver qué CTA funciona en cada versión.

**Advertencia sobre la muestra.** Con el tráfico actual, cualquier diferencia
va a tardar semanas en ser algo más que ruido. Correr las dos una semana cada
una y comparar 40 visitas contra 35 no es un resultado. Si hay que decidir
antes, decidir por criterio y no fingir que hay datos.

---

## 9. Lo que le falta a Landing 2

Honestamente, y en orden de impacto:

1. **Pruebas visuales del producto.** Capturas reales del panel serían el
   elemento de autoridad más fuerte que puede tener, y son 100% honestas: es el
   producto que existe. No están todavía.
2. **Un caso real.** Cuando haya un cliente con números, ese bloque reemplaza a
   media página de argumentación.
3. **Contenido de fondo.** Sigue siendo una sola página indexable. El techo de
   SEO no se rompe con configuración: se rompe escribiendo páginas que
   respondan preguntas reales de cada rubro.
4. **Foto o video del equipo.** "Empresarial" también es saber quién está
   atrás. Hoy no hay ninguna cara en el sitio.
