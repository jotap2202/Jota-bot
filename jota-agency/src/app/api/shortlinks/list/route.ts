import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") ?? "50"), 1), 100);
  const skip = Math.max(parseInt(url.searchParams.get("skip") ?? "0"), 0);

  const [shortLinks, total] = await Promise.all([
    prisma.shortLink.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.shortLink.count({
      where: { userId: session.user.id },
    }),
  ]);

  return Response.json({
    shortLinks: shortLinks.map((link) => ({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
    })),
    total,
    limit,
    skip,
  });
}
