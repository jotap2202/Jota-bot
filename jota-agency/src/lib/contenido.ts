export type Idioma = "es" | "en";

/**
 * La web habla inglés por defecto; el castellano es la alternativa que el
 * visitante elige con el toggle. La elección se guarda en esta cookie (y no
 * en localStorage) para que las páginas renderizadas en el servidor
 * —/acceder, /diagnostico— también puedan respetarla.
 */
export const IDIOMA_POR_DEFECTO: Idioma = "en";
export const COOKIE_IDIOMA = "jota_lang";

/** Mail de contacto de la agencia. Cambiándolo acá se actualiza en toda la web. */
export const EMAIL_CONTACTO = "jotaagency@jotaagency.org";

export type Contenido = {
  skip: string;
  nav: { sistema: string; proceso: string; faq: string; cta: string };
  hero: { eyebrow: string; lineas: string[]; sub: string; cta1: string; cta2: string };
  marquee: string;
  stats: { n: number; suf: string; label: string }[];
  sectores: { cap: string; titulo: string; items: string[] };
  manif: { cap: string; titulo: string; texto: string; imgCap: string };
  manif2: { cap: string; titulo: string; texto: string; imgCap: string };
  /** El producto central: el Revenue Engine. Lo que hace el agente, en orden. */
  sistema: {
    cap: string;
    titulo: string;
    sub: string;
    piezas: { nombre: string; cap: string; desc: string }[];
  };
  /** Dónde se enchufa. Solo lo que funciona hoy; lo que no, dice que no. */
  integraciones: {
    cap: string;
    titulo: string;
    sub: string;
    items: { nombre: string; estado: "listo" | "pronto"; desc: string }[];
    nota: string;
  };
  /** Qué pasa cuando la IA no sabe, y qué no puede hacer nunca. */
  seguridad: {
    cap: string;
    titulo: string;
    sub: string;
    puntos: { titulo: string; desc: string }[];
  };
  serviciosCap: string;
  servTitulo: string;
  servSub: string;
  servicios: { nombre: string; cap: string; desc: string }[];
  procTitulo: string;
  procSub: string;
  pasos: { titulo: string; desc: string }[];
  garantia: { cap: string; texto: string; firma: string };
  /** Objeciones antes de pedir la llamada: precio, plazo, riesgo, control. */
  faq: { cap: string; titulo: string; items: { p: string; r: string }[] };
  diag: {
    eyebrow: string;
    titulo: string;
    sub: string;
    online: string;
    placeholder: string;
    boton: string;
    analizando: string;
    resultado: string;
    denuevo: string;
    descLabel: string;
    authTitulo: string;
    authSub: string;
    googleBtn: string;
    orSep: string;
    tabSignup: string;
    tabLogin: string;
    regNombre: string;
    regEmail: string;
    regEmpresa: string;
    regPass: string;
    signupBtn: string;
    loginBtn: string;
    regNota: string;
    regError: string;
    emailError: string;
    passError: string;
    loginError: string;
    conectado: string;
    ctaLlamada: string;
    errorConexion: string;
    empTitulo: string;
    empSub: string;
    empPlaceholder: string;
    empBoton: string;
    empError: string;
  };
  cierre: { lineas: string[]; sub: string; cta: string; nota: string; oEscribinos: string };
  footer: string;
  salir: string;
  asuntoMail: string;
  /** Textos que no se ven pero que lee un lector de pantalla. */
  a11y: { stats: string; imgNoche: string; imgMundo: string; panel: string };
};

