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
  const pages = await prisma.page.findMany({
    where: { customerId: params.id },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json({ ok: true, pages });
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
  const page = await prisma.page.create({
    data: {
      customerId: params.id,
      title: body.title,
      content: body.content ?? {}
    }
  });
  return NextResponse.json({ ok: true, page });
}
