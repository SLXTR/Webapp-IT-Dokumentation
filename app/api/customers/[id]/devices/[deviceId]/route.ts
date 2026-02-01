import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getUserRole } from "../../../../../../lib/guards";
import { canRead, canWrite } from "../../../../../../lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string; deviceId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const device = await prisma.device.findFirst({
    where: { id: params.deviceId, customerId: params.id },
    include: { portLinks: { include: { switchPort: true } } }
  });
  return NextResponse.json({ ok: true, device });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; deviceId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const device = await prisma.device.update({
    where: { id: params.deviceId },
    data: body
  });
  return NextResponse.json({ ok: true, device });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; deviceId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  await prisma.device.delete({ where: { id: params.deviceId } });
  return NextResponse.json({ ok: true });
}