export const T: Record<Idioma, Contenido> = {
  es: {
    skip: "Saltar al contenido",
    nav: { sistema: "El sistema", proceso: "Cómo funciona", faq: "Preguntas", cta: "Pedir diagnóstico" },
    hero: {
      eyebrow: "JOTA Revenue Engine — ES/EN",
      lineas: ["Cada consulta", "respondida, calificada", "y agendada."],
      sub: "Instalamos un sistema que atiende a todos los que te escriben —a cualquier hora—, averigua qué necesitan, los agenda y les hace seguimiento. Vos aparecés en la reunión.",
      cta1: "Pedir un diagnóstico gratis",
      cta2: "Ver cómo funciona",
    },
    marquee: "CADA CONSULTA RESPONDIDA — CADA LEAD CALIFICADO — CADA REUNIÓN AGENDADA — ",
    stats: [
      { n: 24, suf: "/7", label: "Cada interesado atendido, sin importar la hora" },
      { n: 78, suf: "%", label: "de los compradores le compra a quien responde primero" },
      { n: 15, suf: " min", label: "Es lo que dura la llamada que puede cambiar tu negocio" },
    ],
    sectores: {
      cap: "Confianza",
      titulo: "Pensado para negocios donde una consulta perdida se nota",
      items: ["Estudios contables", "Clínicas y salud", "Inmobiliarias", "Servicios profesionales", "Software / SaaS", "Agencias y estudios"],
    },
    manif: {
      cap: "El problema real",
      titulo: "No te faltan clientes. Te falta que te encuentren.",
      texto:
        "Hay empresas que hacen un trabajo excelente y aun así no crecen. No es por la calidad: es porque nadie sabe que existen, o porque cuando alguien pregunta, nadie responde a tiempo. Ahí es donde entramos.",
      imgCap: "Cada consulta sin responder es un cliente que se fue con otro.",
    },
    manif2: {
      cap: "La diferencia JOTA",
      titulo: "Trabajamos mientras dormís.",
      texto:
        "Nuestro sistema prospecta, contacta y responde las 24 horas. Cuando un cliente potencial escribe a medianoche, lo atendemos. Cuando te googlea, aparecés con la mejor cara. Vos te ocupás de tu negocio; nosotros, de llenarte la agenda.",
      imgCap: "El comprador que llega a las 11 de la noche también es tuyo.",
    },
    sistema: {
      cap: "El sistema",
      titulo: "Qué hace, exactamente",
      sub: "Cuatro cosas, en este orden, para cada persona que te escribe.",
      piezas: [
        { nombre: "Responde", cap: "En segundos, a cualquier hora", desc: "Chat en tu web, formularios y email entrante. Contesta con la información de tu negocio que vos cargaste, no con generalidades." },
        { nombre: "Califica", cap: "Y te dice por qué", desc: "Averigua qué necesitan, dónde están y para cuándo. Cada lead llega con un puntaje y con las razones de ese puntaje escritas." },
        { nombre: "Agenda", cap: "Sobre tu disponibilidad real", desc: "Ofrece horarios que existen y confirma la reunión. Nunca confirma algo que no se reservó." },
        { nombre: "Hace seguimiento", cap: "Hasta que responden o piden parar", desc: "Si alguien no contesta, insiste con criterio. Se corta solo cuando responden, agendan o piden que no los contacten más." },
      ],
    },
    integraciones: {
      cap: "Dónde se enchufa",
      titulo: "Se instala en lo que ya tenés",
      sub: "Sin cambiar tu web, sin migrar nada.",
      items: [
        { nombre: "Tu sitio web", estado: "listo", desc: "Una línea de código. Funciona en WordPress, Wix, Squarespace, Shopify o lo que uses." },
        { nombre: "Tus formularios", estado: "listo", desc: "Las consultas que ya recibís entran al mismo sistema." },
        { nombre: "Email", estado: "listo", desc: "Lee tu casilla de consultas y responde manteniendo el hilo." },
        { nombre: "Avisos a tu equipo", estado: "listo", desc: "Cuando entra un lead bueno, le llega a la persona que corresponde." },
        { nombre: "Google Calendar", estado: "pronto", desc: "Hoy la agenda sale de los horarios que cargaste. La sincronización con tu calendario está en camino." },
        { nombre: "Tu CRM", estado: "pronto", desc: "Salida por webhook para conectar el CRM que uses." },
      ],
      nota: "Si algo dice «pronto», es que todavía no está. No lo vendemos como hecho.",
    },
    seguridad: {
      cap: "Control",
      titulo: "Qué pasa cuando no sabe",
      sub: "Un agente que inventa es peor que no tener agente.",
      puntos: [
        { titulo: "Si no sabe, lo dice y te lo pasa", desc: "Solo afirma lo que está cargado en tu base de conocimiento. Cualquier otra cosa la deriva a una persona de tu equipo, con el contexto completo de la conversación." },
        { titulo: "Nunca inventa precios ni disponibilidad", desc: "Si no cargaste precios, tiene prohibido hablar de precios. No estima, no aproxima, no negocia descuentos." },
        { titulo: "Vos podés tomar el control cuando quieras", desc: "Desde el panel ves cada conversación en vivo, podés responder vos, pausar la IA en ese hilo o derivarla a alguien del equipo." },
        { titulo: "Los datos de cada negocio están separados", desc: "Cada cliente tiene sus datos aislados, y las credenciales que cargues se guardan cifradas. Nadie ve lo de nadie." },
      ],
    },
    serviciosCap: "Además",
    servTitulo: "Y si querés más demanda entrando",
    servSub: "Módulos que se suman al motor. Opcionales, se contratan aparte.",
    servicios: [
      { nombre: "Prospección B2B", cap: "Reuniones calificadas", desc: "Buscamos, contactamos y calificamos potenciales clientes uno por uno. Tu equipo solo se sienta con alguien que ya quiere escucharte." },
      { nombre: "LinkedIn del fundador", cap: "Autoridad que atrae", desc: "Convertimos el perfil del dueño en un imán de clientes: contenido y conversaciones que hacen que te escriban a vos." },
      { nombre: "Email en frío", cap: "Puertas que se abren", desc: "Campañas hacia empresas que hoy no saben que existís, con seguimiento automático hasta conseguir la respuesta." },
      { nombre: "Reseñas y reputación", cap: "Confianza al instante", desc: "Cuando te googlean, encuentran una empresa impecable: más reseñas, mejores respuestas, cero descuido." },
      { nombre: "Publicidad paga", cap: "Alcance medible", desc: "Campañas donde cada peso invertido se traduce en consultas de gente que busca lo que vendés." },
    ],
    procTitulo: "Cómo funciona",
    procSub: "Cinco pasos. Vos trabajás en el primero y en el cuarto.",
    pasos: [
      { titulo: "Diagnóstico", desc: "Revisamos por dónde se te escapan consultas hoy: horarios sin cubrir, formularios sin responder, llamadas perdidas. Te decimos qué encontramos, sin compromiso." },
      { titulo: "Instalación", desc: "Cargamos tus servicios, zonas, horarios, políticas y preguntas frecuentes. El agente solo puede afirmar lo que quede cargado acá." },
      { titulo: "Pruebas", desc: "Corremos casos reales de tu negocio antes de que hable con nadie. Arrancá en modo supervisado: vos aprobás cada respuesta hasta que te convenza." },
      { titulo: "Salida en vivo", desc: "Recién cuando lo aprobás, empieza a atender. Nunca se activa solo." },
      { titulo: "Optimización", desc: "Reporte semanal con lo que entró, lo que se agendó y las preguntas que no supo responder. Con eso se ajusta el conocimiento." },
    ],
    garantia: {
      cap: "Nuestra garantía",
      texto: "Acordamos un mínimo de reuniones por mes. Si no llegamos, el mes siguiente trabajamos gratis.",
      firma: "Así de seguros estamos del método.",
    },
    faq: {
      cap: "Antes de que preguntes",
      titulo: "Lo que todos quieren saber",
      items: [
        {
          p: "¿Cuánto sale?",
          r: "Depende del volumen de consultas que recibas y de cuántos canales conectes, así que no tiene sentido tirarte un número acá. Lo definimos en el diagnóstico, que es gratis y no te compromete a nada. Lo que sí te podemos decir de entrada: hay un costo de instalación y una mensualidad, sin porcentaje sobre tus ventas.",
        },
        {
          p: "¿Cuánto tarda en estar funcionando?",
          r: "Días, no meses. La parte que depende de nosotros es rápida. La que manda el reloj es la tuya: necesitamos tus servicios, zonas, horarios, políticas y unas diez preguntas frecuentes con sus respuestas reales. Si eso lo tenés a mano, se instala y se prueba en la misma semana.",
        },
        {
          p: "¿Y si la IA no sabe algo o dice una barbaridad?",
          r: "Solo puede afirmar lo que está cargado en tu base de conocimiento. Si le preguntan algo que no está, lo dice y deriva a una persona de tu equipo con toda la conversación. Y arranca en modo supervisado: vos aprobás cada respuesta hasta que te convenza. No se activa solo nunca.",
        },
        {
          p: "¿Reemplaza a mi equipo?",
          r: "No. Se ocupa del primer contacto y de lo repetitivo —responder a las 3 de la mañana, preguntar lo mismo de siempre, insistirle a quien no contestó— para que tu equipo hable con gente que ya está interesada. Cuando alguien pide hablar con una persona, se la pasa.",
        },
        {
          p: "¿Necesito cambiar mi web o mi CRM?",
          r: "No. Es una línea de código en tu sitio, funcione con lo que funcione. Tus formularios y tu casilla de consultas entran al mismo sistema sin tocarlos.",
        },
        {
          p: "¿Qué pasa con los datos de mis clientes?",
          r: "Los datos de cada negocio están aislados de los de los demás, y cualquier credencial que cargues se guarda cifrada. Podés pedir que borremos los datos de una persona cuando lo necesites.",
        },
        {
          p: "¿Y si no funciona?",
          r: "La base de conocimiento que armamos es tuya y te la llevás. Las condiciones de permanencia y de baja las dejamos por escrito antes de arrancar, en el mismo documento donde va el alcance: nada de eso queda a interpretación.",
        },
      ],
    },
    diag: {
      eyebrow: "Diagnóstico en vivo",
      titulo: "Contale a J sobre tu negocio",
      sub: "J es nuestro estratega con IA. Describí tu empresa y te devuelve un mini plan al instante.",
      online: "Estratega IA · en línea",
      descLabel: "Describí tu negocio",
      placeholder: "Ej: Tengo un estudio contable con 6 empleados. Los clientes llegan por recomendación pero hace un año que no crecemos…",
      boton: "Diagnosticar mi empresa",
      analizando: "J está analizando tu negocio…",
      resultado: "Diagnóstico de J",
      denuevo: "Hacer otro diagnóstico",
      authTitulo: "Accedé para ver tu diagnóstico",
      authSub: "Creá tu cuenta o entrá para que J genere tu plan y podamos enviártelo.",
      googleBtn: "Continuar con Google",
      orSep: "o con tu email",
      tabSignup: "Crear cuenta",
      tabLogin: "Entrar",
      regNombre: "Tu nombre",
      regEmail: "Tu email",
      regEmpresa: "Tu empresa",
      regPass: "Contraseña (mín. 6)",
      signupBtn: "Crear cuenta y ver diagnóstico",
      loginBtn: "Entrar y ver diagnóstico",
      regNota: "Al continuar aceptás que guardemos estos datos para contactarte sobre tu diagnóstico.",
      regError: "Completá nombre y empresa.",
      emailError: "Ingresá un email válido.",
      passError: "La contraseña debe tener al menos 6 caracteres.",
      loginError: "Email o contraseña incorrectos.",
      conectado: "Conectado como",
      ctaLlamada: "Agendar llamada de 15 min",
      errorConexion: "No pude conectar con J. Probá de nuevo.",
      empTitulo: "Una cosa más antes de empezar",
      empSub: "Decinos cómo se llama tu empresa para que J pueda darte un diagnóstico a medida.",
      empPlaceholder: "Nombre de tu empresa",
      empBoton: "Continuar",
      empError: "Escribí el nombre de tu empresa.",
    },
    cierre: {
      lineas: ["¿Cuántas consultas", "se te escaparon este mes?"],
      sub: "En quince minutos te decimos por dónde se está yendo la demanda que ya tenés. Sin compromiso.",
      cta: "Pedir el diagnóstico",
      nota: "Respondemos en el día, en español o inglés.",
      oEscribinos: "o escribinos a",
    },
    footer: "JOTA Revenue Engine · Español / English",
    salir: "Salir",
    asuntoMail: "Consulta desde la web de JOTA agency",
    a11y: {
      stats: "Números clave",
      imgNoche: "Un teléfono de noche: la consulta que espera respuesta",
      imgMundo: "Un mundo conectado las 24 horas",
      panel: "Acceso al panel de leads",
    },
  },
  en: {
    skip: "Skip to content",
    nav: { sistema: "The system", proceso: "How it works", faq: "FAQ", cta: "Get a diagnosis" },
    hero: {
      eyebrow: "JOTA Revenue Engine — ES/EN",
      lineas: ["Every inquiry", "answered, qualified", "and booked."],
      sub: "We install a system that answers everyone who contacts you — at any hour — finds out what they need, books them and follows up. You show up for the meeting.",
      cta1: "Get a free diagnosis",
      cta2: "See how it works",
    },
    marquee: "EVERY INQUIRY ANSWERED — EVERY LEAD QUALIFIED — EVERY MEETING BOOKED — ",
    stats: [
      { n: 24, suf: "/7", label: "Every lead answered, no matter the hour" },
      { n: 78, suf: "%", label: "of buyers buy from whoever responds first" },
      { n: 15, suf: " min", label: "The length of the call that can change your business" },
    ],
    sectores: {
      cap: "Trusted",
      titulo: "Built for businesses where one lost inquiry hurts",
      items: ["Accounting firms", "Clinics & health", "Real estate", "Professional services", "Software / SaaS", "Agencies & studios"],
    },
    manif: {
      cap: "The real problem",
      titulo: "You don't lack clients. You lack being found.",
      texto:
        "Some companies do excellent work and still don't grow. It's not quality: it's that nobody knows they exist, or that when someone asks, nobody answers in time. That's where we come in.",
      imgCap: "Every unanswered inquiry is a client who went with someone else.",
    },
    manif2: {
      cap: "The JOTA difference",
      titulo: "We work while you sleep.",
      texto:
        "Our system prospects, contacts and replies around the clock. When a potential client writes at midnight, we answer. When they google you, you show up at your best. You run your business; we fill your calendar.",
      imgCap: "The buyer who arrives at 11pm is yours too.",
    },
    sistema: {
      cap: "The system",
      titulo: "What it actually does",
      sub: "Four things, in this order, for everyone who contacts you.",
      piezas: [
        { nombre: "Answers", cap: "In seconds, at any hour", desc: "Chat on your site, forms and inbound email. It replies with your business information — the one you loaded — not with generalities." },
        { nombre: "Qualifies", cap: "And tells you why", desc: "It finds out what they need, where they are and by when. Every lead arrives with a score and the reasons for that score written out." },
        { nombre: "Books", cap: "Against real availability", desc: "It offers slots that exist and confirms the meeting. It never confirms something that wasn't booked." },
        { nombre: "Follows up", cap: "Until they reply or opt out", desc: "If someone goes quiet, it follows up with judgment. It stops on its own when they reply, book, or ask not to be contacted again." },
      ],
    },
    integraciones: {
      cap: "Where it plugs in",
      titulo: "It installs into what you already have",
      sub: "No rebuild, no migration.",
      items: [
        { nombre: "Your website", estado: "listo", desc: "One line of code. Works on WordPress, Wix, Squarespace, Shopify or whatever you use." },
        { nombre: "Your forms", estado: "listo", desc: "The inquiries you already receive enter the same system." },
        { nombre: "Email", estado: "listo", desc: "It reads your inquiries inbox and replies keeping the thread." },
        { nombre: "Alerts to your team", estado: "listo", desc: "When a good lead comes in, it reaches the right person." },
        { nombre: "Google Calendar", estado: "pronto", desc: "Today availability comes from the hours you loaded. Syncing with your calendar is on the way." },
        { nombre: "Your CRM", estado: "pronto", desc: "Outbound webhook to connect whichever CRM you use." },
      ],
      nota: "If something says \"soon\", it isn't there yet. We don't sell it as done.",
    },
    seguridad: {
      cap: "Control",
      titulo: "What happens when it doesn't know",
      sub: "An agent that makes things up is worse than no agent.",
      puntos: [
        { titulo: "If it doesn't know, it says so and hands off", desc: "It can only state what's in your knowledge base. Anything else goes to a person on your team, with the full conversation attached." },
        { titulo: "It never invents prices or availability", desc: "If you didn't load prices, it is forbidden from discussing prices. It doesn't estimate, approximate or negotiate discounts." },
        { titulo: "You can take over whenever you want", desc: "From the dashboard you see every conversation live, you can reply yourself, pause the AI on that thread, or hand it to someone on your team." },
        { titulo: "Each business's data is separated", desc: "Every client's data is isolated from the others, and any credentials you load are stored encrypted. Nobody sees anyone else's." },
      ],
    },
    serviciosCap: "Also",
    servTitulo: "And if you want more demand coming in",
    servSub: "Modules that sit on top of the engine. Optional, contracted separately.",
    servicios: [
      { nombre: "B2B Prospecting", cap: "Qualified meetings", desc: "We find, contact and qualify potential clients one by one. Your team just sits down with someone who already wants to listen." },
      { nombre: "Founder's LinkedIn", cap: "Authority that attracts", desc: "We turn the owner's profile into a client magnet: content and conversations that make prospects write to you." },
      { nombre: "Cold email", cap: "Doors that open", desc: "Campaigns to companies that don't know you exist yet, with automatic follow-up until we get the reply." },
      { nombre: "Reviews & reputation", cap: "Instant trust", desc: "When they google you, they find an impeccable company: more reviews, better replies, zero neglect." },
      { nombre: "Paid ads", cap: "Measurable reach", desc: "Campaigns where every dollar invested turns into inquiries from people looking for what you sell." },
    ],
    procTitulo: "How it works",
    procSub: "Five steps. You work on the first and the fourth.",
    pasos: [
      { titulo: "Audit", desc: "We look at where inquiries are leaking today: uncovered hours, unanswered forms, missed calls. We tell you what we found, no strings attached." },
      { titulo: "Install", desc: "We load your services, areas, hours, policies and FAQs. The agent can only state what ends up loaded here." },
      { titulo: "Test", desc: "We run real cases from your business before it talks to anyone. Start in supervised mode: you approve every reply until you're convinced." },
      { titulo: "Go live", desc: "Only once you approve does it start answering. It never activates on its own." },
      { titulo: "Optimize", desc: "Weekly report with what came in, what got booked, and the questions it couldn't answer. That's what tunes the knowledge base." },
    ],
    garantia: {
      cap: "Our guarantee",
      texto: "We agree on a minimum number of meetings per month. If we don't hit it, next month we work for free.",
      firma: "That's how confident we are in the method.",
    },
    faq: {
      cap: "Before you ask",
      titulo: "What everyone wants to know",
      items: [
        {
          p: "What does it cost?",
          r: "It depends on your inquiry volume and how many channels you connect, so throwing a number at you here would be meaningless. We define it in the diagnosis, which is free and commits you to nothing. What we can tell you upfront: there's a setup cost and a monthly fee, with no percentage of your sales.",
        },
        {
          p: "How long until it's running?",
          r: "Days, not months. Our part is fast. The clock is set by yours: we need your services, areas, hours, policies and about ten FAQs with their real answers. If you have that on hand, it gets installed and tested within the same week.",
        },
        {
          p: "What if the AI doesn't know something, or says something wrong?",
          r: "It can only state what's in your knowledge base. If it's asked something that isn't there, it says so and hands off to a person on your team with the whole conversation. And it starts in supervised mode: you approve every reply until you're convinced. It never activates on its own.",
        },
        {
          p: "Does it replace my team?",
          r: "No. It handles first contact and the repetitive part — answering at 3am, asking the same questions every time, chasing people who didn't reply — so your team talks to people who are already interested. When someone asks for a human, they get one.",
        },
        {
          p: "Do I need to change my website or my CRM?",
          r: "No. It's one line of code on your site, whatever it's built with. Your forms and your inquiries inbox feed into the same system without touching them.",
        },
        {
          p: "What happens to my clients' data?",
          r: "Each business's data is isolated from every other, and any credentials you load are stored encrypted. You can ask us to delete a person's data whenever you need to.",
        },
        {
          p: "What if it doesn't work?",
          r: "The knowledge base we build is yours and you take it with you. Terms for commitment and cancellation are put in writing before we start, in the same document as the scope: none of that is left to interpretation.",
        },
      ],
    },
    diag: {
      eyebrow: "Live diagnosis",
      titulo: "Tell J about your business",
      sub: "J is our AI strategist. Describe your company and get a mini plan instantly.",
      online: "AI strategist · online",
      descLabel: "Describe your business",
      placeholder: "E.g.: I run an accounting firm with 6 employees. Clients come through referrals but we haven't grown in a year…",
      boton: "Diagnose my company",
      analizando: "J is analyzing your business…",
      resultado: "J's diagnosis",
      denuevo: "Run another diagnosis",
      authTitulo: "Sign in to see your diagnosis",
      authSub: "Create your account or sign in so J can build your plan and we can send it to you.",
      googleBtn: "Continue with Google",
      orSep: "or with your email",
      tabSignup: "Create account",
      tabLogin: "Sign in",
      regNombre: "Your name",
      regEmail: "Your email",
      regEmpresa: "Your company",
      regPass: "Password (min. 6)",
      signupBtn: "Create account & see diagnosis",
      loginBtn: "Sign in & see diagnosis",
      regNota: "By continuing you agree that we store these details to contact you about your diagnosis.",
      regError: "Fill in name and company.",
      emailError: "Enter a valid email.",
      passError: "Password must be at least 6 characters.",
      loginError: "Wrong email or password.",
      conectado: "Signed in as",
      ctaLlamada: "Book a 15-min call",
      errorConexion: "Couldn't reach J. Please try again.",
      empTitulo: "One more thing before we start",
      empSub: "Tell us your company's name so J can tailor the diagnosis to you.",
      empPlaceholder: "Your company's name",
      empBoton: "Continue",
      empError: "Please enter your company's name.",
    },
    cierre: {
      lineas: ["How many inquiries", "slipped away this month?"],
      sub: "In fifteen minutes we'll show you where the demand you already have is leaking. No commitment.",
      cta: "Get the diagnosis",
      nota: "We reply the same day, in Spanish or English.",
      oEscribinos: "or write to us at",
    },
    footer: "JOTA Revenue Engine · Español / English",
    salir: "Sign out",
    asuntoMail: "Enquiry from the JOTA agency website",
    a11y: {
      stats: "Key numbers",
      imgNoche: "A phone at night: the inquiry waiting for an answer",
      imgMundo: "A world connected around the clock",
      panel: "Leads panel access",
    },
  },
};
