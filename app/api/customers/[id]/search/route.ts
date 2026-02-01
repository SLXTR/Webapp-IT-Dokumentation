import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/guards";
import { canRead } from "@/lib/rbac";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  if (!q) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const [devices, switches, pages] = await Promise.all([
    prisma.device.findMany({
      where: { customerId: params.id, name: { contains: q, mode: "insensitive" } },
      take: 5
    }),
    prisma.switch.findMany({
      where: { customerId: params.id, name: { contains: q, mode: "insensitive" } },
      take: 5
    }),
    prisma.page.findMany({
      where: { customerId: params.id, title: { contains: q, mode: "insensitive" } },
      take: 5
    })
  ]);

  return NextResponse.json({ ok: true, results: { devices, switches, pages } });
}
