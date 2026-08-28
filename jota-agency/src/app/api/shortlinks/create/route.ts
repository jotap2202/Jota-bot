import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function generateShortCode(length: number = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: { url?: string; expiresAt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const url = String(body.url ?? "").trim();
  if (!url) {
    return Response.json({ error: "URL requerida" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return Response.json({ error: "URL inválida" }, { status: 400 });
  }

  let shortCode: string;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    shortCode = generateShortCode();
    attempts++;
    if (attempts > maxAttempts) {
      return Response.json({ error: "No se pudo generar un código único" }, { status: 500 });
    }
  } while (await prisma.shortLink.findUnique({ where: { shortCode } }));

  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  const shortLink = await prisma.shortLink.create({
    data: {
      userId: session.user.id,
      shortCode,
      originalUrl: url,
      expiresAt,
    },
  });

  return Response.json({ shortCode: shortLink.shortCode, url: shortLink.originalUrl });
}
