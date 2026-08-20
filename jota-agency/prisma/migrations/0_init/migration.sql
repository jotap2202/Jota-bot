-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "empresa" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consulta" TEXT NOT NULL,
    "resultado" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospecto" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "rubro" TEXT NOT NULL,
    "ciudad" TEXT,
    "web" TEXT,
    "telefono" TEXT,
    "contacto" TEXT,
    "email" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'nuevo',
    "notas" TEXT,
    "fuente" TEXT,
    "proximoContacto" TIMESTAMP(3),
    "cargo" TEXT,
    "industria" TEXT,
    "pais" TEXT DEFAULT 'US',
    "linkedin" TEXT,
    "empleados" INTEGER,
    "ingresosEstimados" INTEGER,
    "servicioInteres" TEXT,
    "responsable" TEXT,
    "ultimoContacto" TIMESTAMP(3),
    "valorEstimado" INTEGER NOT NULL DEFAULT 0,
    "probabilidad" INTEGER NOT NULL DEFAULT 10,
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreDetalle" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "contacto" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "servicio" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precioMensual" INTEGER NOT NULL,
    "costoOperativo" INTEGER NOT NULL DEFAULT 0,
    "estadoContrato" TEXT NOT NULL DEFAULT 'activo',
    "proximaFactura" TIMESTAMP(3),
    "reunionesLogradas" INTEGER NOT NULL DEFAULT 0,
    "leadsEntregados" INTEGER NOT NULL DEFAULT 0,
    "satisfaccion" INTEGER NOT NULL DEFAULT 3,
    "salud" TEXT NOT NULL DEFAULT 'healthy',
    "ultimoContacto" TIMESTAMP(3),
    "notas" TEXT,
    "proximosPasos" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "servicio" TEXT NOT NULL,
    "canal" TEXT,
    "recurrente" BOOLEAN NOT NULL DEFAULT false,
    "cobrado" BOOLEAN NOT NULL DEFAULT true,
    "clienteId" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" TEXT NOT NULL,
    "canal" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objetivo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'mensual',
    "metrica" TEXT NOT NULL,
    "valorInicial" INTEGER NOT NULL DEFAULT 0,
    "valorObjetivo" INTEGER NOT NULL,
    "valorManual" INTEGER,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "responsable" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objetivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campania" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "publico" TEXT,
    "industria" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fin" TIMESTAMP(3),
    "presupuesto" INTEGER NOT NULL DEFAULT 0,
    "gastado" INTEGER NOT NULL DEFAULT 0,
    "enviados" INTEGER NOT NULL DEFAULT 0,
    "respuestas" INTEGER NOT NULL DEFAULT 0,
    "respuestasPositivas" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "reuniones" INTEGER NOT NULL DEFAULT 0,
    "ventas" INTEGER NOT NULL DEFAULT 0,
    "ingresos" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'draft',
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campania_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TareaCeo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "prioridad" TEXT NOT NULL DEFAULT 'medium',
    "categoria" TEXT NOT NULL DEFAULT 'sales',
    "vence" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "impacto" INTEGER NOT NULL DEFAULT 0,
    "responsable" TEXT,
    "prospectoId" TEXT,
    "clienteId" TEXT,
    "campaniaId" TEXT,
    "objetivoId" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TareaCeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "detalle" TEXT,
    "url" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL,
    "prospectoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,
    "autor" TEXT,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clavePublica" TEXT NOT NULL,
    "secretoWebhook" TEXT NOT NULL,
    "nombreNegocio" TEXT NOT NULL,
    "descripcion" TEXT,
    "sitioWeb" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'onboarding',
    "zonaHoraria" TEXT NOT NULL DEFAULT 'Pacific/Honolulu',
    "idioma" TEXT NOT NULL DEFAULT 'en',
    "nombreAgente" TEXT NOT NULL DEFAULT 'Ava',
    "presentacion" TEXT,
    "tono" TEXT NOT NULL DEFAULT 'profesional',
    "largoRespuesta" TEXT NOT NULL DEFAULT 'corta',
    "usaEmojis" BOOLEAN NOT NULL DEFAULT false,
    "firmaEmail" TEXT,
    "servicios" TEXT NOT NULL DEFAULT '',
    "areaServicio" TEXT,
    "reglasPrecio" TEXT NOT NULL DEFAULT '',
    "politicas" TEXT NOT NULL DEFAULT '',
    "horarios" JSONB,
    "prohibido" TEXT NOT NULL DEFAULT '',
    "modo" TEXT NOT NULL DEFAULT 'supervisado',
    "modoPorCanal" JSONB,
    "confianzaMinima" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "umbralAviso" INTEGER NOT NULL DEFAULT 70,
    "requiereAprobacion" TEXT NOT NULL DEFAULT 'enviar_presupuesto
