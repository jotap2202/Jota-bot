import type { Idioma } from "./contenido";

/**
 * Contenido de la Landing 2 — la versión corporativa.
 *
 * La diferencia con la 1 no es solo visual. La 1 vende con tono de agencia
 * boutique: promesa amplia, pocas pruebas, mucho clima. La 2 vende como un
 * proveedor de software a una empresa: mecanismo explícito, datos, seguridad,
 * y una lista clara de qué hace y qué no.
 *
 * REGLA QUE NO SE ROMPE: acá no hay ni un cliente inventado, ni un logo que no
 * sea real, ni una métrica de resultados que no se pueda demostrar. Una página
 * "empresarial" clásica se apoya en logos y testimonios, y todavía no hay.
 *
 * La autoridad se construye con lo que sí es verificable:
 *   · el mecanismo, explicado con precisión en vez de con adjetivos
 *   · cómo se tratan los datos, que es lo que un negocio serio pregunta
 *   · qué NO hace el sistema, dicho antes de que lo pregunten
 *   · el proceso de implementación, paso por paso, con su gate humano
 *
 * Un proveedor que te dice qué no hace es más creíble que uno que dice que
 * hace todo.
 */

export type Contenido2 = {
  barra: { nota: string; contacto: string };
  nav: { sistema: string; proceso: string; seguridad: string; faq: string; entrar: string; cta: string };
  hero: {
    eyebrow: string;
    titulo: string;
    resaltado: string;
    sub: string;
    cta: string;
    cta2: string;
    pie: string;
  };
  /** Hechos verificables del producto. No son logos ni testimonios. */
  confianza: { texto: string }[];
  problema: {
    cap: string;
    titulo: string;
    texto: string;
    puntos: { titulo: string; desc: string }[];
    fuente: string;
  };
  sistema: {
    cap: string;
    titulo: string;
    sub: string;
    piezas: { nombre: string; desc: string; detalle: string }[];
  };
  proceso: {
    cap: string;
    titulo: string;
    sub: string;
    pasos: { n: string; titulo: string; desc: string; quien: string }[];
  };
  seguridad: {
    cap: string;
    titulo: string;
    sub: string;
    items: { titulo: string; desc: string }[];
  };
  limites: { cap: string; titulo: string; sub: string; items: string[] };
  integraciones: {
    cap: string;
    titulo: string;
    listo: string;
    pronto: string;
    items: { nombre: string; estado: "listo" | "pronto" }[];
  };
  incluye: {
    cap: string;
    titulo: string;
    sub: string;
    columnas: { titulo: string; items: string[] }[];
    nota: string;
  };
  faq: { cap: string; titulo: string; items: { p: string; r: string }[] };
  cierre: { titulo: string; sub: string; cta: string; nota: string };
  pie: { descripcion: string; secciones: { titulo: string; links: { texto: string; href: string }[] }[]; legal: string };
};

