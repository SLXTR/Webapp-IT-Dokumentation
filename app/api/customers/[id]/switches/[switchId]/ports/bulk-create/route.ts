import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/guards";
import { canWrite } from "@/lib/rbac";

export async function POST(
  request: Request,
  { params }: { params: { id: string; switchId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await request.json();
  const count = Number(body.count ?? 24);
  const ports = Array.from({ length: count }).map((_, index) => ({
    switchId: params.switchId,
    portNumber: String(index + 1),
    poeCapable: index < Math.ceil(count / 2)
  }));

  await prisma.switchPort.createMany({
    data: ports,
    skipDuplicates: true
  });

  return NextResponse.json({ ok: true, created: ports.length });
}