ofrecer_descuento
responder_queja_grave',
    "reglasHandoff" TEXT NOT NULL DEFAULT '',
    "slaRespuestaMin" INTEGER NOT NULL DEFAULT 15,
    "canales" TEXT NOT NULL DEFAULT 'website_chat
web_form
email',
    "secuenciaHoras" INTEGER[] DEFAULT ARRAY[24, 72, 168]::INTEGER[],
    "ajustes" JSONB,
    "esDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantIntegration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "config" JSONB,
    "cifrado" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'sin_configurar',
    "ultimoError" TEXT,
    "verificadaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantMember" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'owner',
    "recibeAvisos" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "empresa" TEXT,
    "sitioWeb" TEXT,
    "ubicacion" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'en',
    "zonaHoraria" TEXT,
    "consentimiento" TEXT NOT NULL DEFAULT 'desconocido',
    "noContactar" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "hiloExterno" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'abierta',
    "asignadoA" TEXT,
    "iaActiva" BOOLEAN NOT NULL DEFAULT true,
    "intencion" TEXT,
    "intenciones" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sentimiento" TEXT,
    "urgencia" TEXT,
    "resumen" TEXT,
    "ultimoMensajeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "remitente" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "formato" TEXT NOT NULL DEFAULT 'texto',
    "idExterno" TEXT,
    "claveIdempotencia" TEXT,
    "entrega" TEXT NOT NULL DEFAULT 'entregado',
    "generadoPorIa" BOOLEAN NOT NULL DEFAULT false,
    "confianza" DOUBLE PRECISION,
    "fuentes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tokensEntrada" INTEGER NOT NULL DEFAULT 0,
    "tokensSalida" INTEGER NOT NULL DEFAULT 0,
    "estadoFinal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "conversationId" TEXT,
    "servicio" TEXT,
    "problema" TEXT,
    "resultado" TEXT,
    "presupuesto" INTEGER,
    "plazo" TEXT,
    "ubicacion" TEXT,
    "tamanioEmpresa" TEXT,
    "autoridad" TEXT,
    "mejorHorario" TEXT,
    "canalPreferido" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "confianza" TEXT NOT NULL DEFAULT 'baja',
    "scoreDetalle" JSONB,
    "estado" TEXT NOT NULL DEFAULT 'nuevo',
    "ownerId" TEXT,
    "proximaAccion" TEXT,
    "seguirEl" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "leadId" TEXT,
    "conversationId" TEXT,
    "proveedor" TEXT NOT NULL DEFAULT 'interno',
    "idExterno" TEXT,
    "titulo" TEXT NOT NULL,
    "motivo" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "zonaHoraria" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'agendada',
    "urlReunion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeSource" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT,
    "contenido" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "ultimoError" TEXT,
    "sincronizadaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "indice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "paso" INTEGER NOT NULL,
    "programadoEn" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivoCancelacion" TEXT,
    "enviadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOutbox" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "para" TEXT NOT NULL,
    "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "responderA" TEXT,
    "asunto" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "inReplyTo" TEXT,
    "references" TEXT,
    "plantilla" TEXT NOT NULL,
    "clase" TEXT NOT NULL DEFAULT 'transaccional',
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "ultimoError" TEXT,
    "enviadoEn" TIMESTAMP(3),
    "claveIdempotencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suppression" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "detalle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suppression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "conversationId" TEXT,
    "accion" TEXT NOT NULL,
    "propuesta" TEXT NOT NULL,
    "datos" JSONB,
    "motivo" TEXT,
    "confianza" DOUBLE PRECISION,
    "riesgos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "resueltaPor" TEXT,
    "resueltaEn" TIMESTAMP(3),
    "textoFinal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "workflow" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ok',
    "mensajeError" TEXT,
    "referencia" TEXT,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "proximoIntento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "actorTipo" TEXT NOT NULL,
    "actorId" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "metadatos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Prospecto_estado_idx" ON "Prospecto"("estado");

