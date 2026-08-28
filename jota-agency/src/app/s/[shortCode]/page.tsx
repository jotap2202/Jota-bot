import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ shortCode: string }>;
}

export default async function ShortLinkPage({ params }: Props) {
  const { shortCode } = await params;

  const link = await prisma.shortLink.findUnique({
    where: { shortCode },
  });

  if (!link) {
    redirect("/");
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    redirect("/");
  }

  await prisma.shortLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}
