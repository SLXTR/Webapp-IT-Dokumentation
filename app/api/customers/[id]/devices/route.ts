import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/guards";
import { canRead, canWrite } from "@/lib/rbac";

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
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);

  const where: Prisma.DeviceWhereInput = {
    customerId: params.id,
    OR: q
      ? [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { hostname: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { ip: { contains: q, mode: Prisma.QueryMode.insensitive } }
        ]
      : undefined
  };

  const [items, total] = await Promise.all([
    prisma.device.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.device.count({ where })
  ]);

  return NextResponse.json({ ok: true, items, total, page, pageSize });
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
  const device = await prisma.device.create({
    data: {
      customerId: params.id,
      name: body.name,
      type: body.type,
      vendor: body.vendor,
      model: body.model,
      serial: body.serial,
      hostname: body.hostname,
      ip: body.ip,
      mac: body.mac,
      notes: body.notes,
      tags: body.tags ?? []
    }
  });
  return NextResponse.json({ ok: true, device });
}