-- CreateIndex
CREATE INDEX "Prospecto_proximoContacto_idx" ON "Prospecto"("proximoContacto");

-- CreateIndex
CREATE INDEX "Prospecto_score_idx" ON "Prospecto"("score");

-- CreateIndex
CREATE INDEX "Prospecto_esDemo_idx" ON "Prospecto"("esDemo");

-- CreateIndex
CREATE INDEX "Cliente_salud_idx" ON "Cliente"("salud");

-- CreateIndex
CREATE INDEX "Cliente_esDemo_idx" ON "Cliente"("esDemo");

-- CreateIndex
CREATE INDEX "Ingreso_fecha_idx" ON "Ingreso"("fecha");

-- CreateIndex
CREATE INDEX "Ingreso_esDemo_idx" ON "Ingreso"("esDemo");

-- CreateIndex
CREATE INDEX "Gasto_fecha_idx" ON "Gasto"("fecha");

-- CreateIndex
CREATE INDEX "Gasto_esDemo_idx" ON "Gasto"("esDemo");

-- CreateIndex
CREATE INDEX "Objetivo_periodoFin_idx" ON "Objetivo"("periodoFin");

-- CreateIndex
CREATE INDEX "Objetivo_esDemo_idx" ON "Objetivo"("esDemo");

-- CreateIndex
CREATE INDEX "Campania_estado_idx" ON "Campania"("estado");

-- CreateIndex
CREATE INDEX "Campania_esDemo_idx" ON "Campania"("esDemo");

-- CreateIndex
CREATE INDEX "TareaCeo_estado_vence_idx" ON "TareaCeo"("estado", "vence");

-- CreateIndex
CREATE INDEX "TareaCeo_esDemo_idx" ON "TareaCeo"("esDemo");

-- CreateIndex
CREATE INDEX "Notificacion_leida_createdAt_idx" ON "Notificacion"("leida", "createdAt");

-- CreateIndex
CREATE INDEX "Notificacion_esDemo_idx" ON "Notificacion"("esDemo");

