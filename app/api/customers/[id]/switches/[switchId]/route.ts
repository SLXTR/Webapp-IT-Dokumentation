import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/guards";
import { canRead } from "@/lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string; switchId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const switchItem = await prisma.switch.findFirst({
    where: { id: params.switchId, customerId: params.id },
    include: {
      ports: {
        include: {
          portLink: { include: { device: true } }
        },
        orderBy: { portNumber: "asc" }
      }
    }
  });
  return NextResponse.json({ ok: true, switch: switchItem });
}
