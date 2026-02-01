import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getUserRole } from "../../../../../lib/guards";
import { canRead, canWrite } from "../../../../../lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const switches = await prisma.switch.findMany({
    where: { customerId: params.id },
    include: { ports: true }
  });
  return NextResponse.json({ ok: true, switches });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const switchItem = await prisma.switch.create({
    data: {
      customerId: params.id,
      name: body.name,
      vendor: body.vendor,
      model: body.model,
      mgmtIp: body.mgmtIp,
      notes: body.notes
    }
  });
  return NextResponse.json({ ok: true, switch: switchItem });
}