-- CreateIndex
CREATE INDEX "Actividad_prospectoId_createdAt_idx" ON "Actividad"("prospectoId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_clavePublica_key" ON "Tenant"("clavePublica");

-- CreateIndex
CREATE INDEX "Tenant_estado_idx" ON "Tenant"("estado");

-- CreateIndex
CREATE INDEX "Tenant_esDemo_idx" ON "Tenant"("esDemo");

-- CreateIndex
CREATE INDEX "TenantIntegration_tenantId_estado_idx" ON "TenantIntegration"("tenantId", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "TenantIntegration_tenantId_tipo_key" ON "TenantIntegration"("tenantId", "tipo");

-- CreateIndex
CREATE INDEX "TenantMember_tenantId_idx" ON "TenantMember"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantMember_tenantId_email_key" ON "TenantMember"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Contact_tenantId_telefono_idx" ON "Contact"("tenantId", "telefono");

-- CreateIndex
CREATE INDEX "Contact_tenantId_createdAt_idx" ON "Contact"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_tenantId_email_key" ON "Contact"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Conversation_tenantId_estado_ultimoMensajeAt_idx" ON "Conversation"("tenantId", "estado", "ultimoMensajeAt");

-- CreateIndex
CREATE INDEX "Conversation_tenantId_ultimoMensajeAt_idx" ON "Conversation"("tenantId", "ultimoMensajeAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_tenantId_canal_hiloExterno_key" ON "Conversation"("tenantId", "canal", "hiloExterno");

-- CreateIndex
CREATE INDEX "Message_tenantId_conversationId_createdAt_idx" ON "Message"("tenantId", "conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_tenantId_direccion_estadoFinal_createdAt_idx" ON "Message"("tenantId", "direccion", "estadoFinal", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Message_tenantId_claveIdempotencia_key" ON "Message"("tenantId", "claveIdempotencia");

-- CreateIndex
CREATE INDEX "Lead_tenantId_estado_score_idx" ON "Lead"("tenantId", "estado", "score");

-- CreateIndex
CREATE INDEX "Lead_tenantId_createdAt_idx" ON "Lead"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_tenantId_seguirEl_idx" ON "Lead"("tenantId", "seguirEl");

-- CreateIndex
CREATE INDEX "Appointment_tenantId_inicio_idx" ON "Appointment"("tenantId", "inicio");

-- CreateIndex
CREATE INDEX "Appointment_tenantId_estado_inicio_idx" ON "Appointment"("tenantId", "estado", "inicio");

-- CreateIndex
CREATE INDEX "KnowledgeSource_tenantId_estado_idx" ON "KnowledgeSource"("tenantId", "estado");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_tenantId_sourceId_orden_idx" ON "KnowledgeChunk"("tenantId", "sourceId", "orden");

-- CreateIndex
CREATE INDEX "FollowUp_tenantId_estado_programadoEn_idx" ON "FollowUp"("tenantId", "estado", "programadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "FollowUp_tenantId_leadId_paso_key" ON "FollowUp"("tenantId", "leadId", "paso");

-- CreateIndex
CREATE UNIQUE INDEX "EmailOutbox_messageId_key" ON "EmailOutbox"("messageId");

-- CreateIndex
CREATE INDEX "EmailOutbox_tenantId_estado_createdAt_idx" ON "EmailOutbox"("tenantId", "estado", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailOutbox_tenantId_claveIdempotencia_key" ON "EmailOutbox"("tenantId", "claveIdempotencia");

-- CreateIndex
CREATE INDEX "Suppression_tenantId_idx" ON "Suppression"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Suppression_tenantId_email_key" ON "Suppression"("tenantId", "email");

-- CreateIndex
CREATE INDEX "ApprovalRequest_tenantId_estado_createdAt_idx" ON "ApprovalRequest"("tenantId", "estado", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowEvent_tenantId_workflow_createdAt_idx" ON "WorkflowEvent"("tenantId", "workflow", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowEvent_tipo_proximoIntento_idx" ON "WorkflowEvent"("tipo", "proximoIntento");

-- CreateIndex
CREATE INDEX "WorkflowEvent_correlationId_idx" ON "WorkflowEvent"("correlationId");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_entidad_entidadId_idx" ON "AuditLog"("tenantId", "entidad", "entidadId");

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaCeo" ADD CONSTRAINT "TareaCeo_prospectoId_fkey" FOREIGN KEY ("prospectoId") REFERENCES "Prospecto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaCeo" ADD CONSTRAINT "TareaCeo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaCeo" ADD CONSTRAINT "TareaCeo_campaniaId_fkey" FOREIGN KEY ("campaniaId") REFERENCES "Campania"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaCeo" ADD CONSTRAINT "TareaCeo_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "Objetivo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_prospectoId_fkey" FOREIGN KEY ("prospectoId") REFERENCES "Prospecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantIntegration" ADD CONSTRAINT "TenantIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantMember" ADD CONSTRAINT "TenantMember_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_asignadoA_fkey" FOREIGN KEY ("asignadoA") REFERENCES "TenantMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "TenantMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeSource" ADD CONSTRAINT "KnowledgeSource_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KnowledgeSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suppression" ADD CONSTRAINT "Suppression_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEvent" ADD CONSTRAINT "WorkflowEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