export const T2: Record<Idioma, Contenido2> = {
  es: {
    barra: {
      nota: "Implementación en días, no en meses",
      contacto: "Hablar con nosotros",
    },
    nav: {
      sistema: "El sistema",
      proceso: "Implementación",
      seguridad: "Seguridad",
      faq: "Preguntas",
      entrar: "Entrar",
      cta: "Pedir diagnóstico",
    },
    hero: {
      eyebrow: "JOTA Revenue Engine",
      titulo: "Toda consulta atendida.",
      resaltado: "Ninguna se pierde.",
      sub: "Un sistema que responde, califica, agenda y hace seguimiento de cada persona que contacta a tu empresa — a cualquier hora, en tu web, tus formularios y tu casilla de correo.",
      cta: "Pedir un diagnóstico",
      cta2: "Ver cómo funciona",
      pie: "El diagnóstico es gratuito y no compromete a nada.",
    },
    confianza: [
      { texto: "La consulta se guarda antes de procesarse" },
      { texto: "Datos aislados por empresa" },
      { texto: "Credenciales cifradas AES-256-GCM" },
      { texto: "No se activa sin tu aprobación" },
    ],
    problema: {
      cap: "El problema",
      titulo: "La demanda que ya tenés se está enfriando sola",
      texto:
        "La mayoría de las empresas de servicios no pierde clientes por precio ni por calidad. Los pierde en las horas que pasan entre que alguien pregunta y alguien contesta.",
      puntos: [
        { titulo: "Fuera de horario", desc: "La consulta de un sábado a la noche espera hasta el lunes. Para entonces ya llamó a otro." },
        { titulo: "Formularios sin respuesta", desc: "El formulario de contacto manda un email que se mezcla con el resto de la casilla." },
        { titulo: "Seguimiento que no ocurre", desc: "El interesado que no contestó la primera vez no vuelve a ser contactado nunca." },
        { titulo: "Sin registro", desc: "Nadie sabe cuántas consultas entraron el mes pasado ni cuántas terminaron en un trabajo." },
      ],
      fuente:
        "La investigación sobre tiempo de respuesta en ventas B2B es consistente en un punto: responder primero es el factor con más peso en quién se queda con el cliente.",
    },
    sistema: {
      cap: "El sistema",
      titulo: "Qué hace, con precisión",
      sub: "Cuatro funciones, en este orden, para cada persona que contacta a tu empresa.",
      piezas: [
        {
          nombre: "Responde",
          desc: "Contesta en segundos, a cualquier hora, con la información de tu negocio.",
          detalle:
            "Chat en tu sitio, formularios y email entrante entran al mismo sistema. Responde únicamente con lo que vos cargaste: servicios, zonas, horarios, políticas y preguntas frecuentes. Lo que no está cargado, no lo afirma.",
        },
        {
          nombre: "Califica",
          desc: "Averigua qué necesita cada persona y le asigna un puntaje explicable.",
          detalle:
            "Extrae servicio, ubicación, urgencia y datos de contacto solo cuando la persona los escribió. El puntaje guarda las razones que lo justifican, así que se puede auditar por qué un lead quedó alto o bajo.",
        },
        {
          nombre: "Agenda",
          desc: "Ofrece horarios reales y confirma la reunión.",
          detalle:
            "La disponibilidad sale de los horarios de tu negocio menos las citas ya tomadas. Nunca confirma una reserva que no se creó: si el paso falla, deriva a una persona en vez de decir que está agendado.",
        },
        {
          nombre: "Hace seguimiento",
          desc: "Insiste con criterio y se detiene cuando corresponde.",
          detalle:
            "Secuencia configurable para quien no respondió. Se corta sola cuando la persona contesta, agenda, o pide no ser contactada. Los reintentos son idempotentes: un trabajo repetido no manda el mensaje dos veces.",
        },
      ],
    },
    proceso: {
      cap: "Implementación",
      titulo: "Cinco etapas, con un control humano antes de salir en vivo",
      sub: "Trabajás en la primera y en la cuarta. El resto es nuestro.",
      pasos: [
        { n: "01", titulo: "Diagnóstico", desc: "Revisamos por dónde se están escapando consultas hoy: horarios sin cubrir, formularios sin responder, seguimiento que no ocurre. Te entregamos el análisis, sin compromiso.", quien: "Nosotros · 1 reunión" },
        { n: "02", titulo: "Carga de conocimiento", desc: "Cargamos servicios, zonas, horarios, políticas, precios que puede mencionar y preguntas frecuentes. El agente solo puede afirmar lo que queda acá.", quien: "Vos aportás la información" },
        { n: "03", titulo: "Pruebas", desc: "Corremos casos reales de tu negocio contra el agente antes de que hable con nadie. Los resultados se revisan uno por uno.", quien: "Nosotros" },
        { n: "04", titulo: "Aprobación y salida en vivo", desc: "Arranca en modo supervisado: vos revisás cada respuesta antes de que salga. Cuando te convence, se activa. Nunca se activa solo.", quien: "Vos aprobás" },
        { n: "05", titulo: "Optimización", desc: "Reporte con las consultas que entraron, las que se agendaron y las preguntas que el agente no supo responder. Eso es lo que se usa para ajustar el conocimiento.", quien: "Nosotros · continuo" },
      ],
    },
    seguridad: {
      cap: "Seguridad y datos",
      titulo: "Cómo se tratan los datos de tus clientes",
      sub: "Es la pregunta que hace cualquier empresa seria antes de firmar. Estas son las respuestas.",
      items: [
        { titulo: "Aislamiento por empresa", desc: "Cada negocio tiene sus datos separados a nivel de base, con el identificador de empresa obligatorio en cada consulta. Hay pruebas automatizadas que verifican que un negocio no pueda leer los datos de otro." },
        { titulo: "Credenciales cifradas", desc: "Cualquier credencial que cargues se guarda cifrada con AES-256-GCM. No se muestra en texto plano en ningún lado, ni siquiera en el panel." },
        { titulo: "Nada se pierde antes de procesarse", desc: "La consulta se guarda apenas entra, antes de que la procese el modelo. Si algo falla después, queda registrada y un proceso de recuperación la levanta." },
        { titulo: "El agente no inventa", desc: "El conocimiento entra al modelo delimitado y etiquetado como información, nunca como instrucciones. Los datos del lead se aceptan solo si aparecen textualmente en lo que escribió la persona." },
        { titulo: "Traza completa", desc: "Cada acción queda en un registro de auditoría: quién hizo qué, sobre qué, y cuándo. Los errores van a una cola de la que se pueden reintentar." },
        { titulo: "Borrado a pedido", desc: "Si una persona pide que borres sus datos, hay una función para hacerlo sobre todos sus registros." },
      ],
    },
    limites: {
      cap: "Alcance",
      titulo: "Qué NO hace",
      sub: "Preferimos decirlo ahora y no en la tercera semana.",
      items: [
        "No inventa precios. Si no cargaste una lista, tiene prohibido hablar de precios.",
        "No reemplaza a tu equipo: se ocupa del primer contacto y deriva cuando hace falta una persona.",
        "No genera demanda nueva por sí solo. Responde y convierte la que ya te llega.",
        "No atiende llamadas telefónicas todavía. Chat, formularios y email.",
        "No se sincroniza con Google Calendar todavía: la disponibilidad sale de los horarios que cargues.",
      ],
    },
    integraciones: {
      cap: "Integraciones",
      titulo: "Se instala sobre lo que ya tenés",
      listo: "Disponible",
      pronto: "En desarrollo",
      items: [
        { nombre: "Sitio web (una línea de código)", estado: "listo" },
        { nombre: "Formularios de contacto", estado: "listo" },
        { nombre: "Email entrante", estado: "listo" },
        { nombre: "Avisos al equipo", estado: "listo" },
        { nombre: "Webhooks salientes", estado: "listo" },
        { nombre: "Google Calendar", estado: "pronto" },
        { nombre: "CRM externo", estado: "pronto" },
        { nombre: "Atención telefónica", estado: "pronto" },
      ],
    },
    incluye: {
      cap: "El servicio",
      titulo: "Qué incluye",
      sub: "El precio se define en el diagnóstico, según volumen de consultas y canales conectados.",
      columnas: [
        {
          titulo: "Implementación",
          items: [
            "Diagnóstico de dónde se pierden consultas",
            "Carga de tu base de conocimiento",
            "Configuración de reglas de calificación",
            "Pruebas con casos reales de tu negocio",
            "Instalación en tu sitio",
          ],
        },
        {
          titulo: "Operación mensual",
          items: [
            "Atención de consultas en todos los canales conectados",
            "Calificación y seguimiento automático",
            "Panel con conversaciones, leads y citas",
            "Avisos a tu equipo cuando entra un lead bueno",
            "Reporte periódico de lo que entró y lo que se convirtió",
          ],
        },
        {
          titulo: "Soporte",
          items: [
            "Ajustes de la base de conocimiento",
            "Revisión de las preguntas que no supo responder",
            "Monitoreo del estado de las integraciones",
            "Un canal directo, sin sistema de tickets",
          ],
        },
      ],
      nota: "Sin porcentaje sobre tus ventas. Costo de implementación y mensualidad, definidos antes de empezar.",
    },
    faq: {
      cap: "Preguntas frecuentes",
      titulo: "Lo que se pregunta antes de contratar",
      items: [
        {
          p: "¿Cuánto cuesta?",
          r: "Depende del volumen de consultas y de cuántos canales conectes. Se define en el diagnóstico, que es gratuito. Lo que sí podemos anticipar: hay un costo de implementación y una mensualidad, y no cobramos porcentaje sobre tus ventas.",
        },
        {
          p: "¿Cuánto tarda la implementación?",
          r: "Días, no meses. Nuestra parte es rápida; el tiempo lo marca la tuya. Necesitamos servicios, zonas, horarios, políticas y unas diez preguntas frecuentes con sus respuestas reales. Con eso en mano, se instala y se prueba dentro de la misma semana.",
        },
        {
          p: "¿Qué pasa si el agente no sabe algo?",
          r: "Lo dice y deriva a una persona de tu equipo con la conversación completa. Solo puede afirmar lo que está cargado en tu base de conocimiento; todo lo demás va a un humano. Es el comportamiento correcto, no una falla.",
        },
        {
          p: "¿Puedo intervenir en una conversación?",
          r: "Sí. Desde el panel ves cada conversación en vivo. Podés responder vos, pausar la IA en ese hilo, o asignárselo a alguien del equipo. El control es tuyo en todo momento.",
        },
        {
          p: "¿Los datos de mis clientes quedan mezclados con los de otras empresas?",
          r: "No. Cada empresa tiene sus datos aislados a nivel de base de datos, con el identificador de empresa obligatorio en cada consulta, y hay pruebas automatizadas que verifican ese aislamiento.",
        },
        {
          p: "¿Hay que cambiar la web o el CRM?",
          r: "No. Es una línea de código en tu sitio, funcione con lo que funcione. Tus formularios y tu casilla de consultas entran al mismo sistema sin modificarlos.",
        },
        {
          p: "¿El cliente sabe que habla con una IA?",
          r: "Sí. El widget lo dice explícitamente y el agente no miente si se lo preguntan. Ocultarlo sería un problema de confianza, y en varias jurisdicciones también un problema legal.",
        },
        {
          p: "¿Qué pasa si quiero dar de baja el servicio?",
          r: "La base de conocimiento que construimos es tuya y te la llevás. Las condiciones de permanencia y de baja se dejan por escrito en el documento de alcance, antes de empezar.",
        },
      ],
    },
    cierre: {
      titulo: "Empecemos por medir cuánto se está perdiendo",
      sub: "El diagnóstico revisa tus canales de entrada y te muestra dónde se enfría la demanda que ya tenés. Es gratuito y no compromete a nada.",
      cta: "Pedir el diagnóstico",
      nota: "Respondemos el mismo día, en español o inglés.",
    },
    pie: {
      descripcion:
        "JOTA Revenue Engine. Un sistema que responde, califica, agenda y hace seguimiento de cada consulta que recibe tu empresa.",
      secciones: [
        {
          titulo: "Producto",
          links: [
            { texto: "El sistema", href: "#sistema" },
            { texto: "Implementación", href: "#proceso" },
            { texto: "Integraciones", href: "#integraciones" },
            { texto: "Qué incluye", href: "#incluye" },
          ],
        },
        {
          titulo: "Confianza",
          links: [
            { texto: "Seguridad y datos", href: "#seguridad" },
            { texto: "Qué no hace", href: "#limites" },
            { texto: "Preguntas frecuentes", href: "#faq" },
          ],
        },
        {
          titulo: "Empresa",
          links: [
            { texto: "Pedir diagnóstico", href: "#cierre" },
            { texto: "La app", href: "/app" },
            { texto: "Entrar al panel", href: "/acceder" },
          ],
        },
      ],
      legal: "JOTA agency · Maui, Hawái · Español / English",
    },
  },

  en: {
    barra: {
      nota: "Implementation in days, not months",
      contacto: "Talk to us",
    },
    nav: {
      sistema: "The system",
      proceso: "Implementation",
      seguridad: "Security",
      faq: "FAQ",
      entrar: "Sign in",
      cta: "Get a diagnosis",
    },
    hero: {
      eyebrow: "JOTA Revenue Engine",
      titulo: "Every inquiry answered.",
      resaltado: "None of them lost.",
      sub: "A system that answers, qualifies, books and follows up with everyone who contacts your business — at any hour, on your site, your forms and your inbox.",
      cta: "Get a diagnosis",
      cta2: "See how it works",
      pie: "The diagnosis is free and commits you to nothing.",
    },
    confianza: [
      { texto: "Inquiries stored before they are processed" },
      { texto: "Data isolated per business" },
      { texto: "Credentials encrypted with AES-256-GCM" },
      { texto: "Never goes live without your approval" },
    ],
    problema: {
      cap: "The problem",
      titulo: "The demand you already have is going cold on its own",
      texto:
        "Most service businesses don't lose clients on price or on quality. They lose them in the hours between someone asking and someone answering.",
      puntos: [
        { titulo: "After hours", desc: "A Saturday-night inquiry waits until Monday. By then they've already called someone else." },
        { titulo: "Forms with no reply", desc: "The contact form sends an email that gets buried with everything else in the inbox." },
        { titulo: "Follow-up that never happens", desc: "The prospect who didn't reply the first time is never contacted again." },
        { titulo: "No record", desc: "Nobody knows how many inquiries came in last month, or how many turned into work." },
      ],
      fuente:
        "Research on response time in B2B sales is consistent on one point: answering first is the single heaviest factor in who wins the client.",
    },
    sistema: {
      cap: "The system",
      titulo: "What it does, precisely",
      sub: "Four functions, in this order, for everyone who contacts your business.",
      piezas: [
        {
          nombre: "Answers",
          desc: "Replies within seconds, at any hour, with your business information.",
          detalle:
            "Chat on your site, forms and inbound email all enter the same system. It replies only with what you loaded: services, areas, hours, policies and FAQs. What isn't loaded, it doesn't claim.",
        },
        {
          nombre: "Qualifies",
          desc: "Finds out what each person needs and assigns an explainable score.",
          detalle:
            "It extracts service, location, urgency and contact details only when the person actually wrote them. The score stores the reasons behind it, so you can audit why a lead scored high or low.",
        },
        {
          nombre: "Books",
          desc: "Offers real slots and confirms the meeting.",
          detalle:
            "Availability comes from your business hours minus appointments already taken. It never confirms a booking that wasn't created: if that step fails, it hands off to a person instead of claiming it's booked.",
        },
        {
          nombre: "Follows up",
          desc: "Persists with judgment and stops when it should.",
          detalle:
            "Configurable sequence for those who didn't reply. It stops on its own when the person answers, books, or asks not to be contacted. Retries are idempotent: a repeated job never sends the message twice.",
        },
      ],
    },
    proceso: {
      cap: "Implementation",
      titulo: "Five stages, with a human gate before going live",
      sub: "You work on the first and the fourth. The rest is ours.",
      pasos: [
        { n: "01", titulo: "Diagnosis", desc: "We review where inquiries are leaking today: uncovered hours, unanswered forms, follow-up that never happens. You get the analysis, no strings attached.", quien: "Us · 1 meeting" },
        { n: "02", titulo: "Knowledge load", desc: "We load services, areas, hours, policies, prices it may quote and FAQs. The agent can only state what ends up here.", quien: "You provide the information" },
        { n: "03", titulo: "Testing", desc: "We run real cases from your business against the agent before it talks to anyone. Results are reviewed one by one.", quien: "Us" },
        { n: "04", titulo: "Approval and go-live", desc: "It starts in supervised mode: you review every reply before it goes out. When you're convinced, it activates. It never activates on its own.", quien: "You approve" },
        { n: "05", titulo: "Optimization", desc: "A report with the inquiries that came in, the ones that got booked, and the questions the agent couldn't answer. That's what tunes the knowledge base.", quien: "Us · ongoing" },
      ],
    },
    seguridad: {
      cap: "Security and data",
      titulo: "How your clients' data is handled",
      sub: "It's the question any serious company asks before signing. Here are the answers.",
      items: [
        { titulo: "Isolation per business", desc: "Every business has its data separated at the database level, with the business identifier required on every query. Automated tests verify that one business cannot read another's data." },
        { titulo: "Encrypted credentials", desc: "Any credential you load is stored encrypted with AES-256-GCM. It is never shown in plain text anywhere, not even in the dashboard." },
        { titulo: "Nothing is lost before processing", desc: "The inquiry is stored the moment it arrives, before the model processes it. If something fails afterwards, it stays on record and a recovery process picks it up." },
        { titulo: "The agent doesn't make things up", desc: "Knowledge enters the model delimited and labelled as information, never as instructions. Lead details are accepted only if they appear verbatim in what the person wrote." },
        { titulo: "Full audit trail", desc: "Every action is recorded: who did what, to which record, and when. Errors go to a queue they can be retried from." },
        { titulo: "Deletion on request", desc: "If someone asks you to delete their data, there's a function that removes it across all their records." },
      ],
    },
    limites: {
      cap: "Scope",
      titulo: "What it does NOT do",
      sub: "We'd rather say it now than in week three.",
      items: [
        "It does not invent prices. If you didn't load a price list, it is forbidden from discussing prices.",
        "It does not replace your team: it handles first contact and hands off when a person is needed.",
        "It does not generate new demand on its own. It answers and converts what already reaches you.",
        "It does not take phone calls yet. Chat, forms and email.",
        "It does not sync with Google Calendar yet: availability comes from the hours you load.",
      ],
    },
    integraciones: {
      cap: "Integrations",
      titulo: "It installs on top of what you already have",
      listo: "Available",
      pronto: "In development",
      items: [
        { nombre: "Website (one line of code)", estado: "listo" },
        { nombre: "Contact forms", estado: "listo" },
        { nombre: "Inbound email", estado: "listo" },
        { nombre: "Team alerts", estado: "listo" },
        { nombre: "Outbound webhooks", estado: "listo" },
        { nombre: "Google Calendar", estado: "pronto" },
        { nombre: "External CRM", estado: "pronto" },
        { nombre: "Phone answering", estado: "pronto" },
      ],
    },
    incluye: {
      cap: "The service",
      titulo: "What's included",
      sub: "Pricing is defined in the diagnosis, based on inquiry volume and connected channels.",
      columnas: [
        {
          titulo: "Implementation",
          items: [
            "Diagnosis of where inquiries are lost",
            "Loading your knowledge base",
            "Qualification rules configuration",
            "Testing with real cases from your business",
            "Installation on your site",
          ],
        },
        {
          titulo: "Monthly operation",
          items: [
            "Inquiry handling across every connected channel",
            "Automatic qualification and follow-up",
            "Dashboard with conversations, leads and appointments",
            "Alerts to your team when a good lead comes in",
            "Periodic report of what came in and what converted",
          ],
        },
        {
          titulo: "Support",
          items: [
            "Knowledge base adjustments",
            "Review of questions it couldn't answer",
            "Monitoring of integration health",
            "A direct channel, no ticket system",
          ],
        },
      ],
      nota: "No percentage of your sales. An implementation cost and a monthly fee, both defined before we start.",
    },
    faq: {
      cap: "Frequently asked",
      titulo: "What people ask before signing",
      items: [
        {
          p: "What does it cost?",
          r: "It depends on inquiry volume and how many channels you connect. It's defined in the diagnosis, which is free. What we can say upfront: there's an implementation cost and a monthly fee, and we don't take a percentage of your sales.",
        },
        {
          p: "How long does implementation take?",
          r: "Days, not months. Our part is fast; yours sets the clock. We need services, areas, hours, policies and about ten FAQs with their real answers. With that in hand, it's installed and tested within the same week.",
        },
        {
          p: "What happens if the agent doesn't know something?",
          r: "It says so and hands off to a person on your team with the full conversation. It can only state what's in your knowledge base; everything else goes to a human. That's the correct behavior, not a failure.",
        },
        {
          p: "Can I step into a conversation?",
          r: "Yes. From the dashboard you see every conversation live. You can reply yourself, pause the AI on that thread, or assign it to someone on your team. Control stays with you at all times.",
        },
        {
          p: "Will my clients' data be mixed with other companies'?",
          r: "No. Each business has its data isolated at the database level, with the business identifier required on every query, and automated tests verify that isolation.",
        },
        {
          p: "Do I need to change my website or CRM?",
          r: "No. It's one line of code on your site, whatever it's built with. Your forms and inquiries inbox feed into the same system without modification.",
        },
        {
          p: "Does the client know they're talking to an AI?",
          r: "Yes. The widget states it explicitly and the agent won't lie if asked. Hiding it would be a trust problem, and in several jurisdictions a legal one too.",
        },
        {
          p: "What if I want to cancel?",
          r: "The knowledge base we build is yours and you take it with you. Commitment and cancellation terms are put in writing in the scope document, before we start.",
        },
      ],
    },
    cierre: {
      titulo: "Let's start by measuring what's being lost",
      sub: "The diagnosis reviews your intake channels and shows you where the demand you already have goes cold. It's free and commits you to nothing.",
      cta: "Get the diagnosis",
      nota: "We reply the same day, in Spanish or English.",
    },
    pie: {
      descripcion:
        "JOTA Revenue Engine. A system that answers, qualifies, books and follows up on every inquiry your business receives.",
      secciones: [
        {
          titulo: "Product",
          links: [
            { texto: "The system", href: "#sistema" },
            { texto: "Implementation", href: "#proceso" },
            { texto: "Integrations", href: "#integraciones" },
            { texto: "What's included", href: "#incluye" },
          ],
        },
        {
          titulo: "Trust",
          links: [
            { texto: "Security and data", href: "#seguridad" },
            { texto: "What it doesn't do", href: "#limites" },
            { texto: "FAQ", href: "#faq" },
          ],
        },
        {
          titulo: "Company",
          links: [
            { texto: "Get a diagnosis", href: "#cierre" },
            { texto: "The app", href: "/app" },
            { texto: "Sign in", href: "/acceder" },
          ],
        },
      ],
      legal: "JOTA agency · Maui, Hawaii · Español / English",
    },
  },
};
