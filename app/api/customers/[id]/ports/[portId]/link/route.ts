import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getUserRole } from "../../../../../../lib/guards";
import { canWrite } from "../../../../../../lib/rbac";

export async function POST(
  request: Request,
  { params }: { params: { id: string; portId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const deviceId = body.deviceId as string | undefined;
  if (!deviceId) {
    return NextResponse.json({ ok: false, error: "deviceId fehlt" }, { status: 400 });
  }

  const port = await prisma.switchPort.findUnique({ where: { id: params.portId } });
  if (!port) {
    return NextResponse.json({ ok: false, error: "Port nicht gefunden" }, { status: 404 });
  }

  const link = await prisma.portLink.upsert({
    where: { switchPortId: params.portId },
    update: { deviceId },
    create: {
      customerId: params.id,
      switchPortId: params.portId,
      deviceId
    }
  });

  await prisma.switchPort.update({
    where: { id: params.portId },
    data: { status: "OCCUPIED" }
  });

  return NextResponse.json({ ok: true, link });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; portId: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  await prisma.portLink.deleteMany({
    where: { switchPortId: params.portId }
  });

  await prisma.switchPort.update({
    where: { id: params.portId },
    data: { status: "FREE" }
  });

  return NextResponse.json({ ok: true });
}
